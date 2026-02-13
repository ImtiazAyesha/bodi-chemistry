import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    FiUser, FiArrowRight, FiCamera, FiLayout, FiPieChart,
    FiZap, FiEye, FiAward
} from 'react-icons/fi';
import ParticlesBackground from './ui/ParticlesBackground';
import FaceGhost from './FaceGhost';
import UpperBodyFrontGhost from './UpperBodyFrontGhost';
import UpperBodySideGhost from './UpperBodySideGhost';
import LowerBodySideGhost from './LowerBodySideGhost';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.88 },
    show: (i = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
    }),
};


const ScanLine = () => (
    <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-sage/60 to-transparent"
        style={{ animation: 'scanMove 2.8s ease-in-out infinite' }}
    />
);


const stageIcons = {
    face: (
        <div className="w-full h-full flex items-center justify-center scale-[1.8] opacity-60">
            <svg viewBox="0 0 480 960" className="w-8 h-8 md:w-10 md:h-10" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(240, 480) scale(15.5) translate(-103.1, -18)">
                    <path
                        d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3 c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522 c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201 c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109 c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24 c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217 c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245 c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631 c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522 c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448 c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577 c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257 c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674 c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635 c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514 c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733 C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733 c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988 c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198 c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953 c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577 c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448 c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522 c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269 c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727 c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848 c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033 c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116 c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522 c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3 c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.25"
                    />
                </g>
            </svg>
        </div>
    ),
    bodyFront: (
        <div className="w-full h-full flex items-center justify-center scale-[1.5] opacity-60">
            <svg viewBox="0 0 480 960" className="w-8 h-8 md:w-10 md:h-10" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(240, 480) scale(3.4) translate(-103, -103)">
                    <path
                        d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3 c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522 c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201 c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109 c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24 c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217 c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245 c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631 c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522 c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448 c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577 c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257 c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674 c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635 c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514 c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733 C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733 c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988 c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198 c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953 c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577 c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448 c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522 c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269 c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727 c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848 c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033 c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116 c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522 c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3 c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1.2"
                    />
                </g>
            </svg>
        </div>
    ),
    bodySide: (
        <div className="w-full h-full flex items-center justify-center scale-[1.5] opacity-60">
            <svg viewBox="0 0 480 960" className="w-8 h-8 md:w-10 md:h-10" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(240, 480) scale(4.8) translate(-93.5, -95)">
                    <path
                        d="M118.373 103.686c1.534-7.039 3.118-30.954-7.727-40.355-3.161-2.74-10.645-7.989-12.767-10.802-.398-.53-.666-1.339-.828-2.262 1.173-2.743 2.938-6.293 2.938-6.293 1.571-2.037 4.274-1.4 5.735-1.233 4.165.411 5.176-.837 5.176-.837.901-.572.421-2.886.421-2.886-.372-1.184.164-1.791.499-2.256.896-1.303.341-1.884.341-1.884l-.109-.554c1.005-.354 1.06-.904 1.06-.904l-.067-1.851c-.177-1.267.384-1.355.384-1.355 2.302-.097 2.217-1.583 2.217-1.583.073-.816-2.801-5.636-2.801-5.636-1.353-2.469.462-4.003.56-5.294.451-5.949-1.632-9.539-4.421-12.353C104.393.67 98.574-.097 94.79.009c-9.715.28-13.576 3.44-16.475 6.814-6.043 7.03-4.615 13.058-4.615 13.058.231 3.593 5.325 10.026 5.325 10.026 4.068 5.593 2.208 10.013 2.208 10.013l.07.013c.036 3.498-.561 7.514-3.069 9.971-8.181 7.989-15.019 21.787-7.2 43.528 3.373 9.365 16.623 31.006 11.792 37.984-5.836 8.415-17.354 19.96-5.568 40.59 0 0-.606 6.352-1.093 15.053h32.814c.104-1.967 2.387-10.583 2.314-12.763-.323-9.463.188-21.349 1.314-26.841 2.016-9.986 6.54-21.617 5.889-40.273-.031-1.346-.08-2.497-.123-3.496"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.8"
                    />
                </g>
            </svg>
        </div>
    ),
    lowerBodySide: (
        <div className="w-full h-full flex items-center justify-center scale-[0.9] opacity-60">
            <svg viewBox="0 0 480 960" className="w-8 h-8 md:w-10 md:h-10" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(240, 420)" clipPath="url(#lower-body-side-clip)">
                    <defs>
                        <clipPath id="lower-body-side-clip">
                            <rect x="-240" y="-600" width="480" height="1460" />
                        </clipPath>
                        <clipPath id="upper-body-crop-icon">
                            <rect x="-300" y="-550" width="600" height="480" />
                        </clipPath>
                    </defs>

                    {/* Upper body - clipped at waist */}
                    <g clipPath="url(#upper-body-crop-icon)">
                        <g transform="scale(2.55) translate(-100, -160)">
                            <path
                                d="M118.373 103.686c1.534-7.039 3.118-30.954-7.727-40.355-3.161-2.74-10.645-7.989-12.767-10.802-.398-.53-.666-1.339-.828-2.262 1.173-2.743 2.938-6.293 2.938-6.293 1.571-2.037 4.274-1.4 5.735-1.233 4.165.411 5.176-.837 5.176-.837.901-.572.421-2.886.421-2.886-.372-1.184.164-1.791.499-2.256.896-1.303.341-1.884.341-1.884l-.109-.554c1.005-.354 1.06-.904 1.06-.904l-.067-1.851c-.177-1.267.384-1.355.384-1.355 2.302-.097 2.217-1.583 2.217-1.583.073-.816-2.801-5.636-2.801-5.636-1.353-2.469.462-4.003.56-5.294.451-5.949-1.632-9.539-4.421-12.353C104.393.67 98.574-.097 94.79.009c-9.715.28-13.576 3.44-16.475 6.814-6.043 7.03-4.615 13.058-4.615 13.058.231 3.593 5.325 10.026 5.325 10.026 4.068 5.593 2.208 10.013 2.208 10.013l.07.013c.036 3.498-.561 7.514-3.069 9.971-8.181 7.989-15.019 21.787-7.2 43.528 3.373 9.365 16.623 31.006 11.792 37.984-5.836 8.415-17.354 19.96-5.568 40.59 0 0-.606 6.352-1.093 15.053h32.814c.104-1.967 2.387-10.583 2.314-12.763-.323-9.463.188-21.349 1.314-26.841 2.016-9.986 6.54-21.617 5.889-40.273-.031-1.346-.08-2.497-.123-3.496"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1.2"
                            />
                        </g>
                    </g>

                    {/* Lower body */}
                    <g transform="scale(0.9) translate(0, -30)">
                        <path
                            d="M 40 -60 Q 55 50 35 180 C 35 240 20 280 25 320 C 30 350 45 360 60 370 Q 75 380 65 380 L -15 380 Q -45 380 -40 360 C -35 340 -45 320 -45 300 Q -60 260 -50 200 Q -55 120 -75 50 Q -90 0 -50 -60"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                    </g>
                </g>
            </svg>
        </div>
    ),
};


const highlights = [
    {
        title: 'Solo Capture',
        description: 'No second person required. Easily take all photos entirely by yourself.',
        icon: <FiUser />,
        tag: 'Hands-Free',
    },
    {
        title: 'Auto-Pilot',
        description: "Camera auto-captures the moment you're positioned correctly — zero taps.",
        icon: <FiCamera />,
        tag: '2-sec trigger',
    },
    {
        title: 'Optimal Distance',
        description: 'Position yourself approximately 2-10 feet from the lens for best results.',
        icon: <FiLayout />,
        tag: '~2 metres',
    },
];

const stages = [
    {
        number: '01',
        title: 'Face Profile (Front View)',
        icon: stageIcons.face,
        description: 'Position yourself 2 feet from the camera. The on-screen outline shows which body part will be captured (face). Align according to the indicator for a 3-second automatic capture.',
        duration: '~5 sec',
        color: 'bg-brand-sage/10',
        accent: 'border-brand-sage/40',
    },
    {
        number: '02',
        title: 'Full Body Front',
        icon: stageIcons.bodyFront,
        description: 'Position yourself 8-10 feet away from the camera. Face the camera directly with arms relaxed. The outline indicates full body front capture. Ensure both head and feet are visible.',
        duration: '~8 sec',
        color: 'bg-brand-sand/60',
        accent: 'border-brand-deepSage/25',
    },
    {
        number: '03',
        title: 'Side Profile Upper (Left Side)',
        icon: stageIcons.bodySide,
        description: 'Position yourself 3-6 feet away from the camera. Turn 90 degrees. The outline indicates upper body side capture. Camera should be at your eye level.',
        duration: '~8 sec',
        color: 'bg-white/40',
        accent: 'border-brand-slate/15',
    },
    {
        number: '04',
        title: 'Side Profile Lower (Full Body Left Side)',
        icon: stageIcons.lowerBodySide,
        description: 'Turn 90 degrees from the camera. Position yourself 8-10 feet away. The outline indicates full body side capture. Ensure both head and feet are visible.',
        duration: '~8 sec',
        color: 'bg-brand-deepSage/5',
        accent: 'border-brand-deepSage/20',
    },
];

const outcomes = [
    { label: 'Digital Silhouettes', icon: <FiEye className="w-3.5 h-3.5" /> },
    { label: 'Posture Analysis', icon: <FiAward className="w-3.5 h-3.5" /> },
    { label: 'Exercise Plan', icon: <FiZap className="w-3.5 h-3.5" /> },
];


const InstructionPage = ({ onStart }) => {
    const [activeStage, setActiveStage] = useState(0);
    const stagesRef = useRef(null);
    const stagesInView = useInView(stagesRef, { once: true, margin: '-80px' });

    // Auto-progression for mobile stage carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStage((prev) => (prev + 1) % stages.length);
        }, 3200); // 3.2s per stage
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div
                className="min-h-screen relative overflow-hidden flex flex-col items-center selection:bg-brand-sage/30"
                style={{ background: 'linear-gradient(160deg, #F7F3EE 0%, #EDE8E0 55%, #E5DDD4 100%)', fontFamily: 'var(--font-body)' }}
            >
                {/* ── Atmospheric background layers ── */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(188,175,156,0.22) 0%, transparent 70%)' }} />
                    <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(143,169,155,0.15) 0%, transparent 65%)' }} />
                    <div
                        className="absolute inset-0 opacity-[0.045]"
                        style={{
                            backgroundImage: 'linear-gradient(#2F4A3C 1px, transparent 1px), linear-gradient(90deg, #2F4A3C 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }}
                    />
                </div>
                <ParticlesBackground />

                {/* ══════════════════════════════════════════════
                    HERO SECTION — split editorial layout
                    ══════════════════════════════════════════════ */}
                <section className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8">
                    {/* Main headline — asymmetric layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 sm:gap-12 lg:gap-20 items-end mb-12 sm:mb-16 md:mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        >
                            {/* small eyebrow */}
                            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-brand-deepSage/60 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                                <span className="inline-block w-6 sm:w-8 h-px bg-brand-deepSage/30" />
                                Capture Guide
                            </p>

                            {/* giant display title */}
                            <h1 className="font-display font-bold leading-[0.92] tracking-tight text-brand-slate">
                                <span className="block text-[clamp(3.5rem,8vw,7.5rem)]">QUICK</span>
                                <span className="shimmer-text block text-[clamp(3.5rem,8vw,7.5rem)]">SESSION</span>
                            </h1>

                            {/* ruled line separator */}
                            <div className="mt-5 sm:mt-6 md:mt-8 mb-5 sm:mb-6 md:mb-7 flex items-center gap-3 sm:gap-4">
                                <div className="h-px flex-1 bg-gradient-to-r from-brand-deepSage/20 to-transparent" />
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-sage/60" />
                            </div>

                            <p className="font-body font-light text-brand-slate/65 text-base sm:text-lg leading-relaxed max-w-xl">
                                Our advanced AI vision system guides you through a precision capture session
                                to generate your complete 2D postural profile.
                            </p>
                        </motion.div>

                        {/* Vertical stat column — right side, desktop only */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                            className="hidden lg:flex flex-col gap-5 pb-2 border-l border-brand-slate/8 pl-10"
                        >
                            {[
                                { num: '04', label: 'Capture\nStages' },
                                { num: '2m', label: 'Total\nDuration' },
                                { num: '2D', label: 'Postural\nProfile' },
                            ].map(({ num, label }) => (
                                <div key={num} className="flex flex-col">
                                    <span className="font-display font-bold text-4xl text-brand-slate/80 leading-none">{num}</span>
                                    <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-slate/35 mt-1 whitespace-pre-line">{label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    HIGHLIGHTS — bento-style grid
                    ══════════════════════════════════════════════ */}
                <section className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-10 mb-12 sm:mb-16 md:mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                        {highlights.map((item, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={scaleIn}
                                initial="hidden"
                                animate="show"
                                className="relative card-glow group cursor-default bg-white/50 border border-brand-slate/8 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 overflow-hidden backdrop-blur-lg transition-all duration-500"
                            >
                                {/* animated scan line on hover */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ScanLine />
                                </div>

                                {/* number watermark */}
                                <span className="absolute top-4 sm:top-5 right-5 sm:right-6 font-display font-bold text-5xl sm:text-6xl text-brand-slate/[0.04] select-none leading-none pointer-events-none">
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {/* icon container - Switched to Slate/Black text icons */}
                                <div className="relative mb-4 sm:mb-5 w-10 h-10 sm:w-11 sm:h-11">
                                    <div className="pulse-ring relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-brand-slate shadow-md border border-brand-slate/10 group-hover:scale-105 transition-transform duration-400">
                                        {React.cloneElement(item.icon, { className: 'w-4 h-4 sm:w-4.5 sm:h-4.5' })}
                                    </div>
                                </div>

                                {/* tag pill */}
                                <span className="inline-block font-mono text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-brand-deepSage/70 bg-brand-sage/10 border border-brand-sage/20 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 mb-2.5 sm:mb-3">
                                    {item.tag}
                                </span>

                                <h3 className="font-body font-semibold text-brand-slate text-sm sm:text-base mb-1.5 sm:mb-2 uppercase tracking-wider">
                                    {item.title}
                                </h3>
                                <p className="font-body font-light text-brand-deepSage/80 text-xs sm:text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    STAGES — editorial numbered list
                    ══════════════════════════════════════════════ */}
                <section ref={stagesRef} className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-10 mb-16 sm:mb-20 md:mb-28">
                    {/* section header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5">
                            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-brand-slate/30 font-medium">
                                Capture Stages
                            </span>
                            <div className="h-px flex-1 bg-brand-slate/8" />
                        </div>

                        {/* Pro Tip Card - Always Visible */}
                        <div className="w-full max-w-4xl">
                            <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-amber-50/90 to-orange-50/70 border border-amber-200/60 rounded-lg sm:rounded-xl shadow-md backdrop-blur-sm">
                                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 mt-0.5">
                                    <span className="text-base sm:text-lg md:text-xl">💡</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-wider uppercase text-amber-700/70 font-medium">
                                            Stage 3 Pro Tip
                                        </span>
                                        <div className="h-px flex-1 bg-amber-300/30" />
                                    </div>
                                    <p className="font-body text-amber-900/85 text-xs sm:text-sm md:text-base leading-relaxed">
                                        Turn your <strong>body fully sideways</strong> (90 degrees), but you can turn your <strong>head slightly toward the screen</strong> to see the countdown and alignment guide. When the countdown reaches <strong>1 second</strong>, turn your face fully sideways to match your body position.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Stage View - Dots navigation, no scrollbar/lines as requested */}
                    <div className="md:hidden relative mt-8 sm:mt-10 px-4 sm:px-6 overflow-hidden">
                        <div className="flex flex-col items-center">
                            <motion.div
                                key={activeStage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="flex flex-col items-center text-center"
                            >
                                {/* circle */}
                                <div className="relative mb-6 sm:mb-8">
                                    <div className={`absolute -inset-5 sm:-inset-6 rounded-full opacity-20 blur-2xl ${stages[activeStage].color} animate-pulse-slow`} />
                                    <div className={`
                                        relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center 
                                        bg-white border-2 ${stages[activeStage].accent} shadow-2xl
                                    `}>
                                        <div className={`absolute inset-0 rounded-full ${stages[activeStage].color} opacity-20`} />
                                        <div className="relative text-brand-slate/60">
                                            {React.cloneElement(stages[activeStage].icon, { className: 'w-11 h-11' })}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-[#2F4A5C] text-white text-[9px] sm:text-[10px] font-mono px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-2xl z-20 border border-white/10">
                                            {stages[activeStage].duration}
                                        </div>
                                    </div>
                                </div>

                                {/* labels */}
                                <div className="max-w-[240px] sm:max-w-[260px] min-h-[100px] sm:min-h-[120px]">
                                    <span className="font-mono text-[10px] tracking-[0.25em] text-brand-deepSage/40 uppercase block mb-1.5">
                                        Stage {stages[activeStage].number}
                                    </span>
                                    <h4 className="font-body font-bold text-brand-slate text-base sm:text-lg uppercase tracking-wider mb-2 sm:mb-2.5">
                                        {stages[activeStage].title}
                                    </h4>
                                    <p className="font-body font-light text-brand-slate/50 text-xs sm:text-sm leading-relaxed px-2 sm:px-4">
                                        {stages[activeStage].description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* dots nav - High Visibility Black dots */}
                            <div className="flex gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12 bg-white/40 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-brand-slate/10 shadow-sm">
                                {stages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveStage(i)}
                                        className={`
                                            h-2 transition-all duration-500 rounded-full 
                                            ${activeStage === i ? 'w-10 bg-[#2F4A5C]' : 'w-2 bg-[#2F4A5C]/20 hover:bg-[#2F4A5C]/40'}
                                        `}
                                        aria-label={`Go to stage ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop horizontal roadmap structure - Single Line approach */}
                    <div className="hidden md:block relative min-h-[280px] mt-12 md:mt-16 overflow-x-auto overflow-y-visible hide-scrollbar pb-8 md:pb-10 px-3 md:px-4">
                        <div className="min-w-[800px] md:min-w-0 h-full relative max-w-5xl mx-auto">
                            <div className="absolute top-12 left-0 w-full h-px border-t-2 border-brand-sage/30 border-dashed z-0" />

                            {/* stage items grid - Single Row */}
                            <div className="relative z-10 grid grid-cols-4 items-start pt-2">
                                {stages.map((stage, i) => {
                                    return (
                                        <motion.div
                                            key={stage.number}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={stagesInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ duration: 0.6, delay: 0.3 + (i * 0.15) }}
                                            className="relative flex flex-col items-center group"
                                        >
                                            {/* stage circle */}
                                            <div className="relative mb-5 md:mb-6">
                                                {/* outer glow ring */}
                                                <div className={`absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${stage.color}`} />

                                                <div className={`
                                                    relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center 
                                                    bg-white border-2 ${stage.accent} shadow-xl 
                                                    group-hover:scale-110 group-hover:shadow-brand transition-all duration-500 cursor-default
                                                `}>
                                                    {/* background tint */}
                                                    <div className={`absolute inset-0 rounded-full ${stage.color} opacity-20`} />

                                                    <div className="relative text-brand-slate/60 group-hover:text-brand-deepSage transition-colors scale-90 md:scale-100">
                                                        {React.cloneElement(stage.icon, { className: 'w-8 h-8 md:w-10 md:h-10' })}
                                                    </div>

                                                    {/* duration tag floating - High Visibility */}
                                                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-[#2F4A5C] text-white text-[9px] md:text-[10px] font-mono px-3 py-1 rounded-full shadow-2xl z-30 ring-1 ring-white/10">
                                                        {stage.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* info labels - All consistently below */}
                                            <div className="text-center max-w-[160px]">
                                                <span className="font-mono text-[9px] tracking-[0.2em] text-brand-deepSage/40 uppercase block mb-1">
                                                    Stage {stage.number}
                                                </span>
                                                <h4 className="font-body font-bold text-brand-slate text-xs md:text-sm uppercase tracking-wider mb-2 px-1">
                                                    {stage.title}
                                                </h4>
                                                <p className="font-body font-light text-brand-slate/50 text-[10px] md:text-[11px] leading-relaxed px-2">
                                                    {stage.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>


                {/* ══════════════════════════════════════════════
                    OUTCOME — premium CTA card
                    ══════════════════════════════════════════════ */}
                <section className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-10 mb-12 sm:mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(47,74,60,0.96) 0%, rgba(35,56,44,0.98) 100%)',
                            boxShadow: '0 30px 80px -20px rgba(35,56,44,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
                        }}
                    >
                        {/* background grid on dark card */}
                        <div
                            className="absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }}
                            aria-hidden="true"
                        />

                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(143,169,155,0.18) 0%, transparent 65%)' }}
                            aria-hidden="true"
                        />

                        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 md:px-16 py-10 sm:py-12 md:py-14 lg:py-16">
                            <h3 className="font-display font-bold text-white leading-tight tracking-tight text-2xl sm:text-3xl md:text-5xl mb-3 sm:mb-4">
                                Your Session Outcomes
                            </h3>

                            <p className="font-body font-light text-white/50 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10">
                                This precision capture session will generate your comprehensive personal analysis:
                            </p>

                            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 md:gap-4 mb-10 sm:mb-12 md:mb-14">
                                {outcomes.map(({ label, icon }) => (
                                    <span
                                        key={label}
                                        className="flex items-center gap-2 sm:gap-2.5 md:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase font-medium text-white/80 border border-white/10"
                                        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
                                    >
                                        <span className="text-brand-sage">{icon}</span>
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Action */}
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={onStart}
                                className="btn-scan group relative w-full sm:w-auto px-10 sm:px-12 md:px-16 py-4 sm:py-5 rounded-xl sm:rounded-2xl overflow-hidden font-body"
                                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                            >
                                <div
                                    className="absolute inset-0 translate-x-[-105%] group-hover:translate-x-[105%] transition-transform duration-700 ease-in-out skew-x-12"
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
                                    aria-hidden="true"
                                />

                                <span className="relative flex items-center justify-center gap-2.5 sm:gap-3 md:gap-4 text-white font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm">
                                    Start Capturing
                                    <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default InstructionPage;