/**
 * Stage-specific alignment validation functions
 * Extracted from CapturePage.jsx for modularity
 */

/**
 * Check alignment for Stage 1: Face capture
 * @param {Array} faceLandmarks - MediaPipe face landmarks
 * @returns {Object} { aligned: boolean, feedbackMessage: string, feedbackIcon: string }
 */
export const checkStage1Alignment = (faceLandmarks) => {
    if (!faceLandmarks) {
        return { aligned: false, feedbackMessage: 'FACE NOT DETECTED', feedbackIcon: '❌' };
    }

    // Check if nose is inside face ghost circle (centered) - TIGHTENED
    const noseTip = faceLandmarks[1];
    const isXAligned = noseTip.x >= 0.40 && noseTip.x <= 0.60; // Stricter: 0.40-0.60
    const isYAligned = noseTip.y >= 0.25 && noseTip.y <= 0.45; // Stricter: 0.25-0.45

    // Generate granular feedback
    let feedbackMsg = '';
    let feedbackIcon = '';

    if (!isXAligned) {
        if (noseTip.x < 0.35) {
            feedbackMsg = noseTip.x < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT';
        } else {
            feedbackMsg = noseTip.x > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT';
        }
        feedbackIcon = noseTip.x < 0.35 ? '⬅' : '➡️';
    } else if (!isYAligned) {
        if (noseTip.y < 0.20) {
            feedbackMsg = noseTip.y < 0.10 ? 'MOVE DOWN' : 'A BIT DOWN';
        } else {
            feedbackMsg = noseTip.y > 0.60 ? 'MOVE UP' : 'A BIT UP';
        }
        feedbackIcon = noseTip.y < 0.20 ? '⬇️' : '⬆️';
    }

    const aligned = isXAligned && isYAligned;

    return {
        aligned,
        feedbackMessage: feedbackMsg,
        feedbackIcon
    };
};

/**
 * Check alignment for Stage 2: Upper body front capture
 * @param {Array} poseLandmarks - MediaPipe pose landmarks
 * @returns {Object} { aligned: boolean, feedbackMessage: string, feedbackIcon: string, torsoCenterX: string, torsoCenterY: string }
 */
export const checkStage2Alignment = (poseLandmarks) => {
    if (!poseLandmarks) {
        return { aligned: false, feedbackMessage: 'BODY NOT DETECTED', feedbackIcon: '❌' };
    }

    // Get shoulder and hip landmarks
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];

    // Validate all landmarks exist
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
        return { aligned: false, feedbackMessage: 'SHOW FULL BODY', feedbackIcon: '⬇️' };
    }

    // Calculate shoulder center
    const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
    const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;

    // Calculate hip center
    const hipCenterX = (leftHip.x + rightHip.x) / 2;
    const hipCenterY = (leftHip.y + rightHip.y) / 2;

    // Calculate torso center (midpoint between shoulders and hips)
    const torsoCenterX = (shoulderCenterX + hipCenterX) / 2;
    const torsoCenterY = (shoulderCenterY + hipCenterY) / 2;

    // Full body alignment: centered horizontally, middle of frame vertically
    const isXAligned = torsoCenterX >= 0.42 && torsoCenterX <= 0.58;
    const isYAligned = torsoCenterY >= 0.35 && torsoCenterY <= 0.55;

    // Generate granular feedback
    let feedbackMsg = '';
    let feedbackIcon = '';

    if (!isXAligned) {
        if (torsoCenterX < 0.40) {
            feedbackMsg = torsoCenterX < 0.30 ? 'MOVE LEFT' : 'A BIT LEFT';
        } else {
            feedbackMsg = torsoCenterX > 0.70 ? 'MOVE RIGHT' : 'A BIT RIGHT';
        }
        feedbackIcon = torsoCenterX < 0.40 ? '⬅' : '➡️';
    } else if (!isYAligned) {
        // For full body capture, Y position indicates distance
        // High Y (torso low in frame) = TOO CLOSE → need to step back
        // Low Y (torso high in frame) = TOO FAR → need to come closer
        if (torsoCenterY > 0.60) {
            feedbackMsg = torsoCenterY > 0.70 ? 'STEP BACK' : 'A BIT BACK';
            feedbackIcon = '⬆️';
        } else {
            feedbackMsg = torsoCenterY < 0.25 ? 'COME CLOSER' : 'A BIT CLOSER';
            feedbackIcon = '⬇️';
        }
    }

    // Check full body landmarks (shoulders + hips + feet/ankles)
    const leftAnkle = poseLandmarks[27];
    const rightAnkle = poseLandmarks[28];
    const leftFoot = poseLandmarks[31];
    const rightFoot = poseLandmarks[32];

    const hasShoulders = !!(leftShoulder && rightShoulder);
    const hasHips = !!(leftHip && rightHip);
    const hasFeet = !!((leftFoot && rightFoot) || (leftAnkle && rightAnkle));
    const hasFullBody = hasShoulders && hasHips && hasFeet;

    // Update feedback if landmarks missing
    if (!hasFullBody) {
        if (!hasShoulders) {
            feedbackMsg = 'SHOW SHOULDERS';
            feedbackIcon = '⬆️';
        } else if (!hasHips) {
            feedbackMsg = 'SHOW HIPS';
            feedbackIcon = '⬇️';
        } else if (!hasFeet) {
            feedbackMsg = 'STEP BACK - SHOW FULL BODY';
            feedbackIcon = '⬆️';
        }
    }

    const aligned = isXAligned && isYAligned && hasFullBody;

    return {
        aligned,
        feedbackMessage: feedbackMsg,
        feedbackIcon,
        torsoCenterX: torsoCenterX.toFixed(3),
        torsoCenterY: torsoCenterY.toFixed(3)
    };
};

