import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { TimezoneProvider } from "../context/TimezoneContext";
import { ThemeProvider } from "../context/ThemeContext";
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeedbackBanner from '../components/FeedbackBanner';
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

// Runs before React hydrates — prevents flash of wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
        <ThemeProvider>
          <TimezoneProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
            <Analytics />
            <FeedbackBanner />
          </TimezoneProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
