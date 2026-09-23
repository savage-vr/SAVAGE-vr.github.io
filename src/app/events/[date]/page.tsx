import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EventCast } from '#/app/_components/EventCast'
import { Grid } from '#/app/_components/Grid'
import { eventPath, events } from '#/app/_data/events.schema'

import type { Metadata } from 'next'

import '#/app/_components/common/detail.css'
import './page.css'

type Params = { date: string }

// Oldest first, so neighbours are the previous / next event in time
const sorted = [...events.events].sort((a, b) =>
  a.eventDate.localeCompare(b.eventDate)
)

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return sorted.map(event => ({ date: event.eventDate }))
}

const findEvent = (date: string) => {
  const index = sorted.findIndex(event => event.eventDate === date)
  return index === -1
    ? null
    : { event: sorted[index], prev: sorted[index - 1], next: sorted[index + 1] }
}

const formatDate = (date: string) => format(parseISO(date), 'yyyy.MM.dd (EEE)')

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const found = findEvent((await params).date)
  if (!found) return {}
  const { event } = found
  const title = `${event.name} | SAVAGE`
  const lineUp = (['DJ', 'VJ'] as const)
    .map(role => {
      const names = event.cast.filter(c => c.roles.includes(role))
      return names.length
        ? `${role}: ${names.map(c => c.name).join(' / ')}`
        : ''
    })
    .filter(Boolean)
    .join(' ')
  const description = `${formatDate(event.eventDate)} ${lineUp}`
  const image = event.flyer ?? '/logo-fill.jpg'
  return {
    title,
    description,
    metadataBase: new URL('https://savage-vr.github.io'),
    alternates: { canonical: eventPath(event) },
    openGraph: {
      title,
      description,
      url: eventPath(event),
      siteName: 'SAVAGE',
      images: [{ url: image, alt: event.name }],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@vrcsavageinfo',
      images: [image],
    },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<Params>
}) {
  const found = findEvent((await params).date)
  if (!found) notFound()
  const { event, prev, next } = found
  const webp = event.flyer?.replace(/\.(jpe?g|png)$/i, '.webp')

  return (
    <main id="main-content" className="event-page">
      <nav className="event-back mono-label">
        {/* Always back to the list this page is reached from */}
        <Link href="/#section-archive">← Top</Link>
      </nav>

      <header className="event-header">
        <time className="event-date" dateTime={event.eventDate}>
          {formatDate(event.eventDate)}
        </time>
        <h1 className="event-name">{event.name}</h1>
      </header>

      <div className={`event-body ${event.flyer ? '' : 'no-flyer'}`}>
        {event.flyer && (
          <a
            className="event-flyer"
            href={event.flyer}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${event.name} のフライヤーを開く`}
          >
            <picture>
              {webp && <source srcSet={webp} type="image/webp" />}
              <img src={event.flyer} alt={`${event.name} フライヤー`} />
            </picture>
          </a>
        )}
        <div className="event-info">
          <EventCast cast={event.cast} />
          {event.tweets && (
            <a
              className="event-announcement mono-label"
              href={event.tweets}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
            >
              Announcement ↗
            </a>
          )}
        </div>
      </div>

      <nav className="event-pager" aria-label="前後のイベント">
        {prev ? (
          <Link href={eventPath(prev)} className="event-pager-prev">
            <span className="mono-label">← Prev</span>
            <span>{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={eventPath(next)} className="event-pager-next">
            <span className="mono-label">Next →</span>
            <span>{next.name}</span>
          </Link>
        )}
      </nav>
      <Grid />
    </main>
  )
}
