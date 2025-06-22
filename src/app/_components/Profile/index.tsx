import React from 'react'
import Image from 'next/image'
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
    <div className="flex flex-row">
      <Image
        className="profile-image"
        src={imgSrc}
        alt={`${name}'s picture`}
        width="200"
        height="200"
        priority
      />
      <div className="flex flex-col information min-w-[120px] gap-2">
        <h3 className="text-2xl">{name}</h3>
        <ul className="roles flex flex-row gap-2">
          {roles.map((r, index) => (
            <li key={index} className={r}>
              <Role role={r} />
            </li>
          ))}
        </ul>
        <ul className="links">
          {links.map(([title, url], index) => (
            <li key={index}>
              <a href={url}>{title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
