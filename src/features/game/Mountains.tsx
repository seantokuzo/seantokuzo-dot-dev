import { useMemo } from 'react'
import * as THREE from 'three'

function createMountainGeometry(
  peaks: { x: number; height: number; width: number }[]
) {
  const shape = new THREE.Shape()

  // Start at ground level far left
  shape.moveTo(-60, 0)

  // Build jagged mountain silhouette across the ridgeline
  for (let i = 0; i < peaks.length; i++) {
    const peak = peaks[i]
    // Ascend to peak — sharp angle like Ko'olau
    shape.lineTo(peak.x - peak.width / 2, peak.height * 0.15)
    shape.lineTo(peak.x - peak.width / 4, peak.height * 0.7)
    shape.lineTo(peak.x, peak.height)

    // Descend — slightly asymmetric for realism
    shape.lineTo(peak.x + peak.width / 3, peak.height * 0.6)
    shape.lineTo(peak.x + peak.width / 2, peak.height * 0.1)
  }

  // Return to ground at far right
  shape.lineTo(60, 0)
  shape.lineTo(-60, 0)

  // Extrude into 3D with some depth
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 8,
    bevelEnabled: false,
  }

  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

export function Mountains() {
  const geometry = useMemo(() => {
    // Ko'olau-inspired peaks — sharp, dramatic, varying heights
    const peaks = [
      { x: -45, height: 22, width: 12 },
      { x: -32, height: 28, width: 10 },
      { x: -20, height: 35, width: 14 },
      { x: -8, height: 30, width: 11 },
      { x: 5, height: 38, width: 13 },
      { x: 18, height: 32, width: 12 },
      { x: 30, height: 26, width: 10 },
      { x: 42, height: 20, width: 11 },
    ]
    return createMountainGeometry(peaks)
  }, [])

  return (
    <group position={[0, 0, -45]} rotation={[0, 0, 0]}>
      {/* Main mountain body — lush green with volcanic undertones */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#1a4d2e"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Darker back face for depth */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#0f3320"
          roughness={0.9}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
