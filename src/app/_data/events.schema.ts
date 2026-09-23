import { z } from 'zod'

import json from './events.json'

const EventCastSchema = z.object({
  name: z.string(),
  roles: z.array(z.enum(['DJ', 'VJ'])),
})

const EventSchema = z.object({
  name: z.string(),
  cast: z.array(EventCastSchema),
  eventDate: z.string().date(),
  tweets: z.string().optional(),
  // Path under /public; a .webp with the same basename is used when present
  flyer: z.string().startsWith('/').optional(),
})

const EventsDataSchema = z.object({
  events: z.array(EventSchema),
})

export type EventCast = z.infer<typeof EventCastSchema>
export type Event = z.infer<typeof EventSchema>
export type EventsData = z.infer<typeof EventsDataSchema>

export function validateEventsData(data: unknown): EventsData {
  return EventsDataSchema.parse(data)
}

export function safeParseEventsData(
  data: unknown
): { success: true; data: EventsData } | { success: false; error: z.ZodError } {
  const result = EventsDataSchema.safeParse(data)
  return result
}

export const events = validateEventsData(json)

// Detail page URL; one event per day, so the date is the slug
export const eventPath = (event: Pick<Event, 'eventDate'>) =>
  `/events/${event.eventDate}/`
