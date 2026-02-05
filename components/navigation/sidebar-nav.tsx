'use client';

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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutGridIcon,
  },
  {
    title: 'Students',
    href: '/students',
    icon: UsersIcon,
  },
  {
    title: 'Generator',
    href: '/generator',
    icon: ShuffleIcon,
  },
  {
    title: 'Breakout Rooms',
    href: '/breakout-rooms',
    icon: UsersIcon,
  },
  {
    title: 'Quizzes',
    href: '/quizzes',
    icon: ClipboardListIcon,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanbanIcon,
  },
  {
    title: 'Play',
    href: '/play',
    icon: PlayCircleIcon,
  },
];

/**
 * Renders primary app navigation links with active-route highlighting.
 * Pass the current pathname so the matching item is marked as active.
 */
export function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <SidebarMenu className="gap-2 px-2 ">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              render={<Link href={item.href} />}
              isActive={isActive}
              title={item.title}
              className="[&>span]:group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:justify-center [&>svg]:group-data-[collapsible=icon]:size-5">
              <Icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
