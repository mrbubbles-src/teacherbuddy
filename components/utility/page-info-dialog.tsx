'use client';

import type { PageInfo } from '@/lib/page-info';

import { useMemo, useState } from 'react';

import { CircleHelpIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

type PageInfoDialogProps = {
  currentPath: string;
  pages: PageInfo[];
};

/**
 * Renders a readable tutorial block for one page.
 * It explains the page purpose, then gives clear action steps and the
 * expected result.
 */
const HelpGuide = ({ help, id }: { help: PageInfo['help']; id: string }) => {
  return (
    <div className="space-y-4">
      <section className="space-y-1">
        <h3 className="text-xl/relaxed font-semibold text-foreground">
          What this page does
        </h3>
        <p className="text-lg/relaxed text-pretty text-foreground/85">
          {help.purpose}
        </p>
      </section>
      <section className="space-y-1">
        <h3 className="text-xl/relaxed font-semibold text-foreground">
          What to do
        </h3>
        <ol className="list-decimal space-y-1 pl-5 text-lg/relaxed text-pretty text-foreground/85">
          {help.howTo.map((step, index) => (
            <li key={`${id}-step-${index + 1}`}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="space-y-1">
        <h3 className="text-xl/relaxed font-semibold text-foreground">
          What you get
        </h3>
        <p className="text-lg/relaxed text-pretty text-foreground/85">
          {help.outcome}
        </p>
      </section>
    </div>
  );
};

/**
 * Header info button + modal that explains the current page.
 * Provide the current pathname and the page info list; it returns null when
 * the path does not match any page.
 */
const PageInfoDialog = ({ currentPath, pages }: PageInfoDialogProps) => {
  const dashboardPages = useMemo(() => pages, [pages]);
  const dashboardPage = dashboardPages.find((page) => page.path === '/');
  const defaultTab = dashboardPage?.id ?? dashboardPages[0]?.id ?? 'dashboard';
  const useDropdownSelector = useIsMobile(1024);
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
    <Dialog disablePointerDismissal={false}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Open page info"
          />
        }>
        <CircleHelpIcon className="size-4" />
      </DialogTrigger>
      <DialogContent className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none p-0 md:top-1/2 md:left-1/2 md:h-auto md:max-h-[88dvh] md:w-[min(94vw,52rem)] md:max-w-208 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl lg:w-[min(92vw,64rem)] lg:max-w-5xl xl:max-h-[90dvh] xl:w-[min(90vw,72rem)] xl:max-w-6xl">
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10"
              aria-label="Close info dialog"
            />
          }>
          <XIcon className="size-4" />
          <span className="sr-only">Close info dialog</span>
        </DialogClose>
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader className="px-4 pb-2 pt-4 pr-14 text-left md:px-6 md:pt-6 md:pr-16">
            <DialogTitle className="text-2xl/relaxed!">
              {isDashboard
                ? 'TeacherBuddy Workflows'
                : `About ${currentPage.title}`}
            </DialogTitle>
            <DialogDescription className="text-base/relaxed text-foreground/80">
              {isDashboard
                ? 'Select a workflow tab to see what each tool does.'
                : 'Follow this quick guide to understand the page and what to do next.'}
            </DialogDescription>
          </DialogHeader>
          {isDashboard ? (
            <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 md:px-6 md:pb-6">
              {useDropdownSelector ? (
                <Select
                  value={activeGuide.id}
                  onValueChange={(value) => {
                    if (!value) return;
                    setActiveGuideId(value);
                  }}>
                  <SelectTrigger className="h-9 w-full text-base! leading-relaxed!">
                    <SelectValue placeholder="Select a workflow">
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
              ) : null}
              {useDropdownSelector ? (
                <div className="min-h-0 flex-1 overflow-y-auto mt-2">
                  <div className="px-2 py-1 text-base! leading-relaxed! text-foreground/85">
                    <HelpGuide help={activeGuide.help} id={activeGuide.id} />
                  </div>
                </div>
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
                          className="flex-none shrink-0 text-lg! leading-relaxed! text-foreground/80 data-active:text-primary dark:data-active:text-primary">
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
                        className="px-2 py-1 text-base! leading-relaxed! text-foreground/85">
                        <HelpGuide help={page.help} id={page.id} />
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              )}
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-6 md:pb-6">
              <div className="px-2 py-1 text-base! leading-relaxed! text-foreground/85">
                <HelpGuide help={currentPage.help} id={currentPage.id} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PageInfoDialog;
