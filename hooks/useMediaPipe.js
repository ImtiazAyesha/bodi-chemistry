/**
 * Custom hook for MediaPipe initialization and inference
 * Handles FaceLandmarker and PoseLandmarker setup and detection
 */

import { useEffect, useRef } from 'react';
import { FilesetResolver, FaceLandmarker, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import {
    calculateDistance,
    calculateAngle,
    calculateAngle3Points,
    calculateCraniovertebralAngle,
    calculateShoulderHeightAsymmetry,
    calculateFootArchBothSides,
    calculatePelvicTilt,
    formatMetric
} from '../utils/geometry';

export const useMediaPipe = (webcamRef, canvasRef, hiddenCanvasRef, captureStage, isFrozen, appStage) => {
    const faceLandmarkerRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const cameraRunningRef = useRef(false);
    const lastInferenceTimeRef = useRef(0);
    const renderLoopRef = useRef(null);

    const INFERENCE_INTERVAL_MS = 100;

    useEffect(() => {
        let animationFrameId;

        const initModelsAndCamera = async () => {
            if (!webcamRef.current || !canvasRef.current) return;

            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

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

                    // Skip inference if screen is frozen
                    if (isFrozen) {
                        return;
                    }

                    const shouldRunInference = (now - lastInferenceTimeRef.current) >= INFERENCE_INTERVAL_MS;

                    // Draw video frame on VISIBLE canvas (clean, no landmarks)
                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Draw video frame + landmarks on HIDDEN canvas (for capture)
                    const hiddenCanvas = hiddenCanvasRef.current;
                    let hiddenCtx = null;
                    if (hiddenCanvas) {
                        hiddenCtx = hiddenCanvas.getContext("2d");
                        hiddenCtx.save();
                        hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
                        hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                    }

                    if (shouldRunInference) {
                        lastInferenceTimeRef.current = now;

                        try {
                            // For Stage 4, ONLY run pose detection (no face mesh)
                            const isStage4 = captureStage === 'STAGE_4_LOWER_SIDE';

                            const faceResult = isStage4 ? null : faceLandmarkerRef.current.detectForVideo(video, now);
                            const poseResult = poseLandmarkerRef.current.detectForVideo(video, now);

                            // Draw landmarks on HIDDEN canvas for capture
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

                            // Return results for processing
                            renderLoopRef.current.onInference?.({
                                faceResult,
                                poseResult,
                                isStage4
                            });

                        } catch (e) {
                            // Silently catch MediaPipe errors (ROI dimension errors during initialization)
                            // These are expected and don't need to be logged
                        }
                    }

                    ctx.restore();
                    if (hiddenCtx) {
                        hiddenCtx.restore();
                    }
                    animationFrameId = requestAnimationFrame(renderLoop);
                };

                renderLoopRef.current = renderLoop;
                renderLoop();
            };

            startCamera();
        };

        if (appStage === 'CAPTURE') {
            initModelsAndCamera();
        }

        return () => {
            cameraRunningRef.current = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [appStage, captureStage, isFrozen]);

    return {
        faceLandmarkerRef,
        poseLandmarkerRef,
        renderLoopRef
    };
};

/**
 * Calculate face metrics from landmarks
 * @param {Array} faceLandmarks - Face landmarks array
 * @returns {Object} Face metrics
 */
export const calculateFaceMetrics = (faceLandmarks) => {
    if (!faceLandmarks || faceLandmarks.length === 0) {
        return { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0, irisWidth: 0 };
    }

    const fl = faceLandmarks;

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
    const leftNostril = fl[98];
    const rightNostril = fl[327];
    const distL = calculateDistance(noseTip, leftNostril);
    const distR = calculateDistance(noseTip, rightNostril);
    const nostrilAsym = Math.abs(distL - distR) / normFactor;

    return {
        eyeSym: formatMetric(eyeSym, 3),
        jawShift: formatMetric(jawShift, 3),
        headTilt: formatMetric(headTilt, 1),
        nostrilAsym: formatMetric(nostrilAsym, 3),
        irisWidth: irisWidth
    };
};

/**
 * Calculate body metrics from pose landmarks
 * @param {Array} poseLandmarks - Pose landmarks array
 * @returns {Object} Body metrics
 */
export const calculateBodyMetrics = (poseLandmarks) => {
    if (!poseLandmarks || poseLandmarks.length === 0) {
        return { shoulderHeight: 0, fhpAngle: 0, pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 };
    }

    const pl = poseLandmarks;

    // Shoulder Height Asymmetry
    const shoulderHeight = calculateShoulderHeightAsymmetry(pl);

    // Forward Head Posture (CVA)
    const nose = pl[0];
    const ear = pl[7];
    const leftShoulder = pl[11];
    const fhpAngle = calculateCraniovertebralAngle(nose, ear, leftShoulder);

    // Pelvic Tilt
    const pelvicTilt = calculatePelvicTilt(pl, 'side');

    // Knee Angle
    const leftHip = pl[23];
    const leftKnee = pl[25];
    const leftAnkle = pl[27];
    const kneeAngle = calculateAngle3Points(leftHip, leftKnee, leftAnkle);

    // Foot Arch Ratio
    const footArchData = calculateFootArchBothSides(pl);
    const footArchRatio = footArchData.average;

    return {
        shoulderHeight: formatMetric(shoulderHeight, 3),
        fhpAngle: formatMetric(fhpAngle, 1),
        pelvicTilt: formatMetric(pelvicTilt, 2),
        kneeAngle: formatMetric(kneeAngle, 1),
        footArchRatio: formatMetric(footArchRatio, 3)
    };
};
