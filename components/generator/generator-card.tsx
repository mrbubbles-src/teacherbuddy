'use client'

import { formatStudentName } from '@/lib/students'

import { useMemo } from 'react'

import ClassSelector from '@/components/classes/class-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAppStore } from '@/context/app-store'

/**
 * Generator card scoped to the selected class. Shows server-rendered skeleton until hydrated.
 */
export default function GeneratorCard({
  skeleton,
}: {
  skeleton: React.ReactNode
}) {
  const { state, actions } = useAppStore()
  const activeClassId = state.persisted.activeClassId

  const activeStudents = useMemo(
    () =>
      state.persisted.students.filter(
        (student) => student.classId === activeClassId && student.status === 'active'
      ),
    [activeClassId, state.persisted.students]
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

  const canGenerate = !!activeClassId && remainingStudents.length > 0

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>
  }

  return (
    <Card className='relative overflow-hidden rounded-xl border-border/50 shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8'>
      <div
        className='absolute left-0 top-0 h-full w-1 rounded-l-xl'
        style={{ backgroundColor: 'var(--chart-2)', opacity: 0.6 }}
      />
      <CardHeader className='flex flex-col gap-3 px-6 xl:px-8'>
        <div className='flex flex-row items-start justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <CardTitle className='text-xl font-bold tracking-tight'>Random Student Pick</CardTitle>
            <CardDescription className='text-base/relaxed'>
              Generate a random student without repeats until you reset.
            </CardDescription>
          </div>
          <Badge
            variant='outline'
            className='rounded-full px-2 py-0.5 text-xs font-medium shrink-0'
            style={{
              backgroundColor: 'color-mix(in oklch, var(--chart-2) 10%, transparent)',
              color: 'var(--chart-2)',
            }}>
            {remainingStudents.length} remaining
          </Badge>
        </div>
        <ClassSelector compact />
      </CardHeader>
      <CardContent className='flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground'>
        <div className='rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center h-[160px] flex flex-col justify-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:text-base'>
            Selected Student
          </p>
          <p className='mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl line-clamp-3'>
            {currentStudent ? formatStudentName(currentStudent.name) : '—'}
          </p>
          {!activeClassId ? (
            <p className='mt-2 text-sm text-muted-foreground lg:text-base'>
              Add and select a class to begin.
            </p>
          ) : !activeStudents.length ? (
            <p className='mt-2 text-sm text-muted-foreground lg:text-base'>
              Add or re-enable students to begin.
            </p>
          ) : null}
        </div>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button
            onClick={actions.drawStudent}
            disabled={!canGenerate}
            className='h-9 font-semibold text-base sm:min-w-32'>
            Generate Student
          </Button>
          <Button
            variant='secondary'
            onClick={actions.resetGenerator}
            disabled={!state.domain.generator.usedStudentIds.length}
            className='h-9 font-semibold text-base sm:min-w-32'>
            Reset Generator
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
