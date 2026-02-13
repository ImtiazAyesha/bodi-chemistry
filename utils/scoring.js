// scoring.js
// Logic for weighing metrics and calculating the final Bodi Kemistri score

const PATTERNS = {
    // Example patterns and weights - this can be drilled down further as specs evolve
    UPPER_COMPRESSION: 1.0,
    LOWER_COMPRESSION: 1.0,
    ASYMMETRY: 1.0
};

// Thresholds for pattern detection
const PATTERN_THRESHOLDS = {
    EYE_ASYMMETRY: 0.015, // Normalized eye height difference threshold
    SHOULDER_ASYMMETRY: 0.02, // Normalized shoulder height difference threshold
};

/**
 * Detects compression patterns from face and body metrics
 * Returns pattern classification and confidence level
 */
export const detectPattern = ( metrics ) => {
    const { face, body } = metrics;

    // Determine Face Pattern (based on eye symmetry)
    let facePattern = 'NEUTRAL';
    if ( face.eyeSym !== undefined && face.eyeSym !== 0 ) {
        // We need to check which eye is lower
        // eyeSym is the absolute difference, so we need raw data
        // For now, we'll use a simplified approach based on magnitude
        if ( Math.abs( face.eyeSym ) > PATTERN_THRESHOLDS.EYE_ASYMMETRY ) {
            // This is a placeholder - in real implementation we'd check actual Y coordinates
            facePattern = face.eyeSym > 0 ? 'RIGHT' : 'LEFT';
        }
    }

    // Determine Body Pattern (based on shoulder height)
    let bodyPattern = 'NEUTRAL';
    if ( body.shoulderHeight !== undefined && body.shoulderHeight !== 0 ) {
        if ( Math.abs( body.shoulderHeight ) > PATTERN_THRESHOLDS.SHOULDER_ASYMMETRY ) {
            bodyPattern = body.shoulderHeight > 0 ? 'RIGHT' : 'LEFT';
        }
    }

    // Calculate Confidence
    let confidence = 'MEDIUM';
    if ( facePattern === bodyPattern && facePattern !== 'NEUTRAL' ) {
        confidence = 'HIGH'; // Both agree on same compression side
    } else if ( facePattern !== 'NEUTRAL' && bodyPattern !== 'NEUTRAL' && facePattern !== bodyPattern ) {
        confidence = 'LOW'; // Face and Body disagree
    }

    return {
        facePattern,
        bodyPattern,
        confidence,
        agreement: facePattern === bodyPattern
    };
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

    console.log( '=== FACE SCORE CALCULATION ===' );
    console.log( 'Input Face Metrics:', {
        eyeSym,
        jawShift,
        headTilt,
        nostrilAsym
    } );

    // Simplified penalty model: Start at 100, subtract points for deviations
    // Adjusted penalties to be more reasonable
    let faceScore = 100;

    const eyePenalty = Math.abs( eyeSym || 0 ) * 10;
    const jawPenalty = Math.abs( jawShift || 0 ) * 10;
    const tiltPenalty = Math.abs( headTilt || 0 ) * 1;
    const nostrilPenalty = Math.abs( nostrilAsym || 0 ) * 5;

    console.log( 'Penalties:', {
        eyePenalty: eyePenalty.toFixed( 2 ),
        jawPenalty: jawPenalty.toFixed( 2 ),
        tiltPenalty: tiltPenalty.toFixed( 2 ),
        nostrilPenalty: nostrilPenalty.toFixed( 2 ),
        totalPenalty: ( eyePenalty + jawPenalty + tiltPenalty + nostrilPenalty ).toFixed( 2 )
    } );

    faceScore -= eyePenalty;
    faceScore -= jawPenalty;
    faceScore -= tiltPenalty;
    faceScore -= nostrilPenalty;

    console.log( 'Face Score Before Clamp:', faceScore.toFixed( 2 ) );

    faceScore = Math.max(0, Math.min(100, faceScore)); // Clamp

    console.log( 'Face Score After Clamp:', faceScore.toFixed( 2 ) );
    console.log( '=== END FACE SCORE ===\n' );

    // 2. Calculate Body Score
    const {
        shoulderHeight, // Deviation (lower is better)
        fhpAngle, // Craniovertebral. Ideal is likely ~0 offset from vertical or specific range? 
                  // Actually CVA ideal is usually > 50 degrees from horizontal. 
                  // If our angle logic returns offset from vertical, we need to adjust.
                  // For now, let's treat "deviation from neutral" as penalty.
        pelvicTilt, 
        kneeAngle,
        footArchRatio
    } = metrics.body;

    console.log( '=== BODY SCORE CALCULATION ===' );
    console.log( 'Input Body Metrics:', {
        shoulderHeight,
        fhpAngle,
        pelvicTilt,
        kneeAngle,
        footArchRatio
    } );

    let bodyScore = 100;

    // Shoulder height asymmetry - Reduced penalty
    let shoulderPenalty = 0;
    if ( shoulderHeight !== undefined && shoulderHeight !== 0 ) {
        shoulderPenalty = Math.abs( shoulderHeight ) * 10;
        bodyScore -= shoulderPenalty;
    }

    // Forward Head Posture (FHP) - ideal is close to 0 degrees deviation
    let fhpPenalty = 0;
    if ( fhpAngle !== undefined && fhpAngle !== 0 ) {
        fhpPenalty = Math.abs( fhpAngle ) * 0.3;
        bodyScore -= fhpPenalty;
    }

    // Pelvic Tilt - ideal is close to 0 degrees
    let pelvicPenalty = 0;
    if ( pelvicTilt !== undefined && pelvicTilt !== 0 ) {
        pelvicPenalty = Math.abs( pelvicTilt ) * 0.3;
        bodyScore -= pelvicPenalty;
    }

    // Knee Valgus Angle - Expected: 165-180° (170-180° is normal)
    let kneePenalty = 0;
    if ( kneeAngle !== undefined && kneeAngle !== 0 ) {
        const kneeVal = parseFloat( kneeAngle );
        if ( kneeVal >= 170 && kneeVal <= 180 ) {
            kneePenalty = 0; // Normal range
        } else if ( kneeVal >= 165 && kneeVal < 170 ) {
            kneePenalty = ( 170 - kneeVal ) * 2; // Mild valgus
        } else if ( kneeVal >= 160 && kneeVal < 165 ) {
            kneePenalty = 10 + ( 165 - kneeVal ) * 3; // Moderate valgus
        } else {
            kneePenalty = 25 + ( 160 - Math.max( kneeVal, 0 ) ) * 0.5; // Severe valgus
        }
        bodyScore -= kneePenalty;
    }

    // Foot Arch Ratio - Expected: 0.20-0.40 (0.30-0.40 is normal)
    let footArchPenalty = 0;
    if ( footArchRatio !== undefined && footArchRatio !== 0 ) {
        const archVal = parseFloat( footArchRatio );
        if ( archVal >= 0.30 && archVal <= 0.40 ) {
            footArchPenalty = 0; // Normal range
        } else if ( archVal >= 0.25 && archVal < 0.30 ) {
            footArchPenalty = ( 0.30 - archVal ) * 50; // Mild flat foot
        } else if ( archVal >= 0.20 && archVal < 0.25 ) {
            footArchPenalty = 2.5 + ( 0.25 - archVal ) * 100; // Moderate flat foot
        } else if ( archVal < 0.20 ) {
            footArchPenalty = 7.5 + ( 0.20 - archVal ) * 150; // Severe flat foot
        } else {
            footArchPenalty = ( archVal - 0.40 ) * 30; // High arch
        }
        bodyScore -= footArchPenalty;
    }

    console.log( 'Penalties:', {
        shoulderPenalty: shoulderPenalty.toFixed( 2 ),
        fhpPenalty: fhpPenalty.toFixed( 2 ),
        pelvicPenalty: pelvicPenalty.toFixed( 2 ),
        kneePenalty: kneePenalty.toFixed( 2 ),
        footArchPenalty: footArchPenalty.toFixed( 2 ),
        totalPenalty: ( shoulderPenalty + fhpPenalty + pelvicPenalty + kneePenalty + footArchPenalty ).toFixed( 2 )
    } );
    
    console.log( 'Body Score Before Clamp:', bodyScore.toFixed( 2 ) );
    
    bodyScore = Math.max(0, Math.min(100, bodyScore));

    console.log( 'Body Score After Clamp:', bodyScore.toFixed( 2 ) );
    console.log( '=== END BODY SCORE ===\n' );

    // 3. Final Weighted Calc
    // (Face * 0.4) + (Body * 0.4) + (Quest * 0.2)
    const final = (faceScore * 0.4) + (bodyScore * 0.4) + (questionnaireScore * 0.2);
    
    console.log( '=== FINAL SCORE CALCULATION ===' );
    console.log( 'Weighted Components:', {
        faceContribution: ( faceScore * 0.4 ).toFixed( 2 ),
        bodyContribution: ( bodyScore * 0.4 ).toFixed( 2 ),
        questionnaireContribution: ( questionnaireScore * 0.2 ).toFixed( 2 )
    } );
    console.log( 'Final Scores:', {
        total: final.toFixed( 1 ),
        face: faceScore.toFixed( 1 ),
        body: bodyScore.toFixed( 1 )
    } );
    console.log( '=== END FINAL SCORE ===\n' );

    return {
        total: final.toFixed(1),
        face: faceScore.toFixed(1),
        body: bodyScore.toFixed(1)
    };
};