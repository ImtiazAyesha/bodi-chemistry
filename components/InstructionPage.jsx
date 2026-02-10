import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight, FiCheck, FiCamera, FiLayout, FiPieChart } from 'react-icons/fi';
import ParticlesBackground from './ui/ParticlesBackground';

const InstructionPage = ({ onStart }) => {
    const highlights = [
        {
            title: "Solo Capture",
            description: "No second person required. Easily take all photos by yourself.",
            icon: <FiUser />
        },
        {
            title: "Auto-Pilot",
            description: "Camera auto-captures instantly when you're positioned correctly.",
            icon: <FiCamera />
        },
        {
            title: "Optimal Distance",
            description: "Position yourself approximately 6-8 feet (2 meters) from the lens.",
            icon: <FiLayout />
        }
    ];

    const stages = [
        {
            number: 1,
            title: "Face Capture",
            iconType: "face",
            description: "Align your face within the guide for an automatic 2-second capture."
        },
        {
            number: 2,
            title: "Upper Body Front",
            iconType: "body-front",
            description: "Face the camera directly with arms relaxed to capture front posture."
        },
        {
            number: 3,
            title: "Upper Body Side",
            iconType: "body-side",
            description: "Turn to your side for a profile view of spinal and shoulder alignment."
        },
        {
            number: 4,
            title: "Lower Body Side",
            iconType: "lower-body",
            description: "Maintain side profile and ensure full lower body is visible in frame."
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
        <div className="min-h-screen bg-brand-sand relative overflow-hidden flex flex-col items-center py-12 selection:bg-brand-sage/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(143,169,155,0.1),_transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#E2DACF_1px,transparent_1px),linear-gradient(to_bottom,#E2DACF_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
            <ParticlesBackground />

            <div className="relative z-10 w-full max-w-6xl px-4 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 border border-brand-sage/20 backdrop-blur-md mb-6 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
                        <span className="text-[10px] font-display font-medium text-brand-deepSage tracking-[0.2em] uppercase">
                            Capture Guide
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-slate tracking-tighter mb-6">
                        QUICK <span className="text-brand-deepSage">SESSION</span>
                    </h1>

                    <p className="text-brand-slate/70 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Our advanced AI vision system will guide you through a precision capture session to generate your 3D postural profile.
                    </p>
                </motion.div>

                {/* Key Benefits / Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {highlights.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="bg-white/60 border border-brand-sage/10 p-6 rounded-3xl flex flex-col items-center text-center backdrop-blur-xl group hover:border-brand-sage/30 hover:shadow-brand transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg">
                                {item.icon}
                            </div>
                            <h3 className="text-brand-slate font-semibold mb-2 uppercase tracking-wide text-sm">{item.title}</h3>
                            <p className="text-brand-deepSage font-medium text-sm leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Stages Overview - Connected Flow Layout */}
                <div className="mb-32 relative">
                    <div className="flex items-center gap-4 mb-20">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-slate/10 to-brand-slate/20" />
                        <h2 className="text-brand-slate/40 font-mono text-[10px] tracking-[0.4em] uppercase font-semibold">Capture Stages</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-brand-slate/10 to-brand-slate/20" />
                    </div>

                    {/* Timeline Container */}
                    <div className="relative flex flex-col md:flex-row items-start justify-between gap-16 md:gap-4 px-4">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] border-t border-dashed border-brand-slate/30" />

                        {stages.map((stage, index) => (
                            <motion.div
                                key={stage.number}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                className="relative flex flex-col items-center flex-1 text-center group"
                            >
                                {/* Circle Icon */}
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-full bg-white border border-brand-slate/5 flex items-center justify-center text-brand-slate group-hover:border-black group-hover:text-black transition-all duration-500 z-10 relative shadow-glass group-hover:shadow-xl">
                                        <div className="absolute inset-0 rounded-full bg-black/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
                                        {renderStageIcon(stage.iconType)}
                                    </div>

                                    {/* Stage Number Badge */}
                                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold z-20 shadow-lg">
                                        0{stage.number}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="max-w-[200px]">
                                    <h4 className="text-brand-slate font-semibold text-sm mb-3 uppercase tracking-widest group-hover:text-black transition-colors">
                                        {stage.title}
                                    </h4>
                                    <p className="text-brand-slate/50 text-[11px] leading-relaxed font-medium">
                                        {stage.description}
                                    </p>
                                </div>

                                {/* Connecting Line (Mobile) */}
                                {index < stages.length - 1 && (
                                    <div className="md:hidden absolute top-24 left-1/2 -translate-x-1/2 w-[1px] h-16 border-l border-dashed border-brand-slate/30" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final Outcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/40 border border-brand-sage/10 rounded-[3rem] p-10 md:p-16 mb-24 text-center backdrop-blur-md shadow-glass relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-sand/50 rounded-full blur-[80px] -z-10" />

                    <div className="flex justify-center mb-10">
                        <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white shadow-2xl transition-transform duration-500 hover:scale-110">
                            <FiPieChart className="w-9 h-9" />
                        </div>
                    </div>

                    <h3 className="text-3xl font-display font-bold text-brand-slate mb-4 tracking-tight">Embodied Intelligence</h3>
                    <p className="text-brand-slate/60 font-medium max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                        Instantly access your comprehensive body analysis, including precision silhouettes,
                        posture alignment scores, and personalized corrective exercise plan.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {["Digital Silhouettes", "Posture Analysis", "Exercise Plan"].map((tag) => (
                            <span key={tag} className="px-6 py-2.5 rounded-full bg-white border border-brand-sage/10 text-brand-slate/70 text-[10px] font-semibold uppercase tracking-widest shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#2F4A5C" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onStart}
                        className="group relative w-full sm:w-fit px-12 py-5 bg-transparent border border-brand-slate/20 rounded-2xl transition-all duration-300 mx-auto"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-4 text-brand-slate group-hover:text-white font-display font-semibold tracking-[0.2em] text-xs lg:text-sm uppercase transition-colors duration-300">
                            Initialize Session
                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </motion.button>
                </motion.div>

            </div>
        </div>
    );
};

export default InstructionPage;

