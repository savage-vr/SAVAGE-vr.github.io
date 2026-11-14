import { Metadata } from "next"
import Link from "next/link"

// Published here before the date moved to /news/2026-11-14/
const to = '/news/2026-11-14/'

export const metadata: Metadata = {
  title: 'SAVAGE - Izena 加入のお知らせ',
  alternates: { canonical: to },
  robots: { index: false },
}

export default function News20261111() {
  return (
    <main id="main-content" className="w-full p-11">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <Link className="underline" href={to}>
        {to}
      </Link>
    </main>
  )
}
