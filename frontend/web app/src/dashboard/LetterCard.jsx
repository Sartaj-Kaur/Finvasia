import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import paperImg from '../assets/paper.jpg';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

/* ─── Static fallback letters (shown when no AI letter exists) ─── */
const LETTERS = {
  0:  { title: 'A January Note', body: ['The year is brand new and so are you. Every rupee saved in January is a seed planted for the harvest ahead. You started strong — don\'t look back.', 'Cold months call for warm plans. Keep your budget tight and your goals tighter. January discipline compounds into something extraordinary by December. Stay the course.', 'Track every rupee this month. The habit you build in January echoes through the entire year.'] },
  1:  { title: 'Dear February You', body: ['February is short but mighty. The weeks fly by — make sure your money doesn\'t fly with them.', 'You\'ve already proven you can resist impulse. That discipline? It compounds, just like interest. You\'re two months deep into a year that\'s going to look very different.', 'Review your January numbers today. Adjust where needed. Forward is the only direction that matters.'] },
  2:  { title: 'A March Letter', body: ['Spring is starting and so is your momentum. March is when budgets slip for most people — but not you.', 'Every small win this month is building the life you\'ve been sketching out. Trust the plan. The numbers will follow the discipline.', 'Q1 ends this month. Take stock. Celebrate what worked. Fix what didn\'t. You\'ve got nine more months of momentum ahead.'] },
  3:  { title: 'Dear April You', body: ['Midway through Q2. The numbers don\'t lie — you\'ve been consistent, and consistency is everything in personal finance.', 'April showers bring May flowers. Your savings discipline now will bloom into real freedom later. Stay steady and trust the compounding.', 'Look at your April goals. Are you 70% there? That\'s more than enough. Progress, not perfection.'] },
  4:  { title: 'A May Note', body: ['You\'re five months in. That\'s five months of intentional choices adding up to something real and measurable.', 'Summer is coming and with it, the temptation to spend. Remember: experiences > things. Budget experiences too — intentionally, not impulsively.', 'Check your savings rate. Even a 1% improvement compounds significantly. Small tweaks, massive long-term outcomes.'] },
  5:  { title: 'Dear June You', body: ['Half the year is behind you. Look how far you\'ve come since January. That\'s entirely your doing — no one else.', 'Midyear is the perfect time to re-check your goals. Are your allocations still aligned with what you actually want? Adjust with intention, not anxiety.', 'Celebrate the halfway mark. You\'ve outlasted 60% of the people who made financial resolutions this year.'] },
  6:  { title: 'A July Letter', body: ['July heat, cool head. You\'ve made it to the second half of the year with your finances intact and your habits sharpened.', 'This is the month where many people forget their resolutions. Not you. Your future self is watching every decision you\'re making and building a life on it.', 'Set a concrete H2 target today. One number. One goal. Write it down and let Monager help you track it.'] },
  7:  { title: 'Dear August You', body: ['August is the quiet month before the storm of expenses September brings. Use this time deliberately to build a financial buffer.', 'You\'ve been incredible. The choices you\'re making today will echo for years. That cup of coffee you skipped? That impulse buy you resisted? Real money, real future.', 'Automate one more saving this month. Make it invisible. What you don\'t see, you don\'t spend. Simple. Powerful.'] },
  8:  { title: 'A September Note', body: ['Q4 is approaching. This is the season of big expenses for most — festivals, holidays, travel, gifting. Plan ahead.', 'Don\'t let the season undo nine months of discipline. A written spending plan for October–December right now will save you from December regret.', 'You\'ve got this. September is the preparation month. January will thank you for the boundaries you draw today.'] },
  9:  { title: 'Dear October You', body: ['October. The leaves change and so does your net worth — upward, steadily, because of the choices you keep making every single day.', 'The end of year is visible. You\'ve done the hard part. Now it\'s about finishing strong and not unravelling what ten months of discipline built.', 'Resist the festive spending spiral. Enjoy the season — but decisively. Thoughtful spending is still spending with joy, just without the January regret.'] },
  10: { title: 'A November Letter', body: ['One month to go after this. November is a test of everything you\'ve learned and every habit you\'ve built this year. Pass it with flying colours.', 'Resist the sales. Resist the impulse. The "I deserve it" trap is real — and you do deserve things. The right things, planned, intentional, within the budget.', 'Calculate your year-end number. What will your savings look like on Dec 31? Make choices now that make that number proud.'] },
  11: { title: 'Dear December You', body: ['You made it. A full year of intentional choices, small sacrifices, deliberate decisions, and steady compounding growth. That\'s the rarest thing in personal finance.', 'December isn\'t the time to undo it all. Celebrate the year — but wisely. Review everything: what worked, what didn\'t, what to carry forward into January.', 'Your future self is the best gift you can give this holiday season. Start next year\'s budget now while the clarity is fresh. You already know how.'] },
};

