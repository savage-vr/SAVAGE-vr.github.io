'use client'

import { useEffect, useState, useCallback } from "react"

export default function Video() {
  const [load, setLoad] = useState(false)
  const [animation, setAnimation] = useState(false)
  const callback = useCallback(() => {
    setAnimation(true)
  }, [])
  const ref = useCallback((node: HTMLVideoElement) => {
    node?.addEventListener("loadstart", callback)
  }, [])
  useEffect(() => {
    window.requestAnimationFrame(() => {
      setLoad(true)
    })
  }, [])
  if (!load) return null;
  const anim = animation ? "animation" : ""
  return (
    <video ref={ref} className={`video fixed w-full h-screen items-center justify-center ${anim}`} autoPlay muted loop>
      <source src="/movie/video.m3u8" />
    </video>
  )
}