import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

// Milestone 2 Imports
import { calculateDistance, calculateDistance2D, calculateAngle, calculateAngle3Points, formatMetric } from "./utils/geometry";
import { calculateTotalScore } from "./utils/scoring";
import DashboardOverlay from "./components/DashboardOverlay";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const faceLandmarkerRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const cameraRunningRef = useRef(false);

  // State for Dashboard
  const [ scanMode, setScanMode ] = useState( 'FRONT' ); // 'FRONT' | 'SIDE'
  const [ metrics, setMetrics ] = useState( {
    face: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0, irisWidth: 0 },
    body: { shoulderHeight: 0, fhpAngle: 0, pelvicTilt: 0, footOrient: 0 }
  } );
  const [ score, setScore ] = useState( { total: 100, face: 100, body: 100 } );

  // Refs for smoothing/throttling
  const lastInferenceTimeRef = useRef( 0 );
  const INFERENCE_INTERVAL_MS = 100; // Run inference max 10 times per second (Optimization)

  // FIX: Use a Ref for scanMode to access it inside the loop without re-running useEffect.
  const scanModeRef = useRef( scanMode );
  useEffect( () => {
    scanModeRef.current = scanMode;
  }, [ scanMode ] );

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

      // 2) Face landmarker (CPU Default)
      // Removed Delegate: GPU to fix compatibility and allow fallback
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      // 3) Pose landmarker (CPU Default)
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
          const shouldRunInference = ( now - lastInferenceTimeRef.current ) >= INFERENCE_INTERVAL_MS;

          // Drawing setup
          // FIX: Removed manual ctx.translate/scale flip because Canvas CSS has transform: scaleX(-1)
          // Both Loop Video Draw + Landmarks Draw -> Canvas CSS Flip -> Correct Mirror View
          ctx.save();
          ctx.clearRect( 0, 0, canvas.width, canvas.height );
          ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

          if ( shouldRunInference ) {
            lastInferenceTimeRef.current = now;

            try {
              const faceResult = faceLandmarkerRef.current.detectForVideo( video, now );
              const poseResult = poseLandmarkerRef.current.detectForVideo( video, now );

              let currentFaceMetrics = { ...metrics.face };
              let currentBodyMetrics = { ...metrics.body };

              // =========================
              // TASK 2.1 FACE METRICS
              // =========================
              if ( faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0 ) {
                const fl = faceResult.faceLandmarks[ 0 ];

                // 2. Draws - RESTORED FACE MESH
                drawingUtils.drawConnectors( fl, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C0", lineWidth: 0.1 } );
                // drawConnectors for Face Oval
                drawingUtils.drawConnectors( fl, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#FF0000", lineWidth: 1 } );

                // RESTORED: Draw Green Dots (Landmarks)
                drawingUtils.drawLandmarks( fl, { color: "#00FF00", radius: 1 } );


                // 1. Normalization Factor: Iris Width (Left 468, Right 473)
                // Use 3D distance for robust sizing
                const irisWidth = calculateDistance( fl[ 468 ], fl[ 473 ] );
                const normFactor = irisWidth > 0 ? irisWidth : 1;

                // 2. Eye Height Symmetry (Left 33, Right 263)
                // Compare Y coordinates. 
                const leftEye = fl[ 33 ];
                const rightEye = fl[ 263 ];
                const eyeDiffY = Math.abs( leftEye.y - rightEye.y );
                const eyeSym = eyeDiffY / normFactor;

                // 3. Jaw Midline Shift (Chin 152, Nose Bridge 6)
                // Compare X coordinates.
                const chin = fl[ 152 ];
                const noseBridge = fl[ 6 ];
                const jawDiffX = Math.abs( chin.x - noseBridge.x );
                const jawShift = jawDiffX / normFactor;

                // 4. Head Tilt (Angle between eyes)
                const tilt = calculateAngle( leftEye, rightEye ); // Should be 0 or 180 depending on order.
                // Ideally leftEye is x < rightEye x.
                // calculateAngle(left, right) -> 0 if horizontal.
                // We want deviation from horizontal.
                const headTilt = Math.abs( tilt ); // Simplified abs deviation

                // 5. Nostril Asymmetry (NoseTip 1, Left 279, Right 49)
                const noseTip = fl[ 1 ];
                const leftNostril = fl[ 279 ];
                const rightNostril = fl[ 49 ];
                // Use 3D dist
                const distL = calculateDistance( noseTip, leftNostril );
                const distR = calculateDistance( noseTip, rightNostril );
                const nostrilAsym = Math.abs( distL - distR ) / normFactor;

                currentFaceMetrics = {
                  eyeSym: formatMetric( eyeSym, 3 ),
                  jawShift: formatMetric( jawShift, 3 ),
                  headTilt: formatMetric( headTilt, 1 ),
                  nostrilAsym: formatMetric( nostrilAsym, 3 ),
                  irisWidth: irisWidth
                };

                // Visualize Eye Line (Over mesh)
                drawingUtils.drawConnectors( [ fl ], [ [ 33, 263 ] ], { color: "#00FF00", lineWidth: 2 } );
                // Visualize Jaw Line
                drawingUtils.drawConnectors( [ fl ], [ [ 6, 152 ] ], { color: "#FFFF00", lineWidth: 2 } );
              }

              // =========================
              // TASK 2.2 BODY METRICS
              // =========================
              if ( poseResult.landmarks && poseResult.landmarks.length > 0 ) {
                const pl = poseResult.landmarks[ 0 ];
                const plWorld = poseResult.worldLandmarks[ 0 ];

                // Draw Pose
                drawingUtils.drawConnectors( pl, PoseLandmarker.POSE_CONNECTIONS, { color: "#00FFFF", lineWidth: 2 } );
                drawingUtils.drawLandmarks( pl, { color: "#FFFF00", radius: 3 } );

                // Shoulder Height (Left 11, Right 12) - FRONT VIEW metric
                const leftShoulder = pl[ 11 ];
                const rightShoulder = pl[ 12 ];
                // Normalization: Shoulder Width
                const shoulderWidth = calculateDistance( leftShoulder, rightShoulder );
                const bodyNorm = shoulderWidth > 0 ? shoulderWidth : 1;

                const shoulderDiffY = Math.abs( leftShoulder.y - rightShoulder.y );
                const shoulderHeight = shoulderDiffY / bodyNorm;

                // FHP (Ear 7, Shoulder 11) - SIDE VIEW metric
                const ear = pl[ 7 ];
                const fhpAngleRaw = calculateAngle( ear, leftShoulder );
                const fhpAngle = Math.abs( fhpAngleRaw - 90 );

                // Pelvic Tilt
                let pelvicMetric = 0;
                if ( scanModeRef.current === 'FRONT' ) {
                  const leftHip = pl[ 23 ];
                  const rightHip = pl[ 24 ];
                  pelvicMetric = Math.abs( leftHip.y - rightHip.y ) / bodyNorm;
                } else {
                  const leftHip = pl[ 23 ];
                  const leftKnee = pl[ 25 ];
                  const pelvAngleRaw = calculateAngle( leftHip, leftKnee );
                  pelvicMetric = Math.abs( pelvAngleRaw - 90 );
                }

                // Foot Orientation (Toe 31, Heel 29) - SIDE / General
                const leftHeel = pl[ 29 ];
                const leftToe = pl[ 31 ];
                const footAngleRaw = calculateAngle( leftHeel, leftToe );
                const footOrient = Math.abs( footAngleRaw ); // Simplified

                currentBodyMetrics = {
                  shoulderHeight: formatMetric( shoulderHeight, 3 ),
                  fhpAngle: formatMetric( fhpAngle, 1 ),
                  pelvicTilt: formatMetric( pelvicMetric, 2 ),
                  footOrient: formatMetric( footOrient, 1 )
                };
              }

              // Update State
              setMetrics( {
                face: currentFaceMetrics,
                body: currentBodyMetrics
              } );

              const newScore = calculateTotalScore( {
                face: currentFaceMetrics,
                body: currentBodyMetrics
              } );
              setScore( newScore );

              // DEBUG LOGS (Requested)
              console.log( "=== Bodi Kemistri Frame Stats ===" );
              console.log( "Scan Mode:", scanModeRef.current );
              console.log( "Face Metrics:", currentFaceMetrics );
              console.log( "Body Metrics:", currentBodyMetrics );
              console.log( "Total Score:", newScore );
              console.log( "=================================" );

            } catch ( e ) {
              console.warn( "Inference error:", e );
            }
          }
          // Restore not strictly needed if we didn't transform, but good practice if code evolves
          ctx.restore();

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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* DASHBOARD OVERLAY */ }
      <DashboardOverlay
        metrics={ metrics }
        score={ score }
        scanMode={ scanMode }
        setScanMode={ setScanMode }
      />

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
            transform: "scaleX(-1)", // Mirror CSS
            visibility: "hidden", // Hide actual video, draw on canvas
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
            transform: "scaleX(-1)", // Mirror CSS
          }}
        />
      </div>
    </div>
  );
}

export default App;
