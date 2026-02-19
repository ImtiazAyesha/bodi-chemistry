/**
 * deviceCapabilities.js
 * Pre-flight checks run BEFORE MediaPipe is loaded.
 * Returns a capability object so the app can gate model loading
 * and show friendly errors rather than crashing.
 */

/**
 * Check if WebGL2 is available (required for MediaPipe WASM acceleration).
 * Falls back to checking WebGL1.
 * @returns {{ supported: boolean, version: 1|2|null }}
 */
export function checkWebGL() {
    try {
        const canvas = document.createElement('canvas');
        if (canvas.getContext('webgl2')) return { supported: true, version: 2 };
        if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) {
            return { supported: true, version: 1 };
        }
        return { supported: false, version: null };
    } catch {
        return { supported: false, version: null };
    }
}

/**
 * Check if WebAssembly is available (required for MediaPipe).
 * @returns {boolean}
 */
export function checkWASM() {
    try {
        return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    } catch {
        return false;
    }
}

/**
 * Estimate available device RAM in GB.
 * navigator.deviceMemory is available on Android Chrome / Edge.
 * Returns 4 as a safe default on Safari / Firefox (they don't expose this).
 * @returns {number} GB
 */
export function estimateMemoryGB() {
    if (navigator.deviceMemory) return navigator.deviceMemory;
    return 4; // Conservative default
}

/**
 * Check if the MediaDevices camera API is available.
 * Returns false on HTTP (non-localhost) without HTTPS — camera is blocked by browsers in that case.
 * @returns {boolean}
 */
export function checkCameraAPI() {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
}

/**
 * Run all pre-flight checks and return a single capabilities object.
 * Call this at app startup, before initialising any models.
 *
 * @returns {{
 *   webgl: { supported: boolean, version: 1|2|null },
 *   wasm: boolean,
 *   estimatedMemoryGB: number,
 *   cameraApiAvailable: boolean,
 *   canRunMediaPipe: boolean,
 *   failureReason: string | null
 * }}
 */
export function runCapabilityChecks() {
    const webgl = checkWebGL();
    const wasm = checkWASM();
    const estimatedMemoryGB = estimateMemoryGB();
    const cameraApiAvailable = checkCameraAPI();

    let failureReason = null;

    if (!wasm) {
        failureReason = 'WebAssembly is not supported on this browser. Please update your browser or try a different one (Chrome or Safari are recommended).';
    } else if (!webgl.supported) {
        failureReason = 'WebGL is not available. This may be because hardware acceleration is disabled. Please check your browser settings or try a different browser.';
    } else if (!cameraApiAvailable) {
        failureReason = 'Camera access requires a secure HTTPS connection. Please make sure you are visiting the site using https://.';
    }

    return {
        webgl,
        wasm,
        estimatedMemoryGB,
        cameraApiAvailable,
        canRunMediaPipe: wasm && webgl.supported && cameraApiAvailable,
        failureReason,
    };
}
