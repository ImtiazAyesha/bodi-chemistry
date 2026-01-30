import React from 'react';

/**
 * Stage 1: Face Ghost - Simple outline style with countdown
 */
const FaceGhost = ({ isAligned, holdDuration = 0, stage1Debug = null }) => {
  const strokeColor = isAligned ? '#00FF00' : '#B0B0B0';
  const strokeWidth = 3;
  const fillColor = 'rgba(200, 200, 200, 0.15)';
  
  const progress = (holdDuration / 3000) * 100; // 0-100%
  const countdown = Math.ceil((3000 - holdDuration) / 1000); // 3, 2, 1, 0

  // Extract feedback from debug info
  const feedbackMessage = stage1Debug?.feedbackMessage || '';
  const showFeedback = !isAligned && feedbackMessage;

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
        y="80"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="32"
        fontWeight="bold"
      >
        {isAligned ? '✓ Aligned - Hold Still!' : 'Position your face in the outline'}
      </text>

      {/* Simple head outline - BIGGER */}
      <ellipse
        cx="480"
        cy="320"
        rx="160"
        ry="200"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Neck */}
      <rect
        x="430"
        y="500"
        width="100"
        height="80"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        rx="15"
      />

      {/* DYNAMIC DIRECTIONAL ARROWS */}
      {!isAligned && (
        <>
          {(feedbackMessage === 'MOVE LEFT' || feedbackMessage === 'A BIT LEFT') && (
            <g opacity="0.9">
              <path d="M 200 320 L 140 320 L 155 305 M 140 320 L 155 335" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="170" cy="320" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="170" y="335" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">←</text>
            </g>
          )}
          {(feedbackMessage === 'MOVE RIGHT' || feedbackMessage === 'A BIT RIGHT') && (
            <g opacity="0.9">
              <path d="M 760 320 L 820 320 L 805 305 M 820 320 L 805 335" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="790" cy="320" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="790" y="335" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">→</text>
            </g>
          )}
          {(feedbackMessage === 'MOVE UP' || feedbackMessage === 'A BIT UP') && (
            <g opacity="0.9">
              <path d="M 480 150 L 480 90 L 465 105 M 480 90 L 495 105" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="480" cy="120" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="480" y="135" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↑</text>
            </g>
          )}
          {(feedbackMessage === 'MOVE DOWN' || feedbackMessage === 'A BIT DOWN') && (
            <g opacity="0.9">
              <path d="M 480 600 L 480 660 L 465 645 M 480 660 L 495 645" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="480" cy="630" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="480" y="645" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↓</text>
            </g>
          )}
        </>
      )}

      {/* Countdown Display */}
      {isAligned && holdDuration > 0 && (
        <>
          {/* Circular Progress Bar */}
          <circle
            cx="480"
            cy="320"
            r="90"
            fill="none"
            stroke="#00FF00"
            strokeWidth="8"
            strokeDasharray={`${progress * 5.65} 565`}
            transform="rotate(-90 480 320)"
            opacity="0.8"
          />
          
          {/* Countdown Number */}
          <text
            x="480"
            y="340"
            textAnchor="middle"
            fill="#00FF00"
            fontSize="72"
            fontWeight="bold"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.8))' }}
          >
            {countdown}
          </text>
        </>
      )}

      {/* Stage Indicator */}
      <text
        x="480"
        y="660"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="28"
        fontWeight="bold"
      >
        Stage 1 of 4: Face
      </text>
    </svg>
  );
};

export default FaceGhost;
