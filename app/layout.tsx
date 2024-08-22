import type { Metadata } from 'next';
import './globals.css';
import Umami from './thridparties/umami';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Footer from './components/footer';

export const metadata: Metadata = {
  title: 'Screenshots of Every New Product and Startup! - HuntScreens.com',
  description: 'Captures and organizes screenshots of the latest product and startup launches. Quickly browse newly released products and catch the latest innovations. Updated daily, never miss an exciting new product debut.',
  keywords: ['latest product launches', 'screenshots', 'snapshots', 'organizes', 'newly released products', 'producthunt', 'indiehackers', 'Y combinator', 'startups'],
  alternates: {
    types: {
      'application/rss+xml': [
        { url: `https://huntscreens.com/rss.xml` }
      ]
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
          <Toaster />
          <Umami />
        </ThemeProvider>
      </body>
    </html>
  )
}
