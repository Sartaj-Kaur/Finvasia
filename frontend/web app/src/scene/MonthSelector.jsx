import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function MonthSelector({ month, year, earliestMonth, earliestYear, onChange }) {
  const now = new Date();
  const latest = { month: now.getMonth(), year: now.getFullYear() };

  // Cannot go back past account creation month
  const isAtEarliest = year < earliestYear || (year === earliestYear && month <= earliestMonth);
  // Cannot go forward past current month
  const isAtLatest   = year > latest.year  || (year === latest.year  && month >= latest.month);


  const go = (dir) => {
    let m = month + dir;
    let y = year;
    if (m < 0)  { m = 11; y -= 1; }
    if (m > 11) { m = 0;  y += 1; }
    onChange(m, y);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', userSelect: 'none' }}>

      {/* Back */}
      <button
        disabled={isAtEarliest}
        onClick={() => go(-1)}
        style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          border: isAtEarliest ? '1.5px solid rgba(140,96,48,0.2)' : '1.5px solid rgba(140,96,48,0.6)',
          background: 'transparent',
          color: isAtEarliest ? 'rgba(107,64,32,0.25)' : '#6b4020',
          cursor: isAtEarliest ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.18 }}
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#4a2c10',
            textShadow: '0 1px 2px rgba(255,220,150,0.4)',
            minWidth: '160px',
            textAlign: 'center',
            display: 'block',
          }}
        >
          {MONTHS[month]} {year}
        </motion.span>
      </AnimatePresence>

      {/* Forward */}
      <button
        disabled={isAtLatest}
        onClick={() => go(1)}
        style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          border: isAtLatest ? '1.5px solid rgba(140,96,48,0.2)' : '1.5px solid rgba(140,96,48,0.6)',
          background: 'transparent',
          color: isAtLatest ? 'rgba(107,64,32,0.25)' : '#6b4020',
          cursor: isAtLatest ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
