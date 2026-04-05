import { useRef, useEffect } from 'react'
import { projects } from '../../data/projects'
import { LockIcon } from '../../components/ui/LockIcon'
import { StatusBadge } from '../../components/ui/StatusBadge'
import styles from './ProjectList.module.css'

/* ------------------------------------------------------------------ */
/*  3D Simplex Noise (ported from Nucleus GLSL)                        */
/* ------------------------------------------------------------------ */

const perm = new Uint8Array(512)
const grad3: [number, number, number][] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
]

// Initialize permutation table
{
  const p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
  ]
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
}

function dot3(g: [number, number, number], x: number, y: number, z: number) {
  return g[0] * x + g[1] * y + g[2] * z
}

function simplex3(xin: number, yin: number, zin: number): number {
  const F3 = 1 / 3
  const G3 = 1 / 6
  const s = (xin + yin + zin) * F3
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const k = Math.floor(zin + s)
  const t = (i + j + k) * G3
  const x0 = xin - (i - t)
  const y0 = yin - (j - t)
  const z0 = zin - (k - t)

  let i1: number, j1: number, k1: number
  let i2: number, j2: number, k2: number
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1 }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1 }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1 }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1 }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
  }

  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3
  const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3
  const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3

  const ii = i & 255, jj = j & 255, kk = k & 255
  const gi0 = perm[ii + perm[jj + perm[kk]]] % 12
  const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12
  const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12
  const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12

  let n0 = 0, n1 = 0, n2 = 0, n3 = 0
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
  if (t0 > 0) { t0 *= t0; n0 = t0 * t0 * dot3(grad3[gi0], x0, y0, z0) }
  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
  if (t1 > 0) { t1 *= t1; n1 = t1 * t1 * dot3(grad3[gi1], x1, y1, z1) }
  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
  if (t2 > 0) { t2 *= t2; n2 = t2 * t2 * dot3(grad3[gi2], x2, y2, z2) }
  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
  if (t3 > 0) { t3 *= t3; n3 = t3 * t3 * dot3(grad3[gi3], x3, y3, z3) }

  return 32 * (n0 + n1 + n2 + n3) // -1 to 1
}

/* ------------------------------------------------------------------ */
/*  FBM — multi-octave noise (matches Nucleus shader pattern)          */
/* ------------------------------------------------------------------ */

