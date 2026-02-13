import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { QUESTIONNAIRE_DATA, PATTERN_NAMES } from '../config/questionnaireData.js';
import { calculateQuestionnaireScores } from '../utils/questionnaireScoring.js';

const Questionnaire = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));

  const currentQuestion = QUESTIONNAIRE_DATA[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / 20) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  const handleSubmit = (finalAnswers) => {
    // Calculate scores
    const result = calculateQuestionnaireScores(finalAnswers);

    // Pass results to parent component
    onComplete({
      answers: finalAnswers,
      rawScores: result.rawScores,
      normalizedScores: result.normalizedScores,
      metadata: result.metadata
    });
  };

  const handleAnswer = (optionLabel) => {
    // Store the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionLabel;
    setAnswers(newAnswers);

    // Auto-advance to next question after short delay (only if not the last question)
    if (currentQuestionIndex < 19) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < 19) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Question Screen
  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 selection:bg-brand-sage/30"
      style={{ background: 'linear-gradient(165deg, #F8F5F0 0%, #F0EBE3 40%, #E8E1D7 100%)', fontFamily: 'var(--font-body)' }}
    >
      {/* Atmospheric background layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(143,169,155,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(47,74,92,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* Subtle Technical Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#2F4A3C 1px, transparent 1px), linear-gradient(90deg, #2F4A3C 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-2 sm:px-0">
        <div className="mb-4 sm:mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-brand-slate mb-3 sm:mb-4 tracking-tight px-2">
            Somatic <span className="text-brand-deepSage">Pattern Assessment</span>
          </h1>
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full bg-white/40 border border-brand-sage/20 backdrop-blur-md shadow-sm">
            <span className="text-[9px] sm:text-[10px] font-display font-semibold text-brand-deepSage tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              Question {currentQuestionIndex + 1} of 20 • {answeredCount} answered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 sm:h-2.5 bg-black/5 rounded-full mb-6 sm:mb-8 md:mb-10 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-500 rounded-full"
          />
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="backdrop-blur-xl bg-white/60 border border-brand-sage/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-glass mb-4 sm:mb-6 md:mb-8"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-brand-slate mb-5 sm:mb-6 md:mb-8 leading-tight">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestionIndex] === option.label;

              return (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className={`w-full text-left p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 group relative overflow-hidden flex items-start gap-3 sm:gap-4 md:gap-5
                        ${isSelected
                      ? 'bg-black/[0.02] border-black shadow-md'
                      : 'bg-white/40 border-brand-sage/10 hover:border-brand-sage/40 hover:bg-white/60'}
                    `}
                >
                  <div className={`
                        flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-display font-semibold flex-shrink-0 transition-all duration-300
                        ${isSelected ? 'bg-black text-white' : 'bg-brand-sand text-brand-deepSage group-hover:bg-brand-sage/20'}
                    `}>
                    {option.label}
                  </div>

                  <span className={`text-sm sm:text-base md:text-lg pt-0.5 sm:pt-1 md:pt-1.5 pr-8 sm:pr-10 md:pr-12 transition-colors ${isSelected ? 'text-black font-medium' : 'text-brand-slate/70 font-normal group-hover:text-brand-slate'}`}>
                    {option.text}
                  </span>

                  {isSelected && (
                    <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl sm:rounded-2xl bg-black flex items-center justify-center text-white shadow-lg"
                      >
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] sm:stroke-[4]" />
                      </motion.div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-display font-semibold tracking-wider sm:tracking-widest uppercase transition-all
                ${currentQuestionIndex === 0
                ? 'text-brand-deepSage/30 cursor-not-allowed'
                : 'text-brand-deepSage hover:text-brand-slate hover:bg-white/40'}
            `}
          >
            <span className="hidden sm:inline">← Previous</span>
            <span className="sm:hidden">← Prev</span>
          </button>

          <div className="flex-1" />

          {currentQuestionIndex < 19 ? (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/40 border border-brand-sage/20 text-brand-slate text-[10px] sm:text-xs font-display font-semibold tracking-wider sm:tracking-widest uppercase hover:bg-brand-sage/20 hover:border-brand-sage/40 transition-all shadow-sm"
            >
              Next →
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => answers[19] !== null && handleSubmit(answers)}
              disabled={answers[19] === null}
              className={`btn-scan group relative w-full sm:w-auto px-6 sm:px-10 md:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300
                ${answers[19] === null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-white font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm">
                See Instructions
                <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
