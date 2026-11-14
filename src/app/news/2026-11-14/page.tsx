import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import "./style.css"

const description = "この度、Izena が SAVAGE の新メンバーとして加入いたしましたので、お知らせいたします。"

export const metadata: Metadata = {
  title: 'SAVAGE - Izena 加入のお知らせ',
  description,
  openGraph: {
    title: 'SAVAGE - Izena 加入のお知らせ',
    description,
    url: '/news/2026-11-14/',
    siteName: 'SAVAGE',
    images: [{ url: '/news/2026-11-14/welcome.png', width: 1600, height: 900, alt: 'WELCOME IZENA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAVAGE - Izena 加入のお知らせ',
    description,
    site: '@vrcsavageinfo',
    creator: '@vrcsavageinfo',
    images: ['/news/2026-11-14/welcome.png'],
  },
}

export default function Home() {
  return (
    <main id="main-content" className="w-full">
      <article>
        <header className="fixed w-full flex justify-center z-100 header">
          <Link href="/">
            <div className="flex flex-col items-center justify-center p-8 z-100">
              <aside className="text-xs">サヴェージ</aside>
              <h1 className="text-4xl font-[family-name:var(--font-ibm-plex-serif)]">
                SAVAGE
              </h1>
            </div>
          </Link>
        </header>
        <div className="flex justify-center p-8 pt-32 z-10 img">
          <Image
            alt="SAVAGE DJ Izena 加入のお知らせ"
            width="1600"
            height="900"
            className="flex items-center justify-center z-10"
            src="/news/2026-11-14/welcome.png"
          />
        </div>
        <div className="flex flex-col justiy-center max-w-196 m-auto p-11">
          <h2 className="text-2xl font-[family-name:var(--font-ibm-plex-serif)]">
            SAVAGE - Izena 加入のお知らせ
          </h2>
          <p className="text-right">
            Published:
            <time className="ml-2" dateTime="2026-11-14">
              2026.11.14
            </time>
          </p>
          <p className="mt-8 article">
            この度、Izena が SAVAGE の新メンバーとして加入いたしましたので、お知らせいたします。
            <br />
            <br />
            Izena は <Link className="underline" href="/events/2026-10-08/">2026年10月8日の SAVAGE wave.26</Link> に DJ として出演。
            <Link className="underline" href="/events/2026-11-23/">2026年11月23日の SAVAGE wave.27</Link> にも出演予定です。
            <br />
            <br />
            新たな仲間を迎えた SAVAGE を、今後ともよろしくお願いいたします。
          </p>
          <div className="pt-8">
            <h3 className="text-sm">Links</h3>
            <p>
              Izena - <Link className="underline" href="https://x.com/Izena714">X</Link> / <Link className="underline" href="/members/izena/">出演履歴</Link>
            </p>
          </div>
        </div>
        <footer className="border-t-1  footer flex flex-col items-center p-[4rem]">
          © SAVAGE-vr
        </footer>
      </article>
    </main>
  )
}
