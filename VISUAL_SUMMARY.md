# 🎯 Questionnaire Integration - Visual Summary

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BODI KEMISTRI ASSESSMENT                     │
│                    Somatic Pattern Classification                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │         USER COMPLETES ASSESSMENT          │
        └────────────────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │   QUESTIONNAIRE     │         │   PHOTO CAPTURE     │
    │    (20 Questions)   │         │    (4 Stages)       │
    │                     │         │                     │
    │  • Stress Response  │         │  • Face (Stage 1)   │
    │  • Energy Patterns  │         │  • Upper Front (2)  │
    │  • Body Awareness   │         │  • Upper Side (3)   │
    │  • Pain Locations   │         │  • Lower Side (4)   │
    │  • Movement Quality │         │                     │
    └─────────────────────┘         └─────────────────────┘
                 │                               │
                 │                               │
                 ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │  QUESTIONNAIRE      │         │   VISUAL ANALYSIS   │
    │  SCORING ENGINE     │         │   (MediaPipe)       │
    │                     │         │                     │
    │  Raw Scores →       │         │  Face Metrics →     │
    │  Normalized (0-100) │         │  Body Metrics →     │
    └─────────────────────┘         └─────────────────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────┐
              │   INTEGRATED PATTERN FUSION      │
              │                                  │
              │  Body Metrics      × 50% = X     │
              │  Face Metrics      × 30% = Y     │
              │  Questionnaire     × 20% = Z     │
              │                                  │
              │  Final Score = X + Y + Z         │
              └──────────────────────────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────┐
              │   PATTERN CLASSIFICATION         │
              │                                  │
              │  Primary Pattern: Upper Comp.    │
              │  Score: 72.5                     │
              │  Severity: Severe                │
              │                                  │
              │  Secondary Pattern: Lower Comp.  │
              │  Score: 43.2                     │
              │                                  │
              │  Confidence: HIGH (85%)          │
              └──────────────────────────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────┐
              │      RESULTS & RECOMMENDATIONS   │
              │                                  │
              │  • Pattern explanation           │
              │  • Severity assessment           │
              │  • Personalized recommendations  │
              │  • GHL webhook trigger           │
              └──────────────────────────────────┘
```

---

## Data Flow Diagram

```
QUESTIONNAIRE COMPONENT
    │
    │ User selects answers
    │ ['A', 'B', 'C', 'D', ...]
    │
    ▼
calculateQuestionnaireScores()
    │
    ├─► Step 1: Calculate Raw Scores
    │   │
    │   │ Q1: A → UC +3
    │   │ Q2: A → UC +3
    │   │ Q3: B → UC +3
    │   │ ...
    │   │
    │   └─► rawScores = {
    │         upperCompression: 25,
    │         lowerCompression: 12,
    │         thoracicCollapse: 8,
    │         lateralAsymmetry: 5
    │       }
    │
    ├─► Step 2: Normalize (0-100)
    │   │
    │   │ Formula: ((raw + 10) / 60) × 100
    │   │
    │   └─► normalizedScores = {
    │         upperCompression: 58.33,
    │         lowerCompression: 36.67,
    │         thoracicCollapse: 30.00,
    │         lateralAsymmetry: 25.00
    │       }
    │
    └─► Return Complete Result
        │
        └─► {
              answers: [...],
              rawScores: {...},
              normalizedScores: {...},
              metadata: {...}
            }
            │
            ▼
        APP.JSX (stores in state)
            │
            ▼
        PROCESSING STAGE
            │
            ├─► Body Metrics (from photos)
            ├─► Face Metrics (from photos)
            └─► Questionnaire Scores
                │
                ▼
        integrateAllModalities()
                │
                ├─► fusePatternScores()
                │   │
                │   │ UC = (75 × 0.5) + (70 × 0.3) + (58.33 × 0.2)
                │   │    = 37.5 + 21.0 + 11.67
                │   │    = 70.17
                │   │
                │   └─► finalScores = {
                │         upperCompression: 70.17,
                │         lowerCompression: 42.50,
                │         thoracicCollapse: 32.00,
                │         lateralAsymmetry: 23.33
                │       }
                │
                └─► calculateConfidenceBand()
                    │
                    └─► confidence = {
                          level: 'HIGH',
                          percentage: 85,
                          reasoning: [...]
                        }
                │
                ▼
        RESULTS SCREEN
                │
                └─► Display to user
                    Send to GHL webhook
