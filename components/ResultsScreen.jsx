import React from 'react';
import { generatePDF } from '../utils/pdfGenerator';
import PatternCard from './PatternCard';

/**
 * Results Screen Component
 * Displays all 4 captured images and calculated metrics
 */
const ResultsScreen = ( { captureData, questionnaireData, patternResults, onRestart } ) => {
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

    console.log( '=== RESULTS SCREEN SCORE CALCULATION ===' );
    console.log('All Metrics:', allMetrics);

    // Face Score
    let faceScore = 100;
    const eyePenalty = Math.abs( allMetrics.face.eyeSym || 0 ) * 10;
    const jawPenalty = Math.abs( allMetrics.face.jawShift || 0 ) * 10;
    const tiltPenalty = Math.abs( allMetrics.face.headTilt || 0 ) * 1;
    const nostrilPenalty = Math.abs( allMetrics.face.nostrilAsym || 0 ) * 5;
    
    faceScore -= eyePenalty + jawPenalty + tiltPenalty + nostrilPenalty;
    faceScore = Math.max( 0, Math.min( 100, faceScore ) );

    console.log( 'Face Score:', {
      eyePenalty: eyePenalty.toFixed(2),
      jawPenalty: jawPenalty.toFixed(2),
      tiltPenalty: tiltPenalty.toFixed(2),
      nostrilPenalty: nostrilPenalty.toFixed(2),
      faceScore: faceScore.toFixed( 1 )
    } );

    // Body Score
    let bodyScore = 100;
    const shoulderPenalty = Math.abs( allMetrics.body.shoulderHeight || 0 ) * 10;
    const fhpPenalty = Math.abs( allMetrics.body.fhpAngle || 0 ) * 0.3;
    const pelvicPenalty = Math.abs( allMetrics.body.pelvicTilt || 0 ) * 0.3;
    
    bodyScore -= shoulderPenalty + fhpPenalty + pelvicPenalty;
    bodyScore = Math.max( 0, Math.min( 100, bodyScore ) );

    console.log( 'Body Score:', {
      shoulderPenalty: shoulderPenalty.toFixed(2),
      fhpPenalty: fhpPenalty.toFixed(2),
      pelvicPenalty: pelvicPenalty.toFixed(2),
      bodyScore: bodyScore.toFixed( 1 )
    } );

    // Questionnaire score (average of normalized scores, or 50 if missing)
    let questionnaireScore = 50;
    if ( questionnaireData && questionnaireData.normalizedScores ) {
      const scores = Object.values( questionnaireData.normalizedScores );
      questionnaireScore = scores.reduce( ( a, b ) => a + b, 0 ) / scores.length;
    }

    console.log( 'Questionnaire Score:', questionnaireScore.toFixed( 1 ) );

    const total = ( faceScore * 0.3 ) + ( bodyScore * 0.5 ) + ( questionnaireScore * 0.2 );

    console.log( 'Final Wellness Score Calculation:', {
      faceContribution: ( faceScore * 0.3 ).toFixed( 2 ),
      bodyContribution: ( bodyScore * 0.5 ).toFixed( 2 ),
      questionnaireContribution: ( questionnaireScore * 0.2 ).toFixed( 2 ),
      total: total.toFixed(1)
    } );
    console.log( '=== END SCORE CALCULATION ===\n' );

    return {
      total: total.toFixed(1),
      face: faceScore.toFixed(1),
      body: bodyScore.toFixed(1),
      questionnaire: questionnaireScore.toFixed( 1 )
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
        padding: 'clamp(20px, 5vw, 40px)',
        zIndex: 100,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <h1 style={ {
          textAlign: 'center',
          color: '#00FF00',
          marginBottom: '10px',
          fontSize: 'clamp(24px, 5vw, 36px)'
        } }>
          ✅ Bodi Kemistri Analysis Complete!
        </h1>
        <h2 style={ {
          textAlign: 'center',
          color: '#FFF',
          marginBottom: 'clamp(20px, 5vh, 40px)',
          fontSize: 'clamp(18px, 3vw, 24px)'
        } }>
          Overall Score: <span style={ {
            color: '#00AAFF',
            fontSize: 'clamp(32px, 8vw, 48px)'
          } }>{ score.total }</span>
        </h2>

        {/* Score Breakdown */}
        <div style={ {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(20px, 5vw, 40px)',
          marginBottom: 'clamp(30px, 5vh, 50px)'
        } }>
          <div style={ { textAlign: 'center', minWidth: '120px' } }>
            <h3 style={ {
              color: '#FFA500',
              fontSize: 'clamp(16px, 3vw, 20px)'
            } }>Face Score</h3>
            <p style={ {
              fontSize: 'clamp(24px, 5vw, 32px)',
              color: '#00FF00',
              margin: '10px 0'
            } }>{ score.face }</p>
          </div>
          <div style={ { textAlign: 'center', minWidth: '120px' } }>
            <h3 style={ {
              color: '#FFA500',
              fontSize: 'clamp(16px, 3vw, 20px)'
            } }>Body Score</h3>
            <p style={ {
              fontSize: 'clamp(24px, 5vw, 32px)',
              color: '#00FF00',
              margin: '10px 0'
            } }>{ score.body }</p>
          </div>
        </div>

        {/* Captured Images Grid */}
        <h3 style={ {
          textAlign: 'center',
          marginBottom: 'clamp(20px, 4vh, 30px)',
          color: '#00AAFF',
          fontSize: 'clamp(20px, 4vw, 28px)'
        } }>
          Captured Images
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'clamp(15px, 3vw, 20px)',
            marginBottom: 'clamp(30px, 5vh, 50px)'
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

        {/* Somatic Pattern Analysis Section */ }
        { patternResults && patternResults.allPatterns && (
          <div style={ { marginTop: '50px' } }>
            <h2 style={ {
              textAlign: 'center',
              marginBottom: '10px',
              color: '#00D9FF',
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 'bold'
            } }>
              🎯 Somatic Pattern Analysis
            </h2>
            <p style={ {
              textAlign: 'center',
              color: '#aaa',
              marginBottom: '30px',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              maxWidth: '800px',
              margin: '0 auto 30px auto'
            } }>
              Integrated analysis combining body posture (50%), facial alignment (30%), and self-assessment (20%)
            </p>

            {/* Primary Pattern Highlight */ }
            { patternResults.primaryPattern && (
              <div style={ {
                background: `linear-gradient(135deg, #667eea20, transparent)`,
                border: `3px solid #667eea`,
                borderRadius: '16px',
                padding: 'clamp(20px, 4vw, 24px)',
                marginBottom: '30px',
                textAlign: 'center'
              } }>
                <div style={ { fontSize: 'clamp(32px, 8vw, 48px)', marginBottom: '12px' } }>
                  🎯
                </div>
                <h3 style={ {
                  color: '#667eea',
                  margin: '0 0 8px 0',
                  fontSize: 'clamp(20px, 4vw, 24px)'
                } }>
                  Primary Pattern: { patternResults.primaryPattern.name }
                </h3>
                <p style={ { color: '#ccc', margin: 0, fontSize: 'clamp(14px, 2.5vw, 16px)' } }>
                  Severity: <strong style={ { color: '#667eea' } }>
                    { patternResults.primaryPattern.severity.toUpperCase() }
                  </strong> ({ patternResults.primaryPattern.score.toFixed( 0 ) }/100)
                </p>
                <p style={ { color: '#aaa', margin: '8px 0 0 0', fontSize: 'clamp(12px, 2vw, 14px)' } }>
                  Confidence: { patternResults.confidence.level } ({ patternResults.confidence.percentage }%)
                </p>
              </div>
            ) }

            {/* All Patterns */ }
            <div style={ { maxWidth: '900px', margin: '0 auto' } }>
              { patternResults.allPatterns
                .sort( ( a, b ) => b.score - a.score )
                .map( ( pattern, index ) => {
                  const rank = pattern.severity !== 'none' ? index + 1 : null;
                  return (
                    <PatternCard
                      key={ pattern.id }
                      pattern={ pattern }
                      rank={ rank }
                    />
                  );
                } ) }
            </div>
          </div>
        ) }

        {/* Action Buttons */}
        <div style={ {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(15px, 3vw, 20px)',
          marginTop: 'clamp(30px, 5vh, 40px)',
          padding: '0 10px'
        } }>
          <button
            onClick={onRestart}
            style={{
              padding: 'clamp(12px, 2.5vh, 15px) clamp(30px, 6vw, 40px)',
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: 'bold',
              backgroundColor: '#00AAFF',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,170,255,0.4)',
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'fit-content',
              maxWidth: '300px'
            } }
            onMouseEnter={ ( e ) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,170,255,0.6)';
            } }
            onMouseLeave={ ( e ) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,170,255,0.4)';
            }}
          >
            🔄 Start New Analysis
          </button>
          <button
            onClick={ () => generatePDF( captureData, questionnaireData, patternResults, score ) }
            style={{
              padding: 'clamp(12px, 2.5vh, 15px) clamp(30px, 6vw, 40px)',
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: 'bold',
              backgroundColor: '#00FF00',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,255,0,0.4)',
              transition: 'all 0.3s ease',
              flex: '1 1 auto',
              minWidth: 'fit-content',
              maxWidth: '300px'
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
