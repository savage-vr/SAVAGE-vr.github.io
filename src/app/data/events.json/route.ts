import { agentEvents, generatedAt, SITE } from '#/app/_data/agent'

export const dynamic = 'force-static'

export function GET() {
  return Response.json({
    site: SITE.name,
    timezone: SITE.timezone,
    // Built on each deploy: compare `date` with today to find the next event
    generatedAt,
    events: agentEvents,
  })
}
