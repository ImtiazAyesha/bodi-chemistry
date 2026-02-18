const isVisible = (lm) => {
    if (!lm) return false;
    const inFrame = lm.x >= 0 && lm.x <= 1 && lm.y >= 0 && lm.y <= 1;
    const confident = lm.visibility === undefined || lm.visibility > 0.4;
    return inFrame && confident;
};

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

    // ── Required landmarks for Stage 2: Upper Body Front ──────────────────
    // Must be VISIBLY IN-FRAME: head, shoulders, hips, knees, ankles/feet.
    // Arms and hands are intentionally NOT required.
    const nose = poseLandmarks[0];
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];
    const leftKnee = poseLandmarks[25];
    const rightKnee = poseLandmarks[26];
    const leftAnkle = poseLandmarks[27];
    const rightAnkle = poseLandmarks[28];
    const leftFoot = poseLandmarks[31];
    const rightFoot = poseLandmarks[32];

    // Use isVisible() — NOT a simple null check — because MediaPipe always
    // returns a landmark object even for off-screen body parts. The coords
    // just go outside 0–1. isVisible() catches that.
    const hasHead = isVisible(nose);
    const hasShoulders = isVisible(leftShoulder) && isVisible(rightShoulder);
    const hasHips = isVisible(leftHip) && isVisible(rightHip);
    const hasKnees = isVisible(leftKnee) && isVisible(rightKnee);
    // Accept either foot index OR ankle as the foot landmark
    const hasFeet = (isVisible(leftFoot) && isVisible(rightFoot))
        || (isVisible(leftAnkle) && isVisible(rightAnkle));

    const hasFullBody = hasHead && hasShoulders && hasHips && hasKnees && hasFeet;

    // ── Torso-centre positioning ───────────────────────────────────────────
    // Only meaningful when shoulders + hips are detected
    const shoulderCenterX = hasShoulders ? (leftShoulder.x + rightShoulder.x) / 2 : 0.5;
    const shoulderCenterY = hasShoulders ? (leftShoulder.y + rightShoulder.y) / 2 : 0.5;
    const hipCenterX = hasHips ? (leftHip.x + rightHip.x) / 2 : 0.5;
    const hipCenterY = hasHips ? (leftHip.y + rightHip.y) / 2 : 0.5;
    const torsoCenterX = (shoulderCenterX + hipCenterX) / 2;
    const torsoCenterY = (shoulderCenterY + hipCenterY) / 2;

    const isXAligned = torsoCenterX >= 0.42 && torsoCenterX <= 0.58;
    const isYAligned = torsoCenterY >= 0.35 && torsoCenterY <= 0.55;

    // ── Feedback (priority: missing landmarks first, then positioning) ─────
    let feedbackMsg = '';
    let feedbackIcon = '';

    if (!hasHead) {
        feedbackMsg = 'SHOW YOUR HEAD';
        feedbackIcon = '⬆️';
    } else if (!hasShoulders) {
        feedbackMsg = 'SHOW YOUR SHOULDERS';
        feedbackIcon = '⬆️';
    } else if (!hasHips) {
        feedbackMsg = 'SHOW YOUR HIPS';
        feedbackIcon = '⬇️';
    } else if (!hasKnees) {
        feedbackMsg = 'SHOW YOUR KNEES';
        feedbackIcon = '⬇️';
    } else if (!hasFeet) {
        feedbackMsg = 'STEP BACK - SHOW FULL LEGS';
        feedbackIcon = '⬆️';
    } else if (!isXAligned) {
        if (torsoCenterX < 0.42) {
            feedbackMsg = torsoCenterX < 0.30 ? 'MOVE LEFT' : 'A BIT LEFT';
            feedbackIcon = '⬅';
        } else {
            feedbackMsg = torsoCenterX > 0.70 ? 'MOVE RIGHT' : 'A BIT RIGHT';
            feedbackIcon = '➡️';
        }
    } else if (!isYAligned) {
        if (torsoCenterY > 0.55) {
            feedbackMsg = torsoCenterY > 0.70 ? 'STEP BACK' : 'A BIT BACK';
            feedbackIcon = '⬆️';
        } else {
            feedbackMsg = torsoCenterY < 0.25 ? 'COME CLOSER' : 'A BIT CLOSER';
            feedbackIcon = '⬇️';
        }
    }

    const aligned = hasFullBody && isXAligned && isYAligned;

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

    // ── Required landmarks for Stage 4: Lower Body Side ───────────────────
    // Must be VISIBLY IN-FRAME: head, hip, knee, ankle/foot.
    // Arms and hands are intentionally NOT required.
    const nose = poseLandmarks[0];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];
    const leftKnee = poseLandmarks[25];
    const rightKnee = poseLandmarks[26];
    const leftAnkle = poseLandmarks[27];
    const rightAnkle = poseLandmarks[28];
    const leftFoot = poseLandmarks[31];
    const rightFoot = poseLandmarks[32];

    // Use isVisible() — NOT a simple null check — because MediaPipe always
    // returns a landmark object even for off-screen body parts.
    const hasHead = isVisible(nose);
    const hasHips = isVisible(leftHip) && isVisible(rightHip);

    // In a side view only one knee may be clearly visible; require at least one.
    // Also require the knee to be in the lower half of the frame (y > 0.45) so
    // MediaPipe's off-screen extrapolation can't fake it.
    const isKneeInFrame = (lm) => isVisible(lm) && lm.y > 0.45;
    const hasKnee = isKneeInFrame(leftKnee) || isKneeInFrame(rightKnee);

    // For the ankle/foot we apply an even stricter Y threshold (y > 0.65 = lower
    // third of the frame). MediaPipe extrapolates landmarks outside the frame and
    // those coords can still fall within 0–1 near the edge. Requiring y > 0.65
    // ensures the foot is genuinely visible near the bottom of the camera view.
    const isAnkleInFrame = (lm) => isVisible(lm) && lm.y > 0.65;
    const hasFeet = isAnkleInFrame(leftFoot) || isAnkleInFrame(rightFoot)
        || isAnkleInFrame(leftAnkle) || isAnkleInFrame(rightAnkle);

    const hasRequiredLandmarks = hasHead && hasHips && hasKnee && hasFeet;

    // We still need both hips to compute side-view metrics
    if (!isVisible(leftHip) || !isVisible(rightHip)) {
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
    const isRightSide = leftHipZ < rightHipZ - 0.05;

    // ✅ CHECK 3: Feet side-alignment (both feet should be roughly at same X).
    // Default to FALSE (not true) so the check is never silently skipped when
    // only one foot is partially detected.
    let feetAligned = false;
    let footDistance = null;
    let feetDetectionMethod = 'not detected';

    if (isAnkleInFrame(leftFoot) && isAnkleInFrame(rightFoot)) {
        footDistance = Math.abs(leftFoot.x - rightFoot.x);
        feetAligned = footDistance < 0.10;
        feetDetectionMethod = 'feet landmarks';
    } else if (isAnkleInFrame(leftAnkle) && isAnkleInFrame(rightAnkle)) {
        footDistance = Math.abs(leftAnkle.x - rightAnkle.x);
        feetAligned = footDistance < 0.10;
        feetDetectionMethod = 'ankle landmarks (fallback)';
    } else if (hasFeet) {
        // Only one foot/ankle is visible (expected in a side profile) —
        // we can't measure X-distance, so just trust hasFeet passed and
        // mark feetAligned true to avoid a false "turn your feet" message.
        feetAligned = true;
        feetDetectionMethod = 'single foot (side profile)';
    }

    // ✅ CHECK 4: Frame Positioning
    const hipCenterX = (leftHip.x + rightHip.x) / 2;
    const hipCenterY = (leftHip.y + rightHip.y) / 2;
    const isHorizontallyCentered = hipCenterX >= 0.35 && hipCenterX <= 0.65;
    const isVerticallyCentered = hipCenterY >= 0.30 && hipCenterY <= 0.70;
    const isInFrame = isHorizontallyCentered && isVerticallyCentered;

    // ✅ FINAL ALIGNMENT CHECK
    const aligned = hasRequiredLandmarks && isSideView && isRightSide && feetAligned && isInFrame;

    // ── Feedback (priority: missing landmarks first, then orientation, then position) ──
    let feedbackMessage = '';
    let feedbackIcon = '';

    if (!hasHead) {
        feedbackMessage = 'SHOW YOUR HEAD';
        feedbackIcon = '⬆️';
    } else if (!hasHips) {
        feedbackMessage = 'HIPS NOT VISIBLE';
        feedbackIcon = '❌';
    } else if (!hasKnee) {
        feedbackMessage = 'SHOW YOUR KNEE';
        feedbackIcon = '⬇️';
    } else if (!hasFeet) {
        feedbackMessage = 'STEP BACK - SHOW FULL LEGS';
        feedbackIcon = '⬆️';
    } else if (!isSideView) {
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
