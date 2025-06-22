import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibm = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "SAVAGE - VRC Club Event",
  description: "lets flexing to the chaos",
  keywords: ["VR", "Club", "Event", "DJ", "VJ", "Virtual", "Music", "VRChat"],
  authors: [{ name: "SAVAGE" }],
  creator: "SAVAGE",
  publisher: "SAVAGE",
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
    title: "SAVAGE - VRC Club Event",
    description: "lets flexing to the chaos",
    url: 'https://savage-vr.github.io',
    siteName: 'SAVAGE',
    images: [
      {
        url: '/logo-fill.jpg',
        width: 1200,
        height: 630,
        alt: 'SAVAGE - VRC Club Event',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SAVAGE - VRクラブイベント",
    description: "lets flexing to the chaos",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vrcsavageinfo" />
        <meta name="twitter:creator" content="@vrcsavageinfo" />
        <meta name="twitter:title" content="SAVAGE - VRC Club Event" />
        <meta name="twitter:description" content="lets flexing to the chaos" />
        <meta name="twitter:image" content="https://savage-vr.github.io/logo-fill.png" />
        <meta name="twitter:image:alt" content="SAVAGE - VRC Club Event" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${ibm.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
