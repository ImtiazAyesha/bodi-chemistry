import React from "react";
import CaptureSystem from "../components/CaptureSystem";

/**
 * CapturePage - The production 4-stage capture flow
 */
function CapturePage() {
    return (
        <CaptureSystem
            initialStage="STAGE_1_FACE"
            lockedMode={false}
        />
    );
}

export default CapturePage;