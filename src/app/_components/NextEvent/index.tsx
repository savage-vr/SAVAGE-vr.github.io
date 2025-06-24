'use client'

import React, { useEffect, useState } from 'react'

import { type Event, type EventsData } from '#/app/_data/events.schema'

import './index.components.css'

const findNextEvent = (events: EventsData): Event | null => {
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

interface NextEventProps {
  events: EventsData
}

export const NextEvent: React.FC<NextEventProps> = ({ events }) => {
  const nextEvent = findNextEvent(events)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(() => false)
  }, [loading, setLoading])
  if (loading) return null

  if (!nextEvent) {
    return (
      <section
        className="text-center py-12 px-8 bg-gradient-to-br from-gray-900 to-gray-700 border border-gray-600 rounded-xl max-w-[600px]"
        role="region"
        aria-live="polite"
        aria-labelledby="next-event-title"
      >
        <h3
          id="next-event-title"
          className="text-2xl font-bold mb-4 text-white text-center border-b-2 border-gray-600 pb-2"
        >
          次のイベント
        </h3>
        <p className="text-lg text-gray-400 mt-4 italic" role="status">
          現在予定されているイベントはありません
        </p>
      </section>
    )
  }

  return (
    <section
      className="max-w-[600px] pb-4 sm:p-6 sm:m-4"
      role="region"
      aria-live="polite"
      aria-labelledby="next-event-title"
    >
      <h3
        id="next-event-title"
        className="text-2xl font-bold mb-4 text-white text-center border-b-2 border-gray-600 pb-2"
      >
        Next
      </h3>
      <div className="flex flex-col gap-4" aria-describedby="event-details">
        <h4 className="text-xl sm:text-3xl font-semibold text-white text-center mb-2">
          {nextEvent.tweets ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              href={nextEvent.tweets}
              aria-label={`${nextEvent.name} - 外部リンクで詳細を見る`}
              className="underline"
            >
              {nextEvent.name}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            nextEvent.name
          )}
        </h4>
        <time
          className="text-lg sm:text-base min-w-3xs m-auto text-gray-300 text-center font-medium p-2 bg-white/5 rounded-lg"
          dateTime={nextEvent.eventDate}
          aria-label={`開催日: ${formatEventDate(nextEvent.eventDate)}`}
        >
          {formatEventDate(nextEvent.eventDate)}
        </time>
        <div className="mt-4 m-auto min-w-3xs" role="group" aria-labelledby="cast-title">
          <h5
            id="cast-title"
            className="text-lg font-semibold text-white mb-3 text-center"
          >
            出演者
          </h5>
          <ul className="flex flex-col gap-1 list-none" aria-label="出演者一覧">
            {nextEvent.cast.map((member, index) => (
              <li
                key={index}
                className="flex justify-between items-center flex-row flex-wrap sm:items-start sm:gap-1 p-3 bg-white/5 rounded-lg border-l-4 border-amber-700"
              >
                <span className="font-semibold text-white">{member.name}</span>
                <span
                  className="text-sm text-gray-400 font-medium"
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
