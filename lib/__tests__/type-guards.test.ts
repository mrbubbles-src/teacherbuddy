import { describe, expect, it } from 'vitest'

import {
  isBreakoutGroups,
  isClassroom,
  isPersistedTimerState,
  isProjectList,
  isQuestion,
  isQuiz,
  isQuizIndexEntry,
  isStudent,
} from '@/lib/type-guards'

describe('type guards', () => {
  it('validates student with classId', () => {
    expect(
      isStudent({
        id: 's1',
        classId: 'class-1',
        name: 'Alex',
        status: 'active',
        createdAt: 1000,
      })
    ).toBe(true)

    expect(
      isStudent({
        id: 's1',
        name: 'Alex',
        status: 'active',
        createdAt: 1000,
      })
    ).toBe(false)
  })

  it('validates classroom records', () => {
    expect(isClassroom({ id: 'class-1', name: 'Math', createdAt: 1000 })).toBe(true)
    expect(isClassroom({ id: 'class-1', name: 'Math' })).toBe(false)
  })

  it('validates quiz index entries', () => {
    expect(isQuizIndexEntry({ id: 'q1', title: 'Quiz', createdAt: 1000 })).toBe(true)
    expect(isQuizIndexEntry({ id: 'q1', title: 'Quiz' })).toBe(false)
  })

  it('validates questions', () => {
    expect(isQuestion({ id: 'q1', prompt: '2+2?', answer: '4' })).toBe(true)
    expect(isQuestion({ id: 'q1', prompt: '2+2?' })).toBe(false)
  })

  it('validates quizzes', () => {
    expect(
      isQuiz({
        id: 'q1',
        title: 'Quiz',
        questions: [],
        createdAt: 1000,
        updatedAt: 1000,
      })
    ).toBe(true)
    expect(isQuiz({ id: 'q1', title: 'Quiz' })).toBe(false)
  })

  it('validates breakout groups with classId', () => {
    expect(
      isBreakoutGroups({
        classId: 'class-1',
        groupSize: 2,
        groupIds: [['s1', 's2']],
        createdAt: 1000,
      })
    ).toBe(true)

    expect(
      isBreakoutGroups({
        groupSize: 2,
        groupIds: [['s1', 's2']],
        createdAt: 1000,
      })
    ).toBe(false)
  })

  it('validates project lists with classId', () => {
    expect(
      isProjectList({
        id: 'p1',
        classId: 'class-1',
        name: 'Poster',
        projectType: 'group',
        studentIds: ['s1'],
        groups: [['s1']],
      })
    ).toBe(true)

    expect(
      isProjectList({
        id: 'p1',
        name: 'Poster',
        projectType: 'group',
        studentIds: ['s1'],
        groups: [['s1']],
      })
    ).toBe(false)
  })

  it('validates persisted timer state', () => {
    expect(
      isPersistedTimerState({
        configuredTotalSeconds: 300,
        remainingSeconds: 100,
        isRunning: false,
        savedAt: 1000,
      })
    ).toBe(true)

    expect(
      isPersistedTimerState({
        configuredTotalSeconds: 300,
        remainingSeconds: 100,
      })
    ).toBe(false)
  })
})
