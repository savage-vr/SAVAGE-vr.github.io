import Link from 'next/link'
import React from 'react'

import { personPath } from '#/app/_data/people'

import { ProfileImage } from './ProfileImage'
import './index.components.css'

type Props = {
  name: string
  imgSrc: string
  roles: Array<'BOSS' | 'DJ' | 'VJ'>
  links: Array<[string, string]> // tuple of [title, url]
}

const CrownIcon = () => (
  <svg
    width="10"
    height="9"
    viewBox="0 0 200 169.002"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1850.217,332.258,1805.088,408.6l-54.871-40.268,21.458,102.046,157.084.006,21.458-102.045-54.868,40.268Zm-78.588,147.474V501.26h157.179V479.733Z"
      transform="translate(-1750.217 -332.258)"
    />
  </svg>
)

export const Role: React.FC<{ role: 'BOSS' | 'DJ' | 'VJ' }> = ({ role }) => {
  return (
    <span className="badge" data-role={role}>
      {role === 'BOSS' && <CrownIcon />}
      {role}
    </span>
  )
}

export const Profile: React.FC<Props> = ({ name, roles, imgSrc, links }) => {
  return (
    <article className="profile" aria-labelledby={`profile-${name}`}>
      <ProfileImage name={name} imgSrc={imgSrc} />
      <div className="profile-info">
        <h3 id={`profile-${name}`} className="profile-name">
          <Link href={personPath(name)}>{name}</Link>
        </h3>
        <ul className="profile-roles" aria-label={`${name}の役割`}>
          {roles.map((r, index) => (
            <li key={index}>
              <Role role={r} />
            </li>
          ))}
        </ul>
        <nav aria-label={`${name}のリンク`}>
          <ul className="profile-links">
            {links.map(([title, url], index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name}の${title}を新しいタブで開く`}
                >
                  {title}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  )
}
