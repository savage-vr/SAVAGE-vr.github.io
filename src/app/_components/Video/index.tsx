'use client'

import { useEffect, useState } from "react"

export default function Video() {
  const [load, setLoad] = useState(false)
  useEffect(() => {
    window.requestAnimationFrame(() => {
      setLoad(true)
    })
  }, [])
  if (!load) return null;
  return (
    <video className="video fixed w-full h-screen items-center justify-center" src="/savage_bg.mp4" autoPlay muted loop />
  )
}