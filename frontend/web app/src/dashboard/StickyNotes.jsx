export function StickyNotes() {
  return (
    <div className="relative" style={{ width: 'clamp(140px, 12vw, 192px)', height: 'clamp(180px, 16vw, 256px)' }}>
      {/* Pink Note */}
      <div 
        className="absolute top-0 right-8 w-32 h-32 bg-[#ffcbf2] p-4 rotate-[-4deg] border-t border-white/50 bg-noise"
        style={{
          boxShadow: '1px 2px 3px rgba(0,0,0,0.1), inset -2px -2px 10px rgba(0,0,0,0.05)',
          borderBottomRightRadius: '30px 4px',
        }}
      >
        {/* Curled shadow illusion */}
        <div className="absolute bottom-0 right-0 w-[50%] h-4 shadow-curl rotate-3 -z-10 bg-transparent rounded-full opacity-80 blur-[2px]"></div>
        <p className="text-gray-800 text-xl font-bold leading-tight drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>
          Almost there!
        </p>
      </div>

      {/* Yellow Note */}
      <div 
        className="absolute top-20 right-0 w-36 h-36 p-4 rotate-[6deg] border-t border-white/50 bg-noise"
        style={{
          backgroundColor: '#ffef9e',
          boxShadow: '2px 4px 6px rgba(0,0,0,0.15), inset -3px -3px 15px rgba(0,0,0,0.05)',
          borderBottomRightRadius: '35px 5px',
        }}
      >
        <div className="absolute bottom-1 right-0 w-[60%] h-4 shadow-curl rotate-[4deg] -z-10 bg-transparent rounded-full opacity-90 blur-[2px]"></div>
        <p className="text-gray-800 text-xl font-bold leading-snug drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>
          Costly coffee run again? ☕
        </p>
      </div>
    </div>
  );
}