/**
 * Check alignment for Stage 3: Upper body side capture
 * @param {Array} poseLandmarks - MediaPipe pose landmarks
 * @returns {Object} { aligned: boolean, feedbackMessage: string, feedbackIcon: string }
 */
export const checkStage3Alignment = (poseLandmarks) => {
    if (!poseLandmarks) {
        return { aligned: false, feedbackMessage: 'BODY NOT DETECTED', feedbackIcon: '❌' };
    }

    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];

    if (!leftShoulder || !rightShoulder) {
        return { aligned: false, feedbackMessage: 'SHOULDERS NOT DETECTED', feedbackIcon: '❌' };
    }

    // Step 1: Check shoulder distance (side view detection)
    // STRICT: 80-90% side turn required
    const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
    const isSideView = shoulderDistance < 0.15; // VERY STRICT for 80-90% side profile

    // Step 2: Verify RIGHT side using Z-depth
    // For RIGHT side profile: left shoulder is CLOSER to camera (smaller z value)
    const leftShoulderZ = leftShoulder.z || 0;
    const rightShoulderZ = rightShoulder.z || 0;
    const isRightSide = leftShoulderZ < rightShoulderZ - 0.05; // STRICT for clear depth separation

    // Step 3: Calculate shoulder center for frame positioning
    const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
    const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;

    // Step 4: Check if user is centered in frame
    const isHorizontallyCentered = shoulderCenterX >= 0.40 && shoulderCenterX <= 0.60;
    const isVerticallyCentered = shoulderCenterY >= 0.30 && shoulderCenterY <= 0.50;
    const isInFrame = isHorizontallyCentered && isVerticallyCentered;

    // Debug logging
    console.log('Stage 3 Debug:', {
        shoulderDistance: shoulderDistance.toFixed(3),
        isSideView,
        leftShoulderZ: leftShoulderZ.toFixed(3),
        rightShoulderZ: rightShoulderZ.toFixed(3),
        isRightSide,
        shoulderCenterX: shoulderCenterX.toFixed(3),
        shoulderCenterY: shoulderCenterY.toFixed(3),
        isHorizontallyCentered,
        isVerticallyCentered,
        isInFrame,
        aligned: isSideView && isRightSide && isInFrame
    });

    // Generate granular feedback
    let feedbackMsg = '';
    if (!isSideView) {
        feedbackMsg = 'TURN TO YOUR RIGHT SIDE';
    } else if (!isRightSide) {
        feedbackMsg = 'TURN TO YOUR RIGHT (NOT LEFT)';
    } else if (!isHorizontallyCentered) {
        feedbackMsg = shoulderCenterX < 0.35
            ? (shoulderCenterX < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT')
            : (shoulderCenterX > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT');
    } else if (!isVerticallyCentered) {
        feedbackMsg = shoulderCenterY < 0.25
            ? (shoulderCenterY < 0.15 ? 'MOVE DOWN' : 'A BIT DOWN')
            : (shoulderCenterY > 0.65 ? 'MOVE UP' : 'A BIT UP');
    }

    return {
        aligned: isSideView && isRightSide && isInFrame,
        feedbackMessage: feedbackMsg,
        feedbackIcon: ''
    };
};

/**
 * Check alignment for Stage 4: Lower body side capture
 * @param {Array} poseLandmarks - MediaPipe pose landmarks
 * @returns {Object} Comprehensive alignment data with debug info
 */
export const checkStage4Alignment = (poseLandmarks) => {
    if (!poseLandmarks) {
        return {
            aligned: false,
            feedbackMessage: 'BODY NOT DETECTED',
            feedbackIcon: '❌'
        };
    }

    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];

    if (!leftHip || !rightHip) {
        return {
            aligned: false,
            feedbackMessage: 'HIPS NOT DETECTED',
            feedbackIcon: '❌'
        };
    }

    // ✅ CHECK 1: Hip Distance (Side View Detection)
    const hipDistance = Math.abs(leftHip.x - rightHip.x);
    const isSideView = hipDistance < 0.08; // VERY STRICT for 80-90% side profile

    // ✅ CHECK 2: Z-Depth (Right Side Verification)
    const leftHipZ = leftHip.z || 0;
    const rightHipZ = rightHip.z || 0;
    const zDepthDifference = leftHipZ - rightHipZ;
    const isRightSide = leftHipZ < rightHipZ - 0.05; // STRICT for clear depth separation

    // ✅ CHECK 3: Feet Distance (Optional Bonus Check)
    const leftAnkle = poseLandmarks[27];
    const rightAnkle = poseLandmarks[28];
    const leftFoot = poseLandmarks[31];
    const rightFoot = poseLandmarks[32];

    let feetAligned = true;
    let footDistance = null;
    let feetDetectionMethod = 'not detected';

    if (leftFoot && rightFoot) {
        footDistance = Math.abs(leftFoot.x - rightFoot.x);
        feetAligned = footDistance < 0.10; // STRICT for true side stance
        feetDetectionMethod = 'feet landmarks';
    } else if (leftAnkle && rightAnkle) {
        footDistance = Math.abs(leftAnkle.x - rightAnkle.x);
        feetAligned = footDistance < 0.10;
        feetDetectionMethod = 'ankle landmarks (fallback)';
    }

    // ✅ CHECK 4: Frame Positioning
    const hipCenterX = (leftHip.x + rightHip.x) / 2;
    const hipCenterY = (leftHip.y + rightHip.y) / 2;
    const isHorizontallyCentered = hipCenterX >= 0.35 && hipCenterX <= 0.65;
    const isVerticallyCentered = hipCenterY >= 0.30 && hipCenterY <= 0.70;
    const isInFrame = isHorizontallyCentered && isVerticallyCentered;

    // ✅ CHECK 5: Landmark Visibility (Ankles + Shoulders)
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];

    const hasShoulders = !!(leftShoulder && rightShoulder);
    const hasAnkles = !!(leftAnkle && rightAnkle);
    const hasRequiredLandmarks = hasShoulders && hasAnkles;

    // ✅ FINAL ALIGNMENT CHECK
    const aligned = isSideView && isRightSide && feetAligned && isInFrame && hasRequiredLandmarks;

    // Enhanced Feedback Messages (PRIORITY ORDER)
    let feedbackMessage = '';
    let feedbackIcon = '';

    if (!isSideView) {
        feedbackMessage = 'TURN TO YOUR RIGHT SIDE';
        feedbackIcon = '↻';
    } else if (!isRightSide) {
        feedbackMessage = 'TURN TO YOUR RIGHT (NOT LEFT)';
        feedbackIcon = '↻';
    } else if (!feetAligned && footDistance !== null) {
        feedbackMessage = 'TURN YOUR FEET SIDEWAYS TOO';
        feedbackIcon = '↻';
    } else if (!isHorizontallyCentered) {
        if (hipCenterX < 0.35) {
            feedbackMessage = hipCenterX < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT';
        } else {
            feedbackMessage = hipCenterX > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT';
        }
        feedbackIcon = hipCenterX < 0.35 ? '⬅' : '➡️';
    } else if (!isVerticallyCentered) {
        if (hipCenterY > 0.70) {
            feedbackMessage = hipCenterY > 0.80 ? 'STEP BACK' : 'A BIT BACK';
        } else {
            feedbackMessage = hipCenterY < 0.20 ? 'COME CLOSER' : 'A BIT CLOSER';
        }
        feedbackIcon = hipCenterY > 0.70 ? '⬆️' : '⬇️';
    } else {
        feedbackMessage = 'PERFECT! HOLD STILL';
        feedbackIcon = '✓';
    }

    return {
        aligned,
        feedbackMessage,
        feedbackIcon,
        hipDistance: hipDistance.toFixed(3),
        isSideView,
        leftHipZ: leftHipZ.toFixed(3),
        rightHipZ: rightHipZ.toFixed(3),
        zDepthDifference: zDepthDifference.toFixed(3),
        isRightSide,
        footDistance: footDistance ? footDistance.toFixed(3) : 'not detected',
        feetAligned,
        hipPosition: {
            x: hipCenterX.toFixed(3),
            y: hipCenterY.toFixed(3)
        },
        isInFrame
    };
};

/**
 * Main alignment checker - routes to stage-specific functions
 * @param {string} stage - Current capture stage
 * @param {Array} faceLandmarks - MediaPipe face landmarks
 * @param {Array} poseLandmarks - MediaPipe pose landmarks
 * @returns {Object} Alignment result with feedback
 */
export const checkAlignment = (stage, faceLandmarks, poseLandmarks) => {
    switch (stage) {
        case 'STAGE_1_FACE':
            return checkStage1Alignment(faceLandmarks);

        case 'STAGE_2_UPPER_FRONT':
            return checkStage2Alignment(poseLandmarks);

        case 'STAGE_3_UPPER_SIDE':
            return checkStage3Alignment(poseLandmarks);

        case 'STAGE_4_LOWER_SIDE':
            return checkStage4Alignment(poseLandmarks);

        default:
            return { aligned: false, feedbackMessage: '', feedbackIcon: '' };
    }
};
