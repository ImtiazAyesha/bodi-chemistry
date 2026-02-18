import React from 'react';

/**
 * Ghost Overlay Component
 * Displays a semi-transparent body outline to guide user positioning
 * 
 * Props:
 * - isAligned: boolean - whether user is properly aligned
 * - stage: number - current capture stage (1=face, 2-4=body)
 */
const GhostOverlay = ( { isAligned, stage = 1 } ) => {
  // Determine if it's face stage or body stage
  const isFaceStage = stage === 1;

  // Build class names
  const svgClasses = [
    'ghost-svg',
    isFaceStage ? 'face-stage' : 'body-stage',
    isAligned ? 'aligned' : ''
  ].filter( Boolean ).join( ' ' );

  return (
    <div className="ghost-container">
      <svg
        className={ svgClasses }
        viewBox="0 0 960 720"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Head Circle */ }
        <circle
          cx="480"
          cy="180"
          r="90"
        />

        {/* Neck */ }
        <line
          x1="480"
          y1="270"
          x2="480"
          y2="330"
        />

        {/* Shoulders */ }
        <line
          x1="330"
          y1="330"
          x2="630"
          y2="330"
        />

        {/* Torso */ }
        <rect
          x="390"
          y="330"
          width="180"
          height="210"
          rx="15"
        />

        {/* Left Arm */ }
        <line
          x1="330"
          y1="330"
          x2="270"
          y2="480"
        />

        {/* Right Arm */ }
        <line
          x1="630"
          y1="330"
          x2="690"
          y2="480"
        />

        {/* Left Leg */ }
        <line
          x1="420"
          y1="540"
          x2="420"
          y2="690"
        />

        {/* Right Leg */ }
        <line
          x1="540"
          y1="540"
          x2="540"
          y2="690"
        />

        {/* Instruction Text */ }
        <text
          x="480"
          y="45"
        >
          { isAligned ? '✓ Aligned - Ready to Capture' : 'Position yourself in the outline' }
        </text>

        {/* Inline styles for the SVG elements */ }
        <style>{ `
          /* Ghost container - full screen */
          .ghost-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 10;
          }

          /* SVG for BODY stages (2, 3, 4) - LARGER */
          .ghost-svg.body-stage {
            width: 78vw; /* 78% of viewport width */
            height: auto;
            max-width: 400px; /* Cap on large screens */
            min-width: 280px; /* Minimum for small screens */
            display: block;
            margin: auto;
          }

          /* SVG for FACE stage (1) - MEDIUM SIZE */
          .ghost-svg.face-stage {
            width: 65vw; /* 65% of viewport width */
            height: auto;
            max-width: 320px;
            min-width: 240px;
            display: block;
            margin: auto;
          }

          /* Stroke styling - default (not aligned) */
          .ghost-svg path,
          .ghost-svg line,
          .ghost-svg circle,
          .ghost-svg rect {
            stroke: #FFA500;
            stroke-width: 2;
            stroke-dasharray: 10 5;
            stroke-opacity: 0.6;
            fill: none;
            transition: all 0.3s ease;
          }

          /* Aligned state - bright green, thicker, solid */
          .ghost-svg.aligned path,
          .ghost-svg.aligned line,
          .ghost-svg.aligned circle,
          .ghost-svg.aligned rect {
            stroke: #00FF00;
            stroke-width: 4;
            stroke-dasharray: 0;
            filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.5));
          }

          /* Text instruction styling */
          .ghost-svg text {
            fill: #FFA500;
            font-size: 24px;
            font-weight: bold;
            text-anchor: middle;
            transition: fill 0.3s ease;
          }

          .ghost-svg.aligned text {
            fill: #00FF00;
          }

          /* Responsive adjustments for very small screens */
          @media (max-width: 375px) or (max-height: 667px) {
            .ghost-svg.body-stage {
              width: 75vw; /* Slightly smaller on tiny screens */
              min-width: 260px;
            }
            
            .ghost-svg.face-stage {
              width: 62vw;
              min-width: 220px;
            }
          }

          /* Adjustments for large screens */
          @media (min-width: 768px) {
            .ghost-svg.body-stage {
              width: 50vw; /* Smaller percentage on tablets/desktop */
              max-width: 450px;
            }
            
            .ghost-svg.face-stage {
              width: 40vw;
              max-width: 350px;
            }
          }
        `}</style>
      </svg>
    </div>
  );
};

export default GhostOverlay;