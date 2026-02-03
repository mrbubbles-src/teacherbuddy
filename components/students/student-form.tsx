"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"

import { useAppStore } from "@/context/app-store"
import { normalizeStudentName, studentNameKey } from "@/lib/students"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function StudentForm() {
  const { state, actions } = useAppStore()
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importNotice, setImportNotice] = useState<string | null>(null)

  const addNames = (raw: string) => {
    const existingKeys = new Set(
      state.persisted.students.map((student) => studentNameKey(student.name))
    )
    const names = raw
      .split(",")
      .map((entry) => normalizeStudentName(entry))
      .filter(Boolean)

    const uniqueNames: string[] = []
    for (const entry of names) {
      const key = studentNameKey(entry)
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      uniqueNames.push(entry)
    }

    if (!uniqueNames.length) {
      return 0
    }

    for (const entry of uniqueNames) {
      actions.addStudent(entry)
    }

    return uniqueNames.length
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const addedCount = addNames(name)
    if (!addedCount) {
      setError("Enter at least one new student name.")
      return
    }
    setName("")
    setError(null)
    setImportNotice(null)
  }

  const handleFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const addedCount = addNames(text)
      if (!addedCount) {
        setImportError("No new students were found in that file.")
        setImportNotice(null)
      } else {
        setImportError(null)
        setImportNotice(`Imported ${addedCount} student${addedCount === 1 ? "" : "s"}.`)
      }
    } catch (error) {
      console.error("Failed to import students", error)
      setImportError("Could not read the file. Please try again.")
      setImportNotice(null)
    } finally {
      event.target.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Students</CardTitle>
        <CardDescription>
          Add students manually or paste a comma-separated list. You can also
          import a comma-separated .txt file below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field className="flex-1">
            <FieldLabel htmlFor="student-name">Student name</FieldLabel>
            <FieldContent>
              <Input
                id="student-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  if (error) setError(null)
                }}
                placeholder="e.g. Alex Johnson, Sam Lee, Priya Patel"
                aria-label="Student name"
              />
              <FieldDescription>
                Separate multiple names with commas. Names are case-insensitive.
              </FieldDescription>
              {error ? <FieldError>{error}</FieldError> : null}
            </FieldContent>
          </Field>
          <Button type="submit" className="sm:w-40">
            Add Student
          </Button>
        </form>
        <FieldSeparator>Import</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="student-import">Import from .txt</FieldLabel>
          <FieldContent>
            <Input
              id="student-import"
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileImport}
            />
            <FieldDescription>
              Upload a .txt file with comma-separated names.
            </FieldDescription>
            {importError ? <FieldError>{importError}</FieldError> : null}
            {importNotice ? (
              <p className="text-sm text-muted-foreground">{importNotice}</p>
            ) : null}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  )
}
