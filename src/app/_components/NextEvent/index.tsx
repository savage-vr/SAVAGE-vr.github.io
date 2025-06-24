'use client'

import React, { useEffect, useState } from 'react'

import { events, type Event } from '#/app/_data/events.schema'

import './index.components.css'

const findNextEvent = (): Event | null => {
  const now = new Date()
  const today = now.toISOString().split('T')[0] // YYYY-MM-DD format

  // Filter events that are today or in the future
  const upcomingEvents = events.events.filter(event => {
    return event.eventDate >= today
  })

  // Sort by date and return the earliest one
  const sortedEvents = upcomingEvents.sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate)
  )

  return sortedEvents.length > 0 ? sortedEvents[0] : null
}

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('default', {}).format(date)
}

export const NextEvent: React.FC = () => {
  const nextEvent = findNextEvent()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(() => false)
  }, [loading, setLoading])
  if (loading) return null

  if (!nextEvent) {
    return (
      <section
        className="next-event no-events"
        role="region"
        aria-live="polite"
        aria-labelledby="next-event-title"
      >
        <h3 id="next-event-title" className="event-title">
          次のイベント
        </h3>
        <p className="no-event-message" role="status">
          現在予定されているイベントはありません
        </p>
      </section>
    )
  }

  return (
    <section
      className="next-event"
      role="region"
      aria-live="polite"
      aria-labelledby="next-event-title"
    >
      <h3 id="next-event-title" className="event-title">
        Next
      </h3>
      <div className="event-info" aria-describedby="event-details">
        <h4 className="event-name">
          {nextEvent.tweets ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              href={nextEvent.tweets}
              aria-label={`${nextEvent.name} - 外部リンクで詳細を見る`}
            >
              {nextEvent.name}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            nextEvent.name
          )}
        </h4>
        <time
          className="event-date"
          dateTime={nextEvent.eventDate}
          aria-label={`開催日: ${formatEventDate(nextEvent.eventDate)}`}
        >
          {formatEventDate(nextEvent.eventDate)}
        </time>
        <div className="event-cast" role="group" aria-labelledby="cast-title">
          <h5 id="cast-title" className="cast-title">
            出演者
          </h5>
          <ul className="cast-list" aria-label="出演者一覧">
            {nextEvent.cast.map((member, index) => (
              <li key={index} className="cast-member">
                <span className="member-name">{member.name}</span>
                <span
                  className="member-roles"
                  aria-label={`役割: ${member.roles.join(', ')}`}
                >
                  ({member.roles.join(', ')})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default NextEvent
