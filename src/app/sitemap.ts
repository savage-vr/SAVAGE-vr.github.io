import { absolute } from '#/app/_data/agent'
import { eventPath, events } from '#/app/_data/events.schema'
import { people, personPath } from '#/app/_data/people'

import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = events.events
    .map(event => event.eventDate)
    .sort()
    .at(-1)
  return [
    { url: absolute('/'), lastModified: latest },
    ...events.events.map(event => ({
      url: absolute(eventPath(event)),
      lastModified: event.eventDate,
    })),
    // appearances are newest first
    ...people.map(person => ({
      url: absolute(personPath(person.name)),
      lastModified: person.appearances[0]?.event.eventDate,
    })),
    { url: absolute('/EbzFj4/') },
  ]
}
