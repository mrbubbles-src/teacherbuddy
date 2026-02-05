'use client';

import { getPageInfoByPath, PAGE_INFOS } from '@/lib/page-info';

import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
import Icon from '@/public/images/teacherbuddy-icon-transparent.png';
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
  const currentPage = getPageInfoByPath(pathname);
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
                <span className="relative size-10 shrink-0 overflow-hidden rounded-[calc(var(--radius-sm)+2px)] flex items-center justify-center group-data-[collapsible=icon]:size-8">
                  <Image
                    src={Icon}
                    alt="TeacherBuddy Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 48px) 32px, 40px"
                    priority
                    placeholder="blur"
                    blurDataURL={Icon.blurDataURL}
                  />
                </span>

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
              v1.1.3
            </span>
            <span className="uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
              Classroom
            </span>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <Header
          meta={meta}
          info={{ currentPath: pathname, pages: PAGE_INFOS }}
        />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 container mx-auto max-w-6xl h-dvh">
          {children}
        </main>
        {footer ?? null}
      </SidebarInset>
    </SidebarProvider>
  );
}
