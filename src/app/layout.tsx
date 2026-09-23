import { IBM_Plex_Serif } from 'next/font/google'

import { NavigationTracker } from './_components/BackLink'
import './globals.css'

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
