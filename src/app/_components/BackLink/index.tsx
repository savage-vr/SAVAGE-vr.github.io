'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const NAVIGATED_KEY = 'savage:navigated'

const readFlag = () => {
  try {
    return sessionStorage.getItem(NAVIGATED_KEY) === '1'
  } catch {
    return false
  }
}

// Client-side navigations don't update document.referrer, so remember that
// this tab has moved between pages of the site. Rendered once in the layout.
export const NavigationTracker = () => {
  const pathname = usePathname()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    try {
      sessionStorage.setItem(NAVIGATED_KEY, '1')
    } catch {}
  }, [pathname])
  return null
}

const cameFromSite = () => {
  if (window.history.length < 2) return false
  if (readFlag()) return true
  try {
    return new URL(document.referrer).origin === window.location.origin
  } catch {
    return false
  }
}

// "← SAVAGE": goes back when the previous page is on this site, otherwise
// links to the top page (also the no-JS / new-tab behaviour)
export const BackLink = () => {
  return (
    <Link
      href="/"
      onClick={event => {
        const plainClick =
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        if (plainClick && cameFromSite()) {
          event.preventDefault()
          window.history.back()
        }
      }}
    >
      ← SAVAGE
    </Link>
  )
}

export default BackLink
