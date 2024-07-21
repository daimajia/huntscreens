import type { Metadata } from 'next'
import './globals.css'
import Umami from './thridparties/umami'
import { ThemeProvider } from './components/theme-provider'

export const metadata: Metadata = {
  title: 'Screenshots of Every New Product and Startup! - HuntScreens.com',
  description: 'Captures and organizes screenshots of the latest product and startup launches. Quickly browse newly released products and catch the latest innovations. Updated daily, never miss an exciting new product debut.',
  keywords: ['latest product launches', 'screenshots','snapshots', 'organizes', 'newly released products', 'producthunt', 'indiehackers', 'Y combinator', 'startups']
}

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode,
  modal: React.ReactNode
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
          {modal}
          {children}
          <Umami />
        </ThemeProvider>
      </body>
    </html>
  )
}
