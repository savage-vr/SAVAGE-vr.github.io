import React from 'react'

import { ProfileImage } from './ProfileImage'
import './index.components.css'

type Props = {
  name: string
  imgSrc: string
  roles: Array<'DJ' | 'VJ'>
  links: Array<[string, string]> // tuple of [title, url]
}

export const Role: React.FC<{ role: 'DJ' | 'VJ' }> = ({ role }) => {
  return <p className="font-bold text-xs">{role}</p>
}

export const Profile: React.FC<Props> = ({ name, roles, imgSrc, links }) => {
  return (
    <article className="flex flex-row" aria-labelledby={`profile-${name}`}>
      <ProfileImage name={name} imgSrc={imgSrc} />
      <div className="flex flex-col information min-w-[120px] gap-2">
        <h3 id={`profile-${name}`} className="text-2xl">
          {name}
        </h3>
        <ul className="roles flex flex-row gap-2" aria-label={`${name}の役割`}>
          {roles.map((r, index) => (
            <li key={index} className={r}>
              <Role role={r} />
            </li>
          ))}
        </ul>
        <nav aria-label={`${name}のリンク`}>
          <ul className="links">
            {links.map(([title, url], index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name}の${title}を新しいタブで開く`}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  )
}
