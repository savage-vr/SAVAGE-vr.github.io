import Image from 'next/image'
import React, { Suspense } from 'react'

import { EventArchive } from './_components/EventArchive'
import { Grid } from './_components/Grid'
import { HashScroll } from './_components/HashScroll'
import { Logo } from './_components/Logo'
import NextEvent from './_components/NextEvent'
import { Profile } from './_components/Profile'
import { ScrollDown } from './_components/ScrollDown'
import Video from './_components/Video'
import { events } from './_data/events.schema'
import { members } from './_data/members.schema'
import { slides } from './_data/slides.schema'
import { youtube } from './_data/youtube.schema'

import type { Metadata } from 'next'

const Slideshow = React.lazy(() => import('./_components/Slideshow'))
const YouTubeSlider = React.lazy(() => import('./_components/YouTubeSlider'))

const MainText = () => {
  return (
    <div className="w-screen glow z-10">
      <p className="text-3xl p-16 absolute bottom-0 left-0 font-[family-name:var(--font-ibm-plex-serif)]">
        &ldquo;FLEX the chaos&rdquo;
      </p>
    </div>
  )
}

const Savage = () => {
  return (
    <div className="savage flex flex-col items-center justify-center top-1/2 left-1/2 z-10">
      <aside className="text-xs">サヴェージ</aside>
      <h1 className="text-4xl font-[family-name:var(--font-ibm-plex-serif)]">
        SAVAGE
      </h1>
    </div>
  )
}

const About = () => {
  return (
    <div className="about">
      <div className="about-text">
        <p className="about-lead">
          SAVAGE は、不思議で魅惑的な空気感を大切にする、
          <wbr />
          VR上のクラブイベントです。
        </p>
        <p>
          時折テーマを設け、
          <wbr />
          その世界観に深く浸るように構成されたDJセットが特徴です。
          <br />
          現実とはひと味違う没入感あふれるバーチャルな夜をSAVAGEが創り出します。
        </p>
      </div>
      <Image
        className="about-logo"
        src="/1.png"
        alt="Logo"
        width={250}
        height={250}
        priority
      />
    </div>
  )
}

const Section: React.FC<{
  index: string
  title: string
  caption?: string
  children: React.ReactNode
}> = ({ index, title, caption, children }) => {
  const id = `section-${title.toLowerCase()}`
  return (
    <section className="section" aria-labelledby={id}>
      <header className="section-header">
        <h2 id={id} className="section-title">
          <span className="section-index">{index}</span>
          {title}
        </h2>
        {caption && <p className="section-caption">{caption}</p>}
      </header>
      {children}
    </section>
  )
}

const credits: Array<[string, string]> = [
  ['Event Design / Organize', 'bonsai'],
  ['Logo Design', 'piqLessss'],
  ['Logo Retouch', 'sichemaniac'],
  ['Logo Animation', 'melocilde'],
  ['Background Movie', 'Kaonasy1000'],
  ['Web Site Development', 'melocilde'],
]

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
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  other: {
    'msapplication-TileColor': '#000000',
  },
}

export default function Home() {
  return (
    <main className="w-full">
      <section className="hero fixed w-full h-screen flex flex-col items-center justify-center bg-black p-20 fadeIn z-1">
        <Video />
        <Logo />
        <Savage />
        <MainText />
        <ScrollDown />
      </section>
      <section className="second-section">
        <div className="content">
          <div id="main-content" />
          <Section index="01" title="About" caption="VRChat Club Event">
            <About />
            <ul className="chip-links">
              <li>
                <a
                  className="chip"
                  href="https://vrchat.com/home/group/grp_0fa30f81-0523-4034-90ab-c3ca819b9fea"
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <Image
                    width={82}
                    height={42}
                    src="/logo/vrchat-logo-white-optimized.png"
                    alt=""
                    priority
                  />
                  VRChat Group ↗
                </a>
              </li>
              <li>
                <a
                  className="chip"
                  href="https://x.com/vrcsavageinfo"
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <Image
                    width={40}
                    height={40}
                    src="/logo/X_logo.svg"
                    alt=""
                    priority
                  />
                  Official SNS ↗
                </a>
              </li>
            </ul>
          </Section>
          <Section index="02" title="Next" caption="Upcoming Event">
            <NextEvent events={events} />
          </Section>
          <Section
            index="03"
            title="Archive"
            caption={`${events.events.length} Events`}
          >
            <EventArchive events={events.events} />
          </Section>
          <Section
            index="04"
            title="Members"
            caption={`${members.members.length} Crew`}
          >
            <div className="members">
              {members.members.map(member => (
                <Profile
                  key={member.name}
                  imgSrc={member.imgSrc}
                  name={member.name}
                  roles={member.roles}
                  links={member.links}
                />
              ))}
            </div>
          </Section>
          <Section
            index="05"
            title="Gallery"
            caption={`${slides.slides.length} Shots`}
          >
            <Suspense fallback={<div className="media-fallback" />}>
              <Slideshow slides={slides} />
            </Suspense>
          </Section>
          <Section
            index="06"
            title="Videos"
            caption={`${youtube.movies.length} Sets`}
          >
            <Suspense fallback={<div className="media-fallback" />}>
              <YouTubeSlider videos={youtube.movies} />
            </Suspense>
          </Section>
        </div>
        <footer className="footer">
          <dl className="credits">
            {credits.map(([role, name]) => (
              <div key={role}>
                <dt>{role}</dt>
                <dd>{name}</dd>
              </div>
            ))}
          </dl>
          <div className="footer-mark" aria-hidden="true">
            <ruby>
              SAVAGE<rt>サヴェージ</rt>
            </ruby>
          </div>
          <div className="footer-bottom mono-label">
            <span>&ldquo;FLEX the chaos&rdquo;</span>
            <span>© SAVAGE-vr</span>
          </div>
        </footer>
      </section>
      <Grid />
      <HashScroll />
    </main>
  )
}
