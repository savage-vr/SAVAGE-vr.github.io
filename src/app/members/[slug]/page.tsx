import { format, parseISO } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BackLink } from '#/app/_components/BackLink'
import { Grid } from '#/app/_components/Grid'
import { Role } from '#/app/_components/Profile'
import { eventPath } from '#/app/_data/events.schema'
import { findPerson, people, personPath } from '#/app/_data/people'

import type { Metadata } from 'next'

import '#/app/_components/common/detail.css'
import '#/app/_components/EventArchive/index.components.css'
import './page.css'

type Params = { slug: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return people.map(person => ({ slug: person.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const person = findPerson((await params).slug)
  if (!person) return {}
  const title = `${person.name} | SAVAGE`
  const description = `SAVAGE 出演 ${person.appearances.length} 回 (${person.roles.join(' / ')})`
  const image = person.member?.imgSrc ?? '/logo-fill.jpg'
  return {
    title,
    description,
    metadataBase: new URL('https://savage-vr.github.io'),
    alternates: { canonical: personPath(person.name) },
    openGraph: {
      title,
      description,
      url: personPath(person.name),
      siteName: 'SAVAGE',
      images: [{ url: image, alt: person.name }],
      locale: 'ja_JP',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      site: '@vrcsavageinfo',
      images: [image],
    },
  }
}

export default async function MemberPage({
  params,
}: {
  params: Promise<Params>
}) {
  const person = findPerson((await params).slug)
  if (!person) notFound()
  const { member, appearances } = person
  const count = (role: 'DJ' | 'VJ') =>
    appearances.filter(a => a.roles.includes(role)).length

  return (
    <main id="main-content" className="event-page member-page">
      <nav className="event-back mono-label">
        <BackLink />
      </nav>

      <header className="member-header">
        {member && (
          <Image
            className="member-photo"
            src={member.imgSrc}
            alt={`${person.name}'s picture`}
            width={160}
            height={160}
          />
        )}
        <div>
          <p className="mono-label">{member ? 'SAVAGE Crew' : 'Guest'}</p>
          <h1 className="event-name member-name">{person.name}</h1>
          <ul className="member-roles">
            {(member?.roles ?? person.roles).map(role => (
              <li key={role}>
                <Role role={role} />
              </li>
            ))}
          </ul>
        </div>
      </header>

      <dl className="member-stats">
        <div>
          <dt className="mono-label">Appearances</dt>
          <dd className="member-stats-total">{appearances.length}</dd>
        </div>
        {(['DJ', 'VJ'] as const)
          .filter(role => count(role) > 0)
          .map(role => (
            <div key={role}>
              <dt className="mono-label">as {role}</dt>
              <dd>{count(role)}</dd>
            </div>
          ))}
      </dl>

      {member && member.links.length > 0 && (
        <ul className="member-links">
          {member.links.map(([title, url]) => (
            <li key={url}>
              <a
                className="mono-label"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title} ↗
              </a>
            </li>
          ))}
        </ul>
      )}

      <section className="member-events" aria-labelledby="member-events-title">
        <h2 id="member-events-title" className="mono-label">
          Events
        </h2>
        <ul className="event-archive">
          {appearances.map(({ event, roles }) => (
            <li key={event.eventDate}>
              <Link href={eventPath(event)}>
                <time className="event-archive-date" dateTime={event.eventDate}>
                  {format(parseISO(event.eventDate), 'yyyy.MM.dd')}
                </time>
                <span className="event-archive-name">{event.name}</span>
                <span className="event-archive-meta mono-label">
                  {roles.join(' / ')}
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Grid />
    </main>
  )
}
