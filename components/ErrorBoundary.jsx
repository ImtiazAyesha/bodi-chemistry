import React from 'react';

/**
 * ErrorBoundary — catches any uncaught render-time JS error in the subtree.
 * Instead of a blank white page, users see a branded recovery screen.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error?.message || 'Unknown error'
        };
    }

    componentDidCatch(error, info) {
        // In production you could send this to a logging service (e.g. Sentry)
        console.error('[ErrorBoundary] Caught render error:', error, info);
    }

    handleRestart = () => {
        window.location.reload();
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: 'linear-gradient(165deg, #F8F5F0 0%, #F0EBE3 40%, #E8E1D7 100%)',
                fontFamily: 'Outfit, sans-serif',
                textAlign: 'center',
            }}>
                {/* Icon */}
                <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(47,74,60,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    fontSize: '2rem',
                }}>
                    ⚠️
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#2F4A3C',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.01em',
                }}>
                    Something went wrong
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#5a7060',
                    maxWidth: 340,
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                }}>
                    The scan encountered an unexpected error. Restarting will clear the issue on most devices.
                </p>

                <button
                    onClick={this.handleRestart}
                    style={{
                        padding: '0.85rem 2.5rem',
                        borderRadius: '14px',
                        background: '#2F4A3C',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                    }}
                >
                    Restart Scan
                </button>

                {/* Small error detail for testers to screenshot */}
                <details style={{ opacity: 0.4, fontSize: '0.7rem', color: '#2F4A3C', maxWidth: 320 }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '0.4rem' }}>Error details (for support)</summary>
                    <code style={{ wordBreak: 'break-all' }}>{this.state.errorMessage}</code>
                </details>
            </div>
        );
    }
}

export default ErrorBoundary;
