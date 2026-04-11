import { useMemo } from 'react';
import * as THREE from 'three';

// Canvas-baked gold roughness map
function makeGoldRoughnessMap() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  // Horizontal streaks (brushed metal look)
  for (let y = 0; y < 64; y++) {
    const v = 30 + Math.random() * 25;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, 64, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function RingsOnly({ ringYPositions, spineX }) {
  return (
    <group>
      {ringYPositions.map((y, i) => (
        <GoldRingMesh
          key={i}
          position={[spineX - 0.03, y, 0]}
          ringRadius={0.092}
          tubeRadius={0.012}
        />
      ))}
    </group>
  );
}

// Keep the internal tori logic
function GoldRingMesh({ position, ringRadius, tubeRadius }) {
  const roughTex = useMemo(() => makeGoldRoughnessMap(), []);

  return (
    // Slight Z push ensures the ring always renders in front of the stitch thread border
    <mesh position={[position[0], position[1], position[2] + 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <torusGeometry args={[ringRadius, tubeRadius, 24, 64]} />
      <meshStandardMaterial
        color="#D4AF37"
        roughness={0.18}
        metalness={0.95}
        roughnessMap={roughTex}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

// Exported standalone holes logic to wrap around cover groups 
export function RingHoles({ ringYPositions, spineX, zOffset }) {
  const ringRadius = 0.092;
  const tubeRadius = 0.012;
  // X projection to center the hole relative to ring radius
  // Torus is centered at x=spineX-0.03. Current cover left edge = spineX.
  const ringCenterX = spineX - 0.03;
  // If zOffset is effectively COVER_D/2, distance is intersection.
  // We can just rely on the radius. Actually, placing it directly at the spine hinge:
  // Math: intersection X relative to ring center where Z = zOffset
  const localX = Math.sqrt(Math.max(0, ringRadius * ringRadius - zOffset * zOffset));
  const absoluteX = ringCenterX + localX;
  
  return (
    <group>
      {ringYPositions.map((y, i) => (
        <mesh key={i} position={[absoluteX, y, zOffset + 0.001]} rotation={[0, 0, 0]}>
          <circleGeometry args={[tubeRadius * 1.6, 16]} />
          <meshBasicMaterial color="#0a0806" />
        </mesh>
      ))}
    </group>
  );
}
