/**
 * Somatic Pattern Configuration
 * Defines 4 core postural/alignment patterns and their metric mappings
 */

export const SOMATIC_PATTERNS = {
  UPPER_COMPRESSION: {
    id: 'upper_compression',
    name: 'Upper Compression Pattern',
    description: 'Forward head posture, shoulder tension, jaw clenching',
    color: '#FF6B6B',
    icon: '🔴',
    severity_thresholds: {
      mild: 30,      // 30-49 points
      moderate: 50,  // 50-69 points
      severe: 70     // 70+ points
    },
    metrics: {
      fhpAngle: { 
        weight: 0.35, 
        source: 'body',
        threshold: 15,  // degrees
        // FIXED: Higher CVA angle (60-90°) = BETTER posture = LOWER score
        // Lower CVA angle (<40°) = WORSE posture = HIGHER score
        normalize: ( value ) => {
          if ( value === null || value === undefined ) return 50;
          // Excellent posture (60-90°) → Low dysfunction score (0-10)
          if ( value >= 60 ) return Math.max( 0, 10 - ( ( value - 60 ) / 3 ) );
          // Normal posture (50-60°) → Low-moderate dysfunction (10-30)
          if ( value >= 50 ) return 30 - ( ( value - 50 ) * 2 );
          // Mild FHP (45-50°) → Moderate dysfunction (30-50)
          if ( value >= 45 ) return 50 - ( ( value - 45 ) * 4 );
          // Moderate FHP (40-45°) → High dysfunction (50-70)
          if ( value >= 40 ) return 70 - ( ( value - 40 ) * 4 );
          // Severe FHP (<40°) → Very high dysfunction (70-100)
          return Math.min( 100, 70 + ( ( 40 - value ) * 2 ) );
        }
      },
      shoulderHeight: { 
        weight: 0.25, 
        source: 'body',
        threshold: 0.05,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.15) * 100)
      },
      headTilt: { 
        weight: 0.10, 
        source: 'face',
        threshold: 5,
        normalize: (value) => Math.min(100, (Math.abs(value) / 15) * 100)
      },
      jawShift: { 
        weight: 0.10, 
        source: 'face',
        threshold: 0.02,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.08) * 100)
      },
      eyeSym: { 
        weight: 0.10, 
        source: 'face',
        threshold: 0.02,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.08) * 100)
      },
      // Proxy for thoracic kyphosis
      thoracicProxy: {
        weight: 0.10,
        source: 'derived',
        calculate: (metrics) => Math.abs(metrics.fhpAngle || 0) * 0.8
      }
    },
    recommendations: {
      none: [],
      mild: [
        'Chin tucks: 3 sets of 10 reps daily',
        'Shoulder blade squeezes: 2 sets of 15 reps',
        'Neck stretches: Hold 30 seconds each side',
        'Take breaks from screen time every 30 minutes'
      ],
      moderate: [
        'All mild exercises plus:',
        'Wall angels: 3 sets of 12 reps',
        'Thoracic extension on foam roller: 2 minutes daily',
        'Consider ergonomic workspace assessment',
        'Practice proper head positioning during daily activities'
      ],
      severe: [
        'All moderate exercises plus:',
        'Professional physical therapy assessment recommended',
        'Postural bracing may be beneficial',
        'Comprehensive ergonomic evaluation',
        'Consider chiropractic or osteopathic consultation'
      ]
    }
  },
  
  LOWER_COMPRESSION: {
    id: 'lower_compression',
    name: 'Lower Compression Pattern',
    description: 'Anterior pelvic tilt, knee issues, foot pronation',
    color: '#4ECDC4',
    icon: '🟢',
    severity_thresholds: {
      mild: 30,
      moderate: 50,
      severe: 70
    },
    metrics: {
      pelvicTilt: { 
        weight: 0.30, 
        source: 'body',
        threshold: 10,
        // FIXED: Realistic pelvic tilt ranges (0-15° typical, not 0-47°)
        normalize: ( value ) => {
          if ( value === null || value === undefined ) return 50;
          const absValue = Math.abs( value );
          // Normal: 0-3° (level hips)
          if ( absValue <= 3 ) return 0;
          // Mild: 3-8°
          if ( absValue <= 8 ) return 30;
          // Moderate: 8-15°
          if ( absValue <= 15 ) return 60;
          // Severe: >15°
          return Math.min( 100, 60 + ( ( absValue - 15 ) * 2.5 ) );
        }
      },
      kneeAngle: { 
        weight: 0.25, 
        source: 'body',
        threshold: 5,
        normalize: (value) => {
          const deviation = Math.abs(value - 180);
          return Math.min(100, (deviation / 20) * 100);
        }
      },
      footArchRatio: { 
        weight: 0.25, 
        source: 'body',
        threshold: 0.05,
        normalize: (value) => {
          const ideal = 0.30;
          const deviation = Math.abs(value - ideal);
          return Math.min(100, (deviation / 0.20) * 100);
        }
      },
      // Proxy for lateral pelvic shift
      pelvicShiftProxy: {
        weight: 0.20,
        source: 'derived',
        calculate: (metrics) => Math.abs(metrics.shoulderHeight || 0) * 50
      }
    },
    recommendations: {
      none: [],
      mild: [
        'Hip flexor stretches: 3 sets of 30 seconds each side',
        'Glute bridges: 3 sets of 15 reps',
        'Foot arch strengthening exercises',
        'Calf stretches: 2 sets of 30 seconds each side'
      ],
      moderate: [
        'All mild exercises plus:',
        'Dead bugs: 3 sets of 10 reps',
        'Single-leg balance work: 2 minutes each side',
        'Consider orthotic assessment',
        'Strengthen core stabilizers'
      ],
      severe: [
        'All moderate exercises plus:',
        'Professional biomechanical assessment recommended',
        'Gait analysis recommended',
        'Custom orthotics may be necessary',
        'Consider podiatry consultation'
      ]
    }
  },
  
  THORACIC_COLLAPSE: {
    id: 'thoracic_collapse',
    name: 'Thoracic Collapse Pattern',
    description: 'Upper back rounding, chest compression, shallow breathing',
    color: '#95E1D3',
    icon: '🟡',
    severity_thresholds: {
      mild: 30,
      moderate: 50,
      severe: 70
    },
    metrics: {
      fhpAngle: { 
        weight: 0.50,  // Higher weight as primary indicator
        source: 'body',
        threshold: 20,
        // FIXED: Same as above - higher CVA = better posture
        normalize: ( value ) => {
          if ( value === null || value === undefined ) return 50;
          if ( value >= 60 ) return Math.max( 0, 10 - ( ( value - 60 ) / 3 ) );
          if ( value >= 50 ) return 30 - ( ( value - 50 ) * 2 );
          if ( value >= 45 ) return 50 - ( ( value - 45 ) * 4 );
          if ( value >= 40 ) return 70 - ( ( value - 40 ) * 4 );
          return Math.min( 100, 70 + ( ( 40 - value ) * 2 ) );
        }
      },
      shoulderHeight: { 
        weight: 0.30, 
        source: 'body',
        threshold: 0.05,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.15) * 100)
      },
      // Derived rib cage ratio from shoulder protraction
      ribCageProxy: {
        weight: 0.20,
        source: 'derived',
        calculate: (metrics) => {
          const fhpContribution = (Math.abs(metrics.fhpAngle || 0) * 0.6);
          const shoulderContribution = (Math.abs(metrics.shoulderHeight || 0) * 20);
          return Math.min(100, fhpContribution + shoulderContribution);
        }
      }
    },
    recommendations: {
      none: [],
      mild: [
        'Thoracic extensions: 3 sets of 10 reps',
        'Doorway chest stretches: 3 sets of 30 seconds',
        'Deep breathing exercises: 5 minutes daily',
        'Cat-cow stretches: 2 sets of 10 reps'
      ],
      moderate: [
        'All mild exercises plus:',
        'Foam roller thoracic mobilization: 3 minutes daily',
        'Scapular wall slides: 3 sets of 12 reps',
        'Breathing pattern assessment recommended',
        'Strengthen mid-back muscles'
      ],
      severe: [
        'All moderate exercises plus:',
        'Manual therapy recommended',
        'Postural restoration therapy',
        'Respiratory function assessment',
        'Consider structural integration therapy'
      ]
    }
  },
  
  LATERAL_ASYMMETRY: {
    id: 'lateral_asymmetry',
    name: 'Lateral/Rotational Asymmetry Pattern',
    description: 'One-sided tension, uneven loading, rotational patterns',
    color: '#A8E6CF',
    icon: '🔵',
    severity_thresholds: {
      mild: 25,
      moderate: 45,
      severe: 65
    },
    metrics: {
      shoulderHeight: { 
        weight: 0.30, 
        source: 'body',
        threshold: 0.03,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.12) * 100)
      },
      pelvicTilt: { 
        weight: 0.25,  // Proxy for lateral shift
        source: 'body',
        threshold: 8,
        // FIXED: Same realistic ranges
        normalize: ( value ) => {
          if ( value === null || value === undefined ) return 50;
          const absValue = Math.abs( value );
          if ( absValue <= 3 ) return 0;
          if ( absValue <= 8 ) return 30;
          if ( absValue <= 15 ) return 60;
          return Math.min( 100, 60 + ( ( absValue - 15 ) * 2.5 ) );
        }
      },
      headTilt: { 
        weight: 0.20, 
        source: 'face',
        threshold: 3,
        normalize: (value) => Math.min(100, (Math.abs(value) / 12) * 100)
      },
      jawShift: { 
        weight: 0.10, 
        source: 'face',
        threshold: 0.015,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.06) * 100)
      },
      nostrilAsym: { 
        weight: 0.10, 
        source: 'face',
        threshold: 0.015,
        normalize: (value) => Math.min(100, (Math.abs(value) / 0.06) * 100)
      },
      // Weight distribution proxy (using only body metrics)
      weightDistProxy: {
        weight: 0.05,
        source: 'derived',
        calculate: (metrics) => {
          const asymmetryScore = 
            Math.abs(metrics.shoulderHeight || 0) * 40 +
            Math.abs(metrics.pelvicTilt || 0) * 2;
          return Math.min(100, asymmetryScore);
        }
      }
    },
    recommendations: {
      none: [],
      mild: [
        'Unilateral stretching (focus on tight side)',
        'Balance exercises: Single-leg stands 2 min each side',
        'Mirror work to increase body awareness',
        'Avoid carrying bags on same shoulder'
      ],
      moderate: [
        'All mild exercises plus:',
        'Functional movement screening recommended',
        'Corrective exercises for dominant side',
        'Ergonomic assessment of daily activities',
        'Address sleeping position and mattress quality'
      ],
      severe: [
        'All moderate exercises plus:',
        'Professional structural assessment recommended',
        'Possible scoliosis screening',
        'Neuromuscular re-education therapy',
        'Consider chiropractic or osteopathic evaluation'
      ]
    }
  }
};

/**
 * Get pattern severity based on score
 * @param {number} score - Pattern score (0-100)
 * @returns {string} Severity level
 */
export const getPatternSeverity = (score) => {
  if (score < 30) return 'none';
  if (score < 50) return 'mild';
  if (score < 70) return 'moderate';
  return 'severe';
};

/**
 * Get color for severity level
 * @param {string} severity - Severity level
 * @returns {string} Hex color code
 */
export const getSeverityColor = (severity) => {
  const colors = {
    none: '#4CAF50',
    mild: '#FFC107',
    moderate: '#FF9800',
    severe: '#F44336'
  };
  return colors[severity] || '#9E9E9E';
};

/**
 * Get severity label for display
 * @param {string} severity - Severity level
 * @returns {string} Display label
 */
export const getSeverityLabel = (severity) => {
  const labels = {
    none: 'Not Detected',
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe'
  };
  return labels[severity] || 'Unknown';
};

export default SOMATIC_PATTERNS;