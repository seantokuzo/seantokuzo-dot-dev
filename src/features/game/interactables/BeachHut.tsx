import { Interactable } from './Interactable'

export function BeachHut() {
  return (
    <Interactable id="beach-hut" position={[0, 0, -6]} sensorSize={[3, 3, 3]}>
      {/* Hut base — stilts + floor */}
      <group>
        {/* Four corner stilts */}
        {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.6, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 1.2, 6]} />
            <meshStandardMaterial color="#8B6914" roughness={0.95} />
          </mesh>
        ))}

        {/* Floor platform */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.08, 2.4]} />
          <meshStandardMaterial color="#a0845c" roughness={0.9} />
        </mesh>

        {/* Walls — front open, three closed sides */}
        {/* Back wall */}
        <mesh position={[0, 1.9, -1.15]} castShadow>
          <boxGeometry args={[2.4, 1.4, 0.06]} />
          <meshStandardMaterial color="#d4a574" roughness={0.85} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-1.15, 1.9, 0]} castShadow>
          <boxGeometry args={[0.06, 1.4, 2.3]} />
          <meshStandardMaterial color="#d4a574" roughness={0.85} />
        </mesh>
        {/* Right wall */}
        <mesh position={[1.15, 1.9, 0]} castShadow>
          <boxGeometry args={[0.06, 1.4, 2.3]} />
          <meshStandardMaterial color="#d4a574" roughness={0.85} />
        </mesh>

        {/* Thatched roof — pyramid */}
        <mesh position={[0, 3, 0]} castShadow>
          <coneGeometry args={[2, 1.2, 4]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.95} />
        </mesh>
      </group>

      {/* Mailbox — in front of the hut */}
      <group position={[1.8, 0, 1.5]}>
        {/* Post */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
          <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
        </mesh>
        {/* Box */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.18]} />
          <meshStandardMaterial color="#e63946" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Flag */}
        <mesh position={[0.18, 0.95, 0]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.02]} />
          <meshStandardMaterial color="#f9c74f" roughness={0.5} />
        </mesh>
      </group>
    </Interactable>
  )
}
