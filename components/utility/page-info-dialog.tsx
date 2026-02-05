'use client';

import type { PageInfo } from '@/lib/page-info';

import { CircleHelpIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <p className="text-sm/relaxed font-semibold text-foreground">
          What this page does
        </p>
        <p className="!text-base !leading-relaxed text-foreground/85">
          {help.purpose}
        </p>
      </section>
      <section className="space-y-1">
        <p className="text-sm/relaxed font-semibold text-foreground">
          What to do
        </p>
        <ol className="list-decimal space-y-1 pl-5 !text-base !leading-relaxed text-foreground/85">
          {help.howTo.map((step, index) => (
            <li key={`${id}-step-${index + 1}`}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="space-y-1">
        <p className="text-sm/relaxed font-semibold text-foreground">
          What you get
        </p>
        <p className="!text-base !leading-relaxed text-foreground/85">
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
  const currentPage = pages.find((page) => page.path === currentPath);
  if (!currentPage) return null;

  const dashboardPage = pages.find((page) => page.path === '/');
  const defaultTab = dashboardPage?.id ?? pages[0]?.id ?? 'dashboard';
  const isDashboard = currentPage.path === '/';

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Open page info"
          />
        }>
        <CircleHelpIcon className="size-4" />
      </AlertDialogTrigger>
      <AlertDialogContent className="!w-[min(96vw,72rem)] !max-w-[72rem] gap-5 sm:!max-w-[72rem]">
        <AlertDialogHeader className="text-left sm:place-items-start sm:text-left">
          <AlertDialogTitle className="!text-xl !leading-relaxed">
            {isDashboard
              ? 'TeacherBuddy Workflows'
              : `About ${currentPage.title}`}
          </AlertDialogTitle>
          <AlertDialogDescription className="!text-base !leading-relaxed text-foreground/80">
            {isDashboard
              ? 'Select a workflow tab to see what each tool does.'
              : 'Follow this quick guide to understand the page and what to do next.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isDashboard ? (
          <Tabs defaultValue={defaultTab} className="gap-3">
            <div className="w-full overflow-x-auto pb-1">
              <TabsList
                variant="line"
                className="h-auto w-max min-w-full justify-start whitespace-nowrap">
                {pages.map((page) => (
                  <TabsTrigger
                    key={page.id}
                    value={page.id}
                    className="flex-none shrink-0 !text-lg !leading-relaxed text-foreground/80 data-active:text-primary dark:data-active:text-primary">
                    {page.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {pages.map((page) => (
              <TabsContent
                key={page.id}
                value={page.id}
                className="px-2 py-1 !text-base !leading-relaxed text-foreground/85">
                <HelpGuide help={page.help} id={page.id} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <HelpGuide help={currentPage.help} id={currentPage.id} />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PageInfoDialog;
