'use client'

import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'

import { type EventsData } from '#/app/_data/events.schema'
import { findNextEvent } from '#/app/_utils/findNextEvent'

import './index.components.css'

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'yyyy.MM.dd')
}

const formatCountdown = (dateString: string): string => {
  const days = differenceInCalendarDays(parseISO(dateString), new Date())
  if (days <= 0) return 'Tonight'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

interface NextEventProps {
  events: EventsData
}

export const NextEvent: React.FC<NextEventProps> = ({ events }) => {
  const nextEvent = findNextEvent(events.events)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(() => false)
  }, [loading, setLoading])
  if (loading)
    return <div className="next-event next-event-loading" aria-busy="true" />

  if (!nextEvent) {
    return (
      <div className="next-event" role="region" aria-live="polite">
        <div className="next-event-meta mono-label">Stay tuned</div>
        <p className="next-event-date" aria-hidden="true">
          TBA
        </p>
        <p className="next-event-empty" role="status">
          現在予定されているイベントはありません
        </p>
      </div>
    )
  }

  return (
    <div
      className="next-event"
      role="region"
      aria-live="polite"
      aria-label="次のイベント"
    >
      <div className="next-event-meta mono-label">
        <span className="next-event-live" aria-hidden="true" />
        <span>{formatCountdown(nextEvent.eventDate)}</span>
      </div>
      <time
        className="next-event-date"
        dateTime={nextEvent.eventDate}
        aria-label={`開催日: ${formatEventDate(nextEvent.eventDate)}`}
      >
        {formatEventDate(nextEvent.eventDate)}
      </time>
      <h3 className="next-event-name">
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
      </h3>
      <div role="group" aria-labelledby="cast-title">
        <h4 id="cast-title" className="mono-label next-event-cast-title">
          Line Up
        </h4>
        <ul className="next-event-cast" aria-label="出演者一覧">
          {nextEvent.cast.map((member, index) => (
            <li key={index}>
              <span className="next-event-cast-no">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="next-event-cast-name">{member.name}</span>
              <span
                className="next-event-cast-roles"
                aria-label={`役割: ${member.roles.join(', ')}`}
              >
                {member.roles.map(role => (
                  <span key={role} className="badge" data-role={role}>
                    {role}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NextEvent
