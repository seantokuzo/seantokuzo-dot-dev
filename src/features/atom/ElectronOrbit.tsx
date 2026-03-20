import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface ElectronOrbitProps {
  radius: number
  tilt: [number, number, number]
  color?: string
  opacity?: number
}

export function ElectronOrbit({
  radius,
  tilt,
  color = '#00b4d8',
  opacity = 0.25,
}: ElectronOrbitProps) {
  const points = useMemo(() => {
    const segments = 128
    const pts: [number, number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }
    return pts
  }, [radius])

  return (
    <group rotation={new THREE.Euler(...tilt)}>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={opacity}
      />
    </group>
  )
}
