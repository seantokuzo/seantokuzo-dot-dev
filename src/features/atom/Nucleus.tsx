import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SIMPLEX_NOISE_3D } from './noiseGlsl'

const MAX_AMPLITUDE = 0.08
const MAX_ENERGY = 1.0

export function Nucleus() {
  const meshRef = useRef<THREE.Mesh>(null)
  const shaderRef = useRef<{
    uniforms: Record<string, { value: number }>
  } | null>(null)
  const amplRef = useRef(0)
  const freqRef = useRef(0)
  const energyRef = useRef(0)

  // Accumulate mouse movement between frames via native DOM events
  const moveAccum = useRef(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      moveAccum.current += Math.sqrt(e.movementX ** 2 + e.movementY ** 2)
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Create material with onBeforeCompile pre-wired
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  if (!matRef.current) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a2540'),
      metalness: 0.35,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      emissive: new THREE.Color('#00b4d8'),
      emissiveIntensity: 0.15,
    })

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uDisplaceAmp = { value: 0 }
      shader.uniforms.uFrequency = { value: 0 }
      shader.uniforms.uTime = { value: 0 }

      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `
        uniform float uDisplaceAmp;
        uniform float uFrequency;
        uniform float uTime;
        ${SIMPLEX_NOISE_3D}
        void main() {
        `
      )

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        /* glsl */ `
        #include <begin_vertex>

        // Dynamic frequency: more mouse energy = more waves, faster evolution
        float freq = 2.0 + uFrequency * 10.0;
        float spd = 0.6 + uFrequency * 4.0;

        // Multi-octave noise at dynamic frequency
        float n1 = snoise(transformed * freq + uTime * spd);
        float n2 = snoise(transformed * freq * 2.2 - uTime * spd * 1.4) * 0.35;

        // Non-uniform amplitude: slow-moving spatial variation
        // so some regions react more than others
        float spatialVar = snoise(transformed * 1.3 + uTime * 0.2) * 0.5 + 0.5;
        float localAmp = uDisplaceAmp * (0.3 + spatialVar * 0.7);

        transformed += normal * (n1 + n2) * localAmp;
        `
      )

      shaderRef.current = shader
    }

    matRef.current = mat
  }

  useEffect(() => {
    const mat = matRef.current
    return () => mat?.dispose()
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    meshRef.current.rotation.y += 0.002
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    meshRef.current.scale.setScalar(breathe)

    // Read accumulated mouse movement, then reset
    const mouseSpeed = moveAccum.current
    moveAccum.current = 0

    // Energy: accumulates from mouse input, decays smoothly (0–1 range)
    energyRef.current = Math.min(
      energyRef.current + mouseSpeed * 0.008,
      MAX_ENERGY
    )
    energyRef.current *= 0.97

    // Subtle idle breathing so nucleus always has a hint of life
    const idle = 0.04 + Math.sin(state.clock.elapsedTime * 0.6) * 0.02
    const energy = Math.max(energyRef.current, idle)

    // Amplitude and frequency both derive from energy
    const targetAmpl = energy * MAX_AMPLITUDE
    const targetFreq = energy

    amplRef.current += (targetAmpl - amplRef.current) * 0.15
    freqRef.current += (targetFreq - freqRef.current) * 0.12

    if (shaderRef.current) {
      shaderRef.current.uniforms.uDisplaceAmp.value = amplRef.current
      shaderRef.current.uniforms.uFrequency.value = freqRef.current
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }

    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.15 + amplRef.current * 6
    }
  })

  return (
    <group>
      <mesh ref={meshRef} receiveShadow castShadow material={matRef.current!}>
        <sphereGeometry args={[1.2, 64, 64]} />
      </mesh>
      <pointLight color="#00b4d8" intensity={0.6} distance={4} decay={2} />
    </group>
  )
}
