'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import './index.components.css'

const slideImages = [
  '/slide/VRChat_2025-01-22_23-04-06.240_1920x1080.png',
  '/slide/VRChat_2025-01-22_23-42-56.016_1920x1080.png',
  '/slide/VRChat_2025-04-23_21-02-21.982_1920x1080.png',
  '/slide/VRChat_2025-04-23_23-04-09.170_2560x1440.png',
  '/slide/VRChat_2025-04-23_23-47-33.143_2560x1440.png',
  '/slide/VRChat_2025-04-23_23-48-18.239_1920x1080.png',
  '/slide/VRChat_2025-04-23_23-50-40.674_2560x1440.png',
  '/slide/VRChat_2025-04-24_00-31-35.116_1920x1080.png',
  '/slide/VRChat_2025-05-21_20-48-45.318_1920x1080.png',
  '/slide/VRChat_2025-05-21_22-28-57.684_1920x1080.webp',
]

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % slideImages.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? slideImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % slideImages.length)
  }

  return (
    <div className="slideshow">
      <div className="slideshow-container">
        <button 
          className="slideshow-nav prev" 
          onClick={goToPrevious}
          aria-label="前のスライドを表示"
        >
          ◀
        </button>

        <div className="slideshow-images" role="img" aria-live="polite">
          {slideImages.map((image, index) => (
            <div
              key={image}
              className={`slideshow-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <Image
                src={image}
                alt={`SAVAGEイベントのスライド ${index + 1}/${slideImages.length}`}
                style={{ objectFit: 'cover' }}
                priority={index === 0}
                fill
              />
            </div>
          ))}
        </div>

        <button 
          className="slideshow-nav next" 
          onClick={goToNext}
          aria-label="次のスライドを表示"
        >
          ▶
        </button>
      </div>

      <div className="slideshow-dots" role="tablist" aria-label="スライド選択">
        {slideImages.map((_, index) => (
          <button
            key={index}
            className={`slideshow-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-label={`スライド ${index + 1} を表示`}
            aria-selected={index === currentIndex}
          />
        ))}
      </div>
    </div>
  )
}
