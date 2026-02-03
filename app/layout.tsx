import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
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
  title: 'Random Studentname Generator',
  description: 'Keep student names in local storage, then generate a random pick until everyone has been called.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='de' suppressHydrationWarning>
      <head>
      <meta name="apple-mobile-web-app-title" content="Random Studentname Generator" />
      </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider attribute='class' defaultTheme='dark'>
        {children}
      </ThemeProvider>
        </body>
    </html>
  );
}
