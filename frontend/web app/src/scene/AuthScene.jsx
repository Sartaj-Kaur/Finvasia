import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ShieldCheck } from 'lucide-react';
import woodImg from '../assets/wood_desk.png';
import paperImg from '../assets/paper.jpg';

export function AuthScene() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError('Failed to physically verify credentials. Check Firebase Configuration keys in .env.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#1c1815]">
      {/* Background Environment - Physical Wood Desk matching the Dashboard context */}
      <div 
        className="absolute inset-0 z-0 bg-[#1c1815]"
        style={{
          backgroundImage: `url(${woodImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(50%) sepia(20%) contrast(120%)'
        }}
      />
      
      {/* Deep cinematic vignette driving focus entirely to the document */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-0 pointer-events-none" />

      {/* Secured Document Wrapper */}
      <motion.div 
        initial={{ y: 40, opacity: 0, rotateX: 5 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative z-10 w-[90%] max-w-[440px] rounded shadow-[0_30px_60px_rgba(0,0,0,0.8),0_15px_20px_rgba(0,0,0,0.6)] p-[2px] bg-gradient-to-br from-white/10 to-transparent"
        style={{ perspective: 1000 }}
      >
        {/* Physical Paper Document Canvas */}
        <div className="w-full bg-[#f4e6d4] relative overflow-hidden flex flex-col p-12 md:p-14 shadow-[inset_0_0_40px_rgba(100,60,20,0.2)] rounded-sm">
           {/* Direct Texture Injection */}
           <div 
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-55" 
              style={{ backgroundImage: `url(${paperImg})`, backgroundSize: '200px auto', backgroundPosition: 'center' }} 
            />
            {/* Edge Age Shading */}
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(80,50,20,0.4)] pointer-events-none mix-blend-multiply" />

            {/* Core Interaction Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
               
               {/* Monogram Stamp Visual */}
               <div className="w-[60px] h-[60px] border-[2px] border-[#2b1f1a] rounded-sm flex items-center justify-center transform rotate-2 mb-8 shadow-sm mix-blend-multiply opacity-85">
                  <div className="w-full h-full border border-dashed border-[#2b1f1a]/40 m-[2px] flex items-center justify-center">
                     <span className="font-serif text-[32px] font-bold text-[#2b1f1a] -translate-y-[1px]">F</span>
                  </div>
               </div>

               <h1 className="font-serif text-[36px] font-bold text-[#2b1f1a] tracking-tight leading-none mb-3 drop-shadow-sm">
                 Finvasia
               </h1>
               <p className="font-mono text-[#4a3b2c] tracking-[0.2em] text-[10px] uppercase mb-12 opacity-80 border-b-[1.5px] border-[#2b1f1a]/30 pb-4 inline-block px-4 font-semibold uppercase">
                 Identity Verification
               </p>

               {error && (
                 <div className="w-full bg-[#8b0000]/10 border-l-[3px] border-[#8b0000]/60 text-[#8b0000] font-serif text-[13px] font-medium p-4 mb-8 text-left mix-blend-multiply">
                    <span className="font-bold mr-1">Error:</span>{error}
                 </div>
               )}

               {/* Physical Stamped Button */}
               <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-[#1c120c] hover:bg-[#110a06] relative text-[#e6d0a7] font-semibold text-[15px] font-serif py-[18px] px-6 transition-all duration-300 flex items-center justify-center space-x-4 shadow-[0_10px_20px_rgba(0,0,0,0.4)] disabled:opacity-50 group border border-[#1c120c]"
               >
                  {/* Subtle inner gold foil line matching Wallet aesthetics */}
                  <div className="absolute inset-[3px] border border-[#d4af37]/20 pointer-events-none group-hover:border-[#d4af37]/40 transition-colors" />
                  
                  {loading ? (
                    <span className="animate-pulse tracking-wide font-mono text-[12px] uppercase">Authorizing Signature...</span>
                  ) : (
                    <>
                      <div className="bg-white p-1 rounded-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <span className="tracking-wide text-[16px] drop-shadow-sm">Sign Document via Google</span>
                    </>
                  )}
               </button>

               <div className="mt-10 flex items-center space-x-2 text-[#4a3b2c]/70 justify-center mix-blend-multiply">
                  <ShieldCheck size={14} />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Encrypted Firebase Handshake</span>
               </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
