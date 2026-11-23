'use client'

import { useEffect, useRef, useState } from 'react'

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

// Exit transitions need both `overlay` and discrete `display` transitions
// (Chromium). Elsewhere, fade out via [data-closing] before calling close().
let supportsDisplayTransition: boolean | undefined
function supportsTopLayerExit() {
  if (supportsDisplayTransition === undefined) {
    supportsDisplayTransition = false
    if (
      CSS.supports('overlay', 'auto') &&
      CSS.supports('transition-behavior', 'allow-discrete')
    ) {
      // Firefox parses allow-discrete without transitioning display, so probe
      const probe = document.createElement('div')
      probe.style.cssText =
        'transition: display 1s allow-discrete !important; display: block;'
      document.body.appendChild(probe)
      void getComputedStyle(probe).display
      probe.style.display = 'none'
      supportsDisplayTransition = getComputedStyle(probe).display === 'block'
      probe.remove()
    }
  }
  return supportsDisplayTransition
}

async function closeWithTransition(dialog: HTMLDialogElement) {
  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '')
    const animations = dialog.getAnimations({ subtree: true })
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map(animation => animation.finished)),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ])
    }
    // Reopened while fading out
    if (!dialog.hasAttribute('data-closing')) return
    dialog.removeAttribute('data-closing')
  }
  dialog.close()
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
  // Content stays mounted after the first open so it can fade out on close,
  // but the full-size image is not requested before the lightbox is used
  const [hasOpened, setHasOpened] = useState(false)
  if (open && !hasOpened) setHasOpened(true)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.removeAttribute('data-closing')
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      void closeWithTransition(dialog)
    }
  }, [open])

  const webp = slide?.alternatives.find(alt => alt.format === 'webp')

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="ギャラリー画像の拡大表示"
      // Light dismiss (Esc + backdrop click); the onClick below is the
      // fallback where closedby is unsupported (Safari)
      {...({ closedby: 'any' } as Record<string, string>)}
      onCancel={event => {
        // Route Esc / light dismiss through the state so the exit fade runs
        event.preventDefault()
        onClose()
      }}
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
      {hasOpened && slide && (
        <>
          {/* First in DOM and [autofocus], so showModal() focuses it. React's
              autoFocus prop only calls focus() on mount and never renders the
              attribute, so set the real attribute for the dialog focusing steps */}
          <button
            ref={element => {
              element?.setAttribute('autofocus', '')
            }}
            type="button"
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
