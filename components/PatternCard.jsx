import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeverityColor, getSeverityLabel } from '../config/patterns.config';

/**
 * Pattern Card Component
 * Displays individual somatic pattern with score, severity, and recommendations
 */
const PatternCard = ({ pattern, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Map color names/hex to Tailwind classes or CSS variables for custom colors if needed
  const severityLabel = getSeverityLabel(pattern.severity);
  const isActive = pattern.severity !== 'none';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0.6, y: 0 }}
      whileHover={{ scale: isActive ? 1.02 : 1 }}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300 h-full flex flex-col
        ${isActive
          ? 'bg-[#0B1221]/80 backdrop-blur-sm border-cyan-500/30 shadow-lg shadow-cyan-900/5 cursor-pointer'
          : 'bg-slate-900/20 border-white/5 cursor-default'}
      `}
      onClick={(e) => {
        if (isActive) {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }
      }}
      style={{
        borderColor: isActive ? pattern.color : '',
      }}
    >
      {/* Active Glow Background */}
      {isActive && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${pattern.color}, transparent)` }}
        />
      )}

      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Top Header - Icon and Score */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            {isActive && rank && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-[10px]"
                style={{ backgroundColor: pattern.color }}
              >
                {rank}
              </div>
            )}
            <span className="text-3xl drop-shadow-md">{pattern.icon || '⚡'}</span>
          </div>

          <div className="text-right">
            <div
              className="text-2xl font-black leading-none"
              style={{ color: pattern.color || '#94a3b8' }}
            >
              {pattern.score?.toFixed(0)}%
            </div>
            <div
              className="text-[10px] uppercase font-bold tracking-wider mt-1"
              style={{ color: pattern.color || '#64748b' }}
            >
              {severityLabel}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="font-bold text-base leading-tight mb-2"
            style={{ color: isActive ? pattern.color : '#94a3b8' }}
          >
            {pattern.name}
          </h3>
          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
            {pattern.description}
          </p>
        </div>

        {/* Expand Indicator */}
        {isActive && (
          <div className="text-center mt-4 pt-3 border-t border-white/5 group">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest group-hover:text-cyan-400 transition-colors flex items-center justify-center gap-1">
              {isExpanded ? 'Hide Details' : 'View Factors'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 border-t border-white/5 bg-[#020617]/50"
          >
            <div className="p-5 space-y-6">
              {/* Metrics */}
              <div>
                <h4
                  className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                  style={{ color: pattern.color }}
                >
                  📊 Contributing Factors
                </h4>

                <div className="space-y-3 bg-[#0B1221] p-4 rounded-lg border border-white/5">
                  {(pattern.metricBreakdown || []).slice(0, 5).map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex-1 pr-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-slate-300 font-medium">{metric.name}</span>
                          <span className="text-slate-600 text-[10px] font-mono">
                            (w: {(metric.weight * 100).toFixed(0)}%)
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, metric.normalizedValue)}%` }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: metric.exceedsThreshold ? '#ef4444' : pattern.color
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold min-w-[30px]" style={{ color: metric.exceedsThreshold ? '#ef4444' : pattern.color }}>
                        {metric.normalizedValue?.toFixed(0)}
                      </div>
                    </div>
                  ))}
                  {(!pattern.metricBreakdown || pattern.metricBreakdown.length === 0) && (
                    <p className="text-slate-500 text-xs italic">Loading analysis data...</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {pattern.recommendations && pattern.recommendations.length > 0 && (
                <div>
                  <h4
                    className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                    style={{ color: pattern.color }}
                  >
                    💡 Action Plan
                  </h4>

                  <ul className="space-y-2 bg-[#0B1221] p-4 rounded-lg border border-white/5 text-sm text-slate-400">
                    {pattern.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span style={{ color: pattern.color }} className="mt-1">
                          {idx === 0 ? '✦' : '•'}
                        </span>
                        <span className={idx === 0 ? 'text-slate-200 font-medium' : ''}>
                          {rec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatternCard;
