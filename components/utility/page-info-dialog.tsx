'use client';

import type { PageInfo } from '@/lib/page-info';

import { useMemo, useState } from 'react';

import {
  BookOpenIcon,
  CircleHelpIcon,
  LightbulbIcon,
  ListChecksIcon,
  SparklesIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

type PageInfoDialogProps = {
  currentPath: string;
  pages: PageInfo[];
};

/**
 * Renders a friendly help block for one page with visual section markers.
 * Three sections: purpose (what it does), how-to (steps), and outcome (what you get).
 */
const HelpGuide = ({ help, id }: { help: PageInfo['help']; id: string }) => {
  return (
    <div className="space-y-5">
      <section className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary">
          <LightbulbIcon className="size-4 shrink-0" />
          <h3 className="text-lg/relaxed font-semibold">
            In a nutshell
          </h3>
        </div>
        <p className="text-base/relaxed text-pretty text-foreground/85 pl-6">
          {help.purpose}
        </p>
      </section>
      <section className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary">
          <ListChecksIcon className="size-4 shrink-0" />
          <h3 className="text-lg/relaxed font-semibold">
            How to use it
          </h3>
        </div>
        <ol className="list-decimal space-y-1.5 pl-10 text-base/relaxed text-pretty text-foreground/85 marker:text-primary/60 marker:font-semibold">
          {help.howTo.map((step, index) => (
            <li key={`${id}-step-${index + 1}`}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary">
          <SparklesIcon className="size-4 shrink-0" />
          <h3 className="text-lg/relaxed font-semibold">
            What you will get
          </h3>
        </div>
        <p className="text-base/relaxed text-pretty text-foreground/85 pl-6">
          {help.outcome}
        </p>
      </section>
    </div>
  );
};

/**
 * Header info button + slide-in panel that explains the current page.
 * Uses a bottom sheet on mobile/tablet and a right-side panel on desktop.
 * On the dashboard, shows all workflows with tab/select switching.
 */
const PageInfoDialog = ({ currentPath, pages }: PageInfoDialogProps) => {
  const dashboardPages = useMemo(() => pages, [pages]);
  const dashboardPage = dashboardPages.find((page) => page.path === '/');
  const defaultTab = dashboardPage?.id ?? dashboardPages[0]?.id ?? 'dashboard';
  const useCompactSelector = useIsMobile(1024);
  const useBottomSheet = useIsMobile();
  const [activeGuideId, setActiveGuideId] = useState<string>(defaultTab);

  const currentPage = pages.find((page) => page.path === currentPath);
  if (!currentPage) return null;

  const isDashboard = currentPage.path === '/';
  const hasActiveGuide = dashboardPages.some(
    (page) => page.id === activeGuideId,
  );
  const effectiveGuideId = hasActiveGuide ? activeGuideId : defaultTab;
  const activeGuide =
    dashboardPages.find((page) => page.id === effectiveGuideId) ??
    dashboardPages[0] ??
    currentPage;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Open page info"
          />
        }>
        <CircleHelpIcon className="size-4" />
      </SheetTrigger>
      <SheetContent
        side={useBottomSheet ? 'bottom' : 'right'}
        className={
          useBottomSheet
            ? 'max-h-[85dvh] rounded-t-2xl'
            : 'w-full sm:max-w-md md:max-w-lg lg:max-w-xl'
        }>
        <SheetHeader className="pr-12">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="size-4 shrink-0 text-primary" />
            <SheetTitle className="text-xl/relaxed font-bold">
              {isDashboard
                ? 'How TeacherBuddy Works'
                : currentPage.title}
            </SheetTitle>
          </div>
          <SheetDescription className="text-sm/relaxed">
            {isDashboard
              ? 'Pick a tool below to see what it does and how to use it.'
              : currentPage.description}
          </SheetDescription>
        </SheetHeader>

        {isDashboard ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-6 pb-6">
            {useCompactSelector ? (
              <>
                <Select
                  value={activeGuide.id}
                  onValueChange={(value) => {
                    if (!value) return;
                    setActiveGuideId(value);
                  }}>
                  <SelectTrigger className="h-9 w-full text-base/relaxed">
                    <SelectValue placeholder="Select a tool">
                      {activeGuide.title}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    {dashboardPages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <HelpGuide help={activeGuide.help} id={activeGuide.id} />
                </div>
              </>
            ) : (
              <Tabs
                value={activeGuide.id}
                onValueChange={(value) => setActiveGuideId(String(value))}
                className="min-h-0 flex-1 gap-3">
                <div className="w-full overflow-x-auto pb-1">
                  <TabsList
                    variant="line"
                    className="h-auto w-max min-w-full justify-start whitespace-nowrap">
                    {dashboardPages.map((page) => (
                      <TabsTrigger
                        key={page.id}
                        value={page.id}
                        className="flex-none shrink-0 text-base/relaxed text-foreground/80 data-active:text-primary dark:data-active:text-primary">
                        {page.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {dashboardPages.map((page) => (
                    <TabsContent
                      key={page.id}
                      value={page.id}
                      className="text-base/relaxed text-foreground/85">
                      <HelpGuide help={page.help} id={page.id} />
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            )}
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
            <HelpGuide help={currentPage.help} id={currentPage.id} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default PageInfoDialog;
