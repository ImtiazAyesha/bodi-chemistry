# 📏 GHOST UI (ALIGNMENT GUIDE) DIMENSIONS

## **Canvas Dimensions**
- **ViewBox**: `0 0 960 720`
- **Width**: 960px
- **Height**: 720px
- **Aspect Ratio**: 4:3

---

## **Body Part Dimensions**

### **1. Head Circle** 👤
- **Center X**: 480px (horizontal center)
- **Center Y**: 180px (from top)
- **Radius**: 90px
- **Diameter**: 180px
- **Total Height**: 180px (from Y=90 to Y=270)

---

### **2. Neck** 
- **Start Point**: (480, 270)
- **End Point**: (480, 330)
- **Length**: 60px
- **Position**: Vertical line from bottom of head to shoulders

---

### **3. Shoulders** 
- **Start Point**: (330, 330) - Left shoulder
- **End Point**: (630, 330) - Right shoulder
- **Total Width**: 300px
- **Height from Top**: 330px
- **Position**: Horizontal line at Y=330

---

### **4. Torso** 📦
- **X Position**: 390px (left edge)
- **Y Position**: 330px (top edge)
- **Width**: 180px
- **Height**: 210px
- **Border Radius**: 15px (rounded corners)
- **Right Edge**: 570px (390 + 180)
- **Bottom Edge**: 540px (330 + 210)

---

### **5. Left Arm** 💪
- **Start Point**: (330, 330) - Left shoulder
- **End Point**: (270, 480)
- **Length**: ~161px (calculated: √[(330-270)² + (480-330)²])
- **Angle**: ~68° from horizontal

---

### **6. Right Arm** 💪
- **Start Point**: (630, 330) - Right shoulder
- **End Point**: (690, 480)
- **Length**: ~161px (calculated: √[(690-630)² + (480-330)²])
- **Angle**: ~68° from horizontal (mirrored)

---

### **7. Left Leg** 🦵
- **Start Point**: (420, 540) - Bottom of torso
- **End Point**: (420, 690)
- **Length**: 150px
- **Position**: Vertical line, 30px left of center

---

### **8. Right Leg** 🦵
- **Start Point**: (540, 540) - Bottom of torso
- **End Point**: (540, 690)
- **Length**: 150px
- **Position**: Vertical line, 30px right of center

---

## **Overall Body Dimensions**

### **Total Width**
- **Leftmost Point**: 270px (left arm endpoint)
- **Rightmost Point**: 690px (right arm endpoint)
- **Total Width**: 420px (690 - 270)

### **Total Height**
- **Top**: 90px (top of head circle)
- **Bottom**: 690px (bottom of legs)
- **Total Height**: 600px (690 - 90)

### **Center Point**
- **Horizontal Center**: 480px
- **Vertical Center**: ~390px (approximate center of mass)

---

## **Proportions**

### **Head to Body Ratio**
- **Head Height**: 180px (diameter)
- **Total Body Height**: 600px
- **Head Ratio**: 30% (180/600)

### **Torso Dimensions**
- **Width**: 180px
- **Height**: 210px
- **Aspect Ratio**: ~1:1.17 (slightly taller than wide)

### **Shoulder Width**
- **Shoulder Span**: 300px
- **Torso Width**: 180px
- **Shoulder to Torso Ratio**: 1.67:1

### **Leg Spacing**
- **Distance Between Legs**: 120px (540 - 420)
- **Leg Width**: 0px (lines, no thickness)

---

## **Visual Properties**

### **Stroke (Outline)**
- **Color (Aligned)**: `#00FF00` (Green)
- **Color (Not Aligned)**: `#FFA500` (Amber/Orange)
- **Width (Aligned)**: 4px
- **Width (Not Aligned)**: 2px
- **Dash Pattern (Aligned)**: Solid (0)
- **Dash Pattern (Not Aligned)**: Dashed (10px dash, 5px gap)
- **Opacity**: 0.6 (60% transparent)

### **Text Instruction**
- **Position**: (480, 45) - Top center
- **Font Size**: 24px
- **Font Weight**: Bold
- **Color**: Same as stroke (green/amber)
- **Alignment**: Center
- **Text (Aligned)**: "✓ Aligned - Ready to Capture"
- **Text (Not Aligned)**: "Position yourself in the outline"

---

## **Coordinate System**

### **Origin**
- **Top-Left Corner**: (0, 0)
- **Top-Right Corner**: (960, 0)
- **Bottom-Left Corner**: (0, 720)
- **Bottom-Right Corner**: (960, 720)

### **Center**
- **Canvas Center**: (480, 360)
- **Body Center**: (480, ~390)

---

## **Detailed Measurements**

### **Head**
```
Circle Center: (480, 180)
Radius: 90px
Top: Y = 90px
Bottom: Y = 270px
Left: X = 390px
Right: X = 570px
```

### **Torso**
```
Top-Left: (390, 330)
Top-Right: (570, 330)
Bottom-Left: (390, 540)
Bottom-Right: (570, 540)
Width: 180px
Height: 210px
```

### **Shoulders**
```
Left Shoulder: (330, 330)
Right Shoulder: (630, 330)
Center: (480, 330)
Width: 300px
```

### **Arms**
```
Left Arm:
  Start: (330, 330)
  End: (270, 480)
  Horizontal Offset: -60px
  Vertical Offset: +150px

Right Arm:
  Start: (630, 330)
  End: (690, 480)
  Horizontal Offset: +60px
  Vertical Offset: +150px
```

### **Legs**
```
Left Leg:
  Start: (420, 540)
  End: (420, 690)
  Length: 150px

Right Leg:
  Start: (540, 540)
  End: (540, 690)
  Length: 150px

Leg Spacing: 120px (center to center)
```

---

## **Summary Table**

| Body Part | Width (px) | Height (px) | X Position | Y Position |
|-----------|------------|-------------|------------|------------|
| **Head** | 180 (diameter) | 180 (diameter) | 390-570 | 90-270 |
| **Neck** | 0 (line) | 60 | 480 | 270-330 |
| **Shoulders** | 300 | 0 (line) | 330-630 | 330 |
| **Torso** | 180 | 210 | 390-570 | 330-540 |
| **Left Arm** | ~60 | ~150 | 270-330 | 330-480 |
| **Right Arm** | ~60 | ~150 | 630-690 | 330-480 |
| **Left Leg** | 0 (line) | 150 | 420 | 540-690 |
| **Right Leg** | 0 (line) | 150 | 540 | 540-690 |
| **TOTAL** | 420 | 600 | 270-690 | 90-690 |

---

## **Scale Reference**

If the canvas is 960×720:
- **1px** = ~0.104% of width
- **1px** = ~0.139% of height

If displayed at 100% scale:
- **Ghost UI Width**: 420px (43.75% of canvas width)
- **Ghost UI Height**: 600px (83.33% of canvas height)

---

**File Location**: `components/GhostOverlay.jsx`  
**Canvas Size**: 960×720px  
**Body Size**: 420×600px  
**Position**: Centered horizontally, slightly above vertical center
