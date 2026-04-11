import React from 'react';
import { motion } from 'framer-motion';
import paperImg from '../assets/paper.jpg';

const CleanPaperTexture = ({ brightness = '100%' }) => (
  <div 
    className="absolute inset-0 pointer-events-none rounded-[2px] opacity-30 mix-blend-multiply"
    style={{
      backgroundImage: `url(${paperImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: `brightness(${brightness}) grayscale(40%)`
    }}
  />
);

export function DocumentStack() {
  return (
    <div className="relative w-[340px] xl:w-[380px] h-[480px] xl:h-[540px] perspective-[1500px]">
      
      {/* SHADOW BASE FOR STACK */}
      {/* Strong ambient base shadow isolated to the actual footprint of the stack */}
      <div className="absolute inset-4 top-10 shadow-[0_25px_50px_rgba(0,0,0,0.4)] rounded-[2px] pointer-events-none z-0" />

      {/* LAYER 4 (Bottom) */}
      <motion.div 
        className="absolute inset-0 bg-[#d9c29a] rounded-[2px] shadow-[0_10px_20px_rgba(0,0,0,0.25),inset_0_0_15px_rgba(0,0,0,0.06)] border border-[#ba9d6d] z-10"
        style={{ transform: 'rotate(1.5deg) translate(6px, 12px)' }}
        whileHover={{ x: 20, y: 18, rotate: 3, transition: { duration: 0.3 } }}
      >
        <CleanPaperTexture brightness="80%" />
      </motion.div>

      {/* LAYER 3 */}
      <motion.div 
        className="absolute inset-0 bg-[#e0cc9f] rounded-[2px] shadow-[0_10px_20px_rgba(0,0,0,0.25),inset_0_0_15px_rgba(0,0,0,0.06)] border border-[#c4ae85] z-20"
        style={{ transform: 'rotate(-0.5deg) translate(2px, 8px)' }}
        whileHover={{ x: 10, y: 10, rotate: -2, transition: { duration: 0.3 } }}
      >
        <CleanPaperTexture brightness="85%" />
      </motion.div>

      {/* LAYER 2 */}
      <motion.div 
        className="absolute inset-0 bg-[#e6d3a3] rounded-[2px] shadow-[0_10px_20px_rgba(0,0,0,0.25),inset_0_0_15px_rgba(0,0,0,0.06)] border border-[#d1bf96] z-30"
        style={{ transform: 'rotate(0.5deg) translate(4px, 4px)' }}
        whileHover={{ x: -8, y: 4, rotate: 0, transition: { duration: 0.3 } }}
      >
        <CleanPaperTexture brightness="90%" />
      </motion.div>

      {/* LAYER 1 (TOP MAIN DOCUMENT) */}
      <motion.div 
        className="absolute inset-0 bg-[#f5e6d3] rounded-[2px] shadow-[0_10px_20px_rgba(0,0,0,0.25),inset_0_0_10px_rgba(255,255,255,0.7)] border border-[#e3d1ba] flex flex-col z-40 transform-gpu"
        style={{ transform: 'rotate(0deg) translate(0px, 0px)' }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        {/* Soft paper texture */}
        <CleanPaperTexture brightness="100%" />
        
        {/* Clean Top-Left Light Gradient */}
        <div className="absolute top-0 left-0 w-[80%] h-[60%] bg-gradient-to-br from-white/60 to-transparent pointer-events-none rounded-[2px]" />

        {/* RECTANGULAR TOP TAB */}
        <div 
          className="absolute top-[-30px] left-[25px] w-[150px] h-[32px] bg-[#e6d3a3] border-t border-l border-r border-[#c4ae85] rounded-t-[4px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),-2px_0_5px_rgba(0,0,0,0.1),2px_0_5px_rgba(0,0,0,0.1)] flex items-center justify-center z-[-1] overflow-hidden"
        >
           <CleanPaperTexture brightness="90%" />
           <span className="text-[#2b2b2b]/80 font-bold tracking-widest text-[11px] mb-[2px] mix-blend-multiply">LOAN SIMULATOR</span>
        </div>

        {/* VERY NEAT DOCUMENT CONTENT */}
        <div className="p-10 xl:p-12 flex flex-col h-full opacity-90 mix-blend-multiply relative z-10 text-[#2b2b2b]" style={{ textShadow: '0 0 1px rgba(43,43,43,0.1)' }}>
          {/* Header */}
          <h2 className="text-[#2b2b2b] text-[34px] font-serif mb-8 border-b-[1.5px] border-[#2b2b2b]/15 pb-4 drop-shadow-[0_0.5px_0_rgba(255,255,255,0.5)]">
            Loan Simulator
          </h2>
          
          {/* Data Lines */}
          <div className="space-y-6 lg:space-y-8 font-serif text-[15px] xl:text-[17px]">
            <p className="leading-[1.8] opacity-90 indent-6">
              This document outlines the projected amortization schedule and corresponding interest liabilities over the requested term. Terms and agreements are subject to primary credit validation.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between border-b border-[#2b2b2b]/10 pb-3">
                <span className="font-semibold opacity-90">Principal Amount:</span>
                <span className="font-mono font-medium tracking-tight">$250,000.00</span>
              </div>
              <div className="flex justify-between border-b border-[#2b2b2b]/10 pb-3">
                <span className="font-semibold opacity-90">Interest Rate:</span>
                <span className="font-mono font-medium tracking-tight">4.25% Fixed</span>
              </div>
              <div className="flex justify-between border-b border-[#2b2b2b]/10 pb-3">
                <span className="font-semibold opacity-90">Term:</span>
                <span className="font-mono font-medium tracking-tight">360 Months</span>
              </div>
            </div>
            
            {/* Minimal Subtext */}
            <p className="text-[13px] opacity-60 italic pt-4">
              Schedule generated strictly for demonstrative capabilities. Rate locks apply pending finalized review protocols.
            </p>
          </div>
          
          {/* Formal Clean Sign-off */}
          <div className="mt-auto">
             <div className="flex items-end justify-between">
                <div className="w-[120px] border-b border-[#2b2b2b]/40 pb-1">
                   <p className="text-[12px] opacity-70 italic">Date Originated</p>
                </div>
                <div className="w-[180px] border-b border-[#2b2b2b]/40 pb-1 text-right">
                   <p className="text-[12px] opacity-70 italic pr-2">Authorized Seal</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
