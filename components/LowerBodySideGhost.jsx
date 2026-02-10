import React from 'react';

/**
 * Stage 4: Lower Body Side Ghost - Professional & User-Friendly
 * Uses the exact lower body outline requested, styled with the professional app theme.
 */
const LowerBodySideGhost = ({ isAligned, holdDuration = 0, stage4Debug = null }) => {
    const brandSage = '#8FA99B';
    const brandSlate = '#2F4A5C';
    const brandDeepSage = '#6F8F84';
    const brandSand = '#EFE9DF';

    const primaryColor = isAligned ? brandSage : brandSlate;
    const successColor = brandSage;
    const guidanceColor = brandDeepSage;

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
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isAligned ? successColor : 'rgba(47, 74, 92, 0.1)'}`,
                    borderRadius: '100px',
                    padding: '8px 20px',
                    boxShadow: isAligned ? `0 0 30px ${successColor}20` : '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.4s ease',
                    pointerEvents: 'auto'
                }}>
                    <span style={{
                        color: isAligned ? successColor : brandSlate,
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontFamily: 'inherit'
                    }}>
                        Step 4: Lateral Lower
                    </span>
                </div>

                {/* Guidance Pill */}
                <div style={{
                    backgroundColor: 'rgba(47, 74, 92, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: `2px solid ${isAligned ? successColor : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '24px',
                    padding: '14px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'auto',
                    minWidth: '280px',
                    maxWidth: '90vw',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        color: '#FFFFFF',
                        fontSize: 'clamp(18px, 5vw, 22px)',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase'
                    }}>
                        {isAligned ? '✓ Hold Position' : (feedbackMessage || 'Turn to your side')}

                        {!isAligned && feedbackMessage && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <g transform="translate(10, 10)">
                                        {(feedbackMessage.toLowerCase().includes('up')) && (
                                            <path d="M 0 -6 L -5 1 L -2 1 L -2 6 L 2 6 L 2 1 L 5 1 Z" fill="#FFFFFF">
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                        {(feedbackMessage.toLowerCase().includes('down')) && (
                                            <path d="M 0 6 L -5 -1 L -2 -1 L -2 -6 L 2 -6 L 2 -1 L 5 -1 Z" fill="#FFFFFF">
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                        {(feedbackMessage.toLowerCase().includes('left')) && (
                                            <path d="M -6 0 L 1 -5 L 1 -2 L 6 -2 L 6 2 L 1 2 L 1 5 Z" fill="#FFFFFF">
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                            </path>
                                        )}
                                        {(feedbackMessage.toLowerCase().includes('right')) && (
                                            <path d="M 6 0 L -1 -5 L -1 -2 L -6 -2 L -6 2 L -1 2 L -1 5 Z" fill="#FFFFFF">
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
                            strokeWidth="24" opacity="0.15"
                            filter="blur(24px)"
                        />
                    )}

                    {/* Scaled & Positioned Lower Body Silhouette */}
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
                            fill="rgba(47, 74, 92, 0.05)"
                            stroke={primaryColor}
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>

                    {/* COUNTDOWN */}
                    {isAligned && holdDuration > 0 && (
                        <g transform="translate(0, -180)">
                            <text x="0" y="-32" textAnchor="middle"
                                fill={successColor}
                                fontSize="100"
                                fontFamily="inherit"
                                fontWeight="700"
                                style={{ filter: 'drop-shadow(0 0 40px rgba(143,169,155,0.6))' }}
                            >
                                {countdown}
                            </text>
                            <text x="0" y="24" textAnchor="middle"
                                fill={brandSlate}
                                fontSize="22"
                                fontWeight="700"
                                textTransform="uppercase"
                                letterSpacing="2px"
                            >
                                Steady
                            </text>
                        </g>
                    )}
                </g>
            </svg>
        </div>
    );
};

export default LowerBodySideGhost;
