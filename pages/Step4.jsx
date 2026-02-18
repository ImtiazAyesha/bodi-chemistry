import React from 'react';
import CaptureSystem from '../components/CaptureSystem';

const Step4 = () => {
    return (
        <div style={{ width: '100vw', height: '100dvh' }}>
            <CaptureSystem initialStage="STAGE_4_LOWER_SIDE" lockedMode={true} />
        </div>
    );
};

export default Step4;
