import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';
import {
  Plane, Sparkles, TrendingUp, TrendingDown, AlertCircle,
  Target, Plus, BarChart2, Shield, Calculator, CheckCircle2, X
} from 'lucide-react';

// ─────────────────────────────────────────────
// BUDGET TAB — Parts
// ─────────────────────────────────────────────

const HeroGoalSection = ({ month, year }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full shrink-0 relative bg-[#e0f2fe] border-[3px] border-white overflow-hidden"
    style={{ height: '33%', transform: 'rotate(-1.5deg)', filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.12))' }}
  >
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: '41.3%' }}
      transition={{ delay: 0.8, duration: 2.5, ease: 'easeInOut' }}
      className="absolute bottom-0 w-full bg-[#38bdf8]/80"
    >
      <div className="absolute top-0 w-full h-3 bg-white/30" style={{ borderTop: '2px dashed rgba(255,255,255,0.8)' }} />
    </motion.div>
    <div className="absolute inset-0 p-5 flex flex-col justify-between mix-blend-multiply">
      <div className="flex justify-between items-start">
        <h3 className="text-4xl font-bold font-serif text-slate-900 leading-none">Goa Trip</h3>
        <Plane size={36} className="text-slate-900 opacity-70" />
      </div>
      <div>
        <p className="text-3xl font-black font-sans text-slate-900">₹6,200 <span className="text-lg opacity-50 font-normal">/ ₹15,000</span></p>
        <p className="text-base font-serif italic text-slate-700 mt-1">45 Days Left</p>
      </div>
    </div>
  </motion.div>
);

