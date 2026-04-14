import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CATEGORIES = [
  { id: 'essentials', name: 'Essentials', allocated: 20000, spent: 15000, color: '#1e3a8a' },
  { id: 'lifestyle',  name: 'Lifestyle',  allocated: 15000, spent: 12000, color: '#be123c' },
  { id: 'subs',       name: 'Fixed Subs', allocated: 5000,  spent: 3000,  color: '#4c1d95' },
];

const TRANSACTIONS = [
  { id: 1, name: 'Swiggy Dinner',  amt: '₹450',  date: 'Apr 12' },
  { id: 2, name: 'Amazon Prime',   amt: '₹1499', date: 'Apr 11' },
  { id: 3, name: 'Uber to Office', amt: '₹230',  date: 'Apr 10' }
];

/** SECTION: 1. Huge Monthly Overview */
const HugeMonthlyOverview = ({ month, year, data }) => {
  const label = MONTHS[month] ? `${MONTHS[month]} Budget` : 'April Budget';
  const income = data?.user?.income || 50000;
  let spent = 32400;
  if (data?.binder_sections) {
      spent = data.binder_sections.reduce((acc, sec) => acc + sec.amount_spent, 0);
  }
  const left = income - spent;
  const pct = income > 0 ? (spent / income) * 100 : 0;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col w-full relative mix-blend-multiply z-10 shrink-0"
    >
      <h2 className="text-5xl md:text-6xl font-serif font-bold italic tracking-tighter text-[var(--color-text-main)] border-b-[4px] border-double border-[var(--color-text-main)] w-fit pb-1 mb-6">{label}</h2>
      
      <div className="flex w-full justify-between items-end mb-4 px-2">
        <div>
          <p className="text-xl uppercase tracking-widest font-sans font-bold text-[var(--color-text-muted)] mb-1">Income</p>
          <p className="text-4xl md:text-5xl font-sans font-black tracking-tight text-emerald-950">₹{income.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xl uppercase tracking-widest font-sans font-bold text-[var(--color-text-muted)] mb-1">Spent</p>
          <p className="text-4xl md:text-5xl font-sans font-black tracking-tight text-rose-950">₹{spent.toLocaleString()}</p>
        </div>
      </div>

      {/* Liquid Ink Full Width Bar */}
      <div className="w-full relative mt-2 mb-4">
        <p className="absolute -top-6 right-2 text-xl font-bold font-serif italic text-[var(--color-text-main)]">Left: ₹{left.toLocaleString()}</p>
        
        {/* Empty Trough */}
        <div className="w-full h-10 md:h-12 border-[3px] border-[var(--color-text-muted)] rounded-sm relative overflow-hidden" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(0,0,0,0.05) 15px, rgba(0,0,0,0.05) 30px)' }}>
          {/* Liquid Ink Fill */}
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${pct.toFixed(1)}%` }}
            transition={{ delay: 0.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-blue-900/60 relative overflow-hidden"
          >
             {/* Ink Wave Animation SVG Overlay */}
             <div className="absolute inset-0 w-[200%] h-full opacity-30 mix-blend-overlay flex drop-shadow-md">
                <style>{`
                  @keyframes inkWave {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-ink-wave { animation: inkWave 4s linear infinite; }
                `}</style>
                <div className="animate-ink-wave h-full w-full" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 60%)', backgroundSize: '100px 100%' }} />
             </div>
          </motion.div>
          {/* Stamp Text Overlay */}
          <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
            <p className="text-2xl font-serif font-black italic text-slate-800/90 tracking-widest mix-blend-color-burn">{pct.toFixed(1)}% CONSUMED</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/** SECTION: 2. Massive Category Strokes */
const LargeCategories = ({ data }) => {
  const list = data?.binder_sections && data.binder_sections.length > 0 
      ? data.binder_sections.slice(0, 3).map((s, i) => ({
          id: s.id || i, name: s.category, allocated: s.allocated_budget, spent: s.amount_spent, color: ['#1e3a8a','#be123c','#4c1d95'][i] || '#4c1d95'
      })) 
      : CATEGORIES;

  return (
  <div className="flex flex-col w-full gap-4 mix-blend-multiply z-10 py-6 border-t-[3px] border-dotted border-[var(--color-text-muted)] border-b-[3px] flex-1 min-h-0 relative before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMSkiLz48L3N2Zz4=')] before:-z-10 before:opacity-20">
    <h3 className="text-3xl font-bold font-serif text-[var(--color-text-main)] mb-2 italic">Budget Breakdown</h3>
    
    <div className="flex flex-col justify-around h-full gap-2">
      {list.map((cat, i) => {
        const pct = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
        return (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + (i * 0.15) }}
            className="w-full flex items-center gap-4"
          >
            <div className="w-[30%]">
              <p className="text-2xl font-serif font-bold text-[var(--color-text-main)] leading-tight">{cat.name}</p>
            </div>
            
            <div className="flex-1 h-6 relative">
              {/* Massive Marker Stroke Line */}
              <div className="absolute inset-0 border-b-[3px] border-[var(--color-text-muted)] opacity-30 top-3" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.8 + (i * 0.15), duration: 1.2, type: 'spring' }}
                className="h-full relative opacity-70"
                style={{ backgroundColor: cat.color, borderRadius: '3px 8px 2px 6px', filter: 'url(#marker-texture)' }}
              />
            </div>
            
            <div className="w-[25%] text-right flex flex-col justify-center">
              <p className="text-2xl md:text-3xl font-sans font-bold text-[var(--color-text-main)] italic leading-none">₹{cat.spent}</p>
              <p className="text-sm font-sans text-slate-600 font-bold opacity-80 mt-1">of {cat.allocated}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
)};


/** SECTION: 3. Handwritten Ruled Transactions */
const RuledTransactionsList = ({ txns }) => {
  const list = txns && txns.length > 0
    ? txns.map((t, i) => ({ id: t.id || i, name: t.merchant, amt: `₹${t.amount}`, date: new Date(t.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) }))
    : TRANSACTIONS;

  return (
  <div className="flex flex-col w-full relative pt-4 pb-2 z-10 shrink-0 h-[22%]">
    {/* Ruled Paper Background Lines */}
    <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, rgba(148, 163, 184, 0.4) 35px, rgba(148, 163, 184, 0.4) 36px)', backgroundPositionY: '2px' }} />
    
    <div className="mb-2">
      <h3 className="text-2xl font-bold font-serif text-[var(--color-text-main)] inline-block mix-blend-multiply border-b-[3px] border-[var(--color-text-main)] pb-1 italic px-1">Recent Entries</h3>
    </div>

    <div className="flex flex-col h-full justify-between mt-2">
      {list.map((txn, i) => (
        <motion.div 
          key={txn.id}
          initial={{ opacity: 0, rotate: -2, y: 10 }}
          animate={{ opacity: 1, rotate: 0, y: 0 }}
          transition={{ delay: 1.0 + (i * 0.1) }}
          className="flex justify-between items-end w-full h-[36px] px-4 mix-blend-multiply text-[var(--color-text-main)]"
          style={{ fontFamily: '"Caveat", "Patrick Hand", cursive' }}
        >
          <span className="text-2xl md:text-3xl tracking-wide">{txn.date} <span className="opacity-40 italic mx-2">|</span> <span className="font-bold">{txn.name}</span></span>
          <span className="text-2xl md:text-3xl font-bold border-b-2 border-dotted border-slate-500 pb-[2px]">{txn.amt}</span>
        </motion.div>
      ))}
    </div>
  </div>
)};


export default function LeftPageUI({ isOpen, month, year }) {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [txn, setTxn] = useState([]);

  useEffect(() => {
      if (currentUser?.uid && isOpen) {
          fetchApi(`/binder/${currentUser.uid}`).then(setData).catch(console.error);
          fetchApi(`/transactions/${currentUser.uid}`).then(res => setTxn(res?.transactions?.slice(0, 3) || [])).catch(console.error);
      }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full p-10 pr-14 flex flex-col justify-between overflow-hidden relative" style={{ gap: '1rem' }}>
      <HugeMonthlyOverview month={month} year={year} data={data} />
      <LargeCategories data={data} />
      <RuledTransactionsList txns={txn} />
    </div>
  );
}
