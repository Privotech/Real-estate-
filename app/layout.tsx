import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nigeria Property Centre | Find Property for Sale & Rent in Nigeria',
  description:
    'Nigeria Property Centre - browse thousands of verified flats, detached houses, land, and short let apartments for sale and rent in Lagos, Abuja, Port Harcourt, and across Nigeria.',
  openGraph: {
    title: 'Nigeria Property Centre | Property for Sale and Rent in Nigeria',
    description:
      'Verified houses, luxury duplexes, flats, land and commercial properties in Lagos, Abuja, and all Nigerian states.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nigeria Property Centre',
    description:
      'Search verified homes, land, and short let apartments across Nigeria.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
