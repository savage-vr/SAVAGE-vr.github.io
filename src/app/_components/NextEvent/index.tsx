'use client'

import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { eventPath, type EventsData } from '#/app/_data/events.schema'
import { findNextEvent, tokyoDateString } from '#/app/_utils/findNextEvent'

import { EventCast } from '../EventCast'

import './index.components.css'

const formatEventDate = (dateString: string): string => {
  // parseISO reads a date-only string as local midnight; new Date() reads it as UTC
  return format(parseISO(dateString), 'yyyy.MM.dd')
}

const formatCountdown = (dateString: string): string => {
  // Count calendar days from today in Tokyo (where events are held), not the
  // viewer's local date
  const days = differenceInCalendarDays(
    parseISO(dateString),
    parseISO(tokyoDateString())
  )
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
      <div className="next-event">
        <div className="next-event-meta mono-label">Stay tuned</div>
        <p className="next-event-date" aria-hidden="true">
          TBA
        </p>
        <p className="next-event-empty">
          現在予定されているイベントはありません
        </p>
      </div>
    )
  }

  return (
    <div className="next-event">
      <div className="next-event-meta mono-label">
        <span className="next-event-live" aria-hidden="true" />
        <span>{formatCountdown(nextEvent.eventDate)}</span>
      </div>
      <time className="next-event-date" dateTime={nextEvent.eventDate}>
        <span className="sr-only">開催日: </span>
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
