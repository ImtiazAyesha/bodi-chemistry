import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 'welcome',
    badge: 'Welcome',
    headline: 'Welcome to the Bodi KEMISTRI™ Body Scan',
    subheadline:
      'This assessment takes approximately 12–15 minutes. If you leave the scan and come back you will be asked to start from the beginning.',
    bullets: [
      'This scan identifies how your body is organizing internal pressure and stability',
      'Your body works as one system — when one area compensates, the entire structure adjusts',
      'The questionnaire includes approximately 20 questions',
      'It must be completed in one sitting',
    ],
    cta: 'Begin Scan',
  },
  {
    id: 'expect',
    badge: 'Overview',
    headline: 'What to Expect',
    subheadline: null,
    bullets: [
      'Complete a 20-question body awareness assessment — choose the answer that feels closest to your experience. We identify your most dominant strategy.',
      'Capture 4 guided posture images (face, full body front + side views)',
      'Receive a personalized pressure pattern report',
    ],
    cta: 'Continue',
  },
];

/* ── Breathing animation for slide 1 ─────────────────────────────── */
const BreathingIcon = () => (
  <motion.div
    animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      border: '2px solid rgba(143,169,155,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    }}
  >
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8FA99B" strokeWidth="1.5">
      <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12Z" />
      <path d="M12 13V8" strokeLinecap="round" />
      <path d="M9 10l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </motion.div>
);

const OnboardingSlides = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent((p) => p + 1);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#EFE9DF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, position: 'absolute', top: 32 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? '#2F4A5C' : 'rgba(47,74,92,0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            maxWidth: 520,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Breathing icon on slide 1 */}
          {current === 0 && <BreathingIcon />}

          {/* Badge */}
          <div
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(47,74,92,0.1)',
              borderRadius: 100,
              padding: '6px 18px',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                color: '#2F4A5C',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {slide.badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              color: '#2F4A5C',
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              margin: '0 0 12px',
            }}
          >
            {slide.headline}
          </h1>

          {/* Subheadline */}
          {slide.subheadline && (
            <p
              style={{
                color: 'rgba(47,74,92,0.7)',
                fontSize: 'clamp(13px, 3.2vw, 15px)',
                lineHeight: 1.6,
                margin: '0 0 24px',
                maxWidth: 440,
              }}
            >
              {slide.subheadline}
            </p>
          )}

          {/* Bullets */}
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 36px',
              textAlign: 'left',
              width: '100%',
              maxWidth: 440,
            }}
          >
            {slide.bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 14,
                  color: '#2F4A5C',
                  fontSize: 'clamp(13px, 3.2vw, 15px)',
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#8FA99B',
                    marginTop: 7,
                  }}
                />
                {b}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleNext}
            style={{
              background: '#2F4A5C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 16,
              padding: '16px 40px',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(47,74,92,0.2)',
              width: '100%',
              maxWidth: 320,
            }}
          >
            {slide.cta} →
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingSlides;
