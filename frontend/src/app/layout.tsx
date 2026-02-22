import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { TimezoneProvider } from "../context/TimezoneContext";
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'RaceSchedules - Home',
  },
  description: "Your go-to calendar for motorsport schedules. Follow Formula 1, MotoGP, WEC, and many other racing series — all in one place, always up to date.",
  metadataBase: new URL('https://raceschedules.ibrahima.dev'),
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
              "url": "https://raceschedules.ibrahima.dev/"
            }),
          }}
        />
      </head>
      <body >
        <TimezoneProvider>
          {children}
          <Analytics />
        </TimezoneProvider>
      </body>
    </html>
  );
}
