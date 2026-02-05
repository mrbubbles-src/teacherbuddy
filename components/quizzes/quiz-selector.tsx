'use client';

import type { QuizIndexEntry } from '@/lib/models';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Renders a reusable quiz picker field for editor and play workflows.
 * Provide quiz index entries, current selection, and an `onChange` handler.
 */
export default function QuizSelector({
  label,
  value,
  onChange,
  quizzes,
  placeholder,
}: {
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
  quizzes: QuizIndexEntry[];
  placeholder?: string;
}) {
  const hasQuizzes = quizzes.length > 0;
  const selectedQuiz = value
    ? (quizzes.find((quiz) => quiz.id === value) ?? null)
    : null;

  return (
    <Field>
      <FieldLabel className="text-lg/relaxed">{label}</FieldLabel>
      <FieldContent>
        <Select
          value={value ?? ''}
          onValueChange={(next) => onChange(next || null)}
          disabled={!hasQuizzes}>
          <SelectTrigger className="text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed w-full">
            <SelectValue placeholder={placeholder ?? 'Select a quiz'}>
              {selectedQuiz ? selectedQuiz.title || 'Untitled quiz' : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {quizzes.map((quiz) => (
                <SelectItem
                  key={quiz.id}
                  value={quiz.id}
                  className="text-base/relaxed">
                  {quiz.title || 'Untitled quiz'}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {!hasQuizzes ? (
          <FieldDescription>
            Save a quiz to make it available here.
          </FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  );
}
