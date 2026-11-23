'use client'

import { useEffect, useRef } from 'react'

import { type SlidesData } from '#/app/_data/slides.schema'

import { MediaCounter } from '../common/MediaCounter'
import { NavigationButton } from '../common/NavigationButton'

type Slide = SlidesData['slides'][number]

interface LightboxProps {
  slides: Slide[]
  index: number
  open: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export function Lightbox({
  slides,
  index,
  open,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const slide = slides[index]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const webp = slide?.alternatives.find(alt => alt.format === 'webp')

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="ギャラリー画像の拡大表示"
      onClose={onClose}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') onPrevious()
        if (event.key === 'ArrowRight') onNext()
      }}
      onClick={event => {
        // Clicking the backdrop (outside the image and controls) closes it
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open && slide && (
        <>
          {/* First focusable element, so showModal() focuses it */}
          <button
            className="lightbox-close"
            onClick={onClose}
            aria-label="拡大表示を閉じる"
          >
            CLOSE
          </button>
          <picture
            className="lightbox-picture"
            onClick={event => {
              if (event.target === event.currentTarget) onClose()
            }}
          >
            {webp && <source srcSet={webp.path} type="image/webp" />}
            <img className="lightbox-image" src={slide.path} alt={slide.alt} />
          </picture>

          <NavigationButton
            direction="prev"
            onClick={onPrevious}
            ariaLabel="前の画像を表示"
          />
          <NavigationButton
            direction="next"
            onClick={onNext}
            ariaLabel="次の画像を表示"
          />
          <MediaCounter current={index} total={slides.length} />
          {slide.credit && (
            <a
              className="media-credit"
              href={slide.credit.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Photo by {slide.credit.author}
            </a>
          )}
        </>
      )}
    </dialog>
  )
}
