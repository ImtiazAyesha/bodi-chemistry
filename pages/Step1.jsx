import React from 'react';
import CaptureSystem from '../components/CaptureSystem';

const Step1 = () => {
    return (
        <div style={{ width: '100vw', height: '100dvh' }}>
            <CaptureSystem initialStage="STAGE_1_FACE" lockedMode={true} />
        </div>
    );
};

export default Step1;
