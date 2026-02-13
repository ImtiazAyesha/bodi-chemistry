// geometry.js
// Pure math utility functions for Bodi Kemistri

/**
 * Calculates the Euclidean distance between two 2D or 3D points.
 * @param {Object} a - Point A {x, y, z}
 * @param {Object} b - Point B {x, y, z}
 * @returns {number} Distance
 */
export const calculateDistance = (a, b) => {
  if (!a || !b) return 0;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  // Include Z if available for more 3D precision, though requirements specify 2D logic mostly for now.
  // We'll stick to 2D for "Scan" logic unless depth is explicitly requested, 
  // but MediaPipe z helps. Let's start with 2D for pixel-based logic, 
  // or 3D if we want true depth. Given spec says "Compare Y-coordinates", it implies 2D projection.
  // However, for pure distance (like iris width), 3D is better if landmarks are normalized.
  // Let's use 3D to be safe for lengths, but 2D for "Height Symmetry" checks.
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const calculateDistance2D = (a, b) => {
    if (!a || !b) return 0;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};


/**
 * Calculates the angle of the line connecting A to B relative to the horizontal axis.
 * Returns degrees. 0 = Horizontal. Positive = Clockwise? (Depends on Y axis).
 * In DOM/Canvas, Y increases downwards.
 * @param {Object} a - Point A
 * @param {Object} b - Point B
 * @returns {number} Angle in degrees
 */
export const calculateAngle = (a, b) => {
  if (!a || !b) return 0;
  const dy = b.y - a.y;
  const dx = b.x - a.x;
  const theta = Math.atan2(dy, dx); // Radians
  const degrees = theta * (180 / Math.PI);
  return degrees;
};

/**
 * Calculates the angle at point B formed by points A-B-C.
 * Useful for joints (e.g., Hip-Knee-Ankle).
 * @param {Object} a - Point A
 * @param {Object} b - Center Point B
 * @param {Object} c - Point C
 * @returns {number} Angle in degrees
 */
export const calculateAngle3Points = (a, b, c) => {
    if (!a || !b || !c) return 0;
    
    // Vector BA
    const v1 = { x: a.x - b.x, y: a.y - b.y };
    // Vector BC
    const v2 = { x: c.x - b.x, y: c.y - b.y };
    
    // Dot product
    const dot = v1.x * v2.x + v1.y * v2.y;
    
    // Magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    // Cosine rule
    const cosTheta = dot / (mag1 * mag2);
    // Clamp to -1..1 to avoid precision errors
    const clamped = Math.max(-1, Math.min(1, cosTheta));
    
    const degrees = Math.acos(clamped) * (180 / Math.PI);
    return degrees;
};

/**
 * Calculate Craniovertebral Angle (CVA) for Forward Head Posture Assessment
 * 
 * CLIENT SPECIFICATION:
 * "Angle between line from ear→nose and vertical line from shoulder→ear"
 * 
 * This measures how far the head is forward of the shoulders.
 * - Normal posture: 50-60° (ear nearly above shoulder)
 * - Forward Head Posture: <50° (ear forward of shoulder)
 * 
 * @param {Object} nose - MediaPipe Pose landmark #0 {x, y, z, visibility}
 * @param {Object} ear - MediaPipe Pose landmark #7 (left) or #8 (right)
 * @param {Object} shoulder - MediaPipe Pose landmark #11 (left) or #12 (right)
 * @returns {number|null} CVA in degrees (50-60° = normal), or null if invalid landmarks
 * 
 * @example
 * const nose = poseLandmarks[0];
 * const ear = poseLandmarks[7];
 * const shoulder = poseLandmarks[11];
 * const cva = calculateCraniovertebralAngle(nose, ear, shoulder);
 * console.log(`CVA: ${cva}°`); // Expected output: "CVA: 54.2°" (good posture)
 */
export const calculateCraniovertebralAngle = ( nose, ear, shoulder ) => {
  // Step 1: Validate input landmarks
  if ( !nose || !ear || !shoulder ) {
    console.warn( 'CVA calculation: Missing required landmarks (nose, ear, or shoulder)' );
    return null;
  }

  // Check if landmarks have required x, y properties
  if ( nose.x === undefined || nose.y === undefined ||
    ear.x === undefined || ear.y === undefined ||
    shoulder.x === undefined || shoulder.y === undefined ) {
    console.warn( 'CVA calculation: Invalid landmark format (missing x or y coordinates)' );
    return null;
  }

  // Step 2: Calculate the line from shoulder to ear (postural line)
  const shoulderToEar_dx = ear.x - shoulder.x;
  const shoulderToEar_dy = ear.y - shoulder.y;

  // Step 3: Calculate the line from ear to nose (head orientation)
  const earToNose_dx = nose.x - ear.x;
  const earToNose_dy = nose.y - ear.y;

  // Step 4: Calculate angle between the two vectors using dot product
  // Formula: cos(θ) = (A·B) / (|A| × |B|)

  // Dot product of the two vectors
  const dotProduct = ( shoulderToEar_dx * earToNose_dx ) + ( shoulderToEar_dy * earToNose_dy );

  // Magnitude (length) of each vector
  const magnitude_shoulderToEar = Math.sqrt( shoulderToEar_dx ** 2 + shoulderToEar_dy ** 2 );
  const magnitude_earToNose = Math.sqrt( earToNose_dx ** 2 + earToNose_dy ** 2 );

  // Edge case: prevent division by zero
  if ( magnitude_shoulderToEar === 0 || magnitude_earToNose === 0 ) {
    console.warn( 'CVA calculation: Zero-length vector detected' );
    return null;
  }

  // Calculate cosine of the angle
  const cosTheta = dotProduct / ( magnitude_shoulderToEar * magnitude_earToNose );

  // Clamp cosine value to [-1, 1] to avoid Math.acos errors due to floating-point precision
  const clampedCos = Math.max( -1, Math.min( 1, cosTheta ) );

  // Calculate angle in radians, then convert to degrees
  const angleRad = Math.acos( clampedCos );
  const angleDeg = angleRad * ( 180 / Math.PI );

  // Step 5: Convert to CVA measurement
  // The angle we calculated is the interior angle between the vectors
  // For CVA, we want: 180° - interior angle
  // This gives us the angle relative to vertical alignment
  const cva = 180 - angleDeg;

  // Round to 1 decimal place for display
  return Math.round( cva * 10 ) / 10;
};

/**
 * Calculate Shoulder Height Asymmetry
 * 
 * CLIENT SPECIFICATION:
 * "Absolute difference in Y-coordinates, normalized by total body height"
 * Returns percentage of body height (0-100%, where <2% = normal)
 * 
 * @param {Array} poseLandmarks - Array of 33 MediaPipe Pose landmarks
 * @returns {number|null} Shoulder asymmetry as percentage of body height, or null if invalid
 * 
 * @example
 * const asymmetry = calculateShoulderHeightAsymmetry(poseLandmarks);
 * console.log(`Shoulder asymmetry: ${asymmetry}%`); // Expected: "Shoulder asymmetry: 1.8%"
 */
export const calculateShoulderHeightAsymmetry = ( poseLandmarks ) => {
  // Step 1: Validate input
  if ( !poseLandmarks || poseLandmarks.length < 33 ) {
    console.warn( 'Shoulder asymmetry: Invalid pose landmarks array' );
    return null;
  }

  // Step 2: Get shoulder landmarks
  const leftShoulder = poseLandmarks[ 11 ];
  const rightShoulder = poseLandmarks[ 12 ];

  if ( !leftShoulder || !rightShoulder ) {
    console.warn( 'Shoulder asymmetry: Missing shoulder landmarks' );
    return null;
  }

  // Step 3: Calculate body height (for normalization)
  // Body height = distance from shoulders to ankles
  const leftAnkle = poseLandmarks[ 27 ];
  const rightAnkle = poseLandmarks[ 28 ];

  if ( !leftAnkle || !rightAnkle ) {
    console.warn( 'Shoulder asymmetry: Missing ankle landmarks for body height calculation' );
    return null;
  }

  // Calculate average shoulder Y-position
  const shoulderY = ( leftShoulder.y + rightShoulder.y ) / 2;

  // Calculate average ankle Y-position
  const ankleY = ( leftAnkle.y + rightAnkle.y ) / 2;

  // Body height is the vertical distance from shoulders to ankles
  const bodyHeight = Math.abs( ankleY - shoulderY );

  // Edge case: prevent division by zero
  if ( bodyHeight === 0 || bodyHeight < 0.01 ) {
    console.warn( 'Shoulder asymmetry: Body height too small or zero' );
    return null;
  }

  // Step 4: Calculate raw shoulder height difference
  const heightDifference = Math.abs( leftShoulder.y - rightShoulder.y );

  // Step 5: Normalize as percentage of body height
  const asymmetryPercentage = ( heightDifference / bodyHeight ) * 100;

  // Step 6: Round to 1 decimal place
  return Math.round( asymmetryPercentage * 10 ) / 10;
};

/**
 * Calculate Foot Arch Collapse (Pronation) using Arch Height Ratio
 * 
 * CLIENT SPECIFICATION:
 * "Medial arch height ratio = (distance from ground to navicular) / ankle height"
 * 
 * Measures vertical height of the foot arch relative to ankle height.
 * Lower ratio = flatter arch (pronation/collapse)
 * Higher ratio = higher arch (normal or supinated)
 * 
 * @param {Array} poseLandmarks - Array of 33 MediaPipe Pose landmarks
 * @param {string} side - 'left' or 'right' foot to analyze
 * @returns {number|null} Arch ratio (0.0-0.5 typical), or null if invalid
 * 
 * @example
 * const leftArchRatio = calculateFootArchRatio(poseLandmarks, 'left');
 * console.log(`Left foot arch ratio: ${leftArchRatio}`); 
 * // Expected: 0.35 (normal arch) or 0.18 (flat foot)
 */
export const calculateFootArchRatio = ( poseLandmarks, side = 'left' ) => {
  // Step 1: Validate input
  if ( !poseLandmarks || poseLandmarks.length < 33 ) {
    console.warn( 'Foot arch ratio: Invalid pose landmarks array' );
    return null;
  }

  // Step 2: Select landmarks based on side (left or right foot)
  const ankle = side === 'left' ? poseLandmarks[ 27 ] : poseLandmarks[ 28 ];
  const heel = side === 'left' ? poseLandmarks[ 29 ] : poseLandmarks[ 30 ];
  const footIndex = side === 'left' ? poseLandmarks[ 31 ] : poseLandmarks[ 32 ];

  // Step 3: Validate landmarks exist
  if ( !ankle || !heel || !footIndex ) {
    console.warn( `Foot arch ratio: Missing landmarks for ${ side } foot` );
    return null;
  }

  if ( ankle.x === undefined || ankle.y === undefined ||
    heel.x === undefined || heel.y === undefined ||
    footIndex.x === undefined || footIndex.y === undefined ) {
    console.warn( 'Foot arch ratio: Invalid landmark coordinates' );
    return null;
  }

  // Step 4: Approximate the navicular bone position
  // The navicular is located roughly midway between ankle and foot index
  // This is the highest point of the medial longitudinal arch
  const navicular = {
    x: ( ankle.x + footIndex.x ) / 2,
    y: ( ankle.y + footIndex.y ) / 2,
    z: ( ( ankle.z || 0 ) + ( footIndex.z || 0 ) ) / 2
  };

  // Step 5: Calculate arch height
  // Arch height = vertical distance from heel (ground level) to navicular (arch peak)
  // In MediaPipe coordinates, y increases downward, so heel.y > navicular.y for raised arch
  const archHeight = Math.abs( navicular.y - heel.y );

  // Step 6: Calculate ankle height
  // Ankle height = vertical distance from heel (ground level) to ankle bone
  const ankleHeight = Math.abs( ankle.y - heel.y );

  // Step 7: Edge case - prevent division by zero
  if ( ankleHeight === 0 || ankleHeight < 0.001 ) {
    console.warn( 'Foot arch ratio: Ankle height too small or zero' );
    return null;
  }

  // Step 8: Calculate arch ratio
  const archRatio = archHeight / ankleHeight;

  // Step 9: Sanity check - ratio should be between 0.0 and 0.6
  // If outside this range, likely a landmark detection error
  if ( archRatio < 0 || archRatio > 0.6 ) {
    console.warn( `Foot arch ratio: Unusual value detected (${ archRatio.toFixed( 3 ) }), possible landmark error` );
    return null;
  }

  // Step 10: Round to 3 decimal places (e.g., 0.350)
  return Math.round( archRatio * 1000 ) / 1000;
};

/**
 * Calculate foot arch ratio for BOTH feet and return average
 * 
 * @param {Array} poseLandmarks - Array of 33 MediaPipe Pose landmarks
 * @returns {Object} Object with left, right, and average arch ratios
 * 
 * @example
 * const archData = calculateFootArchBothSides(poseLandmarks);
 * console.log(archData);
 * // Output: { left: 0.35, right: 0.32, average: 0.335, asymmetry: 0.03 }
 */
export const calculateFootArchBothSides = ( poseLandmarks ) => {
  const leftRatio = calculateFootArchRatio( poseLandmarks, 'left' );
  const rightRatio = calculateFootArchRatio( poseLandmarks, 'right' );

  // If either foot is null, return what we have
  if ( leftRatio === null && rightRatio === null ) {
    return { left: null, right: null, average: null, asymmetry: null };
  }

  // Calculate average (use available values)
  let average = null;
  if ( leftRatio !== null && rightRatio !== null ) {
    average = ( leftRatio + rightRatio ) / 2;
  } else if ( leftRatio !== null ) {
    average = leftRatio;
  } else if ( rightRatio !== null ) {
    average = rightRatio;
  }

  // Calculate asymmetry (difference between feet)
  let asymmetry = null;
  if ( leftRatio !== null && rightRatio !== null ) {
    asymmetry = Math.abs( leftRatio - rightRatio );
  }

  return {
    left: leftRatio,
    right: rightRatio,
    average: average !== null ? Math.round( average * 1000 ) / 1000 : null,
    asymmetry: asymmetry !== null ? Math.round( asymmetry * 1000 ) / 1000 : null
  };
};

/**
 * Calculate Anterior Pelvic Tilt
 * 
 * FIXED VERSION: Measures hip obliquity (hip line angle from horizontal)
 * This is more reliable than trying to measure anterior/posterior tilt from 2D landmarks
 * 
 * Measures if one hip is higher than the other (pelvic rotation/obliquity)
 * - Normal range: 0-3° (level hips)
 * - Mild obliquity: 3-8°
 * - Moderate: 8-15°
 * - Severe: >15°
 * 
 * @param {Array} poseLandmarks - Array of 33 MediaPipe Pose landmarks
 * @param {string} viewMode - 'front' or 'side' view (front view is more reliable for this metric)
 * @returns {number|null} Pelvic obliquity angle in degrees, or null if invalid
 * 
 * @example
 * const tilt = calculatePelvicTilt(poseLandmarks, 'front');
 * console.log(`Pelvic tilt: ${tilt}°`); 
 * // Expected: 2.5° (normal) or 12.3° (moderate obliquity)
 */
export const calculatePelvicTilt = ( poseLandmarks, viewMode = 'side' ) => {
  // Step 1: Validate input
  if ( !poseLandmarks || poseLandmarks.length < 33 ) {
    console.warn( 'Pelvic tilt: Invalid pose landmarks array' );
    return null;
  }

  // Step 2: Get hip landmarks
  const leftHip = poseLandmarks[ 23 ];
  const rightHip = poseLandmarks[ 24 ];

  if ( !leftHip || !rightHip ) {
    console.warn( 'Pelvic tilt: Missing hip landmarks' );
    return null;
  }

  // Step 3: Calculate hip obliquity (hip line angle from horizontal)
  // This works for both front and side views
  
  const dx = rightHip.x - leftHip.x;
  const dy = rightHip.y - leftHip.y;

  // Angle of hip line from horizontal (in degrees)
  let angleRad = Math.atan2( dy, dx );
  let angleDeg = angleRad * ( 180 / Math.PI );

  // Normalize to -90 to +90 range
  if ( angleDeg > 90 ) angleDeg -= 180;
  if ( angleDeg < -90 ) angleDeg += 180;

  // Return absolute value (we just care about tilt magnitude, not direction)
  const obliquityAngle = Math.abs(angleDeg);

  return Math.round( obliquityAngle * 10 ) / 10;
};

/**
 * Interpret pelvic tilt angle and return severity level
 * 
 * @param {number} angle - Pelvic tilt angle in degrees
 * @param {string} viewMode - 'front' or 'side'
 * @returns {Object} Interpretation with level and description
 */
export const interpretPelvicTilt = ( angle, viewMode = 'side' ) => {
  if ( angle === null || angle === undefined ) {
    return { level: 'unknown', description: 'Could not calculate', score: 0 };
  }

  const absAngle = Math.abs( angle );

  if ( viewMode === 'side' ) {
    // Side view - anterior/posterior tilt
    if ( angle >= 5 && angle <= 12 ) {
      return {
        level: 'normal',
        description: 'Normal anterior pelvic tilt',
        score: 0
      };
    } else if ( angle > 12 && angle <= 15 ) {
      return {
        level: 'mild',
        description: 'Mild hyperlordosis (excessive anterior tilt)',
        score: 30
      };
    } else if ( angle > 15 ) {
      return {
        level: 'severe',
        description: 'Severe hyperlordosis (excessive anterior tilt)',
        score: 80
      };
    } else if ( angle < 5 ) {
      return {
        level: 'posterior',
        description: 'Posterior pelvic tilt (flat back)',
        score: 50
      };
    }
  } else {
    // Front view - hip obliquity
    if ( absAngle <= 3 ) {
      return {
        level: 'normal',
        description: 'Level hips',
        score: 0
      };
    } else if ( absAngle <= 8 ) {
      return {
        level: 'mild',
        description: 'Mild pelvic obliquity',
        score: 40
      };
    } else {
      return {
        level: 'severe',
        description: 'Severe pelvic obliquity',
        score: 80
      };
    }
  }

  return { level: 'unknown', description: 'Unusual value', score: 0 };
};

/**
 * Formats a raw value into a normalized score or readable string if needed.
 */
export const formatMetric = (val, digits = 2) => {
    return val ? val.toFixed(digits) : '0.00';
};