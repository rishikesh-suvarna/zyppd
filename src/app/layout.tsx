import './globals.css';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { Navigation } from '@/components/Navigation';
import { PageTransition } from '@/components/PageTransition';

const lato = Lato({ subsets: ['latin'], weight: ['100', '300', '400', '700', '900'] });

export const metadata: Metadata = {
  title: 'Zyppd - Professional URL Shortener',
  description: 'Create custom short links with analytics, password protection, and custom domains.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <AuthProvider>
          <Navigation />
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
      </body>
    </html>
  );
}