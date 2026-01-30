import React from 'react';

const LandingPage = ({ onStart }) => {
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
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Bodi Kemistri
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#555',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Discover your body's unique alignment patterns through advanced AI-powered posture analysis
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '18px' }}>What to expect:</h3>
          <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '20px' }}>
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
            padding: '18px 50px',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            width: '100%'
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

        <p style={{ marginTop: '20px', color: '#999', fontSize: '14px' }}>
          ⏱️ Total time: ~5 minutes
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
