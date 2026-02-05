import GeneratorCardSkeleton from '@/components/loading/generator-card-skeleton';
import GeneratorCard from '@/components/generator/generator-card';

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <GeneratorCard skeleton={<GeneratorCardSkeleton />} />
    </div>
  );
}
