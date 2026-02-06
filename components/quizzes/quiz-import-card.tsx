'use client';

import type { Question } from '@/lib/models';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/context/app-store';

/**
 * Renders JSON import controls for creating one or more quizzes in bulk.
 * Expects quiz payloads with `title` and `questions[]` containing `prompt` and `answer`.
 */
export default function QuizImportCard() {
  const { actions } = useAppStore();
  const [importPayload, setImportPayload] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  /**
   * Parses JSON input, creates quizzes, and summarizes the import result.
   */
  const handleImportQuiz = () => {
    if (!importPayload.trim()) {
      toast.error('Paste a JSON quiz payload to import.');
      setImportError('Paste a JSON quiz payload to import.');
      setImportNotice(null);
      return;
    }

    try {
      const parsed = JSON.parse(importPayload);
      const inputs = Array.isArray(parsed) ? parsed : [parsed];
      const drafts = inputs
        .map((entry) => {
          if (!entry || typeof entry !== 'object') return null;
          const titleValue = (entry as { title?: unknown }).title;
          const title = typeof titleValue === 'string' ? titleValue.trim() : '';
          const questionsValue = (entry as { questions?: unknown }).questions;
          if (!title || !Array.isArray(questionsValue)) return null;

          const questions = questionsValue
            .map((question) => {
              if (!question || typeof question !== 'object') return null;
              const promptValue = (question as { prompt?: unknown }).prompt;
              const answerValue = (question as { answer?: unknown }).answer;
              const promptText =
                typeof promptValue === 'string' ? promptValue.trim() : '';
              const answerText =
                typeof answerValue === 'string' ? answerValue.trim() : '';
              if (!promptText || !answerText) return null;
              return {
                id: crypto.randomUUID(),
                prompt: promptText,
                answer: answerText,
              };
            })
            .filter(Boolean) as Question[];

          if (!questions.length) return null;
          return {
            title,
            questions,
          };
        })
        .filter(Boolean) as Array<{ title: string; questions: Question[] }>;

      if (!drafts.length) {
        const message = 'No valid quiz data found in that JSON.';
        setImportError(message);
        setImportNotice(null);
        toast.error(message);
        return;
      }

      drafts.forEach((draft) =>
        actions.createQuiz(draft.title, draft.questions),
      );
      setImportNotice(
        `Imported ${drafts.length} quiz${drafts.length === 1 ? '' : 'zes'}.`,
      );
      toast.success(
        `Imported ${drafts.length} quiz${drafts.length === 1 ? '' : 'zes'}.`,
      );
      setImportError(null);
      setImportPayload('');
    } catch {
      const message = 'Invalid JSON. Please check the format and try again.';
      setImportError(message);
      setImportNotice(null);
      toast.error(message);
    }
  };

  return (
    <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="px-6 xl:px-8">
        <CardTitle className="text-xl">Import Quiz JSON</CardTitle>
        <CardDescription className="text-base/relaxed">
          Paste a JSON object or array that matches the quiz format.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
        <Field>
          <FieldLabel className="text-lg/relaxed" htmlFor="quiz-import">
            Quiz JSON
          </FieldLabel>
          <FieldContent>
            <Textarea
              id="quiz-import"
              value={importPayload}
              onChange={(event) => {
                setImportPayload(event.target.value);
                if (importError) setImportError(null);
              }}
              placeholder='{"title":"Algebra","questions":[{"prompt":"2+2?","answer":"4"}]}'
              className="text-base/relaxed placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
            />
            <FieldDescription className="text-base/relaxed text-muted-foreground/70">
              Required fields: <code>title</code> and <code>questions</code>{' '}
              with <code>prompt</code> and <code>answer</code>.
            </FieldDescription>
            {importError ? <FieldError>{importError}</FieldError> : null}
            {importNotice ? (
              <p className="text-sm text-muted-foreground">{importNotice}</p>
            ) : null}
          </FieldContent>
        </Field>
        <Button
          onClick={handleImportQuiz}
          className="w-full h-9 font-semibold active:font-normal md:w-6/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12 text-base">
          Import Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
