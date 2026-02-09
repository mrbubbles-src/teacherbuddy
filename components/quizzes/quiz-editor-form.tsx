'use client';

import type { Question, Quiz } from '@/lib/models';

import { useEffect, useMemo, useRef, useState } from 'react';

import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import QuizSelector from '@/components/quizzes/quiz-selector';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/context/app-store';

type QuizEditorFormProps = {
  quiz: Quiz | null;
  quizId: string | null;
};

type JsonPrimitive = boolean | null | number | string;
type JsonValue = JsonArray | JsonObject | JsonPrimitive;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type ImportedQuestionDraft = {
  prompt: string;
  answer: string;
};
type ImportedQuizDraft = {
  title: string;
  description?: string;
  questions: ImportedQuestionDraft[];
};
type QuizImportResult =
  | { status: 'success'; drafts: ImportedQuizDraft[] }
  | { status: 'invalid-json' }
  | { status: 'invalid-schema' };
type InputChangeEvent = Parameters<
  NonNullable<React.ComponentProps<'input'>['onChange']>
>[0];

/**
 * Checks whether a JSON value is a plain object.
 *
 * @param value - Parsed JSON value to inspect.
 * @returns `true` when the value can be safely accessed by object keys.
 */
const isJsonObject = (value: JsonValue): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Safely reads a string field from a JSON object.
 *
 * @param object - Parsed JSON object.
 * @param key - Field name to read.
 * @returns A string when the field exists and is a string, otherwise `null`.
 */
const getJsonStringField = (object: JsonObject, key: string): string | null => {
  const value = object[key];
  return typeof value === 'string' ? value : null;
};

/**
 * Extracts valid prompt/answer pairs from a JSON value.
 *
 * @param value - Raw `questions` value from parsed JSON.
 * @returns Question drafts with trimmed prompt/answer values.
 */
const parseImportedQuestions = (value: JsonValue): ImportedQuestionDraft[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const parsedQuestions: ImportedQuestionDraft[] = [];
  for (const questionValue of value) {
    if (!isJsonObject(questionValue)) continue;
    const promptValue = getJsonStringField(questionValue, 'prompt');
    const answerValue = getJsonStringField(questionValue, 'answer');
    const prompt = promptValue?.trim() ?? '';
    const answer = answerValue?.trim() ?? '';
    if (!prompt || !answer) continue;
    parsedQuestions.push({ prompt, answer });
  }

  return parsedQuestions;
};

/**
 * Parses one quiz object from JSON into a normalized draft.
 *
 * @param value - Raw JSON value expected to match one quiz payload.
 * @returns A normalized draft when valid, otherwise `null`.
 */
const parseImportedQuizDraft = (value: JsonValue): ImportedQuizDraft | null => {
  if (!isJsonObject(value)) {
    return null;
  }

  const rawTitle = getJsonStringField(value, 'title');
  const descriptionValue = value.description;
  if (descriptionValue !== undefined && typeof descriptionValue !== 'string') {
    return null;
  }
  const questionsValue = value.questions;
  if (!rawTitle || !questionsValue) {
    return null;
  }

  const title = rawTitle.trim();
  const description =
    typeof descriptionValue === 'string' ? descriptionValue.trim() : '';
  if (!title) {
    return null;
  }

  const questions = parseImportedQuestions(questionsValue);
  if (!questions.length) {
    return null;
  }

  return {
    title,
    ...(description ? { description } : {}),
    questions,
  };
};

/**
 * Validates raw import text against the quiz import schema.
 *
 * Expected shapes:
 * 1) `{ "title": string, "description"?: string, "questions": [{ "prompt": string, "answer": string }] }`
 * 2) An array of the same quiz object shape for bulk import.
 *
 * @param payload - UTF-8 text read from the uploaded JSON file.
 * @returns A discriminated result describing success or validation failure.
 */
const parseQuizImportPayload = (payload: string): QuizImportResult => {
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(payload) as JsonValue;
  } catch {
    return { status: 'invalid-json' };
  }

  if (Array.isArray(parsed)) {
    if (!parsed.length) {
      return { status: 'invalid-schema' };
    }
    const drafts: ImportedQuizDraft[] = [];
    for (const entry of parsed) {
      const parsedDraft = parseImportedQuizDraft(entry);
      if (!parsedDraft) {
        return { status: 'invalid-schema' };
      }
      drafts.push(parsedDraft);
    }
    return { status: 'success', drafts };
  }

  const parsedDraft = parseImportedQuizDraft(parsed);
  if (!parsedDraft) {
    return { status: 'invalid-schema' };
  }
  return { status: 'success', drafts: [parsedDraft] };
};

