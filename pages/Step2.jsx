import React from 'react';
import CaptureSystem from '../components/CaptureSystem';

const Step2 = () => {
    return (
        <div style={{ width: '100vw', height: '100dvh' }}>
            <CaptureSystem initialStage="STAGE_2_UPPER_FRONT" lockedMode={true} />
        </div>
    );
};

export default Step2;
