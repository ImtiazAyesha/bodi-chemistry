import React from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { getSeverityLabel } from '../config/patterns.config';

/**
 * Pattern Card Component
 * Displays individual somatic pattern with score, severity, and description
 */
const PatternCard = ({ pattern, rank }) => {
  // Map color names/hex to Tailwind classes or CSS variables for custom colors if needed
  const severityLabel = getSeverityLabel(pattern.severity);
  const isActive = pattern.severity !== 'none';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0.6, y: 0 }}
      whileHover={{ scale: isActive ? 1.02 : 1 }}
      className={`
        relative overflow-hidden rounded-[32px] border transition-all duration-300 h-full flex flex-col
        ${isActive
          ? 'bg-white border-brand-sage/10 shadow-glass hover:border-brand-sage/30 hover:shadow-brand'
          : 'bg-brand-sand/40 border-brand-sage/5 cursor-default'}
      `}
    >
      {/* Active Glow Background */}
      {isActive && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${pattern.color}, transparent)` }}
        />
      )}

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Top Header - Icon and Score */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Icon Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isActive ? 'bg-black text-white' : 'bg-brand-slate/20 text-brand-slate/40'}`}>
              <FiZap className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            </div>
          </div>

          <div className="text-right">
            <div
              className="text-xl sm:text-2xl font-display font-bold leading-none"
              style={{ color: isActive ? pattern.color : '#94a3b8' }}
            >
              {pattern.score?.toFixed(0)}%
            </div>
            <div
              className="text-[10px] uppercase font-display font-bold tracking-widest mt-2 opacity-60"
              style={{ color: isActive ? pattern.color : '#64748b' }}
            >
              {severityLabel}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="font-display font-bold text-base sm:text-lg leading-tight mb-3 uppercase tracking-tight"
            style={{ color: isActive ? 'var(--brand-slate)' : '#94a3b8' }}
          >
            {pattern.name}
          </h3>
          <p className="text-brand-deepSage/60 text-xs font-medium leading-relaxed">
            {pattern.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PatternCard;
