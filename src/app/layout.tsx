import './globals.css';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { Navigation } from '@/components/Navigation';
import { CookieProvider } from '@/components/CookieProvider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { AnalyticsDebugInfo, SmartPageViewTracker } from '@/components/PageViewTracker';

const lato = Lato({ subsets: ['latin'], weight: ['100', '300', '400', '700', '900'] });

export const metadata: Metadata = {
  title: 'Zyppd - Professional URL Shortener',
  description: 'Create custom short links with analytics, password protection, and custom domains. Transform your link management with our powerful, dark-themed platform.',
  keywords: [
    'URL shortener',
    'link management',
    'analytics',
    'custom domains',
    'password protection',
    'short links',
    'Zyppd'
  ],
  authors: [{ name: 'Zyppd Team', url: 'https://www.zyppd.cc' }],
  creator: 'Zyppd',
  publisher: 'Zyppd',
  openGraph: {
    type: 'website',
    url: 'https://www.zyppd.cc',
    siteName: 'Zyppd',
    title: 'Zyppd - Professional URL Shortener',
    description: 'Create custom short links with analytics, password protection, and custom domains.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zyppd - Professional URL Shortener',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zyppd',
    creator: '@zyppd',
    title: 'Zyppd - Professional URL Shortener',
    description: 'Create custom short links with analytics, password protection, and custom domains.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={lato.className}>
        <AuthProvider>
          <CookieProvider>
            <Navigation />
            {children}
            {/* Analytics only load after user consent */}
            <AnalyticsProvider />
            {/* Smart page view tracking with consent checks */}
            <SmartPageViewTracker />
            {/* Debug info in development mode */}
            <AnalyticsDebugInfo />
          </CookieProvider>
        </AuthProvider>
      </body>
    </html>
  );
}