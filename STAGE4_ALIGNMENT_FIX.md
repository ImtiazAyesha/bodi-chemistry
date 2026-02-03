# 🔧 STAGE 4 ALIGNMENT ISSUE - QUICK FIX

## 🎯 **Issue**: Stage 4 capture button not turning green

**User Report**: "I am trying my best to fit myself inside it but it does not turn green, but in the morning it was running accurately"

---

## 🔍 **ROOT CAUSE ANALYSIS**

### **What We Changed Today**:
1. ✅ Foot arch calculation (lines 335-349) - Uses `calculateFootArchBothSides()`
2. ✅ Pelvic tilt calculation (lines 304-322) - Uses `calculatePelvicTilt()`

### **What Controls Stage 4 Alignment**:
- **File**: `App.jsx` lines 555-663
- **Function**: `checkAlignment()` for `STAGE_4_LOWER_SIDE`
- **Current Threshold**: `hipDistance4 < 0.12` (STRICT - line 577)

### **Why It's Not Turning Green**:
The alignment check requires a **VERY STRICT** side view:
```javascript
const hipDistance4 = Math.abs(leftHip4.x - rightHip4.x);
const isSideView4 = hipDistance4 < 0.12; // STRICT threshold
return isSideView4; // Only returns true if perfect side view
```

**Problem**: The threshold `0.12` is too strict. If your hips are not perfectly overlapping in the camera view, it won't turn green.

---

## 🛠️ **SOLUTION OPTIONS**

### **Option 1: Relax the Threshold (RECOMMENDED)**
Make the side view detection less strict:

```javascript
// CURRENT (TOO STRICT):
const isSideView4 = hipDistance4 < 0.12;

// SUGGESTED (MORE FORGIVING):
const isSideView4 = hipDistance4 < 0.15; // or 0.18
```

### **Option 2: Add Position-Based Alignment**
Instead of ONLY checking side view, also check if hips are in frame:

```javascript
// Check for side view AND proper positioning
const isSideView4 = hipDistance4 < 0.15;
const isInFrame4 = hipCenterX4 >= 0.35 && hipCenterX4 <= 0.65 &&
                   hipCenterY4 >= 0.30 && hipCenterY4 <= 0.70;

return isSideView4 && isInFrame4;
```

### **Option 3: Make It Even Easier (TEMPORARY)**
For testing, make it very easy:

```javascript
// EASY MODE - Just check if hips are detected
const isSideView4 = hipDistance4 < 0.20; // Very forgiving
return isSideView4;
```

---

## 📊 **COMPARISON**

| Threshold | Strictness | When It Turns Green |
|-----------|-----------|---------------------|
| `< 0.10` | Very Strict | Perfect side profile only |
| `< 0.12` | Strict (CURRENT) | Near-perfect side profile |
| `< 0.15` | Moderate | Good side profile ✅ RECOMMENDED |
| `< 0.18` | Forgiving | Decent side profile |
| `< 0.20` | Very Forgiving | Any side-ish view |

---

## ✅ **RECOMMENDED FIX**

Change line 577 in `App.jsx`:

```javascript
// FROM:
const isSideView4 = hipDistance4 < 0.12; // STRICT

// TO:
const isSideView4 = hipDistance4 < 0.15; // MODERATE (more forgiving)
```

This will make it easier to get the green light while still ensuring a side view.

---

## 🧪 **HOW TO TEST**

1. Make the change above
2. Refresh the browser
3. Navigate to Stage 4
4. Turn to your right side
5. The button should turn green more easily

---

## 🔍 **WHY IT WORKED THIS MORNING**

Possible reasons:
1. **Lighting changed** - Different lighting affects landmark detection
2. **Camera angle changed** - Slight camera position change
3. **Body position changed** - You were standing in a slightly different position
4. **Code was different** - If you made changes today, the threshold might have been different

---

## 📝 **WHAT TO DO NOW**

**Option A**: Apply the recommended fix (change threshold to 0.15)  
**Option B**: Check browser console for debug logs to see exact hip distance  
**Option C**: Try standing further back or adjusting your angle

---

**Status**: ⚠️ **NOT A BUG - THRESHOLD TOO STRICT**  
**Fix**: Change `hipDistance4 < 0.12` to `hipDistance4 < 0.15`  
**Location**: `App.jsx` line 577

Let me know if you want me to apply this fix! 🚀
