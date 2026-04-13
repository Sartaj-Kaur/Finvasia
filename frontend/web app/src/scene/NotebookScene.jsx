import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text, RoundedBox, useTexture, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import { LeatherCover } from './LeatherCover';
import { StitchThread } from './StitchThread';
import { RingsOnly, RingHoles } from './MetalRings';
import fileAvif from '../assets/file.avif';
import LeftPageUI from './LeftPageUI';
import RightPageUI from './RightPageUI';

// ── Base Notebook dimensions (Three.js world units)
const BASE_FACE_W = 1.05;   // cover width
const NB_H = 1.75;   // cover height  
const COVER_D = 0.045;
const PAPER_D = 0.035;
const SPINE_W = COVER_D * 2 + PAPER_D;

// Z-axis positions
const FRONT_Z = PAPER_D / 2 + COVER_D / 2;
const BACK_Z = -PAPER_D / 2 - COVER_D / 2;

// X-axis left edge (Hinge for the front cover)
const LEFT_X = -BASE_FACE_W / 2;
const RING_X = LEFT_X;

// Ring Y positions
const RING_Y = [0.13, 0.207, 0.282, 0.717, 0.793, 0.87].map(n => (n - 0.5) * NB_H);

const TABS = [
  { id: 'BUDGET', name: 'BUDGET', color: '#D4826A' },  // warm coral
  { id: 'GOALS', name: 'GOALS', color: '#7DAA8C' },  // sage green
  { id: 'INVEST', name: 'INVEST', color: '#C17F8E' },  // dusty rose
];



function MonthTab({ tab, tabX, tabY, tabWidth, isActive, onClick, setHovered }) {

  const PAPER_THICKNESS = 0.003;

  return (
    <group
      position={[tabX + (isActive ? 0.08 : 0), tabY, 0.02]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <RoundedBox
        args={[tabWidth, 0.22, PAPER_THICKNESS]}
        radius={0.01}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial
          color={tab.color}
          roughness={0.9}
          metalness={0.0}
        />
      </RoundedBox>
    </group>
  );
}

function NotebookGroup({ isOpen, setIsOpen, month, year }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('BUDGET');
  const paperTex = useTexture(fileAvif);

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
  // Closed = 0.0 on X (centered perfectly). Open = 0.525 on X (centering the total opened bounds) and front facing.
  const { masterPosX, masterRotY, masterRotX, coverRotY } = useSpring({
    masterPosX: isOpen ? 0.525 : 0.0,
    masterRotY: isOpen ? 0.0 : (hovered ? -0.22 : -0.12),
    masterRotX: isOpen ? 0.05 : (hovered ? 0.09 : 0.05),
    coverRotY: isOpen ? -Math.PI * 0.95 : 0,
    config: { mass: 1, tension: 70, friction: 18 },
  });

  // Increase notebook width purely when clicked and opened
  const extraWidth = isOpen ? 0.45 : 0;
  const FACE_W = BASE_FACE_W + extraWidth;
  const BACK_W = 1.125 + extraWidth;
  const P_W = FACE_W - 0.09;

  const P_H = NB_H - 0.06;

  // Center alignments
  const FRONT_CENTER_OFFSET = FACE_W / 2;
  const BACK_CENTER_X = LEFT_X + (BACK_W / 2);
  const P_CENTER_X = LEFT_X + 0.055 + (P_W / 2);

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
        <mesh 
          key={i} 
          position={[P_CENTER_X + off * 0.005, 0, off * 0.005]} 
          castShadow 
          receiveShadow
          onPointerOver={(e) => e.stopPropagation()} 
          onPointerOut={() => {}}
          onPointerMove={(e) => e.stopPropagation()}
        >
          <boxGeometry args={[P_W, P_H, PAPER_D / 4]} />
          <meshStandardMaterial map={paperTex} roughness={0.97} />
          {i === 0 && isOpen && (
            <Html
              transform
              center
              zIndexRange={[100, 0]}
              position={[0, 0, PAPER_D / 8 + 0.006]}
              scale={0.06}
            >
              <div className="w-[800px] h-[1000px] overflow-visible">
                <RightPageUI isOpen={isOpen} activeTab={activeTab} month={month} year={year} />
              </div>
            </Html>
          )}
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
        const tabY = NB_H / 2 - 0.25 - i * 0.28;
        // Total physical stretch of the card. Increased drastically.
        const tabWidth = 0.28;
        // Pushing the X further out so the tab text is highly visible
        const tabX = 0.55 + extraWidth;
        return (
          <MonthTab
            key={i}
            tab={tab}
            tabX={tabX}
            tabY={tabY}
            tabWidth={tabWidth}
            isActive={isOpen && activeTab === tab.id}
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
                setActiveTab(tab.id);
              } else {
                if (activeTab === tab.id) {
                  setIsOpen(false);
                } else {
                  setActiveTab(tab.id);
                }
              }
            }}
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
        <group position={[FRONT_CENTER_OFFSET, 0, 0]}>

          {/* A. Front Pages (swinging with the cover) */}
          {[2, 1].map((off, i) => (
            <mesh key={`p_f_${i}`} position={[0.01 + off * 0.005, 0, -FRONT_Z + off * 0.005]} castShadow receiveShadow>
              <boxGeometry args={[P_W, P_H, PAPER_D / 4]} />
              <meshStandardMaterial map={paperTex} roughness={0.97} />
              {i === 0 && isOpen && (
                <Html
                  transform
                  center
                  zIndexRange={[100, 0]}
                  position={[0, 0, -PAPER_D / 8 - 0.006]}
                  rotation={[0, Math.PI, 0]}
                  scale={0.07}
                >
                  <div className="w-[800px] h-[1000px] overflow-visible">
                <LeftPageUI isOpen={isOpen} month={month} year={year} />
              </div>
                </Html>
              )}
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

          {/* RAYCAST SHIELD: Prevents mouse from piercing the solid cover and hovering visually hidden back tabs */}
          <mesh 
            position={[0, 0, 0]} 
            onPointerOver={(e) => e.stopPropagation()} 
            onPointerOut={() => {}}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <boxGeometry args={[FACE_W, NB_H, COVER_D * 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} color="#ffffff" />
          </mesh>

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

export default function NotebookScene({ isOpen, setIsOpen, month, year }) {
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
      <Suspense fallback={null}>
        <NotebookGroup isOpen={isOpen} setIsOpen={setIsOpen} month={month} year={year} />
      </Suspense>

    </Canvas>
  );
}
