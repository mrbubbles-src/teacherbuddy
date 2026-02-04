"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { useAppStore } from "@/context/app-store"
import { formatStudentName } from "@/lib/students"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_GROUP_SIZE = "3"

type GroupMode = "none" | "grouped"

export default function ProjectListBuilder() {
  const { state, actions } = useAppStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [name, setName] = useState("")
  const [projectType, setProjectType] = useState("")
  const [description, setDescription] = useState("")
  const [groupMode, setGroupMode] = useState<GroupMode>("none")
  const [groupSize, setGroupSize] = useState(DEFAULT_GROUP_SIZE)
  const [includeExcluded, setIncludeExcluded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const students = useMemo(
    () =>
      [...state.persisted.students].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [state.persisted.students]
  )

  const visibleStudents = useMemo(
    () =>
      includeExcluded
        ? students
        : students.filter((student) => student.status === "active"),
    [includeExcluded, students]
  )

  useEffect(() => {
    if (!includeExcluded) {
      setSelectedIds((prev) =>
        prev.filter((id) => {
          const student = students.find((entry) => entry.id === id)
          return student?.status === "active"
        })
      )
    }
  }, [includeExcluded, students])

  const selectedCount = selectedIds.length

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedIds(visibleStudents.map((student) => student.id))
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleCreateList = () => {
    const trimmedName = name.trim()
    const trimmedType = projectType.trim()
    if (!trimmedName || !trimmedType) {
      setError("Enter both a project name and project type.")
      return
    }
    if (!selectedIds.length) {
      setError("Select at least one student to continue.")
      return
    }

    const orderedSelectedIds = visibleStudents
      .filter((student) => selectedIds.includes(student.id))
      .map((student) => student.id)

    if (!orderedSelectedIds.length) {
      setError("Select at least one student to continue.")
      return
    }

    let groups: string[][] = []
    if (groupMode === "grouped") {
      const size = Number.parseInt(groupSize, 10)
      if (!size || size < 2) {
        setError("Enter a group size of 2 or more.")
        return
      }
      for (let index = 0; index < orderedSelectedIds.length; index += size) {
        groups.push(orderedSelectedIds.slice(index, index + size))
      }
    }

    actions.createProjectList(
      trimmedName,
      trimmedType,
      description,
      orderedSelectedIds,
      groups
    )
    setName("")
    setProjectType("")
    setDescription("")
    setSelectedIds([])
    setGroupMode("none")
    setGroupSize(DEFAULT_GROUP_SIZE)
    setError(null)
    setNotice("Project list saved.")
  }

  if (!state.ui.isHydrated) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a project list</CardTitle>
        <CardDescription>
          Choose students from your roster and save them as a project-ready list
          or group set.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="project-name">Project name</FieldLabel>
              <FieldContent>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    if (error) setError(null)
                    if (notice) setNotice(null)
                  }}
                  placeholder="e.g. Ecosystem Posters"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="project-type">Project type</FieldLabel>
              <FieldContent>
                <Input
                  id="project-type"
                  value={projectType}
                  onChange={(event) => {
                    setProjectType(event.target.value)
                    if (error) setError(null)
                    if (notice) setNotice(null)
                  }}
                  placeholder="e.g. Presentation, Lab, Research"
                />
                <FieldDescription>
                  Use a type to organize lists by assignment style.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="project-description">Description</FieldLabel>
              <FieldContent>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value)
                    if (error) setError(null)
                    if (notice) setNotice(null)
                  }}
                  placeholder="Optional notes about the project or grouping."
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Grouping</FieldLabel>
              <FieldContent>
                <Select
                  value={groupMode}
                  onValueChange={(value) => setGroupMode(value as GroupMode)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Individual list</SelectItem>
                    <SelectItem value="grouped">Create groups</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Build a list of individual students or auto-group them.
                </FieldDescription>
              </FieldContent>
            </Field>
            {groupMode === "grouped" ? (
              <Field>
                <FieldLabel htmlFor="group-size">Group size</FieldLabel>
                <FieldContent>
                  <Input
                    id="group-size"
                    type="number"
                    min={2}
                    value={groupSize}
                    onChange={(event) => {
                      setGroupSize(event.target.value)
                      if (error) setError(null)
                      if (notice) setNotice(null)
                    }}
                  />
                  <FieldDescription>
                    Groups will be created in alphabetical order based on the
                    students you select.
                  </FieldDescription>
                </FieldContent>
              </Field>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/70 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Selected students</p>
              <p className="text-sm text-muted-foreground">
                {selectedCount}
                {selectedCount === 1 ? " student" : " students"} selected.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleSelectAll}
                disabled={!visibleStudents.length}
              >
                Select all
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleClearSelection}
                disabled={!selectedIds.length}
              >
                Clear
              </Button>
              <Link
                href="/students"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Add students
              </Link>
            </div>
            <FieldSeparator>Student roster</FieldSeparator>
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-excluded"
                checked={includeExcluded}
                onCheckedChange={(checked) => {
                  setIncludeExcluded(Boolean(checked))
                }}
              />
              <label
                htmlFor="include-excluded"
                className="text-sm text-muted-foreground"
              >
                Include absent students
              </label>
            </div>
            <div className="max-h-64 overflow-y-auto pr-2">
              <div className="flex flex-col gap-2">
                {visibleStudents.length ? (
                  visibleStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onCheckedChange={() => toggleSelection(student.id)}
                      />
                      <span className="font-medium">
                        {formatStudentName(student.name)}
                      </span>
                      {student.status === "excluded" ? (
                        <span className="text-xs text-muted-foreground">
                          Absent
                        </span>
                      ) : null}
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add students to your roster to build project lists.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {error ? <FieldError>{error}</FieldError> : null}
        {notice ? (
          <p className="text-sm text-muted-foreground">{notice}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleCreateList}>
            Save Project List
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
