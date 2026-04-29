import type { Metadata, Viewport } from "next";
import Script from 'next/script';
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
    template: '%s | RaceSchedules',
    default: 'RaceSchedules | The Ultimate Motorsport Calendar',
  },
  description: "Looking for a website to see every motorsport schedule in one place? RaceSchedules is your ultimate motorsport calendar for F1, MotoGP, WEC, NASCAR, and more.",
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
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Script
          id="json-ld-website"
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
