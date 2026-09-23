import { type Event, events } from './events.schema'
import { type Member, members } from './members.schema'

export type Appearance = {
  event: Event
  roles: Event['cast'][number]['roles']
}

export type Person = {
  name: string
  slug: string
  appearances: Appearance[] // newest first
  roles: Array<'DJ' | 'VJ'>
  member?: Member
}

// Romaji used in the announcement posts, for names written in Japanese
const SLUG_ALIASES: Record<string, string> = {
  みや: 'mya',
  切り昆布: 'kirikombu',
}

// Short stable id (FNV-1a) for names that have no ASCII form
const hashSlug = (name: string) => {
  let hash = 0x811c9dc5
  for (const byte of new TextEncoder().encode(name)) {
    hash = Math.imul(hash ^ byte, 0x01000193) >>> 0
  }
  return `p-${hash.toString(16).padStart(8, '0')}`
}

// URL slugs must be ASCII: static export doesn't match non-ASCII params
export const personSlug = (name: string) => {
  if (SLUG_ALIASES[name]) return SLUG_ALIASES[name]
  const ascii = name
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return /^[\x00-\x7f]*$/.test(name) && ascii ? ascii : hashSlug(name)
}

export const personPath = (name: string) => `/members/${personSlug(name)}/`

// Everyone who appears in an event line up, most appearances first
export const people: Person[] = (() => {
  const byName = new Map<string, Person>()
  const newestFirst = [...events.events].sort((a, b) =>
    b.eventDate.localeCompare(a.eventDate)
  )
  for (const event of newestFirst) {
    for (const cast of event.cast) {
      const person = byName.get(cast.name) ?? {
        name: cast.name,
        slug: personSlug(cast.name),
        appearances: [],
        roles: [],
        member: members.members.find(m => m.name === cast.name),
      }
      person.appearances.push({ event, roles: cast.roles })
      for (const role of cast.roles) {
        if (!person.roles.includes(role)) person.roles.push(role)
      }
      byName.set(cast.name, person)
    }
  }
  const all = [...byName.values()]
  const slugs = new Set(all.map(p => p.slug))
  if (slugs.size !== all.length) {
    throw new Error('Two performers share the same member page slug')
  }
  return all.sort(
    (a, b) =>
      b.appearances.length - a.appearances.length ||
      a.name.localeCompare(b.name)
  )
})()

export const findPerson = (slug: string) =>
  people.find(p => p.slug === slug) ?? null
