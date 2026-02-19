import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
    FilesetResolver,
    FaceLandmarker,
    PoseLandmarker,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import { runCapabilityChecks } from "../utils/deviceCapabilities";

// Utils - Geometry & Calculations
import { calculateDistance, calculateDistance2D, calculateAngle, calculateAngle3Points, calculateCraniovertebralAngle, calculateShoulderHeightAsymmetry, calculateFootArchBothSides, calculatePelvicTilt, interpretPelvicTilt, formatMetric } from "../utils/geometry";
import { calculateTotalScore } from "../utils/scoring";
import analyzePatterns from "../utils/patternAnalyzer";
import { calculateQuestionnaireScores } from "../utils/questionnaireScoring";
import integrateAllModalities from "../utils/integratedPatternFusion";

// Utils - Modular Utilities (NEW)
import { checkAlignment as checkAlignmentUtil } from "../utils/alignmentChecks";
import { validateCapturedLandmarks as validateLandmarksUtil } from "../utils/captureValidation";

// Navigation Components
import LandingPage from "../components/LandingPage";
import Questionnaire from "../components/Questionnaire";
import InstructionPage from "../components/InstructionPage";
import ProcessingScreen from "../components/ProcessingScreen";

// Components - 4 Stage Ghosts
import FaceGhost from "../components/FaceGhost";
import UpperBodyFrontGhost from "../components/UpperBodyFrontGhost";
import UpperBodySideGhost from "../components/UpperBodySideGhost";
import LowerBodySideGhost from "../components/LowerBodySideGhost";
import ResultsScreen from "../components/ResultsScreen";

