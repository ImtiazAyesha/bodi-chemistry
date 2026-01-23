import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

// 3D distance calculation for normalized landmarks (x, y, z)
// MediaPipe provides z coordinate for depth information
const distance3D = (a, b) => {
  if (!a || !b) return 0;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const faceLandmarkerRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const cameraRunningRef = useRef(false);

  useEffect(() => {
    let animationFrameId;

    const initModelsAndCamera = async () => {
      if (!webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const drawingUtils = new DrawingUtils(ctx);

      // 1) Load shared vision WASM
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm"
      );

      // 2) Face landmarker
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      // 3) Pose landmarker
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      faceLandmarkerRef.current = faceLandmarker;
      poseLandmarkerRef.current = poseLandmarker;

      const startCamera = async () => {
        if (cameraRunningRef.current) return;

        await navigator.mediaDevices.getUserMedia({ video: true });
        cameraRunningRef.current = true;

        const renderLoop = async () => {
          if (!webcamRef.current || !video || video.readyState < 2) {
            animationFrameId = requestAnimationFrame(renderLoop);
            return;
          }

          const now = performance.now();

          try {
            // Different timestamps to avoid packet mismatch errors
            const faceResult = faceLandmarkerRef.current.detectForVideo(
              video,
              now
            );
            const poseResult = poseLandmarkerRef.current.detectForVideo(
              video,
              now + 0.0001
            );

            // ========== Task 1.3: 3D Normalization Logic ==========

            // FACE NORMALIZATION: Calculate iris width (distance between left and right iris)
            // Iris landmarks: Left 468, Right 473
            let irisWidth = 0;
            if (
              faceResult.faceLandmarks &&
              faceResult.faceLandmarks.length > 0
            ) {
              const lm = faceResult.faceLandmarks[0];
              const leftIris = lm[468];
              const rightIris = lm[473];
              irisWidth = distance3D(leftIris, rightIris);
            }

            // BODY NORMALIZATION: Calculate shoulder width (distance between left and right shoulder)
            // Pose landmarks: Left Shoulder 11, Right Shoulder 12
            let shoulderWidth = 0;
            let poseLandmarks = null;
            if (poseResult.landmarks && poseResult.landmarks.length > 0) {
              poseLandmarks = poseResult.landmarks[0];
              const leftShoulder = poseLandmarks[11];
              const rightShoulder = poseLandmarks[12];
              shoulderWidth = distance3D(leftShoulder, rightShoulder);
            }

            // DELIVERABLE: Console log showing normalized distances
            // These values should stay roughly the same even if user moves closer/farther
            if (irisWidth > 0 && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
              const lm = faceResult.faceLandmarks[0];
              // Example: Normalize face height by iris width
              const noseTip = lm[1];
              const chinBottom = lm[152];
              const rawFaceHeight = distance3D(noseTip, chinBottom);
              const normalizedFaceHeight = rawFaceHeight / irisWidth;
              console.log("✓ Face Normalized Distance (face height/iris width):", normalizedFaceHeight.toFixed(4));
            }

            if (shoulderWidth > 0 && poseLandmarks) {
              // Example: Normalize torso length by shoulder width
              const leftShoulder = poseLandmarks[11];
              const leftHip = poseLandmarks[23];
              const rawTorsoLength = distance3D(leftShoulder, leftHip);
              const normalizedTorsoLength = rawTorsoLength / shoulderWidth;
              console.log("✓ Body Normalized Distance (torso length/shoulder width):", normalizedTorsoLength.toFixed(4));
            }

            // ========== Drawing ==========
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Draw face landmarks
            if (
              faceResult.faceLandmarks &&
              faceResult.faceLandmarks.length > 0
            ) {
              for (const landmarks of faceResult.faceLandmarks) {
                drawingUtils.drawConnectors(
                  landmarks,
                  FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                  { color: "#C0C0C0", lineWidth: 0.5 }
                );
                drawingUtils.drawConnectors(
                  landmarks,
                  FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                  { color: "#FF0000", lineWidth: 2 }
                );
                drawingUtils.drawLandmarks(landmarks, {
                  color: "#00FF00",
                  radius: 1,
                });
              }
            }

            // Draw pose landmarks
            if (poseLandmarks) {
              drawingUtils.drawLandmarks(poseLandmarks, {
                color: "#FFFF00",
                radius: 3,
              });
              drawingUtils.drawConnectors(
                poseLandmarks,
                PoseLandmarker.POSE_CONNECTIONS,
                { color: "#00FFFF", lineWidth: 3 }
              );
            }

            ctx.restore();
          } catch (e) {
            console.warn("MediaPipe error (ignored):", e);
          }

          animationFrameId = requestAnimationFrame(renderLoop);
        };

        renderLoop();
      };

      startCamera();
    };

    initModelsAndCamera();

    return () => {
      cameraRunningRef.current = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const videoConstraints = {
    facingMode: "user",
    width: 640,
    height: 480,
  };

  return (
    <div
      style={{
        height: "100vh",
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 640,
          height: 480,
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            transform: "scaleX(-1)",
            visibility: "hidden",
          }}
        />

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </div>
  );
}

export default App;
