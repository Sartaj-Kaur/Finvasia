import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fileImg from '../assets/file.avif';
import { X, Shield, CreditCard, ChevronRight, FileText } from 'lucide-react';

const FOLDER_WIDTH = 320;
const FOLDER_HEIGHT = 220;

// High-fidelity physical Manila Folder cuts
const leftClip = `polygon(0% 0%, 35% 0%, 38% 16%, 100% 16%, 100% 100%, 0% 100%)`;
const rightClip = `polygon(0% 16%, 62% 16%, 65% 0%, 100% 0%, 100% 100%, 0% 100%)`;

const folders = [
  { 
    id: 'loans', 
    title: 'Loan Simulator',  
    items: [
      { title: 'Home Mortgage', value: '$250,000' }, 
      { title: 'Auto Loan', value: '$25,000' }
    ] 
  },
  { 
    id: 'insurance', 
    title: 'Insurance',  
    items: [
      { title: 'Health Insurance', value: 'Active' }, 
      { title: 'Car Insurance', value: 'Pending' }
    ] 
  }
];

export function FileFolderCard() {
  const [order, setOrder] = useState(['loans', 'insurance']);
  const [activePanel, setActivePanel] = useState(null);

  const bringToFront = (id) => {
    setOrder(prev => {
      // If already on top, don't change state
      if (prev[prev.length - 1] === id) return prev;
      // Filter out and push to end
      return [...prev.filter(i => i !== id), id];
    });
  };

  return (
    <>
      <div className="relative pointer-events-auto w-[360px] h-[260px] flex items-center justify-center">
        {order.map((id, index) => {
          const folder = folders.find(f => f.id === id);
          const isTop = index === order.length - 1;
          
          // Deploying a staggered, diagonal background stack mapping identically shaped folders
          const indexDiff = order.length - 1 - index;
          
          const rotateOffset = id === 'insurance' ? -1 : 1.5;
          const xOffset = indexDiff * -35; 
          const yOffset = indexDiff * -55;
          
          return (
            <motion.div
              key={id}
              layout
              className="absolute cursor-grab active:cursor-grabbing"
              initial={false}
              animate={{ 
                zIndex: index, 
                rotate: rotateOffset,
                x: xOffset,
                y: yOffset,
                scale: isTop ? 1 : 0.95
              }}
              whileHover={{ scale: isTop ? 1.02 : 0.96 }}
              drag
              dragConstraints={{ left: -50, right: 50, top: -70, bottom: 50 }}
              dragElastic={0.25}
              onDragStart={() => bringToFront(id)}
              onClick={() => {
                bringToFront(id);
                // Open panel if it is already the top folder, giving a natural "select to front, then click to open" cadence
                if (isTop && !activePanel) {
                  setActivePanel(folder);
                }
              }}
            >
              {/* Drop-shadow container. We apply shadow using SVG filter technique conceptually to track the polygon clip */}
              <div 
                className="transition-all duration-300"
                style={{ filter: isTop ? 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' : 'drop-shadow(0px 8px 15px rgba(0,0,0,0.3))' }}
              >
                {/* Physical Shape */}
                <div 
                  className="w-[320px] h-[220px] relative overflow-hidden flex items-center justify-center transform-gpu"
                  style={{ 
                    clipPath: leftClip
                  }}
                >
                  {/* Raw textured paper injection matching the envelope exactly */}
                  <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ 
                       backgroundImage: `url(${fileImg})`, 
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       filter: id === 'insurance' ? 'brightness(105%)' : 'brightness(95%)'
                    }} 
                  />
                  {/* Subtle edge shadowing for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(60,30,10,0.15)] pointer-events-none mix-blend-multiply" />

                  {/* Stamp Branding */}
                  <div className="mt-8 border-[1.5px] border-b-[2px] border-[#2b1f1a]/50 px-8 py-2.5 transform rotate-[-3deg] opacity-85 mix-blend-multiply flex items-center justify-center">
                    <div className="absolute left-[-2.5px] w-[5px] h-full bg-transparent border-l-[3.5px] border-dotted border-[#2b1f1a]/50" />
                    <div className="absolute right-[-2.5px] w-[5px] h-full bg-transparent border-r-[3.5px] border-dotted border-[#2b1f1a]/50" />
                    
                    <h2 className="font-serif text-[28px] font-bold text-[#2b1f1a] tracking-[0.06em]">
                      {folder.title}
                    </h2>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Glass Panel (Opens up for selected folder) */}
      <AnimatePresence>
        {activePanel && (
          <motion.div 
            className="fixed top-0 left-0 w-screen h-screen z-[100] flex items-center justify-center p-4 pointer-events-auto"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            {/* Backdrop Blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            <motion.div 
              className="w-full max-w-lg bg-[#f7eedc] rounded shadow-2xl relative overflow-hidden z-10"
              initial={{ y: 60, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()} // Prevent external close trigger
            >
              {/* Internal file texture mirroring the theme */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-25" 
                style={{ backgroundImage: `url(${fileImg})`, backgroundSize: '200px auto' }} 
              />
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(100,50,0,0.1)] pointer-events-none" />

              {/* Header */}
              <div className="border-b border-[#2d2015]/15 p-6 flex items-center justify-between relative z-10 bg-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#cca362] rounded-md shadow-sm mix-blend-multiply">
                    <FileText size={24} className="text-[#2d2015]" />
                  </div>
                  <h3 className="font-serif text-[28px] font-bold text-[#2d2015] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">{activePanel.title} Profile</h3>
                </div>
                <button 
                  onClick={() => setActivePanel(null)}
                  className="p-2 bg-black/5 hover:bg-black/10 rounded-full text-[#2d2015]/80 transition-colors"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Active Items */}
              <div className="p-6 space-y-4 relative z-10">
                {activePanel.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/40 border border-[#2d2015]/10 p-4 rounded-md flex items-center justify-between hover:bg-white/60 hover:border-[#2d2015]/30 transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2.5 rounded-md ${activePanel.id === 'insurance' ? 'bg-blue-100/60 text-blue-700' : 'bg-green-100/60 text-green-700'}`}>
                        {activePanel.id === 'insurance' ? <Shield size={20} /> : <CreditCard size={20} />}
                      </div>
                      <span className="font-serif text-[19px] font-medium text-[#2d2015]">{item.title}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-[15px] font-semibold text-[#2d2015]/70 group-hover:text-[#2d2015] transition-colors">{item.value}</span>
                      <ChevronRight size={18} className="text-[#2d2015]/40 group-hover:text-[#2d2015]/80" />
                    </div>
                  </div>
                ))}
                
                {/* Action Button */}
                <button className="w-full mt-4 py-4 border-2 border-dashed border-[#2d2015]/20 rounded-md font-serif font-semibold text-[17px] text-[#2d2015]/60 hover:text-[#2d2015] hover:border-[#2d2015]/50 hover:bg-black/5 transition-all outline-none">
                  + Add New {activePanel.id === 'insurance' ? 'Policy' : 'Loan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
