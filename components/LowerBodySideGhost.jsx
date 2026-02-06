import React from 'react';

/**
 * Stage 4: Lower Body Side Ghost - Professional & User-Friendly
 * Uses the exact lower body outline requested, styled with the professional app theme.
 */
const LowerBodySideGhost = ({ isAligned, holdDuration = 0, stage4Debug = null }) => {
    // Color scheme from LandingPage - Professional cyan/blue/slate
    const primaryColor = isAligned ? '#06B6D4' : '#64748B'; // Cyan aligned, Slate default
    const successColor = '#06B6D4'; // Cyan
    const guidanceColor = '#F59E0B'; // Amber
    const fillColor = isAligned ? 'rgba(6, 182, 212, 0.1)' : 'rgba(100, 116, 139, 0.1)';

    const progress = (holdDuration / 3000) * 100;
    const countdown = Math.ceil((3000 - holdDuration) / 1000);
    const feedbackMessage = stage4Debug?.feedbackMessage || '';

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
            {/* Top Instruction - Clean & Minimal (Matches Stage 1-3) */}
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
                    Step 4: Lower Body Side
                </text>
                <text
                    x="480"
                    y="72"
                    textAnchor="middle"
                    fill={isAligned ? successColor : '#E2E8F0'}
                    fontSize="24"
                    fontWeight="bold"
                >
                    {isAligned ? '✓ Hold Position' : 'Turn Right - Lower Body Side'}
                </text>
            </g>

            {/* LOWER BODY SIDE SILHOUETTE - Your Exact Outline Preserved */}
            {/* Centered in viewport (translate 480, 180) - Calculated to be perfectly vertically centered */}
            <g transform="translate(480, 180)">

                {/* Glow effect when aligned */}
                {isAligned && (
                    <ellipse
                        cx="0"
                        cy="150"
                        rx="120"
                        ry="250"
                        fill="none"
                        stroke={successColor}
                        strokeWidth="20"
                        opacity="0.15"
                        filter="blur(20px)"
                    />
                )}

                {/* REALISTIC LOWER BODY SIDE SILHOUETTE */}
                <path
                    d="M 40 -60 
                       Q 55 50 35 180 
                       L 35 220 
                       Q 30 280 20 340 
                       L 60 365 
                       Q 70 375 70 380 
                       L -20 380 
                       Q -40 380 -40 365 
                       Q -35 340 -40 320 
                       Q -60 260 -50 200 
                       Q -55 120 -75 50 
                       Q -90 0 -50 -60 
                       Z"
                    fill={fillColor}
                    stroke={primaryColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={isAligned ? "0" : "10 5"}
                />

                {/* Knee Cap Detail */}
                <path
                    d="M 15 210 Q 25 210 32 220"
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray={isAligned ? "0" : "5 5"}
                />

                {/* Ankle Bone Detail */}
                <circle
                    cx="-15"
                    cy="345"
                    r="6"
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray={isAligned ? "0" : "5 5"}
                />

                {/* Rotation indicator (Style matched to Stage 3) */}
                {!isAligned && feedbackMessage.includes('TURN') && (
                    <g>
                        <circle cx="0" cy="-80" r="50" fill="none" stroke={guidanceColor} strokeWidth="3" strokeDasharray="8 4" opacity="0.6">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 0 -80"
                                to="360 0 -80"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <text x="0" y="-70" textAnchor="middle" fill={guidanceColor} fontSize="28" fontWeight="bold">↻</text>
                    </g>
                )}

                {/* Countdown Display (Style matched to Stage 3) */}
                {isAligned && holdDuration > 0 && (
                    <g>
                        <circle cx="0" cy="150" r="110" fill="none" stroke={successColor} strokeWidth="3" opacity="0.2" />
                        <circle
                            cx="0"
                            cy="150"
                            r="100"
                            fill="none"
                            stroke={successColor}
                            strokeWidth="6"
                            strokeDasharray={`${progress * 6.28} 628`}
                            strokeLinecap="round"
                            transform="rotate(-90 0 150)"
                            opacity="0.9"
                        />
                        <text x="0" y="170" textAnchor="middle" fill={successColor} fontSize="80" fontWeight="bold"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.8))' }}
                        >
                            {countdown}
                        </text>
                        <text x="0" y="215" textAnchor="middle" fill={successColor} fontSize="18" fontWeight="600" opacity="0.8">
                            Hold still...
                        </text>
                    </g>
                )}
            </g>
        </svg >
    );
};

export default LowerBodySideGhost;