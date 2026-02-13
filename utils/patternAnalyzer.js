/**
 * Pattern Analyzer
 * Analyzes body metrics and calculates somatic pattern scores
 */

import { SOMATIC_PATTERNS, getPatternSeverity, getSeverityColor } from '../config/patterns.config.js';

/**
 * Analyzes all metrics and calculates pattern scores
 * @param {Object} metrics - Combined face and body metrics
 * @param {Object} metrics.face - Face metrics (eyeSym, jawShift, headTilt, nostrilAsym)
 * @param {Object} metrics.body - Body metrics (shoulderHeight, fhpAngle, pelvicTilt, kneeAngle, footArchRatio)
 * @returns {Object} Pattern analysis results
 */
export const analyzePatterns = (metrics) => {
  console.log('=== PATTERN ANALYSIS START ===');
  console.log('Input Metrics:', metrics);

  // Validate input
  if (!metrics || !metrics.face || !metrics.body) {
    console.error('Invalid metrics input:', metrics);
    return {
      patterns: {},
      dominantPattern: null,
      summary: 'Unable to analyze patterns due to missing data.'
    };
  }

  const results = {};

  // Analyze each pattern
  Object.entries(SOMATIC_PATTERNS).forEach(([key, pattern]) => {
    const score = calculatePatternScore(pattern, metrics);
    const severity = getPatternSeverity(score);
    
    results[pattern.id] = {
      name: pattern.name,
      description: pattern.description,
      score: score,
      severity: severity,
      color: pattern.color,
      icon: pattern.icon,
      recommendations: pattern.recommendations[severity] || [],
      metricBreakdown: getMetricBreakdown(pattern, metrics)
    };

    console.log(`${pattern.name}: ${score.toFixed(1)} (${severity})`);
  });

  // Find dominant pattern
  const dominantPattern = findDominantPattern(results);
  
  console.log('Dominant Pattern:', dominantPattern);
  console.log('=== PATTERN ANALYSIS END ===\n');

  return {
    patterns: results,
    dominantPattern: dominantPattern,
    summary: generateSummary(results)
  };
};

/**
 * Calculate score for a single pattern
 * @param {Object} pattern - Pattern configuration
 * @param {Object} metrics - Combined metrics
 * @returns {number} Pattern score (0-100)
 */
const calculatePatternScore = (pattern, metrics) => {
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(pattern.metrics).forEach(([metricKey, config]) => {
    let metricValue;

    // Get metric value based on source
    if (config.source === 'face') {
      metricValue = metrics.face[metricKey];
    } else if (config.source === 'body') {
      metricValue = metrics.body[metricKey];
    } else if (config.source === 'derived') {
      // Calculate derived metrics
      metricValue = config.calculate(metrics.body);
    }

    if (metricValue !== undefined && metricValue !== null && !isNaN(metricValue)) {
      // Normalize the metric value (0-100 scale)
      const normalizedValue = config.normalize 
        ? config.normalize(metricValue)
        : Math.min(100, Math.abs(metricValue) * 10);

      // Weight and add to total
      totalScore += normalizedValue * config.weight;
      totalWeight += config.weight;

      // Safe logging with type checking
      const rawStr = typeof metricValue === 'number' ? metricValue.toFixed(3) : String(metricValue);
      const normStr = typeof normalizedValue === 'number' ? normalizedValue.toFixed(1) : String(normalizedValue);
      const weightedStr = typeof (normalizedValue * config.weight) === 'number' ? (normalizedValue * config.weight).toFixed(1) : 'N/A';
      console.log(`  ${metricKey}: raw=${rawStr}, normalized=${normStr}, weighted=${weightedStr}`);
    } else {
      console.log(`  ${metricKey}: SKIPPED (value=${metricValue}, type=${typeof metricValue})`);
    }
  });

  // Return weighted average
  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  console.log(`  Total Score: ${finalScore.toFixed(1)} (weight sum: ${totalWeight.toFixed(2)})`);
  
  return finalScore;
};

/**
 * Get detailed breakdown of contributing metrics
 * @param {Object} pattern - Pattern configuration
 * @param {Object} metrics - Combined metrics
 * @returns {Array} Array of metric breakdown objects
 */
