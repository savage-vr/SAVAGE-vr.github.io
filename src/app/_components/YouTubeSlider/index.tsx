'use client'

import { useEffect, useRef, useState } from 'react'

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
      { threshold: 1.0 }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [shouldLoad])

  // Load when visible in slider
  useEffect(() => {
    if (isVisible && !shouldLoad) {
      setShouldLoad(true)
    }
  }, [isVisible, shouldLoad])

  return (
    <div key={video.id} className="w-full flex-shrink-0">
      <div ref={containerRef} className="aspect-video">
        {shouldLoad ? (
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

  const goToVideo = (index: number) => {
    setCurrentIndex(index)
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
            <button
              onClick={prevVideo}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              aria-label="前の動画"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextVideo}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              aria-label="次の動画"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {videos.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToVideo(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-gray-400'
              }`}
              aria-label={`動画${index + 1}を表示`}
            />
          ))}
        </div>
      )}

      {videos[currentIndex] && (
        <div className="mt-4 text-center font-[family-name:var(--font-geist-sans)]">
          <p className="text-white text-lg font-thin">
            {videos[currentIndex].title}
          </p>
        </div>
      )}
    </div>
  )
}

export default YouTubeSlider
