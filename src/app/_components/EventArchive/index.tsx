'use client'

import { format, parseISO, startOfDay } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { eventPath, type Event } from '#/app/_data/events.schema'

import './index.components.css'

const PAGE_SIZE = 3

const pad = (n: number) => String(n).padStart(2, '0')

export const EventArchive: React.FC<{ events: Event[] }> = ({ events }) => {
  const sorted = [...events].sort((a, b) =>
    b.eventDate.localeCompare(a.eventDate)
  )
  // "Upcoming" depends on today, so it's only known in the browser
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => {
    setToday(format(startOfDay(new Date()), 'yyyy-MM-dd'))
  }, [])

  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const visible = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="event-archive-wrap">
      <ul className="event-archive" aria-live="polite">
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
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            aria-label="新しいイベントを表示"
          >
            ← Newer
          </button>
          <span className="event-archive-page">
            <span className="event-archive-page-current">{pad(page + 1)}</span>{' '}
            / {pad(pageCount)}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
            disabled={page === pageCount - 1}
            aria-label="古いイベントを表示"
          >
            Older →
          </button>
        </nav>
      )}
    </div>
  )
}

export default EventArchive
