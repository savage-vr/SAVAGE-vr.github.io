// Machine-readable views of the site for AI agents: llms.txt, JSON data
// and the A2A Agent Card are all generated from these at build time.
import { eventPath, events } from './events.schema'
import { people, personPath } from './people'

export const SITE = {
  name: 'SAVAGE',
  url: 'https://savage-vr.github.io',
  tagline: 'FLEX the chaos',
  description:
    'SAVAGE は、不思議で魅惑的な空気感を大切にする、VRChat 上のクラブイベントです。時折テーマを設け、その世界観に深く浸るように構成された DJ セットが特徴です。',
  descriptionEn:
    'SAVAGE is a club event in VRChat with a mysterious, alluring atmosphere, known for themed nights and immersive DJ sets.',
  links: {
    vrchatGroup:
      'https://vrchat.com/home/group/grp_0fa30f81-0523-4034-90ab-c3ca819b9fea',
    x: 'https://x.com/vrcsavageinfo',
  },
  timezone: 'Asia/Tokyo',
} as const

export const DATA_PATHS = {
  events: '/data/events.json',
  members: '/data/members.json',
  llms: '/llms.txt',
  llmsFull: '/llms-full.txt',
  agentCard: '/.well-known/agent-card.json',
} as const

export const absolute = (path: string) => new URL(path, SITE.url).toString()

// Newest first
export const agentEvents = [...events.events]
  .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
  .map(event => ({
    name: event.name,
    date: event.eventDate,
    url: absolute(eventPath(event)),
    flyer: event.flyer ? absolute(event.flyer) : null,
    announcement: event.tweets ?? null,
    lineup: event.cast.map(cast => ({
      name: cast.name,
      roles: cast.roles,
      url: absolute(personPath(cast.name)),
    })),
  }))

export const agentMembers = people.map(person => ({
  name: person.name,
  crew: !!person.member,
  roles: person.member?.roles ?? person.roles,
  appearances: person.appearances.length,
  asDJ: person.appearances.filter(a => a.roles.includes('DJ')).length,
  asVJ: person.appearances.filter(a => a.roles.includes('VJ')).length,
  url: absolute(personPath(person.name)),
  links: (person.member?.links ?? []).map(([title, url]) => ({ title, url })),
  events: person.appearances.map(({ event, roles }) => ({
    name: event.name,
    date: event.eventDate,
    roles,
    url: absolute(eventPath(event)),
  })),
}))

export const generatedAt = new Date().toISOString()
