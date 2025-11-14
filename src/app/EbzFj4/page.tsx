import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import "./style.css"

export const metadata: Metadata = {
  title: 'SAVAGE - fuji_Glicine 脱退のお知らせ',
  description: 'この度、SAVAGE 発足当初からメンバーとして活動していた fuji_Glicine が脱退する運びとなりましたのでお知らせいたします。',
  openGraph: {
    title: 'SAVAGE - fuji_Glicine 脱退のお知らせ',
    description: 'この度、SAVAGE 発足当初からメンバーとして活動していた fuji_Glicine が脱退する運びとなりましたのでお知らせいたします。',
    url: 'https://savage-vr.github.io/Ebzfj4',
    siteName: 'SAVAGE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAVAGE - fuji_Glicine 脱退のお知らせ',
    description: 'この度、SAVAGE 発足当初からメンバーとして活動していた fuji_Glicine が脱退する運びとなりましたのでお知らせいたします。',
    site: '@vrcsavageinfo',
    creator: '@vrcsavageinfo',
    images: ['/logo-fill.jpg'],
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
            alt="SAVAGE DJ fuji_Glicine 脱退のお知らせ"
            width="1600"
            height="900"
            className="flex items-center justify-center z-10"
            src="/EbzFj4/thank_you.png"
          />
        </div>
        <div className="flex flex-col justiy-center max-w-196 m-auto p-11">
          <h2 className="text-2xl font-[family-name:var(--font-ibm-plex-serif)]">
            SAVAGE - fuji_Glicine 脱退のお知らせ
          </h2>
          <p className="text-right">
            Published:
            <time className="ml-2" dateTime="2025-11-14">
              2025.11.14
            </time>
          </p>
          <p className="mt-8 article">
            この度、SAVAGE 発足当初からメンバーとして活動していた fuji_Glicine が脱退する運びとなりましたので、お知らせいたします。
            <br />
            <br />
            fuji_Glicine は 2024年11月に発足したSAVAGEの初期メンバーとして加入。
            高いBPM帯の Drum&#39;n&#39;Bass / Liquid Funk / UK Hardcore / J-Core などを中心をプレイし他のメンバーにはできない領域のDJを多数披露プレイしていただきました。
            <br />
            <br />
            SAVAGE 以外での活躍も目覚ましく、VRC上で UK Hardcore / Mainstream Hardcore シーンの盛り上げに貢献してきました。
            <br />
            <br />
            fuji_Glicineのこれまでの貢献に感謝するとともに、今後のさらなる飛躍を心より願っています。
          </p>
          <div className="pt-8">
            <h3 className="text-sm">Links</h3>
            <p>
              fuji_Glicine - <Link className="underline" href="https://x.com/fuji_COREmania">X</Link> / <Link className="underline" href="https://www.mixcloud.com/Glicine/">Mixcloud</Link>
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