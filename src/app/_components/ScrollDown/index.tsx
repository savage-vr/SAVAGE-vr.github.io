'use client'

import './index.components.css'

export const ScrollDown = () => {
  const handleScrollDown = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className="scroll-down text-xl font-[family-name:var(--font-ibm-plex-serif)] bg-transparent border-none cursor-pointer"
      aria-label="下にスクロールしてメインコンテンツを表示"
      onClick={handleScrollDown}
    >
      Scroll Down
    </div>
  )
}
