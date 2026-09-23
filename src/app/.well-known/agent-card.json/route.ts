import { absolute, DATA_PATHS, SITE } from '#/app/_data/agent'

export const dynamic = 'force-static'

// A2A Agent Card (https://a2a-protocol.org). This is a static site, so there
// is no task endpoint behind it: the skills point agents at the static data.
export function GET() {
  return Response.json({
    protocolVersion: '0.3.0',
    name: SITE.name,
    description: `${SITE.descriptionEn} Read-only static site: no A2A task endpoint. Read the data URLs in each skill instead.`,
    url: SITE.url,
    version: '1.0.0',
    iconUrl: absolute('/android-chrome-512x512.png'),
    documentationUrl: absolute(DATA_PATHS.llms),
    provider: { organization: SITE.name, url: SITE.url },
    capabilities: { streaming: false, pushNotifications: false },
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['application/json', 'text/plain'],
    skills: [
      {
        id: 'upcoming-event',
        name: 'Upcoming event',
        description: `Next SAVAGE event with date, line up and flyer. Read ${absolute(DATA_PATHS.events)} and take the earliest event whose date is today or later (${SITE.timezone}).`,
        tags: ['event', 'schedule', 'vrchat', 'club'],
        examples: [
          '次の SAVAGE はいつ？',
          'Who is playing at the next SAVAGE?',
        ],
      },
      {
        id: 'event-history',
        name: 'Event history',
        description: `All past SAVAGE events with line ups: ${absolute(DATA_PATHS.events)} or ${absolute(DATA_PATHS.llmsFull)}.`,
        tags: ['event', 'archive', 'lineup'],
        examples: ['LOCKED SUMMER Edition の出演者は？'],
      },
      {
        id: 'performer-lookup',
        name: 'Performer lookup',
        description: `How often someone has played SAVAGE and at which events: ${absolute(DATA_PATHS.members)}.`,
        tags: ['dj', 'vj', 'performer'],
        examples: ['RoastPotato は何回出演した？'],
      },
    ],
  })
}
