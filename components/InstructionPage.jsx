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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          Capture Instructions
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '18px',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          You're about to complete 4 photo captures. Follow the on-screen guides and hold each pose for 2 seconds.
        </p>

        {/* Important Tips */}
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '10px', fontSize: '18px' }}>
            ⚠️ Important Tips
          </h3>
          <ul style={{ color: '#856404', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li>Ensure good lighting in your room</li>
            <li>Stand about 6 feet away from your camera</li>
            <li>Wear fitted clothing for accurate analysis</li>
            <li>The green box will indicate when you're aligned correctly</li>
          </ul>
        </div>

        {/* Stages Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {stages.map((stage) => (
            <div key={stage.number} style={{
              background: '#f8f9fa',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid #e0e0e0',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '48px',
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                {stage.icon}
              </div>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                marginBottom: '5px'
              }}>
                Stage {stage.number}
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: '#667eea',
                textAlign: 'center',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                {stage.title}
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '14px',
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
            padding: '20px',
            fontSize: '22px',
            fontWeight: 'bold',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
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
          fontSize: '14px',
          marginTop: '20px'
        }}>
          📸 Total capture time: ~2 minutes
        </p>
      </div>
    </div>
  );
};

export default InstructionPage;
