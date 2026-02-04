import React from 'react';

const InstructionPage = ({ onStart }) => {
  const stages = [
    {
      number: 1,
      title: "Face Capture",
      icon: "👤",
      instructions: [
        "Look directly at the camera",
        "Keep your face centered in the circle",
        "Maintain a neutral expression",
        "Hold still for 2 seconds"
      ]
    },
    {
      number: 2,
      title: "Upper Body Front",
      icon: "🧍",
      instructions: [
        "Face the camera directly",
        "Stand with arms at your sides",
        "Keep shoulders relaxed",
        "Hold still for 2 seconds"
      ]
    },
    {
      number: 3,
      title: "Upper Body Side",
      icon: "🚶",
      instructions: [
        "Turn to your right side",
        "Stand naturally with arms relaxed",
        "Keep your body centered",
        "Hold still for 2 seconds"
      ]
    },
    {
      number: 4,
      title: "Lower Body Side",
      icon: "🦵",
      instructions: [
        "Stay in side profile",
        "Full body should be visible",
        "Stand naturally",
        "Hold still for 2 seconds"
      ]
    }
  ];

  return (
    <div style={{
      width: '100vw',
      minHeight: '100dvh', // FIXED: Dynamic viewport height for mobile
      height: 'auto', // FIXED: Allow content to expand beyond viewport
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.25rem)', // FIXED: Responsive padding
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto', // FIXED: Enable vertical scrolling
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch', // FIXED: Smooth scrolling on iOS
      boxSizing: 'border-box',
      paddingBottom: 'clamp(2rem, 5vw, 3rem)' // FIXED: Extra space at bottom
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: 'clamp(1.5rem, 5vw, 3.125rem)', // FIXED: Responsive padding (24px-50px)
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 6vw, 2.625rem)', // FIXED: Responsive font (28px-42px)
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)', // FIXED: Responsive margin
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          Capture Instructions
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)', // FIXED: Responsive font (14px-18px)
          marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)', // FIXED: Responsive margin
          lineHeight: '1.6'
        }}>
          You're about to complete 4 photo captures. Follow the on-screen guides and hold each pose for 2 seconds.
        </p>

        {/* Important Tips */}
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '10px',
          padding: 'clamp(1rem, 3vw, 1.25rem)', // FIXED: Responsive padding (16px-20px)
          marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' // FIXED: Responsive margin
        }}>
          <h3 style={ {
            color: '#856404',
            marginBottom: 'clamp(0.5rem, 2vw, 0.625rem)', // FIXED: Responsive margin
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' // FIXED: Responsive font (16px-18px)
          } }>
            ⚠️ Important Tips
          </h3>
          <ul style={ {
            color: '#856404',
            lineHeight: '1.8',
            paddingLeft: '20px',
            margin: 0,
            fontSize: 'clamp(0.875rem, 2vw, 1rem)' // FIXED: Responsive font (14px-16px)
          } }>
            <li>Ensure good lighting in your room</li>
            <li>Stand about 6 feet away from your camera</li>
            <li>Wear fitted clothing for accurate analysis</li>
            <li>The green box will indicate when you're aligned correctly</li>
          </ul>
        </div>

        {/* Stages Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // FIXED: Smaller min width for mobile
          gap: 'clamp(0.75rem, 3vw, 1.25rem)', // FIXED: Responsive gap (12px-20px)
          marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' // FIXED: Responsive margin
        }}>
          {stages.map((stage) => (
            <div key={stage.number} style={{
              background: '#f8f9fa',
              borderRadius: '15px',
              padding: 'clamp(1rem, 3vw, 1.5625rem)', // FIXED: Responsive padding (16px-25px)
              border: '2px solid #e0e0e0',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 3rem)', // FIXED: Responsive icon (40px-48px)
                textAlign: 'center',
                marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)' // FIXED: Responsive margin
              }}>
                {stage.icon}
              </div>
              
              <h3 style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', // FIXED: Responsive font (16px-18px)
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                marginBottom: '5px'
              }}>
                Stage {stage.number}
              </h3>
              
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)', // FIXED: Responsive font (14px-16px)
                color: '#667eea',
                textAlign: 'center',
                marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)', // FIXED: Responsive margin
                fontWeight: '600'
              }}>
                {stage.title}
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', // FIXED: Responsive font (12px-14px)
                color: '#666',
                lineHeight: '1.8'
              }}>
                {stage.instructions.map((instruction, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>
                    ✓ {instruction}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: 'clamp(1rem, 3vw, 1.25rem)', // FIXED: Responsive padding (16px-20px)
            fontSize: 'clamp(1.125rem, 3vw, 1.375rem)', // FIXED: Responsive font (18px-22px)
            fontWeight: 'bold',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
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
          Start Capture Session →
        </button>

        <p style={{
          textAlign: 'center',
          color: '#999',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', // FIXED: Responsive font (12px-14px)
          marginTop: 'clamp(1rem, 3vw, 1.25rem)' // FIXED: Responsive margin
        }}>
          📸 Total capture time: ~2 minutes
        </p>
      </div>
    </div>
  );
};

export default InstructionPage;
