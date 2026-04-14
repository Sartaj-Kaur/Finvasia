import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '../api';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const INK = '#1a0f08';
const INK_DIM = 'rgba(26,15,8,0.55)';
const INK_FAINT = 'rgba(26,15,8,0.25)';
const ACCENT = '#8b1a1a';
const GREEN = '#1a4a1a';
const CAT_COLORS = ['#1a3a6a','#6a1a2a','#2a1a5a','#1a4a2a','#5a3a1a','#1a2a5a'];

/* ── SVG Hand-drawn Donut Chart ── */
const InkDonut = ({ data, total }) => {
  let acc = 0;
  return (
    <svg viewBox="0 0 100 100" style={{ width: '130px', height: '130px', transform: 'rotate(-90deg)', overflow: 'visible' }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={INK_FAINT} strokeWidth="10" />
      {data.length > 0 ? data.map((d, i) => {
        const strokeDasharray = `${(d.amount_spent / Math.max(total, 1)) * 251.2} 251.2`;
        const strokeDashoffset = -acc * 251.2;
        acc += (d.amount_spent / total);
        return (
          <motion.circle
            key={i} cx="50" cy="50" r="40" fill="none"
            stroke={CAT_COLORS[i % CAT_COLORS.length]} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
            style={{ opacity: 0.85 }}
          />
        );
      }) : null}
      {/* Hand-drawn sketchy lines over the donut */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="5 2" opacity="0.2" />
    </svg>
  );
};

export default function LeftPageUI({ isOpen, month, year, userId }) {
  const [data, setData] = useState(null);
  const [txn, setTxn] = useState([]);

  useEffect(() => {
    if (!userId || !isOpen) return;
    fetchApi(`/binder/${userId}`)
      .then(res => setData(res))
      .catch(err => console.error('LeftPage binder error:', err));
    fetchApi(`/transactions/${userId}`)
      .then(res => setTxn(Array.isArray(res?.transactions) ? res.transactions.slice(0, 4) : []))
      .catch(err => console.error('LeftPage txn error:', err));
  }, [userId, isOpen]);

  if (!isOpen) return null;

  const income = Number(data?.user?.income || 0);
  const sections = Array.isArray(data?.binder_sections) ? data.binder_sections : [];
  const totalSpent = sections.reduce((a, s) => a + Number(s.amount_spent || 0), 0);
  const remaining = Math.max(0, income - totalSpent);
  const pct = income > 0 ? Math.min(100, (totalSpent / income) * 100) : 0;
  const barColor = pct > 85 ? ACCENT : pct > 60 ? '#7a5a00' : GREEN;
  const monthLabel = MONTHS[month] || 'April';

  // Ensure sections with spend are sorted
  const sortedSections = [...sections].filter(s => s.amount_spent > 0).sort((a,b) => b.amount_spent - a.amount_spent);

  const root = {
    width: '100%', height: '100%',
    backgroundColor: 'transparent',
    display: 'flex', flexDirection: 'column',
    padding: '36px 44px 28px 36px',
    gap: '18px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    pointerEvents: 'none'
  };

  const label = (txt) => ({
    margin: 0, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '2.5px', color: INK_DIM, fontFamily: 'sans-serif',
  });

  return (
    <div style={root}>

      {/* ── Title ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ borderBottom: `3px double ${INK}`, paddingBottom: '8px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '42px', fontWeight: 900, fontStyle: 'italic', color: INK, letterSpacing: '-1px', lineHeight: 1 }}>
            {monthLabel} {year}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: INK_DIM, fontStyle: 'normal', fontFamily: 'sans-serif', fontWeight: 600 }}>
            Budget Ledger
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={label('remaining')}>Cashflow Available</p>
          <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
            style={{ margin: '2px 0 0', fontSize: '32px', fontWeight: 900, color: INK, fontFamily: 'sans-serif', lineHeight: 1 }}>
            ₹{Math.round(remaining).toLocaleString('en-IN')}
          </motion.p>
        </div>
      </motion.div>

      {/* ── Visual Ink Donut Chart & Legend ── */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginTop: '10px' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, type: 'spring' }}
          style={{ width: '130px', flexShrink: 0, position: 'relative' }}>
          <InkDonut data={sortedSections.slice(0, 4)} total={totalSpent} />
          {/* Center text for donut */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transform: 'rotate(0deg)' }}>
            <span style={{ fontSize: '10px', color: INK_DIM, fontWeight: 700, fontFamily: 'sans-serif' }}>SPENT</span>
            <span style={{ fontSize: '18px', color: INK, fontWeight: 900, fontFamily: 'sans-serif' }}>
              {pct.toFixed(0)}%
            </span>
          </div>
        </motion.div>

        {/* Legend */}
        <div style={{ flex: 1, borderLeft: `1.5px dashed ${INK_FAINT}`, paddingLeft: '20px' }}>
          <p style={{ ...label('top drivers'), marginBottom: '10px' }}>Top Expense Drivers</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedSections.length > 0 ? sortedSections.slice(0, 4).map((sec, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i*0.1 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: INK, textTransform: 'capitalize', fontStyle: 'italic' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: CAT_COLORS[i % CAT_COLORS.length] }} />
                  {sec.category}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: INK, fontFamily: 'monospace' }}>
                  ₹{Math.round(sec.amount_spent).toLocaleString('en-IN')}
                </span>
              </motion.div>
            )) : (
              <p style={{ color: INK_DIM, fontStyle: 'italic', fontSize: '14px', margin: 0 }}>No expenses recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Main spend bar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} style={{ flexShrink: 0, marginTop: '10px' }}>
        <p style={{ ...label('total burn rate'), marginBottom: '6px' }}>Total Burn vs Income (₹{income.toLocaleString()})</p>
        <div style={{ border: `2.5px solid ${INK}`, height: '32px', position: 'relative', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4, duration: 1.5, ease: [0.16,1,0.3,1] }}
            style={{ height: '100%', backgroundColor: barColor, opacity: 0.6 }} />
          <div style={{ position: 'absolute', right: '10px', top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '16px', color: INK }}>
              ₹{Math.round(totalSpent).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Recent Transactions (ruled lines) ── */}
      <div style={{ flexShrink: 0, borderTop: `1.5px solid ${INK_FAINT}`, paddingTop: '10px', marginTop: 'auto' }}>
        <p style={{ ...label('recent entries'), marginBottom: '8px' }}>Recent Entries</p>
        {(txn.length > 0 ? txn : [
          { merchant: 'Swiggy', amount: 450, category: 'food' },
          { merchant: 'Uber', amount: 230, category: 'transport' },
        ]).map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.07 }}
            style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${INK_FAINT}`, padding: '4px 4px', fontFamily: "'Caveat', cursive, Georgia", fontSize: '20px', color: INK }}>
            <span style={{ textTransform: 'capitalize' }}>{t.merchant} <span style={{ fontSize: '12px', color: INK_DIM, fontFamily: 'sans-serif' }}>— {t.category}</span></span>
            <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, color: ACCENT }}>−₹{Number(t.amount).toLocaleString('en-IN')}</span>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
