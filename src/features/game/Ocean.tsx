import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Layered wave displacement
    float wave1 = sin(pos.x * 0.3 + uTime * 0.8) * 0.4;
    float wave2 = sin(pos.y * 0.5 + uTime * 0.6) * 0.25;
    float wave3 = sin((pos.x + pos.y) * 0.2 + uTime * 1.2) * 0.15;

    pos.z = wave1 + wave2 + wave3;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Deep ocean to shallow water gradient
    vec3 deepColor = vec3(0.02, 0.15, 0.3);
    vec3 shallowColor = vec3(0.0, 0.7, 0.85);
    vec3 foamColor = vec3(0.9, 0.95, 1.0);

    float depthFactor = smoothstep(-0.3, 0.5, vElevation);
    vec3 color = mix(deepColor, shallowColor, depthFactor);

    // Foam on wave peaks
    float foam = smoothstep(0.35, 0.5, vElevation);
    color = mix(color, foamColor, foam * 0.4);

    // Subtle shimmer
    float shimmer = sin(vUv.x * 40.0 + uTime * 2.0) * sin(vUv.y * 40.0 + uTime * 1.5);
    color += shimmer * 0.02;

    gl_FragColor = vec4(color, 0.85);
  }
`

export function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
  })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.3, -30]}
    >
      <planeGeometry args={[200, 100, 128, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
