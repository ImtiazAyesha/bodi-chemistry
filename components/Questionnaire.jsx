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
    <div className="min-h-screen bg-brand-sand relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-brand-sage/30">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#E2DACF_1px,transparent_1px),linear-gradient(to_bottom,#E2DACF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-sage/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-slate mb-4 tracking-tight">
            Somatic <span className="text-brand-deepSage">Pattern Assessment</span>
          </h1>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/40 border border-brand-sage/20 backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-display font-semibold text-brand-deepSage tracking-[0.2em] uppercase">
              Question {currentQuestionIndex + 1} of 20 • {answeredCount} answered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/5 rounded-full mb-10 overflow-hidden shadow-inner">
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
          className="backdrop-blur-xl bg-white/60 border border-brand-sage/10 rounded-3xl p-6 md:p-10 shadow-glass mb-8"
        >
          <h2 className="text-xl md:text-2xl font-display font-bold text-brand-slate mb-8 leading-tight">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestionIndex] === option.label;

              return (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden flex items-start gap-5
                        ${isSelected
                      ? 'bg-black/[0.02] border-black shadow-md'
                      : 'bg-white/40 border-brand-sage/10 hover:border-brand-sage/40 hover:bg-white/60'}
                    `}
                >
                  <div className={`
                        flex items-center justify-center w-10 h-10 rounded-xl text-sm font-display font-bold flex-shrink-0 transition-all duration-300
                        ${isSelected ? 'bg-black text-white' : 'bg-brand-sand text-brand-deepSage group-hover:bg-brand-sage/20'}
                    `}>
                    {option.label}
                  </div>

                  <span className={`text-base md:text-lg pt-1.5 font-medium transition-colors ${isSelected ? 'text-black font-bold' : 'text-brand-slate/70 group-hover:text-brand-slate'}`}>
                    {option.text}
                  </span>

                  {isSelected && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-9 h-9 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg"
                      >
                        <FiCheck className="w-5 h-5 stroke-[4]" />
                      </motion.div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-8 py-3 rounded-2xl text-xs font-display font-semibold tracking-widest uppercase transition-all
                ${currentQuestionIndex === 0
                ? 'text-brand-deepSage/30 cursor-not-allowed'
                : 'text-brand-deepSage hover:text-brand-slate hover:bg-white/40'}
            `}
          >
            ← Previous
          </button>

          <div className="flex-1" />

          {currentQuestionIndex < 19 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-2xl bg-white/40 border border-brand-sage/20 text-brand-slate text-xs font-display font-semibold tracking-widest uppercase hover:bg-brand-sage/20 hover:border-brand-sage/40 transition-all shadow-sm"
            >
              Next →
            </button>
          ) : (
            <motion.button
              whileHover={answers[19] !== null ? { scale: 1.02, backgroundColor: "#2F4A5C" } : {}}
              whileTap={answers[19] !== null ? { scale: 0.98 } : {}}
              onClick={() => answers[19] !== null && handleSubmit(answers)}
              disabled={answers[19] === null}
              className={`group relative px-10 py-4 rounded-2xl font-display font-bold tracking-widest uppercase transition-all duration-300
                ${answers[19] !== null
                  ? 'bg-transparent border-2 border-brand-slate text-brand-slate hover:text-white cursor-pointer shadow-brand'
                  : 'bg-brand-beige text-brand-deepSage/40 cursor-not-allowed border border-brand-sage/5 opacity-50'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-4 text-xs font-display font-semibold tracking-widest uppercase transition-colors duration-300">
                See Instructions
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
