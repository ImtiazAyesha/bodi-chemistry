/**
 * Custom hook for alignment checking and feedback
 * Manages alignment state and provides real-time feedback
 */

import { useState, useRef, useEffect } from 'react';
import { checkAlignment } from '../utils/alignmentChecks';

export const useAlignment = (captureStage) => {
    const [isAligned, setIsAligned] = useState(false);
    const [stage1Debug, setStage1Debug] = useState(null);
    const [stage2Debug, setStage2Debug] = useState(null);
    const [stage3Debug, setStage3Debug] = useState(null);
    const [stage4Debug, setStage4Debug] = useState(null);

    const lastAlignmentCheckRef = useRef(0);
    const ALIGNMENT_CHECK_INTERVAL = 200;

    /**
     * Check alignment for current stage
     * @param {Array} faceLandmarks - Face landmarks
     * @param {Array} poseLandmarks - Pose landmarks
     * @param {number} now - Current timestamp
     */
    const checkAlignmentForStage = (faceLandmarks, poseLandmarks, now) => {
        const shouldCheckAlignment = (now - lastAlignmentCheckRef.current) >= ALIGNMENT_CHECK_INTERVAL;

        if (!shouldCheckAlignment) {
            return;
        }

        lastAlignmentCheckRef.current = now;

        const result = checkAlignment(captureStage, faceLandmarks, poseLandmarks);

        // Update alignment state
        setIsAligned(result.aligned);

        // Update stage-specific debug info
        switch (captureStage) {
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
    };

    /**
     * Reset alignment state
     */
    const resetAlignment = () => {
        setIsAligned(false);
        lastAlignmentCheckRef.current = 0;
    };

    /**
     * Get current stage debug info
     */
    const getCurrentStageDebug = () => {
        switch (captureStage) {
            case 'STAGE_1_FACE':
                return stage1Debug;
            case 'STAGE_2_UPPER_FRONT':
                return stage2Debug;
            case 'STAGE_3_UPPER_SIDE':
                return stage3Debug;
            case 'STAGE_4_LOWER_SIDE':
                return stage4Debug;
            default:
                return null;
        }
    };

    return {
        isAligned,
        stage1Debug,
        stage2Debug,
        stage3Debug,
        stage4Debug,
        checkAlignmentForStage,
        resetAlignment,
        getCurrentStageDebug
    };
};
