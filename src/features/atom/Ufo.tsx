import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface UfoProps {
  onComplete: () => void
  onProgress?: (t: number) => void
}

const FLIGHT_DURATION = 3.2

export function Ufo({ onComplete, onProgress }: UfoProps) {
  const groupRef = useRef<THREE.Group>(null)
  const startTime = useRef(-1)
  const completedRef = useRef(false)
  const lightRef = useRef<THREE.PointLight>(null)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, -1.2, 3.5),
          new THREE.Vector3(1.5, 1, 3),
          new THREE.Vector3(3.2, 3, 0.5),
          new THREE.Vector3(2.2, 3, -2),
          new THREE.Vector3(0, 3, -3),
          new THREE.Vector3(-2.2, 2, -2),
          new THREE.Vector3(-1.5, 1, 0.5),
          new THREE.Vector3(-0.5, 0.3, 0.3),
          new THREE.Vector3(0, 0, 0),
        ],
        false,
        'catmullrom',
        0.5
      ),
    []
  )

  // Saucer body geometry
  const discGeo = useMemo(() => new THREE.CylinderGeometry(0.2, 0.22, 0.05, 24), [])
  const domeGeo = useMemo(
    () => new THREE.SphereGeometry(0.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    []
  )
  const rimGeo = useMemo(
    () => new THREE.TorusGeometry(0.21, 0.012, 8, 24),
    []
  )

  useEffect(() => {
    return () => {
      discGeo.dispose()
      domeGeo.dispose()
      rimGeo.dispose()
    }
  }, [discGeo, domeGeo, rimGeo])

  useFrame((state) => {
    if (!groupRef.current) return

    if (startTime.current < 0) {
      startTime.current = state.clock.elapsedTime
    }

    const elapsed = state.clock.elapsedTime - startTime.current
    const raw = Math.min(elapsed / FLIGHT_DURATION, 1)

    // Ease-in-out (smooth acceleration/deceleration)
    const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2

    // Position along curve
    const pos = curve.getPointAt(t)
    groupRef.current.position.copy(pos)

    // Gentle bob for organic motion
    groupRef.current.position.y += Math.sin(elapsed * 4) * 0.03

    // Face direction of travel (yaw only — keep saucer level)
    const tangent = curve.getTangentAt(Math.min(t + 0.01, 1))
    groupRef.current.rotation.y = Math.atan2(tangent.x, tangent.z)
    // Slight bank into turns
    groupRef.current.rotation.z = -tangent.x * 0.4

    // Scale: quick pop-in, shrink at end
    const scaleIn = Math.min(raw * 4, 1)
    const scaleOut = raw > 0.82 ? 1 - (raw - 0.82) / 0.18 : 1
    groupRef.current.scale.setScalar(scaleIn * scaleOut)

    // Light intensifies as UFO approaches nucleus
    if (lightRef.current) {
      lightRef.current.intensity = 2 + t * 4
    }

    onProgress?.(raw)

    if (raw >= 1 && !completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  })

  return (
    <group ref={groupRef}>
      {/* Saucer disc */}
      <mesh geometry={discGeo}>
        <meshStandardMaterial
          color="#1a2a3a"
          emissive="#00f5d4"
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Rim glow */}
      <mesh geometry={rimGeo} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#00f5d4"
          emissive="#00f5d4"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Dome cockpit */}
      <mesh geometry={domeGeo} position={[0, 0.03, 0]}>
        <meshStandardMaterial
          color="#48cae4"
          emissive="#48cae4"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Beam light underneath */}
      <pointLight
        ref={lightRef}
        color="#00f5d4"
        intensity={2}
        distance={5}
        position={[0, -0.1, 0]}
      />
    </group>
  )
}
