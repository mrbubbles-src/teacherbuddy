'use client';

import * as React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GraduationCapIcon } from 'lucide-react';

import { SidebarNav } from '@/components/navigation/sidebar-nav';
import QuizTimerCard from '@/components/play/quiz-timer-card';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import ThemeToggle from '@/components/utility/theme-toggle';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Dashboard',
    description: 'Choose a workflow to get started.',
  },
  '/students': {
    title: 'Student Management',
    description: 'Add students, mark absences, and manage your roster.',
  },
  '/generator': {
    title: 'Student Generator',
    description: 'Pick a random student without repeats.',
  },
  '/breakout-rooms': {
    title: 'Breakout Rooms',
    description: 'Create randomized student groups for breakout sessions.',
  },
  '/quizzes': {
    title: 'Quiz Builder',
    description: 'Create and update quizzes with custom questions.',
  },
  '/play': {
    title: 'Quiz Play',
    description: 'Draw a student and a question, then reveal the answer.',
  },
  '/projects': {
    title: 'Project Lists',
    description: 'Build project lists and group students from your roster.',
  },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? {
    title: 'TeacherBuddy',
    description: '',
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                size="lg"
                className="font-semibold">
                <GraduationCapIcon />
                <span>TeacherBuddy</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <nav aria-label="Primary">
            <SidebarNav pathname={pathname} />
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between gap-2 px-2 text-sm text-muted-foreground">
            <span>v1.0.1</span>
            <span className="uppercase tracking-[0.2em]">Classroom</span>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex flex-col gap-4 border-b border-border/60 px-4 py-3 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-3 md:px-6 lg:px-8 xl:grid-cols-[1fr_auto_1fr] xl:px-10 2xl:px-12">
          {/* Row 1: Title + Theme Toggle (mobile flex row, grid col 1 + 2 on md/lg, col 1 + 3 on xl+) */}
          <div className="flex min-w-0 items-start justify-between gap-3 md:contents">
            {/* Title area */}
            <div className="flex min-w-0 flex-1 items-center gap-3 md:col-start-1 md:row-start-1">
              <SidebarTrigger className="shrink-0" />
              <Separator orientation="vertical" className="h-5 shrink-0" />
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                  TeacherBuddy
                </p>
                <h1 className="truncate text-base font-semibold text-foreground md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  {meta.title}
                </h1>
                {meta.description ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm lg:text-sm xl:text-base 2xl:text-lg">
                    {meta.description}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Theme toggle - col 2 on md/lg, col 3 on xl+ */}
            <div className="shrink-0 self-center md:col-start-2 md:row-start-1 md:justify-self-end xl:col-start-3">
              <ThemeToggle />
            </div>
          </div>

          {/* Timer - full width row 2 on md/lg, col 2 row 1 on xl+ */}
          <div className="flex min-w-0 justify-center md:col-span-2 md:row-start-2 xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <QuizTimerCard />
          </div>
        </header>
        <section className="flex-1 px-4 py-6 md:px-6 lg:px-8 container mx-auto">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
