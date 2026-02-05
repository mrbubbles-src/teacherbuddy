'use client';

import * as React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GraduationCapIcon } from 'lucide-react';

import { SidebarNav } from '@/components/navigation/sidebar-nav';
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
} from '@/components/ui/sidebar';
import Header from './header';

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

export default function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
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
                className="font-semibold group-data-[collapsible=icon]:justify-center [&>svg]:group-data-[collapsible=icon]:size-5">
                <GraduationCapIcon />
                <span className="group-data-[collapsible=icon]:hidden text-lg/relaxed">
                  TeacherBuddy
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <nav aria-label="Primary" className="py-4">
            <SidebarNav pathname={pathname} />
          </nav>
        </SidebarContent>
        <Separator />
        <SidebarFooter>
          <div className="flex items-center justify-between gap-2 px-2 text-sm text-muted-foreground group-data-[collapsible=icon]:justify-center">
            <span className="group-data-[collapsible=icon]:text-xs">
              v1.0.1
            </span>
            <span className="uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
              Classroom
            </span>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <Header meta={meta} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 container mx-auto max-w-6xl h-dvh">
          {children}
        </main>
        {footer ?? null}
      </SidebarInset>
    </SidebarProvider>
  );
}
