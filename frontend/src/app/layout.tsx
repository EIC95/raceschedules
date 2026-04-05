import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { TimezoneProvider } from "../context/TimezoneContext";
import Link from 'next/link';
import TimezoneToggle from '../components/TimezoneToggle';
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'RaceSchedules - Home',
  },
  description: "Your go-to calendar for motorsport schedules. Follow Formula 1, MotoGP, WEC, and many other racing series — all in one place, always up to date.",
  metadataBase: new URL('https://raceschedules.app'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "RaceSchedules",
              "url": "https://raceschedules.app/"
            }),
          }}
        />
      </head>
      <body>
        <TimezoneProvider>
          <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-96 flex items-center justify-between h-14">
              <Link
                href="/"
                className="text-xl font-extrabold text-black dark:text-white uppercase tracking-tight hover:opacity-70 transition-opacity duration-200"
              >
                RACESCHEDULES
              </Link>
              <TimezoneToggle />
            </div>
          </header>
          {children}
          <Analytics />
        </TimezoneProvider>
      </body>
    </html>
  );
}
