import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import paperImg from '../assets/file.avif';

/* ── PREMIUM GOLD FOIL SEAL (Skeuomorphic) ── */
const FoilStamp = () => (
  <motion.div
    initial={{ scale: 2, opacity: 0, rotate: -20, filter: 'brightness(1.5)' }}
    animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'brightness(1)' }}
    transition={{ type: 'spring', stiffness: 250, damping: 15 }}
    className="w-full h-full relative"
    style={{ filter: "drop-shadow(0 2px 4px rgba(43,31,26,0.4))" }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        {/* Warm gold metallic sheen */}
        <linearGradient id="warmGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d068" />
          <stop offset="35%" stopColor="#aa7c39" />
          <stop offset="65%" stopColor="#f8e58f" />
          <stop offset="100%" stopColor="#8c5825" />
        </linearGradient>
        {/* Inner shadow/indent */}
        <radialGradient id="sealIndent" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(43,31,26,0.3)" />
        </radialGradient>
      </defs>
      
      {/* Outer scalloped/ridged edge (simulated with layered circles) */}
      <circle cx="50" cy="50" r="48" fill="url(#warmGold)" />
      
      {/* Inner sunken area */}
      <circle cx="50" cy="50" r="44" fill="url(#sealIndent)" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#ffe599" strokeWidth="1" opacity="0.6"/>
      <circle cx="50" cy="50" r="39" fill="none" stroke="#7a5223" strokeWidth="0.5" opacity="0.4"/>
      
      {/* Center emblem */}
      <text x="50" y="66" textAnchor="middle" fontSize="46" fontFamily="'Cormorant Garamond', serif" fontWeight="800" fill="#2b1f1a" opacity="0.95" style={{ textShadow: "0px 1px 1px rgba(255,255,255,0.4)" }}>₹</text>
    </svg>
  </motion.div>
);

export function MicroWealthCard() {
  const [stampCount, setStampCount] = useState(0);

  // Auto-ticking stamps
  useEffect(() => {
    const timer = setInterval(() => {
      setStampCount(prev => {
        if (prev >= 10) return 0;
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="relative w-[340px] shadow-[0_12px_30px_rgba(43,31,26,0.4),_0_2px_8px_rgba(43,31,26,0.3)] pointer-events-auto"
      style={{
        rotate: '-2deg',
        transformOrigin: 'top right'
      }}
    >
      {/* Premium Heavy Paper Base */}
      <div 
        className="w-full relative bg-[#f4ebd0] p-b-2 overflow-hidden"
        style={{
          border: '1px solid rgba(43,31,26,0.3)',
          backgroundImage: `url(${paperImg})`,
          backgroundSize: '100% 100%',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Subtle shadow gradient at the top edge */}
        <div className="absolute top-0 left-0 w-full h-[8px] shadow-[inset_0_4px_10px_rgba(43,31,26,0.15)] opacity-60 mix-blend-multiply pointer-events-none" />

        {/* Ornate Vintage Double Border */}
        <div className="absolute inset-2 border-[1.5px] border-double border-[#4a2414]/30 pointer-events-none mix-blend-multiply" />
        <div className="absolute inset-3 border border-solid border-[#4a2414]/10 pointer-events-none mix-blend-multiply" />

        {/* ── CARD HEADER ── */}
        <div className="text-center mt-7 mb-6 relative px-4 mix-blend-multiply">
          <p className="font-mono text-[9px] text-[#4a2414] font-bold tracking-[0.3em] uppercase opacity-60 mb-2">
            1 SEED = ₹50
          </p>
          <h2 className="font-serif text-[28px] text-[#2b1f1a] font-bold tracking-tighter uppercase" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}>
            Micro-Fund
          </h2>
        </div>

        {/* ── INVESTMENT GRID (2x5) ── */}
        <div className="grid grid-cols-5 gap-y-7 gap-x-2 justify-items-center px-4 relative z-10 mb-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="w-[46px] h-[46px] rounded-full flex items-center justify-center relative mix-blend-multiply"
            >
              {/* Recessed slot graphic */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(43,31,26,0.2)] bg-[#e9e0c5] border border-[#2b1f1a]/10" />

              {/* Completed Foil Stamp */}
              <AnimatePresence>
                {i < stampCount && (
                  <motion.div className="absolute inset-[1px] z-10" key={`stamp-${i}`}>
                    <FoilStamp />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty placeholder guide */}
              {i >= stampCount && (
                <div className="w-6 h-6 rounded-full border border-dashed border-[#4a2414]/20 z-0" />
              )}
            </div>
          ))}
        </div>

        {/* ── PROGRESS/STATUS FOOTER ── */}
        <div className="mt-2 py-4 text-center border-t border-dashed border-[#4a2414]/20 mix-blend-multiply relative">
          {/* Faint corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#4a2414]/30" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#4a2414]/30" />
          
          <motion.p 
            key={stampCount}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-xs text-[#2b1f1a] font-bold tracking-[0.1em] uppercase opacity-80"
          >
            {stampCount} / 10 ASSETS SECURED
          </motion.p>
        </div>

      </div>
    </motion.div>
  );
}
