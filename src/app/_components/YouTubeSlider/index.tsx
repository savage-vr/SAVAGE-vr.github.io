'use client'

import { useEffect, useRef, useState } from 'react'

import { DotNavigation } from '../common/DotNavigation'
import { NavigationButton } from '../common/NavigationButton'

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
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white text-sm">動画を読み込み中...</p>
            </div>
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
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
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-thin">
            {videos[currentIndex].title}
          </p>
        </div>
      )}
    </div>
  )
}

export default YouTubeSlider
