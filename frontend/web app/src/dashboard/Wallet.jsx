export function Wallet() {
  return (
    <div className="absolute top-8 right-12 z-50 group hover:scale-105 transition-transform duration-300">
      
      {/* Wallet Leather Base */}
      <div 
        className="relative w-64 h-36 bg-[#8c5035] rounded-lg shadow-cinematic-lg border border-[#6b3c27]"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.15) 0%, transparent 50%), linear-gradient(135deg, #a06a45 0%, #7d4831 100%)',
        }}
      >
        {/* Leather Stitches */}
        <div className="absolute inset-[4px] border-[1px] border-dashed border-[#e6d0a7] opacity-60 rounded-md"></div>
        
        {/* Credit Card Sticking Out */}
        <div 
          className="absolute -top-6 left-8 w-44 h-24 bg-gradient-to-tr from-gray-900 to-gray-700 rounded-lg shadow-curl -z-10 group-hover:-translate-y-4 transition-transform duration-500 ease-out"
        >
          <div className="absolute top-4 left-4 text-gray-300 font-mono text-xs opacity-70">
            TOTAL BALANCE
          </div>
          <div className="absolute top-8 left-4 text-white font-serif font-bold text-lg tracking-wide">
            ₹ 2,45,000
          </div>
          <div className="absolute bottom-4 right-4 text-yellow-500/80">
            {/* Simulating chip */}
            <div className="w-8 h-6 rounded bg-gradient-to-br from-[#ffd700] to-[#b8860b] border border-[#daa520] opacity-80 shadow-inner"></div>
          </div>
        </div>

        {/* Front flap overlay to sell depth */}
        <div 
          className="absolute bottom-0 w-full h-24 bg-[#7d4831] rounded-b-lg border-t-2 border-[#542d1e] shadow-[0_-2px_10px_rgba(0,0,0,0.4)]"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 20%)',
          }}
        >
           <div className="absolute inset-[4px] border-[1px] border-dashed border-[#e6d0a7] opacity-60 rounded-b-md border-t-0"></div>
           <p className="absolute bottom-4 right-6 font-serif text-[#e6d0a7] font-bold opacity-80 text-sm tracking-widest drop-shadow-md">
             MONAGER
           </p>
        </div>
      </div>
    </div>
  );
}
