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

interface AtomSceneProps {
  onSelectProject: (project: Project) => void
  onClearSelection: () => void
  orbitPaused?: boolean
}

export function AtomScene({ onSelectProject, onClearSelection, orbitPaused = false }: AtomSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 3, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      onPointerMissed={onClearSelection}
    >
      <AdaptiveDpr pixelated />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#00f5d4" />

      {/* Nucleus */}
      <Nucleus />

      {/* Orbits + Project Orbs */}
      {ORBITS.map((orbit, orbitIdx) => {
        const orbitProjects = projects.filter(
          (_, i) => i % ORBITS.length === orbitIdx
        )
        return (
          <group key={orbitIdx}>
            <ElectronOrbit
              radius={orbit.radius}
              tilt={orbit.tilt}
              color={orbit.color}
            />
            {orbitProjects.map((project, projIdx) => {
              const angleSpread =
                (Math.PI * 2) / Math.max(orbitProjects.length, 1)
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
        )
      })}

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
