import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';

/* Step 1 — What to Expect */
const STEPS_OVERVIEW = [
  {
    num: '01',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    label: 'Assessment',
    text: 'Complete a 20-question multiple choice body awareness assessment. You may notice that more than one answer applies. Choose the answer that feels closest to your experience — we identify your most dominant strategy.',
  },
  {
    num: '02',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
      </svg>
    ),
    label: 'Posture Capture',
    text: 'Capture 4 guided posture images — face, full body front and side views.',
  },
  {
    num: '03',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    label: 'Your Report',
    text: 'Receive a personalised pressure pattern report.',
  },
];

/* Step 2 — Body Awareness Assessment instructions */
const INSTRUCTIONS = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    text: 'You may relate to more than one answer.',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    text: 'Choose the option that feels most dominant or most consistent over time.',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    text: 'There are no right or wrong answers.',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    text: 'Respond honestly for the most accurate results.',
  },
];

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Shared glassmorphic card base — responsive padding handled via CSS class */
const cardStyleBase = {
  background: 'rgba(255,255,255,0.52)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(143,169,155,0.2)',
  boxShadow: '0 4px 24px rgba(47,74,92,0.07)',
  borderRadius: 20,
  flex: 1,
  minWidth: 0,
};

/* Slide variants for mobile panel transitions */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '55%' : '-55%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({
    x: dir > 0 ? '-55%' : '55%', opacity: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
  }),
};

