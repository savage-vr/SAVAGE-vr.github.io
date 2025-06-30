import Image from 'next/image'
import React, { Suspense } from 'react'

import { Grid } from './_components/Grid'
import NextEvent from './_components/NextEvent'
import { Profile } from './_components/Profile'
import { ScrollDown } from './_components/ScrollDown'
import { events } from './_data/events.schema'
import { members } from './_data/members.schema'
import { slides } from './_data/slides.schema'
import { youtube } from './_data/youtube.schema'

import type { Metadata } from 'next'

const Slideshow = React.lazy(() => import('./_components/Slideshow'))
const YouTubeSlider = React.lazy(() => import('./_components/YouTubeSlider'))

const Logo = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Image
        className="logo"
        src="/logo.png"
        alt="Logo"
        width={200}
        height={200}
        priority
      />
    </div>
  )
}

const MainText = () => {
  return (
    <div className="w-screen glow">
      <p className="text-3xl p-16 absolute bottom-0 left-0 font-[family-name:var(--font-ibm-plex-serif)]">
        &ldquo;FLEX the chaos&rdquo;
      </p>
    </div>
  )
}

const Savage = () => {
  return (
    <div className="flex flex-col items-center justify-center top-1/2 left-1/2">
      <aside className="text-xs">サヴェージ</aside>
      <h1 className="text-4xl font-[family-name:var(--font-ibm-plex-serif)]">
        SAVAGE
      </h1>
    </div>
  )
}

const About = () => {
  return (
    <div className="flex flex-row items-center justify-center flex-wrap gap-[2rem]">
      <p className="text-wrap">
        SAVAGE は、不思議で魅惑的な空気感を大切にする、
        <wbr />
        VR上のクラブイベントです。
        <br />
        <br />
        時折テーマを設け、
        <wbr />
        その世界観に深く浸るように構成されたDJセットが特徴です。
        <br />
        <br />
        現実とはひと味違う没入感あふれるバーチャルな夜をSAVAGEが創り出します。
      </p>
      <Image
        className="logo"
        src="/1.jpg"
        alt="Logo"
        width={250}
        height={250}
        priority
      />
    </div>
  )
}

const SectionHeader: React.FC<{ children: string }> = ({ children }) => {
  return <h2 className="p-16 text-3xl font-bold">{children}</h2>
}

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
        <Logo />
        <Savage />
        <MainText />
        <ScrollDown />
      </section>
      <section className="second-section w-full bg-black">
        <div className="content flex flex-col items-center p-[2rem] w-full">
          <div id="main-content" />
          <SectionHeader>About</SectionHeader>
          <About />
          <div className="flex flex-row flex-wrap gap-4 p-[1rem]">
            <a
              className="flex flex-row gap-4 p-[1rem]"
              href="https://vrchat.com/home/group/grp_0fa30f81-0523-4034-90ab-c3ca819b9fea"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <Image
                width={82}
                height={42}
                src="/logo/vrchat-logo-white-optimized.png"
                alt="Logo"
                priority
              />
              <span className="text-base/9">VRChat Group</span>
            </a>
            <a
              className="flex flex-row gap-4 p-[1rem]"
              style={{ marginLeft: '1rem' }}
              href="https://x.com/vrcsavageinfo"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <Image
                width={40}
                height={40}
                src="/logo/X_logo.svg"
                alt="Logo"
                priority
              />
              <span className="text-base/9">Official SNS</span>
            </a>
          </div>
          <div className="flex justify-center items-center w-full bg-zinc-800 min-h-120">
            <NextEvent events={events} />
          </div>
          <SectionHeader>Members</SectionHeader>
          <div className="flex flex-wrap justify-center gap-[3rem]">
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
          <SectionHeader>Gallery</SectionHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <Slideshow slides={slides} />
          </Suspense>
          <SectionHeader>Videos</SectionHeader>
          <Suspense fallback={<div>Loading videos...</div>}>
            <YouTubeSlider videos={youtube.movies} />
          </Suspense>
        </div>
        <footer className="footer flex flex-col items-center p-[2rem] bg-black">
          © SAVAGE-vr
        </footer>
      </section>
      <Grid />
    </main>
  )
}
