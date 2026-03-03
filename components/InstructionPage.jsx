import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── DATA (content untouched) ─── */
const SLIDES = [
    {
        id: 'setup',
        badge: 'Preparation',
        step: '01',
        headline: 'Set Yourself Up for Accurate Results',
        subheadline: 'For the most reliable scan:',
        bullets: [
            'Be alone in the frame (no pets or other people visible)',
            'Stand in a quiet, well-lit space',
            'Use consistent lighting (no shadows across your face)',
            'Remove glasses and heavy makeup if possible',
            'Wear fitted clothing so posture is visible',
            'Hair tied back and off shoulders — ears, neck, and shoulders must be visible',
        ],
        footer: 'You can take the photos yourself. No second person is required. The system guides you with a visual outline and countdown.',
        cta: "I'm Ready",
    },
    {
        id: 'howItWorks',
        badge: 'How It Works',
        step: '02',
        headline: 'How the Guided Capture Works',
        subheadline: null,
        bullets: [
            'Position yourself inside the outline',
            'When alignment is correct, the outline turns green',
            'A 5-second preparation window begins (2-second hold + 3-second countdown)',
            'A visible 3-2-1 countdown triggers the photo',
        ],
        footer: 'After capture, you\'ll review the image and may retake if needed.',
        narrative: 'You enter the ghost frame → green light shows you\'re positioned correctly → system waits 2 seconds to ensure you\'re stable → then 3-second countdown begins → capture. This gives users time to settle and prepare rather than feeling rushed.',
        cta: 'Start First Capture',
    },
];


/* ─── BULLET STAGGER ─── */
const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