function CapturePage() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const hiddenCanvasRef = useRef(null); // Hidden canvas for landmark rendering

    const faceLandmarkerRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const cameraRunningRef = useRef(false);

    // Navigation State - Start directly at CAPTURE for testing
    const [appStage, setAppStage] = useState('CAPTURE');
    // Possible values: 'LANDING' → 'QUESTIONNAIRE' → 'INSTRUCTIONS' → 'CAPTURE' → 'PROCESSING' → 'RESULTS'

    // 4-Stage Capture System
    const [captureStage, setCaptureStage] = useState('STAGE_1_FACE');

    const [isAligned, setIsAligned] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Auto-capture timer states
    const [holdDuration, setHoldDuration] = useState(0); // 0 to 5000ms (2s green hold + 3s countdown: 3, 2, 1)
    const alignmentTimerRef = useRef(null);

    // Screen freeze states
    const [isFrozen, setIsFrozen] = useState(false);
    const [frozenImage, setFrozenImage] = useState(null);

    // Capture review states
    const [showReviewButtons, setShowReviewButtons] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    // Capture Data Storage
    const [captureData, setCaptureData] = useState({
        stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } },
        stage2: { image: null, metrics: { shoulderHeight: 0 } },
        stage3: { image: null, metrics: { fhpAngle: 0 } },
        stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
    });

    // Current metrics (live)
    const [metrics, setMetrics] = useState({
        face: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0, irisWidth: 0 },
        body: { shoulderHeight: 0, fhpAngle: 0, pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 }
    });

    // Debug info for feedback display
    const [stage1Debug, setStage1Debug] = useState(null);
    const [stage2Debug, setStage2Debug] = useState(null);
    const [stage3Debug, setStage3Debug] = useState(null);
    const [stage4Debug, setStage4Debug] = useState(null);

    // ── Compatibility & Error States ──────────────────────────────────────
    // initError: set when MediaPipe fails to load (CDN timeout, WASM, OOM)
    const [initError, setInitError] = useState(null);
    // cameraError: set when getUserMedia is rejected or camera is unavailable
    const [cameraError, setCameraError] = useState(null);
    // cameraLost: set when a running camera stream drops mid-session
    const [cameraLost, setCameraLost] = useState(false);
    // deviceCapabilities: pre-flight check result (WebGL, WASM, camera API)
    const [deviceCapabilities, setDeviceCapabilities] = useState(null);
    // isLoadingModels: true while MediaPipe models are downloading + compiling
    // Shows a loading UI so users on slow devices don't think the app is frozen
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    // cameraReady flips to true the moment the user grants camera permission.
    // Keeps the loading spinner hidden until AFTER Allow is tapped.
    const [cameraReady, setCameraReady] = useState(false);

    // Pattern Analysis Results
    const [patternResults, setPatternResults] = useState(null);

    // Questionnaire Data (loaded from sessionStorage)
    const [questionnaireData, setQuestionnaireData] = useState(null);

    // Detect screen orientation for proper video constraints
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

    // ── Pre-flight capability check ───────────────────────────────────────
    useEffect(() => {
        const caps = runCapabilityChecks();
        setDeviceCapabilities(caps);
        if (!caps.canRunMediaPipe) {
            setInitError(caps.failureReason);
        }
    }, []);

    // ── Front camera selection via device enumeration ─────────────────────
    // facingMode: "user" / { ideal } / { exact } are ALL unreliable on Android.
    // Different manufacturers (Samsung, Xiaomi, Oppo, etc.) label cameras
    // differently and Chrome Android often ignores facingMode entirely.
    //
    // The only guaranteed approach: enumerate physical camera devices and select
    // the front camera by its label string. This requires camera permission to
    // already be granted (which it is by the time the user reaches CAPTURE).
    useEffect(() => {
        if (appStage !== 'CAPTURE') return;

        const selectFrontCamera = async () => {
            try {
                if (!navigator.mediaDevices?.enumerateDevices) return;

                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(d => d.kind === 'videoinput');

                if (videoDevices.length === 0) return;

                // Labels are only populated after permission is granted.
                // Match common front camera label patterns across Android OEMs:
                const frontCamera = videoDevices.find(d => {
                    const label = d.label.toLowerCase();
                    return (
                        label.includes('front') ||
                        label.includes('selfie') ||
                        label.includes('facing front') ||
                        label.includes('facetime') ||    // iOS
                        label.includes('user')           // some Samsung
                    );
                });

                if (frontCamera?.deviceId) {
                    console.log('[Camera] Front camera found by label:', frontCamera.label);
                    setVideoConstraints({ deviceId: { exact: frontCamera.deviceId } });
                } else {
                    // Labels empty (unlikely if permission granted) — keep facingMode fallback
                    console.warn('[Camera] Could not find front camera by label, using facingMode fallback');
                }
            } catch (err) {
                console.warn('[Camera] Device enumeration failed:', err.message);
            }
        };

        selectFrontCamera();
    }, [appStage]);

    // Load questionnaire data from sessionStorage on mount
    useEffect(() => {
        const storedData = sessionStorage.getItem('questionnaireData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setQuestionnaireData(parsed);
            } catch (error) {
                console.error('❌ Failed to parse questionnaire data:', error);
            }
        }
    }, []);

    // Track orientation changes
    useEffect(() => {
        const handleOrientationChange = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    // Refs for render loop
    const lastInferenceTimeRef = useRef(0);
    const lastAlignmentCheckRef = useRef(0);
    const renderLoopRef = useRef(null); // Store render loop function for restart
    const INFERENCE_INTERVAL_MS = 100;
    const ALIGNMENT_CHECK_INTERVAL = 200;

    const captureStageRef = useRef(captureStage);
    useEffect(() => {
        captureStageRef.current = captureStage;
    }, [captureStage]);

    // Restart render loop when unfrozen
    useEffect(() => {
        if (!isFrozen && renderLoopRef.current && appStage === 'CAPTURE') {
            renderLoopRef.current();
        }
    }, [isFrozen, appStage]);

    // Run INTEGRATED pattern analysis when entering PROCESSING stage
    useEffect(() => {
        if (appStage === 'PROCESSING' && captureData.stage4.image && questionnaireData) {

            // Combine all metrics for pattern analysis
            const bodyMetrics = {
                shoulderHeight: captureData.stage2.metrics.shoulderHeight,
                fhpAngle: captureData.stage3.metrics.fhpAngle,
                pelvicTilt: captureData.stage4.metrics.pelvicTilt,
                kneeAngle: captureData.stage4.metrics.kneeAngle,
                footArchRatio: captureData.stage4.metrics.footArchRatio
            };

            const faceMetrics = {
                eyeSym: captureData.stage1.metrics.eyeSym,
                jawShift: captureData.stage1.metrics.jawShift,
                headTilt: captureData.stage1.metrics.headTilt,
                nostrilAsym: captureData.stage1.metrics.nostrilAsym
            };

            const questionnaireScores = questionnaireData.normalizedScores;

            // Run INTEGRATED pattern fusion (Body 50%, Face 30%, Questionnaire 20%)
            const integratedResult = integrateAllModalities(bodyMetrics, faceMetrics, questionnaireScores);
            setPatternResults(integratedResult);
        }
    }, [appStage, captureData, questionnaireData]);

    // ── Retry-with-backoff helper (for CDN/network timeouts) ─────────────
    const retryWithBackoff = async (fn, retries = 3, delayMs = 2000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await fn();
            } catch (err) {
                if (attempt === retries) throw err;
                console.warn(`[MediaPipe] Attempt ${attempt} failed, retrying in ${delayMs}ms…`, err.message);
                await new Promise(r => setTimeout(r, delayMs));
                delayMs *= 2; // exponential backoff
            }
        }
    };

    // ── Camera error → user-friendly message mapper ───────────────────────
    const getCameraErrorMessage = (err) => {
        switch (err?.name) {
            case 'NotAllowedError':
            case 'PermissionDeniedError':
                return 'Camera access was denied.\n\nOn iPhone: go to Settings → Safari → Camera and set it to "Allow", then reload.\nOn Android/Desktop: click the camera icon in the browser address bar and allow access.';
            case 'NotFoundError':
            case 'DevicesNotFoundError':
                return 'No camera was found on this device. Please connect a camera and try again.';
            case 'NotReadableError':
            case 'TrackStartError':
                return 'Your camera is already in use by another app. Please close other apps (e.g. FaceTime, Zoom) and reload the page.';
            case 'OverconstrainedError':
            case 'ConstraintNotSatisfiedError':
                return 'Camera resolution not supported — retrying with lower quality…';
            default:
                return `Camera could not be started: ${err?.message || 'Unknown error'}. Please reload the page and try again.`;
        }
    };

    // ── Initialize MediaPipe and Camera ───────────────────────────────────
    useEffect(() => {
        let animationFrameId;

        const initModelsAndCamera = async () => {
            // Don't attempt init if pre-flight already detected incompatibility
            if (initError) return;
            if (!webcamRef.current || !canvasRef.current) return;

            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const drawingUtils = new DrawingUtils(ctx);

            try {
                // Show loading UI immediately — model init takes 10-60s on slow devices
                setIsLoadingModels(true);

                // ── Step 1: Load WASM runtime ──────────────────────────────────────
                setLoadingStep('Loading scan engine…');
                const vision = await retryWithBackoff(() =>
                    FilesetResolver.forVisionTasks(
                        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm"
                    )
                );

                // ── Step 2: Load Face model (sequential — safer on low RAM) ────────
                // Loading both models simultaneously with Promise.all() causes peak RAM
                // usage that can trigger OOM kills on low-end Android/iOS devices.
                // Sequential loading trades a few seconds of extra wait for stability.
                setLoadingStep('Loading face analysis model…');
                const faceLandmarker = await retryWithBackoff(() => FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                }));
                faceLandmarkerRef.current = faceLandmarker;

                // ── Step 3: Load Pose model (lite — same accuracy for posture) ─────
                setLoadingStep('Loading body analysis model…');
                const poseLandmarker = await retryWithBackoff(() => PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        // ✅ LITE model: ~5MB vs 30MB full, same postural analysis accuracy
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    },
                    runningMode: "VIDEO",
                    numPoses: 1,
                }));
                poseLandmarkerRef.current = poseLandmarker;

                setLoadingStep('Ready');
                setIsLoadingModels(false);

            } catch (err) {
                console.error('[MediaPipe] Init failed after retries:', err);
                setIsLoadingModels(false);
                setInitError(
                    'The body scan engine could not load. This may be due to a slow network or an unsupported browser.\n\nPlease check your connection and reload the page. If the problem persists, try Chrome or Safari.'
                );
                return; // Stop — do not attempt to start the camera
            }

            const startCamera = () => {
                // ✅ CRITICAL FIX: Do NOT call getUserMedia here.
                // react-webcam already acquires and owns the camera stream.
                // A second getUserMedia() call causes NotReadableError on low-end
                // Android (camera busy) or silently hangs, preventing the render
                // loop from ever starting. Camera errors are handled by the
                // onUserMediaError prop on the <Webcam> component in the JSX.
                if (cameraRunningRef.current) return;
                cameraRunningRef.current = true;

                const renderLoop = async () => {
                    if (!webcamRef.current || !video || video.readyState < 2) {
                        animationFrameId = requestAnimationFrame(renderLoop);
                        return;
                    }

                    const now = performance.now();

                    // Skip inference if screen is frozen - STOP THE LOOP
                    if (isFrozen) {
                        return; // Don't continue the loop
                    }

                    const shouldRunInference = (now - lastInferenceTimeRef.current) >= INFERENCE_INTERVAL_MS;

                    // ✨ FIXED: Draw video with proper aspect ratio preservation
                    // Calculate aspect ratios
                    const videoAspect = video.videoWidth / video.videoHeight;
                    const canvasAspect = canvas.width / canvas.height;

                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (videoAspect > canvasAspect) {
                        // Video is wider - fit to width
                        drawWidth = canvas.width;
                        drawHeight = canvas.width / videoAspect;
                        offsetX = 0;
                        offsetY = (canvas.height - drawHeight) / 2;
                    } else {
                        // Video is taller - fit to height
                        drawHeight = canvas.height;
                        drawWidth = canvas.height * videoAspect;
                        offsetX = (canvas.width - drawWidth) / 2;
                        offsetY = 0;
                    }

                    // Draw video frame on VISIBLE canvas (clean, no landmarks) with proper aspect ratio
                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

                    // Draw video frame + landmarks on HIDDEN canvas (for capture) with proper aspect ratio
                    const hiddenCanvas = hiddenCanvasRef.current;
                    let hiddenCtx = null;
                    if (hiddenCanvas) {
                        hiddenCtx = hiddenCanvas.getContext("2d");
                        hiddenCtx.save();
                        hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
                        hiddenCtx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
                    }

                    if (shouldRunInference && !showResults) {
                        lastInferenceTimeRef.current = now;

                        try {
                            // For Stage 4, ONLY run pose detection (no face mesh)
                            const isStage4 = captureStageRef.current === 'STAGE_4_LOWER_SIDE';

                            const faceResult = isStage4 ? null : faceLandmarkerRef.current.detectForVideo(video, now);
                            const poseResult = poseLandmarkerRef.current.detectForVideo(video, now);

                            let currentFaceMetrics = { ...metrics.face };
                            let currentBodyMetrics = { ...metrics.body };

                            // Face Metrics (SKIP for Stage 4)
                            if (!isStage4 && faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
                                const fl = faceResult.faceLandmarks[0];

                                // Landmarks are drawn on HIDDEN canvas only (see lines below)
                                // This keeps the visible canvas clean for user experience

                                // Calculate metrics
                                const irisWidth = calculateDistance(fl[468], fl[473]);
                                const normFactor = irisWidth > 0 ? irisWidth : 1;

                                const leftEye = fl[33];
                                const rightEye = fl[263];
                                const eyeDiffY = Math.abs(leftEye.y - rightEye.y);
                                const eyeSym = eyeDiffY / normFactor;

                                const chin = fl[152];
                                const noseBridge = fl[6];
                                const jawDiffX = Math.abs(chin.x - noseBridge.x);
                                const jawShift = jawDiffX / normFactor;

                                const tilt = calculateAngle(leftEye, rightEye);
                                const headTilt = Math.abs(tilt);

                                const noseTip = fl[1];
                                const leftNostril = fl[98];  // Correct left nostril landmark
                                const rightNostril = fl[327]; // Correct right nostril landmark
                                const distL = calculateDistance(noseTip, leftNostril);
                                const distR = calculateDistance(noseTip, rightNostril);
                                const nostrilAsym = Math.abs(distL - distR) / normFactor;

                                currentFaceMetrics = {
                                    eyeSym: formatMetric(eyeSym, 3),
                                    jawShift: formatMetric(jawShift, 3),
                                    headTilt: formatMetric(headTilt, 1),
                                    nostrilAsym: formatMetric(nostrilAsym, 3),
                                    irisWidth: irisWidth
                                };

                                // Alignment check
                                const shouldCheckAlignment = (now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL;
                                if (shouldCheckAlignment) {
                                    const aligned = checkAlignment(captureStageRef.current, fl, poseResult.landmarks?.[0]);
                                    setIsAligned(aligned);
                                    lastAlignmentCheckRef.current = now;
                                }
                            }

                            // Body Metrics
                            if (poseResult.landmarks && poseResult.landmarks.length > 0) {
                                const pl = poseResult.landmarks[0];

                                // Landmarks are drawn on HIDDEN canvas only (see lines below)
                                // This keeps the visible canvas clean for user experience

                                // METRIC 4: Shoulder Height Asymmetry (Normalized by Body Height)
                                // Uses Left Shoulder (11), Right Shoulder (12), Ankles (27, 28)
                                // Expected: <2% (normal), 2-4% (mild), 4-6% (moderate), >6% (severe)
                                const shoulderHeight = calculateShoulderHeightAsymmetry(pl);

                                // Handle null return (missing landmarks)
                                if (shoulderHeight === null) {
                                    console.warn('Could not calculate shoulder asymmetry - missing landmarks');
                                }

                                // METRIC 5: Forward Head Posture (Craniovertebral Angle - CVA)
                                // Uses Nose (0), Ear (7), Shoulder (11)
                                // Expected: 50-60° (normal), <40° (severe FHP)
                                const nose = pl[0];
                                const ear = pl[7];
                                const leftShoulder = pl[11]; // Left shoulder landmark
                                const fhpAngle = calculateCraniovertebralAngle(nose, ear, leftShoulder);

                                // Handle null return (missing landmarks)
                                if (fhpAngle === null) {
                                    console.warn('Could not calculate CVA - missing landmarks');
                                }

                                // METRIC 6: Anterior Pelvic Tilt
                                // Uses Hip (23), Knee (25) for side view
                                // Expected: 5-12° (normal), >15° (hyperlordotic), <5° (posterior tilt)
                                const pelvicTilt = calculatePelvicTilt(pl, 'side');

                                // Get interpretation
                                const pelvicInterpretation = interpretPelvicTilt(pelvicTilt, 'side');

                                // Handle null return (missing landmarks)
                                if (pelvicTilt === null) {
                                    console.warn('Could not calculate pelvic tilt - missing landmarks');
                                }

                                // METRIC 7: Knee Valgus Angle (Joint Angle at Knee)
                                // Uses Hip (23) -> Knee (25) -> Ankle (27)
                                // Expected: 165-180° (170-180° is normal, 165-170° is mild valgus)
                                const leftHip = pl[23]; // Left hip landmark
                                const leftKnee = pl[25]; // Left knee landmark
                                const leftAnkle = pl[27];
                                const kneeAngle = calculateAngle3Points(leftHip, leftKnee, leftAnkle);

                                // METRIC 8: Foot Arch Collapse Ratio (NEW METHOD)
                                // Uses Ankle (27/28), Heel (29/30), Foot Index (31/32)
                                // Expected: 0.30-0.40 (normal arch), 0.20-0.30 (mild pronation), <0.20 (severe flat foot)
                                // NEW: Vertical arch height ratio (navicular to heel / ankle to heel)
                                const footArchData = calculateFootArchBothSides(pl);
                                const footArchRatio = footArchData.average;

                                // Handle null return (missing landmarks)
                                if (footArchRatio === null) {
                                    console.warn('Could not calculate foot arch ratio - missing landmarks');
                                }



                                currentBodyMetrics = {
                                    shoulderHeight: formatMetric(shoulderHeight, 3),
                                    fhpAngle: formatMetric(fhpAngle, 1),
                                    pelvicTilt: formatMetric(pelvicTilt, 2),
                                    kneeAngle: formatMetric(kneeAngle, 1),
                                    footArchRatio: formatMetric(footArchRatio, 3)
                                };
                            }

                            // Alignment check for Stage 4 (pose only, no face) - MOVED OUTSIDE pose block
                            // This ensures it runs even if pose landmarks aren't detected
                            if (isStage4) {


                                const shouldCheckAlignment = (now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL;
                                if (shouldCheckAlignment) {
                                    const poseLandmarks = poseResult?.landmarks?.[0];

                                    const aligned = checkAlignment(captureStageRef.current, null, poseLandmarks);
                                    setIsAligned(aligned);
                                    lastAlignmentCheckRef.current = now;
                                }
                            }

                            // Alignment check for Stages 2 & 3 (pose only, no face required)
                            const isStage2or3 = captureStageRef.current === 'STAGE_2_UPPER_FRONT' || captureStageRef.current === 'STAGE_3_UPPER_SIDE';
                            if (isStage2or3) {
                                const shouldCheckAlignment = (now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL;
                                if (shouldCheckAlignment) {
                                    const poseLandmarks = poseResult?.landmarks?.[0];
                                    const aligned = checkAlignment(captureStageRef.current, null, poseLandmarks);
                                    setIsAligned(aligned);
                                    lastAlignmentCheckRef.current = now;
                                }
                            }

                            setMetrics({
                                face: currentFaceMetrics,
                                body: currentBodyMetrics
                            });

                            // ✅ CRITICAL: Draw landmarks on HIDDEN canvas for capture
                            // This ensures captured images have visible landmarks for analysis
                            if (hiddenCtx) {
                                const drawingUtils = new DrawingUtils(hiddenCtx);

                                // Draw face landmarks (Stages 1-3)
                                if (!isStage4 && faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
                                    const fl = faceResult.faceLandmarks[0];
                                    drawingUtils.drawConnectors(fl, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "rgba(0, 255, 0, 0.3)", lineWidth: 0.1 });
                                    drawingUtils.drawLandmarks(fl, { color: "#00FF00", radius: 1 });
                                }

                                // Draw pose landmarks (All stages)
                                if (poseResult.landmarks && poseResult.landmarks.length > 0) {
                                    const pl = poseResult.landmarks[0];
                                    drawingUtils.drawConnectors(pl, PoseLandmarker.POSE_CONNECTIONS, { color: "rgba(0, 255, 0, 0.5)", lineWidth: 1.5 });
                                    drawingUtils.drawLandmarks(pl, { color: "#00FF00", radius: 2 });
                                }
                            }

                        } catch (e) {
                            const msg = e?.message || '';
                            // GPU / WebGL context lost — fatal, need to re-init
                            if (msg.toLowerCase().includes('context lost') || msg.toLowerCase().includes('webgl')) {
                                console.error('[RenderLoop] GPU context lost — stopping loop', e);
                                setInitError('The camera view was interrupted (GPU context lost). Please reload the page.');
                                return; // Stop the render loop; don't re-schedule rAF
                            }
                            // ROI dimension / initialization transient errors — expected, ignore
                        }
                    }

                    ctx.restore();
                    if (hiddenCtx) {
                        hiddenCtx.restore();
                    }
                    animationFrameId = requestAnimationFrame(renderLoop);
                };

                // Store renderLoop in ref for restart capability
                renderLoopRef.current = renderLoop;
                renderLoop();
            };

            startCamera();
        };

        initModelsAndCamera();

        return () => {
            cameraRunningRef.current = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            // ✅ Release ML model memory on unmount (prevents memory leaks)
            try { faceLandmarkerRef.current?.close(); } catch (_) { }
            try { poseLandmarkerRef.current?.close(); } catch (_) { }
        };
    }, [appStage]);

    // ✨ MODULAR: Alignment check logic - now uses utils/alignmentChecks.js
    const checkAlignment = (stage, faceLandmarks, poseLandmarks) => {
        // Use the modular utility function
        const result = checkAlignmentUtil(stage, faceLandmarks, poseLandmarks);

        // Update stage-specific debug info for UI feedback
        switch (stage) {
            case 'STAGE_1_FACE':
                setStage1Debug(result);
                break;
            case 'STAGE_2_UPPER_FRONT':
                setStage2Debug(result);
                break;
            case 'STAGE_3_UPPER_SIDE':
                setStage3Debug(result);
                break;
            case 'STAGE_4_LOWER_SIDE':
                setStage4Debug(result);
                break;
        }

        return result.aligned;
    };

    // Auto-capture timer effect - 5 seconds total (2s green hold + 3s countdown)
    useEffect(() => {
        if (isAligned && !showResults) {
            // Start countdown timer
            alignmentTimerRef.current = setInterval(() => {
                setHoldDuration(prev => {
                    const newDuration = prev + 100;
                    if (newDuration >= 5000) {
                        // Auto-capture triggered after 2s hold + 3s countdown
                        clearInterval(alignmentTimerRef.current);
                        handleCapture();
                        return 0;
                    }
                    return newDuration;
                });
            }, 100);
        } else {
            // Reset timer if not aligned
            if (alignmentTimerRef.current) {
                clearInterval(alignmentTimerRef.current);
                alignmentTimerRef.current = null;
            }
            setHoldDuration(0);
        }

        return () => {
            if (alignmentTimerRef.current) {
                clearInterval(alignmentTimerRef.current);
            }
        };
    }, [isAligned, showResults]);

    const captureFrameWithLandmarks = (faceLandmarks, poseLandmarks, isStage4) => {
        const video = webcamRef.current?.video;
        if (!video) {
            console.error('❌ Video not available for capture');
            return null;
        }

        // ✅ FIX: Use the video's EXACT native resolution for the capture canvas.
        // MediaPipe runs inference on the live canvas which matches the video's native
        // pixel dimensions. If we scale the capture canvas to a different size (e.g.
        // hardcoded 720px), DrawingUtils maps the same normalized coords to different
        // pixel positions → landmarks land in the wrong spot on many phones.
        // Using videoWidth × videoHeight guarantees both canvases share the same
        // coordinate space, so every landmark is pixel-perfect regardless of device.
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;

        const ctx = tempCanvas.getContext('2d');

        // Step 1: Draw the clean video frame
        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        // Step 2: Export the clean frame — used for the post-capture preview shown to the user
        const cleanDataURL = tempCanvas.toDataURL('image/jpeg', 0.95);

        // Step 3: Bake landmarks on top of the same canvas — same coordinate space,
        // so DrawingUtils normalized coords map perfectly to the video pixels.
        // This composite version is stored for the results screen.
        try {
            const drawingUtils = new DrawingUtils(ctx);

            // Face landmarks (Stages 1, 2, 3)
            if (!isStage4 && faceLandmarks && faceLandmarks.length > 0) {
                drawingUtils.drawConnectors(
                    faceLandmarks,
                    FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                    { color: 'rgba(0, 255, 0, 0.3)', lineWidth: 0.5 }
                );
                drawingUtils.drawLandmarks(
                    faceLandmarks,
                    { color: '#00FF00', radius: 1.5, fillColor: '#00FF00' }
                );
            }

            // Pose landmarks (All stages)
            if (poseLandmarks && poseLandmarks.length > 0) {
                drawingUtils.drawConnectors(
                    poseLandmarks,
                    PoseLandmarker.POSE_CONNECTIONS,
                    { color: 'rgba(0, 255, 0, 0.6)', lineWidth: 2 }
                );
                drawingUtils.drawLandmarks(
                    poseLandmarks,
                    { color: '#00FF00', radius: 3, fillColor: '#00FF00' }
                );
            }
        } catch (err) {
            console.warn('captureFrameWithLandmarks: landmark draw error', err);
        }

        const compositeDataURL = tempCanvas.toDataURL('image/jpeg', 0.95);

        console.log(`✅ Captured image: ${tempCanvas.width}x${tempCanvas.height}px (video: ${video.videoWidth}x${video.videoHeight})`);

        showFlashEffect();
        // Return both: clean for preview, composite (landmarks baked in) for results
        return { clean: cleanDataURL, composite: compositeDataURL };
    };


    // Flash effect on capture
    const showFlashEffect = () => {
        const flash = document.createElement('div');
        flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: white;
      z-index: 9999;
      pointer-events: none;
      animation: flash 0.3s ease-out;
    `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    };

    // Validate captured landmarks
    const validateCapturedLandmarks = (stage) => {
        const video = webcamRef.current?.video;
        if (!video || !faceLandmarkerRef.current || !poseLandmarkerRef.current) {
            console.error('❌ Validation failed: Detection system not ready');
            return { isValid: false, error: 'Detection system not ready' };
        }

        try {
            const now = performance.now();

            switch (stage) {
                case 'STAGE_1_FACE':
                    const faceResult = faceLandmarkerRef.current.detectForVideo(video, now);


                    if (!faceResult || !faceResult.faceLandmarks || faceResult.faceLandmarks.length === 0) {
                        return { isValid: false, error: 'Face landmarks not detected' };
                    }
                    return { isValid: true, error: '' };

                case 'STAGE_2_UPPER_FRONT':
                case 'STAGE_3_UPPER_SIDE':
                case 'STAGE_4_LOWER_SIDE':
                    const poseResult = poseLandmarkerRef.current.detectForVideo(video, now);
                    const landmarkCount = poseResult?.landmarks?.length || 0;
                    const hasLandmarks = poseResult?.landmarks?.[0];
                    const landmarkPoints = hasLandmarks ? Object.keys(poseResult.landmarks[0]).length : 0;

                    // STRICT CHECK: Must have landmarks array AND at least 33 landmark points
                    if (!poseResult || !poseResult.landmarks || landmarkCount === 0 || landmarkPoints < 33) {
                        return { isValid: false, error: 'Body landmarks not detected' };
                    }

                    return { isValid: true, error: '' };

                default:
                    console.error('❌ Validation failed: Unknown stage');
                    return { isValid: false, error: 'Unknown stage' };
            }
        } catch (error) {
            console.error('❌ Validation error:', error);
            return { isValid: false, error: 'Validation failed' };
        }
    };

    // Handle Continue button click
    const handleContinue = () => {
        setShowReviewButtons(false);
        setValidationError('');

        // Unfreeze and advance to next stage
        setTimeout(() => {
            setIsFrozen(false);
            setFrozenImage(null);

            switch (captureStage) {
                case 'STAGE_1_FACE':
                    setCaptureStage('STAGE_2_UPPER_FRONT');
                    break;
                case 'STAGE_2_UPPER_FRONT':
                    setCaptureStage('STAGE_3_UPPER_SIDE');
                    break;
                case 'STAGE_3_UPPER_SIDE':
                    setCaptureStage('STAGE_4_LOWER_SIDE');
                    break;
                case 'STAGE_4_LOWER_SIDE':
                    // All captures complete - run pattern analysis

                    // Combine all metrics for pattern analysis
                    const combinedMetrics = {
                        face: {
                            eyeSym: captureData.stage1.metrics.eyeSym,
                            jawShift: captureData.stage1.metrics.jawShift,
                            headTilt: captureData.stage1.metrics.headTilt,
                            nostrilAsym: captureData.stage1.metrics.nostrilAsym
                        },
                        body: {
                            shoulderHeight: captureData.stage2.metrics.shoulderHeight,
                            fhpAngle: captureData.stage3.metrics.fhpAngle,
                            pelvicTilt: captureData.stage4.metrics.pelvicTilt,
                            kneeAngle: captureData.stage4.metrics.kneeAngle,
                            footArchRatio: captureData.stage4.metrics.footArchRatio
                        }
                    };


                    // Run integrated pattern analysis (Body 50%, Face 30%, Questionnaire 20%)
                    // ✅ Null-guard: sessionStorage may be cleared by iOS on low memory
                    const normalizedScores = questionnaireData?.normalizedScores ?? {};
                    let integratedResults = null;
                    try {
                        integratedResults = integrateAllModalities(
                            combinedMetrics.body,
                            combinedMetrics.face,
                            normalizedScores
                        );
                    } catch (analysisErr) {
                        console.error('Pattern analysis failed, proceeding without it:', analysisErr);
                    }

                    setPatternResults(integratedResults);

                    // Show results after analysis
                    setAppStage('PROCESSING');
                    break;
            }

            setIsAligned(false);
        }, 300);
    };

    // Handle Retake button click
    const handleRetake = () => {
        setShowReviewButtons(false);
        setValidationError('');
        setIsFrozen(false);
        setFrozenImage(null);
        setIsAligned(false);
        setHoldDuration(0);

        // Clear the captured data for this stage
        switch (captureStage) {
            case 'STAGE_1_FACE':
                setCaptureData(prev => ({
                    ...prev,
                    stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } }
                }));
                break;
            case 'STAGE_2_UPPER_FRONT':
                setCaptureData(prev => ({
                    ...prev,
                    stage2: { image: null, metrics: { shoulderHeight: 0 } }
                }));
                break;
            case 'STAGE_3_UPPER_SIDE':
                setCaptureData(prev => ({
                    ...prev,
                    stage3: { image: null, metrics: { fhpAngle: 0 } }
                }));
                break;
            case 'STAGE_4_LOWER_SIDE':
                setCaptureData(prev => ({
                    ...prev,
                    stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
                }));
                break;
        }
    };

    // Auto-retry after validation failure
    const handleAutoRetry = (errorMessage) => {
        setValidationError(errorMessage);
        setIsValidating(true);

        // Show error for 2 seconds, then reset
        setTimeout(() => {
            setValidationError('');
            setIsValidating(false);
            setIsFrozen(false);
            setFrozenImage(null);
            setIsAligned(false);
            setHoldDuration(0);
        }, 2000);
    };

    // Capture handler
    const handleCapture = () => {
        if (!isAligned) return;

        const video = webcamRef.current?.video;
        const now = performance.now();
        const isStage4 = captureStage === 'STAGE_4_LOWER_SIDE';

        // Step 1: Detect landmarks at the exact moment of capture
        let faceLandmarks = null;
        let poseLandmarks = null;

        if (!isStage4 && faceLandmarkerRef.current) {
            const faceResult = faceLandmarkerRef.current.detectForVideo(video, now);
            faceLandmarks = faceResult?.faceLandmarks?.[0] || null;
        }

        if (poseLandmarkerRef.current) {
            const poseResult = poseLandmarkerRef.current.detectForVideo(video, now);
            poseLandmarks = poseResult?.landmarks?.[0] || null;
        }

        // Step 2: Capture both a clean preview image and a composite image with landmarks baked in
        const captured = captureFrameWithLandmarks(faceLandmarks, poseLandmarks, isStage4);
        if (!captured) return;

        // Step 3: Freeze the screen — show the CLEAN image in the preview (no landmarks)
        setIsFrozen(true);
        setFrozenImage(captured.clean);

        // Step 4: Validate landmarks
        const validation = validateCapturedLandmarks(captureStage);
        if (!validation.isValid) {
            handleAutoRetry(validation.error);
            return;
        }

        // Step 5: Save capture data
        // NOTE: landmarks are now BAKED INTO the image — no separate landmark data needed.
        // The `landmarks` field is kept for backward compatibility but is no longer used
        // by ResultsScreen to draw an overlay.
        // Step 5: Save capture data — use the COMPOSITE image (landmarks baked in) for results screen
        switch (captureStage) {
            case 'STAGE_1_FACE':
                setCaptureData(prev => ({
                    ...prev,
                    stage1: {
                        image: captured.composite,
                        metrics: {
                            eyeSym: metrics.face.eyeSym,
                            jawShift: metrics.face.jawShift,
                            headTilt: metrics.face.headTilt,
                            nostrilAsym: metrics.face.nostrilAsym
                        },
                        landmarks: null
                    }
                }));
                break;

            case 'STAGE_2_UPPER_FRONT':
                setCaptureData(prev => ({
                    ...prev,
                    stage2: {
                        image: captured.composite,
                        metrics: { shoulderHeight: metrics.body.shoulderHeight },
                        landmarks: null
                    }
                }));
                break;

            case 'STAGE_3_UPPER_SIDE':
                setCaptureData(prev => ({
                    ...prev,
                    stage3: {
                        image: captured.composite,
                        metrics: { fhpAngle: metrics.body.fhpAngle },
                        landmarks: null
                    }
                }));
                break;

            case 'STAGE_4_LOWER_SIDE':
                setCaptureData(prev => ({
                    ...prev,
                    stage4: {
                        image: captured.composite,
                        metrics: {
                            pelvicTilt: metrics.body.pelvicTilt,
                            kneeAngle: metrics.body.kneeAngle,
                            footArchRatio: metrics.body.footArchRatio
                        },
                        landmarks: null
                    }
                }));
                break;
        }

        // Show Retake/Continue buttons
        setShowReviewButtons(true);
    };

    // Restart handler
    const handleRestart = () => {
        console.log('🔄 Restarting application - cleaning up resources...');

        // CRITICAL: Stop camera stream
        if (webcamRef.current?.video?.srcObject) {
            const stream = webcamRef.current.video.srcObject;
            stream.getTracks().forEach(track => {
                track.stop();
                console.log('📹 Stopped camera track:', track.kind);
            });
            webcamRef.current.video.srcObject = null;
        }

        // CRITICAL: Cancel animation frame loop
        if (window.requestAnimationFrame && renderLoopRef.current) {
            cancelAnimationFrame(renderLoopRef.current);
            console.log('🎬 Cancelled animation frame');
        }

        // CRITICAL: Reset camera running flag
        cameraRunningRef.current = false;
        console.log('🚫 Reset camera running flag');

        // CRITICAL: Clear MediaPipe model refs (they will be reloaded)
        faceLandmarkerRef.current = null;
        poseLandmarkerRef.current = null;
        console.log('🧹 Cleared MediaPipe model refs');

        // Reset timing refs
        lastInferenceTimeRef.current = 0;
        lastAlignmentCheckRef.current = 0;
        console.log('⏱️ Reset timing refs');

        // Clear render loop ref
        renderLoopRef.current = null;

        // Reset state variables
        setAppStage('LANDING');
        setCaptureStage('STAGE_1_FACE');
        setIsAligned(false);
        setIsFrozen(false);
        setFrozenImage(null);
        setShowReviewButtons(false);
        setValidationError('');
        setHoldDuration(0);

        // Reset capture data
        setCaptureData({
            stage1: {
                image: null,
                metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 },
                landmarks: { face: null, pose: null }
            },
            stage2: {
                image: null,
                metrics: { shoulderHeight: 0 },
                landmarks: { face: null, pose: null }
            },
            stage3: {
                image: null,
                metrics: { fhpAngle: 0 },
                landmarks: { face: null, pose: null }
            },
            stage4: {
                image: null,
                metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 },
                landmarks: { face: null, pose: null }
            }
        });

        // Clear sessionStorage
        sessionStorage.removeItem('bodiKemistriCapture');
        sessionStorage.removeItem('bodiKemistriQuestionnaire');

        console.log('✅ Restart complete - ready for new analysis');
    };

    // ─── Video constraints — cascaded fallback for Android front camera ───
    // Start with ideal front camera (soft — never throws OverconstrainedError).
    // If even that fails, onUserMediaError drops to bare { video: true }.
    // DO NOT use plain string facingMode:"user" + exact width/height together —
    // that causes Chrome Android to pick the rear camera silently.
    const [videoConstraints, setVideoConstraints] = useState({
        facingMode: { ideal: 'user' },   // soft preference: always tries front, never hard-fails
    });

    // Tracks whether we already tried the bare fallback, to avoid an infinite loop
    const cameraFallbackUsedRef = useRef(false);

    const handleCameraError = (err) => {
        const isOverconstrained =
            err?.name === 'OverconstrainedError' ||
            err?.name === 'ConstraintNotSatisfiedError';

        if (isOverconstrained && !cameraFallbackUsedRef.current) {
            // Silently retry with no constraints — at least the camera opens
            cameraFallbackUsedRef.current = true;
            setVideoConstraints({ video: true });
            return;
        }

        // Any other error (NotAllowedError, NotFoundError, etc.) — show message
        setCameraError(getCameraErrorMessage(err));
    };

    // Show results screen
    // Navigation Flow - Show different screens based on appStage
    if (appStage === 'LANDING') {
        return <LandingPage onStart={() => setAppStage('QUESTIONNAIRE')} />;
    }

    if (appStage === 'QUESTIONNAIRE') {
        return (
            <Questionnaire
                onComplete={(questionnaireResult) => {
                    console.log('Questionnaire Complete:', questionnaireResult);
                    setQuestionnaireData(questionnaireResult);
                    setAppStage('INSTRUCTIONS');
                }}
            />
        );
    }

    if (appStage === 'INSTRUCTIONS') {
        return <InstructionPage onStart={() => setAppStage('CAPTURE')} />;
    }

    if (appStage === 'PROCESSING') {
        return <ProcessingScreen onComplete={() => setAppStage('RESULTS')} />;
    }

    if (appStage === 'RESULTS') {
        return (
            <ResultsScreen
                captureData={captureData}
                questionnaireData={questionnaireData}
                patternResults={patternResults}
                onRestart={handleRestart}
            />
        );
    }

    // appStage === 'CAPTURE' - Show the 4-stage capture flow

    // ── Error / unsupported-device screens ───────────────────────────────
    // These replace the camera UI with a readable, actionable message.
    // A blank/crashed page is never shown.
    const ErrorScreen = ({ title, message, showReload = true }) => (
        <div style={{
            minHeight: '100dvh', width: '100vw',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center',
            background: 'linear-gradient(165deg, #F8F5F0 0%, #F0EBE3 40%, #E8E1D7 100%)',
            fontFamily: 'Outfit, sans-serif',
        }}>
            <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'rgba(47,74,60,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', fontSize: '1.8rem',
            }}>⚠️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#2F4A3C', marginBottom: '0.75rem' }}>
                {title}
            </h2>
            <p style={{
                fontSize: '0.95rem', color: '#5a7060',
                maxWidth: 340, lineHeight: 1.7, marginBottom: '2rem',
                whiteSpace: 'pre-line',
            }}>
                {message}
            </p>
            {showReload && (
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '0.8rem 2.2rem', borderRadius: '12px',
                        background: '#2F4A3C', color: '#fff',
                        fontSize: '0.85rem', fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        border: 'none', cursor: 'pointer',
                    }}
                >
                    Reload Page
                </button>
            )}
        </div>
    );

    if (initError) {
        return <ErrorScreen title="Scan Engine Unavailable" message={initError} />;
    }

    if (cameraError) {
        return <ErrorScreen title="Camera Not Available" message={cameraError} />;
    }

    if (cameraLost) {
        return (
            <ErrorScreen
                title="Camera Connection Lost"
                message={"The camera feed was interrupted.\n\nThis can happen if another app takes control of your camera or if your device goes to sleep.\n\nTap 'Reload Page' to reconnect."}
            />
        );
    }

    return (
        <div
            style={{
                height: "100dvh", // FIXED: Dynamic viewport height for mobile
                width: "100vw",
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#EFE9DF",
                position: 'fixed', // FIXED: Fixed positioning for full screen
                top: 0,
                left: 0,
                overflow: 'hidden',
                padding: 0 // FIXED: Remove padding for full screen
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: '100%',
                    height: '100%', // FIXED: Fill parent container
                    maxWidth: '100vw',
                    maxHeight: '100dvh' // FIXED: Use dynamic viewport height
                }}
            >
                {/* Background Layer (Subtle Gradient) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(143, 169, 155, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }} />

                <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={videoConstraints}
                    onUserMedia={() => setCameraReady(true)}
                    onUserMediaError={handleCameraError}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transform: "scaleX(-1)",
                        visibility: "hidden"
                    }}
                />

                <canvas
                    ref={canvasRef}
                    width={isPortrait ? 720 : 960}
                    height={isPortrait ? 960 : 720}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', // FIXED: Preserve aspect ratio, prevent distortion
                        transform: "scaleX(-1)",
                        zIndex: 2
                    }}
                />

                {/* Hidden canvas for landmark rendering (not visible to user) */}
                <canvas
                    ref={hiddenCanvasRef}
                    width={isPortrait ? 720 : 960}
                    height={isPortrait ? 960 : 720}
                    style={{ display: 'none' }}
                />

                {/* ── Model Loading Overlay ────────────────────────────────────────── */}
                {/* Shown while MediaPipe downloads + compiles on slow devices (10-60s). */}
                {/* Without this, users see a frozen screen and think the app is broken. */}
                {cameraReady && isLoadingModels && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 50,
                        background: 'rgba(239, 233, 223, 0.97)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Outfit, sans-serif',
                    }}>
                        {/* Spinner */}
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            border: '4px solid rgba(47,74,60,0.15)',
                            borderTop: '4px solid #2F4A3C',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '1.5rem',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#2F4A3C', marginBottom: '0.4rem' }}>
                            Preparing your scan
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#5a7060', opacity: 0.8 }}>
                            {loadingStep || 'Please wait…'}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#5a7060', opacity: 0.5, marginTop: '0.5rem', maxWidth: 260, textAlign: 'center' }}>
                            This may take up to a minute on first load
                        </p>
                    </div>
                )}

                {/* Ghost Overlays - Show based on stage */}
                {captureStage === 'STAGE_1_FACE' && !isFrozen && <FaceGhost isAligned={isAligned} holdDuration={holdDuration} stage1Debug={stage1Debug} />}
                {captureStage === 'STAGE_2_UPPER_FRONT' && !isFrozen && <UpperBodyFrontGhost isAligned={isAligned} holdDuration={holdDuration} stage2Debug={stage2Debug} />}
                {captureStage === 'STAGE_3_UPPER_SIDE' && !isFrozen && <UpperBodySideGhost isAligned={isAligned} holdDuration={holdDuration} stage3Debug={stage3Debug} />}
                {captureStage === 'STAGE_4_LOWER_SIDE' && !isFrozen && <LowerBodySideGhost isAligned={isAligned} holdDuration={holdDuration} stage4Debug={stage4Debug} />}

                {/* Frozen Image Overlay */}
                {
                    isFrozen && frozenImage && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 20,
                            backgroundColor: '#EFE9DF',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}>
                            {/* Centered Image Card */}
                            <div style={{
                                position: 'relative',
                                width: '90%',
                                maxWidth: '500px',
                                aspectRatio: '3/4',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                                marginBottom: '32px'
                            }}>
                                <img
                                    src={frozenImage}
                                    alt="Captured"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover', // ✨ FIXED: Use 'cover' to fill entire card with no spacing
                                        transform: 'scaleX(-1)',
                                        display: 'block'
                                    }}
                                />

                                {/* Success Message Overlay on Image */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: 'clamp(40px, 10vw, 56px)',
                                    color: '#00FF00',
                                    fontWeight: '900',
                                    textAlign: 'center',
                                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6)',
                                    letterSpacing: '2px',
                                    pointerEvents: 'none',
                                    animation: 'fadeIn 0.2s ease-out'
                                }}>
                                    ✓ Captured
                                </div>
                            </div>

                            {/* CTA Buttons Below Card */}
                            {showReviewButtons && (
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    width: '90%',
                                    maxWidth: '500px'
                                }}>
                                    {/* Retake Button */}
                                    <button
                                        onClick={handleRetake}
                                        style={{
                                            flex: 1,
                                            padding: '16px 24px',
                                            fontSize: 'clamp(16px, 4vw, 18px)',
                                            fontWeight: '600',
                                            color: '#2F4A5C',
                                            backgroundColor: '#FFFFFF',
                                            border: '2px solid #2F4A5C',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#2F4A5C';
                                            e.target.style.color = '#FFFFFF';
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#FFFFFF';
                                            e.target.style.color = '#2F4A5C';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                        }}
                                    >
                                        Retake
                                    </button>

                                    {/* Continue Button */}
                                    <button
                                        onClick={handleContinue}
                                        style={{
                                            flex: 1,
                                            padding: '16px 24px',
                                            fontSize: 'clamp(16px, 4vw, 18px)',
                                            fontWeight: '600',
                                            color: '#FFFFFF',
                                            backgroundColor: '#00FF00',
                                            border: '2px solid #00FF00',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(0, 255, 0, 0.3)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#00DD00';
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(0, 255, 0, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#00FF00';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(0, 255, 0, 0.3)';
                                        }}
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }

                {/* Validation Error Overlay - Auto-retry */}
                {validationError && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 25,
                        backgroundColor: 'rgba(47, 74, 92, 0.95)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeInScale 0.3s ease-out'
                    }}>
                        <div style={{
                            fontSize: 'clamp(24px, 6vw, 48px)',
                            color: '#EFE9DF',
                            fontWeight: '700',
                            marginBottom: '20px',
                            textAlign: 'center',
                            padding: '0 20px'
                        }}>
                            ⚠️ {validationError}
                        </div>
                        <div style={{
                            fontSize: 'clamp(16px, 4vw, 24px)',
                            color: '#8FA99B',
                            textAlign: 'center',
                            padding: '0 20px'
                        }}>
                            Please reposition and try again
                        </div>
                        <div style={{
                            marginTop: '30px',
                            fontSize: 'clamp(14px, 3vw, 18px)',
                            color: 'rgba(239, 233, 223, 0.7)',
                            fontStyle: 'italic'
                        }}>
                            Auto-retrying in 2 seconds...
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
}

export default CapturePage;