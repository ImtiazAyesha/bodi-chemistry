import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { QUESTIONNAIRE_DATA } from '../config/questionnaireData.js';
import { calculateQuestionnaireScores } from '../utils/questionnaireScoring.js';

/* ─── tiny responsive hook ─────────────────────────────────── */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const Questionnaire = ({ onComplete }) => {
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));

  const currentQuestion = QUESTIONNAIRE_DATA[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / 20) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  const handleSubmit = (finalAnswers) => {
    const result = calculateQuestionnaireScores(finalAnswers);
    onComplete({
      answers: finalAnswers,
      rawScores: result.rawScores,
      normalizedScores: result.normalizedScores,
      metadata: result.metadata,
    });
  };

  const handleAnswer = (optionLabel) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionLabel;
    setAnswers(newAnswers);
    if (currentQuestionIndex < 19) {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < 19) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  /* ── responsive tokens ───────────────────────────── */
  const sm = isMobile; // shorthand

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(165deg, #F8F5F0 0%, #F0EBE3 40%, #E8E1D7 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: sm ? '20px 12px 36px' : '24px 16px 48px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Ambient glows */}
      <div aria-hidden style={{
        position: 'fixed', top: '-10%', right: '-10%', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(143,169,155,0.18) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'fixed', bottom: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(47,74,92,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'fixed', inset: 0, opacity: 0.025, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#2F4A3C 1px, transparent 1px), linear-gradient(90deg, #2F4A3C 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* ── Centered header ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 640,
        textAlign: 'center',
        marginBottom: sm ? 20 : 28,
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: sm ? '1.25rem' : 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 800, color: '#2F4A5C',
          letterSpacing: '-0.025em', lineHeight: 1.2,
          margin: sm ? '0 0 12px' : '0 0 14px',
        }}>
          Body <span style={{ color: '#5A7A6E' }}>Awareness</span> Assessment
        </h1>

        {/* Badge: on mobile show one line to avoid wrapping */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          gap: sm ? 6 : 8,
          background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(143,169,155,0.28)', borderRadius: 100,
          padding: sm ? '4px 12px' : '5px 15px',
          marginBottom: sm ? 14 : 18,
          flexWrap: 'nowrap',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8FA99B', flexShrink: 0 }} />
          <span style={{ fontSize: sm ? 9 : 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2F4A5C', whiteSpace: 'nowrap' }}>
            Q{currentQuestionIndex + 1} of 20
          </span>
          <span style={{ width: 1, height: 10, background: 'rgba(47,74,92,0.15)', flexShrink: 0 }} />
          <span style={{ fontSize: sm ? 9 : 10, fontWeight: 600, color: 'rgba(47,74,92,0.5)', whiteSpace: 'nowrap' }}>
            {answeredCount} done
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: sm ? 3 : 4, background: 'rgba(47,74,92,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(to right, #5A7A6E, #8FA99B)' }}
          />
        </div>
      </div>

      {/* ── Unified question container ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 640 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outer card */}
            <div style={{
              background: 'rgba(255,255,255,0.62)',
              backdropFilter: 'blur(22px)',
              border: '1px solid rgba(143,169,155,0.22)',
              boxShadow: '0 6px 40px rgba(47,74,92,0.09)',
              borderRadius: sm ? 18 : 24,
              padding: sm ? '20px 16px 18px' : '28px 24px 24px',
              marginBottom: sm ? 12 : 16,
            }}>
              {/* Q tag */}
              <span style={{
                display: 'inline-block', marginBottom: sm ? 10 : 14,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#5A7A6E',
                background: 'rgba(90,122,110,0.08)', border: '1px solid rgba(90,122,110,0.22)',
                borderRadius: 6, padding: '2px 8px',
              }}>
                Q{currentQuestionIndex + 1}
              </span>

              {/* Question text */}
              <h2 style={{
                fontSize: sm ? '0.98rem' : 'clamp(1.05rem, 3vw, 1.35rem)',
                fontWeight: 700, color: '#1A1A1A',
                letterSpacing: '-0.015em', lineHeight: 1.45,
                margin: sm ? '0 0 16px' : '0 0 24px',
              }}>
                {currentQuestion.question}
              </h2>

              {/* Option cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: sm ? 8 : 10 }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestionIndex] === option.label;
                  return (
                    <motion.button
                      key={option.label}
                      onClick={() => handleAnswer(option.label)}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        width: '100%', textAlign: 'left',
                        display: 'flex', alignItems: 'center',
                        gap: sm ? 12 : 16,
                        padding: sm ? '12px 14px' : '15px 18px',
                        borderRadius: sm ? 12 : 16,
                        cursor: 'pointer',
                        border: isSelected
                          ? '1.5px solid rgba(90,122,110,0.5)'
                          : '1px solid rgba(143,169,155,0.22)',
                        background: isSelected
                          ? 'rgba(90,122,110,0.08)'
                          : 'rgba(255,255,255,0.72)',
                        boxShadow: isSelected
                          ? '0 2px 14px rgba(90,122,110,0.1)'
                          : '0 1px 6px rgba(47,74,92,0.04)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Letter label */}
                      <span style={{
                        flexShrink: 0, width: sm ? 18 : 22,
                        fontSize: sm ? 10 : 11, fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase', textAlign: 'center',
                        color: isSelected ? '#5A7A6E' : 'rgba(47,74,92,0.38)',
                        transition: 'color 0.2s ease',
                      }}>
                        {option.label}
                      </span>

                      {/* Vertical divider */}
                      <span style={{
                        flexShrink: 0, width: 1, alignSelf: 'stretch',
                        background: isSelected ? 'rgba(90,122,110,0.28)' : 'rgba(47,74,92,0.1)',
                        borderRadius: 1, transition: 'background 0.2s ease',
                      }} />

                      {/* Option text */}
                      <span style={{
                        flex: 1,
                        fontSize: sm ? '0.8rem' : 'clamp(13.5px, 2.8vw, 15px)',
                        lineHeight: 1.5,
                        color: isSelected ? '#1A1A1A' : 'rgba(47,74,92,0.75)',
                        fontWeight: isSelected ? 500 : 400,
                        transition: 'color 0.2s ease',
                      }}>
                        {option.text}
                      </span>

                      {/* Check */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            flexShrink: 0,
                            width: sm ? 18 : 22, height: sm ? 18 : 22,
                            borderRadius: sm ? 5 : 7,
                            background: '#5A7A6E',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <FiCheck style={{ width: sm ? 9 : 11, height: sm ? 9 : 11, color: '#fff', strokeWidth: 3 }} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          width: '100%', overflow: 'hidden',
        }}>
          {/* Back */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: sm ? '8px 12px' : '10px 18px',
              borderRadius: 10, border: 'none',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              // On Q20: strip the glass box completely
              background: (currentQuestionIndex === 0 || currentQuestionIndex === 19) ? 'transparent' : 'rgba(255,255,255,0.5)',
              backdropFilter: currentQuestionIndex === 19 ? 'none' : 'blur(10px)',
              boxShadow: (currentQuestionIndex === 0 || currentQuestionIndex === 19) ? 'none' : '0 1px 8px rgba(47,74,92,0.06)',
              color: currentQuestionIndex === 0 ? 'rgba(47,74,92,0.2)' : 'rgba(47,74,92,0.65)',
              fontSize: sm ? 10 : 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {/* Q20: text only. All others: arrow + text (text hidden on mobile) */}
            {currentQuestionIndex === 19 ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                {sm ? '' : 'Back'}
              </>
            )}
          </button>

          {/* Dot progress — same on both sm and lg, just scaled */}
          {currentQuestionIndex === 19 ? (
            /* Q20: no dots, just a spacer to keep Back ↔ Results balanced */
            <div style={{ flex: 1 }} />
          ) : (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: sm ? 3 : 4, alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{
                    width: i === currentQuestionIndex
                      ? (sm ? 12 : 16)
                      : answers[i] !== null
                        ? (sm ? 5 : 6)
                        : (sm ? 3 : 4),
                    height: sm ? 3 : 4,
                    borderRadius: 2, flexShrink: 0,
                    background: i === currentQuestionIndex
                      ? '#2F4A5C'
                      : answers[i] !== null
                        ? '#8FA99B'
                        : 'rgba(47,74,92,0.15)',
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Next / Submit */}
          {currentQuestionIndex < 19 ? (
            <button
              onClick={handleNext}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: sm ? '8px 12px' : '10px 18px', borderRadius: 10,
                background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(143,169,155,0.25)',
                color: 'rgba(47,74,92,0.65)',
                fontSize: sm ? 10 : 11, fontWeight: 700,
                flexShrink: 0,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 1px 8px rgba(47,74,92,0.06)', transition: 'all 0.2s ease',
              }}
            >
              {sm ? '' : 'Next'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          ) : (
            <motion.button
              whileHover={answers[19] !== null ? { scale: 1.03 } : {}}
              whileTap={answers[19] !== null ? { scale: 0.975 } : {}}
              onClick={() => answers[19] !== null && handleSubmit(answers)}
              disabled={answers[19] === null}
              style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: sm ? 5 : 6,
                padding: sm ? '8px 12px' : '12px 22px', borderRadius: 12,
                background: answers[19] !== null ? '#2F4A5C' : 'rgba(47,74,92,0.2)',
                color: '#fff', border: 'none',
                fontSize: sm ? 10 : 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: answers[19] !== null ? 'pointer' : 'not-allowed',
                boxShadow: answers[19] !== null ? '0 4px 20px rgba(47,74,92,0.22)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {sm ? 'Results' : 'View Results'}
              <FiArrowRight style={{ width: sm ? 12 : 14, height: sm ? 12 : 14 }} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
