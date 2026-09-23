import { ImageResponse } from 'next/og'

import { colors, loadFonts, OG_SIZE, publicImage } from '#/app/_og/assets'

export const dynamic = 'force-static'

// Site card, 1200x630: used by the top page and as the fallback image
export async function GET() {
  const logo = await publicImage('/logo.png')
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 64,
          padding: '0 96px',
          background: colors.bg,
          color: colors.fg,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} width={380} height={380} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: 'IBM Plex Mono',
              fontSize: 26,
              letterSpacing: 6,
              color: colors.muted,
            }}
          >
            VRCHAT CLUB EVENT
          </div>
          <div
            style={{
              fontFamily: 'IBM Plex Serif',
              fontSize: 150,
              lineHeight: 1,
              marginTop: 16,
            }}
          >
            SAVAGE
          </div>
          <div
            style={{
              fontFamily: 'IBM Plex Serif',
              fontSize: 44,
              color: colors.muted,
              marginTop: 28,
            }}
          >
            “FLEX the chaos”
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  )
}
