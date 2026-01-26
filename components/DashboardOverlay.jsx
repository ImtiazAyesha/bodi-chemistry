// DashboardOverlay.jsx
import React from 'react';

const Panel = ({ title, children, side = 'left' }) => (
  <div style={{
    position: 'absolute',
    top: 20,
    [side]: 20,
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#0f0',
    padding: '15px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    width: '240px',
    pointerEvents: 'none', // Let clicks pass through if needed, but we might want buttons
    zIndex: 10
  }}>
    <h3 style={{ borderBottom: '1px solid #0f0', margin: '0 0 10px 0', paddingBottom: '5px' }}>{title}</h3>
    {children}
  </div>
);

const MetricRow = ({ label, value, unit = '' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
    <span>{label}:</span>
    <span style={{ fontWeight: 'bold' }}>{value} {unit}</span>
  </div>
);

const DashboardOverlay = ({ metrics, score, scanMode, setScanMode, showDebug, setShowDebug }) => {
  return (
    <>
      {/* Controls Container - Clickable */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '10px',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px',
        borderRadius: '12px'
      }}>
        <button 
          onClick={() => setScanMode('FRONT')}
          style={{
            background: scanMode === 'FRONT' ? '#0f0' : '#333',
            color: scanMode === 'FRONT' ? '#000' : '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          FRONT SCAN
        </button>
        <button 
          onClick={() => setScanMode('SIDE')}
          style={{
            background: scanMode === 'SIDE' ? '#0f0' : '#333',
            color: scanMode === 'SIDE' ? '#000' : '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          SIDE SCAN
        </button>
      </div>

        {/* Debug Panels */}
        <Panel side="left" title="FACE METRICS (Core 4)">
            <MetricRow label="Eye Symmetry" value={metrics.face.eyeSym} />
            <MetricRow label="Jaw Shift" value={metrics.face.jawShift} />
            <MetricRow label="Head Tilt" value={metrics.face.headTilt} unit="°" />
            <MetricRow label="Nostril Asym" value={metrics.face.nostrilAsym} />
            <div style={{ marginTop: '10px', borderTop: '1px solid #555', paddingTop: '5px' }}>
                 Normalized by: Iris Width
            </div>
            {metrics.face.irisWidth > 0 && 
                <div style={{fontSize: '10px', color: '#aaa'}}>Ref: {metrics.face.irisWidth.toFixed(4)}</div>
            }
        </Panel>

        <Panel side="right" title={`BODY METRICS (${scanMode})`}>
            {scanMode === 'FRONT' ? (
                <>
                    <MetricRow label="Shoulder Ht" value={metrics.body.shoulderHeight} />
                    <MetricRow label="Pelvic Tilt" value={metrics.body.pelvicTilt} />
                    <div style={{color: '#888', fontStyle: 'italic', marginTop: '5px'}}>
                        Forward Head & Foot angles require SIDE scan.
                    </div>
                </>
            ) : (
                <>
                    <MetricRow label="Cranio-Vert (FHP)" value={metrics.body.fhpAngle} unit="°"/>
                    <MetricRow label="Pelvic Angle" value={metrics.body.pelvicTilt} unit="°"/>
                    <MetricRow label="Foot Angle" value={metrics.body.footOrient} unit="°"/>
                </>
            )}
        </Panel>

        {/* Score Panel */}
        <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#fff',
            zIndex: 10,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>BODI SCORE</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f0' }}>{score.total}</div>
            <div style={{ fontSize: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <span>F: {score.face}</span>
                <span>B: {score.body}</span>
            </div>
        </div>
    </>
  );
};

export default DashboardOverlay;
