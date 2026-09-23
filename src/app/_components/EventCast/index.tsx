import Link from 'next/link'

import { type EventCast as Cast } from '#/app/_data/events.schema'
import { personPath } from '#/app/_data/people'

import './index.components.css'

export const EventCast: React.FC<{ cast: Cast[] }> = ({ cast }) => {
  return (
    <div role="group" aria-labelledby="cast-title">
      <h4 id="cast-title" className="mono-label next-event-cast-title">
        Line Up
      </h4>
      <ul className="next-event-cast" aria-label="出演者一覧">
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
            <span
              className="next-event-cast-roles"
              aria-label={`役割: ${member.roles.join(', ')}`}
            >
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
