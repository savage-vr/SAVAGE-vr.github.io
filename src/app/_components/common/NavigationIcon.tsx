interface NavigationIconProps {
  direction: 'prev' | 'next'
  className?: string
}

export const NavigationIcon: React.FC<NavigationIconProps> = ({
  direction,
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  )
}

export default NavigationIcon
