import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import { LeatherCover } from './LeatherCover';
import { StitchThread } from './StitchThread';
import { RingsOnly, RingHoles } from './MetalRings';

// ── Notebook dimensions (Three.js world units)
const FACE_W = 1.05;   // cover width
const NB_H = 1.75;   // cover height  
const COVER_D = 0.045;
const PAPER_D = 0.035;
const SPINE_W = COVER_D * 2 + PAPER_D;

// Z-axis positions
const FRONT_Z = PAPER_D / 2 + COVER_D / 2;
const BACK_Z = -PAPER_D / 2 - COVER_D / 2;

// X-axis left edge (Hinge for the front cover)
const LEFT_X = -FACE_W / 2;
const RING_X = LEFT_X;

// Ring Y positions
const RING_Y = [0.13, 0.207, 0.282, 0.717, 0.793, 0.87].map(n => (n - 0.5) * NB_H);

const TABS = [
  { name: 'MAY', color: '#D4826A' },  // warm coral
  { name: 'JUN', color: '#7DAA8C' },  // sage green
  { name: 'JUL', color: '#C17F8E' },  // dusty rose
  { name: 'AUG', color: '#CCA051' },  // warm amber
  { name: 'SEP', color: '#7B9BB5' },  // clay blue
  { name: 'DEC', color: '#9AAA7A' },  // olive
];

import { useMemo } from 'react';

