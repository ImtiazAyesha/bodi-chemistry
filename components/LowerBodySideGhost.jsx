import React from 'react';

/**
 * Stage 4: Lower Body Side Ghost - Professional & User-Friendly
 * Uses the exact lower body outline requested, styled with the professional app theme.
 */
const LowerBodySideGhost = ({ isAligned, holdDuration = 0, stage4Debug = null }) => {
    const primaryColor = isAligned ? '#06B6D4' : '#64748B';
    const successColor = '#06B6D4';
    const guidanceColor = '#F59E0B';

    const countdown = Math.ceil((3000 - holdDuration) / 1000);
    const feedbackMessage = stage4Debug?.feedbackMessage || '';

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100dvh',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Top badges - Separate pills */}
            <div style={{
                marginTop: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                pointerEvents: 'none'
            }}>
                {/* Step Badge */}
                <div style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isAligned ? successColor : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '100px',
                    padding: '6px 16px',
                    boxShadow: isAligned ? `0 0 20px ${successColor}30` : '0 4px 20px rgba(0,0,0,0.4)',
                    transition: 'all 0.4s ease',
                    pointerEvents: 'auto'
                }}>
                    <span style={{
                        color: isAligned ? successColor : '#94A3B8',
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace'
                    }}>
                        Step 4: Lower Body Side
                    </span>
                </div>

                {/* Guidance Pill */}
                <div style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: `2px solid ${primaryColor}`,
                    borderRadius: '100px',
                    padding: '10px 20px', // Responsive padding
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'auto',
                    minWidth: '240px', // Slightly smaller min-width
                    maxWidth: '90vw', // Ensure it doesn't overflow
                    justifyContent: 'center'
                }}>
                    <div style={{
                        color: isAligned ? successColor : '#E2E8F0',
                        fontSize: 'clamp(16px, 4.5vw, 20px)', // Responsive font size
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'center'
                    }}>
                        {isAligned ? '✓ Perfect! Hold Position' : (feedbackMessage || 'Turn Right - Side Profile')}

                        {!isAligned && feedbackMessage && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                backgroundColor: `${guidanceColor}20`,
                                borderRadius: '50%',
                                border: `1px solid ${guidanceColor}40`
                            }}>
                                <svg width="18" height="18" viewBox="0 0 20 20">
                                    <g transform="translate(10, 10)">
                                        {(feedbackMessage.toLowerCase().includes('up')) && (
                                            <path d="M 0 -6 L -5 1 L -2 1 L -2 6 L 2 6 L 2 1 L 5 1 Z" fill={guidanceColor}>
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                        {(feedbackMessage.toLowerCase().includes('down')) && (
                                            <path d="M 0 6 L -5 -1 L -2 -1 L -2 -6 L 2 -6 L 2 -1 L 5 -1 Z" fill={guidanceColor}>
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                        {(feedbackMessage.toLowerCase().includes('left')) && (
                                            <path d="M -6 0 L 1 -5 L 1 -2 L 6 -2 L 6 2 L 1 2 L 1 5 Z" fill={guidanceColor}>
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                        {(feedbackMessage.toLowerCase().includes('right')) && (
                                            <path d="M 6 0 L -1 -5 L -1 -2 L -6 -2 L -6 2 L -1 2 L -1 5 Z" fill={guidanceColor}>
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                    </g>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SVG Container - Portrait-first scaling */}
            <svg
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    height: '100dvh',
                    maxWidth: '100vw',
                    maxHeight: '100dvh',
                    pointerEvents: 'none',
                }}
                viewBox="0 0 480 960"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <clipPath id="lower-body-clip">
                        <rect x="-240" y="-500" width="480" height="1000" />
                    </clipPath>
                </defs>

                {/* LOWER BODY SIDE SILHOUETTE - Calibrated for perfect portrait fit (y=580) */}
                <g transform="translate(240, 580)" clipPath="url(#lower-body-clip)">

                    {/* Glow effect focused on legs */}
                    {isAligned && (
                        <ellipse cx="0" cy="120" rx="160" ry="260"
                            fill="none" stroke={successColor}
                            strokeWidth="24" opacity="0.1"
                            filter="blur(24px)"
                        />
                    )}

                    {/* Scaled & Positioned Lower Body Silhouette - Dynamic scaling for ultra-safe margins across all devices */}
                    <g transform="scale(1.5) translate(0, -170)">
                        <path
                            d="M 40 -60 
                 Q 55 50 35 180 
                 C 35 240 20 280 25 320 
                 C 30 350 45 360 60 370 
                 Q 75 380 65 380 
                 L -15 380 
                 Q -45 380 -40 360 
                 C -35 340 -45 320 -45 300 
                 Q -60 260 -50 200 
                 Q -55 120 -75 50 
                 Q -90 0 -50 -60 
                 Z"
                            fill="rgba(6, 182, 212, 0.08)"
                            stroke={primaryColor}
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>

                    {/* COUNTDOWN - Positioned clearly above the silhouette mid-point */}
                    {isAligned && holdDuration > 0 && (
                        <g transform="translate(0, -180)">
                            <text x="0" y="-32" textAnchor="middle"
                                fill={successColor}
                                fontSize="100"
                                fontWeight="bold"
                                style={{ filter: 'drop-shadow(0 0 32px rgba(6,182,212,0.9))' }}
                            >
                                {countdown}
                            </text>
                            <text x="0" y="18" textAnchor="middle"
                                fill={successColor}
                                fontSize="20"
                                fontWeight="500"
                                opacity="0.85"
                            >
                                Hold still
                            </text>
                        </g>
                    )}
                </g>
            </svg>
        </div>
    );
};

export default LowerBodySideGhost;