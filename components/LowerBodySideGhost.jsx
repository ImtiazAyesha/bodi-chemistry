const LowerBodySideGhost = ({ isAligned, holdDuration = 0, stage4Debug = null }) => {
    const brandSage = '#00FF00'; // Changed back to green for landmark feedback
    const brandSlate = '#2F4A5C';
    const brandDeepSage = '#6F8F84';
    const brandSand = '#EFE9DF';

    const primaryColor = isAligned ? '#00FF00' : 'rgba(255, 255, 255, 0.3)';
    const successColor = brandSage;
    // Calculate countdown: 2s green hold (no countdown), then 3s countdown (3, 2, 1)
    const isInHoldPeriod = holdDuration < 2000;
    const countdownDuration = holdDuration - 2000;
    const countdown = isInHoldPeriod ? null : Math.ceil((3000 - countdownDuration) / 1000);
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
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {/* Top badges - Step badge only */}
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
                        Step 4: Side Profile Lower
                    </span>
                </div>
            </div>

            {/* SVG Container - Pure CSS sizing, no JS, safe for real mobile devices */}
            <svg
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -40%)',
                    /* svh = small viewport height, excludes mobile browser chrome.
                       min(75vw, 60svh) keeps the full-body ghost within the visible
                       area on any real mobile device, regardless of browser chrome. */
                    width: 'min(75vw, 60svh)',
                    height: 'min(75vw, 60svh)',
                    maxWidth: '75vw',
                    maxHeight: '60svh',
                    pointerEvents: 'none',
                }}
                viewBox="0 0 480 960"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <clipPath id="side-lower-clip">
                        <rect x="-240" y="-600" width="480" height="1460" />
                    </clipPath>
                    {/* Clip the upper body at the waist, removing the hip outline */}
                    <clipPath id="upper-body-crop">
                        <rect x="-300" y="-550" width="600" height="480" />
                    </clipPath>
                </defs>

                {/* SIDE SILHOUETTE - Full body (upper + lower) positioned for complete view */}
                <g transform="translate(240, 420)" clipPath="url(#side-lower-clip)">

                    {/* Glow effect focused on full body */}
                    {isAligned && (
                        <ellipse cx="0" cy="-100" rx="140" ry="420"
                            fill="none" stroke={successColor}
                            strokeWidth="32" opacity="0.15"
                            filter="blur(32px)"
                        />
                    )}

                    {/* Upper body - clipped at waist level to meet lower body */}
                    <g clipPath="url(#upper-body-crop)">
                        <g transform="scale(2.55) translate(-100, -160)">
                            <path
                                d="M118.373 103.686c1.534-7.039 3.118-30.954-7.727-40.355-3.161-2.74-10.645-7.989-12.767-10.802-.398-.53-.666-1.339-.828-2.262 1.173-2.743 2.938-6.293 2.938-6.293 1.571-2.037 4.274-1.4 5.735-1.233 4.165.411 5.176-.837 5.176-.837.901-.572.421-2.886.421-2.886-.372-1.184.164-1.791.499-2.256.896-1.303.341-1.884.341-1.884l-.109-.554c1.005-.354 1.06-.904 1.06-.904l-.067-1.851c-.177-1.267.384-1.355.384-1.355 2.302-.097 2.217-1.583 2.217-1.583.073-.816-2.801-5.636-2.801-5.636-1.353-2.469.462-4.003.56-5.294.451-5.949-1.632-9.539-4.421-12.353C104.393.67 98.574-.097 94.79.009c-9.715.28-13.576 3.44-16.475 6.814-6.043 7.03-4.615 13.058-4.615 13.058.231 3.593 5.325 10.026 5.325 10.026 4.068 5.593 2.208 10.013 2.208 10.013l.07.013c.036 3.498-.561 7.514-3.069 9.971-8.181 7.989-15.019 21.787-7.2 43.528 3.373 9.365 16.623 31.006 11.792 37.984-5.836 8.415-17.354 19.96-5.568 40.59 0 0-.606 6.352-1.093 15.053h32.814c.104-1.967 2.387-10.583 2.314-12.763-.323-9.463.188-21.349 1.314-26.841 2.016-9.986 6.54-21.617 5.889-40.273-.031-1.346-.08-2.497-.123-3.496"
                                fill="rgba(47, 74, 92, 0.05)"
                                stroke={primaryColor}
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </g>

                    {/* Scaled & Positioned Lower Body Silhouette */}
                    <g transform="scale(0.9) translate(0, -30)">
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
                 Q -90 0 -50 -60"
                            fill="rgba(47, 74, 92, 0.05)"
                            stroke={primaryColor}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>

                    {/* COUNTDOWN - Show only after 2s hold period (displays 5-4-3-2-1) */}
                    {isAligned && !isInHoldPeriod && countdown !== null && (
                        <g transform="translate(0, -100)">
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
                                fill={successColor}
                                fontSize="22"
                                fontWeight="700"
                                letterSpacing="2px"
                                style={{ textTransform: 'uppercase' }}
                            >
                                Steady
                            </text>
                        </g>
                    )}
                </g>
            </svg>

            {/* Footer-style Guidance */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'rgba(47, 74, 92, 0.95)',
                backdropFilter: 'blur(16px)',
                borderTop: `2px solid ${isAligned ? successColor : 'rgba(255,255,255,0.1)'}`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'auto'
            }}>
                <div style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'center',
                    letterSpacing: '0.02em'
                }}>
                    {isAligned ? '✓ Hold Position' : (feedbackMessage || 'Align full side body')}

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
                                    {(feedbackMessage.toLowerCase().includes('closer')) && (
                                        <path d="M -7 0 L -1 -4 L -1 -1 L 1 -1 L 1 -4 L 7 0 L 1 4 L 1 1 L -1 1 L -1 4 Z" fill="#FFFFFF">
                                            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
                                        </path>
                                    )}
                                    {(feedbackMessage.toLowerCase().includes('back')) && (
                                        <g>
                                            <path d="M -1 0 L -7 -4 L -7 -1 L -9 -1 L -9 1 L -7 1 L -7 4 Z" fill="#FFFFFF" />
                                            <path d="M 1 0 L 7 -4 L 7 -1 L 9 -1 L 9 1 L 7 1 L 7 4 Z" fill="#FFFFFF" />
                                            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
                                        </g>
                                    )}
                                    {(feedbackMessage.toLowerCase().includes('turn')) && (
                                        <g>
                                            <circle cx="0" cy="0" r="7" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                                            <path d="M 5 -5 L 8 -5 L 5 -8 Z" fill="#FFFFFF" />
                                            <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
                                        </g>
                                    )}
                                </g>
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LowerBodySideGhost;