/**
 * Reads a selected file as UTF-8 text.
 * Uses `File.text()` when available and falls back to `FileReader` for
 * environments that do not implement the modern file API.
 *
 * @param file - Browser file object selected from the import control.
 * @returns Promise resolving to the file contents as text.
 */
const readFileAsText = (file: File): Promise<string> => {
  if (typeof file.text === 'function') {
    return file.text();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
        return;
      }
      reject(new Error('Unable to read file contents.'));
    };
    reader.onerror = () => reject(new Error('Unable to read file contents.'));
    reader.readAsText(file);
  });
};

/**
 * Renders quiz editing controls for quiz metadata and question management.
 * Accepts an optional existing quiz and emits store actions for create/update/delete flows.
 */
export default function QuizEditorForm({ quiz, quizId }: QuizEditorFormProps) {
  const { state, actions } = useAppStore();
  const builderCardRef = useRef<HTMLDivElement | null>(null);

  // Form state - initialized from props, reset via key pattern in parent
  const [title, setTitle] = useState(quiz?.title ?? '');
  const [description, setDescription] = useState(quiz?.description ?? '');
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions ?? []);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [quizError, setQuizError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [builderCardHeight, setBuilderCardHeight] = useState<number | null>(
    null,
  );
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );

  const editingQuestion = useMemo(
    () =>
      questions.find((question) => question.id === editingQuestionId) ?? null,
    [questions, editingQuestionId],
  );

  /**
   * Tracks builder card height so the questions card can scroll instead of
   * growing taller than the builder panel.
   */
  useEffect(() => {
    const element = builderCardRef.current;
    if (!element) {
      return;
    }

    const measureHeight = () => {
      const nextHeight = Math.round(element.getBoundingClientRect().height);
      setBuilderCardHeight(nextHeight);
    };

    measureHeight();
    const rafId = window.requestAnimationFrame(measureHeight);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measureHeight);
      observer.observe(element);
      return () => {
        window.cancelAnimationFrame(rafId);
        observer.disconnect();
      };
    }

    window.addEventListener('resize', measureHeight);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureHeight);
    };
  }, []);

  /**
   * Validates quiz metadata, saves changes, and confirms with a toast.
   */
  const handleSaveQuiz = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setQuizError('Quiz title is required.');
      return;
    }
    if (!questions.length) {
      setQuizError('Add at least one question before saving.');
      return;
    }

    if (quizId) {
      actions.updateQuiz(quizId, trimmed, questions, description);
      toast.success('Quiz updated.');
    } else {
      actions.createQuiz(trimmed, questions, description);
      toast.success('Quiz created.');
    }
    setQuizError(null);
  };

  /**
   * Adds a new question or updates the current edit and resets the inputs.
   */
  const handleAddOrUpdateQuestion = () => {
    const trimmedPrompt = prompt.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedPrompt || !trimmedAnswer) {
      setQuestionError('Both question and answer are required.');
      return;
    }

    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === editingQuestionId
            ? { ...question, prompt: trimmedPrompt, answer: trimmedAnswer }
            : question,
        ),
      );
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          prompt: trimmedPrompt,
          answer: trimmedAnswer,
        },
      ]);
    }

    setPrompt('');
    setAnswer('');
    setEditingQuestionId(null);
    setQuestionError(null);
    setImportNotice(null);
    toast.success(editingQuestionId ? 'Question updated.' : 'Question added.');
  };

  /**
   * Loads the selected question into the edit form.
   *
   * @param questionId - Identifier of the question to edit.
   */
  const handleEditQuestion = (questionId: string) => {
    const question = questions.find((item) => item.id === questionId);
    if (!question) return;
    setPrompt(question.prompt);
    setAnswer(question.answer);
    setEditingQuestionId(questionId);
    setQuestionError(null);
  };

  /**
   * Removes a question from the draft and clears the editor if needed.
   *
   * @param questionId - Identifier of the question to remove.
   */
  const handleRemoveQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.filter((question) => question.id !== questionId),
    );
    if (editingQuestionId === questionId) {
      setEditingQuestionId(null);
      setPrompt('');
      setAnswer('');
    }
    toast.success('Question removed.');
  };

  /**
   * Cancels question editing and resets the editor fields.
   */
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setPrompt('');
    setAnswer('');
    setQuestionError(null);
  };

  /**
   * Clears the active quiz selection to start a new quiz.
   */
  const handleNewQuiz = () => {
    actions.selectQuizForEditor(null);
  };

  /**
   * Deletes the current quiz and confirms the action with a toast.
   */
  const handleDeleteQuiz = () => {
    if (!quizId) return;
    actions.deleteQuiz(quizId);
    toast.success('Quiz deleted.');
  };

  /**
   * Imports a quiz JSON file into the current draft title and question list.
   *
   * @param event - File input change event carrying the selected `.json` file.
   * @returns A promise that resolves after file validation and draft updates.
   */
  const handleQuizFileImport = async (event: InputChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const payload = await readFileAsText(file);
      const result = parseQuizImportPayload(payload);
      if (result.status === 'invalid-json') {
        const message =
          'Invalid JSON file. Please check the format and try again.';
        setImportError(message);
        setImportNotice(null);
        toast.error(message);
        return;
      }
      if (result.status === 'invalid-schema') {
        const message =
          'Import must match quiz objects with title and questions[{prompt,answer}].';
        setImportError(message);
        setImportNotice(null);
        toast.error(message);
        return;
      }
      if (result.drafts.length > 1) {
        for (const draft of result.drafts) {
          const nextQuestions: Question[] = draft.questions.map((question) => ({
            id: crypto.randomUUID(),
            prompt: question.prompt,
            answer: question.answer,
          }));
          actions.createQuiz(draft.title, nextQuestions, draft.description);
        }
        const message = `Saved ${result.drafts.length} quizzes from file. The last imported quiz is selected.`;
        setImportError(null);
        setImportNotice(message);
        toast.success(message);
        return;
      }

      const singleDraft = result.drafts[0];
      const importedQuestions: Question[] = singleDraft.questions.map(
        (question) => ({
          id: crypto.randomUUID(),
          prompt: question.prompt,
          answer: question.answer,
        }),
      );

      setTitle(singleDraft.title);
      setDescription(singleDraft.description ?? '');
      setQuestions(importedQuestions);
      setPrompt('');
      setAnswer('');
      setQuizError(null);
      setQuestionError(null);
      setEditingQuestionId(null);
      setImportError(null);
      const draftMessage = `Loaded ${importedQuestions.length} question${importedQuestions.length === 1 ? '' : 's'} into the draft. Click "Save Quiz" to keep it.`;
      setImportNotice(draftMessage);
      toast.success('Loaded quiz into draft. Not saved yet.');
    } catch (error) {
      console.error('Failed to import quiz file', error);
      const message = 'Could not read the file. Please try again.';
      setImportError(message);
      setImportNotice(null);
      toast.error(message);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <>
      <div ref={builderCardRef}>
      <Card className="relative h-full overflow-hidden rounded-xl border-border/50 py-6 shadow-md lg:gap-6 xl:gap-8 xl:py-8">
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
          style={{ backgroundColor: 'var(--chart-3)', opacity: 0.6 }}
        />
        <CardHeader className="px-6 xl:px-8">
          <CardTitle className="text-xl font-bold tracking-tight">
            Quiz Builder
          </CardTitle>
          <CardDescription className="text-base/relaxed">
            Select a saved quiz, build new questions, or import JSON into the
            current draft.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-6 text-base/relaxed text-muted-foreground lg:gap-5 xl:gap-6 xl:px-8">
          <QuizSelector
            label="Saved quizzes"
            value={quizId}
            onChange={actions.selectQuizForEditor}
            quizzes={state.persisted.quizIndex}
          />
          <Field>
            <FieldLabel htmlFor="quiz-title" className="text-lg/relaxed">
              Quiz title
            </FieldLabel>
            <FieldContent>
              <Input
                id="quiz-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-9 text-base/relaxed placeholder:text-base/relaxed placeholder:text-muted-foreground/70"
                placeholder="e.g. Geography Review"
              />
              <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                Titles are display-only and can be edited later.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="quiz-description" className="text-lg/relaxed">
              Quiz description (optional)
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="quiz-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short context for this quiz"
                className="text-base/relaxed placeholder:text-base/relaxed placeholder:text-muted-foreground/70"
              />
            </FieldContent>
          </Field>
          {quizError ? <FieldError>{quizError}</FieldError> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleSaveQuiz}
              className="h-9 font-semibold text-base sm:min-w-32">
              Save Quiz
            </Button>
            <Button
              variant="secondary"
              onClick={handleNewQuiz}
              className="h-9 font-semibold text-base sm:min-w-32">
              New Quiz
            </Button>
          </div>
          {quizId ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="destructive"
                    className="h-9 w-full text-base font-semibold active:font-normal md:w-6/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12"
                  />
                }>
                Delete Quiz
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this quiz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the quiz and its questions from local
                    storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteQuiz}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}

          <FieldSeparator>Questions</FieldSeparator>

          <Field>
            <FieldLabel className="text-lg/relaxed" htmlFor="question-prompt">
              {editingQuestion ? 'Edit question' : 'Add question'}
            </FieldLabel>
            <FieldContent>
              <Input
                id="question-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="What is the capital of France?"
                className="h-9 text-base/relaxed placeholder:text-base/relaxed placeholder:text-muted-foreground/70"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel className="text-lg/relaxed" htmlFor="question-answer">
              Answer
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="question-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Paris"
                className="text-base/relaxed placeholder:text-base/relaxed placeholder:text-muted-foreground/70"
              />
              <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                Add prompts and answers before saving the quiz.
              </FieldDescription>
            </FieldContent>
          </Field>
          {questionError ? <FieldError>{questionError}</FieldError> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleAddOrUpdateQuestion}
              className="h-9 font-semibold text-base sm:min-w-32">
              <PlusIcon className="size-3.5" />
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </Button>
            {editingQuestion ? (
              <Button
                variant="secondary"
                onClick={handleCancelEdit}
                className="h-9 font-semibold text-base sm:min-w-32">
                Cancel Edit
              </Button>
            ) : null}
          </div>

          <FieldSeparator>Import</FieldSeparator>

          <Field>
            <FieldLabel htmlFor="quiz-import-file" className="text-lg/relaxed">
              Import quiz from JSON
            </FieldLabel>
            <FieldContent className="gap-2">
              <Input
                id="quiz-import-file"
                type="file"
                accept=".json,application/json"
                onChange={handleQuizFileImport}
                className="h-10 max-w-full text-base/relaxed file:my-1 file:mr-5 file:cursor-pointer file:rounded-md file:border-accent/50 file:bg-accent/10 file:px-5 file:text-base/relaxed file:text-muted-foreground/70"
              />
              <FieldDescription className="text-base/relaxed text-muted-foreground/70">
                Import one quiz object or an array of quiz objects. Each quiz
                needs <code>title</code>, optional <code>description</code>, and{' '}
                <code>questions</code> with <code>prompt</code> and{' '}
                <code>answer</code>. Single quiz files load into your draft
                (not saved until you click Save Quiz). Arrays save quizzes right
                away.
              </FieldDescription>
              <pre className="overflow-x-auto rounded-md border border-border/60 bg-background/40 p-3 text-sm/relaxed text-foreground">
                {`{
  "title": "Math Quiz",
  "description": "Optional",
  "questions": [
    { "prompt": "What is 2 + 2?", "answer": "4" }
  ]
}`}
              </pre>
              {importError ? <FieldError>{importError}</FieldError> : null}
              {importNotice ? (
                <p className="text-base/relaxed text-muted-foreground">
                  {importNotice}
                </p>
              ) : null}
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
      </div>

      <Card
        className="relative flex min-h-0 flex-col overflow-hidden rounded-xl border-border/50 py-6 shadow-md lg:gap-6 xl:gap-8 xl:py-8"
        style={
          builderCardHeight
            ? { maxHeight: `${builderCardHeight}px` }
            : undefined
        }>
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
          style={{ backgroundColor: 'var(--chart-3)', opacity: 0.6 }}
        />
        <CardHeader className="px-6 xl:px-8">
          <CardTitle className="text-xl font-bold tracking-tight">
            Questions
          </CardTitle>
          <CardDescription className="text-base/relaxed">
            {questions.length
              ? `${questions.length} question${questions.length === 1 ? '' : 's'}`
              : 'Add questions to build your quiz.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col px-6 text-base/relaxed text-muted-foreground xl:px-8">
          {questions.length ? (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 shadow-inner">
              <div className="flex flex-col gap-2">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-lg border border-border/60 bg-background/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base/relaxed font-medium text-foreground line-clamp-2 flex-1">
                        {question.prompt}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="min-h-[44px] min-w-[44px]"
                          onClick={() => handleEditQuestion(question.id)}>
                          <PencilIcon className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="min-h-[44px] min-w-[44px]"
                          onClick={() => handleRemoveQuestion(question.id)}>
                          <Trash2Icon className="size-4 text-destructive" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm/relaxed text-muted-foreground line-clamp-2">
                      {question.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-base text-muted-foreground">
              No questions yet. Add your first question to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
