'use client'

import { useEffect, useRef, useState } from "react"

import type HLS from "hls.js"

const src = "/movie/video.m3u8"
const fallback = "/movie/savege_bg_compress.mp4"
const poster = "/movie/poster.webp"

export default function Video() {
  const ref = useRef<HTMLVideoElement>(null)
  const [animation, setAnimation] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    // The video stays at opacity 0 until it starts playing, on every playback path
    const onPlay = () => setAnimation(true)
    node.addEventListener("play", onPlay)
    let hls: HLS | undefined
    let cancelled = false
    const playNative = () => {
      node.src = node.canPlayType("application/vnd.apple.mpegurl") ? src : fallback
    }
    // hls.js is loaded lazily so it stays out of the initial bundle
    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled) return
        if (Hls.isSupported()) {
          hls = new Hls()
          hls.loadSource(src)
          hls.attachMedia(node)
        } else {
          playNative()
        }
      })
      .catch(() => {
        if (!cancelled) playNative()
      })
    return () => {
      cancelled = true
      node.removeEventListener("play", onPlay)
      hls?.destroy()
    }
  }, [])

  const anim = animation ? "animation" : ""
  return (
    <video
      ref={ref}
      className={`video z-10 fixed w-full h-dvh items-center justify-center ${anim}`}
      poster={poster}
      preload="metadata"
      width={1280}
      height={720}
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
