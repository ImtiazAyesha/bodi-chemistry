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
 * Formats a raw value into a normalized score or readable string if needed.
 */
export const formatMetric = (val, digits = 2) => {
    return val ? val.toFixed(digits) : '0.00';
};
