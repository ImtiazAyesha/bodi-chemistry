import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
    FilesetResolver,
    FaceLandmarker,
    PoseLandmarker,
    DrawingUtils,
} from "@mediapipe/tasks-vision";

// Utils
import { calculateDistance, calculateDistance2D, calculateAngle, calculateAngle3Points, calculateCraniovertebralAngle, calculateShoulderHeightAsymmetry, calculateFootArchBothSides, calculatePelvicTilt, interpretPelvicTilt, formatMetric } from "../utils/geometry"; // Adjusted path
import { calculateTotalScore } from "../utils/scoring"; // Adjusted path
import analyzePatterns from "../utils/patternAnalyzer"; // Adjusted path
import { calculateQuestionnaireScores } from "../utils/questionnaireScoring"; // Adjusted path
import integrateAllModalities from "../utils/integratedPatternFusion"; // Adjusted path

// Navigation Components
import LandingPage from "../components/LandingPage"; // Adjusted path
import Questionnaire from "../components/Questionnaire"; // Adjusted path
import InstructionPage from "../components/InstructionPage"; // Adjusted path
import ProcessingScreen from "../components/ProcessingScreen"; // Adjusted path

// Components - 4 Stage Ghosts
import FaceGhost from "../components/FaceGhost"; // Adjusted path
import UpperBodyFrontGhost from "../components/UpperBodyFrontGhost"; // Adjusted path
import UpperBodySideGhost from "../components/UpperBodySideGhost"; // Adjusted path
import LowerBodySideGhost from "../components/LowerBodySideGhost"; // Adjusted path
import ResultsScreen from "../components/ResultsScreen"; // Adjusted path

