"use client"

import { useMemo, useState } from "react"
import { CopyIcon } from "lucide-react"

import { useAppStore } from "@/context/app-store"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import type { Student } from "@/lib/models"
import { formatStudentName } from "@/lib/students"
import GeneratorCardSkeleton from "@/components/loading/generator-card-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const DEFAULT_GROUP_SIZE = 3

export default function BreakoutGroupsCard() {
  const { state, actions } = useAppStore()
  const [groupSizeOverride, setGroupSizeOverride] = useState<number | null>(null)
  const { copy: copyAll, isCopied: isAllCopied, reset: resetAllCopy } = useCopyToClipboard()
  const { copy: copyGroup, isCopied: isGroupCopied, reset: resetGroupCopy } = useCopyToClipboard()

  const activeStudents = useMemo(
    () => state.persisted.students.filter((student) => student.status === "active"),
    [state.persisted.students]
  )

  const persistedGroups = state.persisted.breakoutGroups
  const groupSizeToUse = groupSizeOverride ?? persistedGroups?.groupSize ?? DEFAULT_GROUP_SIZE
  const canGenerateGroups = activeStudents.length > 0 && groupSizeToUse > 0

  const studentById = useMemo(() => {
    return new Map(state.persisted.students.map((student) => [student.id, student]))
  }, [state.persisted.students])

  const groups = useMemo((): Student[][] => {
    if (!persistedGroups) return []
    return persistedGroups.groupIds
      .map((group: string[]) =>
        group.map((id: string) => studentById.get(id)).filter(Boolean) as Student[]
      )
      .filter((group: Student[]) => group.length > 0)
  }, [persistedGroups, studentById])

  const groupSummary = useMemo(() => {
    return groups
      .map((group: Student[], index: number) => {
        const names = group.map((student: Student) => formatStudentName(student.name)).join(", ")
        return `Group ${index + 1}: ${names}`
      })
      .join("\n")
  }, [groups])

  const buildGroups = (students: Student[], size: number) => {
    const shuffled = [...students]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
    }
    const nextGroups: Student[][] = []
    for (let index = 0; index < shuffled.length; index += size) {
      nextGroups.push(shuffled.slice(index, index + size))
    }
    return nextGroups
  }

  if (!state.ui.isHydrated) {
    return <GeneratorCardSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Breakout Rooms
          <Badge variant="secondary">{activeStudents.length} students</Badge>
        </CardTitle>
        <CardDescription>
          Shuffle active students into randomized breakout groups.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-foreground">
            Group size
            <Input
              type="number"
              min={1}
              value={groupSizeToUse}
              onChange={(event) => {
                const nextValue = Number(event.target.value)
                if (!Number.isNaN(nextValue)) {
                  setGroupSizeOverride(nextValue)
                }
              }}
            />
          </label>
          <Button
            className="sm:w-44"
            disabled={!canGenerateGroups}
            onClick={() => {
              const size = Math.max(groupSizeToUse, 1)
              const nextGroups = buildGroups(activeStudents, size)
              actions.setBreakoutGroups({
                groupSize: size,
                groupIds: nextGroups.map((group) => group.map((student) => student.id)),
                createdAt: Date.now(),
              })
              setGroupSizeOverride(null)
              resetAllCopy()
              resetGroupCopy()
            }}
          >
            Generate Groups
          </Button>
          <Button
            variant="secondary"
            className="sm:w-44"
            disabled={!groups.length}
            onClick={() => copyAll(groupSummary)}
          >
            {isAllCopied ? "Copied!" : "Copy Groups"}
          </Button>
        </div>
        {groups.length ? (
          <div className="space-y-3">
            {groups.map((group: Student[], index: number) => (
              <div key={`group-${index}`} className="rounded-md border border-border/60 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Group {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      isGroupCopied
                        ? `Copied group ${index + 1}`
                        : `Copy group ${index + 1}`
                    }
                    onClick={() => {
                      const names = group
                        .map((student: Student) => formatStudentName(student.name))
                        .join(", ")
                      copyGroup(names)
                    }}
                  >
                    <CopyIcon />
                  </Button>
                </div>
                <p className="mt-1 text-sm text-foreground">
                  {group.map((student: Student) => formatStudentName(student.name)).join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Generate groups to see the breakout room list.
            </p>
            {!activeStudents.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Add or re-enable students to begin.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
