// scoring.js
// Logic for weighing metrics and calculating the final Bodi Kemistri score

const PATTERNS = {
    // Example patterns and weights - this can be drilled down further as specs evolve
    UPPER_COMPRESSION: 1.0,
    LOWER_COMPRESSION: 1.0,
    ASYMMETRY: 1.0
};

/**
 * Calculates the final "Bodi Logic" score.
 * FinalScore = (FaceScore * 0.4) + (BodyScore * 0.4) + (QuestionnaireScore * 0.2)
 * 
 * Note: Since specific thresholds for "FaceScore" haven't been strictly defined 
 * (e.g. "what jaw shift = 0 points?"), we will implement a normalized 0-100 logic 
 * based on deviations. 
 * 
 * Ideally: 0 deviation = 100 score. High deviation = Lower score.
 */
export const calculateTotalScore = (metrics, questionnaireScore = 50) => {
    // 1. Calculate Face Score (0-100) based on stability/symmetry
    // We arbitrarily weight the sub-metrics for now to produce a "score".
    
    const { 
        eyeSym, // Deviation (lower is better)
        jawShift, // Deviation (lower is better)
        headTilt, // Deviation from 0 (lower is better)
        nostrilAsym // Deviation (lower is better)
    } = metrics.face;

    // Simplified penalty model: Start at 100, subtract points for deviations
    let faceScore = 100;
    faceScore -= Math.abs(eyeSym || 0) * 1000; // Eye sym is usually tiny (e.g. 0.01), so multiply
    faceScore -= Math.abs(jawShift || 0) * 500;
    faceScore -= Math.abs(headTilt || 0) * 2; // Tilt is in degrees, maybe 2 points per degree
    faceScore -= Math.abs(nostrilAsym || 0) * 1000;

    faceScore = Math.max(0, Math.min(100, faceScore)); // Clamp

    // 2. Calculate Body Score
    const {
        shoulderHeight, // Deviation (lower is better)
        fhpAngle, // Craniovertebral. Ideal is likely ~0 offset from vertical or specific range? 
                  // Actually CVA ideal is usually > 50 degrees from horizontal. 
                  // If our angle logic returns offset from vertical, we need to adjust.
                  // For now, let's treat "deviation from neutral" as penalty.
        pelvicTilt, 
        footOrient
    } = metrics.body;

    let bodyScore = 100;
    if (shoulderHeight !== undefined) bodyScore -= Math.abs(shoulderHeight) * 500;
    
    // FHP: If we assume our calc returns "deviation from straight", substract.
    // If it returns raw angle, we'd need a target. 
    // Let's assume the dashboard visualizes raw for now, and score is placeholder.
    
    bodyScore = Math.max(0, Math.min(100, bodyScore));

    // 3. Final Weighted Calc
    // (Face * 0.4) + (Body * 0.4) + (Quest * 0.2)
    const final = (faceScore * 0.4) + (bodyScore * 0.4) + (questionnaireScore * 0.2);
    
    return {
        total: final.toFixed(1),
        face: faceScore.toFixed(1),
        body: bodyScore.toFixed(1)
    };
};
