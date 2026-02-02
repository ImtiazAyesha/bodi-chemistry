import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

// Utils
import { calculateDistance, calculateDistance2D, calculateAngle, calculateAngle3Points, formatMetric } from "./utils/geometry";
import { calculateTotalScore } from "./utils/scoring";
import analyzePatterns from "./utils/patternAnalyzer";

// Navigation Components
import LandingPage from "./components/LandingPage";
import Questionnaire from "./components/Questionnaire";
import InstructionPage from "./components/InstructionPage";
import ProcessingScreen from "./components/ProcessingScreen";

// Components - 4 Stage Ghosts
import FaceGhost from "./components/FaceGhost";
import UpperBodyFrontGhost from "./components/UpperBodyFrontGhost";
import UpperBodySideGhost from "./components/UpperBodySideGhost";
import LowerBodySideGhost from "./components/LowerBodySideGhost";
import ResultsScreen from "./components/ResultsScreen";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const faceLandmarkerRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const cameraRunningRef = useRef(false);

  // Navigation State - Controls which screen is shown
  const [ appStage, setAppStage ] = useState( 'LANDING' );
  // Possible values: 'LANDING' → 'QUESTIONNAIRE' → 'INSTRUCTIONS' → 'CAPTURE' → 'PROCESSING' → 'RESULTS'

  // Questionnaire Data
  const [ questionnaireAnswers, setQuestionnaireAnswers ] = useState( {} );
  const [ questionnaireScore, setQuestionnaireScore ] = useState( 50 );

  // 4-Stage Capture System
  const [ captureStage, setCaptureStage ] = useState( 'STAGE_1_FACE' );
  // States: 'STAGE_1_FACE' → 'STAGE_2_UPPER_FRONT' → 'STAGE_3_UPPER_SIDE' → 'STAGE_4_LOWER_SIDE' → 'COMPLETE'

  const [ isAligned, setIsAligned ] = useState( false );
  const [ showResults, setShowResults ] = useState( false );

  // Auto-capture timer states
  const [ holdDuration, setHoldDuration ] = useState( 0 ); // 0 to 3000ms
  const alignmentTimerRef = useRef( null );

  // Screen freeze states
  const [ isFrozen, setIsFrozen ] = useState( false );
  const [ frozenImage, setFrozenImage ] = useState( null );

  // Debug mode - toggle to show/hide landmarks
  const [ showLandmarks, setShowLandmarks ] = useState( true ); // Set to true to see landmarks

  // Capture Data Storage
  const [ captureData, setCaptureData ] = useState( {
    stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } },
    stage2: { image: null, metrics: { shoulderHeight: 0 } },
    stage3: { image: null, metrics: { fhpAngle: 0 } },
    stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
  } );

  // Current metrics (live)
  const [ metrics, setMetrics ] = useState( {
    face: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0, irisWidth: 0 },
    body: { shoulderHeight: 0, fhpAngle: 0, pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 }
  } );

  // Debug info for all stages (to display feedback on screen)
  const [ stage1Debug, setStage1Debug ] = useState( null );
  const [ stage2Debug, setStage2Debug ] = useState( null );
  const [ stage3Debug, setStage3Debug ] = useState( null );
  const [ stage4Debug, setStage4Debug ] = useState( null );

  // Pattern Analysis Results
  const [ patternResults, setPatternResults ] = useState( null );

  // Refs for render loop
  const lastInferenceTimeRef = useRef( 0 );
  const lastAlignmentCheckRef = useRef( 0 );
  const renderLoopRef = useRef( null ); // Store render loop function for restart
  const INFERENCE_INTERVAL_MS = 100;
  const ALIGNMENT_CHECK_INTERVAL = 200;

  const captureStageRef = useRef( captureStage );
  useEffect( () => {
    captureStageRef.current = captureStage;
  }, [ captureStage ] );

  // Restart render loop when unfrozen
  useEffect( () => {
    if ( !isFrozen && renderLoopRef.current && appStage === 'CAPTURE' ) {
      console.log( '🔄 Restarting render loop - screen unfrozen' );
      renderLoopRef.current();
    }
  }, [ isFrozen, appStage ] );

  // Run pattern analysis when entering PROCESSING stage
  useEffect( () => {
    if ( appStage === 'PROCESSING' && captureData.stage4.image ) {
      console.log( '=== STARTING PATTERN ANALYSIS (useEffect) ===' );

      // Combine all metrics for pattern analysis
      const combinedMetrics = {
        face: {
          eyeSym: captureData.stage1.metrics.eyeSym,
          jawShift: captureData.stage1.metrics.jawShift,
          headTilt: captureData.stage1.metrics.headTilt,
          nostrilAsym: captureData.stage1.metrics.nostrilAsym
        },
        body: {
          shoulderHeight: captureData.stage2.metrics.shoulderHeight,
          fhpAngle: captureData.stage3.metrics.fhpAngle,
          pelvicTilt: captureData.stage4.metrics.pelvicTilt,
          kneeAngle: captureData.stage4.metrics.kneeAngle,
          footArchRatio: captureData.stage4.metrics.footArchRatio
        }
      };

      console.log( 'Combined Metrics for Pattern Analysis:', combinedMetrics );

      // Run pattern analysis
      const patterns = analyzePatterns( combinedMetrics );
      setPatternResults( patterns );

      console.log( 'Pattern Analysis Complete:', patterns );
      console.log( '=== PATTERN ANALYSIS END ===\n' );
    }
  }, [ appStage, captureData ] );

  // Initialize MediaPipe and Camera
  useEffect(() => {
    let animationFrameId;

    const initModelsAndCamera = async () => {
      if (!webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const drawingUtils = new DrawingUtils(ctx);

      // Load MediaPipe models
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

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

          // Skip inference if screen is frozen - STOP THE LOOP
          if ( isFrozen ) {
            console.log( '🛑 Render loop stopped - screen is frozen' );
            return; // Don't continue the loop
          }

          const shouldRunInference = ( now - lastInferenceTimeRef.current ) >= INFERENCE_INTERVAL_MS;

          // Draw video frame
          ctx.save();
          ctx.clearRect( 0, 0, canvas.width, canvas.height );
          ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

          if ( shouldRunInference && !showResults ) {
            lastInferenceTimeRef.current = now;

            try {
              // For Stage 4, ONLY run pose detection (no face mesh)
              const isStage4 = captureStageRef.current === 'STAGE_4_LOWER_SIDE';

              const faceResult = isStage4 ? null : faceLandmarkerRef.current.detectForVideo( video, now );
              const poseResult = poseLandmarkerRef.current.detectForVideo( video, now );

              let currentFaceMetrics = { ...metrics.face };
              let currentBodyMetrics = { ...metrics.body };

              // Face Metrics (SKIP for Stage 4)
              if ( !isStage4 && faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0 ) {
                const fl = faceResult.faceLandmarks[ 0 ];

                // Debug mode: Draw landmarks if enabled
                if ( showLandmarks ) {
                  drawingUtils.drawConnectors( fl, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C0", lineWidth: 0.1 } );
                  drawingUtils.drawLandmarks( fl, { color: "#00FF00", radius: 1 } );
                }

                // Calculate metrics
                const irisWidth = calculateDistance( fl[ 468 ], fl[ 473 ] );
                const normFactor = irisWidth > 0 ? irisWidth : 1;

                const leftEye = fl[ 33 ];
                const rightEye = fl[ 263 ];
                const eyeDiffY = Math.abs( leftEye.y - rightEye.y );
                const eyeSym = eyeDiffY / normFactor;

                const chin = fl[ 152 ];
                const noseBridge = fl[ 6 ];
                const jawDiffX = Math.abs( chin.x - noseBridge.x );
                const jawShift = jawDiffX / normFactor;

                const tilt = calculateAngle( leftEye, rightEye );
                const headTilt = Math.abs( tilt );

                const noseTip = fl[ 1 ];
                const leftNostril = fl[ 98 ];  // Correct left nostril landmark
                const rightNostril = fl[ 327 ]; // Correct right nostril landmark
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

                // Alignment check
                const shouldCheckAlignment = ( now - lastAlignmentCheckRef.current ) >= ALIGNMENT_CHECK_INTERVAL;
                if ( shouldCheckAlignment ) {
                  const aligned = checkAlignment( captureStageRef.current, fl, poseResult.landmarks?.[ 0 ] );
                  setIsAligned( aligned );
                  lastAlignmentCheckRef.current = now;
                }
              }

              // Body Metrics
              if ( poseResult.landmarks && poseResult.landmarks.length > 0 ) {
                const pl = poseResult.landmarks[ 0 ];

                // Debug mode: Draw landmarks if enabled
                if ( showLandmarks ) {
                  drawingUtils.drawConnectors( pl, PoseLandmarker.POSE_CONNECTIONS, { color: "#00FFFF", lineWidth: 2 } );
                  drawingUtils.drawLandmarks( pl, { color: "#FFFF00", radius: 3 } );
                }

                const leftShoulder = pl[ 11 ];
                const rightShoulder = pl[ 12 ];
                const shoulderWidth = calculateDistance( leftShoulder, rightShoulder );
                const bodyNorm = shoulderWidth > 0 ? shoulderWidth : 1;

                const shoulderDiffY = Math.abs( leftShoulder.y - rightShoulder.y );
                const shoulderHeight = shoulderDiffY / bodyNorm;

                const ear = pl[ 7 ];
                const fhpAngleRaw = calculateAngle( ear, leftShoulder );
                const fhpAngle = Math.abs( fhpAngleRaw - 90 );

                const leftHip = pl[ 23 ];
                const leftKnee = pl[ 25 ];
                const pelvAngleRaw = calculateAngle( leftHip, leftKnee );
                const pelvicTilt = Math.abs( pelvAngleRaw - 90 );

                // METRIC 7: Knee Valgus Angle (Joint Angle at Knee)
                // Uses Hip (23) -> Knee (25) -> Ankle (27)
                // Expected: 165-180° (170-180° is normal, 165-170° is mild valgus)
                const leftAnkle = pl[ 27 ];
                const kneeAngle = calculateAngle3Points( leftHip, leftKnee, leftAnkle );

                // METRIC 8: Foot Arch Collapse Ratio
                // Uses Ankle (27), Heel (29), Toe (31)
                // Expected: 0.20-0.40 (0.30-0.40 is normal, lower = flat foot)
                const leftHeel = pl[ 29 ];
                const leftToe = pl[ 31 ];

                // Calculate baseline distance (heel to toe)
                const baselineDistance = calculateDistance2D( leftHeel, leftToe );

                // Calculate perpendicular distance from ankle to heel-toe line
                // Point-to-line distance formula
                const A = leftToe.y - leftHeel.y;
                const B = leftHeel.x - leftToe.x;
                const C = leftToe.x * leftHeel.y - leftHeel.x * leftToe.y;
                const archHeightPerpendicular = Math.abs( A * leftAnkle.x + B * leftAnkle.y + C ) /
                  Math.sqrt( A * A + B * B );

                // Calculate foot arch ratio
                const footArchRatio = baselineDistance > 0 ? archHeightPerpendicular / baselineDistance : 0;

                currentBodyMetrics = {
                  shoulderHeight: formatMetric( shoulderHeight, 3 ),
                  fhpAngle: formatMetric( fhpAngle, 1 ),
                  pelvicTilt: formatMetric( pelvicTilt, 2 ),
                  kneeAngle: formatMetric( kneeAngle, 1 ),
                  footArchRatio: formatMetric( footArchRatio, 3 )
                };
              }

              // Alignment check for Stage 4 (pose only, no face) - MOVED OUTSIDE pose block
              // This ensures it runs even if pose landmarks aren't detected
              if ( isStage4 ) {
                console.log( 'Stage 4: Checking alignment...' ); // Debug: confirm we reach here
                console.log( 'Stage 4: poseResult =', poseResult ); // DEBUG: What's in poseResult?
                console.log( 'Stage 4: poseResult.landmarks =', poseResult?.landmarks ); // DEBUG: Are landmarks present?

                const shouldCheckAlignment = ( now - lastAlignmentCheckRef.current ) >= ALIGNMENT_CHECK_INTERVAL;
                if ( shouldCheckAlignment ) {
                  const poseLandmarks = poseResult?.landmarks?.[ 0 ];
                  console.log( 'Stage 4: Passing poseLandmarks =', poseLandmarks ); // DEBUG: What are we passing?
                  console.log( 'Stage 4: Calling checkAlignment with stage =', captureStageRef.current ); // DEBUG: What stage?

                  const aligned = checkAlignment( captureStageRef.current, null, poseLandmarks );
                  setIsAligned( aligned );
                  lastAlignmentCheckRef.current = now;
                }
              }

              // Alignment check for Stages 2 & 3 (pose only, no face required)
              const isStage2or3 = captureStageRef.current === 'STAGE_2_UPPER_FRONT' || captureStageRef.current === 'STAGE_3_UPPER_SIDE';
              if ( isStage2or3 ) {
                const shouldCheckAlignment = ( now - lastAlignmentCheckRef.current ) >= ALIGNMENT_CHECK_INTERVAL;
                if ( shouldCheckAlignment ) {
                  const poseLandmarks = poseResult?.landmarks?.[ 0 ];
                  const aligned = checkAlignment( captureStageRef.current, null, poseLandmarks );
                  setIsAligned( aligned );
                  lastAlignmentCheckRef.current = now;
                }
              }

              setMetrics( {
                face: currentFaceMetrics,
                body: currentBodyMetrics
              } );

            } catch ( e ) {
              console.warn( "Inference error:", e );
            }
          }

          ctx.restore();
          animationFrameId = requestAnimationFrame(renderLoop);
        };

        // Store renderLoop in ref for restart capability
        renderLoopRef.current = renderLoop;
        renderLoop();
      };

      startCamera();
    };

    initModelsAndCamera();

    return () => {
      cameraRunningRef.current = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [ appStage ] );

  // Alignment check logic for each stage
  const checkAlignment = ( stage, faceLandmarks, poseLandmarks ) => {
    console.log( 'checkAlignment called with stage:', stage ); // DEBUG: Confirm function is called

    // Don't return early for null faceLandmarks - Stage 4 doesn't need face!
    // Each stage will validate what it needs

    switch ( stage ) {
      case 'STAGE_1_FACE':
        // Stage 1 requires face landmarks
        if ( !faceLandmarks ) return false;

        // Check if nose is inside face ghost circle (centered)
        const noseTip = faceLandmarks[ 1 ];
        const isXAligned1 = noseTip.x >= 0.35 && noseTip.x <= 0.65;
        const isYAligned1 = noseTip.y >= 0.20 && noseTip.y <= 0.50;

        // Generate granular feedback for Stage 1
        let feedbackMsg1 = '';
        let feedbackIcon1 = '';

        if ( !isXAligned1 ) {
          if ( noseTip.x < 0.35 ) {
            feedbackMsg1 = noseTip.x < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT';
          } else {
            feedbackMsg1 = noseTip.x > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT';
          }
          feedbackIcon1 = noseTip.x < 0.35 ? '⬅' : '➡️';
        } else if ( !isYAligned1 ) {
          if ( noseTip.y < 0.20 ) {
            feedbackMsg1 = noseTip.y < 0.10 ? 'MOVE DOWN' : 'A BIT DOWN';
          } else {
            feedbackMsg1 = noseTip.y > 0.60 ? 'MOVE UP' : 'A BIT UP';
          }
          feedbackIcon1 = noseTip.y < 0.20 ? '⬇️' : '⬆️';
        }

        setStage1Debug( {
          aligned: isXAligned1 && isYAligned1,
          feedbackMessage: feedbackMsg1,
          feedbackIcon: feedbackIcon1
        } );

        return isXAligned1 && isYAligned1;

      case 'STAGE_2_UPPER_FRONT':
        // Check if shoulders are visible and centered
        if ( !poseLandmarks ) return false;
        const leftShoulder = poseLandmarks[ 11 ];
        const rightShoulder = poseLandmarks[ 12 ];
        const shoulderCenterX = ( leftShoulder.x + rightShoulder.x ) / 2;
        const shoulderCenterY = ( leftShoulder.y + rightShoulder.y ) / 2;

        const isXAligned2 = shoulderCenterX >= 0.40 && shoulderCenterX <= 0.60;
        const isYAligned2 = shoulderCenterY >= 0.25 && shoulderCenterY <= 0.55;

        // Generate granular feedback for Stage 2
        let feedbackMsg2 = '';
        let feedbackIcon2 = '';

        if ( !isXAligned2 ) {
          if ( shoulderCenterX < 0.40 ) {
            feedbackMsg2 = shoulderCenterX < 0.30 ? 'MOVE LEFT' : 'A BIT LEFT';
          } else {
            feedbackMsg2 = shoulderCenterX > 0.70 ? 'MOVE RIGHT' : 'A BIT RIGHT';
          }
          feedbackIcon2 = shoulderCenterX < 0.40 ? '⬅' : '➡️';
        } else if ( !isYAligned2 ) {
          if ( shoulderCenterY < 0.25 ) {
            feedbackMsg2 = shoulderCenterY < 0.15 ? 'MOVE DOWN' : 'A BIT DOWN';
          } else {
            feedbackMsg2 = shoulderCenterY > 0.65 ? 'MOVE UP' : 'A BIT UP';
          }
          feedbackIcon2 = shoulderCenterY < 0.25 ? '⬇️' : '⬆️';
        }

        setStage2Debug( {
          aligned: isXAligned2 && isYAligned2,
          feedbackMessage: feedbackMsg2,
          feedbackIcon: feedbackIcon2
        } );

        return isXAligned2 && isYAligned2;

      case 'STAGE_3_UPPER_SIDE':
        // Detect side view ONLY by shoulder width - ignore visibility
        if ( !poseLandmarks ) {
          console.log( 'Stage 3 Debug: No pose landmarks detected' );
          return false;
        }
        const leftShoulder3 = poseLandmarks[ 11 ];
        const rightShoulder3 = poseLandmarks[ 12 ];

        if ( !leftShoulder3 || !rightShoulder3 ) {
          console.log( 'Stage 3 Debug: Shoulders not detected' );
          return false;
        }

        // In side view, shoulders appear close together (narrow width)
        const shoulderDistance = Math.abs( leftShoulder3.x - rightShoulder3.x );
        const isSideView = shoulderDistance < 0.45; // Very lenient threshold

        // CRITICAL: Check if user is actually IN the frame (centered)
        const shoulderCenterX3 = ( leftShoulder3.x + rightShoulder3.x ) / 2;
        const shoulderCenterY3 = ( leftShoulder3.y + rightShoulder3.y ) / 2;

        // User must be reasonably centered horizontally and vertically
        const isHorizontallyCentered = shoulderCenterX3 >= 0.35 && shoulderCenterX3 <= 0.65;
        const isVerticallyCentered = shoulderCenterY3 >= 0.25 && shoulderCenterY3 <= 0.55;
        const isInFrame = isHorizontallyCentered && isVerticallyCentered;

        console.log( 'Stage 3 Debug:', {
          shoulderDistance: shoulderDistance.toFixed( 3 ),
          isSideView,
          shoulderCenterX: shoulderCenterX3.toFixed( 3 ),
          shoulderCenterY: shoulderCenterY3.toFixed( 3 ),
          isInFrame,
          aligned: isSideView && isInFrame
        } );

        // Generate granular feedback for Stage 3
        let feedbackMsg3 = '';
        if ( !isSideView ) {
          feedbackMsg3 = 'TURN TO YOUR RIGHT SIDE';
        } else if ( !isHorizontallyCentered ) {
          feedbackMsg3 = shoulderCenterX3 < 0.35 ? ( shoulderCenterX3 < 0.25 ? 'MOVE LEFT' : 'A BIT LEFT' ) : ( shoulderCenterX3 > 0.75 ? 'MOVE RIGHT' : 'A BIT RIGHT' );
        } else if ( !isVerticallyCentered ) {
          feedbackMsg3 = shoulderCenterY3 < 0.25 ? ( shoulderCenterY3 < 0.15 ? 'MOVE DOWN' : 'A BIT DOWN' ) : ( shoulderCenterY3 > 0.65 ? 'MOVE UP' : 'A BIT UP' );
        }
        setStage3Debug( { aligned: isSideView && isInFrame, feedbackMessage: feedbackMsg3, feedbackIcon: '' } );

        // Check shoulder distance AND position in frame
        return isSideView && isInFrame;

      case 'STAGE_4_LOWER_SIDE':
        // MODERATE DIFFICULTY: Just check for side view
        // Not too easy (any position) and not too hard (strict foot detection)
        console.log( 'Stage 4: poseLandmarks =', poseLandmarks ); // DEBUG: What are we receiving?

        if ( !poseLandmarks ) {
          console.log( 'Stage 4 Debug: No pose landmarks detected' );
          return false;
        }

        const leftHip4 = poseLandmarks[ 23 ];
        const rightHip4 = poseLandmarks[ 24 ];

        // Check if hips are detected
        if ( !leftHip4 || !rightHip4 ) {
          console.log( 'Stage 4 Debug: Hip landmarks not detected' );
          return false;
        }

        // Check for side view - STRICT threshold for true side profile
        // In side view, hips appear close together (overlapping)
        const hipDistance4 = Math.abs( leftHip4.x - rightHip4.x );
        const isSideView4 = hipDistance4 < 0.12; // STRICT - must be true side view


        const hipCenterX4 = ( leftHip4.x + rightHip4.x ) / 2;
        const hipCenterY4 = ( leftHip4.y + rightHip4.y ) / 2;

        // Optional: Check if lower body landmarks are visible (for debug only)
        const leftAnkle4 = poseLandmarks[ 27 ];
        const rightAnkle4 = poseLandmarks[ 28 ];
        const leftFoot4 = poseLandmarks[ 31 ];
        const rightFoot4 = poseLandmarks[ 32 ];
        const footDetected = ( leftFoot4 || rightFoot4 ) || ( leftAnkle4 || rightAnkle4 );

        // Calculate alignment feedback message (PRIORITY ORDER)
        let feedbackMessage = '';
        let feedbackIcon = '';

        if ( !isSideView4 ) {
          // PRIORITY 1: Side view (most important)
          feedbackMessage = 'TURN TO YOUR RIGHT SIDE';
          feedbackIcon = '↻';
        } else if ( hipCenterX4 < 0.35 ) {
          // PRIORITY 2: Too far left - Granular feedback (FLIPPED for mirror)
          if ( hipCenterX4 < 0.25 ) {
            feedbackMessage = 'MOVE LEFT';
            feedbackIcon = '⬅';
          } else {
            feedbackMessage = 'A BIT LEFT';
            feedbackIcon = '⬅';
          }
        } else if ( hipCenterX4 > 0.65 ) {
          // PRIORITY 3: Too far right - Granular feedback (FLIPPED for mirror)
          if ( hipCenterX4 > 0.75 ) {
            feedbackMessage = 'MOVE RIGHT';
            feedbackIcon = '➡️';
          } else {
            feedbackMessage = 'A BIT RIGHT';
            feedbackIcon = '➡️';
          }
        } else if ( hipCenterY4 > 0.70 ) {
          // PRIORITY 4: Too close - Granular feedback
          if ( hipCenterY4 > 0.80 ) {
            feedbackMessage = 'STEP BACK';
            feedbackIcon = '⬆️';
          } else {
            feedbackMessage = 'A BIT BACK';
            feedbackIcon = '⬆️';
          }
        } else if ( hipCenterY4 < 0.30 ) {
          // PRIORITY 5: Too far - Granular feedback
          if ( hipCenterY4 < 0.20 ) {
            feedbackMessage = 'COME CLOSER';
            feedbackIcon = '⬇️';
          } else {
            feedbackMessage = 'A BIT CLOSER';
            feedbackIcon = '⬇️';
          }
        } else {
          // All aligned!
          feedbackMessage = 'PERFECT! HOLD STILL';
          feedbackIcon = '✓';
        }

        const debugInfo4 = {
          hipDistance: hipDistance4.toFixed( 3 ),
          isSideView: isSideView4,
          hipPosition: {
            x: hipCenterX4.toFixed( 3 ),
            y: hipCenterY4.toFixed( 3 )
          },
          footDetected: footDetected,
          leftFoot: !!leftFoot4,
          rightFoot: !!rightFoot4,
          leftAnkle: !!leftAnkle4,
          rightAnkle: !!rightAnkle4,
          aligned: isSideView4, // Aligned if in side view!
          feedbackMessage: feedbackMessage,
          feedbackIcon: feedbackIcon
        };

        console.log( 'Stage 4 Debug:', debugInfo4 );

        // Store debug info for on-screen display
        setStage4Debug( debugInfo4 );

        // Return true if in side view (moderate difficulty)
        return isSideView4;

      default:
        return false;
    }
  };

  // Auto-capture timer effect
  useEffect( () => {
    console.log( 'Countdown effect: isAligned =', isAligned, 'holdDuration =', holdDuration ); // DEBUG

    if ( isAligned && !showResults ) {
      // Start countdown timer
      console.log( 'Starting countdown timer...' ); // DEBUG
      alignmentTimerRef.current = setInterval( () => {
        setHoldDuration( prev => {
          const newDuration = prev + 100;
          if ( newDuration >= 3000 ) {
            // Auto-capture triggered
            console.log( 'Auto-capture triggered at 3000ms!' ); // DEBUG
            clearInterval( alignmentTimerRef.current );
            handleCapture();
            return 0;
          }
          return newDuration;
        } );
      }, 100 );
    } else {
      // Reset timer if not aligned
      console.log( 'NOT aligned - resetting countdown' ); // DEBUG
      if ( alignmentTimerRef.current ) {
        clearInterval( alignmentTimerRef.current );
        alignmentTimerRef.current = null;
      }
      setHoldDuration( 0 );
    }

    return () => {
      if ( alignmentTimerRef.current ) {
        clearInterval( alignmentTimerRef.current );
      }
    };
  }, [ isAligned, showResults ] );

  // Helper function to capture clean frame without landmarks
  const captureCleanFrame = () => {
    const video = webcamRef.current?.video;
    if ( !video ) return null;

    // Create a temporary canvas for clean capture
    const tempCanvas = document.createElement( 'canvas' );
    tempCanvas.width = 960;
    tempCanvas.height = 720;
    const tempCtx = tempCanvas.getContext( '2d' );

    // Draw only the video frame (no landmarks)
    tempCtx.drawImage( video, 0, 0, 960, 720 );

    // Return clean image data URL
    return tempCanvas.toDataURL( 'image/png' );
  };

  // Capture handler
  const handleCapture = () => {
    if ( !isAligned ) return;

    // Capture clean frame WITHOUT landmarks
    const imageDataURL = captureCleanFrame();
    if ( !imageDataURL ) return;

    // Set freeze state (this can show landmarks for visual feedback)
    setIsFrozen( true );
    setFrozenImage( imageDataURL );

    switch ( captureStage ) {
      case 'STAGE_1_FACE':
        setCaptureData( prev => ( {
          ...prev,
          stage1: {
            image: imageDataURL,
            metrics: {
              eyeSym: metrics.face.eyeSym,
              jawShift: metrics.face.jawShift,
              headTilt: metrics.face.headTilt,
              nostrilAsym: metrics.face.nostrilAsym
            }
          }
        } ) );

        // Unfreeze after 2 seconds and move to next stage
        setTimeout( () => {
          setIsFrozen( false );
          setFrozenImage( null );
          setCaptureStage( 'STAGE_2_UPPER_FRONT' );
          setIsAligned( false );
        }, 2000 );
        break;

      case 'STAGE_2_UPPER_FRONT':
        setCaptureData( prev => ( {
          ...prev,
          stage2: {
            image: imageDataURL,
            metrics: { shoulderHeight: metrics.body.shoulderHeight }
          }
        } ) );

        setTimeout( () => {
          setIsFrozen( false );
          setFrozenImage( null );
          setCaptureStage( 'STAGE_3_UPPER_SIDE' );
          setIsAligned( false );
        }, 2000 );
        break;

      case 'STAGE_3_UPPER_SIDE':
        setCaptureData( prev => ( {
          ...prev,
          stage3: {
            image: imageDataURL,
            metrics: { fhpAngle: metrics.body.fhpAngle }
          }
        } ) );

        setTimeout( () => {
          setIsFrozen( false );
          setFrozenImage( null );
          setCaptureStage( 'STAGE_4_LOWER_SIDE' );
          setIsAligned( false );
        }, 2000 );
        break;

      case 'STAGE_4_LOWER_SIDE':
        setCaptureData( prev => ( {
          ...prev,
          stage4: {
            image: imageDataURL,
            metrics: {
              pelvicTilt: metrics.body.pelvicTilt,
              kneeAngle: metrics.body.kneeAngle,
              footArchRatio: metrics.body.footArchRatio
            }
          }
        } ) );

        // Analyze patterns after all captures complete
        setTimeout( () => {
          console.log( '=== STARTING PATTERN ANALYSIS ===' );

          // Combine all metrics for pattern analysis
          const combinedMetrics = {
            face: {
              eyeSym: captureData.stage1.metrics.eyeSym,
              jawShift: captureData.stage1.metrics.jawShift,
              headTilt: captureData.stage1.metrics.headTilt,
              nostrilAsym: captureData.stage1.metrics.nostrilAsym
            },
            body: {
              shoulderHeight: captureData.stage2.metrics.shoulderHeight,
              fhpAngle: captureData.stage3.metrics.fhpAngle,
              pelvicTilt: metrics.body.pelvicTilt,  // Use current metrics for stage 4
              kneeAngle: metrics.body.kneeAngle,
              footArchRatio: metrics.body.footArchRatio
            }
          };

          console.log( 'Combined Metrics for Pattern Analysis:', combinedMetrics );

          // Run pattern analysis - TEMP DISABLED
          // const patterns = analyzePatterns( combinedMetrics );
          // setPatternResults( patterns );
          setPatternResults( null );

          // console.log( 'Pattern Analysis Complete:', patterns );
          console.log( '=== PATTERN ANALYSIS END ===\n' );

          setIsFrozen( false );
          setFrozenImage( null );
          setAppStage( 'PROCESSING' );
        }, 2000 );
        break;

      default:
        break;
    }
  };

  // Restart handler
  const handleRestart = () => {
    // Reset to landing page
    setAppStage( 'LANDING' );

    // Reset capture stage
    setCaptureStage( 'STAGE_1_FACE' );
    setIsAligned( false );

    // Clear questionnaire data
    setQuestionnaireAnswers( {} );
    setQuestionnaireScore( 50 );

    // Clear capture data
    setCaptureData( {
      stage1: { image: null, metrics: { eyeSym: 0, jawShift: 0, headTilt: 0, nostrilAsym: 0 } },
      stage2: { image: null, metrics: { shoulderHeight: 0 } },
      stage3: { image: null, metrics: { fhpAngle: 0 } },
      stage4: { image: null, metrics: { pelvicTilt: 0, kneeAngle: 0, footArchRatio: 0 } }
    } );
  };

  const videoConstraints = {
    facingMode: "user",
    width: 960,
    height: 720,
  };

  // Show results screen
  // Navigation Flow - Show different screens based on appStage
  if ( appStage === 'LANDING' ) {
    return <LandingPage onStart={ () => setAppStage( 'QUESTIONNAIRE' ) } />;
  }

  if ( appStage === 'QUESTIONNAIRE' ) {
    return (
      <Questionnaire
        onComplete={ ( answers, score ) => {
          setQuestionnaireAnswers( answers );
          setQuestionnaireScore( score );
          setAppStage( 'INSTRUCTIONS' );
        } }
      />
    );
  }

  if ( appStage === 'INSTRUCTIONS' ) {
    return <InstructionPage onStart={ () => setAppStage( 'CAPTURE' ) } />;
  }

  if ( appStage === 'PROCESSING' ) {
    return <ProcessingScreen onComplete={ () => setAppStage( 'RESULTS' ) } />;
  }

  if ( appStage === 'RESULTS' ) {
    return (
      <ResultsScreen
        captureData={ captureData }
        questionnaireAnswers={ questionnaireAnswers }
        questionnaireScore={ questionnaireScore }
        patternResults={ patternResults }
        onRestart={ handleRestart }
      />
    );
  }

  // appStage === 'CAPTURE' - Show the 4-stage capture flow

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
      <div
        style={{
          position: "relative",
          width: 960,
          height: 720,
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
            width: 960,
            height: 720,
            transform: "scaleX(-1)",
            visibility: "hidden",
          }}
        />

        <canvas
          ref={canvasRef}
          width={ 960 }
          height={ 720 }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 960,
            height: 720,
            transform: "scaleX(-1)",
          } }
        />

        {/* Ghost Overlays - Show based on stage */ }
        { captureStage === 'STAGE_1_FACE' && !isFrozen && <FaceGhost isAligned={ isAligned } holdDuration={ holdDuration } stage1Debug={ stage1Debug } /> }
        { captureStage === 'STAGE_2_UPPER_FRONT' && !isFrozen && <UpperBodyFrontGhost isAligned={ isAligned } holdDuration={ holdDuration } stage2Debug={ stage2Debug } /> }
        { captureStage === 'STAGE_3_UPPER_SIDE' && !isFrozen && <UpperBodySideGhost isAligned={ isAligned } holdDuration={ holdDuration } stage3Debug={ stage3Debug } /> }
        { captureStage === 'STAGE_4_LOWER_SIDE' && !isFrozen && <LowerBodySideGhost isAligned={ isAligned } holdDuration={ holdDuration } stage4Debug={ stage4Debug } /> }

        {/* Frozen Image Overlay */ }
        { isFrozen && frozenImage && (
          <div style={ {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 960,
            height: 720,
            zIndex: 15,
            backgroundColor: '#000'
          } }>
            <img
              src={ frozenImage }
              alt="Captured"
              style={ {
                width: '100%',
                height: '100%',
                transform: 'scaleX(-1)'
              } }
            />
            <div style={ {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '64px',
              color: '#00FF00',
              fontWeight: 'bold',
              textShadow: '0 0 30px rgba(0,255,0,0.9)',
              animation: 'fadeInScale 0.3s ease-out'
            } }>
              ✅ CAPTURED!
            </div>
          </div>
        ) }

        {/* Status Indicator */ }
        { !isFrozen && (
          <div style={ {
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 30px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '20px',
            fontWeight: 'bold',
            zIndex: 20,
            border: isAligned ? '2px solid #00FF00' : '2px solid #666',
            boxShadow: isAligned ? '0 0 20px rgba(0,255,0,0.5)' : 'none',
            transition: 'all 0.3s ease'
          } }>
            { isAligned ? (
              <span style={ { color: '#00FF00' } }>
                🟢 Hold still... { Math.ceil( ( 3000 - holdDuration ) / 1000 ) }s
              </span>
            ) : (
              <span style={ { color: '#AAA' } }>
                ⚪ Align yourself with the guide
              </span>
            ) }
          </div>
        ) }

        <style>{ `
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 20px rgba(0,255,0,0.5);
              transform: translateX(-50%) scale(1);
            }
            50% {
              box-shadow: 0 0 40px rgba(0,255,0,1);
              transform: translateX(-50%) scale(1.05);
            }
          }
        `}</style>

        {/* Debug Toggle Button - Top Right */ }
        { !isFrozen && (
          <button
            onClick={ () => setShowLandmarks( !showLandmarks ) }
            style={ {
              position: 'absolute',
              top: 20,
              right: 20,
              padding: '10px 20px',
              backgroundColor: showLandmarks ? '#00FF00' : '#666',
              color: showLandmarks ? '#000' : '#FFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              zIndex: 20,
              boxShadow: showLandmarks ? '0 0 15px rgba(0,255,0,0.5)' : 'none',
              transition: 'all 0.3s ease'
            } }
          >
            { showLandmarks ? '👁️ Landmarks ON' : '👁️ Landmarks OFF' }
          </button>
        ) }
      </div>
    </div>
  );
}

export default App;
