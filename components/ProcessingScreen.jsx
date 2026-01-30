import React, { useEffect } from 'react';

const ProcessingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Auto-transition to results after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '60px 80px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        {/* Animated Spinner */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 30px',
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>

        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Analyzing Your Posture
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Our AI is processing your captures and calculating your personalized assessment...
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>✓</span>
            <span style={{ color: '#333', fontSize: '16px' }}>Processing face metrics...</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            animation: 'pulse 1.5s ease-in-out 0.3s infinite'
          }}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>✓</span>
            <span style={{ color: '#333', fontSize: '16px' }}>Analyzing body alignment...</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            animation: 'pulse 1.5s ease-in-out 0.6s infinite'
          }}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>✓</span>
            <span style={{ color: '#333', fontSize: '16px' }}>Calculating scores...</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            animation: 'pulse 1.5s ease-in-out 0.9s infinite'
          }}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>✓</span>
            <span style={{ color: '#333', fontSize: '16px' }}>Generating report...</span>
          </div>
        </div>

        <p style={{
          marginTop: '25px',
          color: '#999',
          fontSize: '14px'
        }}>
          This will only take a moment...
        </p>
      </div>
    </div>
  );
};

export default ProcessingScreen;
