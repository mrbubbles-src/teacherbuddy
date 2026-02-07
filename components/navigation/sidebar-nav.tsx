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
    accentColor: 'var(--primary)',
  },
  {
    title: 'Students',
    href: '/students',
    icon: UsersIcon,
    accentColor: 'var(--chart-1)',
  },
  {
    title: 'Generator',
    href: '/generator',
    icon: ShuffleIcon,
    accentColor: 'var(--chart-2)',
  },
  {
    title: 'Breakout Rooms',
    href: '/breakout-rooms',
    icon: UsersIcon,
    accentColor: 'var(--chart-4)',
  },
  {
    title: 'Quizzes',
    href: '/quizzes',
    icon: ClipboardListIcon,
    accentColor: 'var(--chart-3)',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanbanIcon,
    accentColor: 'var(--chart-5)',
  },
  {
    title: 'Play',
    href: '/play',
    icon: PlayCircleIcon,
    accentColor: 'var(--chart-4)',
  },
];

/**
 * Renders primary app navigation links with phase-colored active indicators.
 * Each route has a distinct accent color matching the design-6 phase system.
 */
export function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <SidebarMenu className="gap-1.5 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              render={<Link href={item.href} />}
              isActive={isActive}
              title={item.title}
              className="relative overflow-hidden [&>span]:group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:justify-center [&>svg]:group-data-[collapsible=icon]:size-5"
              style={
                isActive
                  ? {
                      borderLeft: `3px solid ${item.accentColor}`,
                      backgroundColor: `color-mix(in oklch, ${item.accentColor} 8%, transparent)`,
                    }
                  : undefined
              }>
              <Icon
                style={isActive ? { color: item.accentColor } : undefined}
              />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
