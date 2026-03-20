import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, AdaptiveDpr } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Ground } from './Ground'
import { Ocean } from './Ocean'
import { Mountains } from './Mountains'
import { PalmTrees } from './PalmTrees'
import { Player } from './Player'

export function WorldScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 8, 15], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
      shadows
    >
      <AdaptiveDpr pixelated />

      {/* Sky — golden hour sun position */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, -50]}
        inclination={0.52}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={8}
      />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#1a3a4a', 30, 120]} />

      {/* Lighting — warm golden hour */}
      <ambientLight intensity={0.4} color="#ffe4c4" />
      <directionalLight
        position={[100, 40, -50]}
        intensity={1.5}
        color="#ffd89b"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight
        args={['#87ceeb', '#2d6a4f', 0.3]}
      />

      <Suspense>
        <Physics gravity={[0, -9.81, 0]}>
          <Ground />
          <Player />
        </Physics>
      </Suspense>

      {/* Non-physics scenery */}
      <Ocean />
      <Mountains />
      <PalmTrees />
    </Canvas>
  )
}
