import React from 'react';

/**
 * Stage 1: Face Ghost - Professional & User-Friendly
 * Redesigned with cyan/blue color scheme and improved UX
 */
const FaceGhost = ({ isAligned, holdDuration = 0, stage1Debug = null }) => {
  // Color scheme from LandingPage - Professional cyan/blue/slate
  const primaryColor = isAligned ? '#06B6D4' : '#64748B'; // cyan-500 : slate-500
  const accentColor = '#3B82F6'; // blue-500
  const successColor = '#06B6D4'; // cyan-400
  const guidanceColor = '#F59E0B'; // amber-500 for guidance

  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);
  const feedbackMessage = stage1Debug?.feedbackMessage || '';

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
        zIndex: 10,
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
          Step 1: Face Alignment
        </text>
        <text
          x="480"
          y="72"
          textAnchor="middle"
          fill={isAligned ? successColor : '#E2E8F0'}
          fontSize="24"
          fontWeight="bold"
        >
          {isAligned ? '✓ Hold Position' : 'Align Face with Outline'}
        </text>
      </g>

      {/* HEAD AND SHOULDERS SILHOUETTE - Enhanced */}
      <g transform="translate(480, 360)">
        {/* Glow effect when aligned */}
        {isAligned && (
          <ellipse
            cx="0"
            cy="-50"
            rx="200"
            ry="250"
            fill="none"
            stroke={successColor}
            strokeWidth="20"
            opacity="0.15"
            filter="blur(20px)"
          />
        )}

        {/* Realistic Head & Neck Silhouette */}
        <path
          d="M 0 -190 
             C 65 -190 95 -140 95 -80 
             C 95 -20 65 35 0 50 
             C -65 35 -95 -20 -95 -80 
             C -95 -140 -65 -190 0 -190 Z"
          fill="rgba(6, 182, 212, 0.08)"
          stroke={primaryColor}
          strokeWidth="3"
          strokeDasharray={isAligned ? "0" : "10 5"}
        >
          {!isAligned && (
            <animate
              attributeName="stroke-opacity"
              values="0.4;1;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Ears Detail */}
        <path d="M -95 -90 Q -105 -80 -95 -60" stroke={primaryColor} strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M 95 -90 Q 105 -80 95 -60" stroke={primaryColor} strokeWidth="3" fill="none" opacity="0.6" />

        {/* Neck & Shoulders */}
        <path
          d="M -45 40 
             Q -50 100 -180 120 
             L -180 180 
             L 180 180 
             L 180 120 
             Q 50 100 45 40 Z"
          fill="rgba(6, 182, 212, 0.08)"
          stroke={primaryColor}
          strokeWidth="3"
          strokeDasharray={isAligned ? "0" : "10 5"}
        />

        {/* Center Alignment Indicator */}
        {!isAligned && (
          <>
            <line x1="0" y1="-200" x2="0" y2="-230" stroke={guidanceColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="0" cy="-80" r="8" fill={guidanceColor} opacity="0.4">
              <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* IMPROVED DIRECTIONAL GUIDANCE - Modern & Clear */}
        {!isAligned && feedbackMessage && (
          <g>
            {/* Guidance Box */}
            <rect x="-120" y="240" width="240" height="55" rx="8"
              fill="rgba(2, 6, 23, 0.9)"
              stroke={guidanceColor}
              strokeWidth="2"
            />
            <text x="0" y="273" textAnchor="middle"
              fill={guidanceColor}
              fontSize="22"
              fontWeight="bold"
            >
              {feedbackMessage}
            </text>
          </g>
        )}

        {/* Countdown Display - Modern Circular Progress */}
        {isAligned && holdDuration > 0 && (
          <g>
            {/* Outer glow circle */}
            <circle
              cx="0"
              cy="-80"
              r="110"
              fill="none"
              stroke={successColor}
              strokeWidth="3"
              opacity="0.2"
            />
            {/* Progress ring */}
            <circle
              cx="0"
              cy="-80"
              r="100"
              fill="none"
              stroke={successColor}
              strokeWidth="6"
              strokeDasharray={`${progress * 6.28} 628`}
              strokeLinecap="round"
              transform="rotate(-90)"
              opacity="0.9"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="-90 0 -80"
                to="-90 0 -80"
                dur="0.1s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Countdown number */}
            <text
              x="0"
              y="-60"
              textAnchor="middle"
              fill={successColor}
              fontSize="80"
              fontWeight="bold"
              style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.8))' }}
            >
              {countdown}
            </text>
            <text
              x="0"
              y="-15"
              textAnchor="middle"
              fill={successColor}
              fontSize="18"
              fontWeight="600"
              opacity="0.8"
            >
              Hold still...
            </text>
          </g>
        )}
      </g>

    </svg>
  );
};

export default FaceGhost;