import { IBM_Plex_Serif } from 'next/font/google'

import { NavigationTracker } from './_components/BackLink'
import './globals.css'

import type { Metadata, Viewport } from 'next'

// Resolves relative OG / canonical URLs on every page
export const metadata: Metadata = {
  metadataBase: new URL('https://savage-vrc.club'),
}

// Dark-only site: native UI (scrollbars, form controls, canvas) follows suit
export const viewport: Viewport = {
  colorScheme: 'dark',
}

const ibm = IBM_Plex_Serif({
  variable: '--font-ibm-plex-serif',
  subsets: ['latin'],
  weight: ['500'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Opt in to OS text scaling: no root font-size override, rem-based type */}
        <meta name="text-scale" content="scale" />
      </head>
      <body className={`${ibm.variable} antialiased bg-black`}>
        <a href="#main-content" className="skip-link">
          メインコンテンツにスキップ
        </a>
        <NavigationTracker />
        {children}
      </body>
    </html>
  )
}