/* ─── STYLES ─── */
const CSS = `
  .ip-wrap {
    min-height: 100dvh;
    display: flex;
    font-family: var(--font-body);
  }

  /* ── Left Panel ── */
  .ip-left {
    position: relative;
    flex: 0 0 320px;
    background: linear-gradient(175deg, #2F4A5C 0%, #1E3344 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    overflow: hidden;
  }
  .ip-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.65' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  .ip-ghost-num {
    font-family: var(--font-display);
    font-size: clamp(7rem, 18vw, 12rem);
    font-weight: 900;
    color: rgba(255,255,255,0.04);
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
  .ip-left-content {
    position: relative; z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
  }

  /* Vertical step nav */
  .ip-v-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 8px;
  }
  .ip-v-step {
    display: flex; align-items: center; gap: 10px;
  }
  .ip-v-step-dot {
    width: 10px; height: 10px; border-radius: 50%;
    border: 2px solid rgba(143,169,155,0.5);
    transition: all 0.3s ease;
  }
  .ip-v-step-dot.active {
    background: #8FA99B;
    border-color: #8FA99B;
    box-shadow: 0 0 8px rgba(143,169,155,0.5);
  }
  .ip-v-step-dot.done  { background: #8FA99B; border-color: #8FA99B; opacity: 0.5; }
  .ip-v-step-dot.upcoming { background: transparent; }
  .ip-v-step-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    transition: color 0.3s ease;
  }
  .ip-v-step-label.active  { color: #fff; }
  .ip-v-step-label.done    { color: rgba(255,255,255,0.45); }
  .ip-v-step-connector {
    width: 2px; height: 20px;
    background: rgba(143,169,155,0.2);
    margin-left: 4px;
  }

  /* ── Right Panel ── */
  .ip-right {
    flex: 1;
    position: relative;
    background: linear-gradient(165deg, #F8F5F0 0%, #F0EBE3 40%, #E8E1D7 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    overflow: hidden;
  }
  .ip-arc {
    position: absolute; top: -15%; right: -10%;
    width: 55%; height: 55%;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(143,169,155,0.1) 0%, transparent 70%);
    filter: blur(60px); pointer-events: none;
  }
  .ip-arc2 {
    position: absolute; bottom: -10%; left: -5%;
    width: 35%; height: 35%;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(47,74,92,0.05) 0%, transparent 70%);
    filter: blur(50px); pointer-events: none;
  }

  /* Badge */
  .ip-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 16px; border-radius: 100px;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(143,169,155,0.3);
    margin-bottom: 16px;
  }
  .ip-badge-pulse {
    width: 7px; height: 7px; border-radius: 50%;
    background: #8FA99B;
    animation: ip-pulse 2s ease-in-out infinite;
  }
  @keyframes ip-pulse {
    0%,100% { opacity:0.5; transform: scale(1); }
    50%     { opacity:1;   transform: scale(1.3); }
  }
  .ip-badge-text {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #2F4A5C;
  }

  /* Headline */
  .ip-headline {
    font-size: clamp(1.35rem, 4vw, 1.75rem);
    font-weight: 800; color: #2F4A5C;
    letter-spacing: -0.02em; line-height: 1.25;
    margin: 0 0 6px;
  }
  .ip-subheadline {
    font-size: clamp(13px, 3vw, 15px);
    color: rgba(47,74,92,0.6);
    margin: 0 0 16px; line-height: 1.5;
  }
  .ip-rule {
    height: 1px; width: 100%;
    background: rgba(143,169,155,0.2);
    margin-bottom: 18px;
  }

  /* Bullet list */
  .ip-list {
    list-style: none; padding: 0;
    margin: 0 0 20px; width: 100%;
    display: flex; flex-direction: column; gap: 10px;
  }
  .ip-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 10px 14px; border-radius: 12px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(143,169,155,0.15);
  }
  .ip-item-num {
    flex-shrink: 0; font-size: 10px;
    font-weight: 800; letter-spacing: 0.1em;
    color: #5A7A6E; padding-top: 2px;
  }
  .ip-item-text {
    font-size: clamp(12.5px, 2.8vw, 14px);
    line-height: 1.55; color: #1A1A1A;
  }

  /* Footer callout */
  .ip-callout {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 20px;
  }
  .ip-callout-icon { flex-shrink: 0; padding-top: 1px; }
  .ip-callout-text {
    font-size: clamp(11px, 2.5vw, 13px);
    color: rgba(47,74,92,0.55);
    line-height: 1.6; margin: 0;
  }

  /* CTA */
  .ip-cta-row { width: 100%; }
  .ip-cta {
    width: 100%; max-width: 360px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: #2F4A5C; color: #fff;
    border: none; border-radius: 14px;
    padding: 15px 28px;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(47,74,92,0.22);
    transition: all 0.3s ease;
  }
  .ip-cta:hover {
    box-shadow: 0 8px 32px rgba(47,74,92,0.3);
    transform: translateY(-1px);
  }
  .ip-cta-arrow {
    display: flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; border-radius: 6px;
    background: rgba(255,255,255,0.12);
  }

  /* ── Mobile: stack panels vertically ── */
  @media (max-width: 768px) {
    .ip-wrap { flex-direction: column; }
    .ip-left {
      flex: none;
      padding: 28px 24px 20px;
      min-height: auto;
    }
    .ip-ghost-num {
      font-size: 6rem;
      top: 40%; left: 50%;
    }
    .ip-right {
      padding: 28px 20px 40px;
    }
  }
`;

