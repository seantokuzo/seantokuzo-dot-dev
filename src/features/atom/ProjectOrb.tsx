import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import * as THREE from 'three'
import type { Project } from '../../data/projects'
import { SIMPLEX_NOISE_3D } from './noiseGlsl'
import styles from './ProjectOrb.module.css'

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
const TRAIL_LENGTH = 6
const RING_ROTATION = new THREE.Euler(Math.PI / 2, 0, 0)
const HOVER_DISPLACE_AMP = 0.03

function createOrbMaterial(
  color: string,
  shaderRef: React.MutableRefObject<{ uniforms: Record<string, { value: number }> } | null>
) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.6,
  })

  const id = THREE.MathUtils.generateUUID()
  mat.customProgramCacheKey = () => id

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDisplaceAmp = { value: 0 }
    shader.uniforms.uTime = { value: 0 }

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
      uniform float uDisplaceAmp;
      uniform float uTime;
      ${SIMPLEX_NOISE_3D}
      void main() {
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      /* glsl */ `
      #include <begin_vertex>
      float dn = snoise(transformed * 8.0 + uTime * 2.5);
      transformed += normal * dn * uDisplaceAmp;
      `
    )

    shaderRef.current = shader
  }

  return mat
}

export function ProjectOrb({
  project,
  orbitRadius,
  orbitTilt,
  speed,
  startAngle,
  onSelect,
}: ProjectOrbProps) {
  const groupRef = useRef<Group>(null)
  const trailRef = useRef<THREE.InstancedMesh>(null)
  const angleRef = useRef(startAngle)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const scaleRef = useRef(BASE_SCALE)
  const displaceRef = useRef(0)
  const orbShaderRef = useRef<{ uniforms: Record<string, { value: number }> } | null>(null)

  const isHighlighted = hovered || focused

  const tiltEuler = useMemo(() => new THREE.Euler(...orbitTilt), [orbitTilt])

  const trailPositions = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3())
  )
  const trailIndex = useRef(0)
  const trailFilled = useRef(0)
  const trailDummy = useMemo(() => new THREE.Object3D(), [])

  const orbColor = project.featured ? '#00f5d4' : '#f9c74f'

  // Create material imperatively with onBeforeCompile pre-wired
  const orbMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  if (!orbMatRef.current) {
    orbMatRef.current = createOrbMaterial(orbColor, orbShaderRef)
  }

  useEffect(() => {
    const mat = orbMatRef.current
    return () => {
      mat?.dispose()
      document.body.style.cursor = 'auto'
    }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    angleRef.current += speed * delta
    const x = Math.cos(angleRef.current) * orbitRadius
    const z = Math.sin(angleRef.current) * orbitRadius
    groupRef.current.position.set(x, 0, z)

    const target = isHighlighted ? HOVER_SCALE : BASE_SCALE
    scaleRef.current += (target - scaleRef.current) * 0.1
    groupRef.current.scale.setScalar(scaleRef.current)

    // Smooth displacement on hover/focus
    const targetDisp = isHighlighted ? HOVER_DISPLACE_AMP : 0
    displaceRef.current += (targetDisp - displaceRef.current) * 6 * Math.min(delta, 0.05)

    if (orbShaderRef.current) {
      orbShaderRef.current.uniforms.uDisplaceAmp.value = displaceRef.current
      orbShaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }

    // Update emissive intensity (was a JSX prop, now imperative)
    if (orbMatRef.current) {
      orbMatRef.current.emissiveIntensity = isHighlighted ? 0.8 : 0.3
    }

    // Trail ring buffer
    if (trailRef.current) {
      trailPositions.current[trailIndex.current].set(x, 0, z)
      trailIndex.current = (trailIndex.current + 1) % TRAIL_LENGTH
      if (trailFilled.current < TRAIL_LENGTH) trailFilled.current++

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        if (i >= trailFilled.current) {
          trailDummy.position.set(0, -999, 0)
          trailDummy.scale.setScalar(0)
        } else {
          const bufIdx = (trailIndex.current - 1 - i + TRAIL_LENGTH) % TRAIL_LENGTH
          const opacity = 1 - i / TRAIL_LENGTH
          trailDummy.position.copy(trailPositions.current[bufIdx])
          trailDummy.scale.setScalar(opacity * 0.6)
        }
        trailDummy.updateMatrix()
        trailRef.current.setMatrixAt(i, trailDummy.matrix)
      }
      trailRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group rotation={tiltEuler}>
      <instancedMesh ref={trailRef} args={[undefined, undefined, TRAIL_LENGTH]}>
        <sphereGeometry args={[0.04, 3, 3]} />
        <meshBasicMaterial color={orbColor} transparent opacity={0.35} />
      </instancedMesh>

      <group ref={groupRef}>
        <mesh
          castShadow
          material={orbMatRef.current!}
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
          <sphereGeometry args={[ORB_RADIUS, 20, 20]} />
        </mesh>
        <mesh visible={isHighlighted} rotation={RING_ROTATION}>
          <ringGeometry args={[ORB_RADIUS + 0.04, ORB_RADIUS + 0.08, 32]} />
          <meshBasicMaterial
            color={orbColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html position={[0.35, 0.15, 0]} center={false}>
          <button
            className={`${styles.telemetryLabel} ${isHighlighted ? styles.hovered : ''}`}
            onClick={() => onSelect(project)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label={`View ${project.title}${project.featured ? ' (featured project)' : ''}`}
          >
            <span className={styles.labelLine} style={{ borderColor: orbColor }} />
            <span className={styles.labelText} style={{ color: orbColor }}>
              {project.title}
            </span>
            {project.featured && (
              <span className={styles.featuredTag} style={{ color: orbColor }}>
                FT
              </span>
            )}
          </button>
        </Html>
      </group>
    </group>
  )
}
