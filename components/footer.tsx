import Image from 'next/image';
import Link from 'next/link';

import { SparklesIcon } from 'lucide-react';

import Logo from '@/public/images/teacherbuddy-logo.png';
import { Separator } from './ui/separator';

/**
 * Renders the global footer with author, repository, and theme credits.
 * Styled to match the design-6 command center aesthetic with dot-pattern texture.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-border/40">
      {/* Subtle dot-pattern texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--primary) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative container mx-auto flex flex-col items-center gap-4 px-4 py-6 text-sm text-muted-foreground">
        <section className="max-w-full md:max-w-2/3 lg:max-w-2/4 xl:max-w-2/6">
          <Image
            src={Logo.src}
            alt="TeacherBuddy logo — classroom tools for teachers"
            width={895}
            height={372}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, (max-width: 1280px) 50vw, 33vw"
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
              className="touch-hitbox font-medium text-primary hover:text-primary/70">
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
              className="touch-hitbox font-medium text-primary hover:text-primary/70">
              TeacherBuddy
            </Link>
          </p>
        </section>
        <section className="text-center">
          <p className="flex items-center gap-1.5">
            <SparklesIcon className="size-3 text-primary" />
            Color theme inspired by{' '}
            <Link
              href="https://github.com/catppuccin/catppuccin"
              target="_blank"
              rel="noreferrer"
              className="touch-hitbox font-medium text-primary hover:text-primary/70">
              Catppuccin
            </Link>
          </p>
        </section>
        <section className="flex items-center gap-2">
          <Link
            href="https://mrbubbles-src.dev/de/impressum"
            target="_blank"
            rel="noreferrer"
            className="touch-hitbox font-medium text-primary hover:text-primary/70">
            Privacy Policy
          </Link>
          <Separator orientation="vertical" className="h-4 shrink-0" />
          <Link
            href="https://mrbubbles-src.dev/de/datenschutz"
            target="_blank"
            rel="noreferrer"
            className="touch-hitbox font-medium text-primary hover:text-primary/70">
            Legal Notice
          </Link>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
