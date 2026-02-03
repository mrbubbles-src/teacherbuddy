"use client";

import AppSidebar from "@/components/app-sidebar";
import StudentNameGenerator from "@/components/student-name-generator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AppShell() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-svh">
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
            <SidebarTrigger />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Navigation
              </span>
              <span className="text-sm font-semibold text-foreground">
                Random Student Generator
              </span>
            </div>
          </header>
          <StudentNameGenerator />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
