'use client'

import { useEffect } from 'react'

// Sections above (e.g. the Next Event card) change height after hydration,
// which leaves client-side `/#section` navigations short of their target.
// Scroll to the hash again once the page has settled.
export const HashScroll = () => {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView()
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  return null
}

export default HashScroll
