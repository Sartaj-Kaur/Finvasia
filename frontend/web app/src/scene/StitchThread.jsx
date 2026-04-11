import { useMemo } from 'react';
import * as THREE from 'three';

// Build an ordered list of 3D points tracing a rounded rectangle perimeter
function roundedRectPoints(w, h, r, steps = 200) {
  const hw = w / 2, hh = h / 2;
  const pts = [];

  // Helper: arc segment
  const arc = (cx, cy, startAngle, endAngle, count) => {
    for (let i = 0; i <= count; i++) {
      const a = startAngle + (endAngle - startAngle) * (i / count);
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0));
    }
  };

  const cornerSteps = Math.max(4, Math.round(steps * (Math.PI * r / 2) / (2 * (w + h))));
  const hSteps = Math.max(4, Math.round(steps * (w - 2 * r) / (2 * (w + h))));
  const vSteps = Math.max(4, Math.round(steps * (h - 2 * r) / (2 * (w + h))));

  // Start: bottom-left → going right
  for (let i = 0; i <= hSteps; i++) pts.push(new THREE.Vector3(-hw + r + (w - 2 * r) * i / hSteps, -hh, 0));
  // Bottom-right corner
  arc(hw - r, -hh + r, -Math.PI / 2, 0, cornerSteps);
  // Right side going up
  for (let i = 1; i <= vSteps; i++) pts.push(new THREE.Vector3(hw, -hh + r + (h - 2 * r) * i / vSteps, 0));
  // Top-right corner
  arc(hw - r, hh - r, 0, Math.PI / 2, cornerSteps);
  // Top going left
  for (let i = 1; i <= hSteps; i++) pts.push(new THREE.Vector3(hw - r - (w - 2 * r) * i / hSteps, hh, 0));
  // Top-left corner
  arc(-hw + r, hh - r, Math.PI / 2, Math.PI, cornerSteps);
  // Left side going down
  for (let i = 1; i <= vSteps; i++) pts.push(new THREE.Vector3(-hw, hh - r - (h - 2 * r) * i / vSteps, 0));
  // Bottom-left corner
  arc(-hw + r, -hh + r, Math.PI, 3 * Math.PI / 2, cornerSteps);

  return pts;
}

// Canvas texture for thread cross-section (warm linen gradient)
function makeThreadTexture() {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 32, 0);
  g.addColorStop(0, '#c48857ff');
  g.addColorStop(0.15, '#9e6b3a');
  g.addColorStop(0.4, '#c9964e');
  g.addColorStop(0.5, '#ddb06a');
  g.addColorStop(0.6, '#c9964e');
  g.addColorStop(0.85, '#9e6b3a');
  g.addColorStop(1, '#eaaf7eff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 256);
  // Fine fiber strands
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 32;
    ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? '160,95,40' : '80,45,15'},0.35)`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, 256);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function StitchThread({ coverW, coverH, inset = 0.05, z = 0.02 }) {
  const STITCH = 0.028;   // length of each stitch dash
  const GAP = 0.020;   // gap between stitches
  const UNIT = STITCH + GAP;
  const RADIUS = 0.028;   // corner radius of stitch path
  const TUBE_R = 0.0048;  // tube cross-section radius

  const threadTex = useMemo(() => makeThreadTexture(), []);

  const stitchMeshes = useMemo(() => {
    const allPts = roundedRectPoints(coverW - inset * 2, coverH - inset * 2, RADIUS, 360);
    if (allPts.length < 2) return [];

    // Compute cumulative distances 
    const cumDist = [0];
    for (let i = 1; i < allPts.length; i++) {
      cumDist.push(cumDist[i - 1] + allPts[i].distanceTo(allPts[i - 1]));
    }
    const total = cumDist[cumDist.length - 1];

    // Sample point at exact arc-length t
    function sampleAt(d) {
      for (let i = 1; i < cumDist.length; i++) {
        if (cumDist[i] >= d) {
          const seg = cumDist[i] - cumDist[i - 1];
          const frac = seg > 0 ? (d - cumDist[i - 1]) / seg : 0;
          return allPts[i - 1].clone().lerp(allPts[i], frac);
        }
      }
      return allPts[allPts.length - 1].clone();
    }

    const geometries = [];
    let d = GAP / 2;  // start offset so first stitch is centred nicely

    while (d < total) {
      const dEnd = Math.min(d + STITCH, total);
      // Sample ~6 points per stitch
      const segPts = [];
      const steps = 6;
      for (let s = 0; s <= steps; s++) {
        const interp = d + (dEnd - d) * s / steps;
        const p = sampleAt(interp);
        segPts.push(new THREE.Vector3(p.x, p.y, 0));
      }
      if (segPts.length >= 2) {
        geometries.push(segPts);
      }
      d += UNIT;
    }

    return geometries;
  }, [coverW, coverH, inset]);

  return (
    <group position={[0, 0, z]}>
      {stitchMeshes.map((segPts, si) => {
        const curve = new THREE.CatmullRomCurve3(segPts, false, 'centripetal', 0.5);
        const geo = new THREE.TubeGeometry(curve, segPts.length * 2, TUBE_R, 8, false);
        return (
          <mesh key={si} geometry={geo} castShadow>
            <meshStandardMaterial
              map={threadTex}
              roughness={0.91}
              metalness={0.0}
              envMapIntensity={0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}
