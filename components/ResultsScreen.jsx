import React from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { generatePDF } from '../utils/pdfGenerator';
import PatternCard from './PatternCard';

/**
 * Results Screen Component
 * Displays all 4 captured images and calculated metrics
 */

const ResultsScreen = ({ captureData, questionnaireData, patternResults, onRestart }) => {
  // Calculate overall score
  const calculateOverallScore = () => {
    const allMetrics = {
      face: {
        eyeSym: captureData.stage1.metrics.eyeSym,
        jawShift: captureData.stage1.metrics.jawShift,
        headTilt: captureData.stage1.metrics.headTilt,
        nostrilAsym: captureData.stage1.metrics.nostrilAsym
      },
      body: {
        shoulderHeight: captureData.stage2.metrics.shoulderHeight,
        fhpAngle: captureData.stage3.metrics.fhpAngle,
        pelvicTilt: captureData.stage4.metrics.pelvicTilt,
        kneeAngle: captureData.stage4.metrics.kneeAngle,
        footArchRatio: captureData.stage4.metrics.footArchRatio
      }
    };

    console.log('=== RESULTS SCREEN SCORE CALCULATION ===');
    console.log('All Metrics:', allMetrics);

    // Face Score
    let faceScore = 100;
    const eyePenalty = Math.abs(allMetrics.face.eyeSym || 0) * 10;
    const jawPenalty = Math.abs(allMetrics.face.jawShift || 0) * 10;
    const tiltPenalty = Math.abs(allMetrics.face.headTilt || 0) * 1;
    const nostrilPenalty = Math.abs(allMetrics.face.nostrilAsym || 0) * 5;

    faceScore -= eyePenalty + jawPenalty + tiltPenalty + nostrilPenalty;
    faceScore = Math.max(0, Math.min(100, faceScore));

    console.log('Face Score:', {
      eyePenalty: eyePenalty.toFixed(2),
      jawPenalty: jawPenalty.toFixed(2),
      tiltPenalty: tiltPenalty.toFixed(2),
      nostrilPenalty: nostrilPenalty.toFixed(2),
      faceScore: faceScore.toFixed(1)
    });

    // Body Score
    let bodyScore = 100;
    const shoulderPenalty = Math.abs(allMetrics.body.shoulderHeight || 0) * 10;
    const fhpPenalty = Math.abs(allMetrics.body.fhpAngle || 0) * 0.3;
    const pelvicPenalty = Math.abs(allMetrics.body.pelvicTilt || 0) * 0.3;

    bodyScore -= shoulderPenalty + fhpPenalty + pelvicPenalty;
    bodyScore = Math.max(0, Math.min(100, bodyScore));

    console.log('Body Score:', {
      shoulderPenalty: shoulderPenalty.toFixed(2),
      fhpPenalty: fhpPenalty.toFixed(2),
      pelvicPenalty: pelvicPenalty.toFixed(2),
      bodyScore: bodyScore.toFixed(1)
    });

    // Questionnaire score (average of normalized scores, or 50 if missing)
    let questionnaireScore = 50;
    if (questionnaireData && questionnaireData.normalizedScores) {
      const scores = Object.values(questionnaireData.normalizedScores);
      questionnaireScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    console.log('Questionnaire Score:', questionnaireScore.toFixed(1));

    const total = (faceScore * 0.3) + (bodyScore * 0.5) + (questionnaireScore * 0.2);

    console.log('Final Wellness Score Calculation:', {
      faceContribution: (faceScore * 0.3).toFixed(2),
      bodyContribution: (bodyScore * 0.5).toFixed(2),
      questionnaireContribution: (questionnaireScore * 0.2).toFixed(2),
      total: total.toFixed(1)
    });
    console.log('=== END SCORE CALCULATION ===\n');

    return {
      total: total.toFixed(1),
      face: faceScore.toFixed(1),
      body: bodyScore.toFixed(1),
      questionnaire: questionnaireScore.toFixed(1)
    };
  };

  const score = calculateOverallScore();

  return (
    <div className="min-h-screen bg-brand-sand text-brand-slate overflow-y-auto overflow-x-hidden relative selection:bg-brand-sage/30 pb-12 sm:pb-20">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(143,169,155,0.15),_transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#E2DACF_1px,transparent_1px),linear-gradient(to_bottom,#E2DACF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-10 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-white/40 border border-brand-sage/20 shadow-sm mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-display font-bold text-brand-deepSage tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              Analysis Complete
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-display font-bold text-brand-slate tracking-tighter mb-2 sm:mb-4 px-2">
            BODI <span className="text-brand-deepSage">KEMISTRI</span> REPORT
          </h1>
          <p className="text-brand-slate/60 font-medium tracking-wide uppercase text-[9px] sm:text-[10px]">Precision Postural Biometrics</p>
        </motion.div>

        {/* Score Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16"
        >
          {/* Main Score */}
          <div className="md:col-span-3 lg:col-span-1 bg-white border border-brand-sage/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden group shadow-glass">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(143,169,155,0.05),_transparent)] opacity-100 transition-opacity duration-500" />

            <h3 className="text-brand-deepSage/60 font-display font-semibold text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4">Overall Wellness Score</h3>
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold text-brand-slate tracking-tighter mb-3 sm:mb-4">
              {score.total}
            </div>
            <div className="h-1.5 w-16 sm:w-20 md:w-24 mx-auto bg-brand-sage/20 rounded-full" />
          </div>

          {/* Sub Scores */}
          <div className="md:col-span-3 lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white/60 border border-brand-sage/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center backdrop-blur-md hover:border-brand-sage/30 transition-all shadow-glass group">
              <span className="text-[9px] sm:text-[10px] font-display font-semibold text-brand-sage mb-2 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase">FACE METRICS</span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-slate group-hover:text-brand-deepSage transition-colors">{score.face}</span>
              <div className="mt-3 sm:mt-4 w-8 sm:w-10 md:w-12 h-1 bg-brand-sage/10 rounded-full" />
            </div>
            <div className="bg-white/60 border border-brand-sage/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center backdrop-blur-md hover:border-brand-sage/30 transition-all shadow-glass group">
              <span className="text-[9px] sm:text-[10px] font-display font-semibold text-brand-slate/60 mb-2 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase">BODY ALIGNMENT</span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-slate group-hover:text-brand-deepSage transition-colors">{score.body}</span>
              <div className="mt-3 sm:mt-4 w-8 sm:w-10 md:w-12 h-1 bg-brand-sage/10 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Captured Images Grid */}
        <div className="mb-12 sm:mb-20">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-10">
            <div className="w-1 sm:w-1.5 h-5 sm:h-6 md:h-8 bg-brand-slate rounded-full" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-brand-slate uppercase tracking-tight">
              Captured Evidence
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Face Profile", data: captureData.stage1, color: "border-brand-sage", metrics: [
                  { l: "Eye Symmetry", v: captureData.stage1.metrics.eyeSym },
                  { l: "Head Tilt", v: `${captureData.stage1.metrics.headTilt}°` }
                ]
              },
              {
                title: "Anterior Upper", data: captureData.stage2, color: "border-brand-deepSage", metrics: [
                  { l: "Shoulder Ht", v: captureData.stage2.metrics.shoulderHeight }
                ]
              },
              {
                title: "Lateral Upper", data: captureData.stage3, color: "border-brand-slate", metrics: [
                  { l: "FHP Angle", v: `${captureData.stage3.metrics.fhpAngle}°` }
                ]
              },
              {
                title: "Lateral Lower", data: captureData.stage4, color: "border-brand-sage/50", metrics: [
                  { l: "Pelvic Tilt", v: `${captureData.stage4.metrics.pelvicTilt}°` },
                  { l: "Knee Angle", v: `${captureData.stage4.metrics.kneeAngle}°` }
                ]
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-brand-sage/10 rounded-3xl overflow-hidden hover:border-brand-sage/40 hover:shadow-brand transition-all duration-500 group"
              >
                <div className="relative bg-black overflow-hidden">
                  {item.data.image ? (
                    <img
                      src={item.data.image}
                      alt={item.title}
                      className="w-full h-auto block grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-brand-deepSage/40 text-[10px] uppercase font-display font-bold">No Data Signal</div>
                  )}

                  {/* Overlay Title */}
                  <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-brand-sand via-brand-sand/40 to-transparent">
                    <span className={`text-[9px] font-display font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl bg-white/90 border-2 ${item.color} text-brand-slate shadow-sm`}>
                      {item.title}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-white">
                  <div className="space-y-2 sm:space-y-3">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-[10px] sm:text-[11px] font-display font-semibold border-b border-brand-sand pb-2 last:border-0 last:pb-0">
                        <span className="text-brand-deepSage/60 uppercase tracking-wider">{m.l}</span>
                        <span className="text-brand-slate">{m.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Somatic Pattern Analysis Section */}
        {patternResults && patternResults.allPatterns && (
          <div className="mb-16 sm:mb-24">
            <div className="text-center mb-8 sm:mb-10 md:mb-16 px-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-display font-bold text-brand-slate mb-3 sm:mb-4">Somatic Pattern Analysis</h2>
              <p className="text-brand-deepSage/70 font-medium max-w-2xl mx-auto leading-relaxed text-xs sm:text-sm md:text-base px-4">
                Integrated biomechanical analysis combining posture data, facial alignment, and self-assessment patterns.
              </p>
            </div>

            {/* Primary Pattern Highlight */}
            {patternResults.primaryPattern && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-white border border-brand-sage/20 rounded-2xl sm:rounded-[32px] md:rounded-[40px] p-6 sm:p-10 md:p-16 mb-10 sm:mb-16 text-center overflow-hidden shadow-brand"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-brand-sage to-transparent" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] bg-black mb-4 sm:mb-6 md:mb-8 text-white shadow-2xl">
                    <FiZap className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-current" />
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-brand-slate mb-3 sm:mb-4 px-2">
                    Primary Pattern: <span className="text-brand-deepSage">{patternResults.primaryPattern.name}</span>
                  </h3>

                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10">
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl bg-brand-sand/50 border border-brand-sage/10 text-brand-slate flex flex-col items-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px]">
                      <span className="text-[9px] sm:text-[10px] font-display font-medium uppercase tracking-widest text-brand-deepSage/60 mb-1">Severity</span>
                      <span className="text-base sm:text-lg md:text-xl font-display font-semibold uppercase text-brand-sage">{patternResults.primaryPattern.severity}</span>
                    </div>
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl bg-brand-sand/50 border border-brand-sage/10 text-brand-slate flex flex-col items-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px]">
                      <span className="text-[9px] sm:text-[10px] font-display font-medium uppercase tracking-widest text-brand-deepSage/60 mb-1">Pattern Match</span>
                      <span className="text-base sm:text-lg md:text-xl font-display font-semibold text-brand-slate">{patternResults.primaryPattern.score.toFixed(0)}%</span>
                    </div>
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl bg-brand-sand/50 border border-brand-sage/10 text-brand-slate flex flex-col items-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px]">
                      <span className="text-[9px] sm:text-[10px] font-display font-medium uppercase tracking-widest text-brand-deepSage/60 mb-1">Confidence</span>
                      <span className="text-base sm:text-lg md:text-xl font-display font-semibold text-brand-slate">{patternResults.confidence.percentage}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Patterns List - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {patternResults.allPatterns
                .sort((a, b) => b.score - a.score)
                .map((pattern, index) => {
                  const rank = pattern.severity !== 'none' ? index + 1 : null;
                  return (
                    <div key={pattern.id} className="h-full">
                      <PatternCard
                        pattern={pattern}
                        rank={rank}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center pb-12 sm:pb-20 px-3 sm:px-4">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#E2DACF" }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl bg-transparent border border-brand-slate/20 text-brand-slate font-display font-semibold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 w-full sm:min-w-[220px] md:min-w-[260px] sm:w-auto flex items-center justify-center gap-3 sm:gap-4 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            New Analysis
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#2F4A5C" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => generatePDF(captureData, questionnaireData, patternResults, score)}
            className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl bg-transparent border border-brand-slate/20 text-brand-slate font-display font-semibold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 w-full sm:min-w-[220px] md:min-w-[260px] sm:w-auto flex items-center justify-center gap-3 sm:gap-4 shadow-sm hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Report
          </motion.button>
        </div>

      </div >
    </div >
  );
};

export default ResultsScreen;
