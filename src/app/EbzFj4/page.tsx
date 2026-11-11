import { Metadata } from "next"
import Link from "next/link"

// Old URL of /news/2025-11-14/, already shared on X
const to = '/news/2025-11-14/'

export const metadata: Metadata = {
  title: 'SAVAGE - fuji_Glicine 脱退のお知らせ',
  alternates: { canonical: to },
  robots: { index: false },
}

export default function EbzFj4() {
  return (
    <main id="main-content" className="w-full p-11">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <Link className="underline" href={to}>
        {to}
      </Link>
    </main>
  )
}
