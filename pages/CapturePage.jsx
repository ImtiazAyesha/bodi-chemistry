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
import { integrateAllModalities } from "../utils/integratedPatternFusion"; // Adjusted path

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
    const hiddenCanvasRef = useRef( null ); // Hidden canvas for landmark rendering

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
    const [holdDuration, setHoldDuration] = useState(0); // 0 to 3000ms
    const alignmentTimerRef = useRef(null);

    // Screen freeze states
    const [isFrozen, setIsFrozen] = useState(false);
    const [frozenImage, setFrozenImage] = useState(null);

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

    // Questionnaire Data (loaded from sessionStorage)
    const [ questionnaireData, setQuestionnaireData ] = useState( null );

    // Load questionnaire data from sessionStorage on mount
    useEffect( () => {
        const storedData = sessionStorage.getItem( 'questionnaireData' );
        if ( storedData ) {
            try {
                const parsed = JSON.parse( storedData );
                setQuestionnaireData( parsed );
                console.log( '✅ Loaded questionnaire data from sessionStorage:', parsed );
            } catch ( error ) {
                console.error( '❌ Failed to parse questionnaire data:', error );
            }
        } else {
            console.warn( '⚠️ No questionnaire data found in sessionStorage' );
        }
    }, [] );

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

                    // Draw video frame on VISIBLE canvas (clean, no landmarks)
                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Draw video frame + landmarks on HIDDEN canvas (for capture)
                    const hiddenCanvas = hiddenCanvasRef.current;
                    let hiddenCtx = null;
                    if ( hiddenCanvas ) {
                        hiddenCtx = hiddenCanvas.getContext( "2d" );
                        hiddenCtx.save();
                        hiddenCtx.clearRect( 0, 0, hiddenCanvas.width, hiddenCanvas.height );
                        hiddenCtx.drawImage( video, 0, 0, hiddenCanvas.width, hiddenCanvas.height );
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

                            // ✅ CRITICAL: Draw landmarks on HIDDEN canvas for capture
                            // This ensures captured images have visible landmarks for analysis
                            if ( hiddenCtx ) {
                                const drawingUtils = new DrawingUtils( hiddenCtx );

                                // DEBUG: Log for Stage 4
                                if ( isStage4 ) {
                                    console.log( '%c🔍 STAGE 4 DEBUG - Hidden Canvas Drawing:', 'color: #FF6B6B; font-weight: bold' );
                                    console.log( '   hiddenCtx exists:', !!hiddenCtx );
                                    console.log( '   poseResult:', poseResult );
                                    console.log( '   poseResult.landmarks:', poseResult?.landmarks );
                                    console.log( '   landmarks length:', poseResult?.landmarks?.length );
                                    if ( poseResult?.landmarks?.length > 0 ) {
                                        console.log( '   ✅ LANDMARKS DETECTED - Drawing on hidden canvas' );
                                    } else {
                                        console.log( '   ❌ NO LANDMARKS - Hidden canvas will be blank!' );
                                    }
                                }

                                // Draw face landmarks (Stages 1-3)
                                if ( !isStage4 && faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0 ) {
                                    const fl = faceResult.faceLandmarks[ 0 ];
                                    drawingUtils.drawConnectors( fl, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "rgba(47, 74, 92, 0.2)", lineWidth: 0.1 } );
                                    drawingUtils.drawLandmarks( fl, { color: "#8FA99B", radius: 1 } );
                                }

                                // Draw pose landmarks (All stages)
                                if ( poseResult.landmarks && poseResult.landmarks.length > 0 ) {
                                    const pl = poseResult.landmarks[ 0 ];
                                    drawingUtils.drawConnectors( pl, PoseLandmarker.POSE_CONNECTIONS, { color: "rgba(111, 143, 132, 0.4)", lineWidth: 1.5 } );
                                    drawingUtils.drawLandmarks( pl, { color: "#2F4A5C", radius: 2 } );

                                    // DEBUG: Confirm drawing for Stage 4
                                    if ( isStage4 ) {
                                        console.log( '%c   ✅ DREW LANDMARKS ON HIDDEN CANVAS', 'color: #10B981; font-weight: bold' );
                                    }
                                } else if ( isStage4 ) {
                                    console.log( '%c   ❌ SKIPPED DRAWING - No landmarks detected', 'color: #EF4444; font-weight: bold' );
                                }
                            }

                        } catch (e) {
                            console.warn("Inference error:", e);
                        }
                    }

                    ctx.restore();
                    if ( hiddenCtx ) {
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

                // Note: We don't strictly require landmarks here to avoid flickering
                // Landmarks are drawn on hidden canvas when available
                const aligned1 = isXAligned1 && isYAligned1;

                setStage1Debug({
                    aligned: aligned1,
                    feedbackMessage: feedbackMsg1,
                    feedbackIcon: feedbackIcon1
                });

                return aligned1;

            case 'STAGE_2_UPPER_FRONT':
                // FULL BODY FRONT CAPTURE - Use torso center for alignment
                if (!poseLandmarks) return false;

                // Get shoulder and hip landmarks
                const leftShoulder = poseLandmarks[11];
                const rightShoulder = poseLandmarks[12];
                const leftHip = poseLandmarks[ 23 ];
                const rightHip = poseLandmarks[ 24 ];

                // Validate all landmarks exist
                if ( !leftShoulder || !rightShoulder || !leftHip || !rightHip ) return false;

                // Calculate shoulder center
                const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
                const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;

                // Calculate hip center
                const hipCenterX = ( leftHip.x + rightHip.x ) / 2;
                const hipCenterY = ( leftHip.y + rightHip.y ) / 2;

                // Calculate torso center (midpoint between shoulders and hips)
                const torsoCenterX = ( shoulderCenterX + hipCenterX ) / 2;
                const torsoCenterY = ( shoulderCenterY + hipCenterY ) / 2;

                // Full body alignment: centered horizontally, middle of frame vertically
                const isXAligned2 = torsoCenterX >= 0.42 && torsoCenterX <= 0.58;
                const isYAligned2 = torsoCenterY >= 0.35 && torsoCenterY <= 0.55; // Lower than shoulder-only (was 0.30-0.50)

                // Generate granular feedback for Stage 2 (full body)
                let feedbackMsg2 = '';
                let feedbackIcon2 = '';

                if (!isXAligned2) {
                    if ( torsoCenterX < 0.40 ) {
                        feedbackMsg2 = torsoCenterX < 0.30 ? 'MOVE LEFT' : 'A BIT LEFT';
                    } else {
                        feedbackMsg2 = torsoCenterX > 0.70 ? 'MOVE RIGHT' : 'A BIT RIGHT';
                    }
                    feedbackIcon2 = torsoCenterX < 0.40 ? '⬅' : '➡️';
                } else if (!isYAligned2) {
                    // For full body, use distance-based feedback instead of up/down
                    if ( torsoCenterY < 0.30 ) {
                        feedbackMsg2 = torsoCenterY < 0.20 ? 'STEP BACK' : 'A BIT BACK';
                    } else {
                        feedbackMsg2 = torsoCenterY > 0.60 ? 'COME CLOSER' : 'A BIT CLOSER';
                    }
                    feedbackIcon2 = torsoCenterY < 0.30 ? '⬆️' : '⬇️';
                }

                // Note: We don't strictly require landmarks here to avoid flickering
                // Landmarks are drawn on hidden canvas when available
                const aligned2 = isXAligned2 && isYAligned2;

                setStage2Debug({
                    aligned: aligned2,
                    feedbackMessage: feedbackMsg2,
                    feedbackIcon: feedbackIcon2,
                    torsoCenterX: torsoCenterX.toFixed( 3 ),
                    torsoCenterY: torsoCenterY.toFixed( 3 )
                });

                return aligned2;

            case 'STAGE_3_UPPER_SIDE':
                // RIGHT SIDE PROFILE DETECTION - Fixed to reject left side and partial turns
                if (!poseLandmarks) {
                    console.log('Stage 3 Debug: No pose landmarks detected');
                    return false;
                }
                const leftShoulder3 = poseLandmarks[11];
                const rightShoulder3 = poseLandmarks[12];

                if ( !leftShoulder3 || !rightShoulder3 ) {
                    console.log( 'Stage 3 Debug: Shoulders not detected' );
                    return false;
                }

                // Step 1: Check shoulder distance (side view detection)
                const shoulderDistance = Math.abs(leftShoulder3.x - rightShoulder3.x);
                const isSideView = shoulderDistance < 0.25; // STRICTER: 0.25 (was 0.35) to reject partial turns

                // Step 2: CRITICAL FIX - Verify RIGHT side using Z-depth
                // For RIGHT side profile: left shoulder is CLOSER to camera (smaller z value)
                const leftShoulderZ = leftShoulder3.z || 0;
                const rightShoulderZ = rightShoulder3.z || 0;
                const isRightSide = leftShoulderZ < rightShoulderZ - 0.02; // Left shoulder must be at least 0.02 closer

                // Step 3: Calculate shoulder center for frame positioning
                const shoulderCenterX3 = (leftShoulder3.x + rightShoulder3.x) / 2;
                const shoulderCenterY3 = (leftShoulder3.y + rightShoulder3.y) / 2;

                // Step 4: Check if user is centered in frame

                // User must be reasonably centered horizontally and vertically - STRICTER
                const isHorizontallyCentered = shoulderCenterX3 >= 0.40 && shoulderCenterX3 <= 0.60; // Stricter: 0.40-0.60 (was 0.35-0.65)
                const isVerticallyCentered = shoulderCenterY3 >= 0.30 && shoulderCenterY3 <= 0.50; // Stricter: 0.30-0.50 (was 0.25-0.55)
                const isInFrame = isHorizontallyCentered && isVerticallyCentered;

                // Debug logging with all checks
                console.log('Stage 3 Debug:', {
                    shoulderDistance: shoulderDistance.toFixed(3),
                    isSideView,
                    leftShoulderZ: leftShoulderZ.toFixed( 3 ),
                    rightShoulderZ: rightShoulderZ.toFixed( 3 ),
                    isRightSide,
                    shoulderCenterX: shoulderCenterX3.toFixed(3),
                    shoulderCenterY: shoulderCenterY3.toFixed(3),
                    isHorizontallyCentered,
                    isVerticallyCentered,
                    isInFrame,
                    aligned: isSideView && isRightSide && isInFrame
                });

                // EXPLICIT CHECK - Print why alignment is failing
                if ( !isSideView ) console.warn( '❌ STAGE 3: Not in side view! shoulderDistance =', shoulderDistance );
                if ( !isRightSide ) console.warn( '❌ STAGE 3: Not right side! leftZ =', leftShoulderZ, 'rightZ =', rightShoulderZ );
                if ( !isInFrame ) console.warn( '❌ STAGE 3: Not in frame! isHorizontallyCentered =', isHorizontallyCentered, 'isVerticallyCentered =', isVerticallyCentered );

                // Generate granular feedback for Stage 3
                let feedbackMsg3 = '';
                if (!isSideView) {
                    feedbackMsg3 = 'TURN TO YOUR RIGHT SIDE';
                } else if ( !isRightSide ) {
                    feedbackMsg3 = 'TURN TO YOUR RIGHT (NOT LEFT)';
                } else if (!isHorizontallyCentered) {
                    feedbackMsg3 = shoulderCenterX3 < 0.35 ? (shoulderCenterX3 < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT') : (shoulderCenterX3 > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT');
                } else if (!isVerticallyCentered) {
                    feedbackMsg3 = shoulderCenterY3 < 0.25 ? (shoulderCenterY3 < 0.15 ? 'MOVE DOWN' : 'A BIT DOWN') : (shoulderCenterY3 > 0.65 ? 'MOVE UP' : 'A BIT UP');
                }
                // Note: We don't strictly require landmarks here to avoid flickering
                // Landmarks are drawn on hidden canvas when available
                const aligned3 = isSideView && isRightSide && isInFrame;

                setStage3Debug( {
                    aligned: aligned3,
                    feedbackMessage: feedbackMsg3,
                    feedbackIcon: ''
                } );

                // FIXED: Check shoulder distance AND right side direction AND frame position
                return aligned3;

            case 'STAGE_4_LOWER_SIDE':
                // FIXED: Comprehensive side detection with Z-depth + feet verification
                console.log( '%c========== STAGE 4: LOWER BODY SIDE ==========', 'color: #9333EA; font-weight: bold; font-size: 14px' );

                if (!poseLandmarks) {
                    console.log( '%c❌ No pose landmarks detected', 'color: #EF4444' );
                    return false;
                }

                const leftHip4 = poseLandmarks[23];
                const rightHip4 = poseLandmarks[24];

                // Check if hips are detected
                if (!leftHip4 || !rightHip4) {
                    console.log( '%c❌ Hip landmarks not detected', 'color: #EF4444' );
                    console.log( '   Left Hip (#23):', leftHip4 ? '✅ Detected' : '❌ Missing' );
                    console.log( '   Right Hip (#24):', rightHip4 ? '✅ Detected' : '❌ Missing' );
                    return false;
                }

                console.log( '%c📍 Hip Landmarks Detected:', 'color: #10B981; font-weight: bold' );
                console.log( '   Left Hip (#23):', { x: leftHip4.x.toFixed( 3 ), y: leftHip4.y.toFixed( 3 ), z: ( leftHip4.z || 0 ).toFixed( 3 ) } );
                console.log( '   Right Hip (#24):', { x: rightHip4.x.toFixed( 3 ), y: rightHip4.y.toFixed( 3 ), z: ( rightHip4.z || 0 ).toFixed( 3 ) } );

                // ✅ CHECK 1: Hip Distance (Side View Detection) - STRICTER
                const hipDistance4 = Math.abs(leftHip4.x - rightHip4.x);
                const isSideView4 = hipDistance4 < 0.10;  // STRICTER: 0.10 (was 0.12)

                console.log( '%c\n✅ CHECK 1: Hip Distance (Side View Detection)', 'color: #3B82F6; font-weight: bold' );
                console.log( '   Hip Distance:', hipDistance4.toFixed( 3 ), '(threshold: < 0.10 - STRICTER)' );
                console.log( '   Is Side View?', isSideView4 ? '✅ YES' : '❌ NO' );
                if ( !isSideView4 ) {
                    console.log( '   ⚠️ Hips too far apart - user likely facing camera or at an angle' );
                }

                // ✅ CHECK 2: Z-Depth (Right Side Verification) - STRICTER!
                const leftHipZ = leftHip4.z || 0;
                const rightHipZ = rightHip4.z || 0;
                const zDepthDifference = leftHipZ - rightHipZ;
                const isRightSide4 = leftHipZ < rightHipZ - 0.05;  // STRICTER: -0.05 (was -0.02)

                console.log( '%c\n✅ CHECK 2: Z-Depth (Right Side Verification)', 'color: #3B82F6; font-weight: bold' );
                console.log( '   Left Hip Z:', leftHipZ.toFixed( 3 ), '(closer to camera = more negative)' );
                console.log( '   Right Hip Z:', rightHipZ.toFixed( 3 ) );
                console.log( '   Z-Depth Difference:', zDepthDifference.toFixed( 3 ), '(threshold: < -0.05 - STRICTER)' );
                console.log( '   Is Right Side?', isRightSide4 ? '✅ YES' : '❌ NO' );
                if ( !isRightSide4 ) {
                    if ( Math.abs( zDepthDifference ) < 0.05 ) {  // STRICTER: 0.05 (was 0.02)
                        console.log( '   ⚠️ Both hips at same depth - user likely facing camera (FRONT VIEW)' );
                    } else if ( zDepthDifference > 0 ) {
                        console.log( '   ⚠️ Right hip closer than left - user turned to LEFT side (wrong direction)' );
                    }
                }

                // ✅ CHECK 3: Feet Distance (Optional Bonus Check)
                const leftAnkle4 = poseLandmarks[27];
                const rightAnkle4 = poseLandmarks[28];
                const leftFoot4 = poseLandmarks[31];
                const rightFoot4 = poseLandmarks[32];

                let feetAligned = true;  // Default to true (don't block if feet not detected)
                let footDistance4 = null;
                let feetDetectionMethod = 'not detected';

                if ( leftFoot4 && rightFoot4 ) {
                    footDistance4 = Math.abs( leftFoot4.x - rightFoot4.x );
                    feetAligned = footDistance4 < 0.12;  // STRICTER: 0.12 (was 0.15)
                    feetDetectionMethod = 'feet landmarks';
                } else if ( leftAnkle4 && rightAnkle4 ) {
                    // Fallback to ankles if feet not detected
                    footDistance4 = Math.abs( leftAnkle4.x - rightAnkle4.x );
                    feetAligned = footDistance4 < 0.12;  // STRICTER: 0.12 (was 0.15)
                    feetDetectionMethod = 'ankle landmarks (fallback)';
                }

                console.log( '%c\n✅ CHECK 3: Feet Distance (Optional Bonus Check)', 'color: #3B82F6; font-weight: bold' );
                console.log( '   Detection Method:', feetDetectionMethod );
                if ( footDistance4 !== null ) {
                    console.log( '   Foot Distance:', footDistance4.toFixed( 3 ), '(threshold: < 0.12 - STRICTER)' );
                    console.log( '   Feet Aligned?', feetAligned ? '✅ YES' : '❌ NO' );
                    if ( !feetAligned ) {
                        console.log( '   ⚠️ Feet too far apart - likely pointing forward instead of sideways' );
                    }
                } else {
                    console.log( '   ℹ️ Feet/ankles not detected - skipping this check (won\'t block alignment)' );
                }

                // ✅ CHECK 4: Frame Positioning
                const hipCenterX4 = ( leftHip4.x + rightHip4.x ) / 2;
                const hipCenterY4 = ( leftHip4.y + rightHip4.y ) / 2;
                const isHorizontallyCentered4 = hipCenterX4 >= 0.35 && hipCenterX4 <= 0.65;
                const isVerticallyCentered4 = hipCenterY4 >= 0.30 && hipCenterY4 <= 0.70;
                const isInFrame4 = isHorizontallyCentered4 && isVerticallyCentered4;

                console.log( '%c\n✅ CHECK 4: Frame Positioning', 'color: #3B82F6; font-weight: bold' );
                console.log( '   Hip Center X:', hipCenterX4.toFixed( 3 ), '(range: 0.35 - 0.65)' );
                console.log( '   Hip Center Y:', hipCenterY4.toFixed( 3 ), '(range: 0.30 - 0.70)' );
                console.log( '   Horizontally Centered?', isHorizontallyCentered4 ? '✅ YES' : '❌ NO' );
                console.log( '   Vertically Centered?', isVerticallyCentered4 ? '✅ YES' : '❌ NO' );
                console.log( '   In Frame?', isInFrame4 ? '✅ YES' : '❌ NO' );
                if ( !isInFrame4 ) {
                    if ( !isHorizontallyCentered4 ) {
                        console.log( '   ⚠️ User needs to move', hipCenterX4 < 0.35 ? 'LEFT' : 'RIGHT' );
                    }
                    if ( !isVerticallyCentered4 ) {
                        console.log( '   ⚠️ User needs to', hipCenterY4 < 0.30 ? 'COME CLOSER' : 'STEP BACK' );
                    }
                }

                // ✅ FINAL ALIGNMENT CHECK (All conditions must pass)
                // CRITICAL: Also check that pose landmarks are detected (for landmark visibility in captured image)
                const hasValidLandmarks = poseLandmarks && poseLandmarks.length > 0;
                const aligned = isSideView4 && isRightSide4 && feetAligned && isInFrame4 && hasValidLandmarks;

                console.log( '%c\n🎯 FINAL ALIGNMENT RESULT:', 'color: #F59E0B; font-weight: bold; font-size: 13px' );
                console.log( '   ✓ Side View:', isSideView4 ? '✅ PASS' : '❌ FAIL', `(hip distance: ${ hipDistance4.toFixed( 3 ) } < 0.10)` );
                console.log( '   ✓ Right Side:', isRightSide4 ? '✅ PASS' : '❌ FAIL', `(Z-depth: ${ zDepthDifference.toFixed( 3 ) } < -0.05)` );
                console.log( '   ✓ Feet Aligned:', feetAligned ? '✅ PASS' : '❌ FAIL', footDistance4 !== null ? `(foot distance: ${ footDistance4.toFixed( 3 ) } < 0.12)` : '(not detected)' );
                console.log( '   ✓ In Frame:', isInFrame4 ? '✅ PASS' : '❌ FAIL', `(X: ${ hipCenterX4.toFixed( 3 ) }, Y: ${ hipCenterY4.toFixed( 3 ) })` );
                console.log( '   ✓ Landmarks Detected:', hasValidLandmarks ? '✅ PASS' : '❌ FAIL', '(required for visible analysis)' );
                console.log( '%c   → ALIGNED: ' + ( aligned ? '✅ YES - COUNTDOWN STARTING!' : '❌ NO - ADJUST POSITION' ), aligned ? 'color: #10B981; font-weight: bold' : 'color: #EF4444; font-weight: bold' );

                // Add distance warning
                if ( !aligned && isSideView4 && !isRightSide4 && Math.abs( zDepthDifference ) < 0.05 ) {
                    console.log( '%c   ⚠️ WARNING: You might be TOO FAR from camera!', 'color: #F59E0B; font-weight: bold' );
                    console.log( '      Hip distance looks like side view, but Z-depth says front-facing.' );
                    console.log( '      This happens when you\'re far away - hips appear close but you\'re actually facing front.' );
                }

                // Add landmark warning
                if ( !aligned && !hasValidLandmarks ) {
                    console.log( '%c   ⚠️ WARNING: No pose landmarks detected!', 'color: #EF4444; font-weight: bold' );
                    console.log( '      Cannot capture without landmarks - they are needed for analysis visualization.' );
                    console.log( '      Make sure your full body is visible in the frame.' );
                }

                // Enhanced Feedback Messages (PRIORITY ORDER)
                let feedbackMessage = '';
                let feedbackIcon = '';

                if ( !isSideView4 ) {
                    feedbackMessage = 'TURN TO YOUR RIGHT SIDE';
                    feedbackIcon = '↻';
                } else if ( !isRightSide4 ) {
                    feedbackMessage = 'TURN TO YOUR RIGHT (NOT LEFT)';
                    feedbackIcon = '↻';
                } else if ( !feetAligned && footDistance4 !== null ) {
                    feedbackMessage = 'TURN YOUR FEET SIDEWAYS TOO';
                    feedbackIcon = '↻';
                } else if ( !isHorizontallyCentered4 ) {
                    if ( hipCenterX4 < 0.35 ) {
                        feedbackMessage = hipCenterX4 < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT';
                    } else {
                        feedbackMessage = hipCenterX4 > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT';
                    }
                    feedbackIcon = hipCenterX4 < 0.35 ? '⬅' : '➡️';
                } else if ( !isVerticallyCentered4 ) {
                    if ( hipCenterY4 > 0.70 ) {
                        feedbackMessage = hipCenterY4 > 0.80 ? 'STEP BACK' : 'A BIT BACK';
                    } else {
                        feedbackMessage = hipCenterY4 < 0.20 ? 'COME CLOSER' : 'A BIT CLOSER';
                    }
                    feedbackIcon = hipCenterY4 > 0.70 ? '⬆️' : '⬇️';
                } else {
                    feedbackMessage = 'PERFECT! HOLD STILL';
                    feedbackIcon = '✓';
                }

                console.log( '%c\n💬 User Feedback:', 'color: #8B5CF6; font-weight: bold' );
                console.log( '   Message:', feedbackMessage );
                console.log( '   Icon:', feedbackIcon );

                // Comprehensive Debug Info
                const debugInfo4 = {
                    hipDistance: hipDistance4.toFixed(3),
                    isSideView: isSideView4,
                    leftHipZ: leftHipZ.toFixed( 3 ),
                    rightHipZ: rightHipZ.toFixed( 3 ),
                    zDepthDifference: zDepthDifference.toFixed( 3 ),
                    isRightSide: isRightSide4,
                    footDistance: footDistance4 ? footDistance4.toFixed( 3 ) : 'not detected',
                    feetAligned: feetAligned,
                    hipPosition: {
                        x: hipCenterX4.toFixed(3),
                        y: hipCenterY4.toFixed(3)
                    },
                    isInFrame: isInFrame4,
                    aligned: aligned,
                    feedbackMessage: feedbackMessage,
                    feedbackIcon: feedbackIcon
                };

                console.log( '%c========================================\n', 'color: #9333EA' );

                // Store debug info for on-screen display
                setStage4Debug(debugInfo4);

                // FIXED: Check side view AND right side direction AND feet alignment AND frame position
                return aligned;

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

    // Helper function to capture frame WITH landmarks from hidden canvas
    const captureCleanFrame = () => {
        // Use HIDDEN canvas which has landmarks rendered
        const canvas = hiddenCanvasRef.current;
        if ( !canvas ) {
            console.error( '❌ Hidden canvas not available for capture' );
            return null;
        }

        // Log capture dimensions for debugging
        console.log( `✅ Captured image with landmarks: ${ canvas.width }×${ canvas.height }px` );

        // Show flash effect
        showFlashEffect();

        // Return image data URL with landmarks from hidden canvas
        return canvas.toDataURL( 'image/jpeg', 0.95 );
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

        // Capture frame WITH landmarks from hidden canvas
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
                        zIndex: 2
                    }}
                />

                {/* Hidden canvas for landmark rendering (not visible to user) */ }
                <canvas
                    ref={ hiddenCanvasRef }
                    width={ 960 }
                    height={ 720 }
                    style={ { display: 'none' } }
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
                        zIndex: 20,
                        backgroundColor: '#EFE9DF'
                    }}>
                        <img
                            src={frozenImage}
                            alt="Captured"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // FIXED: Cover entire screen to match live view
                                objectPosition: 'center',
                                transform: 'scaleX(-1)',
                                display: 'block'
                            }}
                        />

                        {/* Overlay Gradient for contrast */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at 50% 50%, rgba(239, 233, 223, 0.2) 0%, rgba(47, 74, 92, 0.4) 100%)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 'clamp(32px, 8vw, 64px)',
                            color: '#8FA99B',
                            fontWeight: '900',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            textShadow: '0 0 40px rgba(143,169,155,0.6)',
                            animation: 'fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            textAlign: 'center',
                            width: '100%',
                            padding: '0 20px'
                        }}>
                            ✓ Captured
                        </div>
                    </div>
                )}


                <style>{`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.85);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 20px rgba(143,169,155,0.4);
              transform: translateX(-50%) scale(1);
            }
            50% {
              box-shadow: 0 0 40px rgba(143,169,155,0.8);
              transform: translateX(-50%) scale(1.02);
            }
          }
        `}</style>
            </div>
        </div>
    );
}

export default CapturePage;