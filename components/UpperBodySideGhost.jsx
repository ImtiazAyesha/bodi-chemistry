import React from 'react';

/**
 * Stage 3: Upper Body Side Ghost - Simple side profile outline with countdown
 */
const UpperBodySideGhost = ({ isAligned, holdDuration = 0, stage3Debug = null }) => {
  const strokeColor = isAligned ? '#00FF00' : '#B0B0B0';
  const strokeWidth = 3;
  const fillColor = 'rgba(200, 200, 200, 0.15)';
  
  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);

  // Extract feedback from debug info
  const feedbackMessage = stage3Debug?.feedbackMessage || '';
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
      {/* Instruction Banner */}
      <rect
        x="0"
        y="0"
        width="960"
        height="90"
        fill="rgba(255, 140, 0, 0.9)"
      />
      <text
        x="480"
        y="35"
        textAnchor="middle"
        fill="#FFF"
        fontSize="32"
        fontWeight="bold"
      >
        🔄 TURN TO YOUR RIGHT SIDE
      </text>
      <text
        x="480"
        y="70"
        textAnchor="middle"
        fill="#FFF"
        fontSize="24"
      >
        {isAligned ? '✓ Perfect! Hold Still!' : 'Position upper body in outline'}
      </text>

      {/* Simple side profile - MUCH WIDER and TALLER */}
      <g transform="translate(480, 400)">
        {/* Head - side view - BIGGER */}
        <ellipse
          cx="0"
          cy="-250"
          rx="120"
          ry="140"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Neck - WIDER */}
        <path
          d="M -30 -130 L -40 -80"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Back/Spine - WIDER curve */}
        <path
          d="M -60 -70 Q -80 0, -90 80 Q -95 160, -85 230"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Chest/Front - MUCH WIDER curve */}
        <path
          d="M 10 -70 Q 70 -20, 85 60 Q 95 140, 80 210"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Torso fill - WIDER */}
        <path
          d="M 10 -70 Q 70 -20, 85 60 Q 95 140, 80 210 
             L -85 230 Q -95 160, -90 80 Q -80 0, -60 -70 Z"
          fill={fillColor}
          stroke="none"
        />

        {/* Shoulder - BIGGER */}
        <ellipse
          cx="-25"
          cy="-60"
          rx="70"
          ry="60"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Arm - simple line */}
        <path
          d="M -75 -40 L -90 80"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Belly - WIDER */}
        <path
          d="M 80 210 Q 90 240, 75 260"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        {/* DYNAMIC DIRECTIONAL ARROWS */}
        {!isAligned && (
          <>
            {(feedbackMessage === 'MOVE LEFT' || feedbackMessage === 'A BIT LEFT') && (
              <g opacity="0.9">
                <path d="M 200 350 L 140 350 L 155 335 M 140 350 L 155 365" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="170" cy="350" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="170" y="365" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">←</text>
              </g>
            )}
            {(feedbackMessage === 'MOVE RIGHT' || feedbackMessage === 'A BIT RIGHT') && (
              <g opacity="0.9">
                <path d="M 760 350 L 820 350 L 805 335 M 820 350 L 805 365" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="790" cy="350" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="790" y="365" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">→</text>
              </g>
            )}
            {(feedbackMessage === 'MOVE UP' || feedbackMessage === 'A BIT UP') && (
              <g opacity="0.9">
                <path d="M 480 120 L 480 60 L 465 75 M 480 60 L 495 75" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="480" cy="90" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="480" y="105" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↑</text>
              </g>
            )}
            {(feedbackMessage === 'MOVE DOWN' || feedbackMessage === 'A BIT DOWN') && (
              <g opacity="0.9">
                <path d="M 480 620 L 480 680 L 465 665 M 480 680 L 495 665" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="480" cy="650" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="480" y="665" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↓</text>
              </g>
            )}
            {feedbackMessage === 'TURN TO YOUR RIGHT SIDE' && (
              <g opacity="0.8">
                <path d="M 600 350 L 660 350 L 645 335 M 660 350 L 645 365" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" />
                <text x="630" y="340" textAnchor="middle" fill="#FFD700" fontSize="20" fontWeight="bold">TURN</text>
                <text x="630" y="365" textAnchor="middle" fill="#FFD700" fontSize="16">RIGHT</text>
              </g>
            )}
          </>
        )}

        {/* Countdown Display */}
        {isAligned && holdDuration > 0 && (
          <>
            <circle
              cx="0"
              cy="50"
              r="90"
              fill="none"
              stroke="#00FF00"
              strokeWidth="8"
              strokeDasharray={`${progress * 5.65} 565`}
              transform="rotate(-90 0 50)"
              opacity="0.8"
            />
            <text
              x="0"
              y="70"
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
        Stage 3 of 4: Upper Body Side
      </text>
    </svg>
  );
};

export default UpperBodySideGhost;
