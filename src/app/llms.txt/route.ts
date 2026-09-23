import {
  absolute,
  agentEvents,
  agentMembers,
  DATA_PATHS,
  SITE,
} from '#/app/_data/agent'

export const dynamic = 'force-static'

// https://llmstxt.org
export function GET() {
  const crew = agentMembers.filter(m => m.crew)
  const text = `# ${SITE.name}

> ${SITE.descriptionEn} Tagline: "${SITE.tagline}". Times are ${SITE.timezone}.

${SITE.description}

## Data

- [Events JSON](${absolute(DATA_PATHS.events)}): every event, newest first, with date, line up, flyer and announcement URLs
- [Members JSON](${absolute(DATA_PATHS.members)}): every performer with appearance counts and the events they played
- [Full text](${absolute(DATA_PATHS.llmsFull)}): all events and line ups as plain text
- [A2A Agent Card](${absolute(DATA_PATHS.agentCard)})

## Events

${agentEvents.map(e => `- [${e.date} ${e.name}](${e.url})`).join('\n')}

## Crew

${crew.map(m => `- [${m.name}](${m.url}): ${m.roles.join(' / ')}, ${m.appearances} appearances`).join('\n')}

## Links

- [Website](${SITE.url})
- [VRChat Group](${SITE.links.vrchatGroup})
- [X (announcements)](${SITE.links.x})
`
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
