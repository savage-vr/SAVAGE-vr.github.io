const pad = (n: number) => String(n).padStart(2, '0')

export const MediaCounter: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => {
  return (
    <span className="media-counter" aria-hidden="true">
      <span className="media-counter-current">{pad(current + 1)}</span>
      <span> / {pad(total)}</span>
    </span>
  )
}

export default MediaCounter
