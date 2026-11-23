import Link from 'next/link'
import { useId } from 'react'

import { type EventCast as Cast } from '#/app/_data/events.schema'
import { personPath } from '#/app/_data/people'

import './index.components.css'

interface EventCastProps {
  cast: Cast[]
  /**
   * Level of the "Line Up" heading. Defaults to 4 for the top page
   * (section h2 → event name h3 → h4); the event detail page uses 2 (h1 → h2).
   */
  headingLevel?: 2 | 3 | 4
}

export const EventCast: React.FC<EventCastProps> = ({
  cast,
  headingLevel = 4,
}) => {
  const titleId = useId()
  const Heading = `h${headingLevel}` as const
  return (
    <div role="group" aria-labelledby={titleId}>
      <Heading id={titleId} className="mono-label next-event-cast-title">
        Line Up
      </Heading>
      {/* role="list": Safari drops list semantics with list-style: none */}
      <ul className="next-event-cast" role="list" aria-label="出演者一覧">
        {cast.map((member, index) => (
          <li key={index}>
            <span className="next-event-cast-no">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Link
              className="next-event-cast-name"
              href={personPath(member.name)}
            >
              {member.name}
            </Link>
            <span className="next-event-cast-roles">
              <span className="sr-only">役割: </span>
              {member.roles.map(role => (
                <span key={role} className="badge" data-role={role}>
                  {role}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventCast
