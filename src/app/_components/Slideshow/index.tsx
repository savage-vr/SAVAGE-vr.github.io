'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import './index.components.css'

import { type SlidesData } from '#/app/_data/slides.schema'

import { DotNavigation } from '../common/DotNavigation'
import { NavigationButton } from '../common/NavigationButton'

interface SlideshowProps {
  slides: SlidesData
}

export default function Slideshow({ slides }: SlideshowProps) {
  const slideImages = slides.slides
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const slideshowRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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
  }, [currentIndex, slideImages.length])

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
        <NavigationButton
          direction="prev"
          onClick={goToPrevious}
          ariaLabel="前のスライドを表示"
          className="slideshow-nav prev"
          useDefaultStyle={false}
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

        <NavigationButton
          direction="next"
          onClick={goToNext}
          ariaLabel="次のスライドを表示"
          className="slideshow-nav next"
        />
      </div>

      <DotNavigation
        totalItems={slideImages.length}
        currentIndex={currentIndex}
        onIndexChange={goToSlide}
        ariaLabel="スライド選択"
        getItemAriaLabel={index => `スライド ${index + 1} を表示`}
      />
    </div>
  )
}
