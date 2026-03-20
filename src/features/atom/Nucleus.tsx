import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import type { Mesh, ShaderMaterial } from 'three'
import './NucleusShader'

export function Nucleus() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08

      // Breathe animation — gentle scale pulse
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03
      meshRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <nucleusMaterial ref={materialRef} attach="material" />
      </mesh>
    </Float>
  )
}
