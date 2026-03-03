import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
    {
        id: 'setup',
        badge: 'Preparation',
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

const InstructionPage = ({ onStart }) => {
    const [ current, setCurrent ] = useState( 0 );
    const slide = SLIDES[ current ];
    const isLast = current === SLIDES.length - 1;

    const handleNext = () => {
        if ( isLast ) {
            onStart();
        } else {
            setCurrent( ( p ) => p + 1 );
        }
    };

    return (
      <div
          style={ {
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
          } }
      >
          {/* Progress dots */ }
          <div style={ { display: 'flex', gap: 8, position: 'absolute', top: 32 } }>
              { SLIDES.map( ( _, i ) => (
                  <div
                key={ i }
                style={ {
                    width: i === current ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === current ? '#2F4A5C' : 'rgba(47,74,92,0.2)',
                    transition: 'all 0.3s ease',
                } }
            />
        ) ) }
          </div>

          <AnimatePresence mode="wait">
              <motion.div
                  key={ slide.id }
                  initial={ { opacity: 0, x: 60 } }
                  animate={ { opacity: 1, x: 0 } }
                  exit={ { opacity: 0, x: -60 } }
                  transition={ { duration: 0.35, ease: 'easeOut' } }
                  style={ {
                      maxWidth: 520,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                  } }
              >
                  {/* Badge */ }
                  <div
                      style={ {
                          background: 'rgba(255,255,255,0.5)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(47,74,92,0.1)',
                          borderRadius: 100,
                          padding: '6px 18px',
                          marginBottom: 20,
                      } }
                  >
                      <span
                          style={ {
                              color: '#2F4A5C',
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                          } }
                      >
                          { slide.badge }
                      </span>
                  </div>

                  {/* Headline */ }
                  <h1
                      style={ {
                          color: '#2F4A5C',
                          fontSize: 'clamp(22px, 5vw, 28px)',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          lineHeight: 1.3,
                          margin: '0 0 8px',
                      } }
                  >
                      { slide.headline }
                  </h1>

                  {/* Subheadline */ }
                  { slide.subheadline && (
                      <p
                          style={ {
                              color: 'rgba(47,74,92,0.6)',
                              fontSize: 'clamp(13px, 3.2vw, 15px)',
                              margin: '0 0 20px',
                          } }
                      >
                          { slide.subheadline }
                      </p>
                  ) }

                  {/* Bullets */ }
                  <ul
                      style={ {
                          listStyle: 'none',
                          padding: 0,
                          margin: '12px 0 20px',
                          textAlign: 'left',
                          width: '100%',
                          maxWidth: 440,
                      } }
                  >
                      { slide.bullets.map( ( b, i ) => (
                          <li
                              key={ i }
                              style={ {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        marginBottom: 12,
                        color: '#2F4A5C',
                        fontSize: 'clamp(13px, 3.2vw, 15px)',
                        lineHeight: 1.5,
                    } }
                >
                    <span
                        style={ {
                            flexShrink: 0,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#8FA99B',
                            marginTop: 7,
                        } }
                    />
                    { b }
                </li>
            ) ) }
                  </ul>

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

                  {/* CTA */ }
                  <button
                      onClick={ handleNext }
                      style={ {
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
                      } }
                  >
                      { slide.cta } →
                  </button>
              </motion.div>
          </AnimatePresence>
      </div>
  );
};

export default InstructionPage;