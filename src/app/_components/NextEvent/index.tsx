'use client'

import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { eventPath, type EventsData } from '#/app/_data/events.schema'
import { findNextEvent } from '#/app/_utils/findNextEvent'

import { EventCast } from '../EventCast'

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
        <Link href={eventPath(nextEvent)}>{nextEvent.name}</Link>
      </h3>
      <EventCast cast={nextEvent.cast} />
      <Link className="next-event-more mono-label" href={eventPath(nextEvent)}>
        Flyer &amp; Details →
      </Link>
    </div>
  )
}

export default NextEvent
