import React from 'react';

/**
 * Stage 3: Upper Body Side Ghost - Realistic Human Proportions
 */
const UpperBodySideGhost = ({ isAligned, holdDuration = 0, stage3Debug = null }) => {
  // Color scheme from LandingPage - Professional cyan/blue/slate
  const primaryColor = isAligned ? '#06B6D4' : '#64748B';
  const successColor = '#06B6D4';
  const guidanceColor = '#F59E0B';

  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);
  const feedbackMessage = stage3Debug?.feedbackMessage || '';

  return (
    <svg
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        height: '100dvh',
        maxHeight: '100dvh',
        pointerEvents: 'none',
        zIndex: 10
      }}
      viewBox="0 0 960 720"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Top Instruction - Clean & Minimal */}
      <g>
        <rect x="230" y="20" width="500" height="70" rx="8"
          fill="rgba(2, 6, 23, 0.85)"
          stroke={primaryColor}
          strokeWidth="2"
          opacity="0.95"
        />
        <text
          x="480"
          y="48"
          textAnchor="middle"
          fill={isAligned ? successColor : '#94A3B8'}
          fontSize="18"
          fontWeight="600"
          letterSpacing="1"
          style={{ textTransform: 'uppercase' }}
        >
          Step 3: Side Profile
        </text>
        <text
          x="480"
          y="72"
          textAnchor="middle"
          fill={isAligned ? successColor : '#E2E8F0'}
          fontSize="24"
          fontWeight="bold"
        >
          {isAligned ? '✓ Hold Position' : 'Turn to Your Right Side'}
        </text>
      </g>

      {/* REALISTIC UPPER BODY SIDE SILHOUETTE */}
      <g transform="translate(480, 390)">
        {/* Glow effect when aligned */}
        {isAligned && (
          <ellipse
            cx="0"
            cy="0"
            rx="140"
            ry="320"
            fill="none"
            stroke={successColor}
            strokeWidth="20"
            opacity="0.15"
            filter="blur(20px)"
          />
        )}

        {/* Unified Realistic Side Profile Silhouette */}
        <path
          d="M 10 -280 
             Q 55 -280 55 -230 
             L 65 -220 L 55 -210 
             Q 55 -180 35 -165 
             Q 30 -140 35 -120 
             C 55 -100 65 -60 60 -20 
             Q 55 40 50 145 
             L -20 145 
             Q -35 100 -30 60 
             Q -35 -20 -30 -80 
             Q -35 -130 -40 -160 
             Q -50 -200 10 -280 Z"
          fill="rgba(6, 182, 212, 0.08)"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isAligned ? "0" : "10 5"}
        />

        {/* Arm Hints */}
        <path
          d="M 15 -80 Q 25 -40 25 20 L 20 100"
          stroke={primaryColor}
          strokeWidth="2"
          strokeDasharray={isAligned ? "0" : "5 5"}
          fill="none"
          opacity="0.5"
        />

        {/* Rotation indicator */}
        {!isAligned && feedbackMessage.includes('TURN') && (
          <g>
            <circle cx="0" cy="-50" r="60" fill="none" stroke={guidanceColor} strokeWidth="3" strokeDasharray="8 4" opacity="0.6">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 -50"
                to="360 0 -50"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <text x="0" y="-35" textAnchor="middle" fill={guidanceColor} fontSize="32" fontWeight="bold">↻</text>
          </g>
        )}

        {/* Center Alignment Indicator */}
        {!isAligned && !feedbackMessage.includes('TURN') && (
          <>
            <line x1="0" y1="-300" x2="0" y2="-330" stroke={guidanceColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="0" cy="0" r="8" fill={guidanceColor} opacity="0.4">
              <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Countdown Display */}
        {isAligned && holdDuration > 0 && (
          <g>
            <circle cx="0" cy="0" r="110" fill="none" stroke={successColor} strokeWidth="3" opacity="0.2" />
            <circle
              cx="0"
              cy="0"
              r="100"
              fill="none"
              stroke={successColor}
              strokeWidth="6"
              strokeDasharray={`${progress * 6.28} 628`}
              strokeLinecap="round"
              transform="rotate(-90)"
              opacity="0.9"
            />
            <text x="0" y="20" textAnchor="middle" fill={successColor} fontSize="80" fontWeight="bold"
              style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.8))' }}
            >
              {countdown}
            </text>
            <text x="0" y="65" textAnchor="middle" fill={successColor} fontSize="18" fontWeight="600" opacity="0.8">
              Hold still...
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

export default UpperBodySideGhost;