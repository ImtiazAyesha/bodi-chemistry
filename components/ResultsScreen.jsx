import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { generatePDF } from '../utils/pdfGenerator';
import { PATTERN_DESCRIPTIONS, METRIC_DISPLAY_NAMES } from '../config/patternDescriptions';

/**
 * Results Screen — Plain-English Wellness Summary
 * Sections:  Markers Detected → Summary → What This Means → Captured Images → Starting Plan → Actions
 */
const ResultsScreen = ({ captureData, questionnaireData, patternResults, onRestart }) => {

  // Calculate overall score (kept for PDF)
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

    let faceScore = 100;
    faceScore -= Math.abs( allMetrics.face.eyeSym || 0 ) * 10;
    faceScore -= Math.abs( allMetrics.face.jawShift || 0 ) * 10;
    faceScore -= Math.abs( allMetrics.face.headTilt || 0 ) * 1;
    faceScore -= Math.abs( allMetrics.face.nostrilAsym || 0 ) * 5;
    faceScore = Math.max(0, Math.min(100, faceScore));

    let bodyScore = 100;
    bodyScore -= Math.abs( allMetrics.body.shoulderHeight || 0 ) * 10;
    bodyScore -= Math.abs( allMetrics.body.fhpAngle || 0 ) * 0.3;
    bodyScore -= Math.abs( allMetrics.body.pelvicTilt || 0 ) * 0.3;
    bodyScore = Math.max(0, Math.min(100, bodyScore));

    let questionnaireScore = 50;
    if ( questionnaireData?.normalizedScores ) {
      const scores = Object.values(questionnaireData.normalizedScores);
      questionnaireScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    const total = ( faceScore * 0.3 ) + ( bodyScore * 0.5 ) + ( questionnaireScore * 0.2 );
    return {
      total: total.toFixed(1),
      face: faceScore.toFixed(1),
      body: bodyScore.toFixed(1),
      questionnaire: questionnaireScore.toFixed(1)
    };
  };

  const score = calculateOverallScore();

  // Get primary pattern description — normalize kebab-case ID to snake_case
  const rawId = patternResults?.primaryPattern?.id || 'upper_compression';
  const primaryPatternId = rawId.replace( /-/g, '_' );
  const desc = PATTERN_DESCRIPTIONS[ primaryPatternId ] || PATTERN_DESCRIPTIONS.upper_compression;

  // Collect all metrics for markers section
  const allMetrics = [
    { key: 'headTilt', value: captureData.stage1.metrics.headTilt },
    { key: 'eyeSym', value: captureData.stage1.metrics.eyeSym },
    { key: 'jawShift', value: captureData.stage1.metrics.jawShift },
    { key: 'nostrilAsym', value: captureData.stage1.metrics.nostrilAsym },
    { key: 'shoulderHeight', value: captureData.stage2.metrics.shoulderHeight },
    { key: 'fhpAngle', value: captureData.stage3.metrics.fhpAngle },
    { key: 'pelvicTilt', value: captureData.stage4.metrics.pelvicTilt },
    { key: 'kneeAngle', value: captureData.stage4.metrics.kneeAngle },
    { key: 'footArchRatio', value: captureData.stage4.metrics.footArchRatio },
  ];

  const stageLabels = [ 'Face (Front)', 'Full Body (Front)', 'Upper Body (Side)', 'Full Body (Side)' ];
  const stageKeys = [ 'stage1', 'stage2', 'stage3', 'stage4' ];

  return (
    <div style={ {
      minHeight: '100dvh',
      background: '#EFE9DF',
      color: '#2F4A5C',
      overflowX: 'hidden',
      fontFamily: 'inherit',
    } }>
      {/* Background */ }
      <div style={ {
        position: 'fixed', inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(143,169,155,0.12), transparent 70%)',
        pointerEvents: 'none',
      } } />

      <div style={ { maxWidth: 680, margin: '0 auto', padding: '40px 20px 80px', position: 'relative', zIndex: 1 } }>

        {/* ─── HEADER ─── */ }
        <motion.div initial={ { opacity: 0, y: -16 } } animate={ { opacity: 1, y: 0 } } style={ { textAlign: 'center', marginBottom: 48 } }>
          <div style={ {
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(143,169,155,0.2)', borderRadius: 100,
            padding: '6px 18px', marginBottom: 16,
          } }>
            <span style={ { width: 8, height: 8, borderRadius: '50%', background: '#8FA99B' } } />
            <span style={ { fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' } }>Analysis Complete</span>
          </div>
          <h1 style={ { fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 } }>
            BODI <span style={ { color: '#6F8F84' } }>KEMISTRI</span> REPORT
          </h1>
        </motion.div>

        {/* ─── SECTION 1: PRIMARY PATTERN (SUMMARY) ─── */ }
        <motion.section
          initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.15 } }
          style={ {
            background: '#FFFFFF', border: '1px solid rgba(143,169,155,0.15)',
            borderRadius: 24, padding: 'clamp(24px, 5vw, 40px)', marginBottom: 24,
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.04)',
          } }
        >
          <div style={ { position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(to right, transparent, #8FA99B, transparent)' } } />
          <div style={ {
            width: 56, height: 56, borderRadius: 16, background: '#2F4A5C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(47,74,92,0.2)',
          } }>
            <FiZap style={ { width: 24, height: 24, color: '#FFFFFF', fill: '#FFFFFF' } } />
          </div>

          <p style={ { fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8FA99B', margin: '0 0 6px' } }>
            Your Primary Pressure Pattern
          </p>
          <h2 style={ { fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 700, margin: '0 0 4px' } }>
            { desc.plainName }
          </h2>
          { desc.formerName && (
            <p style={ { fontSize: 11, fontStyle: 'italic', color: 'rgba(47,74,92,0.45)', margin: '0 0 16px' } }>
              Formerly: { desc.formerName }
            </p>
          ) }
          <p style={ { fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 1.6, color: 'rgba(47,74,92,0.7)', maxWidth: 480, margin: '0 auto 20px' } }>
            { desc.summary }
          </p>

          <p style={ { fontSize: 13, fontWeight: 600, color: '#2F4A5C', marginBottom: 10 } }>This often feels like:</p>
          <div style={ { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' } }>
            { desc.feelsLike.map( ( item, i ) => (
              <span key={ i } style={ {
                background: 'rgba(143,169,155,0.1)', border: '1px solid rgba(143,169,155,0.2)',
                borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 500,
              } }>
                { item }
              </span>
            ) ) }
          </div>
        </motion.section>

        {/* ─── SECTION 2: WHAT THIS MEANS ─── */ }
        <motion.section
          initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.25 } }
          style={ {
            background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(143,169,155,0.1)', borderRadius: 20,
            padding: 'clamp(20px, 4vw, 32px)', marginBottom: 24,
          } }
        >
          <h3 style={ { fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, marginBottom: 12 } }>What Your Body Is Trying To Do</h3>
          { desc.whatBodyIsDoing && desc.whatBodyIsDoing.map( ( para, i ) => (
            <p key={ i } style={ { fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 1.7, color: 'rgba(47,74,92,0.75)', margin: '0 0 8px' } }>
              { para }
            </p>
          ) ) }
          { desc.goalStatement && (
            <p style={ { fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 1.7, color: '#2F4A5C', fontWeight: 600, margin: '8px 0 0' } }>
              { desc.goalStatement }
            </p>
          ) }
        </motion.section>

        {/* ─── SECTION 3: MARKERS DETECTED ─── */ }
        <motion.section
          initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.35 } }
          style={ {
            background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(143,169,155,0.1)', borderRadius: 20,
            padding: 'clamp(20px, 4vw, 32px)', marginBottom: 24,
          } }
        >
          <h3 style={ { fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, marginBottom: 16 } }>Markers Detected</h3>
          <div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 } }>
            { allMetrics.map( ( { key, value } ) => {
              const meta = METRIC_DISPLAY_NAMES[ key ];
              if ( !meta ) return null;
              const displayVal = typeof value === 'number' ? ( Math.abs( value ) < 0.01 ? '0' : Number( value ).toFixed( 2 ) ) : value;
              return (
                <div key={ key } style={ {
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: '#FFFFFF', borderRadius: 12,
                  border: '1px solid rgba(143,169,155,0.1)',
                } }>
                  <span style={ { fontSize: 12, fontWeight: 600, color: 'rgba(47,74,92,0.6)' } }>{ meta.name }</span>
                  <span style={ { fontSize: 14, fontWeight: 700 } }>{ displayVal }{ meta.unit }</span>
                </div>
              );
            } ) }
          </div>
          <p style={ { fontSize: 12, color: 'rgba(47,74,92,0.5)', marginTop: 14, lineHeight: 1.5 } }>
            FHP = Forward Head Posture • These measurements are used to determine your pressure pattern.
          </p>
        </motion.section>

        {/* ─── SECTION 4: CAPTURED IMAGES ─── */ }
        <motion.section
          initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.45 } }
          style={ { marginBottom: 24 } }
        >
          <h3 style={ { fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, marginBottom: 16 } }>Captured Evidence</h3>
          <div style={ { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 } }>
            { stageKeys.map( ( key, i ) => (
              <div key={ key } style={ {
                background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(143,169,155,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              } }>
                { captureData[ key ]?.image ? (
                  <img
                    src={ captureData[ key ].image }
                    alt={ stageLabels[ i ] }
                    style={ { width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' } }
                  />
                ) : (
                  <div style={ { width: '100%', aspectRatio: '3/4', background: '#F0EBE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(47,74,92,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' } }>
                    No Capture
                  </div>
                ) }
                <div style={ { padding: '10px 12px', textAlign: 'center' } }>
                  <span style={ { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6F8F84' } }>
                    { stageLabels[ i ] }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>



        {/* ─── PDF CALLOUT ─── */ }
        <motion.div
          initial={ { opacity: 0 } } animate={ { opacity: 1 } } transition={ { delay: 0.6 } }
          style={ {
            background: 'rgba(143,169,155,0.08)', border: '1px solid rgba(143,169,155,0.15)',
            borderRadius: 16, padding: '16px 20px', marginBottom: 32, textAlign: 'center',
          } }
        >
          <p style={ { fontSize: 13, color: 'rgba(47,74,92,0.65)', lineHeight: 1.6, margin: 0 } }>
            More detail with your compression pattern and exact exercises can be found in the <strong>downloadable PDF report</strong>.
          </p>
        </motion.div>

        {/* ─── ACTION BUTTONS ─── */ }
        <div style={ { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' } }>
          <button
            onClick={ async () => await generatePDF( captureData, questionnaireData, patternResults, score ) }
            style={ {
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#2F4A5C', color: '#FFFFFF', border: 'none', borderRadius: 16,
              padding: '16px 40px', fontSize: 14, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(47,74,92,0.2)',
              width: '100%', maxWidth: 360,
            } }
          >
            <FiDownload style={ { width: 18, height: 18 } } />
            Download Full Report
          </button>

          <button
            onClick={ onRestart }
            style={ {
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'transparent', color: '#2F4A5C',
              border: '2px solid rgba(47,74,92,0.2)', borderRadius: 16,
              padding: '14px 40px', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              width: '100%', maxWidth: 360,
            } }
          >
            <FiRefreshCw style={ { width: 16, height: 16 } } />
            Start New Assessment
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsScreen;