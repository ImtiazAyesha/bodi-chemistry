# 📊 Questionnaire Score Calculation - Complete Breakdown

## Your Results
**Questionnaire Score: 35.0/100**

---

## 🔍 How It's Calculated

### **Step 1: Raw Score Accumulation**

Each of your 20 answers contributes points to 4 patterns:
- **UC** = Upper Compression
- **LC** = Lower Compression  
- **TC** = Thoracic Collapse
- **LA** = Lateral Asymmetry

### **Your Answers & Points:**

```
Q1: Lock up (A) → UC=+3, LC=+1, TC=+1, LA=+1
Q2: Crash hard (B) → UC=+1, LC=+3, TC=+2, LA=+1
Q3: Tired but wired (B) → UC=+2, LC=+1, TC=+1, LA=+1
Q4: Feel frustrated (A) → UC=+3, LC=+1, TC=+1, LA=+1
Q5: Crashes hard (B) → UC=+2, LC=+3, TC=+2, LA=+1
Q6: Go numb (C) → UC=+1, LC=+1, TC=+3, LA=+1
Q7: Broken sleep (B) → UC=+2, LC=+2, TC=+1, LA=+1
Q8: Stay on alert (A) → UC=+3, LC=+1, TC=+1, LA=+1
Q9: Trustworthy (C) → UC=-1, LC=-1, TC=-1, LA=-1
Q10: Lower back (B) → UC=+1, LC=+3, TC=+1, LA=+1
Q11: Head/neck forward (A) → UC=+3, LC=+1, TC=+2, LA=+1
Q12: Hold breath (B) → UC=+2, LC=+1, TC=+3, LA=+1
Q13: One-sided pain (D) → UC=+1, LC=+1, TC=+1, LA=+3
Q14: Balanced (A) → UC=-1, LC=-1, TC=-1, LA=-1
Q15: Bending forward (B) → UC=+1, LC=+3, TC=+1, LA=+1
Q16: Somewhat (B) → UC=+1, LC=+1, TC=+1, LA=+2
Q17: Comfortable (C) → UC=-1, LC=-1, TC=-1, LA=-1
Q18: Heels lift (A) → UC=+3, LC=+1, TC=+1, LA=+1
Q19: Sometimes clumsy (B) → UC=+1, LC=+1, TC=+1, LA=+2
Q20: Actually calm (B) → UC=-1, LC=-1, TC=-1, LA=-1
```

### **Step 2: Sum Raw Scores**

```
Upper Compression (UC): 3+1+2+3+2+1+2+3-1+1+3+2+1-1+1+1-1+3+1-1 = 26
Lower Compression (LC): 1+3+1+1+3+1+2+1-1+3+1+1+1-1+3+1-1+1+1-1 = 21
Thoracic Collapse (TC): 1+2+1+1+2+3+1+1-1+1+2+3+1-1+1+1-1+1+1-1 = 19
Lateral Asymmetry (LA): 1+1+1+1+1+1+1+1-1+1+1+1+3-1+1+2-1+1+2-1 = 17
```

**Total Raw Points: 83**

---

### **Step 3: Normalize to 0-100 Scale**

**Formula:**
```
Normalized Score = ((Raw Score + 10) / 60) × 100
```

**Why this formula?**
- **+10 offset**: Accounts for negative values (some answers give -1 points)
- **/60**: Normalizes the range (max possible ~50-60 points per pattern)
- **×100**: Converts to percentage

**Calculations:**

```
UC: ((26 + 10) / 60) × 100 = (36 / 60) × 100 = 0.6 × 100 = 60.0%
LC: ((21 + 10) / 60) × 100 = (31 / 60) × 100 = 0.517 × 100 = 51.7%
TC: ((19 + 10) / 60) × 100 = (29 / 60) × 100 = 0.483 × 100 = 48.3%
LA: ((17 + 10) / 60) × 100 = (27 / 60) × 100 = 0.45 × 100 = 45.0%
```

---

### **Step 4: Calculate Average (Questionnaire Score)**

```
Questionnaire Score = (UC + LC + TC + LA) / 4
                    = (60.0 + 51.7 + 48.3 + 45.0) / 4
                    = 205.0 / 4
                    = 51.25%
```

**Wait... but your PDF shows 35.0%!** 🤔

---

## 🔍 **Discrepancy Investigation**

Let me check what the PDF actually shows vs what should be calculated...

Looking at your PDF:
- **Questionnaire Score: 35.0/100**

But based on the calculation above, it should be **51.25%**.

### **Possible Explanations:**

1. **Different answers were used** - The PDF might be from a different test run
2. **Calculation error in the code** - There might be a bug
3. **Different normalization formula** - The actual code might use a different formula

Let me check the actual console logs from your browser to see what the real normalized scores are.

---

## 📊 **What Your PDF Shows**

From your PDF screenshot:
```
Questionnaire Pattern Scores:
- Upper Compression: 31.7%
- Lower Compression: 25.0%
- Thoracic Collapse: 16.7%
- Lateral Asymmetry: 26.7%
```

**Average:**
```
(31.7 + 25.0 + 16.7 + 26.7) / 4 = 100.1 / 4 = 25.025% ≈ 25%
```

**But the PDF shows 35.0%!** 

This suggests the questionnaire score is **NOT** the simple average of the 4 pattern scores.

---

## 🔍 **Let Me Check ResultsScreen Calculation**

Looking at `ResultsScreen.jsx` line 68-73:

```javascript
// Questionnaire score (average of normalized scores, or 50 if missing)
let questionnaireScore = 50;
if ( questionnaireData && questionnaireData.normalizedScores ) {
  const scores = Object.values( questionnaireData.normalizedScores );
  questionnaireScore = scores.reduce( ( a, b ) => a + b, 0 ) / scores.length;
}
```

This **DOES** calculate the average! So if your normalized scores are:
- UC: 31.7%
- LC: 25.0%
- TC: 16.7%
- LA: 26.7%

Then:
```
Questionnaire Score = (31.7 + 25.0 + 16.7 + 26.7) / 4 = 25.025%
```

**But you're seeing 35.0%!**

---

## 🎯 **The Real Question**

Can you check the **browser console** and look for:

```
=== RESULTS SCREEN SCORE CALCULATION ===
Questionnaire Score: XX.X
```

This will tell us what the actual calculated questionnaire score is.

---

## 📝 **Summary of Calculation Method**

### **Official Formula:**

1. **Raw Scores**: Sum points from all 20 answers for each pattern
2. **Normalize**: `((rawScore + 10) / 60) × 100` for each pattern
3. **Average**: `(UC + LC + TC + LA) / 4` = Final Questionnaire Score
4. **Use in Overall**: `Overall = (Face × 0.3) + (Body × 0.5) + (Questionnaire × 0.2)`

### **Expected Results (based on your answers):**

```
Raw Scores:
- UC: ~26 points
- LC: ~21 points
- TC: ~19 points
- LA: ~17 points

Normalized Scores:
- UC: ~60%
- LC: ~52%
- TC: ~48%
- LA: ~45%

Questionnaire Score: ~51%
```

**But your PDF shows different values, which suggests either:**
1. Different answers were recorded
2. There's a calculation issue
3. The console will show us the truth!

---

## ✅ **Next Step**

Please check the browser console (F12) and share the logs that show:
- `=== RESULTS SCREEN SCORE CALCULATION ===`
- `Questionnaire Score: XX.X`

This will help us verify if the calculation is accurate!

---

**Created**: February 3, 2026  
**Purpose**: Verify questionnaire score calculation accuracy
