import React from 'react';

/**
 * Stage 4: Lower Body Side Ghost - Full body side profile with dynamic feedback
 */
const LowerBodySideGhost = ({ isAligned, holdDuration = 0, stage4Debug = null }) => {
  const strokeColor = isAligned ? '#00FF00' : '#B0B0B0';
  const strokeWidth = 3;
  const fillColor = 'rgba(200, 200, 200, 0.15)';
  
  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);

  // Extract feedback from debug info
  const feedbackMessage = stage4Debug?.feedbackMessage || '';
  const feedbackIcon = stage4Debug?.feedbackIcon || '';
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
        height="110"
        fill="rgba(138, 43, 226, 0.9)"
      />
      <text
        x="480"
        y="35"
        textAnchor="middle"
        fill="#FFF"
        fontSize="32"
        fontWeight="bold"
      >
        🦵 LOWER BODY SIDE VIEW - TURN RIGHT
      </text>
      <text
        x="480"
        y="70"
        textAnchor="middle"
        fill="#FFF"
        fontSize="24"
      >
        {isAligned ? '✓ Perfect Side View! Hold Still!' : 'Turn to your RIGHT SIDE - Show lower body (hips to toes)'}
      </text>
      <text
        x="480"
        y="95"
        textAnchor="middle"
        fill="#FFD700"
        fontSize="20"
        fontWeight="bold"
      >
        {isAligned ? '' : '👉 Stand 6-8 feet back, show complete side profile'}
      </text>

      {/* LOWER BODY ONLY - HIPS TO TOES */}
      <g transform="translate(480, 120)">
        {/* HIP/PELVIS - Top of lower body */}
        <ellipse
          cx="0"
          cy="0"
          rx="80"
          ry="50"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />


        {/* DYNAMIC DIRECTIONAL ARROWS - Show where to move */}
        {!isAligned && (
          <>
            {/* LEFT ARROW - Move to your right (camera left) */}
            {(feedbackMessage === 'MOVE LEFT' || feedbackMessage === 'A BIT LEFT') && (
              <g opacity="0.9">
                <path
                  d="M -200 150 L -260 150 L -245 135 M -260 150 L -245 165"
                  stroke="#FF6B00"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="-230" cy="150" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="-230" y="165" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">←</text>
              </g>
            )}

            {/* RIGHT ARROW - Move to your left (camera right) */}
            {(feedbackMessage === 'MOVE RIGHT' || feedbackMessage === 'A BIT RIGHT') && (
              <g opacity="0.9">
                <path
                  d="M 200 150 L 260 150 L 245 135 M 260 150 L 245 165"
                  stroke="#FF6B00"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="230" cy="150" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="230" y="165" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">→</text>
              </g>
            )}

            {/* UP ARROW - Step back (move away from camera) */}
            {(feedbackMessage === 'STEP BACK' || feedbackMessage === 'A BIT BACK') && (
              <g opacity="0.9">
                <path
                  d="M 0 -100 L 0 -160 L -15 -145 M 0 -160 L 15 -145"
                  stroke="#FF6B00"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="-130" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="0" y="-115" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↑</text>
              </g>
            )}

            {/* DOWN ARROW - Come closer (move toward camera) */}
            {(feedbackMessage === 'COME CLOSER' || feedbackMessage === 'A BIT CLOSER') && (
              <g opacity="0.9">
                <path
                  d="M 0 400 L 0 460 L -15 445 M 0 460 L 15 445"
                  stroke="#FF6B00"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="430" r="50" fill="rgba(255, 107, 0, 0.2)" stroke="#FF6B00" strokeWidth="4" />
                <text x="0" y="445" textAnchor="middle" fill="#FF6B00" fontSize="24" fontWeight="bold">↓</text>
              </g>
            )}

            {/* TURN RIGHT INDICATOR - For side view */}
            {feedbackMessage === 'TURN TO YOUR RIGHT SIDE' && (
              <g opacity="0.8">
                <path
                  d="M 120 0 L 180 0 L 165 -15 M 180 0 L 165 15"
                  stroke="#FFD700"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <text
                  x="150"
                  y="-10"
                  textAnchor="middle"
                  fill="#FFD700"
                  fontSize="20"
                  fontWeight="bold"
                >
                  TURN
                </text>
                <text
                  x="150"
                  y="15"
                  textAnchor="middle"
                  fill="#FFD700"
                  fontSize="16"
                >
                  RIGHT
                </text>
              </g>
            )}
          </>
        )}

        {/* Upper Leg (Thigh) - front */}
        <path
          d="M 40 20 Q 45 100, 40 180"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Upper Leg (Thigh) - back */}
        <path
          d="M -60 20 Q -55 100, -50 180"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Thigh fill */}
        <path
          d="M 40 20 Q 45 100, 40 180 L -50 180 Q -55 100, -60 20 Z"
          fill={fillColor}
          stroke="none"
        />

        {/* Knee - simple circle */}
        <ellipse
          cx="-5"
          cy="190"
          rx="40"
          ry="35"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Lower Leg (Calf) - front */}
        <path
          d="M 25 210 Q 20 270, 15 330"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Lower Leg (Calf) - back */}
        <path
          d="M -40 210 Q -45 260, -40 320"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Calf fill */}
        <path
          d="M 25 210 Q 20 270, 15 330 L -40 320 Q -45 260, -40 210 Z"
          fill={fillColor}
          stroke="none"
        />

        {/* Ankle */}
        <ellipse
          cx="-13"
          cy="340"
          rx="22"
          ry="20"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Foot - simple side profile */}
        <path
          d="M -13 355 L -8 375 L 70 380 Q 85 380, 85 370 L -5 365 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Heel */}
        <ellipse
          cx="-30"
          cy="370"
          rx="20"
          ry="25"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        
        {/* Countdown Display */}
        {isAligned && holdDuration > 0 && (
          <>
            <circle
              cx="0"
              cy="150"
              r="90"
              fill="none"
              stroke="#00FF00"
              strokeWidth="8"
              strokeDasharray={`${progress * 5.65} 565`}
              transform="rotate(-90 0 150)"
              opacity="0.8"
            />
            <text
              x="0"
              y="170"
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

        {/* Dynamic Feedback Indicator - Below Ghost */}
        {showFeedback && (
          <g transform="translate(0, 450)">
            {/* Background box */}
            <rect
              x="-150"
              y="-25"
              width="300"
              height="50"
              rx="10"
              fill="rgba(255, 165, 0, 0.85)"
              stroke="#FFD700"
              strokeWidth="3"
            />
            
            {/* Icon */}
            <text
              x="-100"
              y="10"
              textAnchor="middle"
              fill="#FFF"
              fontSize="28"
              fontWeight="bold"
            >
              {feedbackIcon}
            </text>
            
            {/* Message */}
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fill="#FFF"
              fontSize="20"
              fontWeight="bold"
            >
              {feedbackMessage}
            </text>
          </g>
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
        Stage 4 of 4: Lower Body Side - FINAL!
      </text>
    </svg>
  );
};

export default LowerBodySideGhost;
