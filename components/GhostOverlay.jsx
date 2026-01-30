import React from 'react';

/**
 * Ghost Overlay Component
 * Displays a semi-transparent body outline to guide user positioning
 * 
 * Props:
 * - isAligned: boolean - whether user is properly aligned
 * - scanMode: 'FRONT' | 'SIDE' - current scan mode
 */
const GhostOverlay = ({ isAligned, scanMode }) => {
  // Colors based on alignment status
  const strokeColor = isAligned ? '#00FF00' : '#FFA500'; // Green when aligned, Amber when not
  const strokeWidth = isAligned ? 4 : 2;
  const strokeDasharray = isAligned ? '0' : '10,5'; // Solid when aligned, dashed when not
  const opacity = 0.6;

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
      {/* Head Circle */}
      <circle
        cx="480"
        cy="180"
        r="90"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Neck */}
      <line
        x1="480"
        y1="270"
        x2="480"
        y2="330"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Shoulders */}
      <line
        x1="330"
        y1="330"
        x2="630"
        y2="330"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Torso */}
      <rect
        x="390"
        y="330"
        width="180"
        height="210"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
        rx="15"
      />
      
      {/* Left Arm */}
      <line
        x1="330"
        y1="330"
        x2="270"
        y2="480"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Right Arm */}
      <line
        x1="630"
        y1="330"
        x2="690"
        y2="480"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Left Leg */}
      <line
        x1="420"
        y1="540"
        x2="420"
        y2="690"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Right Leg */}
      <line
        x1="540"
        y1="540"
        x2="540"
        y2="690"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={opacity}
      />
      
      {/* Instruction Text */}
      <text
        x="480"
        y="45"
        textAnchor="middle"
        fill={strokeColor}
        fontSize="24"
        fontWeight="bold"
        opacity={opacity}
      >
        {isAligned ? '✓ Aligned - Ready to Capture' : 'Position yourself in the outline'}
      </text>
    </svg>
  );
};

export default GhostOverlay;