/* ─── COMPONENT ─── */
const InstructionPage = ({ onStart }) => {
    const [current, setCurrent] = useState(0);
    const slide = SLIDES[current];
    const isLast = current === SLIDES.length - 1;

    /* Inject CSS once */
    useEffect(() => {
        const id = 'ip-styles';
        if (!document.getElementById(id)) {
            const tag = document.createElement('style');
            tag.id = id;
            tag.textContent = CSS;
            document.head.appendChild(tag);
        }
        return () => {
            const tag = document.getElementById(id);
            if (tag) document.head.removeChild(tag);
        };
    }, []);

    const handleNext = () => {
        if (isLast) onStart();
        else setCurrent((p) => p + 1);
    };

    return (
        <div className="ip-wrap">

            {/* ══════════ LEFT PANEL ══════════ */}
            <div className="ip-left">
                <div className="ip-grain" aria-hidden="true" />

                {/* Ghost step number — the signature element */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={slide.step}
                        className="ip-ghost-num"
                        aria-hidden="true"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {slide.step}
                    </motion.span>
                </AnimatePresence>

                <div className="ip-left-content">
                    {/* Vertical step navigation */}
                    <div className="ip-v-steps">
                        {SLIDES.map((s, i) => {
                            const state = i < current ? 'done' : i === current ? 'active' : 'upcoming';
                            return (
                                <React.Fragment key={s.id}>
                                    <div className="ip-v-step">
                                        <div className={`ip-v-step-dot ${state}`} />
                                        <span className={`ip-v-step-label ${state}`}>{s.badge}</span>
                                    </div>
                                    {i < SLIDES.length - 1 && (
                                        <div className="ip-v-step-connector" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>


                    {/* Narrative summary */ }
                    { slide.narrative && (
                        <p
                            style={ {
                                color: 'rgba(47,74,92,0.72)',
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                lineHeight: 1.7,
                                maxWidth: 440,
                                margin: '0 0 20px',
                                textAlign: 'left',
                                fontStyle: 'italic',
                                padding: '12px 16px',
                                background: 'rgba(143,169,155,0.08)',
                                borderLeft: '3px solid rgba(143,169,155,0.4)',
                                borderRadius: '0 8px 8px 0',
                            } }
                        >
                            { slide.narrative }
                        </p>
                    ) }

                  {/* Footer note */ }
                  { slide.footer && (
                      <p
                          style={ {
                              color: 'rgba(47,74,92,0.55)',
                              fontSize: 'clamp(11px, 2.8vw, 13px)',
                              lineHeight: 1.6,
                              maxWidth: 400,
                              margin: '0 0 28px',
                          } }
                      >
                          { slide.footer }
                      </p>
                  ) }

                </div>{/* close ip-left-content */}
            </div>{/* close ip-left */}

            {/* ══════════ RIGHT PANEL ══════════ */}
            <div className="ip-right">
                <div className="ip-arc" aria-hidden="true" />
                <div className="ip-arc2" aria-hidden="true" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: 32, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -32, filter: 'blur(6px)' }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        {/* Badge */}
                        <div className="ip-badge">
                            <span className="ip-badge-pulse" />
                            <span className="ip-badge-text">{slide.badge}</span>
                        </div>

                        {/* Headline */}
                        <h1 className="ip-headline">{slide.headline}</h1>

                        {/* Subheadline */}
                        {slide.subheadline && (
                            <p className="ip-subheadline">{slide.subheadline}</p>
                        )}

                        {/* Thin rule */}
                        <div className="ip-rule" />

                        {/* Bullets — numbered list */}
                        <ul className="ip-list">
                            {slide.bullets.map((b, i) => (
                                <motion.li
                                    key={i}
                                    className="ip-item"
                                    custom={i}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <span className="ip-item-num">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="ip-item-text">{b}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Footer callout */}
                        {slide.footer && (
                            <motion.div
                                className="ip-callout"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.4 }}
                            >
                                <span className="ip-callout-icon" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <circle cx="8" cy="8" r="7" stroke="#8FA99B" strokeWidth="1.4" />
                                        <path d="M8 5v4M8 11v.5" stroke="#8FA99B" strokeWidth="1.6" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <p className="ip-callout-text">{slide.footer}</p>
                            </motion.div>
                        )}

                        {/* CTA row */}
                        <motion.div
                            className="ip-cta-row"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.4 }}
                        >
                            <button className="ip-cta" onClick={handleNext}>
                                {slide.cta}
                                <span className="ip-cta-arrow" aria-hidden="true">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5"
                                            stroke="#8FA99B" strokeWidth="1.6"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </button>


                        </motion.div>

                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
};

export default InstructionPage;