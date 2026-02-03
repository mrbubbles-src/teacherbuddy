"use client"

import type { QuizIndexEntry } from "@/lib/models"

import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function QuizSelector({
  label,
  value,
  onChange,
  quizzes,
  placeholder,
}: {
  label: string
  value: string | null
  onChange: (id: string | null) => void
  quizzes: QuizIndexEntry[]
  placeholder?: string
}) {
  const hasQuizzes = quizzes.length > 0

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <Select
          value={value ?? ""}
          onValueChange={(next) => onChange(next || null)}
          disabled={!hasQuizzes}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder ?? "Select a quiz"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {quizzes.map((quiz) => (
                <SelectItem key={quiz.id} value={quiz.id}>
                  {quiz.title || "Untitled quiz"}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {!hasQuizzes ? (
          <FieldDescription>Save a quiz to make it available here.</FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  )
}
