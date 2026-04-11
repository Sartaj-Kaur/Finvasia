import React, { useState, useMemo } from 'react';

// Generates an array of cells simulating a savings challenge
const generateInitialCells = () => {
  const allowedValues = [100, 200, 500, 1000];
  const cells = [];
  
  // Generating a 10x10 board (100 cells)
  for (let i = 0; i < 100; i++) {
    cells.push({
      id: i,
      value: allowedValues[Math.floor(Math.random() * allowedValues.length)],
      completed: false
    });
  }
  return cells;
};

export default function SavingsBoardUI() {
  const [cells, setCells] = React.useState(generateInitialCells);

  // Force reset if Vite's Hot Module Reloading cached the previously huge 250-cell array
  React.useEffect(() => {
    if (cells.length !== 100) {
      setCells(generateInitialCells());
    }
  }, [cells.length]);

  // Toggle completion state of a cell
  const toggleCell = (id) => {
    setCells(cells.map(cell => 
      cell.id === id ? { ...cell, completed: !cell.completed } : cell
    ));
  };

  // Use fixed target rather than re-computing constantly since we built it to hit exactly 100,000
  const totalTarget = 100000;
  const savedAmount = useMemo(() => cells.filter(c => c.completed).reduce((sum, cell) => sum + cell.value, 0), [cells]);
  const progressPercent = Math.max(0, Math.min(100, (savedAmount / totalTarget) * 100));

  return (
    <div className="w-[380px] xl:w-[480px] font-sans rotate-[-1deg] shadow-cinematic-lg group">
      
      {/* 
        PREMIUM WOOD/GOLD FRAME
        Outer layout creates the physical bounds of the object. 
        Skeuomorphic touches using heavy shadows and inset border coloring.
      */}
      <div 
        className="relative bg-[#3b2a1a] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.7)] border-[10px] border-t-[#8B5A2B] border-l-[#8B5A2B] border-b-[#5C3A18] border-r-[#5C3A18]"
        style={{
          boxShadow: 'inset 0 0 24px rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Deep inset shadow to simulate depth from the wooden frame to the board */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_12px_30px_rgba(0,0,0,0.9)] z-10" />

        {/* ── HEADER SECTION ── */}
        <div className="bg-gradient-to-b from-[#2a1d11] to-[#24170d] px-4 py-3 border-b-2 border-[#150e08] relative z-20 shadow-md">
          <h2 
            className="text-lg xl:text-xl font-serif text-[#d4af37] text-center tracking-widest uppercase mb-3" 
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9), 0 0 6px rgba(212,175,55,0.2)' }}
          >
            Savings Challenge
          </h2>
          
          <div className="flex justify-between items-center px-2 xl:px-8">
            <div className="text-center bg-[#1a110a] px-3 py-1 rounded border border-[#3b2a1a] shadow-inner">
              <p className="text-[#a89068] text-[0.55rem] xl:text-[0.6rem] uppercase tracking-widest font-semibold mb-[1px]">Target Goal</p>
              <p className="text-[#f5d087] text-sm xl:text-base font-mono font-bold drop-shadow-md">₹{totalTarget.toLocaleString()}</p>
            </div>
            
            <div className="text-center bg-[#1a110a] px-3 py-1 rounded border border-[#2e4233] shadow-inner">
              <p className="text-[#a89068] text-[0.55rem] xl:text-[0.6rem] uppercase tracking-widest font-semibold mb-[1px]">Total Saved</p>
              <p className="text-[#4ade80] text-sm xl:text-base font-mono font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
                ₹{savedAmount.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Progress Bar with engraved aesthetic */}
          <div className="mt-4 mb-1 h-2.5 bg-[#100a06] rounded-full overflow-hidden border border-[#3b2a1a] relative shadow-inner mx-4 xl:mx-10">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8B5A2B] via-[#d4af37] to-[#f5d087] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── SAVINGS GRID ── */}
        <div className="px-3 py-2 xl:px-5 xl:py-3 bg-[#2d1e11] relative z-20">
          <div className="grid grid-cols-10 gap-1 xl:gap-2">
            {cells.map(cell => (
              <button
                key={cell.id}
                onClick={() => toggleCell(cell.id)}
                className={`
                  relative group flex items-center justify-center 
                  aspect-[3/2] rounded-[4px] shadow-sm transition-all duration-300 ease-out
                  ${cell.completed 
                    ? 'bg-[#1b2f1e] border border-[#2e5233] scale-[0.96] opacity-90' 
                    : 'bg-gradient-to-br from-[#4a3622] to-[#3b2a1a] border border-[#6b4e31] hover:bg-gradient-to-br hover:from-[#5c432a] hover:to-[#4a3622] hover:-translate-y-px hover:shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:border-[#8b6845]'
                  }
                `}
                style={{
                  boxShadow: cell.completed 
                    ? 'inset 0 4px 6px rgba(0,0,0,0.8)' 
                    : '2px 2px 4px rgba(0,0,0,0.5), inset 1px 1px 1px rgba(255,255,255,0.05)'
                }}
              >
                {/* Physical-feeling checkmark overlay */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ease-spring ${cell.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                >
                  <svg 
                    className="w-5 h-5 xl:w-6 xl:h-6 text-[#4ade80] opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Amount text */}
                <span 
                  className={`
                    font-mono font-bold text-xs xl:text-sm transition-all duration-300 z-10
                    ${cell.completed ? 'opacity-20 text-[#4ade80] line-through decoration-2 decoration-[#4ade80]' : 'text-[#f5d087] drop-shadow-[1px_2px_2px_rgba(0,0,0,1)]'}
                  `}
                >
                  {cell.value >= 1000 ? `${cell.value/1000}k` : cell.value}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Inner bottom lip for frame realism */}
        <div className="h-6 bg-gradient-to-b from-[#1a110a] to-[#24170d] relative z-20 border-t border-[#0a0704]" />
      </div>

    </div>
  );
}
