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
        <header className="flex flex-col gap-4 border-b border-border/60 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3 sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                TeacherBuddy
              </p>
              <h1 className="text-xl font-semibold text-foreground">
                {meta.title}
              </h1>
              {meta.description ? (
                <p className="text-sm text-muted-foreground">
                  {meta.description}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex justify-center sm:justify-center">
            <QuizTimerCard />
          </div>
          <div className="flex justify-end sm:justify-end">
            <ThemeToggle />
          </div>
        </header>
        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-8 container mx-auto">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
