import React from 'react';

/**
 * Stage 2: Upper Body Front Ghost - Simple outline style with countdown
 */
const UpperBodyFrontGhost = ({ isAligned, holdDuration = 0, stage2Debug = null }) => {
  const strokeColor = isAligned ? '#00FF00' : '#B0B0B0';
  const strokeWidth = 3;
  const fillColor = 'rgba(200, 200, 200, 0.15)';
  
  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);

  // Extract feedback from debug info
  const feedbackMessage = stage2Debug?.feedbackMessage || '';
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
        y="60"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="32"
        fontWeight="bold"
      >
        {isAligned ? '✓ Aligned - Hold Still!' : 'Position upper body in outline'}
      </text>

      {/* Head - smaller for upper body view */}
      <ellipse
        cx="480"
        cy="150"
        rx="80"
        ry="95"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Neck */}
      <rect
        x="450"
        y="235"
        width="60"
        height="50"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        rx="10"
      />

      {/* Torso - simple rounded rectangle, BIGGER */}
      <path
        d="M 330 280 
           L 310 520 
           Q 310 560, 340 580 
           L 620 580 
           Q 650 560, 650 520 
           L 630 280 
           Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Arms - simple lines */}
      <path
        d="M 330 300 L 270 480"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <path
        d="M 630 300 L 690 480"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* DYNAMIC DIRECTIONAL ARROWS */}
      {!isAligned && (
        <>
          {(feedbackMessage === 'MOVE LEFT' || feedbackMessage === 'A BIT LEFT') && (
            <g opacity="0.9">
              <path d="M 200 380 L 140 380 L 155 365 M 140 380 L 155 395" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="170" cy="380" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="170" y="395" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">←</text>
            </g>
          )}
          {(feedbackMessage === 'MOVE RIGHT' || feedbackMessage === 'A BIT RIGHT') && (
            <g opacity="0.9">
              <path d="M 760 380 L 820 380 L 805 365 M 820 380 L 805 395" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="790" cy="380" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="790" y="395" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">→</text>
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
              <path d="M 480 620 L 480 680 L 465 665 M 480 680 L 495 665" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="480" cy="650" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
              <text x="480" y="665" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↓</text>
            </g>
          )}
        </>
      )}

      {/* Countdown Display */}
      {isAligned && holdDuration > 0 && (
        <>
          <circle
            cx="480"
            cy="380"
            r="90"
            fill="none"
            stroke="#00FF00"
            strokeWidth="8"
            strokeDasharray={`${progress * 5.65} 565`}
            transform="rotate(-90 480 380)"
            opacity="0.8"
          />
          <text
            x="480"
            y="400"
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
        y="680"
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
