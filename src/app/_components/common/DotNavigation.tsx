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
    <div
      className={`media-progress ${autoplay ? 'is-autoplay' : ''} ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndexChange(index)}
          className="media-progress-item"
          role="tab"
          aria-label={getAriaLabel(index)}
          aria-selected={index === currentIndex}
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
    </div>
  )
}

export default DotNavigation
