'use client'

import { useState, useEffect, useRef } from 'react'

import './index.components.css'

import { type SlidesData } from '#/app/_data/slides.schema'

import { DotNavigation } from '../common/DotNavigation'
import { MediaCounter } from '../common/MediaCounter'
import { NavigationButton } from '../common/NavigationButton'
import '../common/media.css'

const AUTOPLAY_DURATION = 6000

interface SlideshowProps {
  slides: SlidesData
}

export default function Slideshow({ slides }: SlideshowProps) {
  const slideImages = slides.slides
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const slideshowRef = useRef<HTMLDivElement>(null)
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)

  // No autoplay for reduced motion (animations are globally shortened there)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setAutoplayEnabled(!query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  const paused = userPaused || hovered || focused || !inView || !pageVisible

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setInView(entry.isIntersecting)
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
    <div
      className="slideshow"
      ref={slideshowRef}
      onFocus={() => setFocused(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false)
        }
      }}
    >
      <div
        className="slideshow-container media-frame"
        onPointerEnter={event => {
          if (event.pointerType === 'mouse') setHovered(true)
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <NavigationButton
          direction="prev"
          onClick={goToPrevious}
          ariaLabel="前のスライドを表示"
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
                  <source srcSet={slide.path} type="image/png" />
                  <img alt={slide.alt} style={{
                      objectFit: 'cover',
                      objectPosition: slide.position,
                      width: '100%',
                      height: '100%',
                    }} />
                </picture>
              ) : (
                <div className="media-placeholder" />
              )}
            </div>
          ))}
        </div>

        <NavigationButton
          direction="next"
          onClick={goToNext}
          ariaLabel="次のスライドを表示"
        />
        <MediaCounter current={currentIndex} total={slideImages.length} />
        {autoplayEnabled && (
          <button
            className="media-toggle"
            onClick={() => setUserPaused(prev => !prev)}
            aria-pressed={userPaused}
            aria-label={
              userPaused ? 'スライドの自動再生を再開' : 'スライドの自動再生を停止'
            }
          >
            {userPaused ? 'PLAY' : 'PAUSE'}
          </button>
        )}
        {slideImages[currentIndex]?.credit && (
          <a
            className="media-credit"
            href={slideImages[currentIndex].credit.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Photo by {slideImages[currentIndex].credit.author}
          </a>
        )}
      </div>

      <DotNavigation
        totalItems={slideImages.length}
        currentIndex={currentIndex}
        onIndexChange={goToSlide}
        ariaLabel="スライド選択"
        getItemAriaLabel={index => `スライド ${index + 1} を表示`}
        autoplay={
          autoplayEnabled
            ? { duration: AUTOPLAY_DURATION, paused, onComplete: goToNext }
            : undefined
        }
      />
    </div>
  )
}
