import React, { useEffect, useRef } from 'react';
import { DrawingUtils, FaceLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';

/**
 * LandmarkOverlay Component
 * Renders MediaPipe landmarks (face/pose) perfectly aligned on top of captured images.
 *
 * KEY FIX: Instead of using hardcoded width/height props, this component reads the
 * natural (intrinsic) pixel dimensions of the sibling <img> element via `imageRef`.
 * This ensures the canvas pixel buffer always matches the actual captured image
 * dimensions exactly, regardless of device aspect ratio or screen orientation.
 *
 * @param {Object}  landmarks - Object containing face and/or pose landmark arrays
 * @param {React.RefObject} imageRef - Ref attached to the sibling <img> element
 */
const LandmarkOverlay = ({ landmarks, imageRef }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !landmarks || !imageRef?.current) return;

        const canvas = canvasRef.current;
        const img = imageRef.current;

        // ─── CORE FIX ────────────────────────────────────────────────────────────
        // Sync the canvas PIXEL BUFFER to the image's natural (intrinsic) dimensions.
        // MediaPipe DrawingUtils multiplies normalized landmark coords (0–1) by
        // canvas.width / canvas.height to get pixel positions. If these don't match
        // the image's real pixel dimensions, every landmark lands in the wrong spot.
        //
        // naturalWidth/naturalHeight = the actual pixel size of the captured image
        // (e.g. 720×960 on a portrait phone, NOT the hardcoded 960×720 that was here before).
        // ─────────────────────────────────────────────────────────────────────────
        const syncAndDraw = () => {
            const naturalW = img.naturalWidth;
            const naturalH = img.naturalHeight;

            // Guard: image not yet decoded
            if (!naturalW || !naturalH) return;

            // Only update the buffer if dimensions have changed (avoids unnecessary redraws)
            if (canvas.width !== naturalW || canvas.height !== naturalH) {
                canvas.width = naturalW;
                canvas.height = naturalH;
            }

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const drawingUtils = new DrawingUtils(ctx);

            try {
                // ── Face landmarks (Stage 1 – Face Profile) ──────────────────────
                if (landmarks.face && Array.isArray(landmarks.face) && landmarks.face.length > 0) {
                    drawingUtils.drawConnectors(
                        landmarks.face,
                        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                        { color: 'rgba(0, 255, 0, 0.25)', lineWidth: 0.5 }
                    );
                    drawingUtils.drawLandmarks(
                        landmarks.face,
                        { color: '#00FF00', radius: 1.5, fillColor: '#00FF00' }
                    );
                }

                // ── Pose landmarks (Stages 2, 3, 4 – Body) ───────────────────────
                if (landmarks.pose && Array.isArray(landmarks.pose) && landmarks.pose.length > 0) {
                    drawingUtils.drawConnectors(
                        landmarks.pose,
                        PoseLandmarker.POSE_CONNECTIONS,
                        { color: 'rgba(0, 255, 0, 0.6)', lineWidth: 2 }
                    );
                    drawingUtils.drawLandmarks(
                        landmarks.pose,
                        { color: '#00FF00', radius: 3, fillColor: '#00FF00' }
                    );
                }
            } catch (error) {
                console.warn('LandmarkOverlay: error drawing landmarks:', error);
            }
        };

        // If the image is already decoded, draw immediately.
        // Otherwise wait for the load event (handles first render before decode).
        if (img.complete && img.naturalWidth > 0) {
            syncAndDraw();
        } else {
            img.addEventListener('load', syncAndDraw, { once: true });
        }
    }, [landmarks, imageRef]);

    // Don't render if there are no landmarks to show
    if (!landmarks || (!landmarks.face && !landmarks.pose)) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                // CSS display size fills the container — the pixel buffer is set
                // dynamically above to match the image's natural dimensions.
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        />
    );
};

export default LandmarkOverlay;
