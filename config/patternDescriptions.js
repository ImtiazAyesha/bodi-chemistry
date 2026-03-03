/**
 * Pattern Descriptions — Exact Client Spec
 * New names, expanded content, specific exercises with YouTube links
 */

export const PATTERN_DESCRIPTIONS = {
  upper_compression: {
    plainName: 'Forward Compression',
    formerName: 'Upper Compression',
    summary:
      'Your body tends to hold pressure in the jaw, neck, and upper chest to feel stable. Instead of pressure moving evenly through your trunk and into the ground, it stays high and forward.',
    feelsLike: [
      'Neck tension',
      'Jaw clenching or TMJ',
      'Shallow breathing',
      'Feeling "wired" even when tired',
      'Difficulty fully relaxing',
    ],
    whatBodyIsDoing: [
      'Your body is not broken.',
      'It is using tension in the front of the body to create stability when pressure is not distributing evenly through the Core Pressure Canister™ (ribcage, diaphragm, spine, pelvis).',
    ],
    whenPressureStaysHigh: [
      'The spine carries more load',
      'The nervous system stays alert',
      'Relaxation feels difficult',
    ],
    goalStatement:
      'The goal is not to "fix posture." The goal is to reorganize internal pressure so the spine decompresses and the nervous system can settle.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        exercise: 'Supine Breathing with Feet on Wall',
        steps: [
          'Lie on your back',
          'Feet flat against wall',
          'Inhale through nose',
          'Exhale longer than inhale',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=kgTL5G1ibIo',
        goal: 'Feel breath move into back ribs instead of lifting chest.',
      },
      week2: {
        title: 'Redistribution',
        exercise: 'Heel Pressure + Tongue Awareness',
        steps: [
          'During exhale, gently press heels into floor',
          'Rest tongue lightly on roof of mouth',
          'Let ribs soften downward',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=RqcOCBb4arc',
        goal: 'Shift pressure downward out of the neck and jaw.',
      },
      week3: {
        title: 'Integration',
        exercise: 'Quiet Walking Practice',
        steps: [
          'Walk slowly',
          'Quiet steps',
          'Organize tongue, ribs, pelvis, feet',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=K1NqK6gY8m0',
        goal: 'Maintain balanced pressure during movement.',
      },
    },
    expectedShift: null,
    diagramLabels: {
      image1: 'Forward Compression — Pressure Held at the Top',
      image2: 'Balanced Pressure — Spine Decompressed',
    },
  },

  lower_compression: {
    plainName: 'Back Bracing',
    formerName: 'Lower Compression',
    summary:
      'Your body creates stability by gripping the low back and hamstrings. Instead of pressure expanding evenly through the trunk, your posterior chain holds everything together.',
    feelsLike: [
      'Tight low back',
      '"Always tight" hamstrings',
      'Limited hip mobility',
      'Fatigue when standing',
      'Relief when leaning forward',
    ],
    whatBodyIsDoing: [
      'Your diaphragm sends pressure downward with every inhale.',
      'If your pelvis cannot receive that pressure, your back muscles brace to contain it.',
    ],
    whenPressureStaysHigh: [
      'The back never fully relaxes',
      'Hips feel restricted',
      'The system stays guarded',
    ],
    goalStatement:
      'The goal is to teach the trunk to expand so the back does not have to grip.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        exercise: 'Side-Lying Rib Expansion',
        steps: [
          'Lie on your side',
          'Expand ribs into the floor',
          'Slow nasal breathing',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=3F5fYQpJj5I',
        goal: null,
      },
      week2: {
        title: 'Redistribution',
        exercise: 'Reach + Expand',
        steps: [
          'Add gentle arm reach',
          'Maintain rib expansion',
          'Avoid back gripping',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=QmO4bRk3nqY',
        goal: null,
      },
      week3: {
        title: 'Integration',
        exercise: 'Controlled Lunges',
        steps: [
          'Slow step-through lunges',
          'Maintain relaxed spine',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
        goal: null,
      },
    },
    expectedShift: 'Hips feel lighter. Standing requires less effort.',
    diagramLabels: {
      image1: 'Back Bracing — Pressure Blocked Below',
      image2: 'Balanced Trunk Expansion',
    },
  },

  lateral_asymmetry: {
    plainName: 'Lateral Shift',
    formerName: 'Lateral Asymmetry',
    summary:
      'Your body leans into one side for stability. Pressure favors one side of your body instead of distributing evenly.',
    feelsLike: [
      'One hip tighter',
      'One shoulder elevated',
      'Uneven jaw',
      'Recurring one-sided pain',
      'Uneven flexibility',
    ],
    whatBodyIsDoing: [
      'Instead of stacking pressure symmetrically, your system trusts one side more.',
      'That side becomes overloaded.',
      'The other side becomes underused.',
    ],
    whenPressureStaysHigh: null,
    goalStatement:
      'The goal is not forcing symmetry. The goal is restoring alternating support.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        exercise: 'Supported Weight Shifts',
        steps: [
          'Shift slowly from one foot to the other',
          'Slow nasal breathing',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=9t8L1FhYkRM',
        goal: null,
      },
      week2: {
        title: 'Redistribution',
        exercise: 'Cross-Midline Reach',
        steps: [
          'Reach across midline',
          'Load lighter side',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=PYlQ3sOXf0U',
        goal: null,
      },
      week3: {
        title: 'Integration',
        exercise: 'Alternating Step-Back',
        steps: [
          'Step back one leg at a time',
          'Maintain even loading',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=I2lA0q_4qA4',
        goal: null,
      },
    },
    expectedShift: 'Walking feels smoother. Less one-sided tension.',
    diagramLabels: {
      image1: 'Lateral Shift — Pressure Favoring One Side',
      image2: 'Even Left-Right Pressure Distribution',
    },
  },

  thoracic_collapse: {
    plainName: 'Collapse',
    formerName: 'Thoracic Collapse',
    summary:
      'Your body reduces expansion to conserve energy. Instead of bracing, your system minimizes pressure variation.',
    feelsLike: [
      'Fatigue',
      'Low motivation',
      'Shallow breathing',
      'Heaviness',
      'Rounded posture',
    ],
    whatBodyIsDoing: [
      'Your nervous system is conserving.',
      'By reducing pressure oscillation, it lowers strain — but also lowers energy.',
    ],
    whenPressureStaysHigh: null,
    goalStatement: 'The goal is gradual, safe expansion.',
    weeklyPlan: {
      week1: {
        title: 'Awareness',
        exercise: 'Gentle Rib Expansion',
        steps: [
          'Slow, small rib expansion',
          'No force',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=UuGpm01SPcA',
        goal: null,
      },
      week2: {
        title: 'Redistribution',
        exercise: 'Arm Elevation + Breath',
        steps: [
          'Lift arms slightly on inhale',
          'Avoid collapsing on exhale',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=0Cj7S1YjJtM',
        goal: null,
      },
      week3: {
        title: 'Integration',
        exercise: 'Rhythmic Walking',
        steps: [
          'Short, steady walks',
          'Consistent breathing',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=TBX3_3fVb70',
        goal: null,
      },
    },
    expectedShift: 'Energy gradually improves. Breathing deepens naturally.',
    diagramLabels: {
      image1: 'Collapse — Minimal Pressure Variation',
      image2: 'Balanced Expansion Through Ribcage and Pelvis',
    },
  },
};

/**
 * Shared content across all patterns
 */
export const SHARED_CONTENT = {
  importantReminder:
    'Your pattern is not permanent. It is your body\'s current dominant strategy. With consistent practice, pressure redistributes and tension reduces naturally.',
  guidanceCTA: {
    intro: 'If you\'d like personalized coaching to accelerate this process, I offer:',
    bullets: [
      '1:1 private sessions',
      'Guided programs',
      'Structured nervous system training',
    ],
    closing: 'You don\'t have to figure this out alone.',
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
