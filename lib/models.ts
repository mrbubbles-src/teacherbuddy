export type StudentStatus = "active" | "excluded"

export type Classroom = {
  id: string
  name: string
  createdAt: number
}

export type Student = {
  id: string
  name: string
  status: StudentStatus
  createdAt: number
  classId: string
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

export type ProjectList = {
  id: string
  classId: string
  name: string
  projectType: string
  description: string
  studentIds: string[]
  groups: string[][]
  createdAt: number
}

export type BreakoutGroups = {
  classId: string
  groupSize: number
  groupIds: string[][]
  createdAt: number
}
