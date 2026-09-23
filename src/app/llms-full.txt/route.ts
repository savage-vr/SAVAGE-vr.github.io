import { agentEvents, agentMembers, SITE } from '#/app/_data/agent'

export const dynamic = 'force-static'

export function GET() {
  const events = agentEvents.map(e => {
    const byRole = (role: 'DJ' | 'VJ') =>
      e.lineup
        .filter(c => c.roles.includes(role))
        .map(c => c.name)
        .join(', ')
    return [
      `## ${e.date} ${e.name}`,
      '',
      `- Page: ${e.url}`,
      `- DJ: ${byRole('DJ') || '-'}`,
      `- VJ: ${byRole('VJ') || '-'}`,
      e.flyer && `- Flyer: ${e.flyer}`,
      e.announcement && `- Announcement: ${e.announcement}`,
    ]
      .filter(Boolean)
      .join('\n')
  })
  const members = agentMembers.map(
    m =>
      `- ${m.name}${m.crew ? ' (crew)' : ''}: ${m.appearances} appearances (DJ ${m.asDJ}, VJ ${m.asVJ}) ${m.url}`
  )
  const text = `# ${SITE.name} — full event history

> ${SITE.descriptionEn} Times are ${SITE.timezone}.

# Events (newest first)

${events.join('\n\n')}

# Performers (most appearances first)

${members.join('\n')}
`
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
