import React from 'react';
import CaptureSystem from '../components/CaptureSystem';

const Step3 = () => {
    return (
        <div style={{ width: '100vw', height: '100dvh' }}>
            <CaptureSystem initialStage="STAGE_3_UPPER_SIDE" lockedMode={true} />
        </div>
    );
};

export default Step3;
