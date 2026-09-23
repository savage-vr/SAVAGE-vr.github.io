import { agentMembers, generatedAt, SITE } from '#/app/_data/agent'

export const dynamic = 'force-static'

export function GET() {
  return Response.json({
    site: SITE.name,
    generatedAt,
    // Everyone who has played SAVAGE; `crew` marks the organizing members
    members: agentMembers,
  })
}
