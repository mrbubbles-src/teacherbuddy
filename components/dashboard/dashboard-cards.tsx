import Link from 'next/link';

import {
  ClipboardListIcon,
  FolderKanbanIcon,
  LayoutGridIcon,
  PlayCircleIcon,
  ShuffleIcon,
  UsersIcon,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { badgeVariants } from '../ui/badge-variants';
import { buttonVariants } from '../ui/button-variants';

const cards = [
  {
    title: 'Students',
    description: 'Add students, mark absences, and keep your roster tidy.',
    href: '/students',
    icon: UsersIcon,
    badge: 'Roster',
  },
  {
    title: 'Generator',
    description: 'Randomly pick a student without repeats until reset.',
    href: '/generator',
    icon: ShuffleIcon,
    badge: 'Random',
  },
  {
    title: 'Breakout Rooms',
    description: 'Create randomized student groups for breakout sessions.',
    href: '/breakout-rooms',
    icon: UsersIcon,
    badge: 'Groups',
  },
  {
    title: 'Quiz Builder',
    description: 'Create quizzes with custom questions and answers.',
    href: '/quizzes',
    icon: ClipboardListIcon,
    badge: 'Create',
  },
  {
    title: 'Quiz Play',
    description: 'Draw a student + question, then reveal the answer.',
    href: '/play',
    icon: PlayCircleIcon,
    badge: 'Live',
  },
  {
    title: 'Projects',
    description: 'Build student lists and manage grouped project teams.',
    href: '/projects',
    icon: FolderKanbanIcon,
    badge: 'Lists',
  },
];

export default function DashboardCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGridIcon className="size-4" />
            Central Dashboard
          </CardTitle>
          <CardDescription>
            Choose a workflow to manage students, projects, or run your next
            quiz.
          </CardDescription>
        </CardHeader>
      </Card>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <CardTitle className="text-base">{card.title}</CardTitle>
              </div>
              <span className={badgeVariants({ variant: 'secondary' })}>
                {card.badge}
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
              <Link
                data-slot="button"
                href={card.href}
                className={buttonVariants({ size: 'sm', className: 'w-fit' })}>
                Open {card.title}
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
