'use client'

import HLS from "hls.js"
import { useEffect, useState, useCallback } from "react"

const src = "/movie/video.m3u8"
const fallback = "/movie/savege_bg_compress.mp4"

export default function Video() {
  const [load, setLoad] = useState(false)
  const [animation, setAnimation] = useState(false)
  const ref = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return
    // The video stays at opacity 0 until it starts playing, on every playback path
    const onPlay = () => setAnimation(true)
    node.addEventListener("play", onPlay)
    let hls: HLS | undefined
    if (HLS.isSupported()) {
      hls = new HLS()
      hls.loadSource(src)
      hls.attachMedia(node)
    } else if (node.canPlayType('application/vnd.apple.mpegurl')) {
      node.src = src
    } else {
      node.src = fallback
    }
    return () => {
      node.removeEventListener("play", onPlay)
      hls?.destroy()
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
