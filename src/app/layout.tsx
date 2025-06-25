import { IBM_Plex_Serif } from 'next/font/google'

import type { Metadata } from 'next'
import './globals.css'

const ibm = IBM_Plex_Serif({
  variable: '--font-ibm-plex-serif',
  subsets: ['latin'],
  weight: ['500'],
})

export const metadata: Metadata = {
  title: 'SAVAGE - VRC Club Event',
  description: 'FLEX the chaos',
  keywords: ['VR', 'Club', 'Event', 'DJ', 'VJ', 'Virtual', 'Music', 'VRChat'],
  authors: [{ name: 'SAVAGE' }],
  creator: 'SAVAGE',
  publisher: 'SAVAGE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://savage-vr.github.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SAVAGE - VRC Club Event',
    description: 'FLEX the chaos',
    url: 'https://savage-vr.github.io',
    siteName: 'SAVAGE',
    images: [
      {
        url: '/logo-fill.jpg',
        width: 600,
        height: 600,
        alt: 'SAVAGE - VRC Club Event',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAVAGE - VRC Club Event',
    description: 'FLEX the chaos',
    site: '@vrcsavageinfo',
    creator: '@vrcsavageinfo',
    images: ['/logo-fill.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="description"
          content="SAVAGE is VRC Club Event, FLEX the chaos"
        ></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vrcsavageinfo" />
        <meta name="twitter:creator" content="@vrcsavageinfo" />
        <meta name="twitter:title" content="SAVAGE - VRC Club Event" />
        <meta name="twitter:description" content="FLEX the chaos" />
        <meta
          name="twitter:image"
          content="https://savage-vr.github.io/logo-fill.png"
        />
        <meta name="twitter:image:alt" content="SAVAGE - VRC Club Event" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body
        className={`${ibm.variable} antialiased bg-black`}
      >
        <a href="#main-content" className="skip-link">
          メインコンテンツにスキップ
        </a>
        {children}
      </body>
    </html>
  )
}
