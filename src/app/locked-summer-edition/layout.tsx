import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SAVAGE | 8/32 LOCKED SUMMER EDITION',
  description: 'In summer, the song sings itself',
  openGraph: {
    title: 'SAVAGE | 8/32 LOCKED SUMMER EDITION',
    description: 'In summer, the song sings itself',
    url: 'https://savage-vr.github.io/locked-summer-edition',
    siteName: 'SAVAGE',
    images: [
      {
        url: '/locked-summer-edition/index.jpg',
        width: 1920,
        height: 1280,
        alt: 'SAVAGE 8/32 LOCKED Summer Edition',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAVAGE | 8/32 LOCKED SUMMER EDITION',
    description: 'In summer, the song sings itself',
    images: ['/locked-summer-edition/index.jpg'],
  },
}

export default function LockedSummerEditionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
