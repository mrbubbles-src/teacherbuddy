import Link from 'next/link';

import {
  ClipboardListIcon,
  FolderKanbanIcon,
  LayoutGridIcon,
  PlayCircleIcon,
  ShuffleIcon,
  UsersIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '../ui/badge';

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
      <Card className="shadow-md lg:col-span-2 lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
        <CardHeader className="lg:px-6 xl:px-8">
          <CardTitle className="flex items-center gap-2 lg:text-lg">
            <LayoutGridIcon className="size-4" />
            Central Dashboard
          </CardTitle>
          <CardDescription className="lg:text-base/relaxed">
            Choose a workflow to manage students, projects, or run your next
            quiz.
          </CardDescription>
        </CardHeader>
      </Card>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
            <CardHeader className="flex flex-row items-start justify-between gap-2 lg:px-6 xl:px-8">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <CardTitle className="text-base lg:text-lg">
                  {card.title}
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className="p-2.5 text-sm border-accent/50 shadow-sm">
                {card.badge}
              </Badge>
            </CardHeader>
            <CardContent className="h-full px-6 xl:px-8 ">
              <p className="text-sm text-muted-foreground lg:text-base/relaxed">
                {card.description}
              </p>
            </CardContent>
            <CardFooter className="px-6 xl:px-8">
              <Button className="w-full md:w-5/12 text-base" variant="default">
                <Link href={card.href}>Open {card.title}</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
