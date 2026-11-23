'use client'

import { useEffect, useRef, useState } from 'react'

import { DotNavigation } from '../common/DotNavigation'
import { MediaCounter } from '../common/MediaCounter'
import { NavigationButton } from '../common/NavigationButton'
import '../common/media.css'

interface YouTubeVideo {
  id: string
  title: string
}

interface YouTubeSliderProps {
  videos: YouTubeVideo[]
}

const VideoFrame: React.FC<{
  video: YouTubeVideo
  isVisible: boolean
  label: string
}> = ({ video, isVisible, label }) => {
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div
      className="media-slide"
      role="group"
      aria-roledescription="slide"
      aria-label={label}
    >
      <div ref={containerRef} className="aspect-video">
        {shouldLoad && isVisible ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover opacity-60 grayscale"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-14 h-14 border border-white/40 rounded-full bg-black/60">
                <svg
                  className="w-5 h-5 ml-0.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const YouTubeSlider: React.FC<YouTubeSliderProps> = ({ videos }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  // Marker state: follows the scroll position, or the pending click target
  const [currentIndex, setCurrentIndex] = useState(0)
  // Index the track last settled on; announcements only fire when it changes
  const [settledIndex, setSettledIndex] = useState<number | null>(null)
  // Slide a button/marker click is scrolling to, so rapid clicks build on it
  const pendingRef = useRef<number | null>(null)

  // Nearest slide from the track's horizontal scroll position
  const nearestIndex = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return 0
    const index = Math.round(track.scrollLeft / track.clientWidth)
    return Math.min(videos.length - 1, Math.max(0, index))
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    let debounce: ReturnType<typeof setTimeout> | undefined

    const settle = () => {
      pendingRef.current = null
      const index = nearestIndex()
      setCurrentIndex(index)
      setSettledIndex(prev => (prev === null && index === 0 ? null : index))
    }

    const onScroll = () => {
      if (pendingRef.current === null && !frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          if (pendingRef.current === null) setCurrentIndex(nearestIndex())
        })
      }
    }

    // scrollend where supported, otherwise a debounced scroll fallback
    const supportsScrollEnd = 'onscrollend' in window
    const onScrollFallback = () => {
      clearTimeout(debounce)
      debounce = setTimeout(settle, 120)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    if (supportsScrollEnd) {
      track.addEventListener('scrollend', settle)
    } else {
      track.addEventListener('scroll', onScrollFallback, { passive: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(debounce)
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('scrollend', settle)
      track.removeEventListener('scroll', onScrollFallback)
    }
    // nearestIndex only reads the ref and videos.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.length])

  // Controls only start scrolling; state follows the scroll position
  const scrollToIndex = (index: number) => {
    const track = trackRef.current
    const slide = track?.children[index]
    if (!track || !slide) return
    pendingRef.current = index
    setCurrentIndex(index)
    const trackBox = track.getBoundingClientRect()
    const slideBox = slide.getBoundingClientRect()
    // Smoothness comes from CSS scroll-behavior (motion-gated)
    track.scrollBy({
      left:
        slideBox.left +
        slideBox.width / 2 -
        (trackBox.left + trackBox.width / 2),
    })
  }

  // Loops: next from the last slide scrolls back to the first, and vice versa
  const nextVideo = () =>
    scrollToIndex(((pendingRef.current ?? nearestIndex()) + 1) % videos.length)

  const prevVideo = () =>
    scrollToIndex(
      ((pendingRef.current ?? nearestIndex()) - 1 + videos.length) %
        videos.length
    )

  return (
    <section
      className="w-full"
      aria-roledescription="carousel"
      aria-label="動画"
    >
      <div className="media-frame">
        {videos.length > 1 && (
          <>
            <NavigationButton
              direction="prev"
              onClick={prevVideo}
              ariaLabel="前の動画"
            />
            <NavigationButton
              direction="next"
              onClick={nextVideo}
              ariaLabel="次の動画"
            />
          </>
        )}

        <div
          ref={trackRef}
          className="media-track"
          // Focusable so the native scroller works from the keyboard
          tabIndex={0}
          role="group"
          aria-label="動画一覧"
        >
          {videos.map((video, index) => (
            <VideoFrame
              key={video.id}
              video={video}
              isVisible={index === currentIndex}
              label={`${index + 1} / ${videos.length}`}
            />
          ))}
        </div>
      </div>

      <DotNavigation
        totalItems={videos.length}
        currentIndex={currentIndex}
        onIndexChange={scrollToIndex}
        ariaLabel="動画選択"
        getItemAriaLabel={index => `動画${index + 1}を表示`}
      />

      {videos[currentIndex] && (
        <p className="media-caption">
          <MediaCounter current={currentIndex} total={videos.length} />
          <span>{videos[currentIndex].title}</span>
        </p>
      )}

      {/* Announced after scrolling settles on a new slide, never on load */}
      <p className="sr-only" role="status" aria-live="polite">
        {settledIndex !== null && videos[settledIndex]
          ? `動画 ${settledIndex + 1} / ${videos.length}: ${videos[settledIndex].title}`
          : ''}
      </p>
    </section>
  )
}

export default YouTubeSlider
