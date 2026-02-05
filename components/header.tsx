import Link from 'next/link';

import QuizTimerCard from './play/quiz-timer-card';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import ThemeToggle from './utility/theme-toggle';
import PageInfoDialog from './utility/page-info-dialog';
import type { PageInfo } from '@/lib/page-info';

type HeaderProps = {
  meta: { title: string; description: string };
  info: { currentPath: string; pages: PageInfo[] };
};

/**
 * Top navigation header with page title, description, and utility actions.
 * Provide the current page meta and info data to power the info dialog.
 */
const Header = ({ meta, info }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-4 border-b border-border/60 px-4 py-3 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-3 md:px-6 lg:px-8 xl:grid-cols-[1fr_auto_1fr] xl:px-10 2xl:px-12">
      <div className="flex min-w-0 items-start justify-between gap-3 md:contents">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:col-start-1 md:row-start-1">
          <SidebarTrigger className="shrink-0 touch-hitbox" />
          <Separator orientation="vertical" className="h-25 shrink-0" />
          <div className="flex min-w-0 flex-col">
            <Link
              href="/"
              className="truncate touch-hitbox text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground  transition-colors md:text-base lg:text-lg xl:text-xl 2xl:text-2xl hover:text-primary">
              TeacherBuddy
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-lg font-semibold text-primary md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
                {meta.title}
              </h1>
              <PageInfoDialog
                currentPath={info.currentPath}
                pages={info.pages}
              />
            </div>
            {meta.description ? (
              <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm lg:text-sm xl:text-base 2xl:text-lg">
                {meta.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 self-center md:col-start-2 md:row-start-1 md:justify-self-end xl:col-start-3">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex min-w-0 justify-center md:col-span-2 md:row-start-2 xl:col-span-1 xl:col-start-2 xl:row-start-1">
        <QuizTimerCard />
      </div>
    </header>
  );
};

export default Header;
