import QuizPlayCardSkeleton from '@/components/loading/quiz-play-card-skeleton';
import QuizPlayCard from '@/components/play/quiz-play-card';

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <QuizPlayCard skeleton={<QuizPlayCardSkeleton />} />
    </div>
  );
}
