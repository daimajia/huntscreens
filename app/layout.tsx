import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/header'
import Umami from './thridparties/umami'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body >
      <Header />
      {children}
      <Umami />
      </body>
    </html>
  )
}
