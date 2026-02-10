import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiLoader } from 'react-icons/fi';

const ProcessingScreen = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Progress through steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 750);

    // Auto-transition to results after 3.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const steps = [
    "Processing face metrics...",
    "Analyzing body alignment...",
    "Calculating scores...",
    "Generating report..."
  ];

  return (
    <div className="min-h-screen bg-brand-sand relative overflow-hidden flex items-center justify-center p-4 selection:bg-brand-sage/30">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(143,169,155,0.15),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2DACF_1px,transparent_1px),linear-gradient(to_bottom,#E2DACF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Decorative Particles (Static placeholders for style) */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-sage/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-brand-deepSage/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-lg w-full backdrop-blur-3xl bg-white/70 border border-brand-sage/20 rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 text-center shadow-[0_30px_60px_rgba(47,74,92,0.12)]"
      >
        {/* Animated Scanner Visual */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8 sm:mb-12">
                    {/* Inner Glow */}
          <div className="absolute inset-0 rounded-full bg-brand-sage/5 animate-pulse" />

          {/* Rotating Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-brand-sage/10" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-brand-sage shadow-[0_-2px_10px_rgba(143,169,155,0.3)]"
          />
          <div className="absolute inset-4 rounded-full border-2 border-brand-sage/5" />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-b-2 border-brand-deepSage opacity-60"
          />
          <div className="absolute inset-8 rounded-full border border-brand-slate/5" />

          {/* Core Dot (Pulse) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 bg-brand-slate rounded-full shadow-[0_0_15px_rgba(47,74,92,0.3)] flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 bg-brand-sand rounded-full" />
            </motion.div>
          </div>

          {/* Scanning Beam (Visual) */}
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-sage to-transparent opacity-40 blur-[1px]"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-slate mb-4 tracking-tight leading-tight">
          analyzing <span className="text-brand-deepSage italic">biometrics</span>
        </h1>
        
        <p className="text-brand-slate/60 text-sm sm:text-base mb-8 sm:mb-12 font-medium leading-relaxed px-4 max-w-sm mx-auto">
          Our AI is processing your captures and calculating your personalized assessment...
        </p>
        
        <div className="bg-brand-sand/30 rounded-[28px] sm:rounded-[36px] p-5 sm:p-10 border border-brand-sage/10 text-left space-y-5 sm:space-y-7 shadow-inner">
                    {steps.map((text, i) => {
            const isCompleted = activeStep > i;
            const isActive = activeStep === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="flex items-center gap-4 sm:gap-6"
              >
                                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shadow-glass transition-all duration-500 border-2 ${isCompleted
                  ? 'bg-brand-sage border-brand-sage text-white'
                  : isActive
                    ? 'bg-white border-brand-sage/40 text-brand-sage'
                    : 'bg-white/50 border-brand-sage/10 text-brand-sage/20'
                  }`}>
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <FiCheck className="w-4 h-4 stroke-[3]" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="loader"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <FiLoader className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </AnimatePresence>
                </div>

                <span className={`font-display font-semibold tracking-wide text-sm transition-all duration-500 ${isCompleted
                  ? 'text-brand-slate/40'
                  : isActive
                    ? 'text-brand-slate translate-x-1'
                    : 'text-brand-slate/20'
                  }`}>
                  {text}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-full max-w-[200px] h-1 bg-brand-sage/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(activeStep + 1) * 25}%` }}
              className="h-full bg-brand-sage shadow-[0_0_10px_rgba(143,169,155,0.5)]"
            />
          </div>
          <p className="text-[10px] text-brand-deepSage/50 font-display font-semibold tracking-[0.2em] uppercase">
            ESTIMATED TIME: ~12 SECONDS
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessingScreen;


