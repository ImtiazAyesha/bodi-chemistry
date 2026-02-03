import React from 'react';

/**
 * Stage 2: Upper Body Front Ghost - Realistic upper body front silhouette
 * Based on provided silhouette image
 */
const UpperBodyFrontGhost = ({ isAligned, holdDuration = 0, stage2Debug = null }) => {
  const strokeColor = isAligned ? '#00FF00' : '#B0B0B0';
  const strokeWidth = 3;
  const fillColor = 'rgba(200, 200, 200, 0.15)';
  
  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);

  const feedbackMessage = stage2Debug?.feedbackMessage || '';

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
      viewBox="0 0 960 720"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Instruction */}
      <text
        x="480"
        y="50"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="28"
        fontWeight="bold"
      >
        { isAligned ? '✓ Perfect! Hold Still!' : 'Position your upper body in the outline' }
      </text>

      {/* UPPER BODY FRONT SILHOUETTE - Centered */ }
      <g transform="translate(480, 360)">
        {/* Head - realistic oval */ }
        <ellipse
          cx="0"
          cy="-180"
          rx="65"
          ry="85"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Ears */ }
        <ellipse
          cx="-58"
          cy="-180"
          rx="12"
          ry="22"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />
        <ellipse
          cx="58"
          cy="-180"
          rx="12"
          ry="22"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Neck - tapered */ }
        <path
          d="M -28 -100 L -32 -60 L 32 -60 L 28 -100 Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Shoulders - wide curved shape */ }
        <path
          d="M -32 -60 
             Q -50 -55, -90 -50
             Q -130 -45, -150 -35
             L -150 -10
             L -90 -10
             Q -70 -15, -50 -20
             L -50 20
             Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />
        <path
          d="M 32 -60 
             Q 50 -55, 90 -50
             Q 130 -45, 150 -35
             L 150 -10
             L 90 -10
             Q 70 -15, 50 -20
             L 50 20
             Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Torso - trapezoid shape (wider at top, narrower at waist) */ }
        <path
          d="M -50 20
             L -75 180
             Q -75 190, -65 190
             L 65 190
             Q 75 190, 75 180
             L 50 20
             Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Left Arm */ }
        <path
          d="M -150 -10
             L -160 50
             L -170 120
             L -165 180
             Q -165 190, -155 190
             L -125 190
             Q -115 190, -115 180
             L -110 120
             L -100 50
             L -90 -10
             Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Right Arm */ }
        <path
          d="M 150 -10
             L 160 50
             L 170 120
             L 165 180
             Q 165 190, 155 190
             L 125 190
             Q 115 190, 115 180
             L 110 120
             L 100 50
             L 90 -10
             Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Wrist details */ }
        <ellipse cx="-140" cy="185" rx="20" ry="12" fill={ fillColor } stroke={ strokeColor } strokeWidth={ strokeWidth * 0.7 } opacity="0.6" />
        <ellipse cx="140" cy="185" rx="20" ry="12" fill={ fillColor } stroke={ strokeColor } strokeWidth={ strokeWidth * 0.7 } opacity="0.6" />

        {/* DYNAMIC DIRECTIONAL ARROWS */ }
        { !isAligned && (
          <>
            { ( feedbackMessage === 'MOVE LEFT' || feedbackMessage === 'A BIT LEFT' ) && (
              <g opacity="0.9">
                <path d="M -330 0 L -390 0 L -375 -15 M -390 0 L -375 15" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="-360" cy="0" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="-360" y="15" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">←</text>
              </g>
            ) }
            { ( feedbackMessage === 'MOVE RIGHT' || feedbackMessage === 'A BIT RIGHT' ) && (
              <g opacity="0.9">
                <path d="M 330 0 L 390 0 L 375 -15 M 390 0 L 375 15" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="360" cy="0" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="360" y="15" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">→</text>
              </g>
            ) }
            { ( feedbackMessage === 'MOVE UP' || feedbackMessage === 'A BIT UP' ) && (
              <g opacity="0.9">
                <path d="M 0 -300 L 0 -360 L -15 -345 M 0 -360 L 15 -345" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="0" cy="-330" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="0" y="-315" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↑</text>
              </g>
            ) }
            { ( feedbackMessage === 'MOVE DOWN' || feedbackMessage === 'A BIT DOWN' ) && (
              <g opacity="0.9">
                <path d="M 0 260 L 0 320 L -15 305 M 0 320 L 15 305" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="0" cy="290" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="0" y="305" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↓</text>
              </g>
            ) }
          </>
        ) }

        {/* Countdown Display */ }
        { isAligned && holdDuration > 0 && (
          <>
            <circle
              cx="0"
              cy="0"
              r="90"
              fill="none"
              stroke="#00FF00"
              strokeWidth="8"
              strokeDasharray={ `${ progress * 5.65 } 565` }
              transform="rotate(-90)"
              opacity="0.8"
            />
            <text
              x="0"
              y="20"
              textAnchor="middle"
              fill="#00FF00"
              fontSize="72"
              fontWeight="bold"
              style={ { filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.8))' } }
            >
              { countdown }
            </text>
          </>
        ) }
      </g>

      {/* Stage Indicator */}
      <text
        x="480"
        y="690"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="28"
        fontWeight="bold"
      >
        Stage 2 of 4: Upper Body Front
      </text>
    </svg>
  );
};

export default UpperBodyFrontGhost;
