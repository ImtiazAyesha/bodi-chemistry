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
        footer: "After capture, you'll review the image and may retake if needed.",
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


                </div>
            </div>

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