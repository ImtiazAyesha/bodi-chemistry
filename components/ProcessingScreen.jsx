import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ProcessingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Auto-transition to results after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center p-4">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(143,169,155,0.08),_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center"
      >
        {/* Simple Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6 rounded-full border-3 border-brand-sage/20 border-t-brand-sage"
        />

        {/* Simple Text */}
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-slate mb-2">
          Processing
        </h2>
        <p className="text-brand-slate/50 text-sm font-medium">
          Analyzing your results...
        </p>
      </motion.div>
    </div>
  );
};

export default ProcessingScreen;
