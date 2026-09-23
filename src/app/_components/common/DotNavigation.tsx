interface DotNavigationProps {
  totalItems: number
  currentIndex: number
  onIndexChange: (index: number) => void
  className?: string
  ariaLabel?: string
  getItemAriaLabel?: (index: number) => string
}

export const DotNavigation: React.FC<DotNavigationProps> = ({
  totalItems,
  currentIndex,
  onIndexChange,
  className = '',
  ariaLabel = '選択',
  getItemAriaLabel,
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
      className={`media-progress ${className}`}
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
        />
      ))}
    </div>
  )
}

export default DotNavigation
