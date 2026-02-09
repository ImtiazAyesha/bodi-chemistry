import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-[#020617] text-white overflow-y-auto overflow-x-hidden relative selection:bg-cyan-500/30 pb-20">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.15),_transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Analysis Complete
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            BODI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">KEMISTRI</span> REPORT
          </h1>
        </motion.div>

        {/* Score Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {/* Main Score */}
          <div className="md:col-span-3 lg:col-span-1 bg-gradient-to-b from-[#0B1221] to-[#020617] border border-cyan-500/20 rounded-2xl p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <h3 className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">Overall Wellness Score</h3>
            <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              {score.total}
            </div>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full opacity-50" />
          </div>

          {/* Sub Scores */}
          <div className="md:col-span-3 lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-[#0B1221]/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-sm hover:border-cyan-500/20 transition-colors">
              <span className="text-xs font-mono text-amber-400 mb-2">FACE METRICS</span>
              <span className="text-4xl font-bold text-white">{score.face}</span>
            </div>
            <div className="bg-[#0B1221]/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-sm hover:border-cyan-500/20 transition-colors">
              <span className="text-xs font-mono text-blue-400 mb-2">BODY ALIGNMENT</span>
              <span className="text-4xl font-bold text-white">{score.body}</span>
            </div>
          </div>
        </motion.div>

        {/* Captured Images Grid */}
        <div className="mb-16">
          <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-8">
            <span className="w-1 h-6 bg-cyan-400 rounded-full" />
            Captured Evidence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Face", data: captureData.stage1, color: "border-green-500/50", metrics: [
                  { l: "Eye Sym", v: captureData.stage1.metrics.eyeSym },
                  { l: "Head Tilt", v: `${captureData.stage1.metrics.headTilt}°` }
                ]
              },
              {
                title: "Upper Body Front", data: captureData.stage2, color: "border-blue-500/50", metrics: [
                  { l: "Shoulder Ht", v: captureData.stage2.metrics.shoulderHeight }
                ]
              },
              {
                title: "Upper Body Side", data: captureData.stage3, color: "border-amber-500/50", metrics: [
                  { l: "FHP Angle", v: `${captureData.stage3.metrics.fhpAngle}°` }
                ]
              },
              {
                title: "Lower Body Side", data: captureData.stage4, color: "border-purple-500/50", metrics: [
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
                className="bg-[#0B1221] border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
                  {item.data.image ? (
                    <img src={item.data.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-700 text-xs uppercase font-mono">No Signal</div>
                  )}

                  {/* Overlay Title */}
                  <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/80 to-transparent">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/50 border ${item.color} text-white`}>
                      {item.title}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#0B1221]">
                  <div className="space-y-2">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-mono border-b border-white/5 pb-1 last:border-0 last:pb-0">
                        <span className="text-slate-500">{m.l}</span>
                        <span className="text-cyan-400">{m.v}</span>
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
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Somatic Pattern Analysis</h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Integrated analysis combining body posture (50%), facial alignment (30%), and self-assessment (20%)
              </p>
            </div>

            {/* Primary Pattern Highlight */}
            {patternResults.primaryPattern && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-cyan-500/30 rounded-2xl p-8 md:p-12 mb-12 text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-6 border border-cyan-500/20 text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Primary Pattern: <span className="text-cyan-400">{patternResults.primaryPattern.name}</span>
                  </h3>

                  <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-mono uppercase tracking-wide">
                    <span className="px-4 py-2 rounded bg-slate-900/50 border border-white/10 text-slate-300">
                      Severity: <span className="text-cyan-400">{patternResults.primaryPattern.severity}</span>
                    </span>
                    <span className="px-4 py-2 rounded bg-slate-900/50 border border-white/10 text-slate-300">
                      Match: <span className="text-cyan-400">{patternResults.primaryPattern.score.toFixed(0)}%</span>
                    </span>
                    <span className="px-4 py-2 rounded bg-slate-900/50 border border-white/10 text-slate-300">
                      Confidence: <span className="text-cyan-400">{patternResults.confidence.percentage}%</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Patterns List - 4 Columns on MD+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {patternResults.allPatterns
                .sort((a, b) => b.score - a.score)
                .map((pattern, index) => {
                  const rank = pattern.severity !== 'none' ? index + 1 : null;
                  return (
                    <div key={pattern.id} className="backdrop-blur bg-slate-900/30 border border-white/5 rounded-lg p-1 h-full">
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12">
          <button
            onClick={onRestart}
            className="group px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium text-sm hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all min-w-[180px] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Start New Analysis
          </button>

          <button
            onClick={() => generatePDF(captureData, questionnaireData, patternResults, score)}
            className="group px-6 py-3 rounded-lg bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-900/20 hover:bg-cyan-500 hover:shadow-cyan-500/30 transition-all min-w-[180px] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-y-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Report
          </button>
        </div>

      </div >
    </div >
  );
};

export default ResultsScreen;
