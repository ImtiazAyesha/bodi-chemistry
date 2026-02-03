# Questionnaire Scoring - Quick Reference

## 📐 Formulas

### 1. Raw Score Calculation
```
For each question:
  - Look up selected option (A, B, C, or D)
  - Get scoring object: { upperCompression: X, lowerCompression: Y, ... }
  - Add points to each pattern accumulator

rawScore[pattern] = Σ(points from all 20 questions)
```

**Example:**
```
Q1: Answer A → UC +3
Q2: Answer A → UC +3
Q3: Answer B → UC +3
...
rawScore.upperCompression = 3 + 3 + 3 + ... = 25
```

### 2. Normalization Formula
```
normalizedScore = ((rawScore + 10) / 60) × 100
clampedScore = Math.max(0, Math.min(100, normalizedScore))
```

**Why +10?** Minimum possible raw score is ~-10 (from -1 answers)  
**Why /60?** Maximum possible raw score is ~50-60 points  

**Example:**
```
rawScore = 25
normalizedScore = ((25 + 10) / 60) × 100
                = (35 / 60) × 100
                = 0.5833 × 100
                = 58.33%
```

### 3. Pattern Fusion Formula
```
finalScore[pattern] = (bodyScore[pattern] × 0.50) +
                      (faceScore[pattern] × 0.30) +
                      (questionnaireScore[pattern] × 0.20)
```

**Example:**
```
Body UC: 75
Face UC: 70
Quest UC: 58.33

Final UC = (75 × 0.50) + (70 × 0.30) + (58.33 × 0.20)
         = 37.5 + 21.0 + 11.67
         = 70.17
```

### 4. Confidence Band Logic

**HIGH Confidence (75-100%):**
```
primaryScore > 70 AND
gap > 30 AND
modalityAgreement === 3
```

**MEDIUM Confidence (50-74%):**
```
primaryScore >= 50 AND primaryScore <= 70 AND
gap >= 15 AND gap <= 30 AND
modalityAgreement >= 2
```

**LOW Confidence (<50%):**
```
All other cases
```

---

## 🎯 Point Values by Pattern

### Upper Compression (UC)
**High-value questions (+3):**
- Q1A: Lock up stress reaction
- Q2A: Can't turn off
- Q3B: Tired but wired
- Q6A: Suppress emotion
- Q7B: Wake up wired
- Q8A: Stay on alert
- Q10A: Neck/jaw tension

**Medium-value questions (+2):**
- Q3A: Have to earn rest
- Q4A, Q4B: Breathing issues
- Q5B: Starts high, crashes
- Q9A: Functional body
- Q11A: Head forward
- Q12A, Q12B: Breathing patterns
- Q13A: Neck/jaw pain
- Q15A: Neck extension restricted
- Q20A, Q20B: Stop holding tension

**Low-value questions (+1):**
- Q1B: Push through
- Q5B: Energy crashes
- Q6D: Overwhelmed
- Q7A: Hard to sleep
- Q9A: Functional body
- Q14C: Shift to toes

### Lower Compression (LC)
**High-value questions (+3):**
- Q10B: Lower back/hips/knees tension

**Medium-value questions (+2):**
- Q1B: Push through
- Q2C: Need movement
- Q3A: Have to earn rest
- Q3D: Avoid rest
- Q7A: Hard to sleep
- Q9A, Q9B: Body relationship
- Q11B: Lower back arches
- Q13B: Lower back/SI/knee pain
- Q14B: Arches collapsed
- Q15B: Bending forward restricted
- Q18A, Q18B: Squat issues
- Q20C: Energy crashes

**Low-value questions (+1):**
- Q5B: Energy crashes
- Q20C: Energy crashes

### Thoracic Collapse (TC)
**High-value questions (+3):**
- Q1C: Shut down
- Q2B: Crash hard
- Q4D: Breathing makes worse
- Q6C: Go numb
- Q10C: Upper back/chest/shoulders
- Q12C: Can't take full breath
- Q15C: Reaching overhead restricted
- Q17A: Back-bending difficult

**Medium-value questions (+2):**
- Q8B: Need recovery after social
- Q13C: Upper back pain

**Low-value questions (+1):**
- Q4A: Breathing frustrated
- Q6B: Feel intensely
- Q6D: Overwhelmed
- Q9B: Adversarial body
- Q12A: Shallow breathing
- Q17B: Back-bending challenging
- Q18C: Lower back rounds
- Q20C: Energy crashes

### Lateral Asymmetry (LA)
**High-value questions (+3):**
- Q9D: Disconnected from body
- Q10D: One-sided tension
- Q13D: One-sided pain
- Q14D: Favor one foot
- Q15D: Rotation/side-bending restricted
- Q16A: Dominant side significantly
- Q19C: Sides feel different

