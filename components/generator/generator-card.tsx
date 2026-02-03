"use client"

import { useMemo, useState } from "react"

import { useAppStore } from "@/context/app-store"
import type { Student } from "@/lib/models"
import { formatStudentName } from "@/lib/students"
import GeneratorCardSkeleton from "@/components/loading/generator-card-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function GeneratorCard() {
  const { state, actions } = useAppStore()
  const [groupSize, setGroupSize] = useState(3)
  const [groups, setGroups] = useState<Student[][]>([])
  const [isCopied, setIsCopied] = useState(false)

  const activeStudents = useMemo(
    () => state.persisted.students.filter((student) => student.status === "active"),
    [state.persisted.students]
  )

  const remainingStudents = useMemo(
    () =>
      activeStudents.filter(
        (student) => !state.domain.generator.usedStudentIds.includes(student.id)
      ),
    [activeStudents, state.domain.generator.usedStudentIds]
  )

  const currentStudent = state.domain.generator.currentStudentId
    ? state.persisted.students.find(
        (student) => student.id === state.domain.generator.currentStudentId
      )
    : null

  const canGenerate = remainingStudents.length > 0
  const canGenerateGroups = activeStudents.length > 0 && groupSize > 0

  const groupSummary = useMemo(
    () =>
      groups
        .map((group, index) => {
          const names = group.map((student) => formatStudentName(student.name)).join(", ")
          return `Group ${index + 1}: ${names}`
        })
        .join("\n"),
    [groups]
  )

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
          Random Student Pick
          <Badge variant="secondary">{remainingStudents.length} remaining</Badge>
        </CardTitle>
        <CardDescription>
          Generate a random student without repeats until you reset.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Selected Student
          </p>
          <p className="mt-3 text-3xl font-semibold sm:text-4xl">
            {currentStudent ? formatStudentName(currentStudent.name) : "—"}
          </p>
          {!activeStudents.length ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Add or re-enable students to begin.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={actions.drawStudent}
            disabled={!canGenerate}
            className="sm:flex-1"
          >
            Generate Student
          </Button>
          <Button
            variant="secondary"
            onClick={actions.resetGenerator}
            disabled={!state.domain.generator.usedStudentIds.length}
            className="sm:flex-1"
          >
            Reset Generator
          </Button>
        </div>
        <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Breakout Groups
              </p>
              <p className="text-sm text-muted-foreground">
                Shuffle active students into groups for breakout rooms.
              </p>
            </div>
            <Badge variant="secondary">{activeStudents.length} students</Badge>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-foreground">
              Group size
              <Input
                type="number"
                min={1}
                value={groupSize}
                onChange={(event) => {
                  const nextValue = Number(event.target.value)
                  if (!Number.isNaN(nextValue)) {
                    setGroupSize(nextValue)
                  }
                }}
              />
            </label>
            <Button
              className="sm:w-44"
              disabled={!canGenerateGroups}
              onClick={() => {
                const nextGroups = buildGroups(activeStudents, Math.max(groupSize, 1))
                setGroups(nextGroups)
                setIsCopied(false)
              }}
            >
              Generate Groups
            </Button>
            <Button
              variant="secondary"
              className="sm:w-44"
              disabled={!groups.length}
              onClick={async () => {
                if (!groupSummary) return
                await navigator.clipboard.writeText(groupSummary)
                setIsCopied(true)
              }}
            >
              {isCopied ? "Copied!" : "Copy Groups"}
            </Button>
          </div>
          {groups.length ? (
            <div className="mt-4 space-y-3">
              {groups.map((group, index) => (
                <div key={`group-${index}`} className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Group {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {group.map((student) => formatStudentName(student.name)).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Generate groups to see the breakout room list.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