```

---

## Scoring Formula Breakdown

### 1️⃣ Raw Score Calculation

```
┌─────────────────────────────────────────────────────────┐
│  QUESTION 1: When unexpected stress hits...             │
├─────────────────────────────────────────────────────────┤
│  A) Lock up → UC +3                                     │
│  B) Push through → LC +2, UC +1                         │
│  C) Shut down → TC +3                                   │
│  D) Oscillate → All +1                                  │
└─────────────────────────────────────────────────────────┘
                    │
                    │ User selects: A
                    ▼
        ┌───────────────────────┐
        │  UC += 3              │
        │  LC += 0              │
        │  TC += 0              │
        │  LA += 0              │
        └───────────────────────┘

... repeat for all 20 questions ...

        ┌───────────────────────┐
        │  FINAL RAW SCORES:    │
        │  UC = 25              │
        │  LC = 12              │
        │  TC = 8               │
        │  LA = 5               │
        └───────────────────────┘
```

### 2️⃣ Normalization

```
┌─────────────────────────────────────────────────────────┐
│  NORMALIZATION FORMULA                                  │
│  normalizedScore = ((rawScore + 10) / 60) × 100         │
├─────────────────────────────────────────────────────────┤
│  Why +10?  Accounts for negative values (min ~-10)     │
│  Why /60?  Normalizes range (max ~50-60 points)        │
└─────────────────────────────────────────────────────────┘

Example: Upper Compression

rawScore = 25

Step 1: Add offset
25 + 10 = 35

Step 2: Divide by range
35 / 60 = 0.5833

Step 3: Convert to percentage
0.5833 × 100 = 58.33%

Step 4: Clamp (0-100)
Math.max(0, Math.min(100, 58.33)) = 58.33%

┌───────────────────────────────────────┐
│  NORMALIZED SCORE: 58.33%            │
└───────────────────────────────────────┘
```

### 3️⃣ Pattern Fusion

```
┌─────────────────────────────────────────────────────────┐
│  PATTERN FUSION (50% Body, 30% Face, 20% Questionnaire)│
└─────────────────────────────────────────────────────────┘

Upper Compression Example:

┌─────────────────┬──────────┬────────┬──────────┐
│ Modality        │ Score    │ Weight │ Contrib. │
├─────────────────┼──────────┼────────┼──────────┤
│ Body            │ 75.00    │ 50%    │ 37.50    │
│ Face            │ 70.00    │ 30%    │ 21.00    │
│ Questionnaire   │ 58.33    │ 20%    │ 11.67    │
├─────────────────┴──────────┴────────┼──────────┤
│ FINAL SCORE                         │ 70.17    │
└─────────────────────────────────────┴──────────┘

All Four Patterns:

┌──────────────────────┬────────┬────────┬────────┬────────┐
│ Pattern              │ Body   │ Face   │ Quest  │ Final  │
├──────────────────────┼────────┼────────┼────────┼────────┤
│ Upper Compression    │ 75.00  │ 70.00  │ 58.33  │ 70.17  │ ← PRIMARY
│ Lower Compression    │ 45.00  │ 40.00  │ 36.67  │ 42.50  │ ← SECONDARY
│ Thoracic Collapse    │ 30.00  │ 35.00  │ 30.00  │ 31.50  │
│ Lateral Asymmetry    │ 25.00  │ 20.00  │ 25.00  │ 23.50  │
└──────────────────────┴────────┴────────┴────────┴────────┘
```

### 4️⃣ Confidence Calculation

```
┌─────────────────────────────────────────────────────────┐
│  CONFIDENCE BAND LOGIC                                  │
└─────────────────────────────────────────────────────────┘

Inputs:
  Primary Score: 70.17
  Secondary Score: 42.50
  Gap: 27.67
  Modality Agreement: 3/3 (all agree within 15%)

Decision Tree:

Is Primary > 70?           ✅ YES (70.17)
Is Gap > 30?               ❌ NO (27.67)
All modalities agree?      ✅ YES (3/3)

Result: MEDIUM CONFIDENCE (65%)

