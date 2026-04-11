export function SavingsCard() {
  const boxes = Array.from({ length: 25 }, (_, i) => ({
    val: (i + 1) * 10,
    crossed: Math.random() > 0.6,
    offset: `translate-x-[${Math.random() * 4 - 2}px] translate-y-[${Math.random() * 4 - 2}px] rotate-[${Math.random() * 6 - 3}deg]`,
  }));

  return (
    <div className="relative rotate-[-1deg] shadow-cinematic-lg group border-t border-white/50">
      {/* 3D Push Pins */}
      <div 
        className="absolute -top-3 left-[20%] w-5 h-5 rounded-full z-20"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fde047 0%, #ca8a04 60%, #854d0e 100%)',
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 3px 5px 8px rgba(0,0,0,0.5), 5px 12px 15px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute top-[2px] left-[2px] w-2 h-2 bg-white/60 rounded-full blur-[1px]"></div>
      </div>
      <div 
        className="absolute -top-3 right-[25%] w-5 h-5 rounded-full z-20"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #2563eb 60%, #1e3a8a 100%)',
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 3px 5px 8px rgba(0,0,0,0.5), 5px 12px 15px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute top-[2px] left-[2px] w-2 h-2 bg-white/60 rounded-full blur-[1px]"></div>
      </div>

      {/* Main Card Body */}
      <div className="w-72 bg-[#f5e6d3] p-6 relative bg-noise pb-4">
        <h2 className="font-serif text-2xl text-center text-gray-800 mb-4 tracking-tight drop-shadow-sm">
          Savings Challenge
        </h2>

        {/* Hand-drawn grid */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {boxes.map((box, i) => (
            <div 
              key={i} 
              className={`w-9 h-9 border border-gray-400/70 flex items-center justify-center text-sm font-hand ${box.offset} ${box.crossed ? 'text-gray-400' : 'text-gray-800'}`}
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              <span className="relative">
                {box.val}
                {box.crossed && (
                  <span className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-red-500/70 rotate-[-15deg] shadow-sm"></span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-700 font-semibold mb-1">
            <span>Progress</span>
            <span>15 / 50 Days</span>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden shadow-inner flex">
            <div className="bg-green-500 w-[30%] h-full rounded-r-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="font-hand text-xl text-gray-800 drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>
            Saved: ₹1,750
          </p>
        </div>
      </div>

      {/* Actual SVG Torn Edge (subpixel perfect, matches bg) */}
      <svg 
        className="w-full h-4 block absolute top-100 left-0 drop-shadow-sm" 
        viewBox="0 0 100 10" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0 L100,0 L100,2 L95,6 L88,1 L82,5 L75,2 L68,7 L62,3 L55,8 L48,2 L42,6 L35,1 L28,5 L22,2 L15,8 L8,4 L0,7 Z" 
          fill="#f5e6d3" 
        />
      </svg>
    </div>
  );
}
