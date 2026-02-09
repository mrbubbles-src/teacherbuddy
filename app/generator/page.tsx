import React from 'react';

import { Metadata } from 'next';

import GeneratorCard from '@/components/generator/generator-card';
import GeneratorCardSkeleton from '@/components/loading/generator-card-skeleton';

export const metadata: Metadata = {
  title: 'Student Generator',
  description:
    'Randomly pick students from your roster without repeats — perfect for fair participation in class.',
};

/**
 * Renders the random student generator workflow.
 * Displays the generator card with a server-rendered loading fallback.
 */
export default function Page() {
  return (
    <div className="max-w-6xl mx-auto">
      <GeneratorCard skeleton={<GeneratorCardSkeleton />} />
    </div>
  );
}
