export function LetterCard() {
  return (
    <div className="relative rotate-[2deg] shadow-cinematic-lg group border-t border-white/50">
      {/* 3D Red Push Pin */}
      <div 
        className="absolute -top-3 left-[50%] -translate-x-1/2 w-5 h-5 rounded-full z-20"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fca5a5 0%, #dc2626 60%, #7f1d1d 100%)',
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 3px 5px 8px rgba(0,0,0,0.5), 5px 12px 15px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute top-[2px] left-[2px] w-2 h-2 bg-white/60 rounded-full blur-[1px]"></div>
      </div>

      {/* Main Letter Card */}
      <div className="relative w-64 bg-[#fffdf0] p-6 bg-noise">
        {/* Folded Corner Dog-ear (Top Right) */}
        <div 
          className="absolute top-0 right-0 w-8 h-8 bg-[#e6e2cd] shadow-[-2px_2px_4px_rgba(0,0,0,0.2)] z-10"
          style={{
            background: 'linear-gradient(225deg, transparent 50%, #d4cfb4 50%)',
          }}
        ></div>
        {/* The cut behind the fold to show desk */}
        <div 
          className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
          style={{
            background: 'linear-gradient(225deg, transparent 50%, #fffdf0 50%)',
            mixBlendMode: 'destination-out'
          }}
        ></div>

        <h3 className="font-serif text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
          A Letter from Future You
        </h3>
        
        <p className="text-gray-700 leading-relaxed text-xl" style={{ fontFamily: "'Caveat', cursive" }}>
          Hey! Just writing to say I am incredibly proud of the choices you are making today. 
          Those tiny sacrifices? They totally paid off. Keep going, the view from here is amazing!
        </p>
        
        <div className="mt-4 text-right">
          <span className="text-gray-800 text-2xl font-bold" style={{ fontFamily: "'Caveat', cursive" }}>- You</span>
        </div>
      </div>
    </div>
  );
}
