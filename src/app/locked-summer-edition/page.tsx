import { Grid } from '../_components/Grid'
import './page.css'

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col">
      <div className="flex flex-col justify-center items-center locked-summer">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="flex flex-col items-center justify-center top-1/2 left-1/2">
          <aside className="text-xs">サヴェージ</aside>
          <h1 className="text-4xl font-[family-name:var(--font-ibm-plex-serif)]">
            SAVAGE
          </h1>
          <p className="drop-shadow-lg lg:text-3xl sm:text-2xl p-8 bottom-0 left-0 font-[family-name:var(--font-ibm-plex-serif)]">
            8/32 LOCKED Summer Edition{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              aria-label={`Club Column - 外部リンクで詳細を見る`}
              href="https://x.com/clubcolumn"
            >
              at Club Column
            </a>
          </p>
          <p className="maxim text-xl font-[family-name:var(--font-ibm-plex-serif)]">
            &ldquo;In summer, the song sings itself&rdquo;
          </p>
          <p className="flex flex-col justify-center items-center drop-shadow-lg text-xl font-[family-name:var(--font-ibm-plex-serif)]">
            <time>2024.08.31 21:00</time>
            <span>|</span>
            <time>2024.08.32 01:00</time>
          </p>
          <p className="text-2xl pt-6">TO BE ANNOUNCED</p>
        </div>
      </div>
      <div className="bg" />
      <Grid />
    </main>
  )
}
