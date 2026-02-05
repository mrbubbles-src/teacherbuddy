import Image from 'next/image';
import Link from 'next/link';

import Logo from '../public/images/teacherbuddy-logo.png';
import { Separator } from './ui/separator';

/**
 * Renders the global footer with author, repository, and theme credits.
 * Appears at the bottom of the app shell across all routes.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-sm text-muted-foreground py-6 px-4 container mx-auto flex flex-col gap-4 items-center">
      <Separator orientation="horizontal" className="my-4 w-full" />
      <section className="max-w-full md:max-w-2/3 lg:max-w-2/4 xl:max-w-2/6">
        <Image
          src={Logo}
          alt="TeacherBuddy Logo"
          width={895}
          height={372}
          placeholder="blur"
          blurDataURL={Logo.blurDataURL}
        />
      </section>
      <section className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
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
      </section>
      <section className="text-center">
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
      </section>
      <section className="flex items-center gap-2">
        <Link
          href="https://mrbubbles-src.dev/de/impressum"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:text-primary/70">
          Privacy Policy
        </Link>
        <Separator orientation="vertical" className="h-4 shrink-0" />
        <Link
          href="https://mrbubbles-src.dev/de/datenschutz"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:text-primary/70">
          Legal Notice
        </Link>
      </section>
    </footer>
  );
};

export default Footer;
