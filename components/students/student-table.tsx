"use client"

import { useMemo, useState } from "react"

import { useAppStore } from "@/context/app-store"
import { formatStudentName, normalizeStudentName, studentNameKey } from "@/lib/students"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function StudentTable() {
  const { state, actions } = useAppStore()
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editError, setEditError] = useState<string | null>(null)

  const students = useMemo(
    () =>
      [...state.persisted.students].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [state.persisted.students]
  )

  const activeCount = students.filter((student) => student.status === "active")
    .length

  const editingStudent = editingStudentId
    ? state.persisted.students.find((student) => student.id === editingStudentId) ??
      null
    : null

  const handleOpenEdit = (studentId: string) => {
    const student = state.persisted.students.find((item) => item.id === studentId)
    if (!student) return
    setEditingStudentId(student.id)
    setEditName(student.name)
    setEditError(null)
  }

  const handleCloseEdit = () => {
    setEditingStudentId(null)
    setEditName("")
    setEditError(null)
  }

  const handleSaveEdit = () => {
    const normalized = normalizeStudentName(editName)
    if (!normalized) {
      setEditError("Enter a student name to continue.")
      return
    }
    const nextKey = studentNameKey(normalized)
    const hasDuplicate = state.persisted.students.some(
      (student) =>
        student.id !== editingStudentId &&
        studentNameKey(student.name) === nextKey
    )
    if (hasDuplicate) {
      setEditError("That student already exists. Try a different name.")
      return
    }
    if (editingStudentId) {
      actions.updateStudent(editingStudentId, normalized)
    }
    handleCloseEdit()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              {students.length
                ? `${activeCount} active · ${
                    students.length - activeCount
                  } excluded`
                : "Your roster will appear here once students are added."}
            </CardDescription>
          </div>
          {students.length ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" size="sm" />}
              >
                Delete All
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all students?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove every student from the roster.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={actions.clearStudents}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {students.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const isExcluded = student.status === "excluded"
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatStudentName(student.name)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Added {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isExcluded ? "outline" : "secondary"}>
                        {isExcluded ? "Excluded" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Absent</Label>
                          <Checkbox
                            checked={isExcluded}
                            onCheckedChange={() =>
                              actions.toggleStudentExcluded(student.id)
                            }
                            aria-label={`Mark ${student.name} as absent`}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(student.id)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={<Button variant="ghost" size="sm" />}
                          >
                            Delete
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {student.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the student from the roster and
                                generator history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => actions.deleteStudent(student.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-base text-muted-foreground">
            Add students to start building your roster.
          </p>
        )}
      </CardContent>
      <AlertDialog
        open={!!editingStudentId}
        onOpenChange={(open) => {
          if (!open) handleCloseEdit()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit student</AlertDialogTitle>
            <AlertDialogDescription>
              Update the student name. Generator history is preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel htmlFor="edit-student-name">Student name</FieldLabel>
            <FieldContent>
              <Input
                id="edit-student-name"
                value={editName}
                onChange={(event) => {
                  setEditName(event.target.value)
                  if (editError) setEditError(null)
                }}
                placeholder="e.g. Alex Johnson"
              />
              {editError ? <FieldError>{editError}</FieldError> : null}
            </FieldContent>
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseEdit}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEdit} disabled={!editingStudent}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