const OnboardingSlides = ({ onComplete }) => {
  const [activePanel, setActivePanel] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > activePanel ? 1 : -1);
    setActivePanel(idx);
  };

  /* ── Panel 1 content ── */
  const panel1 = (
    <motion.div
      key="p1"
      custom={isMobile ? direction : 1}
      variants={isMobile ? slideVariants : fadeUp}
      initial={isMobile ? 'enter' : 'hidden'}
      animate={isMobile ? 'center' : 'visible'}
      exit={isMobile ? 'exit' : undefined}
      className="ob-card"
      style={cardStyleBase}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#2F4A5C',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>1</span>
        </div>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8FA99B', margin: 0 }}>
            Overview
          </p>
          <h2 style={{ fontSize: 'clamp(1.05rem, 4vw, 1.5rem)', fontWeight: 800, color: '#2F4A5C', letterSpacing: '-0.02em', margin: 0 }}>
            What to <span style={{ color: '#5A7A6E' }}>Expect</span>
          </h2>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(143,169,155,0.2)', marginBottom: 18 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STEPS_OVERVIEW.map((step) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 14px', borderRadius: 14,
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(143,169,155,0.15)',
            }}
          >
            <div style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: 10,
              background: 'rgba(143,169,155,0.12)', border: '1px solid rgba(143,169,155,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
            }}>
              {step.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A7A6E', margin: '0 0 4px' }}>
                {step.num} · {step.label}
              </p>
              <p style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', lineHeight: 1.6, color: '#1A1A1A', margin: 0 }}>
                {step.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  /* ── Panel 2 content ── */
  const panel2 = (
    <motion.div
      key="p2"
      custom={isMobile ? direction : 2}
      variants={isMobile ? slideVariants : fadeUp}
      initial={isMobile ? 'enter' : 'hidden'}
      animate={isMobile ? 'center' : 'visible'}
      exit={isMobile ? 'exit' : undefined}
      className="ob-card ob-card-accent"
      style={cardStyleBase}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          border: '2px solid #5A7A6E',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative',
        }}>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -5, borderRadius: '50%',
              border: '1.5px solid rgba(90,122,110,0.4)',
            }}
          />
          <span style={{ color: '#5A7A6E', fontSize: 13, fontWeight: 800 }}>2</span>
        </div>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8FA99B', margin: 0 }}>
            Before You Begin
          </p>
          <h2 style={{ fontSize: 'clamp(1.05rem, 4vw, 1.5rem)', fontWeight: 800, color: '#2F4A5C', letterSpacing: '-0.02em', margin: 0 }}>
            Body <span style={{ color: '#5A7A6E' }}>Awareness</span>
          </h2>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(143,169,155,0.2)', marginBottom: 18 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: isMobile ? 0 : 28 }}>
        {INSTRUCTIONS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(143,169,155,0.15)',
            }}
          >
            <div style={{
              flexShrink: 0, width: 30, height: 30, borderRadius: 9,
              background: 'rgba(143,169,155,0.12)', border: '1px solid rgba(143,169,155,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.icon}
            </div>
            <p style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', lineHeight: 1.55, color: '#1A1A1A', margin: 0 }}>
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA — only on desktop; mobile uses the nav bar */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            whileHover={{ scale: 1.025, boxShadow: '0 12px 40px rgba(47,74,92,0.28)' }}
            whileTap={{ scale: 0.975 }}
            onClick={onComplete}
            style={{
              width: '100%',
              background: '#2F4A5C', color: '#fff',
              border: 'none', borderRadius: 14,
              padding: '15px 28px',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(47,74,92,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'box-shadow 0.3s ease',
            }}
          >
            Begin Assessment
            <FiArrowRight style={{ width: 15, height: 15 }} />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );

  /* ── Mobile bottom nav bar ── */
  const mobileNav = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: '0 4px',
        gap: 12,
      }}
    >
      {/* Back arrow */}
      <motion.button
        whileHover={activePanel !== 0 ? { scale: 1.08 } : {}}
        whileTap={activePanel !== 0 ? { scale: 0.92 } : {}}
        onClick={() => activePanel !== 0 && goTo(0)}
        disabled={activePanel === 0}
        aria-label="Previous panel"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: activePanel === 0 ? 'rgba(143,169,155,0.1)' : 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(143,169,155,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: activePanel === 0 ? 'default' : 'pointer',
          boxShadow: activePanel === 0 ? 'none' : '0 2px 12px rgba(47,74,92,0.1)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        <FiArrowLeft style={{
          width: 16, height: 16,
          color: activePanel === 0 ? '#C9D8D2' : '#2F4A5C',
          transition: 'color 0.2s ease',
        }} />
      </motion.button>

      {/* Dot indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {[0, 1].map((idx) => (
          <motion.button
            key={idx}
            onClick={() => goTo(idx)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            animate={{ width: activePanel === idx ? 22 : 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`Go to panel ${idx + 1}`}
            style={{
              height: 8,
              borderRadius: 4,
              background: activePanel === idx ? '#2F4A5C' : 'rgba(143,169,155,0.4)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Forward arrow on panel 1 / "Begin" CTA on panel 2 */}
      {activePanel === 0 ? (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => goTo(1)}
          aria-label="Next panel"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#2F4A5C',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(47,74,92,0.28)',
            flexShrink: 0,
          }}
        >
          <FiArrowRight style={{ width: 16, height: 16, color: '#fff' }} />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(47,74,92,0.32)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onComplete}
          aria-label="Begin Assessment"
          style={{
            height: 44,
            paddingLeft: 18, paddingRight: 18,
            borderRadius: 22,
            background: '#2F4A5C', color: '#fff',
            border: 'none',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(47,74,92,0.22)',
            display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Begin
          <FiArrowRight style={{ width: 14, height: 14 }} />
        </motion.button>
      )}
    </motion.div>
  );

  return (
    <>
      <div className="ob-root">
        {/* Ambient glows */}
        <div aria-hidden style={{
          position: 'absolute', top: '-8%', left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '45%',
          background: 'radial-gradient(ellipse, rgba(143,169,155,0.14) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '40%', height: '40%',
          background: 'radial-gradient(ellipse, rgba(47,74,92,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 960 }}>

          {/* ── Horizontal Timeline Header ── */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="ob-timeline"
          >
            {/* Step 1 node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#2F4A5C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(47,74,92,0.25)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" />
                </svg>
              </div>
              <span className="ob-timeline-label" style={{ color: '#2F4A5C' }}>
                1 of 2 · Overview
              </span>
            </div>

            {/* Connecting line */}
            <div className="ob-timeline-line">
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(143,169,155,0.35)', borderRadius: 2 }} />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, #5A7A6E, rgba(143,169,155,0.4))',
                  borderRadius: 2, transformOrigin: 'left',
                }}
              />
              <div style={{
                position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                color: '#8FA99B', fontSize: 12, lineHeight: 1,
              }}>›</div>
            </div>

            {/* Step 2 node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                border: '2px solid #5A7A6E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A6E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="ob-timeline-label" style={{ color: '#5A7A6E' }}>
                2 of 2 · Assessment
              </span>
            </div>
          </motion.div>

          {/* ── Panels ── */}
          {isMobile ? (
            /* Mobile: one panel at a time with slide transition */
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait" custom={direction}>
                {activePanel === 0 ? panel1 : panel2}
              </AnimatePresence>
              {mobileNav}
            </div>
          ) : (
            /* Desktop: both panels side by side */
            <div className="ob-panels">
              {panel1}
              {panel2}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default OnboardingSlides;
