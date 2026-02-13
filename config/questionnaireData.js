// 20-Question Somatic Pattern Classification Questionnaire
// Each question contributes to one or more of the four primary patterns:
// - Upper Compression
// - Lower Compression
// - Thoracic Collapse
// - Lateral Asymmetry

export const QUESTIONNAIRE_DATA = [
  {
    id: 1,
    question: "When unexpected stress hits, your body's first reaction is:",
    options: [
      {
        label: "A",
        text: "Lock up — Jaw clenches, shoulders rise, breath stops",
        scoring: { upperCompression: 3 }
      },
      {
        label: "B",
        text: "Push through — Adrenaline kicks in, you go into action mode",
        scoring: { lowerCompression: 2, upperCompression: 1 }
      },
      {
        label: "C",
        text: "Shut down — Energy drops, you go blank or numb",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "D",
        text: "Oscillate — Ping-pong between wired and exhausted",
        scoring: { upperCompression: 1, lowerCompression: 1, thoracicCollapse: 1, lateralAsymmetry: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "After a stressful day, you typically:",
    options: [
      {
        label: "A",
        text: "Can't turn off — Mind races, body feels wired",
        scoring: { upperCompression: 3 }
      },
      {
        label: "B",
        text: "Crash hard — Collapse on the couch, can't do anything",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "C",
        text: "Need intense movement — Run, workout, release energy",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "D",
        text: "Don't really feel it — Disconnected from your body",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  },
  {
    id: 3,
    question: "Your relationship with rest is:",
    options: [
      {
        label: "A",
        text: "I have to earn it — Can't relax unless everything's done",
        scoring: { upperCompression: 2, lowerCompression: 1 }
      },
      {
        label: "B",
        text: "I crave it but can't access it — Tired but wired",
        scoring: { upperCompression: 3 }
      },
      {
        label: "C",
        text: "I can drop in fairly easily — Rest feels restorative",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "D",
        text: "I avoid it — Stillness feels uncomfortable",
        scoring: { lowerCompression: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "When someone says \"just breathe,\" you:",
    options: [
      {
        label: "A",
        text: "Feel frustrated — That doesn't work for me",
        scoring: { upperCompression: 2, thoracicCollapse: 1 }
      },
      {
        label: "B",
        text: "Try harder — Force deep breaths that don't help",
        scoring: { upperCompression: 2 }
      },
      {
        label: "C",
        text: "Can actually use it — Breathing helps me regulate",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "D",
        text: "Feel more anxious — Deep breathing makes it worse",
        scoring: { thoracicCollapse: 3 }
      }
    ]
  },
  {
    id: 5,
    question: "Your typical energy pattern throughout the day:",
    options: [
      {
        label: "A",
        text: "Steady and sustainable — Relatively consistent",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "B",
        text: "Starts high, crashes hard — Morning energy → afternoon collapse",
        scoring: { upperCompression: 2, lowerCompression: 1 }
      },
      {
        label: "C",
        text: "Low all day — Never fully awake",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "D",
        text: "All over the place — Unpredictable peaks and crashes",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  },
  {
    id: 6,
    question: "When you feel emotion rising, you:",
    options: [
      {
        label: "A",
        text: "Suppress it immediately — Push it down, stay composed",
        scoring: { upperCompression: 3 }
      },
      {
        label: "B",
        text: "Feel it intensely — Cry, rage, or release fully",
        scoring: { thoracicCollapse: 1 }
      },
      {
        label: "C",
        text: "Go numb — Can't access the feeling",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "D",
        text: "Get overwhelmed — It floods and takes over",
        scoring: { upperCompression: 1, thoracicCollapse: 1 }
      }
    ]
  },
  {
    id: 7,
    question: "Your sleep pattern is:",
    options: [
      {
        label: "A",
        text: "Hard to fall asleep, hard to wake up — Never feel rested",
        scoring: { lowerCompression: 2, upperCompression: 1 }
      },
      {
        label: "B",
        text: "Fall asleep exhausted, wake up wired — Broken sleep",
        scoring: { upperCompression: 3 }
      },
      {
        label: "C",
        text: "Generally restorative — Wake feeling refreshed",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "D",
        text: "Inconsistent — Some nights good, some terrible",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  },
  {
    id: 8,
    question: "In social situations, your body tends to:",
    options: [
      {
        label: "A",
        text: "Stay on alert — Scanning, monitoring, performing",
        scoring: { upperCompression: 3 }
      },
      {
        label: "B",
        text: "Need recovery time after — People exhaust you",
        scoring: { thoracicCollapse: 2 }
      },
      {
        label: "C",
        text: "Feel energized — Connection fills you up",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "D",
        text: "Disconnect — You're there but not really present",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  },
  {
    id: 9,
    question: "Your relationship with your body is:",
    options: [
      {
        label: "A",
        text: "Functional — It's a tool to get things done",
        scoring: { upperCompression: 2, lowerCompression: 1 }
      },
      {
        label: "B",
        text: "Adversarial — It betrays me, doesn't cooperate",
        scoring: { lowerCompression: 2, thoracicCollapse: 1 }
      },
      {
        label: "C",
        text: "Trustworthy — I listen to it and it guides me",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "D",
        text: "Disconnected — I don't really feel it",
        scoring: { lateralAsymmetry: 3 }
      }
    ]
  },
  {
    id: 10,
    question: "Where do you feel tension most often?",
    options: [
      {
        label: "A",
        text: "Neck, jaw, or head",
        scoring: { upperCompression: 3 }
      },
      {
        label: "B",
        text: "Lower back, hips, or knees",
        scoring: { lowerCompression: 3 }
      },
      {
        label: "C",
        text: "Upper back, chest, or shoulders",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "D",
        text: "One side of my body more than the other",
        scoring: { lateralAsymmetry: 3 }
      }
    ]
  },
  {
    id: 11,
    question: "When you sit for extended periods, what happens?",
    options: [
      {
        label: "A",
        text: "My head/neck jutts forward, shoulders hunch",
        scoring: { upperCompression: 2 }
      },
      {
        label: "B",
        text: "My lower back arches or I slump into my pelvis",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "C",
        text: "My upper back rounds forward",
        scoring: { thoracicCollapse: 2 }
      },
      {
        label: "D",
        text: "I lean or shift to one side",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  },
  {
    id: 12,
    question: "How would you describe your breathing pattern?",
    options: [
      {
        label: "A",
        text: "Shallow, mostly in my chest",
        scoring: { upperCompression: 2, thoracicCollapse: 1 }
      },
      {
        label: "B",
        text: "I hold my breath or sigh frequently",
        scoring: { upperCompression: 2 }
      },
      {
        label: "C",
        text: "I feel like I can't take a full deep breath",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "D",
        text: "My breathing feels uneven or asymmetrical",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  },
  {
    id: 13,
    question: "Do you experience regular pain, stiffness, or compression in joints?",
    options: [
      {
        label: "A",
        text: "Neck, jaw, or headaches",
        scoring: { upperCompression: 2 }
      },
      {
        label: "B",
        text: "Lower back, SI joint, or knee pain",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "C",
        text: "Upper back, between shoulder blades",
        scoring: { thoracicCollapse: 2 }
      },
      {
        label: "D",
        text: "One-sided pain patterns",
        scoring: { lateralAsymmetry: 3 }
      }
    ]
  },
  {
    id: 14,
    question: "How do your feet feel when standing?",
    options: [
      {
        label: "A",
        text: "I don't notice them much / balanced",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "B",
        text: "My arches feel collapsed or flat",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "C",
        text: "I shift weight to my toes",
        scoring: { upperCompression: 1 }
      },
      {
        label: "D",
        text: "I favor one foot over the other",
        scoring: { lateralAsymmetry: 3 }
      }
    ]
  },
  {
    id: 15,
    question: "Which movement is most restricted for you?",
    options: [
      {
        label: "A",
        text: "Looking up or extending my neck",
        scoring: { upperCompression: 2 }
      },
      {
        label: "B",
        text: "Bending forward or touching my toes",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "C",
        text: "Reaching overhead or opening my chest",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "D",
        text: "Rotating or side-bending",
        scoring: { lateralAsymmetry: 3 }
      }
    ]
  },
  {
    id: 16,
    question: "Do you have a dominant side you favor?",
    options: [
      {
        label: "A",
        text: "Yes, significantly",
        scoring: { lateralAsymmetry: 3 }
      },
      {
        label: "B",
        text: "Somewhat",
        scoring: { lateralAsymmetry: 1 }
      },
      {
        label: "C",
        text: "No, I'm fairly balanced",
        scoring: { lateralAsymmetry: -1 }
      }
    ]
  },
  {
    id: 17,
    question: "How do you feel about back-bending or opening your chest?",
    options: [
      {
        label: "A",
        text: "Very difficult, uncomfortable, or scary",
        scoring: { thoracicCollapse: 3 }
      },
      {
        label: "B",
        text: "Somewhat challenging",
        scoring: { thoracicCollapse: 1 }
      },
      {
        label: "C",
        text: "Comfortable and natural",
        scoring: { thoracicCollapse: -1 }
      }
    ]
  },
  {
    id: 18,
    question: "When you squat, what happens?",
    options: [
      {
        label: "A",
        text: "My heels lift, can't go deep",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "B",
        text: "My knees collapse inward",
        scoring: { lowerCompression: 2 }
      },
      {
        label: "C",
        text: "My lower back rounds excessively",
        scoring: { thoracicCollapse: 1 }
      },
      {
        label: "D",
        text: "Squats feel relatively comfortable",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      }
    ]
  },
  {
    id: 19,
    question: "Do you feel coordinated in your movement?",
    options: [
      {
        label: "A",
        text: "Yes, I move fluidly",
        scoring: { upperCompression: -1, lowerCompression: -1, thoracicCollapse: -1, lateralAsymmetry: -1 }
      },
      {
        label: "B",
        text: "Sometimes clumsy or uncoordinated",
        scoring: { lateralAsymmetry: 2 }
      },
      {
        label: "C",
        text: "My left and right sides feel very different",
        scoring: { lateralAsymmetry: 3 }
      }
    ]
  },
  {
    id: 20,
    question: "If you could change one thing about how your body responds to stress, it would be:",
    options: [
      {
        label: "A",
        text: "Stop holding tension everywhere — Let go physically",
        scoring: { upperCompression: 2 }
      },
      {
        label: "B",
        text: "Actually feel calm — Not just fake it",
        scoring: { upperCompression: 2 }
      },
      {
        label: "C",
        text: "Have consistent energy — Stop the crashes",
        scoring: { lowerCompression: 2, thoracicCollapse: 1 }
      },
      {
        label: "D",
        text: "Reconnect — Feel present in my body",
        scoring: { lateralAsymmetry: 2 }
      }
    ]
  }
];

// Pattern names mapping
export const PATTERN_NAMES = {
  upperCompression: "Upper Compression",
  lowerCompression: "Lower Compression",
  thoracicCollapse: "Thoracic Collapse",
  lateralAsymmetry: "Lateral Asymmetry"
};

// Pattern keys for iteration
export const PATTERN_KEYS = [
  'upperCompression',
  'lowerCompression',
  'thoracicCollapse',
  'lateralAsymmetry'
];