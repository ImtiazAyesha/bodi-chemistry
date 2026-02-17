import React, { useEffect, useRef } from 'react';
import { DrawingUtils } from '@mediapipe/tasks-vision';
import { FaceLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';

/**
 * LandmarkOverlay Component
 * Renders MediaPipe landmarks (face/pose) on top of captured images
 * 
 * @param {Object} landmarks - Object containing face and/or pose landmark arrays
 * @param {number} width - Canvas width (should match image dimensions)
 * @param {number} height - Canvas height (should match image dimensions)
 */
const LandmarkOverlay = ({ landmarks, width = 960, height = 720 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !landmarks) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Create DrawingUtils instance
        const drawingUtils = new DrawingUtils(ctx);

        try {
            // Draw face landmarks if available
            if (landmarks.face && Array.isArray(landmarks.face) && landmarks.face.length > 0) {
                // Draw face mesh (tesselation)
                drawingUtils.drawConnectors(
                    landmarks.face,
                    FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                    { 
                        color: 'rgba(0, 255, 0, 0.2)', 
                        lineWidth: 0.5 
                    }
                );

                // Draw face landmarks (points)
                drawingUtils.drawLandmarks(
                    landmarks.face,
                    { 
                        color: '#00FF00', 
                        radius: 1.5,
                        fillColor: '#00FF00'
                    }
                );
            }

            // Draw pose landmarks if available
            if (landmarks.pose && Array.isArray(landmarks.pose) && landmarks.pose.length > 0) {
                // Draw pose connections (skeleton)
                drawingUtils.drawConnectors(
                    landmarks.pose,
                    PoseLandmarker.POSE_CONNECTIONS,
                    { 
                        color: 'rgba(0, 255, 0, 0.6)', 
                        lineWidth: 2 
                    }
                );

                // Draw pose landmarks (joints)
                drawingUtils.drawLandmarks(
                    landmarks.pose,
                    { 
                        color: '#00FF00', 
                        radius: 3,
                        fillColor: '#00FF00'
                    }
                );
            }
        } catch (error) {
            console.warn('Error drawing landmarks:', error);
        }
    }, [landmarks, width, height]);

    // Don't render if no landmarks
    if (!landmarks || (!landmarks.face && !landmarks.pose)) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10
            }}
        />
    );
};

export default LandmarkOverlay;
