import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import ParticlesBackground from './ui/ParticlesBackground';

const InstructionPage = ({ onStart }) => {
    const stages = [
        {
            number: 1,
            title: "Face Capture",
            iconType: "face",
            instructions: [
                "Look directly at the camera",
                "Keep your face centered in the circle",
                "Maintain a neutral expression",
                "Hold still for 2 seconds"
            ]
        },
        {
            number: 2,
            title: "Upper Body Front",
            iconType: "body-front",
            instructions: [
                "Face the camera directly",
                "Stand with arms at your sides",
                "Keep shoulders relaxed",
                "Hold still for 2 seconds"
            ]
        },
        {
            number: 3,
            title: "Upper Body Side",
            iconType: "body-side",
            instructions: [
                "Turn to your right side",
                "Stand naturally with arms relaxed",
                "Keep your body centered",
                "Hold still for 2 seconds"
            ]
        },
        {
            number: 4,
            title: "Lower Body Side",
            iconType: "lower-body",
            instructions: [
                "Stay in side profile",
                "Full body should be visible",
                "Stand naturally",
                "Hold still for 2 seconds"
            ]
        }
    ];

    const renderStageIcon = (iconType) => {
        switch (iconType) {
            case 'face':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                );
            case 'body-front':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                );
            case 'body-side':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                );
            case 'lower-body':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center py-10 selection:bg-cyan-500/30">
            {/* Dynamic Background Layers */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.15),_transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Particles */}
            <ParticlesBackground />

            <div className="relative z-10 w-full max-w-5xl px-4 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-md mb-6 shadow-lg shadow-cyan-900/10">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono text-cyan-100 tracking-[0.2em] uppercase">
                            Protocol Initiation
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                        CAPTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient">INSTRUCTIONS</span>
                    </h1>

                    <p className="text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                        You're about to complete 4 photo captures. Follow the on-screen guides and hold each pose for 2 seconds.
                    </p>
                </motion.div>

                {/* Important Tips */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-10 backdrop-blur-sm"
                >
                    <h3 className="flex items-center gap-2 text-amber-400 font-bold mb-3 uppercase tracking-wide text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        Important Tips
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-amber-200/80 text-sm font-mono">
                        <li className="flex items-center gap-2"><span>•</span> Ensure good lighting in your room</li>
                        <li className="flex items-center gap-2"><span>•</span> Stand about 6 feet away from your camera</li>
                        <li className="flex items-center gap-2"><span>•</span> Wear fitted clothing for accurate analysis</li>
                        <li className="flex items-center gap-2"><span>•</span> The green box will indicate correct alignment</li>
                    </ul>
                </motion.div>

                {/* Horizontal Step-Based Layout */}
                <div className="mb-10">
                    {/* Step Indicators */}
                    <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto px-4">
                        {stages.map((stage, index) => (
                            <React.Fragment key={stage.number}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Step Circle */}
                                    <div className="relative group">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-900/50 hover:scale-110 transition-transform duration-300 relative z-10">
                                            {stage.number}
                                        </div>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    {/* Step Label */}
                                    <div className="mt-3 text-center">
                                        <p className="text-cyan-400 text-xs font-mono uppercase tracking-wider">Step {stage.number}</p>
                                    </div>
                                </motion.div>

                                {/* Connecting Arrow */}
                                {index < stages.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        animate={{ opacity: 1, scaleX: 1 }}
                                        transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                                        className="flex-1 flex items-center justify-center"
                                    >
                                        <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-cyan-500/20 relative">
                                            <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-500/50" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stages.map((stage, index) => (
                            <motion.div
                                key={stage.number}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                className="group relative bg-slate-900/40 backdrop-blur border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-300 hover:bg-slate-900/60"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                                <div className="relative z-10">
                                    {/* Card Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                            {renderStageIcon(stage.iconType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-bold text-sm truncate">{stage.title}</h3>
                                            <p className="text-cyan-400 text-xs font-mono">~30 sec</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-cyan-500/10 mb-4" />

                                    {/* Instructions */}
                                    <ul className="space-y-2">
                                        {stage.instructions.map((instruction, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                </svg>
                                                <span className="leading-relaxed">{instruction}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Start Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center gap-4"
                >
                    <button
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-transparent border border-cyan-500/30 overflow-hidden rounded-sm w-full sm:w-auto min-w-[200px]"
                    >
                        <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300" />

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

                        <span className="relative z-10 flex items-center justify-center gap-3 text-cyan-50 font-bold tracking-widest text-sm uppercase">
                            Start Capture Session
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    <p className="text-slate-600 text-xs font-mono flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        Total capture time: ~2 minutes
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default InstructionPage;