function CapturePage() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const faceLandmarkerRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const cameraRunningRef = useRef(false);

    // Navigation State - Start directly at CAPTURE for testing
    const [appStage, setAppStage] = useState('CAPTURE');
    // Possible values: 'LANDING' → 'QUESTIONNAIRE' → 'INSTRUCTIONS' → 'CAPTURE' → 'PROCESSING' → 'RESULTS'

    // Questionnaire Data
    const [questionnaireData, setQuestionnaireData] = useState({ normalizedScores: { pain: 0, mobility: 0 } });

    // 4-Stage Capture System
    const [captureStage, setCaptureStage] = useState('STAGE_1_FACE');

    const [isAligned, setIsAligned] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Auto-capture timer states
    const [holdDuration, setHoldDuration] = useState(0); // 0 to 3000ms
    const alignmentTimerRef = useRef(null);

    // Screen freeze states
    const [isFrozen, setIsFrozen] = useState(false);
    const [frozenImage, setFrozenImage] = useState(null);

    // Show landmarks for visual feedback
    const [showLandmarks] = useState(true);

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

    // Pattern Analysis Results
    const [patternResults, setPatternResults] = useState(null);

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
            console.log('🔄 Restarting render loop - screen unfrozen');
            renderLoopRef.current();
        }
    }, [isFrozen, appStage]);

    // Run INTEGRATED pattern analysis when entering PROCESSING stage
    useEffect(() => {
        if (appStage === 'PROCESSING' && captureData.stage4.image && questionnaireData) {
            console.log('=== STARTING INTEGRATED PATTERN ANALYSIS (useEffect) ===');

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

            console.log('Body Metrics:', bodyMetrics);
            console.log('Face Metrics:', faceMetrics);
            console.log('Questionnaire Scores:', questionnaireScores);

            // Run INTEGRATED pattern fusion (Body 50%, Face 30%, Questionnaire 20%)
            const integratedResult = integrateAllModalities(bodyMetrics, faceMetrics, questionnaireScores);
            setPatternResults(integratedResult);

            console.log('Integrated Pattern Analysis Complete:', integratedResult);
            console.log('=== INTEGRATED PATTERN ANALYSIS END ===\n');
        }
    }, [appStage, captureData, questionnaireData]);

    // Initialize MediaPipe and Camera
    useEffect(() => {
        let animationFrameId;

        const initModelsAndCamera = async () => {
            if (!webcamRef.current || !canvasRef.current) return;

            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const drawingUtils = new DrawingUtils(ctx);

            // Load MediaPipe models
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm"
            );

            const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                },
                runningMode: "VIDEO",
                numFaces: 1,
            });

            const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
                },
                runningMode: "VIDEO",
                numPoses: 1,
            });

            faceLandmarkerRef.current = faceLandmarker;
            poseLandmarkerRef.current = poseLandmarker;

            const startCamera = async () => {
                if (cameraRunningRef.current) return;

                await navigator.mediaDevices.getUserMedia({ video: true });
                cameraRunningRef.current = true;

                const renderLoop = async () => {
                    if (!webcamRef.current || !video || video.readyState < 2) {
                        animationFrameId = requestAnimationFrame(renderLoop);
                        return;
                    }

                    const now = performance.now();

                    // Skip inference if screen is frozen - STOP THE LOOP
                    if (isFrozen) {
                        console.log('🛑 Render loop stopped - screen is frozen');
                        return; // Don't continue the loop
                    }

                    const shouldRunInference = (now - lastInferenceTimeRef.current) >= INFERENCE_INTERVAL_MS;

                    // Draw video frame
                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

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

                                // Debug mode: Draw landmarks if enabled
                                if (showLandmarks) {
                                    drawingUtils.drawConnectors(fl, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C0", lineWidth: 0.1 });
                                    drawingUtils.drawLandmarks(fl, { color: "#00FF00", radius: 1 });
                                }

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

                                // Debug mode: Draw landmarks if enabled
                                if (showLandmarks) {
                                    drawingUtils.drawConnectors(pl, PoseLandmarker.POSE_CONNECTIONS, { color: "#00FFFF", lineWidth: 2 });
                                    drawingUtils.drawLandmarks(pl, { color: "#FFFF00", radius: 3 });
                                }

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

                                // Log interpretation for debugging
                                console.log('Pelvic Tilt Analysis:', {
                                    angle: pelvicTilt,
                                    level: pelvicInterpretation.level,
                                    description: pelvicInterpretation.description,
                                    score: pelvicInterpretation.score
                                });

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

                                // Log both feet for debugging
                                console.log('Foot Arch Analysis:', {
                                    left: footArchData.left,
                                    right: footArchData.right,
                                    average: footArchData.average,
                                    asymmetry: footArchData.asymmetry
                                });

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
                                console.log('Stage 4: Checking alignment...'); // Debug: confirm we reach here
                                console.log('Stage 4: poseResult =', poseResult); // DEBUG: What's in poseResult?
                                console.log('Stage 4: poseResult.landmarks =', poseResult?.landmarks); // DEBUG: Are landmarks present?

                                const shouldCheckAlignment = (now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL;
                                if (shouldCheckAlignment) {
                                    const poseLandmarks = poseResult?.landmarks?.[0];
                                    console.log('Stage 4: Passing poseLandmarks =', poseLandmarks); // DEBUG: What are we passing?
                                    console.log('Stage 4: Calling checkAlignment with stage =', captureStageRef.current); // DEBUG: What stage?

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

                        } catch (e) {
                            console.warn("Inference error:", e);
                        }
                    }

                    ctx.restore();
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
        };
    }, [appStage]);

    // Alignment check logic for each stage
    const checkAlignment = (stage, faceLandmarks, poseLandmarks) => {

        switch (stage) {
            case 'STAGE_1_FACE':
                // Stage 1 requires face landmarks
                if (!faceLandmarks) return false;

                // Check if nose is inside face ghost circle (centered) - TIGHTENED
                const noseTip = faceLandmarks[1];
                const isXAligned1 = noseTip.x >= 0.40 && noseTip.x <= 0.60; // Stricter: 0.40-0.60 (was 0.35-0.65)
                const isYAligned1 = noseTip.y >= 0.25 && noseTip.y <= 0.45; // Stricter: 0.25-0.45 (was 0.20-0.50)

                // Generate granular feedback for Stage 1
                let feedbackMsg1 = '';
                let feedbackIcon1 = '';

                if (!isXAligned1) {
                    if (noseTip.x < 0.35) {
                        feedbackMsg1 = noseTip.x < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT';
                    } else {
                        feedbackMsg1 = noseTip.x > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT';
                    }
                    feedbackIcon1 = noseTip.x < 0.35 ? '⬅' : '➡️';
                } else if (!isYAligned1) {
                    if (noseTip.y < 0.20) {
                        feedbackMsg1 = noseTip.y < 0.10 ? 'MOVE DOWN' : 'A BIT DOWN';
                    } else {
                        feedbackMsg1 = noseTip.y > 0.60 ? 'MOVE UP' : 'A BIT UP';
                    }
                    feedbackIcon1 = noseTip.y < 0.20 ? '⬇️' : '⬆️';
                }

                setStage1Debug({
                    aligned: isXAligned1 && isYAligned1,
                    feedbackMessage: feedbackMsg1,
                    feedbackIcon: feedbackIcon1
                });

                return isXAligned1 && isYAligned1;

            case 'STAGE_2_UPPER_FRONT':
                // Check if shoulders are visible and centered - TIGHTENED
                if (!poseLandmarks) return false;
                const leftShoulder = poseLandmarks[11];
                const rightShoulder = poseLandmarks[12];
                const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
                const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;

                const isXAligned2 = shoulderCenterX >= 0.42 && shoulderCenterX <= 0.58; // Stricter: 0.42-0.58 (was 0.40-0.60)
                const isYAligned2 = shoulderCenterY >= 0.30 && shoulderCenterY <= 0.50; // Stricter: 0.30-0.50 (was 0.25-0.55)

                // Generate granular feedback for Stage 2
                let feedbackMsg2 = '';
                let feedbackIcon2 = '';

                if (!isXAligned2) {
                    if (shoulderCenterX < 0.40) {
                        feedbackMsg2 = shoulderCenterX < 0.30 ? 'MOVE LEFT' : 'A BIT LEFT';
                    } else {
                        feedbackMsg2 = shoulderCenterX > 0.70 ? 'MOVE RIGHT' : 'A BIT RIGHT';
                    }
                    feedbackIcon2 = shoulderCenterX < 0.40 ? '⬅' : '➡️';
                } else if (!isYAligned2) {
                    if (shoulderCenterY < 0.25) {
                        feedbackMsg2 = shoulderCenterY < 0.15 ? 'MOVE DOWN' : 'A BIT DOWN';
                    } else {
                        feedbackMsg2 = shoulderCenterY > 0.65 ? 'MOVE UP' : 'A BIT UP';
                    }
                    feedbackIcon2 = shoulderCenterY < 0.25 ? '⬇️' : '⬆️';
                }

                setStage2Debug({
                    aligned: isXAligned2 && isYAligned2,
                    feedbackMessage: feedbackMsg2,
                    feedbackIcon: feedbackIcon2
                });

                return isXAligned2 && isYAligned2;

            case 'STAGE_3_UPPER_SIDE':
                // Detect side view ONLY by shoulder width - ignore visibility
                if (!poseLandmarks) {
                    console.log('Stage 3 Debug: No pose landmarks detected');
                    return false;
                }
                const leftShoulder3 = poseLandmarks[11];
                const rightShoulder3 = poseLandmarks[12];

                if (!leftShoulder3 || !rightShoulder3) {
                    console.log('Stage 3 Debug: Shoulders not detected');
                    return false;
                }

                // In side view, shoulders appear close together (narrow width) - STRICTER
                const shoulderDistance = Math.abs(leftShoulder3.x - rightShoulder3.x);
                const isSideView = shoulderDistance < 0.35; // STRICTER: 0.35 (was 0.45)

                // CRITICAL: Check if user is actually IN the frame (centered) - STRICTER
                const shoulderCenterX3 = (leftShoulder3.x + rightShoulder3.x) / 2;
                const shoulderCenterY3 = (leftShoulder3.y + rightShoulder3.y) / 2;

                // User must be reasonably centered horizontally and vertically - STRICTER
                const isHorizontallyCentered = shoulderCenterX3 >= 0.40 && shoulderCenterX3 <= 0.60; // Stricter: 0.40-0.60 (was 0.35-0.65)
                const isVerticallyCentered = shoulderCenterY3 >= 0.30 && shoulderCenterY3 <= 0.50; // Stricter: 0.30-0.50 (was 0.25-0.55)
                const isInFrame = isHorizontallyCentered && isVerticallyCentered;

                console.log('Stage 3 Debug:', {
                    shoulderDistance: shoulderDistance.toFixed(3),
                    isSideView,
                    shoulderCenterX: shoulderCenterX3.toFixed(3),
                    shoulderCenterY: shoulderCenterY3.toFixed(3),
                    isInFrame,
                    aligned: isSideView && isInFrame
                });

                // Generate granular feedback for Stage 3
                let feedbackMsg3 = '';
                if (!isSideView) {
                    feedbackMsg3 = 'TURN TO YOUR RIGHT SIDE';
                } else if (!isHorizontallyCentered) {
                    feedbackMsg3 = shoulderCenterX3 < 0.35 ? (shoulderCenterX3 < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT') : (shoulderCenterX3 > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT');
                } else if (!isVerticallyCentered) {
                    feedbackMsg3 = shoulderCenterY3 < 0.25 ? (shoulderCenterY3 < 0.15 ? 'MOVE DOWN' : 'A BIT DOWN') : (shoulderCenterY3 > 0.65 ? 'MOVE UP' : 'A BIT UP');
                }
                setStage3Debug({ aligned: isSideView && isInFrame, feedbackMessage: feedbackMsg3, feedbackIcon: '' });

                // Check shoulder distance AND position in frame
                return isSideView && isInFrame;

            case 'STAGE_4_LOWER_SIDE':
                // MODERATE DIFFICULTY: Just check for side view
                // Not too easy (any position) and not too hard (strict foot detection)
                console.log('Stage 4: poseLandmarks =', poseLandmarks); // DEBUG: What are we receiving?

                if (!poseLandmarks) {
                    console.log('Stage 4 Debug: No pose landmarks detected');
                    return false;
                }

                const leftHip4 = poseLandmarks[23];
                const rightHip4 = poseLandmarks[24];

                // Check if hips are detected
                if (!leftHip4 || !rightHip4) {
                    console.log('Stage 4 Debug: Hip landmarks not detected');
                    return false;
                }

                // Check for side view - MUCH STRICTER threshold for side profile
                // In side view, hips appear close together (overlapping)
                const hipDistance4 = Math.abs(leftHip4.x - rightHip4.x);
                const isSideView4 = hipDistance4 < 0.12; // STRICT: 0.12 (was 0.15)


                const hipCenterX4 = (leftHip4.x + rightHip4.x) / 2;
                const hipCenterY4 = (leftHip4.y + rightHip4.y) / 2;

                // Optional: Check if lower body landmarks are visible (for debug only)
                const leftAnkle4 = poseLandmarks[27];
                const rightAnkle4 = poseLandmarks[28];
                const leftFoot4 = poseLandmarks[31];
                const rightFoot4 = poseLandmarks[32];
                const footDetected = (leftFoot4 || rightFoot4) || (leftAnkle4 || rightAnkle4);

                // Calculate alignment feedback message (PRIORITY ORDER)
                let feedbackMessage = '';
                let feedbackIcon = '';

                if (!isSideView4) {
                    // PRIORITY 1: Side view (most important)
                    feedbackMessage = 'TURN TO YOUR RIGHT SIDE';
                    feedbackIcon = '↻';
                } else if (hipCenterX4 < 0.35) {
                    // PRIORITY 2: Too far left - Granular feedback (FLIPPED for mirror)
                    if (hipCenterX4 < 0.25) {
                        feedbackMessage = 'MOVE LEFT';
                        feedbackIcon = '⬅';
                    } else {
                        feedbackMessage = 'A BIT LEFT';
                        feedbackIcon = '⬅';
                    }
                } else if (hipCenterX4 > 0.65) {
                    // PRIORITY 3: Too far right - Granular feedback (FLIPPED for mirror)
                    if (hipCenterX4 > 0.75) {
                        feedbackMessage = 'MOVE RIGHT';
                        feedbackIcon = '➡️';
                    } else {
                        feedbackMessage = 'A BIT RIGHT';
                        feedbackIcon = '➡️';
                    }
                } else if (hipCenterY4 > 0.70) {
                    // PRIORITY 4: Too close - Granular feedback
                    if (hipCenterY4 > 0.80) {
                        feedbackMessage = 'STEP BACK';
                        feedbackIcon = '⬆️';
                    } else {
                        feedbackMessage = 'A BIT BACK';
                        feedbackIcon = '⬆️';
                    }
                } else if (hipCenterY4 < 0.30) {
                    // PRIORITY 5: Too far - Granular feedback
                    if (hipCenterY4 < 0.20) {
                        feedbackMessage = 'COME CLOSER';
                        feedbackIcon = '⬇️';
                    } else {
                        feedbackMessage = 'A BIT CLOSER';
                        feedbackIcon = '⬇️';
                    }
                } else {
                    // All aligned!
                    feedbackMessage = 'PERFECT! HOLD STILL';
                    feedbackIcon = '✓';
                }

                const debugInfo4 = {
                    hipDistance: hipDistance4.toFixed(3),
                    isSideView: isSideView4,
                    hipPosition: {
                        x: hipCenterX4.toFixed(3),
                        y: hipCenterY4.toFixed(3)
                    },
                    footDetected: footDetected,
                    leftFoot: !!leftFoot4,
                    rightFoot: !!rightFoot4,
                    leftAnkle: !!leftAnkle4,
                    rightAnkle: !!rightAnkle4,
                    aligned: isSideView4, // Aligned if in side view!
                    feedbackMessage: feedbackMessage,
                    feedbackIcon: feedbackIcon
                };

                console.log('Stage 4 Debug:', debugInfo4);

                // Store debug info for on-screen display
                setStage4Debug(debugInfo4);

                // Return true if in side view (moderate difficulty)
                return isSideView4;

            default:
                return false;
        }
    };

    // Auto-capture timer effect
    useEffect(() => {
        console.log('Countdown effect: isAligned =', isAligned, 'holdDuration =', holdDuration); // DEBUG

        if (isAligned && !showResults) {
            // Start countdown timer
            console.log('Starting countdown timer...'); // DEBUG
            alignmentTimerRef.current = setInterval(() => {
                setHoldDuration(prev => {
                    const newDuration = prev + 100;
                    if (newDuration >= 3000) {
                        // Auto-capture triggered
                        console.log('Auto-capture triggered at 3000ms!'); // DEBUG
                        clearInterval(alignmentTimerRef.current);
                        handleCapture();
                        return 0;
                    }
                    return newDuration;
                });
            }, 100);
        } else {
            // Reset timer if not aligned
            console.log('NOT aligned - resetting countdown'); // DEBUG
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

    // Helper function to capture clean frame without landmarks
    const captureCleanFrame = () => {
        const video = webcamRef.current?.video;
        if (!video) {
            console.error('❌ Video ref not available for capture');
            return null;
        }

        // FIXED: Use actual video dimensions instead of fixed 960x720
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth || 960;
        tempCanvas.height = video.videoHeight || 720;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw full video frame (no landmarks)
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        // Log capture dimensions for debugging
        console.log(`✅ Captured image: ${tempCanvas.width}×${tempCanvas.height}px`);

        // Show flash effect
        showFlashEffect();

        // Return clean image data URL with high quality
        return tempCanvas.toDataURL('image/jpeg', 0.95);
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

    // Capture handler
    const handleCapture = () => {
        if (!isAligned) return;

        // Capture clean frame WITHOUT landmarks
        const imageDataURL = captureCleanFrame();
        if (!imageDataURL) return;

        // Set freeze state (this can show landmarks for visual feedback)
        setIsFrozen(true);
        setFrozenImage(imageDataURL);

        switch (captureStage) {
            case 'STAGE_1_FACE':
                setCaptureData(prev => ({
                    ...prev,
                    stage1: {
                        image: imageDataURL,
                        metrics: {
                            eyeSym: metrics.face.eyeSym,
                            jawShift: metrics.face.jawShift,
                            headTilt: metrics.face.headTilt,
                            nostrilAsym: metrics.face.nostrilAsym
                        }
                    }
                }));

                // Unfreeze after 2 seconds and move to next stage
                setTimeout(() => {
                    setIsFrozen(false);
                    setFrozenImage(null);
                    setCaptureStage('STAGE_2_UPPER_FRONT');
                    setIsAligned(false);
                }, 2000);
                break;

            case 'STAGE_2_UPPER_FRONT':
                setCaptureData(prev => ({
                    ...prev,
                    stage2: {
                        image: imageDataURL,
                        metrics: { shoulderHeight: metrics.body.shoulderHeight }
                    }
                }));

                setTimeout(() => {
                    setIsFrozen(false);
                    setFrozenImage(null);
                    setCaptureStage('STAGE_3_UPPER_SIDE');
                    setIsAligned(false);
                }, 2000);
                break;

            case 'STAGE_3_UPPER_SIDE':
                setCaptureData(prev => ({
                    ...prev,
                    stage3: {
                        image: imageDataURL,
                        metrics: { fhpAngle: metrics.body.fhpAngle }
                    }
                }));

                setTimeout(() => {
                    setIsFrozen(false);
                    setFrozenImage(null);
                    setCaptureStage('STAGE_4_LOWER_SIDE');
                    setIsAligned(false);
                }, 2000);
                break;

            case 'STAGE_4_LOWER_SIDE':
                setCaptureData(prev => ({
                    ...prev,
                    stage4: {
                        image: imageDataURL,
                        metrics: {
                            pelvicTilt: metrics.body.pelvicTilt,
                            kneeAngle: metrics.body.kneeAngle,
                            footArchRatio: metrics.body.footArchRatio
                        }
                    }
                }));

                // Analyze patterns after all captures complete
                setTimeout(() => {
                    console.log('=== STARTING PATTERN ANALYSIS ===');

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
                            pelvicTilt: metrics.body.pelvicTilt,  // Use current metrics for stage 4
                            kneeAngle: metrics.body.kneeAngle,
                            footArchRatio: metrics.body.footArchRatio
                        }
                    };

                    console.log('Combined Metrics for Pattern Analysis:', combinedMetrics);

                    // Run integrated pattern analysis (Body 50%, Face 30%, Questionnaire 20%)
                    console.log('=== CALLING INTEGRATED PATTERN FUSION ===');
                    const integratedResults = integrateAllModalities(
                        combinedMetrics.body,
                        combinedMetrics.face,
                        questionnaireData.normalizedScores
                    );

                    console.log('Integrated Pattern Results:', integratedResults);
                    setPatternResults(integratedResults);

                    // console.log( 'Pattern Analysis Complete:', patterns );
                    console.log('=== PATTERN ANALYSIS END ===\n');

                    setIsFrozen(false);
                    setFrozenImage(null);
                    setAppStage('PROCESSING');
                }, 2000);
                break;

            default:
                break;
        }
    };

    // Restart handler
    const handleRestart = () => {
        setAppStage('LANDING');
        setCaptureStage('STAGE_1_FACE');
        setIsAligned(false);
        setCaptureData({
            stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } },
            stage2: { image: null, metrics: { shoulderHeight: 0 } },
            stage3: { image: null, metrics: { fhpAngle: 0 } },
            stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
        });
    };

    const videoConstraints = {
        facingMode: "user",
        width: 960,
        height: 720,
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

    return (
        <div
            style={{
                height: "100dvh", // FIXED: Dynamic viewport height for mobile
                width: "100vw",
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#111",
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
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={videoConstraints}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // FIXED: Cover entire container, no black bars
                        transform: "scaleX(-1)", // Mirror for selfie view
                        visibility: "hidden"
                    }}
                />


                <canvas
                    ref={canvasRef}
                    width={960}
                    height={720}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        transform: "scaleX(-1)",
                    }}
                />

                {/* Ghost Overlays - Show based on stage */}
                {captureStage === 'STAGE_1_FACE' && !isFrozen && <FaceGhost isAligned={isAligned} holdDuration={holdDuration} stage1Debug={stage1Debug} />}
                {captureStage === 'STAGE_2_UPPER_FRONT' && !isFrozen && <UpperBodyFrontGhost isAligned={isAligned} holdDuration={holdDuration} stage2Debug={stage2Debug} />}
                {captureStage === 'STAGE_3_UPPER_SIDE' && !isFrozen && <UpperBodySideGhost isAligned={isAligned} holdDuration={holdDuration} stage3Debug={stage3Debug} />}
                {captureStage === 'STAGE_4_LOWER_SIDE' && !isFrozen && <LowerBodySideGhost isAligned={isAligned} holdDuration={holdDuration} stage4Debug={stage4Debug} />}

                {/* Frozen Image Overlay */}
                {isFrozen && frozenImage && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 15,
                        backgroundColor: '#000'
                    }}>
                        <img
                            src={frozenImage}
                            alt="Captured"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain', // FIXED: Show full image without cropping
                                objectPosition: 'center',
                                transform: 'scaleX(-1)',
                                margin: 'auto',
                                display: 'block'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 'clamp(32px, 8vw, 64px)',
                            color: '#00FF00',
                            fontWeight: 'bold',
                            textShadow: '0 0 30px rgba(0,255,0,0.9)',
                            animation: 'fadeInScale 0.3s ease-out'
                        }}>
                            ✅ CAPTURED!
                        </div>
                    </div>
                )}


                <style>{`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 20px rgba(0,255,0,0.5);
              transform: translateX(-50%) scale(1);
            }
            50% {
              box-shadow: 0 0 40px rgba(0,255,0,1);
              transform: translateX(-50%) scale(1.05);
            }
          }
        `}</style>
            </div>
        </div>
    );
}

export default CapturePage;