const STACK_LINES = [
  'Hey there, just a quick note to say...',
  'Your savings this month have been...',
  'Remember when you set that goal...',
  'Budget check-in: things are looking...',
];

const PaperTexture = ({ brightness = '100%' }) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `url(${paperImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: `brightness(${brightness})`
    }}
  />
);

export function LetterCard() {
  const [step, setStep] = useState(0);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { currentUser } = useAuth();

  /* Map of "year-month" → letter content string (or null = not found yet) */
  const [letterCache, setLetterCache] = useState({});
  /* Whether history has been loaded */
  const [historyLoaded, setHistoryLoaded] = useState(false);
  /* Generating state for the current month */
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  /* ─── Load full letter history when the viewer opens ─── */
  useEffect(() => {
    if (!currentUser?.uid || !historyLoaded) return;
    // Already loaded — nothing to do
  }, [currentUser, historyLoaded]);

  const loadHistory = useCallback(async () => {
    if (!currentUser?.uid) return;
    try {
      const data = await fetchApi(`/letter/history/${currentUser.uid}`);
      if (Array.isArray(data)) {
        const map = {};
        data.forEach(item => {
          const key = `${item.year}-${item.month}`;
          map[key] = item.content;
        });
        setLetterCache(map);
      }
    } catch (err) {
      console.error('Failed to load letter history:', err);
    }
    setHistoryLoaded(true);
  }, [currentUser]);

  /* Load history once when viewer first opens */
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (step >= 4 && !hasLoadedRef.current && currentUser?.uid) {
      hasLoadedRef.current = true;
      loadHistory();
    }
  }, [step, loadHistory, currentUser]);

  /* ─── Derive letter for the selected month/year ─── */
  const cacheKey = `${selectedYear}-${selectedMonth + 1}`; // months stored as 1-indexed
  const aiContent = letterCache[cacheKey];
  const staticFallback = LETTERS[selectedMonth] || LETTERS[0];
  const letter = aiContent
    ? { title: 'Intelligence Dispatch', body: [aiContent] }
    : staticFallback;
  const hasAiLetter = Boolean(aiContent);

  /* Is this the current or a past month (allowed to generate)? */
  const validMonth = selectedMonth;
  const isPastYear = selectedYear < currentYear;
  const isCurrentOrPast =
    isPastYear || (selectedYear === currentYear && validMonth <= currentMonth);

  /* ─── Generate letter for selected month ─── */
  const handleGenerate = async (e) => {
    e.stopPropagation();
    if (!currentUser?.uid || generating) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const data = await fetchApi(`/letter/generate/${currentUser.uid}`, {
        method: 'POST',
      });
      if (data?.letter) {
        setLetterCache(prev => ({
          ...prev,
          [cacheKey]: data.letter,
        }));
      }
    } catch (err) {
      console.error('Letter generation failed:', err);
      setGenerateError('Generation failed. Try again shortly.');
    }
    setGenerating(false);
  };

  /* ─── Envelope animation ─── */
  const handleSealClick = (e) => {
    e.stopPropagation();
    if (step !== 0) return;
    setStep(1);
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setStep(3);
        setTimeout(() => { setStep(4); }, 700);
      }, 550);
    }, 500);
  };

  const closeLetter = (e) => {
    if (e) e.stopPropagation();
    setStep(0);
  };

  /* ─── Month navigation ─── */
  const availableMonths = Array.from(
    { length: isPastYear ? 12 : currentMonth + 1 }, (_, i) => i
  );

  const isAtStart = selectedYear <= currentYear - 2 && validMonth === 0;
  const isAtEnd = selectedYear === currentYear && validMonth === currentMonth;

  const availableYears = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i);

  const goToPrevMonth = (e) => {
    e.stopPropagation();
    if (validMonth > 0) setSelectedMonth(validMonth - 1);
    else if (selectedYear > currentYear - 2) {
      setSelectedYear(y => y - 1);
      setSelectedMonth(11);
    }
  };

  const goToNextMonth = (e) => {
    e.stopPropagation();
    const maxMonth = isPastYear ? 11 : currentMonth;
    if (validMonth < maxMonth) setSelectedMonth(validMonth + 1);
    else if (selectedYear < currentYear) {
      setSelectedYear(y => y + 1);
      setSelectedMonth(0);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center group pointer-events-auto">

        {/* ── ENVELOPE ── */}
        <motion.div
          className={`relative drop-shadow-[3px_8px_15px_rgba(0,0,0,0.35)] ${step >= 4 ? 'z-0' : 'z-20'}`}
          style={{ perspective: 1200, width: 'clamp(280px, 24vw, 420px)', height: 'clamp(160px, 14vw, 220px)' }}
          animate={{ rotateZ: step >= 4 ? 0 : -3.5, scale: step >= 4 ? 0.9 : 1, opacity: step >= 4 ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(90,50,20,0.3)] rounded-[8px] overflow-hidden">
            <PaperTexture brightness="85%" />
            <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-white/20 blur-[40px] pointer-events-none z-10" />
          </div>
          <div className="absolute inset-0 bg-black/20 rounded-[8px] pointer-events-none z-10" />

          <AnimatePresence>
            {step < 4 && (
              <motion.div
                layoutId="letter-peek"
                className="absolute inset-x-2 bottom-2 top-4 flex flex-col p-4 rounded-[6px] overflow-hidden border border-[#3b170c]/80"
                animate={{ y: step >= 3 ? -130 : 0, zIndex: step >= 3 ? 35 : 10 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <PaperTexture brightness="115%" />
                <div className="absolute inset-0 bg-[#f5ead8]/70 pointer-events-none z-10" />
                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(50,20,10,0.9),inset_0_0_25px_rgba(90,35,15,0.6)] mix-blend-multiply pointer-events-none z-10" />
                <div className="border-[0.5px] border-[#e6d5ba] w-full h-full p-3 flex flex-col opacity-80 z-20 mix-blend-multiply">
                  <h3 className="font-serif text-[13px] font-bold text-[#2f2f2f] mb-1 leading-tight text-center tracking-wide" style={{ borderBottom: '1px solid rgba(47,47,47,0.2)', paddingBottom: '4px' }}>
                    A Letter from Future You
                  </h3>
                  <p className="text-[#2f2f2f] leading-tight text-[11px] mt-2" style={{ fontFamily: "'Caveat', cursive" }}>
                    Hey there,<br />Just writing to say...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Flap */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-b-[2px]" style={{ clipPath: 'polygon(0 100%, 50% 46%, 100% 100%)' }}>
            <PaperTexture brightness="100%" />
            <div className="absolute top-[40%] left-[20%] w-[100px] h-[100px] bg-white/20 blur-[30px] pointer-events-none z-10" />
            <div className="absolute inset-0 shadow-[inset_0_-20px_40px_rgba(100,50,15,0.2)] pointer-events-none z-10" />
          </div>

          {/* Envelope text */}
          <div className="absolute top-[8%] inset-x-0 text-center z-[50] pointer-events-none transform rotate-[-1deg]">
            <p
              className="text-[#2b1f1a] text-[18px] xl:text-[22px] tracking-[0.02em] opacity-90 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
              style={{ fontFamily: "'Caveat', cursive", textShadow: '0 1px 2px rgba(43,31,26,0.35)' }}
            >
              — From Monager
            </p>
          </div>

          {/* Left Flap */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-l-[8px]" style={{ clipPath: 'polygon(0 0, 48% 50%, 0 100%)' }}>
            <PaperTexture brightness="90%" />
            <div className="absolute inset-0 shadow-[inset_-20px_0_30px_rgba(100,50,0,0.1)] pointer-events-none z-10" />
          </div>

          {/* Right Flap */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-[8px]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 52% 50%)' }}>
            <PaperTexture brightness="85%" />
            <div className="absolute inset-0 shadow-[inset_20px_0_30px_rgba(100,50,0,0.15)] pointer-events-none z-10" />
          </div>

          {/* Top Flap */}
          <motion.div
            className="absolute inset-0 origin-top z-30 transform-gpu"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: step >= 2 ? 180 : 0, zIndex: step >= 3 ? 5 : 30 }}
            transition={{ duration: 0.6, ease: [0.35, 0.05, 0.15, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 rounded-t-[8px] overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 56%)', backfaceVisibility: 'hidden' }}>
              <PaperTexture brightness="105%" />
              <div className="absolute top-[-20px] left-[-20px] w-[150px] h-[150px] bg-white/40 blur-[40px] pointer-events-none z-10" />
            </div>
            <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(100,50,20,0.3)] overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 56%)', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              <PaperTexture brightness="85%" />
            </div>
          </motion.div>

          {/* Wax Seal */}
          <AnimatePresence>
            {step < 2 && (
              <motion.div
                className="absolute w-[64px] h-[64px] left-0 right-0 mx-auto z-40 flex items-center justify-center cursor-pointer"
                style={{
                  top: '40%',
                  borderRadius: '46% 54% 51% 49% / 52% 47% 53% 48%',
                  background: 'radial-gradient(ellipse at 30% 30%, #a22929 0%, #6e1b1b 50%, #451111 100%)',
                  boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.25), inset -2px -4px 8px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5)'
                }}
                animate={step === 0 ? { scale: 1 } : { scale: [1, 1.15, 0.95], opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: 'easeIn' }}
                onClick={handleSealClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 mix-blend-multiply"
                    style={{ clipPath: 'polygon(45% 0, 52% 20%, 48% 40%, 53% 60%, 47% 80%, 55% 100%, 0 100%, 0 0)', borderRadius: 'inherit' }}
                  />
                )}
                <div className="absolute top-1.5 left-2.5 w-6 h-2.5 bg-white/40 rounded-full blur-[1px] rotate-[-35deg]" />
                <div className="absolute top-3 left-1.5 w-2 h-2 bg-white/50 rounded-full blur-[0.5px]" />
                <div className="w-[42px] h-[42px] border-[1.5px] border-[#380e0e]/80 rounded-[51%_49%_50%_50%] flex items-center justify-center relative overflow-hidden bg-black/5"
                  style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)' }}>
                  <span className="text-[#380e0e] font-serif font-bold text-2xl drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]">M</span>
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── FULLSCREEN VIEWER ── */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {step >= 4 && (
              <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center p-2">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={closeLetter}
                  className="absolute inset-0 bg-black/75 backdrop-blur-md"
                />

                <motion.div
                  initial={{ scale: 0.88, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.88, y: 40, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  className="relative z-[110] flex flex-col w-full max-w-2xl"
                  style={{ maxHeight: '98vh' }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* ── STACKED PAST LETTERS ── */}
                  <div className="absolute pointer-events-none" style={{ inset: '44px 0 0 0' }}>
                    <div className="absolute inset-0 rounded-b-[10px] overflow-hidden border border-[#5c3820]/60"
                      style={{ transform: 'rotate(5deg) translateY(14px) scale(0.96)', zIndex: 100, background: '#e8d9c0' }}>
                      <PaperTexture brightness="75%" />
                      <div className="absolute inset-0 bg-[#b8936a]/20" />
                      <div className="absolute inset-0 p-10 opacity-30">
                        {STACK_LINES.map((line, i) => (
                          <div key={i} className="mb-5 text-[#3b2010] font-bold text-[13px]"
                            style={{ fontFamily: "'Caveat', cursive", transform: `rotate(${i % 2 === 0 ? '-0.3deg' : '0.2deg'})` }}>
                            {line}
                          </div>
                        ))}
                        <div className="mt-8 text-right text-[#3b2010] text-[12px] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>— Monager</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-b-[10px] overflow-hidden border border-[#5c3820]/60"
                      style={{ transform: 'rotate(2.5deg) translateY(7px) scale(0.982)', zIndex: 101, background: '#ecdfc8' }}>
                      <PaperTexture brightness="85%" />
                      <div className="absolute inset-0 bg-[#c8a06a]/15" />
                      <div className="absolute inset-0 p-10 opacity-35">
                        {STACK_LINES.slice(0, 3).map((line, i) => (
                          <div key={i} className="mb-5 text-[#3b2010] font-bold text-[13px]"
                            style={{ fontFamily: "'Caveat', cursive" }}>
                            {line}
                          </div>
                        ))}
                        <div className="mt-10 text-right text-[#3b2010] text-[12px] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>— Monager</div>
                      </div>
                    </div>
                  </div>

                  {/* ── HEADER BAR ── */}
                  <div className="relative z-[115] w-full bg-[#1e140d]/95 backdrop-blur-sm rounded-t-[10px] border border-[#5c3820]/70 border-b-0 overflow-hidden">
                    {/* Year row */}
                    <div className="flex items-center justify-between px-4 pt-2.5 pb-1.5 border-b border-[#5c3820]/40">
                      <button
                        onClick={() => { if (selectedYear > currentYear - 2) { setSelectedYear(y => y - 1); setSelectedMonth(11); } }}
                        disabled={selectedYear <= currentYear - 2}
                        className="text-[#d4af37]/70 hover:text-[#d4af37] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-[#d4af37] text-[11px] font-bold tracking-[0.3em] uppercase font-mono">{selectedYear}</span>
                      <button
                        onClick={() => { if (selectedYear < currentYear) { setSelectedYear(y => y + 1); setSelectedMonth(0); } }}
                        disabled={selectedYear >= currentYear}
                        className="text-[#d4af37]/70 hover:text-[#d4af37] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    {/* Month row */}
                    <div className="flex items-center gap-1.5 px-3 py-2">
                      <button onClick={goToPrevMonth} disabled={isAtStart}
                        className="text-[#d4af37] hover:bg-white/10 rounded-full p-0.5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                        <ChevronLeft size={16} />
                      </button>
                      <div className="flex-1 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        {availableMonths.map(m => {
                          const mKey = `${selectedYear}-${m + 1}`;
                          const hasAi = Boolean(letterCache[mKey]);
                          return (
                            <button
                              key={m}
                              onClick={(e) => { e.stopPropagation(); setSelectedMonth(m); }}
                              className={`relative px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap font-mono flex-shrink-0 ${
                                validMonth === m
                                  ? 'bg-[#d4af37] text-[#1a0d05]'
                                  : 'text-[#d4af37]/50 hover:text-[#d4af37] hover:bg-white/8'
                              }`}
                            >
                              {MONTH_NAMES[m].slice(0, 3)}
                              {/* Dot indicator for months with AI letters */}
                              {hasAi && (
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#2a9d8f]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <button onClick={goToNextMonth} disabled={isAtEnd}
                        className="text-[#d4af37] hover:bg-white/10 rounded-full p-0.5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* ── MAIN LETTER PAPER ── */}
                  <div className="relative z-[112] rounded-b-[10px] overflow-hidden border border-[#5c3820]/70 border-t-0 flex-1"
                    style={{ background: '#f2e4cc', minHeight: '72vh' }}>
                    <PaperTexture brightness="110%" />
                    <div className="absolute inset-0 bg-[#fff8ee]/50 pointer-events-none z-[1]" />
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(50,20,10,0.7),inset_0_0_60px_rgba(90,35,15,0.4)] mix-blend-multiply pointer-events-none z-[2]" />
                    <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-[3] bg-gradient-to-br from-white/50 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedYear}-${validMonth}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-[5] flex flex-col p-7 md:p-10"
                      >
                        {/* Close */}
                        <button onClick={closeLetter} className="absolute top-4 right-4 text-[#2f2f2f]/40 hover:text-[#2f2f2f]/80 transition-colors z-50">
                          <X size={22} />
                        </button>

                        {/* Month + Year label + AI badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-[#8c5c35] text-[11px] font-bold tracking-[0.3em] uppercase font-mono mix-blend-multiply">
                            {MONTH_NAMES[validMonth]} {selectedYear}
                          </p>
                          {hasAiLetter && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-[#2a9d8f]/15 text-[#2a9d8f] border border-[#2a9d8f]/30 mix-blend-multiply">
                              AI Letter
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className="font-serif text-[22px] md:text-[27px] font-bold text-[#2f2f2f] mb-5 pb-3 tracking-wide mix-blend-multiply"
                          style={{ borderBottom: '1.5px solid rgba(47,47,47,0.15)' }}
                        >
                          {letter.title}
                        </h3>

                        {/* Body */}
                        <div className="text-[#2f2f2f] mix-blend-multiply" style={{ fontFamily: "'Caveat', cursive" }}>
                          <p className="mb-3 indent-6 text-[20px] md:text-[22px] leading-[1.4] opacity-90">
                            Hey there,
                          </p>
                          {letter.body.map((para, i) => (
                            <p key={i} className="mb-3 text-[19px] md:text-[21px] leading-[1.45] opacity-90">
                              {para}
                            </p>
                          ))}
                        </div>

                        {/* Sign-off */}
                        <div className="mt-4 text-right">
                          <span className="text-[#2f2f2f] text-[26px] md:text-[30px] font-bold italic mix-blend-multiply opacity-85"
                            style={{ fontFamily: "'Caveat', cursive" }}>
                            — Monager
                          </span>
                        </div>

                        {/* ── Generate Banner (when no AI letter exists) ── */}
                        {!hasAiLetter && isCurrentOrPast && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 rounded-[8px] border border-dashed border-[#8c5c35]/40 bg-[#f5ead8]/60 p-4 flex flex-col items-center gap-3 mix-blend-multiply"
                          >
                            <p className="text-[#5c3220] text-[12px] font-bold tracking-wider uppercase opacity-70 font-mono text-center">
                              No AI letter for {MONTH_NAMES[validMonth]} {selectedYear}
                            </p>
                            <p className="text-[#3b2010] text-[15px] opacity-60 text-center" style={{ fontFamily: "'Caveat', cursive" }}>
                              Monager can write a personalised financial letter based on your spending & mood data.
                            </p>
                            {generateError && (
                              <p className="text-red-600 text-[12px] text-center">{generateError}</p>
                            )}
                            <button
                              onClick={handleGenerate}
                              disabled={generating}
                              className="flex items-center gap-2 px-4 py-2 rounded-[6px] text-[12px] font-bold tracking-wider uppercase transition-all"
                              style={{
                                background: generating
                                  ? 'rgba(140,92,53,0.15)'
                                  : 'rgba(140,92,53,0.9)',
                                color: generating ? '#8c5c35' : '#f5ead8',
                                border: '1px solid rgba(140,92,53,0.4)',
                                cursor: generating ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {generating
                                ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
                                : <><Sparkles size={14} /> Generate with AI</>
                              }
                            </button>
                          </motion.div>
                        )}

                      </motion.div>
                    </AnimatePresence>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </>
  );
}
