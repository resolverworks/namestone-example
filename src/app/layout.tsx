import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { ClientProviders } from '@/components/ClientProviders'
import { cn } from '@/lib/utils'

import './globals.css'

const seasonsFont = localFont({
  src: '../assets/fonts/TheSeasons-reg.woff2',
  variable: '--font-seasons',
  display: 'swap',
})

const cyGroteskFont = localFont({
  src: [
    { path: '../assets/fonts/CyGroteskKeyBold-Regular.woff2', weight: '400' },
    { path: '../assets/fonts/CyGroteskKeyBold-Bold.woff2', weight: '700' },
  ],
  variable: '--font-cy-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SheFi Names',
  description: 'Web3 profiles for SheFi Summit attendees',
  openGraph: {
    images: ['/opengraph.jpg'],
  },
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://shefi-subnames.vercel.app'
      : 'http://localhost:3000'
  ),
  other: {
    'theme-color': '#EDEDEB',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(seasonsFont.variable, cyGroteskFont.variable)}
    >
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
