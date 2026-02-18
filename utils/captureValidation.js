/**
 * Capture validation utilities
 * Validates captured landmarks for each stage
 */

/**
 * Validate captured landmarks for a specific stage
 * @param {string} stage - Current capture stage
 * @param {Object} hiddenCanvas - Hidden canvas with landmarks
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateCapturedLandmarks = (stage, hiddenCanvas) => {
    if (!hiddenCanvas) {
        return { valid: false, error: 'No canvas available' };
    }

    const ctx = hiddenCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    const pixels = imageData.data;

    // Count green pixels (landmarks are drawn in green)
    let greenPixelCount = 0;
    const threshold = 100; // Minimum brightness for green channel

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Check if pixel is predominantly green
        if (g > threshold && g > r && g > b) {
            greenPixelCount++;
        }
    }

    // Stage-specific validation thresholds
    let minPixels = 0;
    let errorMessage = '';

    switch (stage) {
        case 'STAGE_1_FACE':
            minPixels = 500; // Face mesh has many landmarks
            errorMessage = 'Face landmarks not detected. Please ensure your face is clearly visible.';
            break;

        case 'STAGE_2_UPPER_FRONT':
            minPixels = 300; // Upper body pose landmarks
            errorMessage = 'Body landmarks not detected. Please ensure your full body is visible.';
            break;

        case 'STAGE_3_UPPER_SIDE':
            minPixels = 300; // Side profile pose landmarks
            errorMessage = 'Side profile landmarks not detected. Please turn to your right side.';
            break;

        case 'STAGE_4_LOWER_SIDE':
            minPixels = 400; // Full body side landmarks
            errorMessage = 'Full body landmarks not detected. Please ensure your entire body is visible from the side.';
            break;

        default:
            return { valid: false, error: 'Unknown stage' };
    }

    const valid = greenPixelCount >= minPixels;

    return {
        valid,
        error: valid ? '' : errorMessage,
        pixelCount: greenPixelCount
    };
};

/**
 * Validate that required pose landmarks are present
 * @param {Array} landmarks - Pose landmarks array
 * @param {Array} requiredIndices - Array of required landmark indices
 * @returns {boolean} True if all required landmarks are present
 */
export const hasRequiredLandmarks = (landmarks, requiredIndices) => {
    if (!landmarks || !Array.isArray(landmarks)) {
        return false;
    }

    return requiredIndices.every(index => {
        const landmark = landmarks[index];
        return landmark &&
            typeof landmark.x === 'number' &&
            typeof landmark.y === 'number' &&
            !isNaN(landmark.x) &&
            !isNaN(landmark.y);
    });
};

/**
 * Get required landmark indices for each stage
 * @param {string} stage - Current capture stage
 * @returns {Array} Array of required landmark indices
 */
export const getRequiredLandmarksForStage = (stage) => {
    switch (stage) {
        case 'STAGE_1_FACE':
            // Face landmarks (handled separately by face landmarker)
            return [];

        case 'STAGE_2_UPPER_FRONT':
            // Shoulders, hips, ankles
            return [11, 12, 23, 24, 27, 28];

        case 'STAGE_3_UPPER_SIDE':
            // Shoulders, nose, ear
            return [0, 7, 11, 12];

        case 'STAGE_4_LOWER_SIDE':
            // Full body: shoulders, hips, knees, ankles
            return [11, 12, 23, 24, 25, 26, 27, 28];

        default:
            return [];
    }
};
