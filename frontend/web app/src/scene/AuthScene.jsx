import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight, AlertCircle } from 'lucide-react';
import woodImg from '../assets/wood_desk.png';
import paperImg from '../assets/paper.jpg';

/* ─── tiny helper ─── */
const InputField = ({ id, type, placeholder, value, onChange, icon: Icon, toggle, onToggle }) => (
  <div className="auth-input-wrapper">
    <Icon size={14} className="auth-input-icon" />
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="auth-input"
      autoComplete={type === 'password' ? 'current-password' : 'email'}
    />
    {toggle !== undefined && (
      <button type="button" className="auth-eye-btn" onClick={onToggle} tabIndex={-1} aria-label="Toggle password">
        {toggle ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    )}
  </div>
);

export function AuthScene() {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  const reset = () => { setError(''); setInfo(''); };

  /* ── Google ── */
  const handleGoogle = async () => {
    reset();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError('Google sign-in failed. Check Firebase config in .env');
    } finally { setLoading(false); }
  };

  /* ── Email Sign-In ── */
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please fill in all fields.');
    reset();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const msg = e.code === 'auth/invalid-credential'
        ? 'Incorrect email or password.'
        : e.code === 'auth/user-not-found'
          ? 'No account found with that email.'
          : 'Sign-in failed. Try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  /* ── Email Sign-Up (disabled – redirect to mobile) ── */
  const handleEmailSignUp = (e) => {
    e.preventDefault();
    setInfo('');
    setError('Account creation is only available on the Monager mobile app.');
  };

  const isSignUp = tab === 'signup';

  return (
    <>
      <style>{`
        /* ─── Auth root ─── */
        .auth-root {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1208;
          overflow: hidden;
          position: relative;
        }
        .auth-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(35%) saturate(60%);
          z-index: 0;
        }
        .auth-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%);
          z-index: 1;
          pointer-events: none;
        }

        /* ─── Card shell ─── */
        .auth-card {
          position: relative;
          z-index: 10;
          display: flex;
          width: 90%;
          max-width: 820px;
          border-radius: 2px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06);
          overflow: hidden;
        }

        /* ─── Left: paper document ─── */
        .auth-paper {
          flex: 1;
          background: #f5e6cf;
          padding: 52px 48px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .auth-paper-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: multiply;
          opacity: 0.45;
        }
        .auth-paper-edge {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 60px rgba(80,45,10,0.35);
          pointer-events: none;
          mix-blend-mode: multiply;
        }
        .auth-paper-line {
          position: absolute;
          left: 68px;
          top: 0; bottom: 0;
          width: 1px;
          background: rgba(180,120,60,0.18);
          pointer-events: none;
        }

        /* ─── Brand stamp ─── */
        .auth-stamp {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
        }
        .auth-stamp-box {
          width: 42px; height: 42px;
          border: 2px solid #2b1f1a;
          display: flex; align-items: center; justify-content: center;
          transform: rotate(1.5deg);
          flex-shrink: 0;
        }
        .auth-stamp-box-inner {
          width: calc(100% - 6px); height: calc(100% - 6px);
          border: 1px dashed rgba(43,31,26,0.4);
          display: flex; align-items: center; justify-content: center;
        }
        .auth-stamp-letter {
          font-family: 'Georgia', serif;
          font-size: 22px;
          font-weight: 700;
          color: #2b1f1a;
        }
        .auth-brand-name {
          font-family: 'Georgia', serif;
          font-size: 26px;
          font-weight: 700;
          color: #2b1f1a;
          line-height: 1;
          letter-spacing: -0.5px;
        }
        .auth-brand-sub {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #3d2510;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 3px;
          opacity: 1;
          font-weight: 600;
        }

        /* ─── Tabs ─── */
        .auth-tabs {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 0;
          border-bottom: 1.5px solid rgba(43,31,26,0.2);
          margin-bottom: 28px;
        }
        .auth-tab {
          background: none;
          border: none; border-bottom: 2.5px solid transparent;
          margin-bottom: -1.5px;
          padding: 8px 18px 10px;
          font-family: 'Courier New', monospace;
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #3d2510;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 700;
        }
        .auth-tab:hover { color: #1a0d05; }
        .auth-tab.active {
          color: #1a0d05;
          border-bottom-color: #1a0d05;
        }

        /* ─── Form ─── */
        .auth-form { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 12px; }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(43,31,26,0.22);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input-wrapper:focus-within {
          border-color: rgba(43,31,26,0.55);
          box-shadow: 0 0 0 3px rgba(43,31,26,0.07);
        }
        .auth-input-icon {
          margin-left: 13px;
          color: #6b4f3a;
          flex-shrink: 0;
        }
        .auth-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          padding: 13px 12px;
          font-family: 'Georgia', serif;
          font-size: 14px;
          color: #2b1f1a;
        }
        .auth-input::placeholder { color: #9a7d65; }
        .auth-eye-btn {
          background: none; border: none; cursor: pointer;
          padding: 0 12px; color: #3d2510;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .auth-eye-btn:hover { color: #2b1f1a; }

        /* ─── Error / Info banners ─── */
        .auth-error {
          display: flex; align-items: flex-start; gap: 8px;
          background: rgba(139,0,0,0.1);
          border-left: 3px solid rgba(139,0,0,0.65);
          padding: 11px 13px;
          font-family: 'Georgia', serif;
          font-size: 13.5px;
          color: #7a0000;
          line-height: 1.5;
        }
        .auth-info {
          display: flex; align-items: flex-start; gap: 8px;
          background: rgba(30,90,30,0.1);
          border-left: 3px solid rgba(30,100,30,0.55);
          padding: 11px 13px;
          font-family: 'Georgia', serif;
          font-size: 13.5px;
          color: #174d17;
          line-height: 1.5;
        }

        /* ─── Primary button ─── */
        .auth-btn-primary {
          position: relative;
          width: 100%;
          background: #1c120c;
          border: 1px solid #1c120c;
          color: #e6d0a7;
          font-family: 'Georgia', serif;
          font-size: 14px;
          font-weight: 600;
          padding: 15px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.25s, transform 0.15s;
          margin-top: 4px;
        }
        .auth-btn-primary:hover:not(:disabled) { background: #110a06; transform: translateY(-1px); }
        .auth-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .auth-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-btn-inner-border {
          position: absolute;
          inset: 3px;
          border: 1px solid rgba(212,175,55,0.2);
          pointer-events: none;
          transition: border-color 0.2s;
        }
        .auth-btn-primary:hover .auth-btn-inner-border { border-color: rgba(212,175,55,0.4); }

        /* ─── Divider ─── */
        .auth-divider {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .auth-divider-line {
          flex: 1; height: 1px; background: rgba(43,31,26,0.2);
        }
        .auth-divider-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3d2510;
          flex-shrink: 0;
          font-weight: 600;
        }

        /* ─── Google button ─── */
        .auth-btn-google {
          position: relative; z-index: 2;
          width: 100%;
          background: #fff;
          border: 1.5px solid rgba(43,31,26,0.2);
          color: #2b1f1a;
          font-family: 'Georgia', serif;
          font-size: 13.5px;
          font-weight: 600;
          padding: 13px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .auth-btn-google:hover:not(:disabled) {
          background: #f9f4ee;
          border-color: rgba(43,31,26,0.4);
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          transform: translateY(-1px);
        }
        .auth-btn-google:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ─── Footer seal ─── */
        .auth-seal {
          position: relative; z-index: 2;
          margin-top: auto;
          padding-top: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b4f3a;
        }
        .auth-seal-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 700;
        }

        /* ─── Right: wood panel ─── */
        .auth-panel {
          width: 280px;
          flex-shrink: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 48px 32px;
          gap: 0;
        }
        .auth-panel-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(38%) saturate(70%) sepia(15%);
        }
        .auth-panel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(40,25,10,0.7) 0%, rgba(20,12,5,0.88) 100%);
        }
        .auth-panel-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
        }
        .auth-panel-icon-ring {
          width: 72px; height: 72px;
          border: 1.5px solid rgba(212,175,55,0.35);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .auth-panel-icon-ring::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px dashed rgba(212,175,55,0.2);
          border-radius: 50%;
        }
        .auth-panel-headline {
          font-family: 'Georgia', serif;
          font-size: 19px;
          font-weight: 700;
          color: #e6d0a7;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }
        .auth-panel-body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: rgba(230,208,167,0.85);
          line-height: 1.75;
          letter-spacing: 0.03em;
        }
        .auth-panel-divider {
          width: 40px; height: 1px;
          background: rgba(212,175,55,0.3);
        }

        /* Mobile-app CTA */
        .auth-mobile-cta {
          position: relative; z-index: 2;
          margin-top: 32px;
          background: rgba(212,175,55,0.07);
          border: 1px solid rgba(212,175,55,0.22);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          border-radius: 1px;
          text-align: center;
          width: 100%;
        }
        .auth-mobile-cta-label {
          font-family: 'Courier New', monospace;
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.88);
          font-weight: 700;
        }
        .auth-mobile-cta-text {
          font-family: 'Georgia', serif;
          font-size: 13.5px;
          color: rgba(230,208,167,0.95);
          line-height: 1.55;
        }
        .auth-mobile-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(212,175,55,0.12);
          border: 1px solid rgba(212,175,55,0.3);
          padding: 6px 14px;
          border-radius: 20px;
        }
        .auth-mobile-badge-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(212,175,55,1);
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .auth-panel { display: none; }
          .auth-paper { padding: 40px 32px; }
        }
        @media (max-width: 400px) {
          .auth-paper { padding: 32px 22px; }
        }
      `}</style>

      <div className="auth-root">
        {/* Background */}
        <div className="auth-bg" style={{ backgroundImage: `url(${woodImg})` }} />
        <div className="auth-vignette" />

        {/* Card */}
        <motion.div
          className="auth-card"
          initial={{ y: 36, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.05 }}
        >
          {/* ─── Left: Paper Document ─── */}
          <div className="auth-paper">
            {/* Paper texture + edge */}
            <div
              className="auth-paper-texture"
              style={{ backgroundImage: `url(${paperImg})`, backgroundSize: '200px auto' }}
            />
            <div className="auth-paper-edge" />
            <div className="auth-paper-line" />

            {/* Brand */}
            <div className="auth-stamp">
              <div className="auth-stamp-box">
                <div className="auth-stamp-box-inner">
                  <span className="auth-stamp-letter">M</span>
                </div>
              </div>
              <div>
                <div className="auth-brand-name">Monager</div>
                <div className="auth-brand-sub">Personal Finance Ledger</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => { setTab('signin'); reset(); }}
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { setTab('signup'); reset(); }}
              >
                Create Account
              </button>
            </div>

            {/* Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  className="auth-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginBottom: 14, position: 'relative', zIndex: 2 }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  {error}
                </motion.div>
              )}
              {info && (
                <motion.div
                  key="info"
                  className="auth-info"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginBottom: 14, position: 'relative', zIndex: 2 }}
                >
                  {info}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Sign In form ── */}
            <AnimatePresence mode="wait">
              {tab === 'signin' ? (
                <motion.form
                  key="signin"
                  className="auth-form"
                  onSubmit={handleEmailSignIn}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <InputField
                    id="auth-email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    icon={Mail}
                  />
                  <InputField
                    id="auth-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    icon={Lock}
                    toggle={showPass}
                    onToggle={() => setShowPass(p => !p)}
                  />

                  <button
                    type="submit"
                    id="auth-signin-btn"
                    className="auth-btn-primary"
                    disabled={loading}
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    <div className="auth-btn-inner-border" />
                    {loading
                      ? <span style={{ fontFamily: 'Courier New, monospace', fontSize: 11, letterSpacing: '0.15em' }}>AUTHORIZING...</span>
                      : <><span>Sign In</span><ArrowRight size={15} /></>
                    }
                  </button>

                  {/* Divider */}
                  <div className="auth-divider" style={{ position: 'relative', zIndex: 2, margin: '18px 0' }}>
                    <div className="auth-divider-line" />
                    <span className="auth-divider-text">or continue with</span>
                    <div className="auth-divider-line" />
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    id="auth-google-btn"
                    className="auth-btn-google"
                    onClick={handleGoogle}
                    disabled={loading}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </button>
                </motion.form>
              ) : (
                /* ── Create Account tab ── */
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  {/* Decorative "sealed" notice */}
                  <div style={{
                    background: 'rgba(43,31,26,0.05)',
                    border: '1.5px dashed rgba(43,31,26,0.2)',
                    padding: '28px 24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                  }}>
                    <div style={{
                      width: 52, height: 52,
                      borderRadius: '50%',
                      background: 'rgba(30,20,10,0.08)',
                      border: '1.5px solid rgba(43,31,26,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Smartphone size={22} color="rgba(43,31,26,0.6)" />
                    </div>
                    <p style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 14.5,
                      color: '#2b1f1a',
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      Account creation is available on the <strong>Monager mobile app</strong>.
                    </p>
                    <p style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: 10,
                      color: 'rgba(43,31,26,0.5)',
                      letterSpacing: '0.08em',
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      Download the app on iOS or Android, register your account, then sign in here using your credentials.
                    </p>
                    <div style={{
                      display: 'flex', gap: 8,
                    }}>
                      <div style={{
                        background: '#1c120c',
                        color: '#e6d0a7',
                        fontFamily: 'Courier New, monospace',
                        fontSize: 9.5,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '7px 16px',
                        fontWeight: 700,
                        opacity: 0.85,
                      }}>
                        App Store
                      </div>
                      <div style={{
                        background: '#1c120c',
                        color: '#e6d0a7',
                        fontFamily: 'Courier New, monospace',
                        fontSize: 9.5,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '7px 16px',
                        fontWeight: 700,
                        opacity: 0.85,
                      }}>
                        Google Play
                      </div>
                    </div>
                  </div>

                  <div className="auth-divider" style={{ margin: '18px 0' }}>
                    <div className="auth-divider-line" />
                    <span className="auth-divider-text">already have an account?</span>
                    <div className="auth-divider-line" />
                  </div>

                  <button
                    className="auth-btn-google"
                    onClick={() => { setTab('signin'); reset(); }}
                  >
                    <ArrowRight size={14} />
                    Sign in instead
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security seal */}
            <div className="auth-seal">
              <ShieldCheck size={13} />
              <span className="auth-seal-text">Encrypted Firebase Session</span>
            </div>
          </div>

          {/* ─── Right: Wood Panel ─── */}
          <div className="auth-panel">
            <div className="auth-panel-bg" style={{ backgroundImage: `url(${woodImg})` }} />
            <div className="auth-panel-overlay" />

            <div className="auth-panel-content" style={{ width: '100%' }}>
              <div className="auth-panel-icon-ring">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M2 17l10 5 10-5" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M2 12l10 5 10-5" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <p className="auth-panel-headline">Your Personal<br />Finance Ledger</p>
              </div>

              <div className="auth-panel-divider" />

              <p className="auth-panel-body">
                Track budgets, log expenses, and manage your savings goals — all in one beautifully crafted notebook.
              </p>
            </div>

            {/* Mobile CTA */}
            <div className="auth-mobile-cta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Smartphone size={13} color="rgba(212,175,55,0.6)" />
                <span className="auth-mobile-cta-label">New here?</span>
              </div>
              <p className="auth-mobile-cta-text">
                Create your account on the Monager mobile app.
              </p>
              <div className="auth-mobile-badge">
                <Smartphone size={11} color="rgba(212,175,55,0.8)" />
                <span className="auth-mobile-badge-text">iOS & Android</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
