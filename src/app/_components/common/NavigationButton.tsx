import { NavigationIcon } from './NavigationIcon'

interface NavigationButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  ariaLabel: string
  className?: string
  iconClassName?: string
  useDefaultStyle?: boolean
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  ariaLabel,
  className = '',
  iconClassName = 'w-6 h-6',
}) => {
  const defaultClasses = `absolute ${
    direction === 'prev' ? 'left-4' : 'right-4'
  } top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity`

  const finalClassName = `${defaultClasses} ${className}`

  return (
    <button onClick={onClick} className={finalClassName} aria-label={ariaLabel}>
      <NavigationIcon direction={direction} className={iconClassName} />
    </button>
  )
}

export default NavigationButton
