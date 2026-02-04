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
        <header className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-4 border-b border-border/60 px-4 py-3 md:grid-cols-[1fr_auto_1fr] md:grid-rows-[auto] md:items-center md:gap-3 md:px-6">
          <div className="row-start-1 flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-sm lg:text-base">
                TeacherBuddy
              </p>
              <h1 className="text-lg font-semibold text-foreground md:text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl">
                {meta.title}
              </h1>
              {meta.description ? (
                <p className="text-sm text-muted-foreground lg:text-base xl:text-lg 2xl:text-lg">
                  {meta.description}
                </p>
              ) : null}
            </div>
          </div>
          <div className="row-start-2 col-span-2 flex justify-center md:row-start-1 md:col-span-1 md:justify-center">
            <QuizTimerCard />
          </div>
          <div className="row-start-1 flex justify-end md:col-start-3 md:justify-end">
            <ThemeToggle />
          </div>
        </header>
        <section className="flex-1 px-4 py-6 md:px-6 lg:px-8 container mx-auto">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
