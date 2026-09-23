'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

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
    <div className="profile-image-container" ref={imageRef}>
      {isVisible ? (
        <Image
          className="profile-image"
          src={imgSrc}
          alt={`${name}'s picture`}
          width="200"
          height="200"
          onLoad={() => setIsImageLoaded(true)}
          style={{ opacity: isImageLoaded ? 1 : 0 }}
        />
      ) : (
        <div className="profile-image profile-image-placeholder" />
      )}
    </div>
  )
}
