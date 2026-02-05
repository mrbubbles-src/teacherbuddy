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
import { PAGE_INFO_BY_PATH, PAGE_INFOS } from '@/lib/page-info';
import Header from './header';

/**
 * Global app shell that renders the sidebar, header, and page content.
 * Pass the page content as children and an optional footer to render below.
 */
export default function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = PAGE_INFO_BY_PATH[pathname];
  const meta = currentPage ?? {
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
              v1.1.1
            </span>
            <span className="uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
              Classroom
            </span>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <Header meta={meta} info={{ currentPath: pathname, pages: PAGE_INFOS }} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 container mx-auto max-w-6xl h-dvh">
          {children}
        </main>
        {footer ?? null}
      </SidebarInset>
    </SidebarProvider>
  );
}
