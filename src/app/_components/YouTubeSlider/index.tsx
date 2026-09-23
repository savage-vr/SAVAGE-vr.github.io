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

const VideoFrame: React.FC<{ video: YouTubeVideo; isVisible: boolean }> = ({
  video,
  isVisible,
}) => {
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
    <div key={video.id} className="w-full flex-shrink-0">
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
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextVideo = () => {
    setCurrentIndex(prev => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    setCurrentIndex(prev => (prev - 1 + videos.length) % videos.length)
  }

  return (
    <div className="w-full">
      <div className="media-frame">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {videos.map((video, index) => (
            <VideoFrame
              key={video.id}
              video={video}
              isVisible={index === currentIndex}
            />
          ))}
        </div>

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
      </div>

      <DotNavigation
        totalItems={videos.length}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        getItemAriaLabel={index => `動画${index + 1}を表示`}
      />

      {videos[currentIndex] && (
        <p className="media-caption">
          <MediaCounter current={currentIndex} total={videos.length} />
          <span>{videos[currentIndex].title}</span>
        </p>
      )}
    </div>
  )
}

export default YouTubeSlider
