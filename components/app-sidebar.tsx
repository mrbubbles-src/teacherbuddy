"use client";

import { BookOpenText, ListChecks, Shuffle, UserPlus } from "lucide-react";

import ThemeToggle from "@/components/utility/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    label: "Add Students",
    href: "#add-students",
    icon: UserPlus,
  },
  {
    label: "Generator",
    href: "#generator",
    icon: Shuffle,
  },
  {
    label: "Student List",
    href: "#student-list",
    icon: ListChecks,
  },
  {
    label: "About",
    href: "#about",
    icon: BookOpenText,
  },
];

/**
 * Renders the compact legacy sidebar navigation for hash-link workflows.
 * Includes theme controls and quick links for single-page sections.
 */
export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-1">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            TB
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Teacherbuddy
            </span>
            <span className="text-sm font-semibold text-foreground">
              Student Generator
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<a href={item.href} />}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center justify-between rounded-md border border-sidebar-border/70 bg-sidebar-accent/20 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <span className="text-xs font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
