import type { Metadata } from 'next'
import './globals.css'
import Umami from './thridparties/umami'
import { ThemeProvider } from './components/theme-provider'

export const metadata: Metadata = {
  title: 'Screenshots for Hunters!',
  description: 'The best way to browse ProductHunt!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
          <Umami />
        </ThemeProvider>
      </body>
    </html>
  )
}
