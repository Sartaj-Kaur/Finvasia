import React from 'react';
import { motion } from 'framer-motion';

export function CoffeeCup() {
  return (
    <div className="relative pointer-events-none" style={{ width: '160px', height: '160px' }}>
      
      {/* ── COFFEE RING STAIN ── */}
      {/* Positioned slightly offset from the actual cup to look like the cup was moved */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute top-[-10px] left-[-20px] w-[140%] h-[140%] opacity-[0.15] mix-blend-multiply"
        style={{ filter: 'blur(0.5px)' }}
      >
        <circle cx="48" cy="52" r="42" fill="none" stroke="#2e1503" strokeWidth="2" opacity="0.8" />
        {/* Irregular stain artifacts */}
        <circle cx="48" cy="52" r="42" fill="none" stroke="#4a2608" strokeWidth="6" strokeDasharray="10 40 5 60" opacity="0.6" />
        <circle cx="48" cy="52" r="41.5" fill="none" stroke="#4a2608" strokeWidth="1.5" strokeDasharray="30 20 80 10" opacity="0.9" />
      </svg>

      {/* ── MAIN CUP BASE ── */}
      <div 
        className="relative w-full h-full rounded-full"
        style={{
          // Massive drop shadow simulating realistic desk seating
          boxShadow: `
            15px 25px 30px rgba(0, 0, 0, 0.4), 
            5px 10px 15px rgba(0, 0, 0, 0.3),
            inset -3px -6px 8px rgba(0,0,0,0.1)
          `,
          backgroundColor: '#ebe3d5', // Warm ceramic off-white
        }}
      >
        {/* Ceramic Rim Highlight & Structure */}
        <div 
          className="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full"
          style={{
            // Deep indent shadow for the inner wall of the cup
            boxShadow: 'inset 4px 8px 12px rgba(0,0,0,0.6), inset -2px -2px 4px rgba(255,255,255,0.8)',
            backgroundColor: '#d9cdb8'
          }}
        >
          {/* LIQUID: Deep Coffee */}
          <div 
            className="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #4a2105 0%, #170a01 70%, #050200 100%)',
              boxShadow: 'inset 0px 4px 10px rgba(0,0,0,0.9)'
            }}
          >
            {/* Liquid Surface Tension Reflection */}
            <div 
              className="absolute top-[8%] left-[12%] w-[80%] h-[80%] rounded-full border-[2px] border-white opacity-[0.08]" 
            />
            
            {/* Main Window light Glare reflection on liquid */}
            <div 
              className="absolute top-[10%] left-[15%] w-[35%] h-[20%] rounded-[100%] bg-white opacity-[0.06] -rotate-12"
              style={{ filter: 'blur(2px)' }}
            />
            {/* Secondary harsh highlight dot */}
            <div 
              className="absolute top-[15%] left-[18%] w-[8%] h-[6%] rounded-[100%] bg-white opacity-[0.14] -rotate-12"
              style={{ filter: 'blur(0.5px)' }}
            />
            
            {/* ── SOFT STEAM ANIMATION ── */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              style={{ filter: 'blur(3px)' }}
            >
              {/* Steam path 1 (Leftish) */}
              <motion.path
                d="M 35 70 Q 25 50 40 30 T 35 -10"
                fill="none"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, y: 10 }}
                animate={{ pathLength: 1, opacity: [0, 0.4, 0], y: -20, x: [0, 5, -5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              />
              
              {/* Steam path 2 (Centerish, delayed) */}
              <motion.path
                d="M 50 80 Q 65 50 45 20 T 55 -20"
                fill="none"
                stroke="white"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, y: 15 }}
                animate={{ pathLength: 1, opacity: [0, 0.5, 0], y: -30, x: [0, -8, 8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                  times: [0, 0.6, 1]
                }}
              />

              {/* Steam path 3 (Rightish, delayed more) */}
              <motion.path
                d="M 65 65 Q 80 45 60 25 T 70 -5"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, y: 5 }}
                animate={{ pathLength: 1, opacity: [0, 0.3, 0], y: -15, x: [0, 4, -4, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                  times: [0, 0.5, 1]
                }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
