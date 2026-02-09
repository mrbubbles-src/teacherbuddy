'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/context/app-store'

/**
 * Renders a class selector bound to the shared active class in app state.
 * Use on student-dependent pages so all tools scope to the selected class.
 */
export default function ClassSelector({
  label = 'Class',
  compact = false,
}: {
  label?: string
  compact?: boolean
}) {
  const { state, actions } = useAppStore()

  const classes = useMemo(
    () => [...state.persisted.classes].sort((a, b) => a.name.localeCompare(b.name)),
    [state.persisted.classes]
  )
  const selectedClass =
    classes.find((entry) => entry.id === state.persisted.activeClassId) ?? classes[0] ?? null

  if (!state.ui.isHydrated) {
    return null
  }

  if (!classes.length) {
    return (
      <div className='text-sm text-muted-foreground'>
        No classes yet. Add one on{' '}
        <Link href='/students' className='text-primary hover:text-primary/80'>
          Students
        </Link>
        .
      </div>
    )
  }

  return (
    <div className={compact ? 'w-full sm:w-56' : 'w-full sm:w-72'}>
      <p className='mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
        {label}
      </p>
      <Select
        value={selectedClass?.id ?? ''}
        onValueChange={(value) => actions.selectActiveClass(value)}>
        <SelectTrigger className='h-9 text-base/relaxed'>
          <SelectValue placeholder='Select class'>
            {selectedClass?.name ?? 'Select class'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {classes.map((entry) => (
            <SelectItem key={entry.id} value={entry.id} className='text-base/relaxed'>
              {entry.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
