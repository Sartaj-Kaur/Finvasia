import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '../api';

const INK = '#1a0f08';
const INK_DIM = 'rgba(26,15,8,0.55)';
const INK_FAINT = 'rgba(26,15,8,0.22)';

const ROOT = {
  width: '100%', height: '100%',
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  overflow: 'hidden',
  fontFamily: "'Georgia', 'Times New Roman', serif",
  position: 'relative',
  pointerEvents: 'none'
};

const LBL = {
  margin: 0, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '2.5px', color: INK_DIM, fontFamily: 'sans-serif',
};

function CategoryTab({ categoryId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchApi(`/analytics/category/${categoryId}`)
      .then(res => {
         if (active) {
            setData(res);
            setLoading(false);
         }
      })
      .catch(err => {
         console.error('Analytics fetch error:', err);
         if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [categoryId]);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ fontSize: '24px', fontFamily: 'serif', color: INK, animation: 'pulse 2s infinite' }}>Analyzing {categoryId}...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', boxSizing: 'border-box', pointerEvents: 'auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderBottom: `3px double ${INK_FAINT}`, paddingBottom: '8px', flexShrink: 0 }}>
            <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 900, fontStyle: 'normal', color: INK, textTransform: 'uppercase', letterSpacing: '2px' }}>{data.cat_name}</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={LBL}>Budget</p>
                <p style={{ fontFamily: 'serif', fontSize: '26px', fontWeight: 'bold', color: '#e76f51', margin: 0 }}>
                    ₹{data.drawn.toLocaleString('en-IN')} <span style={{ fontSize: '16px', color: INK_DIM }}>/ ₹{data.max.toLocaleString('en-IN')}</span>
                </p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ ...LBL, color: '#2a9d8f' }}>Remaining</p>
                <p style={{ fontFamily: 'serif', fontSize: '26px', fontWeight: 'bold', color: '#2a9d8f', margin: 0 }}>
                    ₹{data.remaining.toLocaleString('en-IN')}
                </p>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ width: '100%', height: '160px', position: 'relative', border: `1px solid ${INK_FAINT}`, borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
            <p style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '10px', color: INK, opacity: 0.5, fontWeight: 'bold', letterSpacing: '2px', zIndex: 10, margin: 0 }}>{data.chart_label || '6MO PATTERN'}</p>
            {data.sparkline_svg && (
              <div
                style={{ position: 'absolute', inset: 0, padding: '18px 8px 6px 8px', boxSizing: 'border-box' }}
                dangerouslySetInnerHTML={{ __html: data.sparkline_svg }}
              />
            )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ backgroundColor: 'rgba(26,15,8,0.05)', border: `1px solid ${INK_FAINT}`, padding: '15px 15px', borderRadius: '4px', position: 'relative' }}>
            <p style={{ position: 'absolute', top: '-8px', left: '15px', backgroundColor: '#e8decf', padding: '0 5px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.7, color: INK, margin: 0 }}>MONAGER REMARK</p>
            <p style={{ fontSize: '21px', color: INK, lineHeight: 1.3, fontFamily: "'Caveat', cursive", margin: '5px 0 0 0' }}>{data.remark}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1, marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
                <p style={{ ...LBL, marginBottom: '8px', opacity: 0.6 }}>Recent Transactions</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: INK, fontSize: '14px', fontFamily: 'serif', width: '90%' }}>
                    {data.recent_transactions && data.recent_transactions.map((tx, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${INK_FAINT}`, paddingBottom: '4px', marginBottom: '4px' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>{tx.merchant}</span>
                            <span style={{ fontWeight: 'bold', flexShrink: 0 }}>₹{tx.amount.toLocaleString('en-IN')}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '15px', borderLeft: `1px solid ${INK_FAINT}` }}>
                <p style={{ ...LBL, marginBottom: '8px', opacity: 0.6, textAlign: 'center', lineHeight: 1.2 }}>SCANNED<br/>RECEIPTS</p>
                <div style={{ width: '60px', height: '60px', border: `2px dashed ${INK_FAINT}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(219,210,194,0.5)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontFamily: 'serif', fontSize: '24px', color: INK, fontWeight: 'bold' }}>{data.receipts_scanned}</span>
                </div>
            </div>
        </motion.div>
    </div>
  );
}

export default function RightPageUI({ isOpen, activeTab, month, year, userId }) {
  if (!isOpen) return null;

  let categoryId = 0;
  if (activeTab && activeTab.startsWith('CAT_')) {
     categoryId = parseInt(activeTab.split('_')[1], 10);
  }

  return (
    <div style={ROOT}>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab || 'CAT_0'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', height: '100%' }}
        >
          <CategoryTab categoryId={categoryId} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