const getMetricBreakdown = (pattern, metrics) => {
  const breakdown = [];

  Object.entries(pattern.metrics).forEach(([metricKey, config]) => {
    let metricValue;
    let displayName = metricKey;

    if (config.source === 'face') {
      metricValue = metrics.face[metricKey];
      displayName = formatMetricName(metricKey);
    } else if (config.source === 'body') {
      metricValue = metrics.body[metricKey];
      displayName = formatMetricName(metricKey);
    } else if (config.source === 'derived') {
      metricValue = config.calculate(metrics.body);
      displayName = formatMetricName(metricKey);
    }

    if (metricValue !== undefined && metricValue !== null && !isNaN(metricValue)) {
      const normalizedValue = config.normalize 
        ? config.normalize(metricValue)
        : Math.min(100, Math.abs(metricValue) * 10);

      breakdown.push({
        name: displayName,
        rawValue: metricValue,
        normalizedValue: normalizedValue,
        weight: config.weight,
        contribution: normalizedValue * config.weight,
        exceedsThreshold: config.threshold ? Math.abs(metricValue) > config.threshold : false
      });
    }
  });

  // Sort by contribution (highest first)
  return breakdown.sort((a, b) => b.contribution - a.contribution);
};

/**
 * Find the dominant (highest scoring) pattern
 * @param {Object} results - Pattern analysis results
 * @returns {Object|null} Dominant pattern or null
 */
const findDominantPattern = (results) => {
  let maxScore = 0;
  let dominant = null;

  Object.entries(results).forEach(([id, data]) => {
    if (data.score > maxScore && data.severity !== 'none') {
      maxScore = data.score;
      dominant = {
        id: id,
        ...data
      };
    }
  });

  return dominant;
};

/**
 * Generate text summary of pattern analysis
 * @param {Object} results - Pattern analysis results
 * @returns {string} Summary text
 */
const generateSummary = (results) => {
  const activePatterns = Object.entries(results)
    .filter(([_, data]) => data.severity !== 'none')
    .sort((a, b) => b[1].score - a[1].score);

  if (activePatterns.length === 0) {
    return 'No significant somatic patterns detected. Your posture and alignment are within normal ranges.';
  }

  const dominant = activePatterns[0];
  let summary = `Primary pattern: ${dominant[1].name} (${dominant[1].severity}). `;
  
  if (activePatterns.length > 1) {
    const secondaryNames = activePatterns.slice(1, 3).map(p => p[1].name);
    if (secondaryNames.length === 1) {
      summary += `Secondary pattern: ${secondaryNames[0]}.`;
    } else {
      summary += `Secondary patterns include ${secondaryNames.join(' and ')}.`;
    }
  }

  return summary;
};

/**
 * Format metric names for display
 * @param {string} key - Metric key
 * @returns {string} Formatted name
 */
const formatMetricName = (key) => {
  const names = {
    fhpAngle: 'Forward Head Posture',
    shoulderHeight: 'Shoulder Asymmetry',
    pelvicTilt: 'Pelvic Tilt',
    kneeAngle: 'Knee Alignment',
    footArchRatio: 'Foot Arch',
    headTilt: 'Head Tilt',
    jawShift: 'Jaw Shift',
    eyeSym: 'Eye Symmetry',
    nostrilAsym: 'Nostril Asymmetry',
    thoracicProxy: 'Upper Back Rounding',
    pelvicShiftProxy: 'Pelvic Shift',
    ribCageProxy: 'Rib Cage Compression',
    weightDistProxy: 'Weight Distribution'
  };
  return names[key] || key;
};

/**
 * Get pattern by ID
 * @param {string} patternId - Pattern ID
 * @returns {Object|null} Pattern configuration or null
 */
export const getPatternById = (patternId) => {
  return Object.values(SOMATIC_PATTERNS).find(p => p.id === patternId) || null;
};

/**
 * Get all pattern IDs
 * @returns {Array} Array of pattern IDs
 */
export const getAllPatternIds = () => {
  return Object.values(SOMATIC_PATTERNS).map(p => p.id);
};

export default analyzePatterns;