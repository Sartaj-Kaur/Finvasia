import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import leatherImg from '../assets/leather.jpg';

const TIPS = [
  "Track every rupee! 💰",
  "Save first, spend later 🎯",
  "Budget = freedom 🚀",
  "Small habits, big wins ✨",
  "Your future self thanks you 🙏",
  "Compound interest is magic 📈",
];

/* ── Expression configs — eye shape + LED color (Warm Amber/Gold theme) ── */
const EXPR = {
  idle:      { lh: 20, rh: 20, ry: 0, ly: 0, color: '#ffb700', nose: '#8c5035' },
  happy:     { lh: 12, rh: 12, ry:-2, ly:-2, color: '#ffcc44', nose: '#a86548' },
  thinking:  { lh: 16, rh: 22, ry: 3, ly: 0, color: '#f5d061', nose: '#8c5035' },
  surprised: { lh: 26, rh: 26, ry:-3, ly:-3, color: '#ff8800', nose: '#d46a2a' },
  wink:      { lh: 20, rh:  2, ry: 9, ly: 0, color: '#ffcc44', nose: '#a86548' },
  sleepy:    { lh:  7, rh:  7, ry: 6, ly: 6, color: '#c79c5e', nose: '#6b3c27' },
  angry:     { lh: 16, rh: 16, ry: 0, ly: 0, color: '#ff5500', nose: '#ff3300' },
};

function RobotFaceSvg({ expression, blinking, ex, ey }) {
  const cfg = EXPR[expression] || EXPR.idle;
  const c = cfg.color;

  const lh = blinking ? 2 : cfg.lh;
  const rh = blinking ? 2 : cfg.rh;
  const lyOff = blinking ? (cfg.lh / 2 - 1) : 0;
  const ryOff = blinking ? (cfg.rh / 2 - 1) : 0;

  const LEX = 22 + ex, LEY = 34 + cfg.ly + ey + lyOff;
  const REX = 58 + ex, REY = 34 + cfg.ry + ey + ryOff;
  const EW = 20;

  return (
    <svg viewBox="0 0 100 100" width="88" height="88" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <filter id="lg" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sg" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <radialGradient id="sb" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#2b1a10"/>
          <stop offset="100%" stopColor="#0a0502"/>
        </radialGradient>
      </defs>

      {/* Screen area purely - outer rim handled by HTML div */}
      <rect x="0" y="0" width="100" height="100" rx="20" fill="url(#sb)" />
      
      {/* Curved glass glare */}
      <path d="M 0 30 C 0 10, 10 0, 30 0 L 70 0 C 40 20, 20 45, 10 75 C 5 60, 0 45, 0 30 Z" fill="rgba(255,255,255,0.06)" />
      <rect x="18" y="10" width="40" height="8" rx="4" fill="rgba(255,255,255,0.04)" transform="rotate(-15 18 10)" />

      {/* ── LEFT EYE ── */}
      <rect x={LEX} y={LEY}
        width={EW} height={lh} rx={Math.min(7, lh/2)}
        fill={c} filter="url(#lg)" opacity="0.95"
      />
      {!blinking && (
        <>
          <rect x={LEX+3} y={LEY+3} width={EW-6} height={lh-6} rx={4} fill={c} opacity="0.4"/>
          <circle cx={LEX+5} cy={LEY+5} r="2.5" fill="white" opacity="0.85"/>
        </>
      )}

      {/* ── RIGHT EYE ── */}
      <rect x={REX} y={REY}
        width={EW} height={rh} rx={Math.min(7, rh/2)}
        fill={c} filter="url(#lg)" opacity="0.95"
      />
      {!blinking && (
        <>
          <rect x={REX+3} y={REY+3} width={EW-6} height={Math.max(1,rh-6)} rx={4} fill={c} opacity="0.4"/>
          <circle cx={REX+5} cy={REY+5} r="2.5" fill="white" opacity="0.85"/>
        </>
      )}

      {/* Angry brow marks */}
      {expression === 'angry' && (
        <>
          <line x1={LEX} y1={LEY-5} x2={LEX+EW} y2={LEY-1} stroke="#ff3300" strokeWidth="3" strokeLinecap="round" filter="url(#sg)"/>
          <line x1={REX} y1={REY-1} x2={REX+EW} y2={REY-5} stroke="#ff3300" strokeWidth="3" strokeLinecap="round" filter="url(#sg)"/>
        </>
      )}

      {/* ── NOSE / TONGUE ── */}
      <ellipse cx="50" cy="72" rx="4.5" ry="4" fill={cfg.nose} filter="url(#sg)"/>
      <ellipse cx="49" cy="71" rx="1.5" ry="1" fill="rgba(255,255,255,0.3)"/>

      {/* ── MOUTH DETAIL ── */}
      {expression === 'happy' && (
        <path d="M 32 84 Q 50 94 68 84" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sg)"/>
      )}
      {expression === 'surprised' && (
        <ellipse cx="50" cy="86" rx="8" ry="6" fill="none" stroke={c} strokeWidth="2" filter="url(#sg)"/>
      )}
      {expression === 'angry' && (
        <path d="M 34 88 Q 50 82 66 88" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sg)"/>
      )}
      {['idle','thinking','sleepy','wink'].includes(expression) && (
        <path d="M 38 85 Q 50 89 62 85" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" filter="url(#sg)"/>
      )}
    </svg>
  );
}

