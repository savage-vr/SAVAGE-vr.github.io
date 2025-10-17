'use client'

import HLS from "hls.js"
import { useEffect, useState, useCallback } from "react"

const src = "/movie/video.m3u8"
const fallback = "movie/savage_bg.mp4"

export default function Video() {
  const [load, setLoad] = useState(false)
  const [animation, setAnimation] = useState(false)
  const callback = useCallback(() => {
    setAnimation(true)
  }, [])
  const ref = useCallback((node: HTMLVideoElement) => {
    if (node) {
      if (HLS.isSupported()) {
        const hls = new HLS()
        hls.loadSource(src)
        hls.attachMedia(node)
        node.addEventListener("play", callback)
      } else if (node.canPlayType('application/vnd.apple.mpegurl')) {
        node.src = src;
      } else {
        node.src = fallback
      }
    }
  }, [])
  useEffect(() => {
    window.requestAnimationFrame(() => {
      setLoad(true)
    })
  }, [])
  if (!load) return null;
  const anim = animation ? "animation" : ""
  return (
    <video ref={ref} className={`video z-10 fixed w-full h-screen items-center justify-center ${anim}`} autoPlay muted loop playsInline />
  )
}