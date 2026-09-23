import * as shaders from './shaders'

const VIEWBOX = { width: 595.28, height: 841.89 }
// Texture texels per viewBox unit
const TEXTURE_SCALE = 2
// Reveal times are stored as 0..1 in 8 bit, covering this many seconds
const REVEAL_SCALE = 4
const BLOOM_LEVELS = 6

type Target = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number }

function compile(gl: WebGL2RenderingContext, fragment: string) {
  const program = gl.createProgram()!
  for (const [type, source] of [
    [gl.VERTEX_SHADER, shaders.vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
    }
    gl.attachShader(program, shader)
  }
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
  }
  const uniforms = new Map<string, WebGLUniformLocation | null>()
  return {
    program,
    uniform: (name: string) => {
      if (!uniforms.has(name)) {
        uniforms.set(name, gl.getUniformLocation(program, name))
      }
      return uniforms.get(name)!
    },
  }
}

// Draws the SVG's shapes into two canvases:
// coverage (R lines, G shapes, B dots) and reveal time for each line pixel.
function rasterize(svg: SVGSVGElement) {
  const width = Math.round(VIEWBOX.width * TEXTURE_SCALE)
  const height = Math.round(VIEWBOX.height * TEXTURE_SCALE)
  const make = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.scale(TEXTURE_SCALE, TEXTURE_SCALE)
    return { canvas, ctx }
  }
  const layers = { lines: make(), shapes: make(), dots: make() }
  const reveal = make()

  const lines = [...svg.querySelectorAll('line')]
  const firstHatch = lines.findIndex(line => line.classList.contains('cls-1'))
  lines.forEach((line, index) => {
    const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map(key =>
      Number(line.getAttribute(key))
    )
    // Same order as the old CSS animation: lines one by one, hatch last
    const hatch = line.classList.contains('cls-1')
    const start = hatch ? 3.1 + (index - firstHatch) * 0.03 : 0.4 + index * 0.07
    const duration = hatch ? 0.5 : 1.3

    const { ctx } = layers.lines
    ctx.strokeStyle = `rgba(255,255,255,0.5)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    const gradient = reveal.ctx.createLinearGradient(x1, y1, x2, y2)
    const shade = (seconds: number) => {
      const v = Math.round((seconds / REVEAL_SCALE) * 255)
      return `rgb(${v},${v},${v})`
    }
    gradient.addColorStop(0, shade(start))
    gradient.addColorStop(1, shade(start + duration))
    reveal.ctx.strokeStyle = gradient
    reveal.ctx.lineWidth = 4
    reveal.ctx.beginPath()
    reveal.ctx.moveTo(x1, y1)
    reveal.ctx.lineTo(x2, y2)
    reveal.ctx.stroke()
  })

  const toPath = (element: Element) => {
    if (element instanceof SVGCircleElement) {
      const [cx, cy, r] = ['cx', 'cy', 'r'].map(k =>
        Number(element.getAttribute(k))
      )
      const path = new Path2D()
      path.arc(cx, cy, r, 0, Math.PI * 2)
      return path
    }
    if (element instanceof SVGPolygonElement) {
      return new Path2D(`M${element.getAttribute('points')}Z`)
    }
    return new Path2D(element.getAttribute('d') ?? '')
  }
  svg.querySelectorAll('.cls-6').forEach(element => {
    layers.shapes.ctx.fillStyle = '#fff'
    layers.shapes.ctx.fill(toPath(element), 'nonzero')
  })
  svg.querySelectorAll('.cls-2').forEach(element => {
    layers.dots.ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    layers.dots.ctx.lineWidth = 1.2
    layers.dots.ctx.stroke(toPath(element))
  })
  svg.querySelectorAll('.cls-3').forEach(element => {
    layers.shapes.ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    layers.shapes.ctx.lineWidth = 0.8
    layers.shapes.ctx.stroke(toPath(element))
  })

  // Pack the three layers into RGB
  const packed = make()
  const out = packed.ctx.createImageData(width, height)
  const read = (layer: { ctx: CanvasRenderingContext2D }) =>
    layer.ctx.getImageData(0, 0, width, height).data
  const [l, s, d] = [read(layers.lines), read(layers.shapes), read(layers.dots)]
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = l[i + 3]
    out.data[i + 1] = s[i + 3]
    out.data[i + 2] = d[i + 3]
    out.data[i + 3] = 255
  }
  return { coverage: out, reveal: reveal.ctx.getImageData(0, 0, width, height) }
}

export function createLogoRenderer(
  canvas: HTMLCanvasElement,
  svg: SVGSVGElement
) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
  })
  if (!gl) return null

  const floatTargets = !!gl.getExtension('EXT_color_buffer_float')
  const encode = floatTargets ? 1 : 0.25
  const internalFormat = floatTargets ? gl.RGBA16F : gl.RGBA8
  const type = floatTargets ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE

  const programs = {
    scene: compile(gl, shaders.scene),
    bright: compile(gl, shaders.bright),
    down: compile(gl, shaders.down),
    up: compile(gl, shaders.up),
    composite: compile(gl, shaders.composite),
  }
  gl.bindVertexArray(gl.createVertexArray())

  const upload = (image: ImageData, mipmap: boolean) => {
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      image.width,
      image.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image.data
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      mipmap ? gl.LINEAR : gl.NEAREST
    )
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST
    )
    if (mipmap) gl.generateMipmap(gl.TEXTURE_2D)
    return tex
  }
  const images = rasterize(svg)
  const coverageTex = upload(images.coverage, true)
  const revealTex = upload(images.reveal, false)

  const createTarget = (w: number, h: number): Target => {
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      gl.RGBA,
      type,
      null
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    )
    return { fbo, tex, w, h }
  }
  const deleteTarget = (target: Target) => {
    gl.deleteFramebuffer(target.fbo)
    gl.deleteTexture(target.tex)
  }

  let scene: Target | null = null
  let bloom: Target[] = []
  const logoRect = [0, 0, 0, 0]

  const resize = (
    width: number,
    height: number,
    logo: DOMRect,
    origin: DOMRect
  ) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    // Fit the viewBox into the SVG box the same way preserveAspectRatio does
    const scale = Math.min(
      logo.width / VIEWBOX.width,
      logo.height / VIEWBOX.height
    )
    const w = VIEWBOX.width * scale
    const h = VIEWBOX.height * scale
    logoRect[0] = (logo.left - origin.left + (logo.width - w) / 2) * dpr
    logoRect[1] = (logo.top - origin.top + (logo.height - h) / 2) * dpr
    logoRect[2] = w * dpr
    logoRect[3] = h * dpr

    if (scene) deleteTarget(scene)
    bloom.forEach(deleteTarget)
    scene = createTarget(canvas.width, canvas.height)
    bloom = []
    let w2 = canvas.width
    let h2 = canvas.height
    for (let i = 0; i < BLOOM_LEVELS; i++) {
      w2 = Math.max(1, w2 >> 1)
      h2 = Math.max(1, h2 >> 1)
      bloom.push(createTarget(w2, h2))
    }
  }

  const pass = (
    program: ReturnType<typeof compile>,
    target: Target | null,
    setup: () => void
  ) => {
    gl.useProgram(program.program)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.fbo ?? null)
    gl.viewport(0, 0, target?.w ?? canvas.width, target?.h ?? canvas.height)
    setup()
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  const bindTexture = (
    program: ReturnType<typeof compile>,
    name: string,
    unit: number,
    tex: WebGLTexture
  ) => {
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.uniform1i(program.uniform(name), unit)
  }

  const render = (time: number, pointer: [number, number], fade: number) => {
    if (!scene) return
    const s = scene
    const { scene: sp, bright, down, up, composite } = programs

    pass(sp, s, () => {
      bindTexture(sp, 'uCoverage', 0, coverageTex)
      bindTexture(sp, 'uReveal', 1, revealTex)
      gl.uniform1f(sp.uniform('uRevealScale'), REVEAL_SCALE)
      gl.uniform1f(sp.uniform('uTime'), time)
      gl.uniform2f(sp.uniform('uResolution'), s.w, s.h)
      gl.uniform4f(
        sp.uniform('uLogoRect'),
        logoRect[0],
        logoRect[1],
        logoRect[2],
        logoRect[3]
      )
      gl.uniform2f(sp.uniform('uPointer'), pointer[0], pointer[1])
      gl.uniform1f(sp.uniform('uEncode'), encode)
    })

    pass(bright, bloom[0], () => {
      bindTexture(bright, 'uSource', 0, s.tex)
      gl.uniform2f(bright.uniform('uTexel'), 1 / s.w, 1 / s.h)
      gl.uniform1f(bright.uniform('uThreshold'), 0.75)
      gl.uniform1f(bright.uniform('uDecode'), 1 / encode)
    })
    for (let i = 1; i < bloom.length; i++) {
      const source = bloom[i - 1]
      pass(down, bloom[i], () => {
        bindTexture(down, 'uSource', 0, source.tex)
        gl.uniform2f(down.uniform('uTexel'), 1 / source.w, 1 / source.h)
      })
    }
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    for (let i = bloom.length - 1; i > 0; i--) {
      const source = bloom[i]
      pass(up, bloom[i - 1], () => {
        bindTexture(up, 'uSource', 0, source.tex)
        gl.uniform2f(up.uniform('uTexel'), 0.5 / source.w, 0.5 / source.h)
      })
    }
    gl.disable(gl.BLEND)

    pass(composite, null, () => {
      bindTexture(composite, 'uScene', 0, s.tex)
      bindTexture(composite, 'uBloom', 1, bloom[0].tex)
      gl.uniform1f(composite.uniform('uBloomStrength'), 0.9)
      gl.uniform1f(composite.uniform('uDecode'), 1 / encode)
      gl.uniform1f(composite.uniform('uTime'), time)
      gl.uniform1f(composite.uniform('uFade'), fade)
    })
  }

  const dispose = () => {
    if (scene) deleteTarget(scene)
    bloom.forEach(deleteTarget)
    gl.deleteTexture(coverageTex)
    gl.deleteTexture(revealTex)
    Object.values(programs).forEach(p => gl.deleteProgram(p.program))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  return { resize, render, dispose }
}
