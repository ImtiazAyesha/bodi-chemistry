import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ProcessingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Auto-transition to results after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.1),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-md w-full backdrop-blur-xl bg-[#0B1221]/80 border border-cyan-500/10 rounded-2xl p-8 sm:p-12 text-center shadow-2xl shadow-cyan-900/20"
      >
        {/* Animated Scanner Visual */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
          <div className="absolute inset-4 rounded-full border-2 border-cyan-500/10" />
          <div className="absolute inset-4 rounded-full border-b-2 border-cyan-300 animate-spin-reverse" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
          analyzing <span className="text-cyan-400">biometrics</span>
        </h1>

        <p className="text-slate-400 text-sm mb-8 font-light">
          Our AI is processing your captures and calculating your personalized assessment...
        </p>

        <div className="bg-slate-900/50 rounded-lg p-6 border border-white/5 text-left space-y-4">
          {[
            "Processing face metrics...",
            "Analyzing body alignment...",
            "Calculating scores...",
            "Generating report..."
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.8, duration: 0.5 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-4 h-4 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.8 + 0.2 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
              </div>
              <span className={`font-mono ${i === 3 ? 'text-cyan-200 animate-pulse' : 'text-slate-300'}`}>
                {text}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-600 font-mono text-center">
          ESTIMATED TIME: ~12 SECONDS
        </p>
      </motion.div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
