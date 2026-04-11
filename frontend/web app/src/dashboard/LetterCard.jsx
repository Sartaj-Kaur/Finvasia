import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import paperImg from '../assets/paper.jpg';

const PaperTexture = ({ brightness = "100%" }) => (
  <div 
    className="absolute inset-0 pointer-events-none rounded-inherit z-0"
    style={{
      backgroundImage: `url(${paperImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: `brightness(${brightness})`
    }}
  />
);

export function LetterCard() {
  const [step, setStep] = useState(0); 

  const handleSealClick = (e) => {
    e.stopPropagation();
    if (step !== 0) return;
    setStep(1);
    
    setTimeout(() => {
      setStep(2); 
      setTimeout(() => {
        setStep(3); 
        setTimeout(() => {
          setStep(4);
        }, 700); 
      }, 550); 
    }, 500); 
  };

  const closeLetter = (e) => {
    if (e) e.stopPropagation();
    setStep(0);
  };

  return (
    <>
      <div className="relative flex items-center justify-center group pointer-events-auto">
        
        {/* ENVELOPE OBJECT */}
        <motion.div
          className={`relative drop-shadow-[5px_20px_25px_rgba(0,0,0,0.45)] ${step >= 4 ? 'z-0' : 'z-20'}`}
          style={{ perspective: 1200, width: 'clamp(280px, 24vw, 420px)', height: 'clamp(160px, 14vw, 220px)' }}
          animate={{
            rotateZ: step >= 4 ? 0 : -2,
            scale: step >= 4 ? 0.9 : 1,
            opacity: step >= 4 ? 0 : 1, 
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Back face of the envelope (inside view) */}
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(90,50,20,0.3)] rounded-[2px] overflow-hidden">
             <PaperTexture brightness="85%" />
             {/* Dynamic top-left lighting hitting inside back */}
             <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-white/20 blur-[40px] pointer-events-none z-10" />
          </div>
          
          {/* Deep inner shadow exactly covering the internal area */}
          <div className="absolute inset-0 bg-black/20 rounded-[2px] pointer-events-none z-10" />

          {/* Letter Entity (When inside the envelope) */}
          <AnimatePresence>
            {step < 4 && (
              <motion.div
                layoutId="letter-content"
                className="absolute inset-x-2 bottom-2 top-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex flex-col p-4 rounded-[2px] overflow-hidden border border-[#3b170c]/80"
                animate={{ 
                  y: step >= 3 ? -130 : 0, 
                  zIndex: step >= 3 ? 35 : 10 
                }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <PaperTexture brightness="115%" />
                <div className="absolute inset-0 bg-[#ffffff]/60 pointer-events-none z-10" />
                
                {/* Burnout Edges Layer */}
                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(50,20,10,0.9),inset_0_0_25px_rgba(90,35,15,0.6)] mix-blend-multiply pointer-events-none z-10" />
                <div className="border-[0.5px] border-[#e6d5ba] w-full h-full p-3 flex flex-col opacity-80 z-20 mix-blend-multiply">
                  <h3 className="font-serif text-[13px] font-bold text-[#2f2f2f] mb-1 leading-tight text-center tracking-wide" style={{ borderBottom: '1px solid rgba(47,47,47,0.2)', paddingBottom: '4px' }}>
                    A Letter from Future You
                  </h3>
                  <p className="text-[#2f2f2f] leading-tight text-[11px] mt-2" style={{ fontFamily: "'Caveat', cursive" }}>
                    Hey there,<br/>Just writing to say...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Flap */}
          <div 
            className="absolute inset-0 z-20 overflow-hidden drop-shadow-[0_-3px_5px_rgba(0,0,0,0.12)] rounded-b-[2px]"
            style={{ clipPath: 'polygon(0 100%, 50% 46%, 100% 100%)' }}
          >
            <PaperTexture brightness="100%" />
            {/* Top-left soft highlight on flap */}
            <div className="absolute top-[40%] left-[20%] w-[100px] h-[100px] bg-white/20 blur-[30px] pointer-events-none z-10" />
            <div className="absolute inset-0 shadow-[inset_0_-20px_40px_rgba(100,50,15,0.2)] pointer-events-none z-10" />
            
            {/* Subtle paper bevel highlight along the cut edge */}
            <div className="absolute w-[60%] h-[1px] bg-white/30 top-[73%] left-[25%] rotate-[30deg] blur-[0.5px] z-20" />
          </div>

          {/* Handwritten Note - Pulled OUTSIDE the bottom flap clipPath to prevent strict edge clipping */}
          <div className="absolute inset-x-0 bottom-[14%] text-center transform rotate-[-3deg] z-[25] pointer-events-none">
            <p 
              className="text-[#2b1f1a] text-[30px] xl:text-[38px] tracking-[0.03em] opacity-85 mix-blend-multiply drop-shadow-[0_1px_1px_rgba(255,255,255,0.1)]" 
              style={{ 
                fontFamily: "'Caveat', cursive", 
                textShadow: '0 0.5px 1px rgba(43,31,26,0.3)', // subtle bleed 
              }}
            >
              A note from your FinTwin
            </p>
          </div>

          {/* Left Flap */}
          <div 
            className="absolute inset-0 z-20 overflow-hidden drop-shadow-[2px_0_4px_rgba(0,0,0,0.06)] rounded-l-[2px]"
            style={{ clipPath: 'polygon(0 0, 48% 50%, 0 100%)' }}
          >
            <PaperTexture brightness="90%" />
            <div className="absolute top-0 left-0 w-[150px] h-[150px] bg-white/30 blur-[40px] pointer-events-none z-10" />
            <div className="absolute inset-0 shadow-[inset_-20px_0_30px_rgba(100,50,0,0.1)] pointer-events-none z-10" />
          </div>

          {/* Right Flap */}
          <div 
            className="absolute inset-0 z-20 overflow-hidden drop-shadow-[-2px_0_4px_rgba(0,0,0,0.06)] rounded-[2px]"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 52% 50%)' }}
          >
            <PaperTexture brightness="85%" />
            <div className="absolute inset-0 shadow-[inset_20px_0_30px_rgba(100,50,0,0.15)] pointer-events-none z-10" />
          </div>

          {/* Top Flap (Pivots & Opens) */}
          <motion.div
            className="absolute inset-0 origin-top z-30 transform-gpu"
            initial={{ rotateX: 0 }}
            animate={{ 
              rotateX: step >= 2 ? 180 : 0, 
              zIndex: step >= 3 ? 5 : 30 // Tucks perfectly behind sliding letter
            }}
            transition={{ duration: 0.6, ease: [0.35, 0.05, 0.15, 1] }} 
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of the flap (Visible when closed) */}
            <div 
              className="absolute inset-0 drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] rounded-t-[2px] overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 56%)', backfaceVisibility: 'hidden' }}
            >
              <PaperTexture brightness="105%" />
              <div className="absolute top-[-20px] left-[-20px] w-[150px] h-[150px] bg-white/40 blur-[40px] pointer-events-none z-10" />
              <div className="absolute top-0 inset-x-0 h-[30px] shadow-[inset_0_15px_20px_rgba(140,90,40,0.15)] pointer-events-none z-10" />
            </div>
            
            {/* Back of the flap (Visible when opened) */}
            <div 
              className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(100,50,20,0.3)] rounded-b-[2px] overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 56%)', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
              <PaperTexture brightness="85%" />
              {/* Fake flap fold shadow line */}
              <div className="absolute bottom-[44%] inset-x-0 h-[2px] bg-black/20 blur-[1px] z-10" />
            </div>
          </motion.div>

          {/* Photorealistic Wax Seal */}
          <AnimatePresence>
            {step < 2 && (
              <motion.div 
                className="absolute w-[64px] h-[64px] left-0 right-0 mx-auto z-40 flex items-center justify-center cursor-pointer"
                style={{ 
                  top: '40%', 
                  borderRadius: '46% 54% 51% 49% / 52% 47% 53% 48%', // Natural organic shape
                  background: 'radial-gradient(ellipse at 30% 30%, #a22929 0%, #6e1b1b 50%, #451111 100%)',
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.25), inset -2px -4px 8px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.4)' 
                }}
                animate={
                  step === 0 ? { scale: 1 } : 
                  { scale: [1, 1.15, 0.95], opacity: [1, 1, 0] }
                }
                transition={{ duration: 0.5, ease: "easeIn" }}
                onClick={handleSealClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Crack Effect Overlay (Visible during step 1 break) */}
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 w-full h-full bg-black/40 mix-blend-multiply" 
                    style={{ clipPath: 'polygon(45% 0, 52% 20%, 48% 40%, 53% 60%, 47% 80%, 55% 100%, 0 100%, 0 0)' }} 
                  />
                )}
                
                {/* Glossy High-Intensity Highlights */}
                <div className="absolute top-1.5 left-2.5 w-6 h-2.5 bg-white/40 rounded-full blur-[1px] rotate-[-35deg]" />
                <div className="absolute top-3 left-1.5 w-2 h-2 bg-white/50 rounded-full blur-[0.5px]" />
                
                {/* Embedded Monogram Press / Stamp Depth */}
                <div className="w-[42px] h-[42px] border-[1.5px] border-[#380e0e]/80 rounded-[51%_49%_50%_50%] flex items-center justify-center relative overflow-hidden bg-black/5" style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.15)' }}>
                  <span className="text-[#380e0e] font-serif font-bold text-2xl drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)] -ml-0.5 mt-0.5">F</span>
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* FULLSCREEN REALISTIC LETTER */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {step >= 4 && (
              <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center perspective-[1500px]">
                {/* Ambient dark overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeLetter}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                {/* The Extracted Physical Letter */}
                <motion.div
                  layoutId="letter-content"
                  className="relative w-[90%] max-w-xl h-auto min-h-[400px] pb-10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] z-[110] flex flex-col p-8 md:p-14 rounded-[2px] overflow-hidden border border-[#3b170c]"
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                >
                  <PaperTexture brightness="115%" />
                  <div className="absolute inset-0 bg-[#ffffff]/60 pointer-events-none z-10" />
                  
                  {/* Heavy Burnout Edges */}
                  <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(50,20,10,0.95),inset_0_0_40px_rgba(90,35,15,0.7),inset_0_0_80px_rgba(120,50,20,0.3)] mix-blend-multiply pointer-events-none z-10" />
                  <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#c4a977] rounded-full blur-[80px] opacity-25 pointer-events-none z-10" />
                  <div className="absolute bottom-[10%] left-[-20px] w-[250px] h-[150px] bg-[#a6864d] rounded-full blur-[90px] opacity-20 pointer-events-none z-10" />

                  {/* Physical top-left curl illusion */}
                  <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-20 shadow-[2px_2px_10px_rgba(0,0,0,0.2)] bg-gradient-to-br from-white/40 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />

                  {/* Close button layered carefully */}
                  <button onClick={closeLetter} className="absolute top-6 right-6 text-[#2f2f2f]/60 hover:text-[#2f2f2f] transition-colors z-50">
                    <X size={28} />
                  </button>

                  {/* Content Container */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="flex flex-col h-full relative z-30 opacity-90 mix-blend-multiply"
                  >
                    <h3 className="font-serif text-[28px] md:text-[34px] font-bold text-[#2f2f2f] mb-8 pb-5 tracking-wider text-center mix-blend-multiply drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" style={{ borderBottom: '1.5px solid rgba(47,47,47,0.15)' }}>
                      A Letter from Future You
                    </h3>
                    
                    <div className="flex-1 pt-2 pb-6 px-2 text-[#2f2f2f]" style={{ fontFamily: "'Caveat', cursive" }}>
                      <p className="mb-6 indent-8 text-[26px] md:text-[30px] leading-[1.4] mix-blend-multiply opacity-90 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.3)]">
                        Hey there,
                      </p>
                      <p className="mb-6 text-[26px] md:text-[30px] leading-[1.4] mix-blend-multiply opacity-90 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.3)]">
                        I am just writing to say I am incredibly proud of the choices you are making today. 
                        It takes a lot of discipline to track those budget limits. Those tiny, seemingly insignificant sacrifices? The delayed gratification? They totally paid off.
                      </p>
                      <p className="mb-6 text-[26px] md:text-[30px] leading-[1.4] mix-blend-multiply opacity-90 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.3)]">
                        Keep going, trust the process, and strictly hold the line on that dashboard. The view from here is absolutely amazing, and it is entirely because of you.
                      </p>
                    </div>
                    
                    <div className="pt-4 text-right pr-6">
                      <span className="text-[#2f2f2f] text-[34px] md:text-[40px] font-bold italic mix-blend-multiply opacity-90 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.3)]" style={{ fontFamily: "'Caveat', cursive" }}>- You</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </>
  );
}
