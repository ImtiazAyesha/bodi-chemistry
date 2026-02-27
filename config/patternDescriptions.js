/**
 * Plain-English Pattern Descriptions
 * Used by ResultsScreen for user-friendly summaries
 */

export const PATTERN_DESCRIPTIONS = {
  upper_compression: {
    plainName: 'Forward Compression',
    summary:
      'Your body tends to hold pressure in the jaw, neck, and upper chest to feel stable.',
    feelsLike: [
      'Neck tension',
      'Jaw clenching',
      'Shallow breathing',
      'Difficulty fully relaxing',
    ],
    whatItMeans:
      'Your body is using tension in the upper body to create stability when pressure is not distributed evenly. The goal is to retrain pressure distribution so your spine decompresses and your nervous system can relax.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        bullets: [
          'Notice jaw and neck tension patterns throughout the day',
          'Track breathing depth 3x daily — chest vs belly',
        ],
      },
      week2: {
        title: 'Redistribution',
        bullets: [
          'Diaphragmatic breathing for 5 minutes daily',
          'Gentle neck and jaw stretches — hold 30 seconds each',
        ],
      },
      week3: {
        title: 'Integration',
        bullets: [
          'Combine breathing with gentle movement',
          'Practice during daily activities (driving, working)',
        ],
      },
    },
  },

  lower_compression: {
    plainName: 'Lower Load Pattern',
    summary:
      'Your body tends to hold pressure in the hips, lower back, and legs to maintain stability.',
    feelsLike: [
      'Low back stiffness',
      'Hip tightness',
      'Heavy or locked legs',
      'Difficulty sitting comfortably',
    ],
    whatItMeans:
      'Your body is creating stability by gripping in the lower body. Over time this compresses the lumbar spine and limits hip mobility. The goal is to redistribute load so the pelvis moves freely and the legs carry weight without excess tension.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        bullets: [
          'Notice tension in hips, glutes, and low back when sitting or standing',
          'Observe weight distribution between left and right foot',
        ],
      },
      week2: {
        title: 'Redistribution',
        bullets: [
          'Hip flexor stretches — 2 minutes each side daily',
          'Glute bridges — 3 sets of 12 reps',
        ],
      },
      week3: {
        title: 'Integration',
        bullets: [
          'Practice hip mobility during walks',
          'Combine lower body stretches with breathing',
        ],
      },
    },
  },

  thoracic_collapse: {
    plainName: 'Thoracic Collapse',
    summary:
      'Your body tends to round forward through the upper back, compressing the chest and ribcage.',
    feelsLike: [
      'Rounded shoulders',
      'Feeling of chest tightness',
      'Shallow or restricted breathing',
      'Upper back fatigue',
    ],
    whatItMeans:
      'Your thoracic spine is losing its natural extension, causing the chest to compress and the ribcage to restrict. This limits breathing capacity and shifts postural load. The goal is to restore thoracic mobility so the spine elongates and breathing becomes fuller.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        bullets: [
          'Notice when your shoulders round forward during the day',
          'Check if your chest feels open or restricted during breathing',
        ],
      },
      week2: {
        title: 'Redistribution',
        bullets: [
          'Thoracic extensions on foam roller — 2 minutes daily',
          'Doorway chest stretches — 3 sets of 30 seconds',
        ],
      },
      week3: {
        title: 'Integration',
        bullets: [
          'Practice chest-opening movements during daily transitions',
          'Combine with deep breathing exercises',
        ],
      },
    },
  },

  lateral_asymmetry: {
    plainName: 'Lateral Asymmetry',
    summary:
      'Your body tends to favor one side, creating uneven loading and rotational tension.',
    feelsLike: [
      'One-sided tension or pain',
      'Feeling lopsided or off-balance',
      'Dominant side overworking',
      'Difficulty with coordination',
    ],
    whatItMeans:
      'Your body is distributing weight and tension unevenly between left and right sides. This creates compensatory rotation patterns that can affect everything from your gait to your jaw alignment. The goal is to balance loading so both sides share the work equally.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        bullets: [
          'Notice which side you lean toward when standing or sitting',
          'Observe whether you favor one arm, leg, or jaw side',
        ],
      },
      week2: {
        title: 'Redistribution',
        bullets: [
          'Unilateral stretching — extra time on the tight side',
          'Single-leg balance work — 2 minutes each side',
        ],
      },
      week3: {
        title: 'Integration',
        bullets: [
          'Practice even weight distribution during daily activities',
          'Use mirror feedback to check alignment',
        ],
      },
    },
  },
};

/**
 * Metric display names for the "Markers Detected" section
 */
export const METRIC_DISPLAY_NAMES = {
  eyeSym: { name: 'Eye Symmetry', unit: '' },
  jawShift: { name: 'Jaw Shift', unit: '' },
  headTilt: { name: 'Head Tilt', unit: '°' },
  nostrilAsym: { name: 'Nostril Asymmetry', unit: '' },
  shoulderHeight: { name: 'Shoulder Height Asymmetry', unit: '' },
  fhpAngle: { name: 'FHP (Forward Head Posture) Angle', unit: '°' },
  pelvicTilt: { name: 'Pelvic Tilt', unit: '°' },
  kneeAngle: { name: 'Knee Angle', unit: '°' },
  footArchRatio: { name: 'Foot Arch Ratio', unit: '' },
};
