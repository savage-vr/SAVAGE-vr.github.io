'use client'

import { useState, useEffect, useRef } from 'react'

import './index.components.css'

import { type SlidesData } from '#/app/_data/slides.schema'

import { DotNavigation } from '../common/DotNavigation'
import { MediaCounter } from '../common/MediaCounter'
import { NavigationButton } from '../common/NavigationButton'
import '../common/media.css'

import { Lightbox } from './Lightbox'

const AUTOPLAY_DURATION = 6000

const webpFor = (slide: SlidesData['slides'][number]) =>
  slide.alternatives.find(alt => alt.format === 'webp')?.path

interface SlideshowProps {
  slides: SlidesData
}

export default function Slideshow({ slides }: SlideshowProps) {
  const slideImages = slides.slides
  const [currentIndex, setCurrentIndex] = useState(0)
  const slideshowRef = useRef<HTMLDivElement>(null)
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  // Announce the slide only after user navigation, never on autoplay
  const [announce, setAnnounce] = useState(false)

  // No autoplay for reduced motion (its progress animation is motion-gated in CSS)
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

  // Autoplay only once most of the slideshow is on screen
  useEffect(() => {
    const element = slideshowRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6] }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const paused =
    userPaused || hovered || focused || !inView || !pageVisible || lightboxOpen

  const goToSlide = (index: number) => setCurrentIndex(index)

  const goToPrevious = () =>
    setCurrentIndex(prev => (prev === 0 ? slideImages.length - 1 : prev - 1))

  const goToNext = () => setCurrentIndex(prev => (prev + 1) % slideImages.length)

  const userPrevious = () => {
    setAnnounce(true)
    goToPrevious()
  }

  const userNext = () => {
    setAnnounce(true)
    goToNext()
  }

  const userGoToSlide = (index: number) => {
    setAnnounce(true)
    goToSlide(index)
  }

  const autoplayNext = () => {
    setAnnounce(false)
    goToNext()
  }

  return (
    <section
      className="slideshow"
      ref={slideshowRef}
      aria-roledescription="carousel"
      aria-label="ギャラリー"
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
          onClick={userPrevious}
          ariaLabel="前のスライドを表示"
        />

        <div className="slideshow-images">
          {slideImages.map((slide, index) => (
            <div
              key={slide.path}
              className={`slideshow-slide ${index === currentIndex ? 'active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slideImages.length}`}
            >
              <picture
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                {webpFor(slide) && (
                  <source srcSet={webpFor(slide)} type="image/webp" />
                )}
                {/* Real src from the start; hidden slides are lazy and low
                    priority so they never compete with the first slide */}
                <img
                  src={slide.path}
                  alt={slide.alt}
                  loading={index === 0 ? undefined : 'lazy'}
                  fetchPriority={index === 0 ? undefined : 'low'}
                  style={{
                    objectFit: 'cover',
                    objectPosition: slide.position,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </picture>
            </div>
          ))}
          <button
            type="button"
            className="slideshow-zoom"
            onClick={() => setLightboxOpen(true)}
            aria-label={`画像 ${currentIndex + 1} を拡大表示`}
          />
        </div>

        <NavigationButton
          direction="next"
          onClick={userNext}
          ariaLabel="次のスライドを表示"
        />
        <MediaCounter current={currentIndex} total={slideImages.length} />
        {autoplayEnabled && (
          <button
            type="button"
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
        onIndexChange={userGoToSlide}
        ariaLabel="スライド選択"
        getItemAriaLabel={index => `スライド ${index + 1} を表示`}
        autoplay={
          autoplayEnabled
            ? { duration: AUTOPLAY_DURATION, paused, onComplete: autoplayNext }
            : undefined
        }
      />

      <p className="sr-only" role="status" aria-live="polite">
        {announce ? `スライド ${currentIndex + 1} / ${slideImages.length}` : ''}
      </p>

      <Lightbox
        slides={slideImages}
        index={currentIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={userPrevious}
        onNext={userNext}
      />
    </section>
  )
}
