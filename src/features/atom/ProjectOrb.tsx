import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import * as THREE from 'three'
import type { Project } from '../../data/projects'

interface ProjectOrbProps {
  project: Project
  orbitRadius: number
  orbitTilt: [number, number, number]
  speed: number
  startAngle: number
  onSelect: (project: Project) => void
}

const ORB_RADIUS = 0.18
const HOVER_SCALE = 1.4
const BASE_SCALE = 1

export function ProjectOrb({
  project,
  orbitRadius,
  orbitTilt,
  speed,
  startAngle,
  onSelect,
}: ProjectOrbProps) {
  const groupRef = useRef<Group>(null)
  const angleRef = useRef(startAngle)
  const [hovered, setHovered] = useState(false)
  const scaleRef = useRef(BASE_SCALE)

  // Restore cursor on unmount if hovered
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Orbit motion
    angleRef.current += speed * delta
    const x = Math.cos(angleRef.current) * orbitRadius
    const z = Math.sin(angleRef.current) * orbitRadius
    groupRef.current.position.set(x, 0, z)

    // Smooth scale on hover
    const target = hovered ? HOVER_SCALE : BASE_SCALE
    scaleRef.current += (target - scaleRef.current) * 0.1
    groupRef.current.scale.setScalar(scaleRef.current)
  })

  // Pick a color based on project index for variety
  const orbColor = project.featured ? '#00f5d4' : '#f9c74f'

  return (
    <group rotation={new THREE.Euler(...orbitTilt)}>
      <group ref={groupRef}>
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            onSelect(project)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <sphereGeometry args={[ORB_RADIUS, 24, 24]} />
          <meshStandardMaterial
            color={orbColor}
            emissive={orbColor}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        {/* Glow ring on hover */}
        {hovered && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[ORB_RADIUS + 0.04, ORB_RADIUS + 0.08, 32]} />
            <meshBasicMaterial
              color={orbColor}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  )
}
