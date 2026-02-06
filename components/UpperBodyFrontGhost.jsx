import React from 'react';

/**
 * Stage 2: Upper Body Front Ghost - Professional & User-Friendly
 * Redesigned with cyan/blue color scheme and improved UX
 */
const UpperBodyFrontGhost = ({ isAligned, holdDuration = 0, stage2Debug = null }) => {
  // Color scheme from LandingPage - Professional cyan/blue/slate
  const primaryColor = isAligned ? '#06B6D4' : '#64748B'; // cyan-500 : slate-500
  const successColor = '#06B6D4'; // cyan-400
  const guidanceColor = '#F59E0B'; // amber-500 for guidance

  const progress = (holdDuration / 3000) * 100;
  const countdown = Math.ceil((3000 - holdDuration) / 1000);
  const feedbackMessage = stage2Debug?.feedbackMessage || '';

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
          Step 2: Upper Body Front
        </text>
        <text
          x="480"
          y="72"
          textAnchor="middle"
          fill={isAligned ? successColor : '#E2E8F0'}
          fontSize="24"
          fontWeight="bold"
        >
          {isAligned ? '✓ Hold Position' : 'Align Upper Body'}
        </text>
      </g>

      {/* UPPER BODY FRONT SILHOUETTE - Enhanced */}
      <g transform="translate(480, 380)">
        {/* Glow effect when aligned */}
        {isAligned && (
          <ellipse
            cx="0"
            cy="-100"
            rx="240"
            ry="350"
            fill="none"
            stroke={successColor}
            strokeWidth="20"
            opacity="0.15"
            filter="blur(20px)"
          />
        )}

        {/* Unified Realistic Upper Body Silhouette */}
        <path
          d="M 0 -270 
             C 50 -270 75 -220 75 -180 
             C 75 -140 40 -100 30 -90 
             Q 60 -80 100 -60 
             Q 140 -50 170 -35 
             Q 190 -15 175 40 
             L 165 110 
             L 155 190 
             L -155 190 
             L -165 110 
             Q -190 -15 -170 -35 
             Q -140 -50 -100 -60 
             Q -60 -80 -30 -90 
             C -40 -100 -75 -140 -75 -180 
             C -75 -220 -50 -270 0 -270 Z"
          fill="rgba(6, 182, 212, 0.08)"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isAligned ? "0" : "10 5"}
        />

        {/* Detail Lines (Arm/Torso Separation) */}
        <path
          d="M -165 110 L -120 30 M 165 110 L 120 30"
          stroke={primaryColor}
          strokeWidth="2"
          opacity="0.4"
          fill="none"
        />

        {/* Center Alignment Indicators */}
        {!isAligned && (
          <>
            <line x1="-200" y1="0" x2="-230" y2="0" stroke={guidanceColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <line x1="200" y1="0" x2="230" y2="0" stroke={guidanceColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="0" cy="0" r="8" fill={guidanceColor} opacity="0.4">
              <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* IMPROVED DIRECTIONAL GUIDANCE */}
        {!isAligned && feedbackMessage && (
          <g>
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

export default UpperBodyFrontGhost;