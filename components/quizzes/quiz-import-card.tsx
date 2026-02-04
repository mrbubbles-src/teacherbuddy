"use client"

import { useState } from "react"

import type { Question } from "@/lib/models"
import { useAppStore } from "@/context/app-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function QuizImportCard() {
  const { actions } = useAppStore()
  const [importPayload, setImportPayload] = useState("")
  const [importError, setImportError] = useState<string | null>(null)
  const [importNotice, setImportNotice] = useState<string | null>(null)

  const handleImportQuiz = () => {
    if (!importPayload.trim()) {
      setImportError("Paste a JSON quiz payload to import.")
      setImportNotice(null)
      return
    }

    try {
      const parsed = JSON.parse(importPayload)
      const inputs = Array.isArray(parsed) ? parsed : [parsed]
      const drafts = inputs
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null
          const titleValue = (entry as { title?: unknown }).title
          const title = typeof titleValue === "string" ? titleValue.trim() : ""
          const questionsValue = (entry as { questions?: unknown }).questions
          if (!title || !Array.isArray(questionsValue)) return null

          const questions = questionsValue
            .map((question) => {
              if (!question || typeof question !== "object") return null
              const promptValue = (question as { prompt?: unknown }).prompt
              const answerValue = (question as { answer?: unknown }).answer
              const promptText =
                typeof promptValue === "string" ? promptValue.trim() : ""
              const answerText =
                typeof answerValue === "string" ? answerValue.trim() : ""
              if (!promptText || !answerText) return null
              return {
                id: crypto.randomUUID(),
                prompt: promptText,
                answer: answerText,
              }
            })
            .filter(Boolean) as Question[]

          if (!questions.length) return null
          return {
            title,
            questions,
          }
        })
        .filter(Boolean) as Array<{ title: string; questions: Question[] }>

      if (!drafts.length) {
        setImportError("No valid quiz data found in that JSON.")
        setImportNotice(null)
        return
      }

      drafts.forEach((draft) => actions.createQuiz(draft.title, draft.questions))
      setImportNotice(
        `Imported ${drafts.length} quiz${drafts.length === 1 ? "" : "zes"}.`
      )
      setImportError(null)
      setImportPayload("")
    } catch {
      setImportError("Invalid JSON. Please check the format and try again.")
      setImportNotice(null)
    }
  }

  return (
    <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="lg:text-lg">Import Quiz JSON</CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          Paste a JSON object or array that matches the quiz format.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 lg:px-6 xl:px-8 lg:gap-5 xl:gap-6 lg:text-base/relaxed">
        <Field>
          <FieldLabel htmlFor="quiz-import">Quiz JSON</FieldLabel>
          <FieldContent>
            <Textarea
              id="quiz-import"
              value={importPayload}
              onChange={(event) => {
                setImportPayload(event.target.value)
                if (importError) setImportError(null)
              }}
              placeholder='{"title":"Algebra","questions":[{"prompt":"2+2?","answer":"4"}]}'
            />
            <FieldDescription>
              Required fields: <code>title</code> and <code>questions</code>{" "}
              with <code>prompt</code> and <code>answer</code>.
            </FieldDescription>
            {importError ? <FieldError>{importError}</FieldError> : null}
            {importNotice ? (
              <p className="text-sm text-muted-foreground">{importNotice}</p>
            ) : null}
          </FieldContent>
        </Field>
        <Button onClick={handleImportQuiz}>Import Quiz</Button>
      </CardContent>
    </Card>
  )
}
