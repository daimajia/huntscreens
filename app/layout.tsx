import type { Metadata } from 'next'
import './globals.css'
import Umami from './thridparties/umami'
import { ThemeProvider } from './components/theme-provider'

export const metadata: Metadata = {
  title: 'HuntScreens - Best way to explore Products!',
  description: 'The best way to browse ProductHunt! Take screenshots of each project on ProductHunt!',
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