export function PetAgent() {
  const [expression, setExpression] = useState('idle');
  const [blinking,   setBlinking]   = useState(false);
  const [eyeOffset,  setEyeOffset]  = useState({ x: 0, y: 0 });
  const [tipIdx,     setTipIdx]     = useState(null);
  const [showTip,    setShowTip]    = useState(false);
  const [isHovered,  setIsHovered]  = useState(false);
  const tipTimer = useRef(null);

  useEffect(() => {
    const blink = () => {
      const t = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => { setBlinking(false); blink(); }, 140);
      }, 2500 + Math.random() * 4000);
      return t;
    };
    const t = blink();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setEyeOffset({ x: Math.round((Math.random()-.5)*5), y: Math.round((Math.random()-.5)*3) });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const pool = ['idle','idle','idle','happy','thinking','wink','surprised','sleepy','angry'];
    const id = setInterval(() => {
      setExpression(pool[Math.floor(Math.random() * pool.length)]);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const run = () => {
      tipTimer.current = setTimeout(() => {
        setTipIdx(Math.floor(Math.random() * TIPS.length));
        setShowTip(true);
        setTimeout(() => { setShowTip(false); run(); }, 3800);
      }, 8000 + Math.random() * 10000);
    };
    run();
    return () => clearTimeout(tipTimer.current);
  }, []);

  const handleClick = () => {
    const keys = Object.keys(EXPR);
    setExpression(keys[(keys.indexOf(expression) + 1) % keys.length]);
    setTipIdx(Math.floor(Math.random() * TIPS.length));
    setShowTip(true);
    clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setShowTip(false), 3500);
  };

  return (
    <div className="fixed bottom-12 right-12 z-[200] flex flex-col items-center select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.82 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="mb-3 px-4 py-2.5 text-[13px] font-serif text-[#e6d5ba] rounded-lg max-w-[180px] text-center leading-snug relative"
            style={{
              background: '#2b1f1a', // Dark Leather tone
              border: '1px solid #d4af37', // Gold border
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              letterSpacing: '0.02em',
            }}
          >
            {TIPS[tipIdx ?? 0]}
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45"
              style={{ background:'#2b1f1a', borderRight:'1px solid #d4af37', borderBottom:'1px solid #d4af37' }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Face Unit - Re-themed with Leather */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Click to interact!"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[24px]"
          animate={{
            filter: isHovered
              ? 'drop-shadow(0 0 25px rgba(212,175,55,0.7))'
              : 'drop-shadow(0 6px 12px rgba(0,0,0,0.8))',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Outer Leather Base (matches the wallet) */}
        <div 
          className="relative p-[10px] bg-[#8c5035] rounded-[24px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.1),_0_5px_15px_rgba(0,0,0,0.5)] border border-[#6b3c27]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${leatherImg})`,
            backgroundSize: '150px auto'
          }}
        >
          {/* Dashed Gold Stitches */}
          <div className="absolute inset-[5px] border-[1.5px] border-dashed border-[#d4af37] opacity-50 rounded-[19px] pointer-events-none" />

          {/* Deep Screen Recess Shadow */}
          <div className="absolute inset-[10px] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] rounded-[14px] pointer-events-none z-10" />

          {/* Actual SVG Screen */}
          <div className="relative border border-[#2b160a] rounded-[16px] overflow-hidden bg-[#0a0502]">
            <RobotFaceSvg
              expression={expression}
              blinking={blinking}
              ex={eyeOffset.x}
              ey={eyeOffset.y}
            />
          </div>
        </div>

      </motion.div>
    </div>
  );
}
