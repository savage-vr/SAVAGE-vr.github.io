import Image from 'next/image'
import React, { Suspense } from 'react'

import { Grid } from './_components/Grid'
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

const Logo = () => {
  return (
    <div className="relative flex items-center justify-center z-10">
      <svg id="logo" width="500" height="500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
        <line className="cls-4" x1="86.77" y1="242.69" x2="420.73" y2="242.69" />
        <line className="cls-4" x1="22.24" y1="318.55" x2="520.81" y2="318.55" />
        <line className="cls-4" x1="66.91" y1="341.35" x2="572.22" y2="341.35" />
        <line className="cls-4" x1="53.7" y1="417.22" x2="444.55" y2="417.22" />
        <line className="cls-4" x1="101.71" y1="441.57" x2="501.07" y2="441.57" />
        <line className="cls-4" x1="107.63" y1="517.44" x2="573.04" y2="517.44" />
        <line className="cls-4" x1="53.62" y1="497.37" x2="443.24" y2="497.37" />
        <line className="cls-4" x1="22.24" y1="487.65" x2="572.22" y2="487.65" />
        <line className="cls-4" x1="53.62" y1="467.23" x2="469.06" y2="467.23" />
        <line className="cls-4" x1="53.62" y1="457.69" x2="527.34" y2="457.69" />
        <path className="cls-2" d="M188.2,307.47c0,6.12-4.4,11.09-11.01,11.09-6.12,0-11.17-4.96-11.17-11.09s4.96-11.09,11.09-11.09,11.09,4.96,11.09,11.09Z" />
        <circle className="cls-2" cx="229.75" cy="253.78" r="11.09" />
        <circle className="cls-2" cx="345.91" cy="307.47" r="11.09" />
        <circle className="cls-2" cx="345.79" cy="406.11" r="11.09" />
        <line className="cls-4" x1="438.83" y1="384.71" x2="237.25" y2="183.13" />
        <line className="cls-4" x1="467.02" y1="400.02" x2="282.26" y2="215.25" />
        <line className="cls-4" x1="474.21" y1="387.34" x2="246.02" y2="159.15" />
        <line className="cls-4" x1="348.74" y1="426.46" x2="151.12" y2="228.84" />
        <line className="cls-4" x1="572.05" y1="616.67" x2="184.44" y2="229.07" />
        <line className="cls-4" x1="421.41" y1="452.64" x2="192.59" y2="223.82" />
        <line className="cls-4" x1="421.72" y1="433.96" x2="144.83" y2="157.06" />
        <line className="cls-4" x1="359.97" y1="637.3" x2="150.36" y2="427.69" />
        <line className="cls-4" x1="330.25" y1="557.77" x2="202.26" y2="429.78" />
        <line className="cls-4" x1="344.46" y1="555.61" x2="173.83" y2="384.97" />
        <line className="cls-4" x1="461.1" y1="637.49" x2="88.09" y2="264.48" />
        <line className="cls-4" x1="440.17" y1="552.41" x2="50.57" y2="162.81" />
        <g className="cls-5">
          <line className="cls-1" x1="444.12" y1="552.49" x2="322.83" y2="431.2" />
          <line className="cls-1" x1="446.41" y1="552.19" x2="325.13" y2="430.9" />
        </g>
        <g className="cls-5">
          <line className="cls-1" x1="450.5" y1="552.19" x2="329.46" y2="431.15" />
          <line className="cls-1" x1="452.79" y1="551.89" x2="331.75" y2="430.85" />
        </g>
        <g className="cls-5">
          <line className="cls-1" x1="457.31" y1="552.32" x2="335.97" y2="430.98" />
          <line className="cls-1" x1="459.6" y1="552.02" x2="338.27" y2="430.68" />
        </g>
        <g className="cls-5">
          <line className="cls-1" x1="464.13" y1="552.46" x2="342.25" y2="430.58" />
          <line className="cls-1" x1="466.43" y1="552.16" x2="344.55" y2="430.28" />
        </g>
        <g className="cls-5">
          <line className="cls-1" x1="470.62" y1="552.34" x2="348.88" y2="430.61" />
          <line className="cls-1" x1="472.92" y1="552.04" x2="351.18" y2="430.31" />
        </g>
        <g className="cls-5">
          <line className="cls-1" x1="477.08" y1="552.55" x2="355.19" y2="430.67" />
          <line className="cls-1" x1="479.38" y1="552.26" x2="357.49" y2="430.38" />
        </g>
        <g>
          <polygon className="cls-6" points="309.71 242.69 329.57 242.69 405.44 318.55 385.57 318.55 309.71 242.69" />
          <polygon className="cls-6" points="310.12 341.35 329.11 341.35 404.98 417.22 385.99 417.22 310.12 341.35" />
          <polygon className="cls-6" points="329.33 441.57 164.96 441.57 240.83 517.44 405.19 517.44 385.12 497.37 269.84 497.37 230.17 457.69 345.44 457.69 329.33 441.57" />
          <polygon className="cls-6" points="256.08 467.23 276.5 487.65 375.4 487.65 354.99 467.23 256.08 467.23" />
          <polygon className="cls-3" points="333.2 441.57 409.06 517.44 411.66 517.44 335.79 441.57 333.2 441.57" />
          <polygon className="cls-3" points="339.9 441.58 415.76 517.44 418.36 517.44 342.49 441.58 339.9 441.58" />
          <polygon className="cls-3" points="346.58 441.58 422.44 517.44 425.04 517.44 349.17 441.58 346.58 441.58" />
          <polygon className="cls-3" points="353.26 441.58 429.12 517.44 431.72 517.44 355.85 441.58 353.26 441.58" />
          <polygon className="cls-3" points="359.86 441.58 435.72 517.44 438.32 517.44 362.45 441.58 359.86 441.58" />
          <polygon className="cls-3" points="366.09 441.57 441.96 517.44 444.55 517.44 368.69 441.57 366.09 441.57" />
          <path className="cls-6" d="M296.73,341.35h-131.76l75.85,75.85,131.78.02-75.87-75.87ZM345.79,417.2c-6.12,0-11.09-4.96-11.09-11.09s4.96-11.09,11.09-11.09,11.09,4.96,11.09,11.09-4.96,11.09-11.09,11.09Z" />
          <path className="cls-6" fill="#fff" d="M296.81,242.69h-131.76l75.85,75.85,131.78.02-75.87-75.87ZM229.65,265.18c-6.12,0-11.09-4.96-11.09-11.09s4.96-11.09,11.09-11.09,11.09,4.96,11.09,11.09-4.96,11.09-11.09,11.09ZM345.87,318.54c-6.12,0-11.09-4.96-11.09-11.09s4.96-11.09,11.09-11.09,11.09,4.96,11.09,11.09-4.96,11.09-11.09,11.09Z" />
          <path className="cls-6" d="M188.2,307.47c0,6.12-4.4,11.09-11.01,11.09-6.12,0-11.17-4.96-11.17-11.09s4.96-11.09,11.09-11.09,11.09,4.96,11.09,11.09Z" />
        </g>
      </svg>
    </div>
  )
}

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
        src="/1.png"
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
        <Video />
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
          <dl>
            <dt>Event Design / Organize</dt>
            <dd>bonsai</dd>
            <dt>Logo Design</dt>
            <dd>sichemaniac</dd>
            <dt>Logo Animation</dt>
            <dd>melocilde</dd>
            <dt>Background Movie</dt>
            <dd>Kaonasy1000</dd>
            <dt>Web Site Development</dt>
            <dd>melocilde</dd>
          </dl>
          © SAVAGE-vr
        </footer>
      </section>
      <Grid />
    </main>
  )
}
