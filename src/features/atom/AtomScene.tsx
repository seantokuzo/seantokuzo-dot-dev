import { Canvas } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr } from '@react-three/drei'
import { Nucleus } from './Nucleus'
import { ElectronOrbit } from './ElectronOrbit'
import { ProjectOrb } from './ProjectOrb'
import { projects, type Project } from '../../data/projects'

// Distribute projects across 3 orbital shells
const ORBITS: {
  radius: number
  tilt: [number, number, number]
  speed: number
  color: string
}[] = [
  { radius: 2.4, tilt: [0.3, 0, 0.2], speed: 0.4, color: '#00b4d8' },
  { radius: 3.2, tilt: [-0.5, 0.4, -0.1], speed: -0.3, color: '#00f5d4' },
  { radius: 4.0, tilt: [0.1, -0.3, 0.6], speed: 0.2, color: '#f9c74f' },
]

// Pre-compute orbit assignments — no work per frame
const ORBIT_PROJECTS = ORBITS.map((_, idx) =>
  projects.filter((_, i) => i % ORBITS.length === idx)
)

interface AtomSceneProps {
  onSelectProject: (project: Project) => void
  onClearSelection: () => void
  orbitPaused?: boolean
}

export function AtomScene({ onSelectProject, onClearSelection, orbitPaused = false }: AtomSceneProps) {
  return (
    <Canvas
      shadows
      // Lower DPR cap than app default [1,2] — shadow-heavy scene with animated meshes
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      onPointerMissed={onClearSelection}
    >
      <AdaptiveDpr pixelated />

      {/* Lighting — directional casts shadows for nucleus + ground */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <pointLight position={[-6, -3, -8]} intensity={0.4} color="#00f5d4" />

      {/* Nucleus */}
      <Nucleus />

      {/* Shadow-catching ground plane — invisible, same depth as scene floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      {/* Orbits + Project Orbs */}
      {ORBITS.map((orbit, orbitIdx) => (
        <group key={orbitIdx}>
          <ElectronOrbit
            radius={orbit.radius}
            tilt={orbit.tilt}
            color={orbit.color}
          />
          {ORBIT_PROJECTS[orbitIdx].map((project, projIdx) => {
            const angleSpread =
              (Math.PI * 2) / Math.max(ORBIT_PROJECTS[orbitIdx].length, 1)
            return (
              <ProjectOrb
                key={project.id}
                project={project}
                orbitRadius={orbit.radius}
                orbitTilt={orbit.tilt}
                speed={orbit.speed}
                startAngle={projIdx * angleSpread}
                onSelect={onSelectProject}
              />
            )
          })}
        </group>
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={14}
        autoRotate={!orbitPaused}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
