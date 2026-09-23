import { NavigationIcon } from './NavigationIcon'

interface NavigationButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  ariaLabel: string
  className?: string
  iconClassName?: string
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  ariaLabel,
  className = '',
  iconClassName = 'w-5 h-5',
}) => {
  return (
    <button
      onClick={onClick}
      className={`media-nav ${direction} ${className}`}
      aria-label={ariaLabel}
    >
      <NavigationIcon direction={direction} className={iconClassName} />
    </button>
  )
}

export default NavigationButton
