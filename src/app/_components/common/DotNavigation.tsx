interface DotNavigationProps {
  totalItems: number
  currentIndex: number
  onIndexChange: (index: number) => void
  className?: string
  ariaLabel?: string
  getItemAriaLabel?: (index: number) => string
  // Fills the active segment over `duration` ms, then calls onComplete
  autoplay?: {
    duration: number
    paused: boolean
    onComplete: () => void
  }
}

export const DotNavigation: React.FC<DotNavigationProps> = ({
  totalItems,
  currentIndex,
  onIndexChange,
  className = '',
  ariaLabel = '選択',
  getItemAriaLabel,
  autoplay,
}) => {
  const getAriaLabel = (index: number) => {
    if (getItemAriaLabel) {
      return getItemAriaLabel(index)
    }
    return `${index + 1}番目を表示`
  }

  if (totalItems <= 1) {
    return null
  }

  return (
    <nav
      className={`media-progress ${autoplay ? 'is-autoplay' : ''} ${className}`}
      aria-label={ariaLabel}
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onIndexChange(index)}
          className="media-progress-item"
          aria-label={getAriaLabel(index)}
          aria-current={index === currentIndex ? 'true' : undefined}
        >
          {autoplay && index === currentIndex && (
            <span
              // Remount on every slide change to restart the animation
              key={currentIndex}
              className="media-progress-fill"
              style={{
                animationDuration: `${autoplay.duration}ms`,
                animationPlayState: autoplay.paused ? 'paused' : 'running',
              }}
              onAnimationEnd={autoplay.onComplete}
            />
          )}
        </button>
      ))}
    </nav>
  )
}

export default DotNavigation
