import { TeacherBuddyProvider } from '@/context/TeacherBuddyContext';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'TeacherBuddy',
  description:
    'TeacherBuddy, the ultimate companion app for your teaching needs! And the best part? It is completely free and none of your data will EVER leave your local machine!',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '400', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-brand-font`}>
        <TeacherBuddyProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TeacherBuddyProvider>
      </body>
    </html>
  );
}