┌─────────────────────────────────────────────────────────┐
│  HIGH CONFIDENCE (75-100%)                              │
│  ✓ Primary > 70                                         │
│  ✓ Gap > 30                                             │
│  ✓ All modalities agree (within 15%)                    │
├─────────────────────────────────────────────────────────┤
│  MEDIUM CONFIDENCE (50-74%)                             │
│  ✓ Primary 50-70                                        │
│  ✓ Gap 15-30                                            │
│  ✓ 2+ modalities agree                                  │
├─────────────────────────────────────────────────────────┤
│  LOW CONFIDENCE (<50%)                                  │
│  ✗ Primary < 50                                         │
│  ✗ Gap < 15                                             │
│  ✗ High variance across modalities                      │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
bodi-kemistri/
│
├── config/
│   └── questionnaireData.js ✨ NEW
│       ├── QUESTIONNAIRE_DATA (20 questions)
│       ├── PATTERN_NAMES
│       └── PATTERN_KEYS
│
├── utils/
│   ├── questionnaireScoring.js ✨ NEW
│   │   ├── calculateQuestionnaireScores()
│   │   ├── applyQuestionnaireWeight()
│   │   ├── fusePatternScores()
│   │   └── calculateConfidenceBand()
│   │
│   └── integratedPatternFusion.js ✨ NEW
│       ├── integrateAllModalities()
│       ├── generateIntegratedSummary()
│       ├── getIntegratedRecommendations()
│       └── prepareWebhookPayload()
│
├── components/
│   └── Questionnaire.jsx ✏️ UPDATED
│       ├── One question at a time UI
│       ├── Review screen
│       ├── Auto-advance
│       └── Calls calculateQuestionnaireScores()
│
├── App.jsx ✏️ UPDATED
│   ├── questionnaireData state
│   ├── integrateAllModalities() call
│   └── Passes to ResultsScreen
│
├── test_questionnaire_scoring.js ✨ NEW
│   └── Comprehensive test suite
│
├── QUESTIONNAIRE_IMPLEMENTATION.md ✨ NEW
│   └── Full implementation docs
│
└── SCORING_REFERENCE.md ✨ NEW
    └── Quick reference guide
```

---

## Key Metrics

### Questionnaire Contribution

```
┌─────────────────────────────────────────────────────────┐
│  FINAL PATTERN SCORE BREAKDOWN                          │
└─────────────────────────────────────────────────────────┘

Example: Upper Compression = 70.17

    Body (50%)        Face (30%)      Quest (20%)
    ┌─────┐          ┌─────┐         ┌─────┐
    │75.00│          │70.00│         │58.33│
    └──┬──┘          └──┬──┘         └──┬──┘
       │                │                │
       × 0.50           × 0.30           × 0.20
       │                │                │
       ▼                ▼                ▼
    37.50            21.00            11.67
       │                │                │
       └────────────────┴────────────────┘
                        │
                        ▼
                     70.17

Contribution Percentages:
  Body: 53.4% of final score
  Face: 29.9% of final score
  Quest: 16.6% of final score
```

### Score Ranges

```
┌──────────────┬──────────┬──────────────┬──────────────┐
│ Category     │ Raw      │ Normalized   │ Final Fused  │
├──────────────┼──────────┼──────────────┼──────────────┤
│ Minimal      │ -10 to 0 │ 0-16%        │ 0-30         │
│ Mild         │ 0 to 15  │ 17-33%       │ 31-50        │
│ Moderate     │ 15 to 30 │ 34-50%       │ 51-70        │
│ Strong       │ 30 to 45 │ 51-67%       │ 71-85        │
│ Dominant     │ 45+      │ 68-100%      │ 86-100       │
└──────────────┴──────────┴──────────────┴──────────────┘
```

---

## Implementation Checklist

### ✅ Phase 1: Core Implementation (COMPLETE)
- [x] Create questionnaireData.js with all 20 questions
- [x] Create questionnaireScoring.js with calculation logic
- [x] Create integratedPatternFusion.js for modality fusion
- [x] Update Questionnaire.jsx component
- [x] Update App.jsx integration
- [x] Create test suite
- [x] Write documentation

### 🔄 Phase 2: Testing (IN PROGRESS)
- [ ] Run test_questionnaire_scoring.js
- [ ] Manual testing with real users
- [ ] Verify scoring math
- [ ] Check confidence bands
- [ ] Test edge cases

### 📋 Phase 3: Deployment (PENDING)
- [ ] Build verification
- [ ] Webhook testing
- [ ] Results screen verification
- [ ] Production deployment

---

**Status**: ✅ Implementation Complete, Ready for Testing  
**Date**: February 3, 2026  
**Version**: 1.0
