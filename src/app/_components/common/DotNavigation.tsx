interface DotNavigationProps {
  totalItems: number
  currentIndex: number
  onIndexChange: (index: number) => void
  className?: string
  dotClassName?: string
  activeDotClassName?: string
  useDefaultStyle?: boolean
  ariaLabel?: string
  getItemAriaLabel?: (index: number) => string
}

export const DotNavigation: React.FC<DotNavigationProps> = ({
  totalItems,
  currentIndex,
  onIndexChange,
  className = '',
  dotClassName = '',
  ariaLabel = '選択',
  getItemAriaLabel,
}) => {
  const defaultContainerClasses = 'flex justify-center mt-4 gap-4 flex-wrap'
  const defaultDotClasses = 'w-4 h-4 rounded-full transition-colors'
  const defaultActiveDotClasses = 'bg-white'
  const defaultInactiveDotClasses = 'bg-gray-400'

  const containerClasses = `${defaultContainerClasses} ${className}`

  const getDotClasses = (index: number) => {
    const isActive = index === currentIndex
    return `${defaultDotClasses} ${
      isActive ? defaultActiveDotClasses : defaultInactiveDotClasses
    } ${dotClassName}`
  }

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
    <div className={containerClasses} role="tablist" aria-label={ariaLabel}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndexChange(index)}
          className={getDotClasses(index)}
          role="tab"
          aria-label={getAriaLabel(index)}
          aria-selected={index === currentIndex}
        />
      ))}
    </div>
  )
}

export default DotNavigation
