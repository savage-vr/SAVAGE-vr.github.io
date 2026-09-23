import { format, parseISO } from 'date-fns'
import { ImageResponse } from 'next/og'

import { events } from '#/app/_data/events.schema'
import { colors, loadFonts, OG_SIZE, publicImage } from '#/app/_og/assets'

export const dynamic = 'force-static'
export const dynamicParams = false

// /og/events/<date>.png: flyer beside the date and event name, so portrait
// flyers aren't cropped to a strip by summary_large_image cards
export function generateStaticParams() {
  return events.events.map(event => ({ file: `${event.eventDate}.png` }))
}

const PAD = 56
const IMAGE_BOX = { width: 560, height: OG_SIZE.height - PAD * 2 }

export async function GET(
  _: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const date = (await params).file.replace(/\.png$/, '')
  const event = events.events.find(e => e.eventDate === date)
  if (!event) return new Response('Not found', { status: 404 })

  // Events without a flyer get the logo mark, a little smaller and unframed
  const image = await publicImage(event.flyer ?? '/logo.png')
  const fit = event.flyer ? 1 : 0.8
  const scale =
    Math.min(IMAGE_BOX.width / image.width, IMAGE_BOX.height / image.height) *
    fit

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 56,
          padding: PAD,
          background: colors.bg,
          color: colors.fg,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: IMAGE_BOX.width,
            height: IMAGE_BOX.height,
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            width={Math.round(image.width * scale)}
            height={Math.round(image.height * scale)}
            alt=""
            style={event.flyer ? { border: `1px solid ${colors.border}` } : {}}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              fontFamily: 'IBM Plex Mono',
              fontSize: 40,
              letterSpacing: -1,
            }}
          >
            {format(parseISO(event.eventDate), 'yyyy.MM.dd (EEE)')}
          </div>
          <div
            style={{
              fontFamily: 'IBM Plex Serif',
              fontSize: event.name.length > 24 ? 50 : 62,
              lineHeight: 1.15,
              marginTop: 24,
            }}
          >
            {event.name}
          </div>
          <div
            style={{
              fontFamily: 'IBM Plex Mono',
              fontSize: 24,
              letterSpacing: 4,
              color: colors.muted,
              marginTop: 40,
            }}
          >
            {`${event.cast.length} ARTISTS · VRCHAT`}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  )
}
