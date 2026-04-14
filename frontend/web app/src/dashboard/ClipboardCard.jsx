import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import HTMLFlipBook from 'react-pageflip';
import paperImg from '../assets/file.avif';
import woodImg from '../assets/clipboard.jpg';

const TranslatedSection = ({ title, jargon }) => {
  const [genZ, setGenZ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/translate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: jargon })
    })
      .then(r => r.json())
      .then(data => {
        if (isMounted) {
            setGenZ(data.translatedText);
            setLoading(false);
        }
      })
      .catch((e) => {
          console.error(e);
          if (isMounted) setLoading(false);
      });
      return () => { isMounted = false; };
  }, [jargon]);

  return (
    <div className="flex gap-4 items-start pb-4 mt-4 border-b border-[#2b1f1a]/10 mix-blend-multiply">
      <div className="flex-1 w-[220px]">
        <h4 className="font-bold text-[18px] text-[#2b1f1a] uppercase tracking-wide">{title}</h4>
        <p className="text-[14px] text-[#2b1f1a]/80 font-serif leading-snug mt-1">{jargon}</p>
      </div>
      <div className="w-[180px] bg-[#e9c46a]/20 p-3 pt-3 rounded-md border border-[#e9c46a]/40 shadow-sm relative rotate-[1deg]">
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-[#e76f51]/40 rounded shadow-sm opacity-60 rotate-[-3deg]" />
        {loading ? (
            <p className="text-[16px] text-gray-500 animate-pulse mt-1" style={{ fontFamily: "'Caveat', cursive" }}>translating fr fr...</p>
        ) : (
            <p className="text-[18px] text-[#2b1f1a] leading-tight mt-1" style={{ fontFamily: "'Caveat', cursive" }}>{genZ}</p>
        )}
      </div>
    </div>
  );
};

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-[#f8f5ee] relative overflow-hidden border border-[#2b1f1a]/10" ref={ref}>
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-80"
        style={{ backgroundImage: `url(${paperImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(40,20,10,0.15)] pointer-events-none" />
      <div className="relative p-8 w-full h-full flex flex-col pointer-events-auto">
        {props.children}
      </div>
    </div>
  );
});

export function ClipboardCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const flipBookRef = useRef(null);
  const [leftCurlHovered, setLeftCurlHovered] = useState(false);

  const toggleOpen = (e) => {
    e.stopPropagation();
    if (!isOpen) setIsOpen(true);
  };

  const closeClipboard = (e) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
  };

  const pagesContent = [
    (
      <React.Fragment>
        <h3 className="font-serif text-[36px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-3 text-[#2b1f1a] mix-blend-multiply">FinTwin Analytics</h3>
        <p className="mt-5 text-[25px] text-[#2b1f1a] mix-blend-multiply" style={{ fontFamily: "'Caveat', cursive" }}>Analyzing past habits.</p>
        <div className="mt-11 flex gap-5 mix-blend-multiply">
          <div className="w-[112px] h-[112px] rounded-full border-[8px] border-[#e76f51] border-r-transparent animate-spin-slow flex items-center justify-center">
            <span className="font-bold text-[25px] text-[#2b1f1a]">75%</span>
          </div>
          <div className="pt-2">
            <p className="font-bold text-[#2b1f1a] text-[22px]">Budget Capacity</p>
            <p className="text-[18px] opacity-80 w-[280px] mt-2 font-serif leading-snug">Dining out expense is draining capacity heavily this month.</p>
          </div>
        </div>
        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 1</p>
      </React.Fragment>
    ),
    (
      <React.Fragment>
        <h3 className="font-serif text-[36px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-3 text-[#2b1f1a] mix-blend-multiply">Allocation</h3>
        <div className="mt-8 space-y-7 mix-blend-multiply">
          <div>
            <p className="text-[21px] font-bold text-[#2b1f1a]">Needs (50%)</p>
            <div className="w-full h-5 bg-[#2b1f1a]/15 rounded mt-1.5 border border-[#2b1f1a]/10"><div className="w-[50%] h-full bg-[#2a9d8f] rounded border border-black/10"></div></div>
          </div>
          <div>
            <p className="text-[21px] font-bold text-[#2b1f1a]">Wants (30%)</p>
            <div className="w-full h-5 bg-[#2b1f1a]/15 rounded mt-1.5 border border-[#2b1f1a]/10"><div className="w-[45%] h-full bg-[#e9c46a] rounded border border-black/10"></div></div>
            <p className="text-[16px] text-red-700 font-bold mt-2" style={{ fontFamily: "'Caveat', cursive" }}>*Warning: Over allocated!</p>
          </div>
          <div>
            <p className="text-[21px] font-bold text-[#2b1f1a]">Savings (20%)</p>
            <div className="w-full h-5 bg-[#2b1f1a]/15 rounded mt-1.5 border border-[#2b1f1a]/10"><div className="w-[15%] h-full bg-[#264653] rounded border border-black/10"></div></div>
          </div>
        </div>
        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 2</p>
      </React.Fragment>
    ),
    (
      <React.Fragment>
        <h3 className="font-serif text-[36px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-3 text-[#2b1f1a] mix-blend-multiply">Investments</h3>
        <p className="mt-5 text-[28px] text-[#2b1f1a] mix-blend-multiply" style={{ fontFamily: "'Caveat', cursive" }}>Diversification checks:</p>
        <ul className="list-disc pl-8 mt-5 opacity-90 text-[#2b1f1a] font-serif space-y-4 mix-blend-multiply text-[21px] leading-snug">
          <li>Nifty 50 Index Fund <b className="text-[#2a9d8f]">(Stable Core)</b>. Consistent growth.</li>
          <li>Sovereign Gold Bonds <b className="text-[#e9c46a]">(Hedge)</b>. Protection against inflation.</li>
          <li>Liquid Funds <b className="text-[#e76f51]">(Emergency)</b>. Highly accessible.</li>
        </ul>
        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 3</p>
      </React.Fragment>
    ),
    (
      <React.Fragment>
        <div className="flex flex-col items-center justify-center h-[90%] mix-blend-multiply">
          <h3 className="font-serif text-[45px] font-bold text-[#2b1f1a]">End of Report</h3>
          <p className="mt-5 text-[30px] text-[#2b1f1a]" style={{ fontFamily: "'Caveat', cursive" }}>Great job this week!</p>
          <div className="mt-16 w-28 h-28 border-[4px] border-[#2b1f1a]/30 rounded-full flex items-center justify-center opacity-60">
            <span className="font-serif font-bold text-4xl">✔</span>
          </div>
        </div>
        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 4</p>
      </React.Fragment>
    )
  ];

  return (
    <>
      <div className="relative flex items-center justify-center group pointer-events-auto">
        {/* DESK TILTED STATE */}
        <motion.div
          className={`relative cursor-pointer transition-transform duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-[1.02]'} drop-shadow-[5px_10px_15px_rgba(0,0,0,0.4)]`}
          style={{ width: 'clamp(260px, 22vw, 340px)', height: 'clamp(340px, 30vw, 440px)' }}
          animate={{ rotateZ: 4.5 }}
          onClick={toggleOpen}
        >
          <div 
            className="absolute inset-x-0 top-0 bottom-0 rounded-[8px] shadow-[inset_0_0_20px_rgba(40,20,0,0.4),0_2px_4px_rgba(0,0,0,0.3)] overflow-hidden border border-[#5c4026]/40"
            style={{ backgroundImage: `url(${woodImg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(80%) saturate(80%)' }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05 1.5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          </div>

          <div className="absolute top-8 bottom-3 left-3 right-5 bg-[#e8decf] shadow-[2px_4px_8px_rgba(0,0,0,0.3)] rounded-[2px] transform rotate-[1deg]">
            <div className="absolute inset-0" style={{ backgroundImage: `url(${paperImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
          </div>

          <div className="absolute top-9 bottom-2 left-4 right-4 bg-[#f4ebdc] shadow-[2px_2px_12px_rgba(0,0,0,0.25)] rounded-[2px]">
            <div className="absolute inset-0 border border-[#2b1f1a]/10 rounded-[2px]" style={{ backgroundImage: `url(${paperImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
            <div className="absolute w-full h-full p-6 text-[#2b1f1a]">
              <h3 className="font-serif text-[clamp(16px,1.5vw,20px)] font-bold border-b border-[#2b1f1a]/20 pb-2">Financial Summary</h3>
              <div className="mt-5 h-2 bg-[#2b1f1a]/20 w-[70%] rounded" />
              <div className="mt-4 h-2 bg-[#2b1f1a]/20 w-[50%] rounded" />
              <div className="mt-4 h-2 bg-[#2b1f1a]/20 w-[80%] rounded" />
              <div className="mt-8 flex gap-3 opacity-60">
                <div className="w-[30px] h-[30px] rounded-full bg-[#2b1f1a]/20" />
                <div className="w-[30px] h-[30px] rounded-full bg-[#2b1f1a]/20" />
                <div className="w-[30px] h-[30px] rounded-full bg-[#2b1f1a]/20" />
              </div>
            </div>
          </div>

          <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-[140px] h-[60px] bg-gradient-to-b from-[#e8e8e8] via-[#d0d0d0] to-[#b0b0b0] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[3px] rounded-br-[3px] shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.3)] border border-[#7a7a7a] z-20 pointer-events-none overflow-hidden block">
              <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8 1.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}} />
              <div className="absolute top-[8px] inset-x-[15%] h-[12px] bg-gradient-to-b from-[#fff] to-[#a0a0a0] rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] opacity-90" />
              <div className="absolute top-[10px] left-[30%] w-[15%] h-[5px] bg-[#909090] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              <div className="absolute top-[10px] right-[30%] w-[15%] h-[5px] bg-[#909090] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              <div className="absolute bottom-[2px] inset-x-0 h-[8px] bg-gradient-to-r from-[#707070] via-[#909090] to-[#707070] border-t border-[#505050] flex justify-around px-2 py-0.5">
                  {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-[4px] h-[4px] bg-[#505050] rounded-sm shadow-[1px_0_1px_rgba(255,255,255,0.4)]" />)}
              </div>
              <div className="absolute top-[25px] left-[15px] w-[12px] h-[12px] rounded-full bg-gradient-to-br from-[#ffffff] to-[#a0a0a0] shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,1),inset_-1px_-1px_3px_rgba(0,0,0,0.4)]" />
              <div className="absolute top-[25px] right-[15px] w-[12px] h-[12px] rounded-full bg-gradient-to-br from-[#ffffff] to-[#a0a0a0] shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,1),inset_-1px_-1px_3px_rgba(0,0,0,0.4)]" />
          </div>
        </motion.div>

        {/* ACTIVE PORTAL STATE */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center perspective-[2000px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={closeClipboard}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                  initial={{ scale: 0.7, y: 150, rotateZ: 4.5, rotateY: -10 }}
                  animate={{ scale: 1, y: 0, rotateZ: 0, rotateY: 0 }}
                  exit={{ scale: 0.7, y: 150, rotateZ: 4.5, rotateY: -10, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 25 }}
                  className="relative z-[110] drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]"
                  style={{ width: '532px', height: '672px' }}
                >
                  <div 
                    className="absolute inset-0 rounded-[11px] shadow-[inset_0_0_42px_rgba(40,20,0,0.5),0_14px_28px_rgba(0,0,0,0.4)] overflow-hidden border border-[#5c4026]/40"
                    style={{ backgroundImage: `url(${woodImg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(80%) saturate(80%)' }}
                  >
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05 1.5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
                  </div>

                  <div className="absolute top-[63px] bottom-[14px] left-[21px] right-[21px] bg-[#2b1f1a]/40 shadow-[0_5px_21px_rgba(0,0,0,0.5)]">
                    <HTMLFlipBook
                      width={490}
                      height={595}
                      size="fixed"
                      showCover={false}
                      useMouseEvents={true}
                      swipeDistance={5}
                      showPageCorners={true}
                      className="html-book pointer-events-auto"
                      ref={flipBookRef}
                      style={{ boxShadow: '0 0 14px rgba(0,0,0,0.2)' }}
                      drawShadow={true}
                      flippingTime={700}
                      usePortrait={true}
                      startZIndex={0}
                      maxShadowOpacity={0.8}
                      disableFlipByClick={false}
                    >
                      <Page number="1">
                        <h3 className="font-serif text-[32px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-2 text-[#2b1f1a] mix-blend-multiply">Retirement & Provident</h3>
                        <TranslatedSection 
                          title="EPF (Employee Provident)" 
                          jargon="Employer and employee mandated contributions calculated at 12% of basic salary, yielding compounding sovereign-backed returns with strict temporal withdrawal covenants." 
                        />
                        <TranslatedSection 
                          title="PPF (Public Provident)" 
                          jargon="A statutorily locked-in sovereign instrument compounding annually, restricting principal liquidation until a 15-year maturation horizon." 
                        />
                        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 1</p>
                      </Page>

                      <Page number="2">
                        <h3 className="font-serif text-[32px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-2 text-[#2b1f1a] mix-blend-multiply">Fixed Yield Assets</h3>
                        <TranslatedSection 
                          title="Term Deposit" 
                          jargon="Capital allocation locked in fixed-tenure deposit certificates yielding 7.10% per annum, subject to early-withdrawal penal clauses." 
                        />
                        <TranslatedSection 
                          title="Recurring Deposit" 
                          jargon="Monthly compulsory amortization into interest-bearing time deposits, aggregating principal over predetermined periodic cycles." 
                        />
                        <TranslatedSection 
                          title="Bonds & Debentures" 
                          jargon="Fixed-income debt instruments amortizing over an eight-year maturity cycle with semi-annual coupon distribution." 
                        />
                        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 2</p>
                      </Page>

                      <Page number="3">
                        <h3 className="font-serif text-[32px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-2 text-[#2b1f1a] mix-blend-multiply">Market-Linked Wealth</h3>
                        <TranslatedSection 
                          title="Mutual Funds" 
                          jargon="Systematic Investment Plans allocated 60/40 across large-cap equilibrium and short-duration debt structures, subject to NAV volatility." 
                        />
                        <TranslatedSection 
                          title="ETFs" 
                          jargon="Passively managed depository vehicles tracking the NIFTY 50 index with negligible expense ratios, facilitating broad market exposure." 
                        />
                        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 3</p>
                      </Page>

                      <Page number="4">
                        <h3 className="font-serif text-[32px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-2 text-[#2b1f1a] mix-blend-multiply">Safety Nets</h3>
                        <TranslatedSection 
                          title="Insurance Policies" 
                          jargon="Comprehensive term life contingencies hedging against mortality risk with high sum-assured multipliers relative to annualized premium outlays." 
                        />
                        <TranslatedSection 
                          title="ULIP" 
                          jargon="A hybrid structured product allocating partial premium towards mortality hedging while deploying the residual corpus into equity-linked NAVs." 
                        />
                        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 4</p>
                      </Page>

                      <Page number="5">
                        <h3 className="font-serif text-[32px] font-bold border-b-[3px] border-double border-[#2b1f1a]/30 pb-2 text-[#2b1f1a] mix-blend-multiply">Credit & Liabilities</h3>
                        <TranslatedSection 
                          title="Credit Cards" 
                          jargon="Unsecured revolving credit facilities operating on a 30-day interest-free billing cycle prior to extreme APR penal compound generation." 
                        />
                        <TranslatedSection 
                          title="Loan Folders" 
                          jargon="Secured amortizing debt obligations with front-loaded interest schedules and predefined equated monthly installment structures." 
                        />
                        <p className="absolute bottom-5 right-5 text-[15px] opacity-40 font-bold tracking-widest text-[#2b1f1a] mix-blend-multiply">PAGE 5</p>
                      </Page>
                    </HTMLFlipBook>

                    {/* OVERLAY NAVIGATION ZONES */}
                    {/* Top-right: clicking triggers flipPrev as extra affordance */}
                    <div 
                      className="absolute top-0 right-0 w-[50%] h-[50%] z-50 cursor-pointer" 
                      title="Previous Page"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (flipBookRef.current) flipBookRef.current.pageFlip().flipPrev();
                      }}
                    />

                  </div>

                  {/* Bottom-left curl — clip-path polygon tween outside flipbook */}
                  <div
                    className="absolute z-[300] cursor-pointer"
                    style={{ width: 90, height: 90, bottom: 14, left: 21 }}
                    onMouseEnter={() => setLeftCurlHovered(true)}
                    onMouseLeave={() => setLeftCurlHovered(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (flipBookRef.current) flipBookRef.current.pageFlip().flipPrev();
                    }}
                  >
                    {/* Shadow layer */}
                    <motion.div
                      animate={{
                        clipPath: leftCurlHovered
                          ? 'polygon(0% 100%, 0% 0%, 100% 100%)'
                          : 'polygon(0% 100%, 0% 100%, 0% 100%)'
                      }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.18)',
                        filter: 'blur(4px)',
                        transform: 'translate(4px,-4px)',
                      }}
                    />
                    {/* Curl flap — matches paper back colour */}
                    <motion.div
                      animate={{
                        clipPath: leftCurlHovered
                          ? 'polygon(0% 100%, 0% 0%, 100% 100%)'
                          : 'polygon(0% 100%, 0% 100%, 0% 100%)'
                      }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, #c4b89e 0%, #ddd3bf 100%)',
                        filter: 'drop-shadow(2px -2px 6px rgba(0,0,0,0.35))',
                      }}
                    />
                    {/* Inner lighter face */}
                    <motion.div
                      animate={{
                        clipPath: leftCurlHovered
                          ? 'polygon(6% 94%, 0% 0%, 94% 94%)'
                          : 'polygon(0% 100%, 0% 100%, 0% 100%)'
                      }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, #ede5d8 0%, #f7f3ee 100%)',
                      }}
                    />
                  </div>

                  <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 w-[252px] h-[105px] bg-gradient-to-b from-[#e8e8e8] via-[#d0d0d0] to-[#b0b0b0] rounded-tl-[17px] rounded-tr-[17px] rounded-bl-[5px] rounded-br-[5px] shadow-[0_21px_42px_rgba(0,0,0,0.8),inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-5px_11px_rgba(0,0,0,0.3)] border border-[#7a7a7a] z-20 pointer-events-none overflow-hidden block">
                      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8 1.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}} />
                      <div className="absolute top-[14px] inset-x-[15%] h-[21px] bg-gradient-to-b from-[#fff] to-[#a0a0a0] rounded-full shadow-[inset_0_-3px_5px_rgba(0,0,0,0.3)] opacity-90" />
                      <div className="absolute top-[18px] left-[30%] w-[15%] h-[8px] bg-[#909090] rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)]" />
                      <div className="absolute top-[18px] right-[30%] w-[15%] h-[8px] bg-[#909090] rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)]" />
                      <div className="absolute bottom-[3px] inset-x-0 h-[14px] bg-gradient-to-r from-[#707070] via-[#909090] to-[#707070] border-t border-[#505050] flex justify-around px-3 py-1.5">
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className="w-[5px] h-[8px] bg-[#505050] rounded-sm shadow-[1.4px_0_1.4px_rgba(255,255,255,0.4)]" />)}
                      </div>
                      <div className="absolute top-[42px] left-[28px] w-[21px] h-[21px] rounded-full bg-gradient-to-br from-[#ffffff] to-[#a0a0a0] shadow-[0_3px_5px_rgba(0,0,0,0.5),inset_1.4px_1.4px_3px_rgba(255,255,255,1),inset_-1.4px_-1.4px_4px_rgba(0,0,0,0.4)]" />
                      <div className="absolute top-[42px] right-[28px] w-[21px] h-[21px] rounded-full bg-gradient-to-br from-[#ffffff] to-[#a0a0a0] shadow-[0_3px_5px_rgba(0,0,0,0.5),inset_1.4px_1.4px_3px_rgba(255,255,255,1),inset_-1.4px_-1.4px_4px_rgba(0,0,0,0.4)]" />
                  </div>

                  <div className="absolute inset-x-0 bottom-[-56px] text-center text-white/50 text-[18px] font-bold tracking-widest pointer-events-none" style={{ textShadow: '0 3px 5px rgba(0,0,0,0.5)' }}>
                    CLICK OUTSIDE TO CLOSE
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
