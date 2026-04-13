import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import woodImg from '../assets/clipboard.jpg';

/**
 * ── DESK PENCIL ──
 * A highly detailed skeuomorphic SVG pencil viewed from above.
 * Features a classic yellow body, green/brass ferrule, pink eraser, and sharpened wood/graphite tip.
 */
export function DeskPencil() {
  return (
    <div
      className="relative pointer-events-none drop-shadow-[2px_10px_8px_rgba(0,0,0,0.6)]"
      style={{ width: '220px', height: '20px', transform: 'rotate(230deg)' }}
    >
      <svg viewBox="0 0 400 30" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="pencilBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5b841" />
            <stop offset="25%" stopColor="#ffcc4d" />
            <stop offset="75%" stopColor="#e8a831" />
            <stop offset="100%" stopColor="#c28c25" />
          </linearGradient>
          <linearGradient id="ferrule" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5b3a6" />
            <stop offset="50%" stopColor="#dbe8db" />
            <stop offset="100%" stopColor="#7c877d" />
          </linearGradient>
          <linearGradient id="eraser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e68d9f" />
            <stop offset="50%" stopColor="#ffb3c1" />
            <stop offset="100%" stopColor="#cc6e81" />
          </linearGradient>
          <linearGradient id="woodTip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e6cdad" />
            <stop offset="50%" stopColor="#f5e1c8" />
            <stop offset="100%" stopColor="#c7ad89" />
          </linearGradient>
        </defs>

        {/* ERASER */}
        <rect x="0" y="2" width="40" height="26" rx="5" fill="url(#eraser)" />

        {/* FERRULE (Metal Band) */}
        <rect x="35" y="2" width="25" height="26" fill="url(#ferrule)" />
        <rect x="37" y="2" width="2" height="26" fill="rgba(0,0,0,0.2)" />
        <rect x="42" y="2" width="2" height="26" fill="rgba(0,0,0,0.2)" />
        <rect x="52" y="2" width="2" height="26" fill="rgba(0,0,0,0.2)" />

        {/* MAIN BODY */}
        <rect x="60" y="2" width="280" height="26" fill="url(#pencilBody)" />
        {/* Hexagonal ridges */}
        <line x1="60" y1="10" x2="340" y2="10" stroke="#fef5d8" strokeWidth="1" opacity="0.6" />
        <line x1="60" y1="20" x2="340" y2="20" stroke="#a37622" strokeWidth="1.5" opacity="0.4" />

        {/* TEXT DECAL */}
        <text x="280" y="18" fontFamily="'Courier New', monospace" fontSize="10" fontWeight="bold" fill="#755011" opacity="0.7" letterSpacing="1px">HB NO. 2</text>

        {/* SHARPENED WOOD TIP */}
        <polygon points="340,2 385,15 340,28" fill="url(#woodTip)" />
        {/* Wood grain scallops (fake) */}
        <path d="M 340 2 C 345 5, 345 10, 340 10 C 348 13, 348 18, 340 20 C 345 23, 345 28, 340 28" fill="url(#pencilBody)" />

        {/* GRAPHITE LEAD */}
        <polygon points="380,12 395,15 380,18" fill="#3d3c3b" />
        <polygon points="380,12 390,14 380,15" fill="#505050" />
      </svg>
    </div>
  );
}

/**
 * ── DESK CALENDAR & CLOCK ──
 * A skeuomorphic block calendar placed firmly on the desk.
 * Shows ticking real-time Date and AM/PM format matching.
 */
export function DeskCalendar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const month = time.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dateNum = time.getDate();
  const dayName = time.toLocaleString('en-US', { weekday: 'long' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      className="relative pointer-events-auto shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_2px_6px_rgba(0,0,0,0.6)] rounded-lg w-[160px]"
      style={{
        transformOrigin: 'top left',
        rotate: '-3deg'
      }}
      whileHover={{ scale: 1.05, rotate: '-2deg', y: -2 }}
    >
      {/* Heavy wood base wrapper */}
      <div
        className="w-full relative rounded-lg border-2 border-[#1e140d] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${woodImg})`,
          backgroundSize: 'cover',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)'
        }}
      >
        {/* Hardware metallic hinges (top holding the paper) */}
        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-b from-[#b8860b] to-[#755506] border-b border-[#3b2a03] flex justify-around">
          <div className="w-4 h-full bg-[#3b2a03]/40 border-r border-[#ffe3a1]/20"></div>
          <div className="w-4 h-full bg-[#3b2a03]/40 border-r border-[#ffe3a1]/20"></div>
        </div>

        {/* ── CALENDAR DATE BLOCK ── */}
        <div className="mt-2 mx-2 mb-1 rounded bg-[#f4ebd0] border-t border-b border-black/10 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          {/* subtle paper noise/gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-black/5 pointer-events-none" />

          {/* Header Month Strip */}
          <div className="w-full bg-[#9c2929] text-[#f4ebd0] text-center py-1 border-b border-[#4a1313] shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            <p className="font-serif text-[11px] font-bold tracking-[0.2em]">{month}</p>
          </div>

          {/* Large Date Number */}
          <div className="py-2 flex items-center justify-center">
            <h1 className="font-serif text-[50px] font-black text-[#2b1f1a] leading-none" style={{ textShadow: "0 1px 2px rgba(43,31,26,0.3)" }}>
              {dateNum}
            </h1>
          </div>

          {/* Day Name */}
          <div className="w-full text-center pb-2">
            <p className="font-mono text-[10px] text-[#2b1f1a] font-bold uppercase tracking-wider opacity-70">
              {dayName}
            </p>
          </div>
        </div>

        {/* ── LIVE DIGITAL FLIP CLOCK AREA ── */}
        <div className="mx-2 mb-2 p-2 bg-[#1a1c1d] rounded flex justify-center items-center relative border border-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
          {/* Glossy glass reflection */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 rounded-t pointer-events-none" />

          <p className="font-mono text-[#e89d5f] font-bold text-lg tracking-[0.1em]" style={{ textShadow: '0 0 5px rgba(232,157,95,0.6)' }}>
            {timeStr}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
