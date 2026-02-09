import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BreakoutGroups, Classroom, Quiz, QuizIndexEntry, Student } from '@/lib/models'
import type { PersistedTimerState } from '@/lib/storage'
import {
  clearTimer,
  loadActiveClassId,
  loadBreakoutGroupsByClass,
  loadClasses,
  loadPersistedState,
  loadQuiz,
  loadQuizIndex,
  loadStudents,
  loadTimer,
  removeQuiz,
  saveActiveClassId,
  saveBreakoutGroupsByClass,
  saveClasses,
  saveQuiz,
  saveQuizIndex,
  saveStudents,
  saveTimer,
} from '@/lib/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('loads and saves classes', () => {
    const classes: Classroom[] = [
      { id: 'class-1', name: 'Math', createdAt: 1000 },
      { id: 'class-2', name: 'Science', createdAt: 2000 },
    ]

    saveClasses(classes)
    expect(loadClasses()).toEqual(classes)
  })

  it('loads and saves active class id', () => {
    saveActiveClassId('class-1')
    expect(loadActiveClassId()).toBe('class-1')

    saveActiveClassId(null)
    expect(loadActiveClassId()).toBeNull()
  })

  it('migrates legacy string student arrays when class id is provided', () => {
    localStorage.setItem('teacherbuddy:students', JSON.stringify(['Alex', 'Sam']))

    const students = loadStudents('class-1')

    expect(students).toHaveLength(2)
    expect(students[0].classId).toBe('class-1')
  })

  it('saves and loads class-aware students', () => {
    const students: Student[] = [
      {
        id: 's1',
        classId: 'class-1',
        name: 'Alex',
        status: 'active',
        createdAt: 1000,
      },
    ]

    saveStudents(students)
    expect(loadStudents()).toEqual(students)
  })

  it('saves and loads breakout groups keyed by class', () => {
    const groups: Record<string, BreakoutGroups> = {
      'class-1': {
        classId: 'class-1',
        groupSize: 2,
        groupIds: [['s1', 's2']],
        createdAt: 1000,
      },
    }

    saveBreakoutGroupsByClass(groups)
    expect(loadBreakoutGroupsByClass()).toEqual(groups)

    saveBreakoutGroupsByClass({})
    expect(loadBreakoutGroupsByClass()).toEqual({})
  })

  it('loads quiz index and quiz payloads', () => {
    const quizIndex: QuizIndexEntry[] = [{ id: 'q1', title: 'Quiz 1', createdAt: 1000 }]
    const quiz: Quiz = {
      id: 'q1',
      title: 'Quiz 1',
      questions: [],
      createdAt: 1000,
      updatedAt: 1000,
    }

    saveQuizIndex(quizIndex)
    saveQuiz(quiz)

    expect(loadQuizIndex()).toEqual(quizIndex)
    expect(loadQuiz('q1')).toEqual(quiz)

    removeQuiz('q1')
    expect(loadQuiz('q1')).toBeNull()
  })

  it('loads persisted state with class-aware structures', () => {
    const classes: Classroom[] = [{ id: 'class-1', name: 'Math', createdAt: 1000 }]
    const students: Student[] = [
      {
        id: 's1',
        classId: 'class-1',
        name: 'Alex',
        status: 'active',
        createdAt: 1000,
      },
    ]
    const quizIndex: QuizIndexEntry[] = [{ id: 'q1', title: 'Quiz 1', createdAt: 1000 }]
    const quiz: Quiz = {
      id: 'q1',
      title: 'Quiz 1',
      questions: [],
      createdAt: 1000,
      updatedAt: 1000,
    }

    localStorage.setItem('teacherbuddy:classes', JSON.stringify(classes))
    localStorage.setItem('teacherbuddy:active-class', JSON.stringify('class-1'))
    localStorage.setItem('teacherbuddy:students', JSON.stringify(students))
    localStorage.setItem('teacherbuddy:quiz-index', JSON.stringify(quizIndex))
    localStorage.setItem('teacherbuddy:quiz:q1', JSON.stringify(quiz))
    localStorage.setItem(
      'teacherbuddy:breakout-groups',
      JSON.stringify({
        'class-1': {
          classId: 'class-1',
          groupSize: 2,
          groupIds: [['s1']],
          createdAt: 1000,
        },
      })
    )

    const result = loadPersistedState()

    expect(result.classes).toEqual(classes)
    expect(result.activeClassId).toBe('class-1')
    expect(result.students).toEqual(students)
    expect(result.quizzes).toEqual({ q1: quiz })
    expect(result.breakoutGroupsByClass['class-1']).toBeDefined()
  })

  it('loads and validates timer state', () => {
    const timer: PersistedTimerState = {
      configuredTotalSeconds: 300,
      remainingSeconds: 100,
      isRunning: true,
      savedAt: 1000,
    }

    saveTimer(timer)
    expect(loadTimer()).toEqual(timer)

    clearTimer()
    expect(loadTimer()).toBeNull()
  })
})
