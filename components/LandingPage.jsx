import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100svh', // FIXED: Use small viewport height for mobile
      height: 'auto', // FIXED: Allow content to expand
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto', // FIXED: Enable scrolling on small screens
      overflowX: 'hidden',
      padding: '2rem 1.5rem', // FIXED: Add padding for mobile
      boxSizing: 'border-box',
      // FIXED: Safe area insets for notched devices
      paddingTop: 'max(2rem, env(safe-area-inset-top))',
      paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
      paddingRight: 'max(1.5rem, env(safe-area-inset-right))'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: 'clamp(2rem, 5vw, 5rem) clamp(1.5rem, 5vw, 5rem)', // FIXED: Responsive padding
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        margin: 'auto' // FIXED: Center on all screens
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3rem)', // FIXED: Fluid typography
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'clamp(1rem, 3vw, 1.25rem)',
          lineHeight: '1.2'
        }}>
          Bodi Kemistri
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)', // FIXED: Fluid typography
          color: '#555',
          marginBottom: 'clamp(1.5rem, 4vw, 1.875rem)',
          lineHeight: '1.6'
        }}>
          Discover your body's unique alignment patterns through advanced AI-powered posture analysis
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: 'clamp(1rem, 3vw, 1.25rem)',
          borderRadius: '10px',
          marginBottom: 'clamp(1.5rem, 4vw, 1.875rem)',
          textAlign: 'left'
        }}>
          <h3 style={ {
            color: '#333',
            marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
            fontSize: 'clamp(1rem, 3vw, 1.125rem)'
          } }>What to expect:</h3>
          <ul style={ {
            color: '#666',
            lineHeight: '2',
            paddingLeft: '20px',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // FIXED: Responsive list text
            margin: 0
          } }>
            <li>📋 Quick health questionnaire (2 minutes)</li>
            <li>📸 4 simple photo captures</li>
            <li>🧠 AI-powered posture analysis</li>
            <li>📊 Detailed assessment report</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: 'clamp(0.875rem, 3vw, 1.125rem) clamp(2rem, 5vw, 3.125rem)', // FIXED: Responsive button
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            width: '100%',
            touchAction: 'manipulation' // FIXED: Better touch response
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
          }}
        >
          Start Assessment
        </button>

        <p style={ {
          marginTop: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#999',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
        } }>
          ⏱️ Total time: ~5 minutes
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
