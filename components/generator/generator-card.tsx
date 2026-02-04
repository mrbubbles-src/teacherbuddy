"use client"

import { useMemo } from "react"

import { useAppStore } from "@/context/app-store"
import { formatStudentName } from "@/lib/students"
import GeneratorCardSkeleton from "@/components/loading/generator-card-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GeneratorCard() {
  const { state, actions } = useAppStore()

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

  if (!state.ui.isHydrated) {
    return <GeneratorCardSkeleton />
  }

  return (
    <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="flex items-center gap-2 lg:text-lg">
          Random Student Pick
          <Badge variant="secondary">{remainingStudents.length} remaining</Badge>
        </CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          Generate a random student without repeats until you reset.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 lg:px-6 xl:px-8 lg:gap-5 xl:gap-6 lg:text-base/relaxed">
        <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center h-[160px] flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:text-base">
            Selected Student
          </p>
          <p className="mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl line-clamp-3">
            {currentStudent ? formatStudentName(currentStudent.name) : "—"}
          </p>
          {!activeStudents.length ? (
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              Add or re-enable students to begin.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={actions.drawStudent}
            disabled={!canGenerate}
            className="sm:min-w-32"
          >
            Generate Student
          </Button>
          <Button
            variant="secondary"
            onClick={actions.resetGenerator}
            disabled={!state.domain.generator.usedStudentIds.length}
            className="sm:min-w-32"
          >
            Reset Generator
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
