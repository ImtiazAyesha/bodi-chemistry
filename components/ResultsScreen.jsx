import React from 'react';
import { generatePDF } from '../utils/pdfGenerator';

/**
 * Results Screen Component
 * Displays all 4 captured images and calculated metrics
 */
const ResultsScreen = ({ captureData, questionnaireAnswers, questionnaireScore, onRestart }) => {
  // Calculate overall score
  const calculateOverallScore = () => {
    const allMetrics = {
      face: {
        eyeSym: captureData.stage1.metrics.eyeSym,
        jawShift: captureData.stage1.metrics.jawShift,
        headTilt: captureData.stage1.metrics.headTilt,
        nostrilAsym: captureData.stage1.metrics.nostrilAsym
      },
      body: {
        shoulderHeight: captureData.stage2.metrics.shoulderHeight,
        fhpAngle: captureData.stage3.metrics.fhpAngle,
        pelvicTilt: captureData.stage4.metrics.pelvicTilt,
        kneeAngle: captureData.stage4.metrics.kneeAngle,
        footArchRatio: captureData.stage4.metrics.footArchRatio
      }
    };

    console.log('=== RESULTS SCREEN SCORE CALCULATION ===');
    console.log('All Metrics:', allMetrics);

    // Face Score - UPDATED PENALTIES to match scoring.js
    let faceScore = 100;
    const eyePenalty = Math.abs(allMetrics.face.eyeSym || 0) * 10;      // Was 1000
    const jawPenalty = Math.abs(allMetrics.face.jawShift || 0) * 10;    // Was 500
    const tiltPenalty = Math.abs(allMetrics.face.headTilt || 0) * 1;    // Was 2
    const nostrilPenalty = Math.abs(allMetrics.face.nostrilAsym || 0) * 5;  // Was 1000
    
    faceScore -= eyePenalty;
    faceScore -= jawPenalty;
    faceScore -= tiltPenalty;
    faceScore -= nostrilPenalty;
    
    console.log('Face Penalties:', {
      eyePenalty: eyePenalty.toFixed(2),
      jawPenalty: jawPenalty.toFixed(2),
      tiltPenalty: tiltPenalty.toFixed(2),
      nostrilPenalty: nostrilPenalty.toFixed(2),
      totalPenalty: (eyePenalty + jawPenalty + tiltPenalty + nostrilPenalty).toFixed(2)
    });
    console.log('Face Score Before Clamp:', faceScore.toFixed(2));
    
    faceScore = Math.max(0, Math.min(100, faceScore));
    console.log('Face Score After Clamp:', faceScore.toFixed(2));

    // Body Score - UPDATED PENALTIES to match scoring.js
    let bodyScore = 100;
    const shoulderPenalty = Math.abs(allMetrics.body.shoulderHeight || 0) * 10;  // Was 500
    const fhpPenalty = Math.abs(allMetrics.body.fhpAngle || 0) * 0.3;            // Was 2
    const pelvicPenalty = Math.abs(allMetrics.body.pelvicTilt || 0) * 0.3;       // Was 2
    const footPenalty = Math.abs(allMetrics.body.footOrient || 0) * 0.1;         // Added
    
    bodyScore -= shoulderPenalty;
    bodyScore -= fhpPenalty;
    bodyScore -= pelvicPenalty;
    bodyScore -= footPenalty;
    
    console.log('Body Penalties:', {
      shoulderPenalty: shoulderPenalty.toFixed(2),
      fhpPenalty: fhpPenalty.toFixed(2),
      pelvicPenalty: pelvicPenalty.toFixed(2),
      footPenalty: footPenalty.toFixed(2),
      totalPenalty: (shoulderPenalty + fhpPenalty + pelvicPenalty + footPenalty).toFixed(2)
    });
    console.log('Body Score Before Clamp:', bodyScore.toFixed(2));
    
    bodyScore = Math.max(0, Math.min(100, bodyScore));
    console.log('Body Score After Clamp:', bodyScore.toFixed(2));

    const total = (faceScore * 0.4) + (bodyScore * 0.4) + (questionnaireScore * 0.2);

    console.log('Final Calculation:', {
      faceContribution: (faceScore * 0.4).toFixed(2),
      bodyContribution: (bodyScore * 0.4).toFixed(2),
      questionnaireContribution: (questionnaireScore * 0.2).toFixed(2),
      total: total.toFixed(1)
    });
    console.log('=== END RESULTS SCREEN CALCULATION ===\n');

    return {
      total: total.toFixed(1),
      face: faceScore.toFixed(1),
      body: bodyScore.toFixed(1),
      questionnaire: questionnaireScore
    };
  };

  const score = calculateOverallScore();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#111',
        color: '#FFF',
        overflowY: 'auto',
        padding: '40px 20px',
        zIndex: 100
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <h1 style={{ textAlign: 'center', color: '#00FF00', marginBottom: '10px' }}>
          ✅ Bodi Kemistri Analysis Complete!
        </h1>
        <h2 style={{ textAlign: 'center', color: '#FFF', marginBottom: '40px' }}>
          Overall Score: <span style={{ color: '#00AAFF', fontSize: '48px' }}>{score.total}</span>
        </h2>

        {/* Score Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '50px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#FFA500' }}>Face Score</h3>
            <p style={{ fontSize: '32px', color: '#00FF00' }}>{score.face}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#FFA500' }}>Body Score</h3>
            <p style={{ fontSize: '32px', color: '#00FF00' }}>{score.body}</p>
          </div>
        </div>

        {/* Captured Images Grid */}
        <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#00AAFF' }}>
          Captured Images
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '50px'
          }}
        >
          {/* Stage 1: Face */}
          <div style={{ border: '2px solid #00FF00', borderRadius: '10px', padding: '15px', backgroundColor: '#222' }}>
            <h4 style={{ color: '#00FF00', marginBottom: '10px' }}>Stage 1: Face</h4>
            {captureData.stage1.image ? (
              <img src={captureData.stage1.image} alt="Face Capture" style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Image
              </div>
            )}
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              <p>Eye Symmetry: {captureData.stage1.metrics.eyeSym}</p>
              <p>Jaw Shift: {captureData.stage1.metrics.jawShift}</p>
              <p>Head Tilt: {captureData.stage1.metrics.headTilt}°</p>
              <p>Nostril Asymmetry: {captureData.stage1.metrics.nostrilAsym}</p>
            </div>
          </div>

          {/* Stage 2: Upper Body Front */}
          <div style={{ border: '2px solid #00AAFF', borderRadius: '10px', padding: '15px', backgroundColor: '#222' }}>
            <h4 style={{ color: '#00AAFF', marginBottom: '10px' }}>Stage 2: Upper Body Front</h4>
            {captureData.stage2.image ? (
              <img src={captureData.stage2.image} alt="Upper Body Front" style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Image
              </div>
            )}
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              <p>Shoulder Height: {captureData.stage2.metrics.shoulderHeight}</p>
            </div>
          </div>

          {/* Stage 3: Upper Body Side */}
          <div style={{ border: '2px solid #FFA500', borderRadius: '10px', padding: '15px', backgroundColor: '#222' }}>
            <h4 style={{ color: '#FFA500', marginBottom: '10px' }}>Stage 3: Upper Body Side</h4>
            {captureData.stage3.image ? (
              <img src={captureData.stage3.image} alt="Upper Body Side" style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Image
              </div>
            )}
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              <p>FHP Angle: {captureData.stage3.metrics.fhpAngle}°</p>
            </div>
          </div>

          {/* Stage 4: Lower Body Side */}
          <div style={{ border: '2px solid #FF00FF', borderRadius: '10px', padding: '15px', backgroundColor: '#222' }}>
            <h4 style={{ color: '#FF00FF', marginBottom: '10px' }}>Stage 4: Lower Body Side</h4>
            {captureData.stage4.image ? (
              <img src={captureData.stage4.image} alt="Lower Body Side" style={{ width: '100%', borderRadius: '8px' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Image
              </div>
            )}
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              <p>Pelvic Tilt: {captureData.stage4.metrics.pelvicTilt}°</p>
              <p>Knee Angle: {captureData.stage4.metrics.kneeAngle}°</p>
              <p>Foot Arch Ratio: {captureData.stage4.metrics.footArchRatio}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          <button
            onClick={onRestart}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#00AAFF',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,170,255,0.4)'
            }}
          >
            🔄 Start New Analysis
          </button>
          <button
            onClick={() => generatePDF(captureData, questionnaireAnswers, score)}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#00FF00',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,255,0,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,255,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,255,0,0.4)';
            }}
          >
            📥 Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
