# 🧘 Bodi Kemistri - AI-Powered Postural Wellness Platform

**Bodi Kemistri** is an advanced web-based wellness assessment platform that uses AI-powered computer vision to analyze body alignment, facial symmetry, and postural patterns. The platform provides users with personalized wellness insights through a comprehensive 9-step assessment process.

---

## 🎯 **What It Does**

Bodi Kemistri combines cutting-edge AI vision technology with clinical wellness metrics to provide:

- **📸 4-Stage Photo Capture**: Guided capture of face, upper body (front & side), and lower body
- **🤖 AI Vision Analysis**: Real-time landmark detection using MediaPipe (Face & Pose)
- **📊 Clinical Metrics**: Measures 8 key postural and facial alignment metrics
- **🧠 Pattern Recognition**: Identifies somatic patterns using a 50/30/20 diagnostic fusion engine
- **📄 PDF Reports**: Generates professional wellness reports with visual analysis
- **📋 Questionnaire Integration**: Combines physical metrics with lifestyle questionnaire data

---

## ✨ **Key Features**

### **1. Intelligent Capture System**
- **Ghost UI Overlay**: Visual guides for precise body positioning
- **Real-Time Alignment Detection**: Instant feedback on positioning
- **5-Second Countdown**: 2-second silent hold + 3-second visible countdown (3-2-1)
- **Automatic Capture**: Triggers when user is properly aligned
- **Capture Review**: Review and retake option before proceeding

### **2. AI-Powered Analysis**
- **Face Metrics** (30% weight):
  - Eye Symmetry
  - Jaw Shift
  - Head Tilt
  - Nostril Asymmetry

- **Body Metrics** (50% weight):
  - Shoulder Height Asymmetry
  - Forward Head Posture (FHP)
  - Pelvic Tilt
  - Knee Angle

### **3. Diagnostic Fusion Engine**
- **50%** Body Metrics
- **30%** Face Metrics
- **20%** Questionnaire Data
- Identifies 9 somatic patterns with severity classification

### **4. Professional Reporting**
- Visual before/after comparisons
- Metric breakdowns with clinical context
- Pattern identification with severity levels
- Downloadable PDF reports

---

## 🛠️ **Tech Stack**

| Category | Technology |
|----------|-----------|
| **Frontend** | React (Vite) |
| **Styling** | CSS (Custom Design System) |
| **AI Vision** | MediaPipe (Face Landmarker, Pose Landmarker) |
| **PDF Generation** | jsPDF, html2canvas |
| **State Management** | React Hooks (useState, useEffect, useRef) |
| **Routing** | React Router |

---

## 📁 **Project Structure**

```
Bodi-Kemistri/
├── pages/
│   ├── LandingPage.jsx          # Welcome screen
│   ├── QuestionnairePage.jsx    # Lifestyle questionnaire
│   ├── CapturePage.jsx           # 4-stage photo capture
│   ├── ProcessingPage.jsx        # Analysis processing
│   └── ResultsPage.jsx           # Results & PDF generation
├── components/
│   ├── FaceGhost.jsx             # Stage 1 ghost overlay
│   ├── UpperBodyFrontGhost.jsx   # Stage 2 ghost overlay
│   ├── UpperBodySideGhost.jsx    # Stage 3 ghost overlay
│   └── LowerBodySideGhost.jsx    # Stage 4 ghost overlay
├── utils/
│   ├── metricCalculations.js     # Clinical metric calculations
│   ├── patternAnalysis.js        # Somatic pattern detection
│   └── pdfGenerator.js           # PDF report generation
└── index.css                     # Global styles & design system
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bodi-Kemistri
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Build for Production**
```bash
npm run build
```

---

## 📸 **How It Works**

### **Step 1: Questionnaire**
User answers lifestyle and wellness questions (pain points, activity level, etc.)

### **Step 2: Photo Capture (4 Stages)**

1. **Stage 1 - Face Profile**
   - Captures facial landmarks for symmetry analysis
   - Measures: Eye symmetry, jaw shift, head tilt, nostril asymmetry

2. **Stage 2 - Full Body Front**
   - Captures full body from head to feet (front view)
   - Measures: Shoulder height asymmetry

3. **Stage 3 - Upper Body Side**
   - Captures upper body from the right side
   - Measures: Forward head posture (FHP)

4. **Stage 4 - Lower Body Side**
   - Captures lower body from the right side
   - Measures: Pelvic tilt, knee angle

### **Step 3: AI Analysis**
- MediaPipe detects 478 face landmarks + 33 pose landmarks
- Calculates 8 clinical metrics
- Runs pattern recognition algorithm
- Combines with questionnaire data (50/30/20 fusion)

### **Step 4: Results & Report**
- Displays metric scores and patterns
- Generates downloadable PDF report
- Provides wellness insights

---

## 🎨 **Design System**

### **Color Palette**
- **Brand Sage**: `#8FA99B` (Primary accent)
- **Brand Slate**: `#2F4A5C` (Dark text)
- **Brand Sand**: `#EFE9DF` (Background)
- **Success Green**: `#00FF00` (Alignment feedback)

### **Typography**
- Font Family: System fonts (inherit)
- Responsive sizing using `clamp()`

### **Layout**
- Mobile-first responsive design
- Dynamic viewport units (`dvh`, `vw`)
- Glassmorphism effects with `backdrop-filter`

---

## 🔧 **Configuration**

### **MediaPipe Models**
Models are loaded from CDN:
- Face Landmarker: `https://storage.googleapis.com/mediapipe-models/face_landmarker/...`
- Pose Landmarker: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/...`

### **Capture Settings**
- Webcam resolution: 960x720
- Countdown duration: 5 seconds (2s silent + 3s visible)
- Alignment check interval: 200ms
- JPEG quality: 95%

---

## 📊 **Metrics Explained**

| Metric | Normal Range | Calculation Method |
|--------|-------------|-------------------|
| **Eye Symmetry** Vertical distance difference between eyes |
| **Jaw Shift** Horizontal deviation of jaw center from face center |
| **Head Tilt**  Angle between eye line and horizontal |
| **Nostril Asymmetry**  Width difference between nostrils |
| **Shoulder Height**  Height difference normalized by body height |
| **Forward Head Posture** Angle deviation from ideal ear-shoulder alignment |
| **Pelvic Tilt** Angle between hip-knee line and vertical |
| **Knee Angle** Angle formed by hip-knee-ankle |

---

## 🧠 **Somatic Patterns**

The platform identifies 8 somatic patterns:

1. **Upper Cross Syndrome** (UCS)
2. **Lower Cross Syndrome** (LCS)
3. **Sway Back**
4. **Flat Back**
5. **Kyphosis-Lordosis**
6. **Forward Head Posture** (FHP)
7. **Lateral Pelvic Tilt**
8. **Scoliosis Indicators**
9. **Generalized Asymmetry**

Each pattern is classified by severity:
- **Mild**: 40-59%
- **Moderate**: 60-79%
- **Severe**: 80-100%

---

## 🔐 **Privacy & Data**

- **No server storage**: All processing happens client-side
- **Session-based**: Data stored in browser sessionStorage
- **No tracking**: No analytics or third-party tracking
- **User control**: Users can retake photos at any stage

---

## 🐛 **Known Issues & Limitations**

- Requires good lighting for accurate landmark detection
- Works best with solid background
- Requires webcam access
- Not a substitute for professional medical diagnosis

---