**Medium-value questions (+2):**
- Q2D: Disconnected
- Q5D: Unpredictable energy
- Q7D: Inconsistent sleep
- Q8D: Disconnect socially
- Q12D: Uneven breathing
- Q19B: Clumsy
- Q20D: Reconnect

**Low-value questions (+1):**
- Q1D: Oscillate
- Q16B: Somewhat dominant

### Balanced Answers (-1 to ALL patterns)
- Q3C: Rest feels restorative
- Q4C: Breathing helps
- Q5A: Steady energy
- Q7C: Restorative sleep
- Q8C: Feel energized
- Q9C: Trustworthy body
- Q14A: Balanced feet
- Q16C: Fairly balanced
- Q17C: Comfortable back-bending
- Q18D: Squats comfortable
- Q19A: Move fluidly

---

## 📊 Score Interpretation

### Raw Score Ranges
```
-10 to 0   = Very balanced, few pattern indicators
0 to 15    = Mild pattern presence
15 to 30   = Moderate pattern presence
30 to 45   = Strong pattern presence
45+        = Dominant pattern (rare, very focused answers)
```

### Normalized Score Ranges
```
0-16%      = Minimal pattern presence
17-33%     = Mild pattern presence
34-50%     = Moderate pattern presence
51-67%     = Strong pattern presence
68-83%     = Very strong pattern presence
84-100%    = Dominant pattern (rare)
```

### Final Fused Score Ranges
```
0-30       = Pattern not significant
31-50      = Pattern present, not dominant
51-70      = Moderate pattern, possible secondary
71-85      = Strong pattern, likely primary
86-100     = Dominant pattern, definite primary
```

---

## 🧪 Test Cases

### Test Case 1: Pure Upper Compression
```javascript
answers = ['A','A','B','B','B','A','B','A','A','A','A','B','A','C','A','A','A','A','B','A']
Expected: UC > 60%, others < 30%
```

### Test Case 2: Balanced/Healthy
```javascript
answers = ['D','C','C','C','A','B','C','C','C','A','A','A','A','A','A','C','C','D','A','C']
Expected: All patterns 15-35%, more distributed
```

### Test Case 3: Lower Compression Focus
```javascript
answers = ['B','C','D','A','B','B','A','B','B','B','B','A','B','B','B','B','C','A','B','C']
Expected: LC > 50%, UC moderate
```

### Test Case 4: Thoracic Collapse Focus
```javascript
answers = ['C','B','B','D','C','C','C','B','B','C','C','C','C','A','C','B','A','C','B','C']
Expected: TC > 55%, others lower
```

### Test Case 5: Lateral Asymmetry Focus
```javascript
answers = ['D','D','A','A','D','A','D','D','D','D','D','D','D','D','D','A','B','D','C','D']
Expected: LA > 50%, others moderate
```

---

## 🔍 Debugging Tips

### Check Raw Scores
```javascript
console.log('Raw Scores:', result.rawScores);
// Should see: { upperCompression: X, lowerCompression: Y, ... }
// Verify totals make sense based on answers
```

### Check Normalization
```javascript
const manual = ((result.rawScores.upperCompression + 10) / 60) * 100;
console.log('Manual calc:', manual);
console.log('Function calc:', result.normalizedScores.upperCompression);
// Should match!
```

### Check Fusion
```javascript
const manualFusion = (bodyScores.upperCompression * 0.5) +
                     (faceScores.upperCompression * 0.3) +
                     (questionnaireScores.upperCompression * 0.2);
console.log('Manual fusion:', manualFusion);
console.log('Function fusion:', fusedResult.finalScores.upperCompression);
// Should match!
```

### Check Confidence
```javascript
console.log('Primary score:', fusedResult.primaryPattern.score);
console.log('Gap:', fusedResult.primaryPattern.score - fusedResult.secondaryPattern?.score);
console.log('Modality agreement:', confidence.metrics.modalityAgreement);
// Verify against confidence thresholds
```

---

## 📝 Common Patterns

### Pattern: "Stressed Professional"
- High UC (>60%)
- Moderate LC (30-45%)
- Low TC (<25%)
- Low LA (<20%)
- **Typical answers**: A's on Q1-Q8, mixed on body questions

### Pattern: "Collapsed Posture"
- High TC (>55%)
- Moderate UC (35-50%)
- Low LC (<30%)
- Low LA (<25%)
- **Typical answers**: C's on breathing/emotion, C's on upper back

### Pattern: "Athletic Imbalance"
- High LA (>50%)
- Moderate LC (30-45%)
- Low UC (<30%)
- Low TC (<25%)
- **Typical answers**: D's on one-sided questions, mixed on movement

### Pattern: "Balanced/Healthy"
- All patterns 20-40%
- No dominant pattern
- **Typical answers**: Many C's (balanced answers), A's on "comfortable" options

---

**Last Updated**: February 3, 2026  
**Version**: 1.0