function fbm(x: number, y: number, z: number): number {
  const n1 = simplex3(x, y, z)
  const n2 = simplex3(x * 2.2, y * 2.2, z * 1.4) * 0.35
  return n1 + n2
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GLOW_PAD = 28
const NUM_POINTS = 80
const BORDER_RADIUS = 16
const FRAME_INTERVAL = 1000 / 30 // Target 30fps

const PLASMA_COLORS: [number, number, number][] = [
  [185, 103, 255], // purple
  [0, 245, 212],   // turquoise
  [129, 140, 248], // indigo
  [255, 113, 206], // pink
]

/* ------------------------------------------------------------------ */
/*  Rounded rect perimeter sampling                                    */
/* ------------------------------------------------------------------ */

interface PerimeterPoint {
  x: number
  y: number
  nx: number
  ny: number
}

function sampleRoundedRect(
  x: number, y: number, w: number, h: number,
  r: number, numPoints: number
): PerimeterPoint[] {
  const points: PerimeterPoint[] = []
  const straightH = w - 2 * r
  const straightV = h - 2 * r
  const cornerArc = (Math.PI / 2) * r
  const totalPerimeter = 2 * straightH + 2 * straightV + 4 * cornerArc

  for (let i = 0; i < numPoints; i++) {
    let d = (i / numPoints) * totalPerimeter

    // Top edge
    if (d < straightH) {
      points.push({ x: x + r + d, y, nx: 0, ny: -1 })
      continue
    }
    d -= straightH

    // Top-right corner
    if (d < cornerArc) {
      const a = -Math.PI / 2 + (d / cornerArc) * (Math.PI / 2)
      points.push({
        x: x + w - r + Math.cos(a) * r,
        y: y + r + Math.sin(a) * r,
        nx: Math.cos(a), ny: Math.sin(a),
      })
      continue
    }
    d -= cornerArc

    // Right edge
    if (d < straightV) {
      points.push({ x: x + w, y: y + r + d, nx: 1, ny: 0 })
      continue
    }
    d -= straightV

    // Bottom-right corner
    if (d < cornerArc) {
      const a = (d / cornerArc) * (Math.PI / 2)
      points.push({
        x: x + w - r + Math.cos(a) * r,
        y: y + h - r + Math.sin(a) * r,
        nx: Math.cos(a), ny: Math.sin(a),
      })
      continue
    }
    d -= cornerArc

    // Bottom edge
    if (d < straightH) {
      points.push({ x: x + w - r - d, y: y + h, nx: 0, ny: 1 })
      continue
    }
    d -= straightH

    // Bottom-left corner
    if (d < cornerArc) {
      const a = Math.PI / 2 + (d / cornerArc) * (Math.PI / 2)
      points.push({
        x: x + r + Math.cos(a) * r,
        y: y + h - r + Math.sin(a) * r,
        nx: Math.cos(a), ny: Math.sin(a),
      })
      continue
    }
    d -= cornerArc

    // Left edge
    if (d < straightV) {
      points.push({ x, y: y + h - r - d, nx: -1, ny: 0 })
      continue
    }
    d -= straightV

    // Top-left corner
    const a = Math.PI + (d / cornerArc) * (Math.PI / 2)
    points.push({
      x: x + r + Math.cos(a) * r,
      y: y + r + Math.sin(a) * r,
      nx: Math.cos(a), ny: Math.sin(a),
    })
  }

  return points
}

/* ------------------------------------------------------------------ */
/*  Plasma border renderer                                             */
/* ------------------------------------------------------------------ */

function drawPlasma(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  energy: number, time: number,
  cardIndex: number
) {
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const cardW = w - GLOW_PAD * 2
  const cardH = h - GLOW_PAD * 2

  const points = sampleRoundedRect(
    GLOW_PAD, GLOW_PAD, cardW, cardH, BORDER_RADIUS, NUM_POINTS
  )

  // Noise frequency scale — smaller values = larger, smoother blobs
  const freqScale = 0.012
  // Speed — slow, gentle drift
  const speed = 0.15 + energy * 0.15
  const t = time * speed

  // Subtle displacement — gentle wave, not chaotic
  const baseAmp = 1 + energy * 3

  // Displace each point with multi-octave noise + spatial variation
  const displaced: { x: number; y: number; intensity: number }[] = []

  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const px = p.x * freqScale
    const py = p.y * freqScale

    // Multi-octave noise (same pattern as Nucleus shader)
    const n = fbm(px + t * 0.3, py + t * 0.2, t * 0.15 + cardIndex * 3.7)

    // Spatial variation — slow-moving regions of higher/lower amplitude
    // (ported from Nucleus: snoise(pos * 1.3 + time * 0.2) * 0.5 + 0.5)
    const spatialVar = simplex3(
      px * 0.8 + t * 0.05,
      py * 0.8 - t * 0.03,
      t * 0.08 + cardIndex * 1.3
    ) * 0.5 + 0.5
    const localAmp = baseAmp * (0.3 + spatialVar * 0.7)

    const displacement = n * localAmp
    displaced.push({
      x: p.x + p.nx * displacement,
      y: p.y + p.ny * displacement,
      intensity: Math.abs(n), // Store for glow intensity
    })
  }

  // Rotating conic gradient
  const grad = ctx.createConicGradient(time * 0.3, cx, cy)
  grad.addColorStop(0, '#b967ff')
  grad.addColorStop(0.25, '#00f5d4')
  grad.addColorStop(0.5, '#818cf8')
  grad.addColorStop(0.75, '#ff71ce')
  grad.addColorStop(1, '#b967ff')

  // Subtle glow layers — soft presence, not distracting
  const layers = [
    { blur: 20, width: 0.8, alpha: 0.08 },  // faint outer haze
    { blur: 10, width: 1.0, alpha: 0.12 },  // soft mid glow
    { blur: 4,  width: 1.2, alpha: 0.2 },   // inner glow
    { blur: 1,  width: 1.5, alpha: 0.5 },   // thin core
  ]

  for (let li = 0; li < layers.length; li++) {
    const layer = layers[li]
    ctx.save()
    ctx.globalAlpha = layer.alpha * energy
    ctx.beginPath()

    // Smooth closed curve using quadratic bezier through midpoints
    const first = displaced[0]
    const second = displaced[1]
    ctx.moveTo(
      (first.x + second.x) / 2,
      (first.y + second.y) / 2
    )

    for (let i = 1; i <= displaced.length; i++) {
      const curr = displaced[i % displaced.length]
      const next = displaced[(i + 1) % displaced.length]
      ctx.quadraticCurveTo(
        curr.x, curr.y,
        (curr.x + next.x) / 2,
        (curr.y + next.y) / 2
      )
    }

    ctx.closePath()
    ctx.strokeStyle = grad
    ctx.lineWidth = layer.width
    ctx.shadowBlur = layer.blur * energy
    ctx.shadowColor = `rgba(${PLASMA_COLORS[li % 4].join(',')},${energy * 0.7})`
    ctx.stroke()
    ctx.restore()
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProjectList() {
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const sizesRef = useRef<{ w: number; h: number }[]>([])
  const scrollAccum = useRef(0)
  const energyRef = useRef(0)
  const visibleRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2 for perf

    // Cache sizes from card parent — set canvas display + buffer explicitly
    function updateSizes() {
      sizesRef.current = canvasRefs.current.map((canvas) => {
        if (!canvas || !canvas.parentElement) return { w: 0, h: 0 }
        const parentRect = canvas.parentElement.getBoundingClientRect()
        const displayW = parentRect.width + GLOW_PAD * 2
        const displayH = parentRect.height + GLOW_PAD * 2
        return { w: displayW, h: displayH }
      })
      for (let i = 0; i < canvasRefs.current.length; i++) {
        const canvas = canvasRefs.current[i]
        const size = sizesRef.current[i]
        if (!canvas || !size) continue
        // Set CSS display size explicitly (bypasses replaced-element sizing)
        canvas.style.width = `${size.w}px`
        canvas.style.height = `${size.h}px`
        // Set pixel buffer
        const cw = Math.round(size.w * dpr)
        const ch = Math.round(size.h * dpr)
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw
          canvas.height = ch
        }
      }
    }

    updateSizes()
    const resizeObserver = new ResizeObserver(updateSizes)
    resizeObserver.observe(grid)

    // Track which cards are in the viewport — skip offscreen ones
    const cardObservers: IntersectionObserver[] = []
    for (let i = 0; i < canvasRefs.current.length; i++) {
      const card = canvasRefs.current[i]?.parentElement
      if (!card) continue
      const idx = i
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visibleRef.current.add(idx)
          else visibleRef.current.delete(idx)
        },
        { threshold: 0 }
      )
      observer.observe(card)
      cardObservers.push(observer)
    }

    // Gentle scroll reactivity — subtle bump, not dramatic
    const onScroll = () => {
      scrollAccum.current += 4
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Animation loop — throttled to 30fps
    let animId: number
    let lastFrame = 0

    function animate(timestamp: number) {
      // Skip frame if under interval threshold
      if (timestamp - lastFrame < FRAME_INTERVAL) {
        animId = requestAnimationFrame(animate)
        return
      }
      lastFrame = timestamp

      const time = prefersReducedMotion ? 0 : timestamp * 0.001

      // Scroll energy: gentle accumulation, fast decay
      const scrollSpeed = scrollAccum.current
      scrollAccum.current = 0
      energyRef.current = Math.min(energyRef.current + scrollSpeed * 0.002, 0.6)
      energyRef.current *= 0.94

      // Quiet idle presence — visible but unobtrusive
      const idle = 0.22 + Math.sin(time * 0.4) * 0.04
      const globalEnergy = Math.max(energyRef.current, idle)

      for (let i = 0; i < canvasRefs.current.length; i++) {
        if (!visibleRef.current.has(i)) continue // Skip offscreen cards
        const canvas = canvasRefs.current[i]
        const size = sizesRef.current[i]
        if (!canvas || !size || size.w === 0) continue

        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        // Per-card phase offset so they don't breathe in sync
        const cardPhase = i * 0.7
        const cardBreath = Math.sin(time * 0.5 + cardPhase) * 0.03
        const cardEnergy = Math.min(globalEnergy + cardBreath, 1)

        drawPlasma(ctx, size.w, size.h, cardEnergy, time + cardPhase, i)
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      resizeObserver.disconnect()
      cardObservers.forEach((o) => o.disconnect())
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className={styles.list}>
      <h2 className={styles.heading}>Projects</h2>
      <div ref={gridRef} className={styles.grid}>
        {projects.map((project, i) => (
          <div key={project.id} className={styles.card}>
            <canvas
              ref={(el) => {
                canvasRefs.current[i] = el
              }}
              className={styles.borderCanvas}
              aria-hidden="true"
            />
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{project.title}</h3>
              {project.isPrivate && (
                <LockIcon
                  size={13}
                  strokeWidth={2.5}
                  className={styles.lockIcon}
                />
              )}
              <StatusBadge status={project.status} />
            </div>
            <p className={styles.description}>{project.description}</p>
            <div className={styles.tech}>
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
