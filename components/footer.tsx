import Link from 'next/link';

import { Separator } from './ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-sm text-muted-foreground py-6 px-4 container mx-auto flex flex-col gap-4 items-center">
      <Separator orientation="horizontal" className="my-4 w-full" />
      <article className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <p className="text-center sm:text-left">
          &copy; {currentYear}{' '}
          <Link
            href="https://mrbubbles-src.dev"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:text-primary/70">
            mrbubbles-src
          </Link>
        </p>
        <Separator
          orientation="vertical"
          className="hidden h-4 shrink-0 sm:block"
        />
        <p className="text-center sm:text-left">
          Source code:{' '}
          <Link
            href="https://github.com/mrbubbles-src/teacherbuddy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:text-primary/70">
            TeacherBuddy
          </Link>
        </p>
      </article>
      <article className="text-center">
        <p>
          Color theme inspired by{' '}
          <Link
            href="https://github.com/catppuccin/catppuccin"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:text-primary/70">
            Catppuccin
          </Link>
        </p>
      </article>
    </footer>
  );
};

export default Footer;
