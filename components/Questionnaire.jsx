import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QUESTIONNAIRE_DATA, PATTERN_NAMES } from '../config/questionnaireData.js';
import { calculateQuestionnaireScores } from '../utils/questionnaireScoring.js';

const Questionnaire = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = QUESTIONNAIRE_DATA[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / 20) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  const handleAnswer = (optionLabel) => {
    // Store the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionLabel;
    setAnswers(newAnswers);

    // Auto-advance to next question after short delay
    setTimeout(() => {
      if (currentQuestionIndex < 19) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Last question answered - show review or complete
        setShowReview(true);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowReview(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < 19) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    // Calculate scores
    const result = calculateQuestionnaireScores(answers);

    // Pass results to parent component
    onComplete({
      answers,
      rawScores: result.rawScores,
      normalizedScores: result.normalizedScores,
      metadata: result.metadata
    });
  };

  const handleReviewAnswer = (index) => {
    setCurrentQuestionIndex(index);
    setShowReview(false);
  };

  // Review Screen
  if (showReview) {
    return (
      <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center p-4 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),_transparent_70%)]" />

        <div className="relative z-10 w-full max-w-4xl backdrop-blur-xl bg-[#0B1221]/90 border border-cyan-500/10 rounded-2xl p-6 md:p-10 shadow-2xl">
          <h1 className="text-2xl md:text-4xl font-black text-center mb-2 tracking-tight">
            <span className="text-white">Review Your</span> <span className="text-cyan-400">Answers</span>
          </h1>

          <p className="text-center text-slate-400 text-sm md:text-base mb-8 font-mono">
            {answeredCount}/20 questions answered • Click any answer to change it
          </p>

          {/* Answer Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {QUESTIONNAIRE_DATA.map((q, index) => (
              <motion.div
                key={q.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleReviewAnswer(index)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors duration-200 text-center flex flex-col items-center justify-center
                    ${answers[index]
                    ? 'bg-cyan-900/20 border-cyan-500/30 hover:bg-cyan-900/30'
                    : 'bg-red-900/10 border-red-500/30 hover:bg-red-900/20'}
                `}
              >
                <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wider">
                  Q{index + 1}
                </div>
                <div className={`text-xl font-bold ${answers[index] ? 'text-cyan-400' : 'text-red-400'}`}>
                  {answers[index] || '—'}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowReview(false)}
              className="px-8 py-3 rounded-lg border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-950/30 transition-colors"
            >
              ← Back to Questions
            </button>

            <button
              onClick={handleSubmit}
              disabled={answeredCount < 20}
              className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-all duration-300
                ${answeredCount === 20
                  ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'}
              `}
            >
              Continue to Photo Assessment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Somatic <span className="text-cyan-400">Pattern Assessment</span>
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            Question <span className="text-cyan-300">{currentQuestionIndex + 1}</span> of 20 • {answeredCount} answered
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="backdrop-blur-xl bg-[#0B1221]/80 border border-cyan-500/20 rounded-2xl p-6 md:p-8 shadow-2xl mb-8"
        >
          <h2 className="text-lg md:text-xl font-medium text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestionIndex] === option.label;

              return (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden flex items-start gap-4
                        ${isSelected
                      ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-900/50 border-white/5 hover:border-cyan-500/30 hover:bg-slate-800/80'}
                    `}
                >
                  <div className={`
                        flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold flex-shrink-0 transition-colors
                        ${isSelected ? 'bg-cyan-400 text-slate-900' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}
                    `}>
                    {option.label}
                  </div>

                  <span className={`text-sm md:text-base pt-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {option.text}
                  </span>

                  {isSelected && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors
                ${currentQuestionIndex === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white hover:bg-white/5'}
            `}
          >
            ← Previous
          </button>

          <button
            onClick={() => setShowReview(true)}
            className="text-xs font-mono text-cyan-500/70 hover:text-cyan-400 uppercase tracking-wider"
          >
            Review All
          </button>

          {currentQuestionIndex < 19 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-900/50 hover:border-cyan-500/50 transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setShowReview(true)}
              className="px-6 py-2 rounded-lg bg-cyan-500 text-slate-900 text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-all"
            >
              Review Answers →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
