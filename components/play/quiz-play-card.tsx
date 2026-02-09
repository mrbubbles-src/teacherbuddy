'use client';

import { formatStudentName } from '@/lib/students';

import { useMemo } from 'react';

import ClassSelector from '@/components/classes/class-selector';
import QuizSelector from '@/components/quizzes/quiz-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppStore } from '@/context/app-store';

/**
 * Quiz play card: shows server-rendered skeleton until hydrated, then the card.
 * Skeleton is passed from the page (RSC) so it runs as a server component.
 */
export default function QuizPlayCard({
  skeleton,
}: {
  skeleton: React.ReactNode;
}) {
  const { state, actions } = useAppStore();
  const activeClassId = state.persisted.activeClassId;

  const selectedQuizId = state.domain.quizPlay.selectedQuizId;
  const quiz = selectedQuizId ? state.persisted.quizzes[selectedQuizId] : null;

  const activeStudents = useMemo(
    () =>
      state.persisted.students.filter(
        (student) => student.classId === activeClassId && student.status === 'active',
      ),
    [activeClassId, state.persisted.students],
  );

  const availableQuestionIds = useMemo(() => {
    if (!quiz) return [];
    return quiz.questions
      .filter(
        (question) =>
          !state.domain.quizPlay.usedQuestionIds.includes(question.id),
      )
      .map((question) => question.id);
  }, [quiz, state.domain.quizPlay.usedQuestionIds]);

  const availableStudentIds = useMemo(() => {
    return activeStudents
      .filter(
        (student) => !state.domain.quizPlay.usedStudentIds.includes(student.id),
      )
      .map((student) => student.id);
  }, [activeStudents, state.domain.quizPlay.usedStudentIds]);

  const currentQuestion = quiz?.questions.find(
    (question) => question.id === state.domain.quizPlay.currentQuestionId,
  );
  const currentStudent = state.persisted.students.find(
    (student) =>
      student.id === state.domain.quizPlay.currentStudentId &&
      student.classId === activeClassId,
  );

  const canDraw =
    !!quiz && availableQuestionIds.length > 0 && availableStudentIds.length > 0;

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>;
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border-border/50 shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: 'var(--chart-4)', opacity: 0.6 }}
      />
      <CardHeader className="px-6 xl:px-8">
        <CardTitle className="text-xl font-bold tracking-tight">Quiz Play Mode</CardTitle>
        <CardDescription className="text-base/relaxed">
          Draw a random student and question. Reveal answers when ready.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
        <ClassSelector compact />
        <QuizSelector
          label="Select quiz"
          value={selectedQuizId}
          onChange={actions.selectQuizForPlay}
          quizzes={state.persisted.quizIndex}
          placeholder="Choose a quiz to play"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 min-h-[100px] md:min-h-[140px] flex flex-col justify-center">
            <p className="text-base/relaxed font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Selected Student
            </p>
            <p className="mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl line-clamp-2">
              {currentStudent ? formatStudentName(currentStudent.name) : '—'}
            </p>
            <Badge
              variant="outline"
              className="mt-2 p-2.5 text-base/relaxed border-accent/50 shadow-sm">
              {availableStudentIds.length} remaining
            </Badge>
          </div>
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 min-h-[100px] md:min-h-[140px] flex flex-col justify-center">
            <p className="text-base/relaxed font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Question
            </p>
            <p className="mt-3 text-base font-medium lg:text-lg line-clamp-3">
              {currentQuestion ? currentQuestion.prompt : '—'}
            </p>
            <Badge
              variant="outline"
              className="mt-2 p-2.5 text-base/relaxed border-accent/50 shadow-sm">
              {availableQuestionIds.length} remaining
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/60 p-4">
          <p className="text-base/relaxed font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Answer
          </p>
          <p className="mt-2 text-base/relaxed">
            {state.domain.quizPlay.answerRevealed
              ? (currentQuestion?.answer ?? '—')
              : 'Click reveal to show the answer.'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="px-6 xl:px-8">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            onClick={actions.drawQuizPair}
            disabled={!canDraw}
            className="h-9 w-full font-semibold text-base sm:min-w-32 sm:w-auto">
            Draw Student + Question
          </Button>
          <Button
            variant="secondary"
            onClick={actions.revealAnswer}
            disabled={!currentQuestion || state.domain.quizPlay.answerRevealed}
            className="h-9 w-full font-semibold text-base sm:min-w-32 sm:w-auto">
            Reveal Answer
          </Button>
          <Button
            variant="ghost"
            onClick={actions.resetQuizPlay}
            disabled={!selectedQuizId}
            className="h-9 w-full font-semibold text-base sm:min-w-32 sm:w-auto">
            Reset Round
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
