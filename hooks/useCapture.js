/**
 * Custom hook for capture state management
 * Handles capture flow, validation, and state transitions
 */

import { useState, useRef } from 'react';
import { validateCapturedLandmarks } from '../utils/captureValidation';

export const useCapture = () => {
    // Capture stage state
    const [captureStage, setCaptureStage] = useState('STAGE_1_FACE');

    // Screen freeze states
    const [isFrozen, setIsFrozen] = useState(false);
    const [frozenImage, setFrozenImage] = useState(null);

    // Capture review states
    const [showReviewButtons, setShowReviewButtons] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    // Auto-capture timer states
    const [holdDuration, setHoldDuration] = useState(0);
    const alignmentTimerRef = useRef(null);

    // Capture data storage
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

    /**
     * Capture clean frame from webcam
     * @param {Object} webcamRef - Webcam reference
     * @param {Object} canvasRef - Canvas reference
     * @param {Object} hiddenCanvasRef - Hidden canvas reference
     * @returns {string} Base64 image data
     */
    const captureCleanFrame = (webcamRef, canvasRef, hiddenCanvasRef) => {
        if (!webcamRef.current || !canvasRef.current) {
            console.error('❌ Webcam or canvas not ready');
            return null;
        }

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const hiddenCanvas = hiddenCanvasRef.current;

        if (!video || video.readyState < 2) {
            console.error('❌ Video not ready');
            return null;
        }

        // Capture clean frame (no landmarks) from visible canvas
        const cleanImageData = canvas.toDataURL('image/jpeg', 0.95);

        // Also capture from hidden canvas (with landmarks) for validation
        const landmarkedImageData = hiddenCanvas ? hiddenCanvas.toDataURL('image/jpeg', 0.95) : null;

        return {
            cleanImage: cleanImageData,
            landmarkedImage: landmarkedImageData
        };
    };

    /**
     * Show flash effect on capture
     */
    const showFlashEffect = () => {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 9999;
            pointer-events: none;
            animation: flash 0.3s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(flash);

        setTimeout(() => {
            document.body.removeChild(flash);
            document.head.removeChild(style);
        }, 300);
    };

    /**
     * Validate captured landmarks
     * @param {string} stage - Current stage
     * @param {Object} hiddenCanvasRef - Hidden canvas reference
     * @returns {Object} Validation result
     */
    const validateCapture = (stage, hiddenCanvasRef) => {
        if (!hiddenCanvasRef.current) {
            return { valid: false, error: 'Canvas not available' };
        }

        return validateCapturedLandmarks(stage, hiddenCanvasRef.current);
    };

    /**
     * Handle capture action
     * @param {Object} webcamRef - Webcam reference
     * @param {Object} canvasRef - Canvas reference
     * @param {Object} hiddenCanvasRef - Hidden canvas reference
     * @param {Object} currentMetrics - Current metrics object
     */
    const handleCapture = async (webcamRef, canvasRef, hiddenCanvasRef, currentMetrics) => {
        setIsValidating(true);

        // Capture frame
        const captureResult = captureCleanFrame(webcamRef, canvasRef, hiddenCanvasRef);

        if (!captureResult) {
            setValidationError('Failed to capture image');
            setIsValidating(false);
            return;
        }

        // Show flash effect
        showFlashEffect();

        // Freeze screen
        setIsFrozen(true);
        setFrozenImage(captureResult.cleanImage);

        // Validate landmarks
        const validation = validateCapture(captureStage, hiddenCanvasRef);

        if (!validation.valid) {
            setValidationError(validation.error);
            setIsValidating(false);
            // Auto-retry after 2 seconds
            setTimeout(() => handleAutoRetry(validation.error), 2000);
            return;
        }

        // Store capture data
        const stageKey = captureStage.toLowerCase().replace(/_/g, '');
        const stageNumber = captureStage.match(/\d+/)[0];
        const stageDataKey = `stage${stageNumber}`;

        let stageMetrics = {};

        switch (captureStage) {
            case 'STAGE_1_FACE':
                stageMetrics = {
                    eyeSym: currentMetrics.face.eyeSym,
                    jawShift: currentMetrics.face.jawShift,
                    headTilt: currentMetrics.face.headTilt,
                    nostrilAsym: currentMetrics.face.nostrilAsym
                };
                break;
            case 'STAGE_2_UPPER_FRONT':
                stageMetrics = {
                    shoulderHeight: currentMetrics.body.shoulderHeight
                };
                break;
            case 'STAGE_3_UPPER_SIDE':
                stageMetrics = {
                    fhpAngle: currentMetrics.body.fhpAngle
                };
                break;
            case 'STAGE_4_LOWER_SIDE':
                stageMetrics = {
                    pelvicTilt: currentMetrics.body.pelvicTilt,
                    kneeAngle: currentMetrics.body.kneeAngle,
                    footArchRatio: currentMetrics.body.footArchRatio
                };
                break;
        }

        setCaptureData(prev => ({
            ...prev,
            [stageDataKey]: {
                image: captureResult.cleanImage,
                metrics: stageMetrics
            }
        }));

        setIsValidating(false);
        setShowReviewButtons(true);
    };

    /**
     * Handle continue to next stage
     */
    const handleContinue = () => {
        // Reset states
        setIsFrozen(false);
        setFrozenImage(null);
        setShowReviewButtons(false);
        setValidationError('');
        setHoldDuration(0);

        // Move to next stage
        const stageOrder = ['STAGE_1_FACE', 'STAGE_2_UPPER_FRONT', 'STAGE_3_UPPER_SIDE', 'STAGE_4_LOWER_SIDE'];
        const currentIndex = stageOrder.indexOf(captureStage);

        if (currentIndex < stageOrder.length - 1) {
            setCaptureStage(stageOrder[currentIndex + 1]);
        } else {
            // All stages complete - return completion signal
            return { complete: true };
        }

        return { complete: false };
    };

    /**
     * Handle retake
     */
    const handleRetake = () => {
        setIsFrozen(false);
        setFrozenImage(null);
        setShowReviewButtons(false);
        setValidationError('');
        setHoldDuration(0);
    };

    /**
     * Handle auto-retry after validation failure
     */
    const handleAutoRetry = (errorMessage) => {
        console.log('🔄 Auto-retrying capture:', errorMessage);
        handleRetake();
    };

    /**
     * Reset all capture state
     */
    const resetCapture = () => {
        setCaptureStage('STAGE_1_FACE');
        setIsFrozen(false);
        setFrozenImage(null);
        setShowReviewButtons(false);
        setValidationError('');
        setIsValidating(false);
        setHoldDuration(0);
        setCaptureData({
            stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } },
            stage2: { image: null, metrics: { shoulderHeight: 0 } },
            stage3: { image: null, metrics: { fhpAngle: 0 } },
            stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
        });
    };

    return {
        // State
        captureStage,
        isFrozen,
        frozenImage,
        showReviewButtons,
        validationError,
        isValidating,
        holdDuration,
        captureData,
        metrics,

        // Setters
        setCaptureStage,
        setHoldDuration,
        setMetrics,

        // Actions
        handleCapture,
        handleContinue,
        handleRetake,
        handleAutoRetry,
        resetCapture,

        // Refs
        alignmentTimerRef
    };
};
