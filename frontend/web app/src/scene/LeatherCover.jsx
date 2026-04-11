import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import leatherUrl from '../assets/leather.jpg';

// Procedurally generate a leather normal map
function makeLeatherNormalMap(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const dx = (Math.random() - 0.5) * 30;
    const dy = (Math.random() - 0.5) * 30;
    imageData.data[i]     = Math.round(128 + dx);
    imageData.data[i + 1] = Math.round(128 + dy);
    imageData.data[i + 2] = 255;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  return tex;
}

export function LeatherCover({ position, rotation = [0,0,0], width, height, depth }) {
  const leatherTex = useTexture(leatherUrl);
  
  // By setting exactly 1, 1 scaling inside a MirroredRepeat setup, 
  // the main flat face of the notebook uses exactly ONE un-split, flawlessly framed photograph.
  // The Mirrored borders guarantee that the curved geometric bevels of the RoundedBox soft-wrap the edge pixels seamlessly instead of stretching them into "barcodes" or slicing them abruptly!
  leatherTex.wrapS = THREE.MirroredRepeatWrapping;
  leatherTex.wrapT = THREE.MirroredRepeatWrapping;
  leatherTex.repeat.set(1, 1); 
  leatherTex.offset.set(0, 0);
  leatherTex.needsUpdate = true;

  const normalMap = useMemo(() => makeLeatherNormalMap(256), []);

  return (
    <RoundedBox
      position={position}
      rotation={rotation}
      args={[width, height, depth]}
      radius={0.006}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        map={leatherTex}
        normalMap={normalMap}
        normalScale={[0.35, 0.35]}
        roughness={0.95}
        metalness={0.05}
        envMapIntensity={0.2}
        color="#ffffff" // Clean white so it doesn't darken the image
      />
    </RoundedBox>
  );
}