function MonthTab({ tab, tabX, tabY, tabWidth, isOpen, setIsOpen, setHovered }) {
  // Procedural subtle paper texture (noise) mapped at a tiny scale
  const paperNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(128, 128);
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Extremely subtle, short noise mimicking pressed paper fibers
      const dv = (Math.random() - 0.5) * 15;
      imageData.data[i] = Math.round(128 + dv);
      imageData.data[i + 1] = Math.round(128 + dv);
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, []);

  // Paper depth must realistically be ultra-thin, almost like heavy cardstock rather than a block.
  const PAPER_THICKNESS = 0.003;

  return (
    <group
      position={[tabX, tabY, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
    >
      <RoundedBox
        args={[tabWidth, 0.09, PAPER_THICKNESS]}
        radius={0.004}
        smoothness={2}
        castShadow
      >
        <meshStandardMaterial
          color={tab.color}
          roughness={0.95}
          metalness={0.05}
          normalMap={paperNormalMap}
          normalScale={[0.15, 0.15]}
        />
      </RoundedBox>
    </group>
  );
}

function NotebookGroup({ isOpen, setIsOpen }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  // Clean, flawless hovering logic isolated from rotation parameters handled by spring
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Subtle idle float
    groupRef.current.position.y = Math.sin(t * 0.55) * 0.018;
  });

  // Master Spring handling both global centering translation AND rotation
  // Closed = -1.2 on X, slightly rotated. Open = 0.525 on X (centering the total opened bounds) and front facing.
  const { masterPosX, masterRotY, masterRotX, coverRotY } = useSpring({
    masterPosX: isOpen ? 0.525 : -1.2,
    masterRotY: isOpen ? 0.0 : (hovered ? -0.22 : -0.12),
    masterRotX: isOpen ? 0.05 : (hovered ? 0.09 : 0.05),
    coverRotY: isOpen ? -Math.PI * 0.95 : 0,
    config: { mass: 1, tension: 70, friction: 18 },
  });

  // We reduced paper width to ensure it is completely enveloped by the front cover.
  // P_W = 0.96. Centered at X=0.01. Left edge: -0.47. Right edge: 0.49.
  // Front cover spans [-0.525, 0.525]. So pages sit cleanly within it.
  const P_H = NB_H - 0.06;
  const P_W = FACE_W - 0.09;

  // The back cover must be slightly wider to visually envelop the tabs.
  // Original FACE_W = 1.05. Hinge is at LEFT_X = -0.525.
  // We want the right side to extend past the tabs (tabs center X = 0.545, right edge = ~0.58).
  // Target right edge = 0.60. Total Width = 0.60 - (-0.525) = 1.125.
  const BACK_W = 1.125;
  const BACK_CENTER_X = LEFT_X + (BACK_W / 2); // Center alignment offset for the broader geometry

  return (
    <a.group
      ref={groupRef}
      rotation-x={masterRotX}
      rotation-y={masterRotY}
      rotation-z={0.03}
      position-x={masterPosX}
      position-y={0}
      position-z={0}
    >
      {/* ── FIXED BOTTOM HALF ───────────────────────────── */}
      {/* 1. Back pages (static) */}
      {[0, -1].map((off, i) => (
        <mesh key={i} position={[0.01 + off * 0.005, 0, off * 0.005]} castShadow receiveShadow>
          <boxGeometry args={[P_W, P_H, PAPER_D / 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#f2dfc8' : '#e8d4bb'} roughness={0.97} />
        </mesh>
      ))}

      {/* 2. Back Cover (Wider to reach past the tags) */}
      <LeatherCover
        position={[BACK_CENTER_X, 0, BACK_Z]}
        width={BACK_W}
        height={NB_H}
        depth={COVER_D}
        colorTint="#ffffff"
      />
      <RingHoles ringYPositions={RING_Y} spineX={RING_X} zOffset={BACK_Z + COVER_D / 2} />

      {/* 3. Spine */}
      <LeatherCover
        position={[LEFT_X, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={SPINE_W}
        height={NB_H}
        depth={COVER_D}
        colorTint="#ffffff"
      />

      {/* 4. Month Tabs (Interactive triggers) */}
      {TABS.map((tab, i) => {
        // Spreading the tabs evenly across the entire length of the notebook 
        // by increasing the vertical distance modifier from 0.135 to 0.26
        const tabY = NB_H / 2 - 0.2 - i * 0.26;
        // Total physical stretch of the card. 0.18 units is very deep.
        const tabWidth = 0.18;
        // By centering the anchor at 0.52:
        // The LEFT edge lands at 0.43 (deeply buried within the notebook papers which rest at 0.49).
        // The RIGHT edge lands at 0.61 (protruding successfully past the 0.60 back-cover edge!).
        const tabX = 0.52;
        return (
          <MonthTab
            key={i}
            tab={tab}
            tabX={tabX}
            tabY={tabY}
            tabWidth={tabWidth}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setHovered={setHovered}
          />
        );
      })}

      {/* 5. Static Metal Rings */}
      <RingsOnly ringYPositions={RING_Y} spineX={RING_X} />

      {/* ── ANIMATED TOP HALF (Pivot Hinge at Left Edge) ── */}
      <a.group
        position={[LEFT_X, 0, FRONT_Z]}
        rotation-y={coverRotY}
      >
        <group position={[-LEFT_X, 0, 0]}>

          {/* A. Front Pages (swinging with the cover) */}
          {[2, 1].map((off, i) => (
            <mesh key={`p_f_${i}`} position={[0.01 + off * 0.005, 0, -FRONT_Z + off * 0.005]} castShadow receiveShadow>
              <boxGeometry args={[P_W, P_H, PAPER_D / 4]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#f2dfc8' : '#e8d4bb'} roughness={0.97} />
            </mesh>
          ))}

          {/* B. Front Leather Cover */}
          <LeatherCover
            position={[0, 0, 0]}
            width={FACE_W}
            height={NB_H}
            depth={COVER_D}
            colorTint="#ffffff"
          />

          {/* C. Dark Holes */}
          <RingHoles ringYPositions={RING_Y} spineX={RING_X} zOffset={COVER_D / 2} />

          {/* D. Saddle-stitch thread — restored to original 0.055 inset to maintain full cover border size */}
          <StitchThread
            coverW={FACE_W}
            coverH={NB_H}
            inset={0.055}
            z={COVER_D / 2 + 0.008}
          />

          {/* E. Embossed Title — uses identical PBR metal shader as the gold rings */}
          <Text
            position={[0, 0, COVER_D / 2 + 0.012]}
            fontSize={0.14}
            fontWeight="bold"
            letterSpacing={0.15}
            lineHeight={1.1}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {`BUDGET\nBINDER`}
            {/* Balance: emissive gives base gold visibility, metalness+clearcoat gives metallic shimmer.
                Reduced emissiveIntensity so specular highlights from lights can punch through and shimmer.
                Sharper clearcoatRoughness = crisper, more visible specular hotspots. */}
            <meshPhysicalMaterial
              color="#D4AF37"
              roughness={0.6}
              metalness={0.6}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              envMapIntensity={2.5}
              emissive="#C8960C"
              emissiveIntensity={0.5}
            />
          </Text>

        </group>
      </a.group>
    </a.group>
  );
}

export default function NotebookScene({ isOpen, setIsOpen }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 3.2], fov: 40 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <directionalLight position={[-2.5, 3.5, 2.5]} intensity={4.5} color="#fff3e0" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} />
      <ambientLight intensity={0.8} color="#ffe5b0" />
      <pointLight position={[2, -1.5, -1.5]} intensity={0.8} color="#aac8ff" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#ff9944" />
      <pointLight position={[0.5, 0, 4]} intensity={1.5} color="#fff5e8" />

      {/* Dedicated metallic highlight for the cover text — moved closer, much stronger */}
      <pointLight position={[0.0, 0.2, 2.0]} intensity={14.0} color="#fff3b0" distance={3.0} decay={2} />
      {/* Off-axis light from upper-left to create a visible specular hot-spot angle on the flat text surface */}
      <pointLight position={[-0.8, 1.2, 2.2]} intensity={10.0} color="#ffe0a0" distance={4.0} decay={2} />
      {/* Subtle lower-right fill so the specular sweeps across both lines of text */}
      <pointLight position={[0.8, -0.5, 2.2]} intensity={6.0} color="#ffd580" distance={3.5} decay={2} />

      <Environment preset="studio" environmentIntensity={0.15} />
      <NotebookGroup isOpen={isOpen} setIsOpen={setIsOpen} />

    </Canvas>
  );
}
