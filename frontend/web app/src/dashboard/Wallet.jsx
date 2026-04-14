import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Plus, QrCode, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import leatherImg from '../assets/leather.jpg';

export function Wallet() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(24500);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
        fetchApi(`/binder/${currentUser.uid}`)
            .then(data => { if (data.user?.income) setBalance(data.user.income); })
            .catch(console.error);

        fetchApi(`/transactions/${currentUser.uid}`)
            .then(data => { if (data.transactions) setTransactions(data.transactions.slice(0, 5)); })
            .catch(console.error);
    }
  }, [currentUser]);

  return (
    <>
      {/* trigger - The original wallet lying on the desk */}
      <div
        className="relative z-50 group hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Wallet Leather Base */}
        <div
          className="relative w-80 h-44 bg-[#8c5035] rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-[#6b3c27]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${leatherImg})`,
            backgroundSize: '150px auto'
          }}
        >
          {/* ── CARD 3 (Back) ── */}
          <div
            className="absolute top-[28px] left-[40px] w-56 h-24 bg-gradient-to-tr from-slate-400 to-slate-200 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.6)] z-[2] group-hover:-translate-y-[28px] group-hover:-translate-x-[8px] group-hover:-rotate-3 transition-all duration-500 ease-out"
          >
            <div className="absolute top-4 left-4 text-slate-600 font-mono text-[10px] opacity-80 font-bold">
              SAVINGS ACC
            </div>
            <div className="absolute top-8 left-4 text-slate-800 font-serif font-bold text-md tracking-wide">
              ₹12,400
            </div>
          </div>

          {/* ── CARD 2 (Middle) ── */}
          <div
            className="absolute top-[32px] left-[48px] w-56 h-24 bg-gradient-to-tr from-[#1e3a5f] to-[#111f36] rounded-lg shadow-[0_6px_15px_rgba(0,0,0,0.6)] z-[3] group-hover:-translate-y-[44px] group-hover:translate-x-[4px] group-hover:rotate-1 transition-all duration-500 ease-out"
          >
            <div className="absolute top-4 left-4 text-blue-200 font-mono text-[10px] opacity-70">
              CREDIT CARD
            </div>
            <div className="absolute top-8 left-4 text-white font-serif font-bold text-md tracking-wide">
              •••• 4281
            </div>
          </div>

          {/* ── CARD 1 (Front/Main) ── */}
          <div
            className="absolute top-[36px] left-[56px] w-56 h-24 bg-gradient-to-tr from-gray-900 to-gray-700 rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.5)] z-[4] group-hover:-translate-y-[62px] transition-all duration-500 ease-out"
          >
            <div className="absolute top-4 left-4 text-gray-300 font-mono text-[10px] opacity-70">
              TOTAL BALANCE
            </div>
            <div className="absolute top-8 left-4 text-white font-serif font-bold text-lg tracking-wide">
              ₹{balance.toLocaleString()}
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="w-8 h-6 rounded bg-gradient-to-br from-[#ffd700] to-[#b8860b] border border-[#daa520] opacity-80 shadow-inner"></div>
            </div>
          </div>

          {/* Front flap overlay (The Pocket) */}
          <div
            className="absolute bottom-0 w-full h-[120px] bg-[#7d4831] rounded-b-lg border-t-[2px] border-[#3b1c0e] shadow-[0_-4px_15px_rgba(0,0,0,0.5)] overflow-hidden z-[6]"
          >
            {/* Pocket stitching at the very top edge */}
            <div className="absolute top-[2px] inset-x-0 h-[1px] border-b-[1.5px] border-dashed border-[#d4af37] opacity-50 z-10"></div>
            <div className="absolute inset-0 mix-blend-multiply opacity-80" style={{ backgroundImage: `url(${leatherImg})`, backgroundSize: '150px auto' }} />
            <div className="absolute inset-[4px] border-[1.5px] border-dashed border-[#d4af37] opacity-60 rounded-b-[6px] border-t-0 z-10"></div>
            <p className="absolute bottom-4 right-6 font-serif text-[#d4af37] font-bold opacity-90 text-sm tracking-widest drop-shadow-md z-10">
              {currentUser?.displayName || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN WALLET OVERLAY PORTALED TO BODY TO ESCAPE 3D CONTEXTS */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0a0604] pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsOpen(false)} // Tap outside to close
            >
              {/* Extended Bifold Wallet / Diary Container */}
              <motion.div
                className="relative w-[95%] md:w-[840px] h-[85%] md:h-[600px] max-h-[850px] rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.05)] overflow-hidden"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when tapping inside
              >
                {/* Premium Leather Texture Background spanning both pages */}
                <div
                  className="absolute inset-0 bg-[#3a2214]"
                  style={{
                    backgroundImage: `url(${leatherImg})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: 'brightness(95%) contrast(110%) sepia(20%)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/80 pointer-events-none mix-blend-multiply" />
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.7)] pointer-events-none" />

                {/* Central Skeleton / Diary Spine */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[60px] -ml-[30px] bg-gradient-to-r from-transparent via-[#000000]/60 to-transparent pointer-events-none" />
                <div className="hidden md:block absolute top-[12px] bottom-[12px] left-1/2 w-[2px] -ml-[1px] bg-black/80 pointer-events-none shadow-[1px_0_2px_rgba(255,255,255,0.1)]" />

                {/* Perimeter Stitched Border */}
                <div className="absolute inset-[10px] pointer-events-none rounded-[6px] overflow-hidden">
                  <div className="w-full h-full border-[2px] border-dashed border-[#d4af37]/60 rounded-[6px] mix-blend-color-dodge opacity-80" style={{ borderDasharray: '6 4' }} />
                </div>

                {/* Foreground Content - Split Bifold Structure */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row text-white overflow-hidden pb-4 md:pb-0">

                  {/* --- LEFT PAGE --- */}
                  <div className="flex-1 flex flex-col p-8 md:p-10 md:pr-14 overflow-hidden z-10 relative">

                    {/* HEADER - PROFILE */}
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6721] flex items-center justify-center p-[2px] shadow-lg">
                          <div className="w-full h-full rounded-full bg-[#1a0f08] flex items-center justify-center border-2 border-transparent">
                            <span className="text-[22px] font-bold font-serif text-[#d4af37] drop-shadow-sm">J</span>
                          </div>
                        </div>
                        {/* Identifiers */}
                        <div className="flex flex-col">
                          <h2 className="text-[20px] font-bold tracking-wide drop-shadow-sm">Jaskaran</h2>
                          <span className="text-[13px] font-semibold text-[#d4af37]/80 tracking-wider uppercase">Premium User</span>
                        </div>
                      </div>
                      {/* Mobile Close Button */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-colors shadow-sm"
                      >
                        <X size={20} className="text-white/90" />
                      </button>
                    </div>

                    {/* BALANCE SECTION */}
                    <div className="mb-10">
                      <h3 className="text-white/60 text-[13px] font-bold mb-1 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Total Balance</h3>
                      <div className="font-serif text-[48px] leading-tight font-bold tracking-tight drop-shadow-md mt-4">
                        ₹{balance.toLocaleString()}
                      </div>
                      <div className="mt-2 text-green-400 text-[15px] font-semibold tracking-wide flex items-center drop-shadow-sm">
                        +₹4,200 this month
                      </div>
                    </div>

                    {/* CARDS SECTION */}
                    <div className="space-y-4 relative mt-auto pb-4">
                      <div className="absolute -inset-4 bg-white/5 rounded-2xl blur-xl z-[-1]" />
                      <div className="w-full bg-gradient-to-br from-[#1f2937]/90 to-[#111827]/90 backdrop-blur-md rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/15 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex justify-between items-start mb-8">
                          {/* EMV Chip */}
                          <div className="w-[42px] h-[30px] rounded-[4px] bg-gradient-to-br from-[#e6d0a7] to-[#a6864d] shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 border-[0.5px] border-black/20" />
                            <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-black/20" />
                            <div className="absolute top-0 left-1/3 w-[0.5px] h-full bg-black/20" />
                          </div>
                          <span className="font-serif italic font-bold text-[18px] opacity-80 tracking-wider">Monager</span>
                        </div>

                        <div className="text-[20px] tracking-[0.15em] font-mono mb-5 text-white/95 drop-shadow-sm">
                          **** **** **** 4291
                        </div>

                        <div className="flex items-center justify-between text-[13px] text-white/50 font-medium tracking-widest uppercase">
                          <span className="text-white/80 drop-shadow-sm">Jaskaran</span>
                          <span>12/28</span>
                        </div>
                      </div>
                    </div>

                    {/* SIGN OUT ACTION */}
                    <button
                      onClick={() => signOut(auth)}
                      className="flex items-center space-x-2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors mt-4 text-[13px] font-semibold uppercase tracking-widest group"
                    >
                      <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  {/* --- RIGHT PAGE --- */}
                  <div className="flex-1 flex flex-col p-8 md:p-10 md:pl-14 overflow-hidden z-10 border-t md:border-t-0 border-black/30 relative">

                    {/* Desktop Close Button (Top Right corner of diary) */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="hidden md:flex absolute top-8 right-8 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.4)] z-50 text-[#d4af37]"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>

                    {/* QUICK ACTIONS ROW */}
                    <div className="grid grid-cols-3 gap-4 mb-12 mt-2 md:mt-16">
                      {[
                        { label: 'Send', icon: <ArrowUpRight size={22} /> },
                        { label: 'Add Money', icon: <Plus size={22} /> },
                        { label: 'Pay', icon: <QrCode size={22} /> }
                      ].map(action => (
                        <button key={action.label} className="flex flex-col items-center justify-center py-5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-xl border border-white/5 transition-colors shadow-lg group">
                          <div className="bg-[#cc9f53] text-[#2d1b0f] p-3 rounded-full mb-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_5px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                            {action.icon}
                          </div>
                          <span className="text-[13px] font-semibold tracking-wide text-[#e6d0a7]">{action.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* TRANSACTIONS LIST */}
                    <div className="flex-1">
                      <h3 className="text-[#e6d0a7]/60 text-[13px] font-bold mb-5 uppercase tracking-widest border-b border-black/30 pb-2 inline-block">Recent Ledger</h3>
                      <div className="space-y-3">
                        {transactions.length > 0 ? transactions.map((tx, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-black/10 hover:bg-black/20 backdrop-blur-sm rounded-xl border border-white/[0.03] transition-colors cursor-pointer group">
                            <div className="flex items-center space-x-4">
                              <div className="w-[42px] h-[42px] rounded-lg bg-black/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform border border-white/[0.02]">
                                {tx.category === 'food' ? '🍔' : '🛍️'}
                              </div>
                              <span className="font-medium text-[15px] text-white/90 tracking-wide">{tx.merchant}</span>
                            </div>
                            <span className={`font-semibold text-[16px] tracking-wide drop-shadow-sm text-white/90`}>
                              -₹{Math.abs(tx.amount).toLocaleString()}
                            </span>
                          </div>
                        )) : [
                          { title: 'Starbucks Coffee', amount: '-₹350', emoji: '☕' },
                          { title: 'Amazon Shopping', amount: '-₹4,200', emoji: '🛍️' },
                          { title: 'Dividends', amount: '+₹1,500', emoji: '📈', positive: true },
                          { title: 'Monager Cloud', amount: '-₹1,200', emoji: '☁️' }
                        ].map((tx, i) => (
                          <div key={`mock-${i}`} className="flex items-center justify-between p-4 bg-black/10 hover:bg-black/20 backdrop-blur-sm rounded-xl border border-white/[0.03] transition-colors cursor-pointer group">
                            <div className="flex items-center space-x-4">
                              <div className="w-[42px] h-[42px] rounded-lg bg-black/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform border border-white/[0.02]">
                                {tx.emoji}
                              </div>
                              <span className="font-medium text-[15px] text-white/90 tracking-wide">{tx.title}</span>
                            </div>
                            <span className={`font-semibold text-[16px] tracking-wide drop-shadow-sm ${tx.positive ? 'text-green-400' : 'text-white/90'}`}>
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
