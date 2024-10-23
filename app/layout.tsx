import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teachers helpdesk',
  description: 'The ultimate teachers helpdesk to organize your class.',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
