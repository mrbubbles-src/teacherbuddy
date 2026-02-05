import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import {
  DEFAULT_SITE_DESCRIPTION,
  resolveMetadataBase,
  SHARED_OPEN_GRAPH,
  SHARED_TWITTER,
} from '@/lib/metadata';

import AppShell from '@/components/app-shell';
import Footer from '@/components/footer';
import { AppStoreProvider } from '@/context/app-store';
import { ThemeProvider } from '@/context/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Defines global metadata defaults used by all routes unless overridden.
 * Includes site title template, base URL resolution, and shared social tags.
 */
export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: 'TeacherBuddy',
    template: '%s | TeacherBuddy',
  },
  description: DEFAULT_SITE_DESCRIPTION,
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: 'TeacherBuddy',
    description: DEFAULT_SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    ...SHARED_TWITTER,
    title: 'TeacherBuddy',
    description: DEFAULT_SITE_DESCRIPTION,
  },
};

/**
 * Renders the shared HTML shell and providers for all application routes.
 * Wrap page content in this layout so theme, state, sidebar, and footer stay consistent.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="TeacherBuddy" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppStoreProvider>
            <AppShell footer={<Footer />}>{children}</AppShell>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
