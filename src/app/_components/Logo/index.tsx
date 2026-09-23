'use client'

import { useEffect, useRef } from 'react'

import { LogoSvg } from './LogoSvg'
import { createLogoRenderer } from './renderer'
import './index.components.css'

export const Logo = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const svg = svgRef.current
    if (!wrapper || !canvas || !svg) return
    // Keep the plain SVG for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let renderer: ReturnType<typeof createLogoRenderer> = null
    try {
      renderer = createLogoRenderer(canvas, svg)
    } catch (error) {
      console.warn('Logo WebGL disabled:', error)
    }
    if (!renderer) return
    const active = renderer
    // Stop the SVG's CSS float so it can be measured; it stays visible until
    // the canvas has drawn its first frame (an undrawn canvas can flash white)
    wrapper.classList.add('is-webgl-init')

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      active.resize(box.width, box.height, svg.getBoundingClientRect(), box)
    }
    // Resizing clears the canvas, so only flag it here and resize right
    // before the next render. The canvas is sized in vw/svh, so watch it too.
    let needsResize = true
    const observer = new ResizeObserver(() => {
      needsResize = true
    })
    observer.observe(canvas)
    observer.observe(wrapper)

    const pointer: [number, number] = [0, 0]
    const target: [number, number] = [0, 0]
    const onPointerMove = (event: PointerEvent) => {
      target[0] = (event.clientX / window.innerWidth) * 2 - 1
      target[1] = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointerMove)

    let frame = 0
    let start = 0
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      // The hero sits behind the page; skip frames once it's covered
      if (document.hidden || window.scrollY > window.innerHeight * 1.5) return
      if (needsResize) {
        needsResize = false
        resize()
      }
      if (!start) start = now
      const time = (now - start) / 1000
      pointer[0] += (target[0] - pointer[0]) * 0.05
      pointer[1] += (target[1] - pointer[1]) * 0.05
      active.render(time, pointer, Math.min(1, time / 0.3))
      wrapper.classList.add('is-webgl')
    }
    frame = requestAnimationFrame(loop)

    const onContextLost = () => {
      cancelAnimationFrame(frame)
      wrapper.classList.remove('is-webgl-init', 'is-webgl')
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      active.dispose()
      wrapper.classList.remove('is-webgl-init', 'is-webgl')
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="logo relative flex items-center justify-center z-10"
    >
      <LogoSvg ref={svgRef} />
      <canvas ref={canvasRef} className="logo-canvas" aria-hidden="true" />
    </div>
  )
}

export default Logo
