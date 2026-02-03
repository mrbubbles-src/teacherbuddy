"use client"

import { useMemo, useState } from "react"

import { useAppStore } from "@/context/app-store"
import { formatStudentName } from "@/lib/students"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProjectListView() {
  const { state, actions } = useAppStore()
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [draftGroups, setDraftGroups] = useState<string[][]>([])

  const projectLists = useMemo(
    () =>
      [...state.persisted.projectLists].sort((a, b) =>
        b.createdAt - a.createdAt
      ),
    [state.persisted.projectLists]
  )

  const studentMap = useMemo(() => {
    return new Map(
      state.persisted.students.map((student) => [student.id, student])
    )
  }, [state.persisted.students])

  const startEditingGroups = (listId: string, groups: string[][]) => {
    setEditingListId(listId)
    setDraftGroups(groups.map((group) => [...group]))
  }

  const cancelEditing = () => {
    setEditingListId(null)
    setDraftGroups([])
  }

  const moveStudentToGroup = (studentId: string, nextGroupIndex: number) => {
    setDraftGroups((prev) => {
      const nextGroups = prev.map((group) =>
        group.filter((id) => id !== studentId)
      )
      if (!nextGroups[nextGroupIndex]) {
        return prev
      }
      nextGroups[nextGroupIndex] = [...nextGroups[nextGroupIndex], studentId]
      return nextGroups
    })
  }

  const handleSaveGroups = (listId: string) => {
    const list = projectLists.find((entry) => entry.id === listId)
    if (!list) return
    const updatedStudentIds = draftGroups.flat()
    actions.updateProjectList(
      list.id,
      list.name,
      list.projectType,
      list.description,
      updatedStudentIds,
      draftGroups
    )
    cancelEditing()
  }

  if (!state.ui.isHydrated) {
    return null
  }

  if (!projectLists.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved project lists</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your saved project lists will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {projectLists.map((list) => {
        const createdAt = new Date(list.createdAt).toLocaleDateString()
        const hasGroups = list.groups.length > 0
        const isEditing = editingListId === list.id
        const groupsToRender = isEditing ? draftGroups : list.groups
        return (
          <Card key={list.id}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle>{list.name}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{createdAt}</span>
                  <span aria-hidden="true">•</span>
                  <span>{list.projectType}</span>
                  {hasGroups ? (
                    <Badge variant="secondary">Grouped</Badge>
                  ) : (
                    <Badge variant="outline">Individual list</Badge>
                  )}
                </div>
                {list.description ? (
                  <p className="text-sm text-muted-foreground">
                    {list.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {hasGroups ? (
                  isEditing ? (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSaveGroups(list.id)}
                      >
                        Save groups
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEditingGroups(list.id, list.groups)}
                    >
                      Edit groups
                    </Button>
                  )
                ) : null}
                <AlertDialog>
                  <AlertDialogTrigger
                    render={<Button variant="ghost" size="sm" />}
                  >
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this project list?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the list from your saved projects.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => actions.deleteProjectList(list.id)}
                      >
                        Delete List
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {hasGroups ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {groupsToRender.map((group, index) => (
                    <div
                      key={`${list.id}-group-${index + 1}`}
                      className="rounded-lg border border-border/60 p-3"
                    >
                      <p className="text-sm font-semibold text-muted-foreground">
                        Group {index + 1}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.map((studentId) => {
                          const student = studentMap.get(studentId)
                          if (!student) return null
                          if (isEditing) {
                            return (
                              <div
                                key={studentId}
                                className="flex items-center gap-2 rounded-md border border-border/60 px-2 py-1 text-sm"
                              >
                                <span className="font-medium">
                                  {formatStudentName(student.name)}
                                </span>
                                <Select
                                  value={`${index}`}
                                  onValueChange={(value) =>
                                    moveStudentToGroup(
                                      studentId,
                                      Number.parseInt(value, 10)
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-28">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {groupsToRender.map((_, groupIndex) => (
                                      <SelectItem
                                        key={`${list.id}-group-${groupIndex + 1}`}
                                        value={`${groupIndex}`}
                                      >
                                        Group {groupIndex + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )
                          }
                          return (
                            <Badge key={studentId} variant="secondary">
                              {formatStudentName(student.name)}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {list.studentIds.map((studentId) => {
                    const student = studentMap.get(studentId)
                    if (!student) return null
                    return (
                      <Badge key={studentId} variant="secondary">
                        {formatStudentName(student.name)}
                      </Badge>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
