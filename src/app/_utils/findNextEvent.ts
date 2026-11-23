import { Event } from '#/app/_data/events.schema'

// Events are held in Japan, so "today" is the calendar date in Tokyo,
// regardless of the viewer's time zone.
export const EVENT_TIME_ZONE = 'Asia/Tokyo'

const tokyoDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: EVENT_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** The calendar date in Tokyo at `at`, as "yyyy-MM-dd" (same form as eventDate). */
export function tokyoDateString(at: Date = new Date()): string {
  const parts = Object.fromEntries(
    tokyoDateFormat.formatToParts(at).map(p => [p.type, p.value])
  )
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function findNextEvent(
  events: Event[],
  referenceDate: Date = new Date()
): Event | null {
  const today = tokyoDateString(referenceDate)

  // eventDate is a zero-padded "yyyy-MM-dd", so string order is date order
  const upcomingEvents = events
    .filter(event => event.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))

  return upcomingEvents.length > 0 ? upcomingEvents[0] : null
}
