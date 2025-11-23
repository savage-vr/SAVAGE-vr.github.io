import React from 'react'

import { ProfileImage } from './ProfileImage'
import './index.components.css'

type Props = {
  name: string
  imgSrc: string
  roles: Array<'BOSS' | 'DJ' | 'VJ'>
  links: Array<[string, string]> // tuple of [title, url]
}

export const Role: React.FC<{ role: 'BOSS' | 'DJ' | 'VJ' }> = ({ role }) => {
  return (
    <p className="font-bold text-xs flex items-center gap-1">
      {role === 'BOSS' && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 200 169.002"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L14 7H19L15 10L17 15L12 12L7 15L9 10L5 7H10L12 2Z M5 19H19V21H5V19Z" />
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="169.002" viewBox="0 0 200 169.002">
            <path d="M1850.217,332.258,1805.088,408.6l-54.871-40.268,21.458,102.046,157.084.006,21.458-102.045-54.868,40.268Zm-78.588,147.474V501.26h157.179V479.733Z" transform="translate(-1750.217 -332.258)"/>
          </svg>
        </svg>
      )}
      {role}
    </p>
  )
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
