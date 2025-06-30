import { isAfter, startOfDay, parseISO } from 'date-fns'

import { Event } from '#/app/_data/events.schema'

export function findNextEvent(
  events: Event[],
  referenceDate: Date = new Date()
): Event | null {
  const today = startOfDay(referenceDate)

  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.eventDate)
      return (
        isAfter(eventDate, today) || eventDate.getTime() === today.getTime()
      )
    })
    .sort((a, b) => {
      const dateA = parseISO(a.eventDate)
      const dateB = parseISO(b.eventDate)
      return dateA.getTime() - dateB.getTime()
    })

  return upcomingEvents.length > 0 ? upcomingEvents[0] : null
}
