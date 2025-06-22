'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

type Props = {
  name: string
  imgSrc: string
}

export const ProfileImage: React.FC<Props> = ({ name, imgSrc }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="profile-image-container" style={{ position: 'relative' }} ref={imageRef}>
      {isVisible ? (
        <Image
          className="profile-image"
          src={imgSrc}
          alt={`${name}'s picture`}
          width="200"
          height="200"
          onLoad={() => setIsImageLoaded(true)}
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      ) : (
        <div
          className="profile-image"
          style={{
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '12px',
          }}
        >
          Loading...
        </div>
      )}
    </div>
  )
}