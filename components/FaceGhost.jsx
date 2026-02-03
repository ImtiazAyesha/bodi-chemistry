import React from 'react';

/**
 * Stage 1: Face Ghost - Realistic head and shoulders silhouette
 * Based on provided silhouette image
 */
const FaceGhost = ({ isAligned, holdDuration = 0, stage1Debug = null }) => {
  const strokeColor = isAligned ? '#00FF00' : '#B0B0B0';
  const strokeWidth = 3;
  const fillColor = 'rgba(200, 200, 200, 0.15)';
  
  const progress = ( holdDuration / 3000 ) * 100;
  const countdown = Math.ceil( ( 3000 - holdDuration ) / 1000 );

  const feedbackMessage = stage1Debug?.feedbackMessage || '';

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
        y="60"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="28"
        fontWeight="bold"
      >
        { isAligned ? '✓ Perfect! Hold Still!' : 'Position your head and shoulders in the outline' }
      </text>

      {/* HEAD AND SHOULDERS SILHOUETTE - Centered */ }
      <g transform="translate(480, 320)">
        {/* Head - realistic oval shape */ }
        <ellipse
          cx="0"
          cy="-80"
          rx="85"
          ry="110"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Ears - small circles on sides */ }
        <ellipse
          cx="-75"
          cy="-80"
          rx="18"
          ry="28"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />
        <ellipse
          cx="75"
          cy="-80"
          rx="18"
          ry="28"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Neck - tapered */ }
        <path
          d="M -35 20 L -40 80 L 40 80 L 35 20 Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Shoulders - realistic curved shape */ }
        <path
          d="M -40 80 
             Q -80 85, -140 100 
             Q -170 110, -180 130
             L -180 180
             L 180 180
             L 180 130
             Q 170 110, 140 100
             Q 80 85, 40 80
             Z"
          fill={ fillColor }
          stroke={ strokeColor }
          strokeWidth={ strokeWidth }
        />

        {/* Shoulder contour lines for depth */ }
        <path
          d="M -40 80 Q -60 90, -80 95"
          fill="none"
          stroke={ strokeColor }
          strokeWidth={ strokeWidth * 0.6 }
          opacity="0.5"
        />
        <path
          d="M 40 80 Q 60 90, 80 95"
          fill="none"
          stroke={ strokeColor }
          strokeWidth={ strokeWidth * 0.6 }
          opacity="0.5"
        />

        {/* DYNAMIC DIRECTIONAL ARROWS */ }
        { !isAligned && (
          <>
            { ( feedbackMessage === 'MOVE LEFT' || feedbackMessage === 'A BIT LEFT' ) && (
              <g opacity="0.9">
                <path d="M -280 0 L -340 0 L -325 -15 M -340 0 L -325 15" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="-310" cy="0" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="-310" y="15" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">←</text>
              </g>
            ) }
            { ( feedbackMessage === 'MOVE RIGHT' || feedbackMessage === 'A BIT RIGHT' ) && (
              <g opacity="0.9">
                <path d="M 280 0 L 340 0 L 325 -15 M 340 0 L 325 15" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="310" cy="0" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="310" y="15" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">→</text>
              </g>
            ) }
            { ( feedbackMessage === 'MOVE UP' || feedbackMessage === 'A BIT UP' ) && (
              <g opacity="0.9">
                <path d="M 0 -250 L 0 -310 L -15 -295 M 0 -310 L 15 -295" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="0" cy="-280" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="0" y="-265" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↑</text>
              </g>
            ) }
            { ( feedbackMessage === 'MOVE DOWN' || feedbackMessage === 'A BIT DOWN' ) && (
              <g opacity="0.9">
                <path d="M 0 250 L 0 310 L -15 295 M 0 310 L 15 295" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="0" cy="280" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="0" y="295" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↓</text>
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
        y="680"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="28"
        fontWeight="bold"
      >
        Stage 1 of 4: Face & Shoulders
      </text>
    </svg>
  );
};

export default FaceGhost;
