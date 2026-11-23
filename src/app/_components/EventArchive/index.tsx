'use client'

import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { eventPath, type Event } from '#/app/_data/events.schema'
import { tokyoDateString } from '#/app/_utils/findNextEvent'

import './index.components.css'

const PAGE_SIZE = 3

const pad = (n: number) => String(n).padStart(2, '0')

export const EventArchive: React.FC<{ events: Event[] }> = ({ events }) => {
  const sorted = [...events].sort((a, b) =>
    b.eventDate.localeCompare(a.eventDate)
  )
  // "Upcoming" depends on today (in Tokyo), so it's only known in the browser
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => {
    setToday(tokyoDateString())
  }, [])

  const [page, setPage] = useState(0)
  // Empty on initial load; only announce after the user pages
  const [announcement, setAnnouncement] = useState('')
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const visible = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const isFirst = page === 0
  const isLast = page === pageCount - 1

  const goTo = (next: number) => {
    // aria-disabled keeps the button focusable, so the no-op happens here
    if (next < 0 || next > pageCount - 1) return
    setPage(next)
    setAnnouncement(`Page ${next + 1} / ${pageCount}`)
  }

  return (
    <div className="event-archive-wrap">
      {/* role="list": Safari drops list semantics with list-style: none */}
      <ul className="event-archive" role="list">
        {visible.map(event => (
          <li key={event.eventDate}>
            <Link href={eventPath(event)}>
              <time className="event-archive-date" dateTime={event.eventDate}>
                {format(parseISO(event.eventDate), 'yyyy.MM.dd')}
              </time>
              <span className="event-archive-name">
                {event.name}
                {today && event.eventDate >= today && (
                  <span className="event-archive-upcoming mono-label">
                    Upcoming
                  </span>
                )}
              </span>
              <span className="event-archive-meta mono-label">
                {event.cast.length} Cast
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {pageCount > 1 && (
        <nav
          className="event-archive-pager mono-label"
          aria-label="アーカイブのページ"
        >
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            aria-disabled={isFirst ? 'true' : undefined}
          >
            <span aria-hidden="true">← </span>Newer
            <span className="sr-only"> events</span>
          </button>
          <span className="event-archive-page">
            <span className="event-archive-page-current">{pad(page + 1)}</span>{' '}
            / {pad(pageCount)}
          </span>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            aria-disabled={isLast ? 'true' : undefined}
          >
            Older
            <span className="sr-only"> events</span>
            <span aria-hidden="true"> →</span>
          </button>
        </nav>
      )}
      <p className="sr-only" role="status">
        {announcement}
      </p>
    </div>
  )
}

export default EventArchive
