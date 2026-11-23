'use client'

import './index.components.css'

export const ScrollDown = () => {
  const handleScrollDown = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      mainContent.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }

  return (
    <div
      className="scroll-down text-xl font-[family-name:var(--font-ibm-plex-serif)] bg-transparent border-none cursor-pointer z-10"
      aria-label="下にスクロールしてメインコンテンツを表示"
      onClick={handleScrollDown}
    >
      Scroll Down
    </div>
  )
}
