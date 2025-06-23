'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import './index.components.css'
import { slides } from '#/app/_data/slides.schema'

const slideImages = slides.slides

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const slideshowRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Load current image and next few images
            const imagesToLoad = new Set<number>()
            for (let i = 0; i < Math.min(3, slideImages.length); i++) {
              imagesToLoad.add((currentIndex + i) % slideImages.length)
            }
            setLoadedImages(prev => new Set([...prev, ...imagesToLoad]))
          }
        })
      },
      { threshold: 0.1 }
    )

    if (slideshowRef.current) {
      observer.observe(slideshowRef.current)
    }

    return () => observer.disconnect()
  }, [currentIndex])

  // Auto-advance slideshow only when visible
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % slideImages.length
        // Preload next few images
        const imagesToLoad = new Set<number>()
        for (let i = 0; i < 3; i++) {
          imagesToLoad.add((nextIndex + i) % slideImages.length)
        }
        setLoadedImages(prev => new Set([...prev, ...imagesToLoad]))
        return nextIndex
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [isVisible])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    // Load clicked image and surrounding images
    const imagesToLoad = new Set<number>()
    for (let i = -1; i <= 1; i++) {
      const imageIndex = (index + i + slideImages.length) % slideImages.length
      imagesToLoad.add(imageIndex)
    }
    setLoadedImages(prev => new Set([...prev, ...imagesToLoad]))
  }

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? slideImages.length - 1 : prevIndex - 1
      // Preload previous images
      const imagesToLoad = new Set<number>()
      for (let i = -1; i <= 1; i++) {
        const imageIndex =
          (newIndex + i + slideImages.length) % slideImages.length
        imagesToLoad.add(imageIndex)
      }
      setLoadedImages(prev => new Set([...prev, ...imagesToLoad]))
      return newIndex
    })
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % slideImages.length
      // Preload next images
      const imagesToLoad = new Set<number>()
      for (let i = -1; i <= 1; i++) {
        const imageIndex =
          (newIndex + i + slideImages.length) % slideImages.length
        imagesToLoad.add(imageIndex)
      }
      setLoadedImages(prev => new Set([...prev, ...imagesToLoad]))
      return newIndex
    })
  }

  return (
    <div className="slideshow" ref={slideshowRef}>
      <div className="slideshow-container">
        <button
          className="slideshow-nav prev"
          onClick={goToPrevious}
          aria-label="前のスライドを表示"
        />

        <div className="slideshow-images" role="img" aria-live="polite">
          {slideImages.map((slide, index) => (
            <div
              key={slide.path}
              className={`slideshow-slide ${index === currentIndex ? 'active' : ''}`}
            >
              {loadedImages.has(index) ? (
                <picture
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  {/* WebP source if available */}
                  {slide.alternatives.find(alt => alt.format === 'webp') && (
                    <source
                      srcSet={
                        slide.alternatives.find(alt => alt.format === 'webp')!
                          .path
                      }
                      type="image/webp"
                    />
                  )}
                  {/* Primary format as fallback */}
                  <Image
                    src={slide.path}
                    alt={slide.alt}
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                    fill
                  />
                </picture>
              ) : (
                <div
                  className="slideshow-placeholder"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  Loading...
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="slideshow-nav next"
          onClick={goToNext}
          aria-label="次のスライドを表示"
        />
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
