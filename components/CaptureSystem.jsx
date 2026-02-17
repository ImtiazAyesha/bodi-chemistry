import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
    FilesetResolver,
    FaceLandmarker,
    PoseLandmarker,
    DrawingUtils,
} from "@mediapipe/tasks-vision";

// Utils
import { calculateDistance, calculateAngle, calculateAngle3Points, calculateCraniovertebralAngle, calculateShoulderHeightAsymmetry, calculateFootArchBothSides, calculatePelvicTilt, formatMetric } from "../utils/geometry";
import integrateAllModalities from "../utils/integratedPatternFusion";

// Navigation Components
import LandingPage from "./LandingPage";
import Questionnaire from "./Questionnaire";
import InstructionPage from "./InstructionPage";
import ProcessingScreen from "./ProcessingScreen";
import ResultsScreen from "./ResultsScreen";

// Ghost Components
import FaceGhost from "./FaceGhost";
import UpperBodyFrontGhost from "./UpperBodyFrontGhost";
import UpperBodySideGhost from "./UpperBodySideGhost";
import LowerBodySideGhost from "./LowerBodySideGhost";

/**
 * CaptureSystem - Integrated Camera & Ghost UI
 * Handles the full 4-stage flow and can be locked to a single stage for testing.
 */
function CaptureSystem({ initialStage = 'STAGE_1_FACE', lockedMode = false }) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const faceLandmarkerRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const cameraRunningRef = useRef(false);

    // Flow State
    const [appStage, setAppStage] = useState('CAPTURE');
    const [captureStage, setCaptureStage] = useState(initialStage);
    const [questionnaireData, setQuestionnaireData] = useState({ normalizedScores: { pain: 0, mobility: 0 } });

    // Capture State
    const [isAligned, setIsAligned] = useState(false);
    const [holdDuration, setHoldDuration] = useState(0);
    const alignmentTimerRef = useRef(null);
    const [isFrozen, setIsFrozen] = useState(false);
    const [frozenImage, setFrozenImage] = useState(null);
    const [showLandmarks] = useState(true);

    const [captureData, setCaptureData] = useState({
        stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } },
        stage2: { image: null, metrics: { shoulderHeight: 0 } },
        stage3: { image: null, metrics: { fhpAngle: 0 } },
        stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
    });

    const [metrics, setMetrics] = useState({
        face: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0, irisWidth: 0 },
        body: { shoulderHeight: 0, fhpAngle: 0, pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 }
    });

    const [stage1Debug, setStage1Debug] = useState(null);
    const [stage2Debug, setStage2Debug] = useState(null);
    const [stage3Debug, setStage3Debug] = useState(null);
    const [stage4Debug, setStage4Debug] = useState(null);
    const [patternResults, setPatternResults] = useState(null);

    const lastInferenceTimeRef = useRef(0);
    const lastAlignmentCheckRef = useRef(0);
    const renderLoopRef = useRef(null);
    const INFERENCE_INTERVAL_MS = 100;
    const ALIGNMENT_CHECK_INTERVAL = 200;

    const captureStageRef = useRef(captureStage);
    useEffect(() => { captureStageRef.current = captureStage; }, [captureStage]);

    // Restart loop when user navigates back to capture
    useEffect(() => {
        if (!isFrozen && renderLoopRef.current && appStage === 'CAPTURE') {
            renderLoopRef.current();
        }
    }, [isFrozen, appStage]);

    // Initialize MediaPipe
    useEffect(() => {
        let animationFrameId;
        const initModels = async () => {
            if (!webcamRef.current || !canvasRef.current) return;
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const drawingUtils = new DrawingUtils(ctx);

            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm");
            faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
                runningMode: "VIDEO", numFaces: 1,
            });
            poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task" },
                runningMode: "VIDEO", numPoses: 1,
            });

            const startCamera = async () => {
                if (cameraRunningRef.current) return;
                try {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                    cameraRunningRef.current = true;
                } catch (e) { console.error("Camera access denied", e); return; }

                const renderLoop = async () => {
                    if (!webcamRef.current || !video || video.readyState < 2 || isFrozen) {
                        animationFrameId = requestAnimationFrame(renderLoop);
                        return;
                    }

                    const now = performance.now();
                    const shouldRunInference = (now - lastInferenceTimeRef.current) >= INFERENCE_INTERVAL_MS;

                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    if (shouldRunInference) {
                        lastInferenceTimeRef.current = now;
                        try {
                            const isStage4 = captureStageRef.current === 'STAGE_4_LOWER_SIDE';
                            const faceResult = isStage4 ? null : faceLandmarkerRef.current.detectForVideo(video, now);
                            const poseResult = poseLandmarkerRef.current.detectForVideo(video, now);

                            if (faceResult?.faceLandmarks?.length > 0) {
                                const fl = faceResult.faceLandmarks[0];
                                // Landmarks visualization removed - keeping detection only
                                // if (showLandmarks) {
                                //     const landmarkColor = "#00FF00";
                                //     const connectorColor = "rgba(0, 255, 0, 0.3)";
                                //     drawingUtils.drawConnectors(fl, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: connectorColor, lineWidth: 0.1 });
                                //     drawingUtils.drawLandmarks(fl, { color: landmarkColor, radius: 1 });
                                // }
                                // Basic Face Logic (eye, jaw, tilt, nostril)
                                const irisWidth = calculateDistance(fl[468], fl[473]) || 1;
                                const tilt = calculateAngle(fl[33], fl[263]);
                                setMetrics(prev => ({ ...prev, face: { ...prev.face, headTilt: formatMetric(Math.abs(tilt), 1), irisWidth } }));

                                if ((now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL) {
                                    setIsAligned(checkAlignment(captureStageRef.current, fl, poseResult?.landmarks?.[0]));
                                    lastAlignmentCheckRef.current = now;
                                }
                            }

                            if (poseResult?.landmarks?.length > 0) {
                                const pl = poseResult.landmarks[0];
                                // Landmarks visualization removed - keeping detection only
                                // if (showLandmarks) {
                                //     const landmarkColor = "#00FF00";
                                //     const connectorColor = "rgba(0, 255, 0, 0.5)";
                                //     drawingUtils.drawConnectors(pl, PoseLandmarker.POSE_CONNECTIONS, { color: connectorColor, lineWidth: 1.5 });
                                //     drawingUtils.drawLandmarks(pl, { color: landmarkColor, radius: 2 });
                                // }
                                // Body metrics calculation logic simplified here for CaptureSystem
                                const sh = calculateShoulderHeightAsymmetry(pl);
                                const fhp = calculateCraniovertebralAngle(pl[0], pl[7], pl[11]);
                                setMetrics(prev => ({ ...prev, body: { ...prev.body, shoulderHeight: formatMetric(sh, 3), fhpAngle: formatMetric(fhp, 1) } }));

                                if (isStage4 || captureStageRef.current.includes('UPPER')) {
                                    if ((now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL) {
                                        setIsAligned(checkAlignment(captureStageRef.current, null, pl));
                                        lastAlignmentCheckRef.current = now;
                                    }
                                }
                            }
                        } catch (e) { console.warn("Inference error:", e); }
                    }
                    ctx.restore();
                    animationFrameId = requestAnimationFrame(renderLoop);
                };
                renderLoopRef.current = renderLoop;
                renderLoop();
            };
            startCamera();
        };
        if (appStage === 'CAPTURE') initModels();
        return () => { cameraRunningRef.current = false; if (animationFrameId) cancelAnimationFrame(animationFrameId); };
    }, [appStage, initialStage]);

    const checkAlignment = (stage, faceLandmarks, poseLandmarks) => {
        // Alignment thresholds - adjusted for centered face ghost
        if (stage === 'STAGE_1_FACE') {
            if (!faceLandmarks) return false;
            const nose = faceLandmarks[1];
            // Centered alignment: nose should be in the middle of the frame
            const aligned = nose.x >= 0.4 && nose.x <= 0.6 && nose.y >= 0.35 && nose.y <= 0.55;
            setStage1Debug({ aligned, feedbackMessage: aligned ? '' : (nose.x < 0.4 ? 'Move right' : nose.x > 0.6 ? 'Move left' : nose.y < 0.35 ? 'Move down' : 'Move up') });
            return aligned;
        }
        if (stage === 'STAGE_2_UPPER_FRONT') {
            if (!poseLandmarks) return false;
            const cx = (poseLandmarks[11].x + poseLandmarks[12].x) / 2;
            const aligned = cx >= 0.42 && cx <= 0.58;
            setStage2Debug({ aligned, feedbackMessage: aligned ? '' : 'Center Body' });
            return aligned;
        }
        if (stage === 'STAGE_3_UPPER_SIDE') {
            if (!poseLandmarks) return false;
            const sDist = Math.abs(poseLandmarks[11].x - poseLandmarks[12].x);
            const aligned = sDist < 0.25;
            setStage3Debug({ aligned, feedbackMessage: aligned ? '' : 'Turn Side' });
            return aligned;
        }
        if (stage === 'STAGE_4_LOWER_SIDE') {
            if (!poseLandmarks) return false;
            const hDist = Math.abs(poseLandmarks[23].x - poseLandmarks[24].x);
            const aligned = hDist < 0.12;
            setStage4Debug({ aligned, feedbackMessage: aligned ? '' : 'Turn Side' });
            return aligned;
        }
        return false;
    };

    // Countdown logic - 3 seconds total (3, 2, 1)
    useEffect(() => {
        if (isAligned && !isFrozen) {
            alignmentTimerRef.current = setInterval(() => {
                setHoldDuration(prev => {
                    const newDuration = prev + 100;
                    if (newDuration >= 3000) {
                        clearInterval(alignmentTimerRef.current);
                        handleCapture();
                        return 0;
                    }
                    return newDuration;
                });
            }, 100);
        } else {
            if (alignmentTimerRef.current) clearInterval(alignmentTimerRef.current);
            setHoldDuration(0);
        }
        return () => { if (alignmentTimerRef.current) clearInterval(alignmentTimerRef.current); };
    }, [isAligned, isFrozen]);

    const handleCapture = () => {
        const video = webcamRef.current?.video;
        if (!video) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth; tempCanvas.height = video.videoHeight;
        tempCanvas.getContext('2d').drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        const imageDataURL = tempCanvas.toDataURL('image/jpeg', 0.95);
        setIsFrozen(true); setFrozenImage(imageDataURL);

        // Store the captured image and current metrics
        if (captureStage === 'STAGE_1_FACE') {
            setCaptureData(prev => ({
                ...prev,
                stage1: { image: imageDataURL, metrics: metrics.face }
            }));
        } else if (captureStage === 'STAGE_2_UPPER_FRONT') {
            setCaptureData(prev => ({
                ...prev,
                stage2: { image: imageDataURL, metrics: { shoulderHeight: metrics.body.shoulderHeight } }
            }));
        } else if (captureStage === 'STAGE_3_UPPER_SIDE') {
            setCaptureData(prev => ({
                ...prev,
                stage3: { image: imageDataURL, metrics: { fhpAngle: metrics.body.fhpAngle } }
            }));
        } else if (captureStage === 'STAGE_4_LOWER_SIDE') {
            setCaptureData(prev => ({
                ...prev,
                stage4: { image: imageDataURL, metrics: { pelvicTilt: metrics.body.pelvicTilt, kneeAngle: metrics.body.kneeAngle, footArchRatio: metrics.body.footArchRatio } }
            }));
        }
        // No automatic progression - user must choose Retake or Continue
    };

    const handleRetake = () => {
        setIsFrozen(false);
        setFrozenImage(null);
        setIsAligned(false);
        setHoldDuration(0);
    };

    const handleContinue = () => {
        setIsFrozen(false);
        setFrozenImage(null);
        setIsAligned(false);
        setHoldDuration(0);

        if (lockedMode) return;

        if (captureStage === 'STAGE_1_FACE') setCaptureStage('STAGE_2_UPPER_FRONT');
        else if (captureStage === 'STAGE_2_UPPER_FRONT') setCaptureStage('STAGE_3_UPPER_SIDE');
        else if (captureStage === 'STAGE_3_UPPER_SIDE') setCaptureStage('STAGE_4_LOWER_SIDE');
        else {
            // Finalize analysis
            const integratedResults = integrateAllModalities(metrics.body, metrics.face, questionnaireData.normalizedScores);
            setPatternResults(integratedResults);
            setAppStage('PROCESSING');
        }
    };

    const handleRestart = () => {
        setAppStage('LANDING');
        setCaptureStage(initialStage);
        setIsAligned(false);
    };

    // Navigation Render
    if (appStage === 'LANDING') return <LandingPage onStart={() => setAppStage('QUESTIONNAIRE')} />;
    if (appStage === 'QUESTIONNAIRE') return <Questionnaire onComplete={(res) => { setQuestionnaireData(res); setAppStage('INSTRUCTIONS'); }} />;
    if (appStage === 'INSTRUCTIONS') return <InstructionPage onStart={() => setAppStage('CAPTURE')} />;
    if (appStage === 'PROCESSING') return <ProcessingScreen onComplete={() => setAppStage('RESULTS')} />;
    if (appStage === 'RESULTS') return <ResultsScreen captureData={captureData} questionnaireData={questionnaireData} patternResults={patternResults} onRestart={handleRestart} />;

    return (
        <div style={{ height: "100dvh", width: "100vw", background: "#EFE9DF", position: 'fixed', top: 0, left: 0, overflow: 'hidden' }}>
            <div style={{ position: "relative", width: '100%', height: '100%' }}>
                <Webcam ref={webcamRef} audio={false} videoConstraints={{ facingMode: "user", width: 960, height: 720 }}
                    style={{ position: "absolute", inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: "scaleX(-1)", visibility: 'hidden' }} />
                <canvas ref={canvasRef} width={960} height={720}
                    style={{ position: "absolute", inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: "scaleX(-1)", zIndex: 2 }} />

                {!isFrozen && captureStage === 'STAGE_1_FACE' && <FaceGhost isAligned={isAligned} holdDuration={holdDuration} stage1Debug={stage1Debug} />}
                {!isFrozen && captureStage === 'STAGE_2_UPPER_FRONT' && <UpperBodyFrontGhost isAligned={isAligned} holdDuration={holdDuration} stage2Debug={stage2Debug} />}
                {!isFrozen && captureStage === 'STAGE_3_UPPER_SIDE' && <UpperBodySideGhost isAligned={isAligned} holdDuration={holdDuration} stage3Debug={stage3Debug} />}
                {!isFrozen && captureStage === 'STAGE_4_LOWER_SIDE' && <LowerBodySideGhost isAligned={isAligned} holdDuration={holdDuration} stage4Debug={stage4Debug} />}

                {isFrozen && frozenImage && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
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
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)'
                                }}
                                alt="Captured"
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
                                pointerEvents: 'none'
                            }}>
                                ✓ Captured
                            </div>
                        </div>

                        {/* CTA Buttons Below Card */}
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
                    </div>
                )}
            </div>
        </div>
    );
}

export default CaptureSystem;
