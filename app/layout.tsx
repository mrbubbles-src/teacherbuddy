import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/theme-provider';
import { AppStoreProvider } from '@/context/app-store';
import AppShell from '@/components/app-shell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TeacherBuddy',
  description:
    'Manage students, build quizzes, and draw random pairs without repeats.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="TeacherBuddy" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <AppStoreProvider>
            <AppShell>{children}</AppShell>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
