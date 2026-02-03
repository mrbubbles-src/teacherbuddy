export type StudentStatus = "active" | "excluded"

export type Student = {
  id: string
  name: string
  status: StudentStatus
  createdAt: number
}

export type Question = {
  id: string
  prompt: string
  answer: string
}

export type Quiz = {
  id: string
  title: string
  questions: Question[]
  createdAt: number
  updatedAt: number
}

export type QuizIndexEntry = {
  id: string
  title: string
  createdAt: number
}

export type BreakoutGroups = {
  groupSize: number
  groupIds: string[][]
  createdAt: number
}
