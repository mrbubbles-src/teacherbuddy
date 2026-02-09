import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import packageJson from '@/package.json';

import AppShell from '@/components/app-shell';
import Footer from '@/components/footer';
import PrivacyNotice from '@/components/privacy-notice';
import { Toaster } from '@/components/ui/sonner';
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      'https://teacherbuddy.mrbubbles-src.dev',
  ),
  title: {
    template: '%s | TeacherBuddy',
    default: 'TeacherBuddy — Free Classroom Tools for Teachers',
  },
  description:
    'Manage students, run quizzes, and organize class activities in one place.',
  openGraph: {
    siteName: 'TeacherBuddy',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'TeacherBuddy — free classroom management dashboard',
      },
    ],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
    creator: '@_MstrBubbles',
  },
  other: { 'apple-mobile-web-app-title': 'TeacherBuddy' },
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
  const appVersion = packageJson.version;

  return (
    <html lang="en_GB" suppressHydrationWarning>
      <head>
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
              applicationCategory: 'EducationalApplication',
              applicationSubCategory: 'Classroom Management',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppStoreProvider>
            <AppShell appVersion={appVersion} footer={<Footer />}>
              {children}
            </AppShell>
            <PrivacyNotice />
            <Toaster closeButton position="bottom-center" />
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
