import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import AppShell from '@/components/app-shell';
import Footer from '@/components/footer';
import PrivacyNotice from '@/components/privacy-notice';
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    ),
    title: 'TeacherBuddy',
    description:
      'Manage students, run quizzes, and organize class activities in one place.',
    openGraph: {
      title: 'TeacherBuddy',
      description:
        'Manage students, run quizzes, and organize class activities in one place.',
      siteName: 'https://teacherbuddy.mrbubbles-src.dev',
      images: [
        {
          url: 'https://teacherbuddy.mrbubbles-src.dev/api/og',
          width: 1200,
          height: 630,
          alt: 'TeacherBuddy Logo',
        },
      ],
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TeacherBuddy',
      description:
        'Manage students, run quizzes, and organize class activities in one place.',
      images: ['https://teacherbuddy.mrbubbles-src.dev/api/og'],
      creator: '@_MstrBubbles',
    },
    other: { 'apple-mobile-web-app-title': 'teacherbuddy.mrbubbles-src.dev' },
  };
}

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
        <meta
          property="og:url"
          content="https://teacherbuddy.mrbubbles-src.dev/api/og"
        />
        <link rel="canonical" href="https://teacherbuddy.mrbubbles-src.dev" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'TeacherBuddy',
              description:
                'Manage students, run quizzes, and organize class activities in one place.',
              url: 'https://teacherbuddy.mrbubbles-src.dev',
              applicationCategory: 'Education',
              applicationSubCategory: 'Classroom Management',
              applicationSuite: 'TeacherBuddy',
              applicationVersion: '1.1.3',
              applicationInstallUrl:
                'https://teacherbuddy.mrbubbles-src.dev/install',
              applicationUpdateUrl:
                'https://teacherbuddy.mrbubbles-src.dev/update',
              applicationUpdateVersion: '1.1.3',
              applicationUpdateStatus: 'available',
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppStoreProvider>
            <AppShell footer={<Footer />}>{children}</AppShell>
            <PrivacyNotice />
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