const AutoMoneyFlow = ({ insights }) => {
  const [particles, setParticles] = useState([]);
  const trigger = () => {
    const ps = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 320,
      y: (Math.random() - 1.2) * 240,
      r: Math.random() * 360,
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 1800);
  };
  return (
    <div className="relative w-full shrink-0 py-4 border-l-[5px] border-emerald-600 pl-5 mix-blend-multiply">
      <h3 className="text-2xl font-bold font-serif text-emerald-950 italic flex items-center gap-2 mb-1">
        Automagic Flow <Sparkles size={22} className="text-emerald-700" />
      </h3>
      <p className="text-lg font-sans text-slate-700 mb-3">Saved <span className="font-bold line-through opacity-50">₹800</span> from {insights?.top_category || 'dining'}.</p>
      <div className="relative inline-block">
        <button onClick={trigger}
          className="px-5 py-2 bg-emerald-100 border-2 border-emerald-900 font-black text-base shadow-[2px_2px_0_rgba(6,78,59,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          Move to Goal →
        </button>
        <AnimatePresence>
          {particles.map(p => (
            <motion.span key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
              animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.2, rotate: p.r }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute left-12 top-0 pointer-events-none text-emerald-800 font-bold text-xl z-50 bg-emerald-50 border border-emerald-700 rounded-full px-2 py-1"
            >+₹</motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MONEY INTELLIGENCE (replaces Future You)
// ─────────────────────────────────────────────

const PATTERNS = [
  { icon: TrendingUp,   text: 'You spend more on weekends',           tag: 'Pattern' },
  { icon: AlertCircle,  text: 'Food spending spikes on stressful days', tag: 'Behavior' },
  { icon: TrendingDown, text: 'Subscriptions increased this month',    tag: 'Watch' },
];

const SMART_ACTIONS = [
  { id: 'subs',  label: 'Pause subscriptions', save: '₹600' },
  { id: 'goal',  label: 'Move ₹500 to goal',   save: '₹500' },
];

const PredictionGraph = () => {
  const points = [40, 55, 45, 70, 60, 80, 65];
  const max = 100; const w = 240; const h = 56;
  const pts = points.map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="inkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="1" />
          </linearGradient>
        </defs>
        <motion.polyline
          points={pts}
          fill="none"
          stroke="url(#inkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
        />
        {points.map((v, i) => (
          <circle key={i} cx={(i / (points.length - 1)) * w} cy={h - (v / max) * h}
            r={i === points.length - 1 ? 4 : 2.5}
            fill={i === points.length - 1 ? '#1e3a5f' : '#94a3b8'}
          />
        ))}
      </svg>
    </div>
  );
};

const MoneyIntelligence = ({ insights }) => {
  const [dismissed, setDismissed] = useState([]);
  const [applied, setApplied]   = useState([]);
  const expectedSpend = insights?.simulated_value ? `₹${(insights.simulated_value / 12).toFixed(0)}` : '₹2,300';
  const moodAlert = insights?.mood_summary?.stressed > insights?.mood_summary?.happy ? '⚠ Correlated stress spending detected' : '⚠ Lifestyle budget at risk';

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden pt-2">

      {/* Money Patterns */}
      <div className="shrink-0">
        <h3 className="text-2xl font-bold font-serif italic text-[var(--color-text-main)] border-b-2 border-dotted border-slate-400 pb-1 mb-3">
          Money Patterns
        </h3>
        <div className="flex flex-col gap-2">
          {PATTERNS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 mix-blend-multiply"
              >
                <Icon size={18} className="text-slate-600 shrink-0" />
                <p className="text-xl font-sans text-slate-800 leading-snug flex-1">{p.text}</p>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 border border-slate-300 px-2 py-0.5 shrink-0">{p.tag}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Prediction */}
      <div className="shrink-0">
        <h3 className="text-2xl font-bold font-serif italic text-[var(--color-text-main)] border-b-2 border-dotted border-slate-400 pb-1 mb-2">
          7-Day Prediction
        </h3>
        <p className="text-xl font-sans text-slate-700 mb-2">
          Expected spend: <span className="font-black text-slate-900">{expectedSpend}</span>
          <span className="ml-3 text-sm text-amber-700 font-bold">{moodAlert}</span>
        </p>
        <PredictionGraph />
      </div>

      {/* Smart Actions */}
      <div className="shrink-0">
        <h3 className="text-2xl font-bold font-serif italic text-[var(--color-text-main)] border-b-2 border-dotted border-slate-400 pb-1 mb-2">
          Smart Actions
        </h3>
        <div className="flex flex-col gap-2">
          {SMART_ACTIONS.filter(a => !dismissed.includes(a.id)).map(action => (
            <motion.div key={action.id} layout
              className="flex items-center justify-between bg-[var(--color-paper-light)] border border-slate-300 px-4 py-2 mix-blend-multiply"
            >
              <p className="text-lg font-sans text-slate-800">
                {action.label} <span className="font-black text-emerald-800">→ save {action.save}</span>
              </p>
              <div className="flex gap-2 shrink-0">
                {applied.includes(action.id)
                  ? <span className="flex items-center gap-1 text-emerald-700 text-sm font-bold"><CheckCircle2 size={16} /> Applied</span>
                  : <>
                      <button onClick={() => setApplied(p => [...p, action.id])}
                        className="px-3 py-1 bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors">
                        Apply
                      </button>
                      <button onClick={() => setDismissed(p => [...p, action.id])}
                        className="px-3 py-1 border border-slate-400 text-slate-500 text-sm hover:border-slate-700 transition-colors">
                        Ignore
                      </button>
                    </>
                }
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// GOALS TAB
// ─────────────────────────────────────────────

const GOALS_DATA = [
  { id: 1, name: 'Goa Trip',     target: 15000, saved: 6200,  color: '#38bdf8' },
  { id: 2, name: 'Emergency Fund', target: 50000, saved: 32000, color: '#34d399' },
  { id: 3, name: 'Macbook',      target: 120000, saved: 18000, color: '#f59e0b' },
];

const GoalsPage = () => {
  const [goals, setGoals] = useState(GOALS_DATA);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <div className="w-full h-full flex flex-col p-8 gap-4 overflow-hidden">
      <h2 className="text-4xl font-serif font-bold italic text-[var(--color-text-main)] shrink-0 border-b-[3px] border-double border-[var(--color-text-main)] pb-2">
        Your Goals
      </h2>
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
        {goals.map((g, i) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <motion.div key={g.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full mix-blend-multiply"
            >
              <div className="flex justify-between mb-1">
                <p className="text-2xl font-serif font-bold text-slate-900">{g.name}</p>
                <p className="text-xl font-mono font-black text-slate-700">₹{g.saved.toLocaleString()} / ₹{g.target.toLocaleString()}</p>
              </div>
              <div className="w-full h-5 bg-slate-200/60 relative overflow-hidden border border-slate-300">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                  style={{ backgroundColor: g.color }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-sm font-bold text-slate-800 mix-blend-multiply">{pct}%</span>
              </div>
            </motion.div>
          );
        })}
        {adding && (
          <div className="flex gap-2 items-center mt-2">
            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Goal name…"
              className="flex-1 border-b-2 border-slate-600 bg-transparent text-xl font-serif outline-none pb-1 text-slate-900"
            />
            <button onClick={() => {
              if (newName.trim()) setGoals(g => [...g, { id: Date.now(), name: newName, target: 10000, saved: 0, color: '#a78bfa' }]);
              setAdding(false); setNewName('');
            }} className="px-4 py-1 bg-slate-900 text-white text-sm font-bold">Add</button>
            <button onClick={() => setAdding(false)} className="p-1"><X size={16} /></button>
          </div>
        )}
      </div>
      <button onClick={() => setAdding(true)}
        className="shrink-0 mt-auto w-full py-3 border-2 border-dashed border-slate-400 text-xl font-serif italic text-slate-500 hover:border-slate-700 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
        <Plus size={20} /> Add New Goal
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// INVEST TAB
// ─────────────────────────────────────────────

const InvestPage = ({ insights }) => {
  const total = insights?.investment_total || 38000;
  const data = [22000, 25000, 23000, 28000, 32000, 30000, Math.max(38000, total)];
  const max = Math.max(...data); const min = Math.min(...data);
  const W = 300; const H = 100;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min)) * H}`).join(' ');
  return (
    <div className="w-full h-full flex flex-col p-8 gap-5 overflow-hidden">
      <h2 className="text-4xl font-serif font-bold italic text-[var(--color-text-main)] shrink-0 border-b-[3px] border-double border-[var(--color-text-main)] pb-2">
        Investments
      </h2>
      <div className="flex gap-6 shrink-0">
        <div>
          <p className="text-base uppercase tracking-widest text-slate-500 font-bold">Total Invested</p>
          <p className="text-5xl font-black font-sans text-slate-900">₹{total.toLocaleString()}</p>
        </div>
        <div className="border-l-2 border-dotted border-slate-400 pl-6">
          <p className="text-base uppercase tracking-widest text-emerald-600 font-bold">+Growth</p>
          <p className="text-5xl font-black font-sans text-emerald-800">+12.4%</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">6-Month Portfolio Value</p>
        <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="investFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.polygon
            points={`0,${H} ${pts} ${W},${H}`}
            fill="url(#investFill)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.polyline
            points={pts} fill="none"
            stroke="#059669" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.2, ease: 'easeInOut' }}
          />
        </svg>
        <div className="flex justify-between text-xs text-slate-400 font-mono mt-1 px-1">
          {['Oct','Nov','Dec','Jan','Feb','Mar'].map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
        {['Nifty 50 ETF','Gold','Fixed Dep.'].map((s, i) => (
          <div key={s} className="flex-1 border border-slate-300 p-3">
            <p className="text-sm text-slate-500 font-bold">{s}</p>
            <p className="text-xl font-mono font-black text-slate-800">₹{[18000,8000,12000][i].toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ENVELOPE RECEIPTS
// ─────────────────────────────────────────────

const EnvelopeReceipts = ({ envelopeOpen, setEnvelopeOpen, txns }) => {
  const list = txns && txns.length > 0
      ? txns.map(t => `${t.merchant.toUpperCase()} ₹${t.amount}`)
      : ['UBER ₹230','SWIGGY ₹450','AMAZON ₹1499'];

  return (
  <div className="absolute top-3 right-3 z-[50]">
    <motion.div
      animate={{ rotate: envelopeOpen ? 10 : 2 }}
      className="w-56 cursor-pointer"
      onClick={() => setEnvelopeOpen(!envelopeOpen)}
      style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.18))' }}
    >
      <div className="p-3 border-2 border-[var(--color-text-muted)] rotate-1 relative pb-6" style={{ backgroundColor: '#f0eadd' }}>
        <div className="absolute top-0 left-0 w-full h-3 bg-slate-300/40 -skew-y-2 origin-top-left" />
        <p className="text-xl font-bold font-serif tracking-widest mix-blend-multiply text-slate-800 relative z-10">RECEIPTS</p>
        <AnimatePresence>
          {envelopeOpen && list.map((r, i) => (
            <motion.div key={r}
              initial={{ y: -30, x: 0, opacity: 0, rotate: 0 }}
              animate={{ y: 40 + i * 55, x: [-120, -10, 70][i], opacity: 1, rotate: [-20, 12, -5][i] }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 80, delay: i * 0.08 }}
              className="absolute top-full left-2 w-44 bg-[#fdfbf6] p-3 border border-slate-300 z-10 shadow-xl"
              style={{ zIndex: 10 - i }}
            >
              <p className="text-base font-bold font-serif text-slate-900 text-center border-b border-dotted border-slate-300 pb-1 mb-1">{r.split(' ')[0]}</p>
              <p className="text-right font-mono font-black text-slate-800">{r.split(' ')[1]}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  </div>
)};

// ─────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────

export default function RightPageUI({ isOpen, activeTab, month, year }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const { currentUser } = useAuth();
  const [insights, setInsights] = useState(null);
  const [txns, setTxns] = useState([]);
  
  useEffect(() => {
     if (currentUser?.uid && isOpen) {
         fetchApi(`/insights/summary/${currentUser.uid}`).then(setInsights).catch(console.error);
         fetchApi(`/transactions/${currentUser.uid}`).then(res => setTxns(res?.transactions?.slice(0,3) || [])).catch(console.error);
     }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const isBudgetTab = !activeTab || activeTab === 'BUDGET';

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Paper texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] mix-blend-overlay" />

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full h-full"
        >
          {activeTab === 'GOALS'  && <GoalsPage />}
          {activeTab === 'INVEST' && <InvestPage insights={insights} />}

          {isBudgetTab && (
            <>
              <EnvelopeReceipts envelopeOpen={envelopeOpen} setEnvelopeOpen={setEnvelopeOpen} txns={txns} />
              <div className="w-full h-full p-8 flex flex-col gap-4 pr-5 overflow-hidden">
                <HeroGoalSection month={month} year={year} />
                <AutoMoneyFlow insights={insights} />
                <MoneyIntelligence insights={insights} />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
