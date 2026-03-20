import { Html } from '@react-three/drei'
import { Interactable } from './Interactable'

export function TikiSign() {
  return (
    <Interactable id="tiki-sign" position={[-8, 0, 4]} sensorSize={[2, 2, 2]}>
      {/* Main post */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 2, 8]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.95} />
      </mesh>

      {/* Sign board */}
      <group position={[0, 1.8, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.5, 0.06]} />
          <meshStandardMaterial color="#a0845c" roughness={0.85} />
        </mesh>
        {/* Text on sign */}
        <Html
          position={[0, 0, 0.04]}
          center
          distanceFactor={6}
          style={{
            color: '#1a1a2e',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          ABOUT ME →
        </Html>
      </group>

      {/* Tiki decorations — carved notches */}
      <mesh position={[0, 0.5, 0.1]}>
        <boxGeometry args={[0.15, 0.08, 0.05]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0.1]}>
        <boxGeometry args={[0.12, 0.06, 0.05]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>

      {/* Flower garland */}
      <mesh position={[0, 1.55, 0.12]}>
        <torusGeometry args={[0.15, 0.03, 6, 12]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={0.2}
          roughness={0.6}
        />
      </mesh>
    </Interactable>
  )
}
