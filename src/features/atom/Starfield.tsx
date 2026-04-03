import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

const STAR_COUNT = 400
const STAR_SPHERE_RADIUS = 40

const STAR_COLORS = [
  new THREE.Color('#ffffff'),
  new THREE.Color('#d8d4ff'), // pale lavender
  new THREE.Color('#c4d4ff'), // pale blue
  new THREE.Color('#e8d4ff'), // pale violet
  new THREE.Color('#ffd4e8'), // pale rose (sunset hint)
  new THREE.Color('#d4e8ff'), // pale sky blue
]

export function Starfield() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(STAR_COUNT * 3)
    const colors = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = STAR_SPHERE_RADIUS + Math.random() * 15

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = 0.08 + Math.random() * 0.12
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  )
}
