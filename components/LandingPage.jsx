import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiActivity, FiZap, FiCamera, FiBarChart2, FiArrowRight,
    FiShield, FiLayout, FiMaximize2
} from 'react-icons/fi';
import ParticlesBackground from './ui/ParticlesBackground';

/**
 * Scan-line decoration for interaction feedback
 */
const ScanLine = () => (
    <motion.div
        initial={{ top: 0, opacity: 0 }}
        animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-sage/40 to-transparent z-10 pointer-events-none"
    />
);

const LandingPage = ({ onStart }) => {
    const steps = [
        {
            id: 1,
            icon: <FiCamera />,
            title: 'Precision Scan',
            desc: 'Multi-stage AI vision capture of your physical structure.',
            tag: 'Computer Vision',
            pos: 'top-[18%] left-16'
        },
        {
            id: 2,
            icon: <FiZap />,
            title: 'Neural Analysis',
            desc: 'Deep logic engine processing biomechanic markers.',
            tag: 'Neural Engine',
            pos: 'top-1/2 -translate-y-1/2 right-8'
        },
        {
            id: 3,
            icon: <FiBarChart2 />,
            title: 'Embodied Report',
            desc: 'Holistic assessment of posture and symmetry.',
            tag: 'Metric Driven',
            pos: 'bottom-[18%] left-16'
        }
    ];

    return (
        <div
            className="min-h-screen relative overflow-hidden flex flex-col items-center selection:bg-brand-sage/30"
            style={{ background: 'linear-gradient(165deg, #F8F5F0 0%, #F0EBE3 40%, #E8E1D7 100%)', fontFamily: 'var(--font-body)' }}
        >
            {/* ── Atmospheric background layers ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-30"
                    style={{ background: 'radial-gradient(circle, rgba(143,169,155,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, rgba(47,74,92,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />

                {/* Subtle Technical Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#2F4A3C 1px, transparent 1px), linear-gradient(90deg, #2F4A3C 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            <ParticlesBackground />

            <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 md:pt-16 lg:pt-0 min-h-screen flex flex-col">
                <section className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">

                    {/* LEFT COLUMN: BRAND & HERO */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-6 sm:pt-8 md:pt-12 lg:pt-12">

                        {/* ── Eyebrow badge ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex items-center gap-2 mb-5 sm:mb-6"
                        >
                            <div
                                className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
                                style={{
                                    background: 'rgba(255,255,255,0.5)',
                                    backdropFilter: 'blur(12px)',
                                    borderColor: 'rgba(143,169,155,0.35)',
                                }}
                            >
                                {/* Pulsing dot */}
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#8FA99B' }} />
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#8FA99B' }} />
                                </span>
                                <span className="font-display font-bold text-[10px] tracking-[0.18em] uppercase" style={{ color: '#2F4A5C' }}>
                                    Bodi KEMISTRI · Body Scan
                                </span>
                            </div>
                        </motion.div>

                        {/* ── Headline ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-5 sm:mb-6"
                        >
                            <h1 className="font-display tracking-tight text-brand-slate" style={{ lineHeight: 1.05 }}>
                                {/* Prelude — medium, lighter weight */}
                                <span
                                    className="block font-semibold"
                                    style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.75rem)', color: '#000000', letterSpacing: '-0.01em', marginBottom: '0.15em' }}
                                >
                                    Welcome to the
                                </span>
                                {/* Brand name — large, extrabold, sage accent */}
                                <span
                                    className="block font-extrabold"
                                    style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)', color: '#5A7A6E', letterSpacing: '-0.03em', lineHeight: 1 }}
                                >
                                    Bodi KEMISTRI
                                </span>
                                {/* "Body Scan" — large, extrabold, dark */}
                                <span
                                    className="block font-extrabold"
                                    style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5.5rem)', color: '#2F4A5C', letterSpacing: '-0.03em', lineHeight: 1.05 }}
                                >
                                    Body Scan
                                </span>
                            </h1>
                            {/* Animated underline accent */}
                            <motion.div
                                initial={{ scaleX: 0, originX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                className="mt-4 h-[3px] w-24 sm:w-32 rounded-full mx-auto lg:mx-0"
                                style={{ background: 'linear-gradient(to right, #8FA99B, rgba(143,169,155,0.2))' }}
                            />
                        </motion.div>

                        {/* ── Timing callout card ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-6 sm:mb-8 max-w-lg w-full"
                        >
                            <p
                                className="font-body font-light text-sm sm:text-[15px] leading-relaxed"
                                style={{ color: 'rgba(47,74,92,0.68)' }}
                            >
                                This assessment takes approximately{' '}
                                <strong style={{ color: '#2F4A5C', fontWeight: 600 }}>12–15 minutes</strong>.
                                {' '}If you leave and come back you'll start from the beginning — please ensure you have{' '}
                                <strong style={{ color: '#2F4A5C', fontWeight: 600 }}>12–15 consecutive minutes</strong>{' '}
                                of uninterrupted time.
                            </p>
                        </motion.div>

                        {/* ── Body bullets — visible on small screens only ── */}
                        <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
                            className="lg:hidden mb-8 sm:mb-10 space-y-3 max-w-md w-full text-left"
                        >
                            {[
                                { text: 'This scan identifies how your body is organizing internal pressure and stability.' },
                                { text: 'Your body works as one system.' },
                                { text: 'When one area compensates, the entire structure adjusts.' },
                            ].map(({ text }, i) => (
                                <motion.li
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, x: -12 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                                    }}
                                    className="flex items-start gap-3"
                                >
                                    <span
                                        className="flex-shrink-0 mt-[5px] w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                                        style={{
                                            background: 'rgba(143,169,155,0.18)',
                                            border: '1px solid rgba(143,169,155,0.35)',
                                            color: '#5A7A6E',
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="font-body text-sm sm:text-[15px] leading-relaxed" style={{ color: '#000000' }}>
                                        {text}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        {/* ── CTA ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center lg:items-start gap-3 w-full sm:w-auto"
                        >
                            <motion.button
                                whileHover={{ scale: 1.025, boxShadow: '0 12px 40px rgba(47,74,92,0.3)' }}
                                whileTap={{ scale: 0.975 }}
                                onClick={onStart}
                                className="btn-scan group relative w-full sm:w-auto px-10 sm:px-12 md:px-14 lg:px-16 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
                            >
                                <span className="relative flex items-center justify-center gap-3 sm:gap-4 text-white font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-xs sm:text-sm">
                                    Begin Scan
                                    <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </span>
                            </motion.button>
                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN: PROFESSIONAL DIAGNOSTIC VISUALIZATION */}
                    <div className="hidden lg:flex relative h-full flex-col items-center justify-center py-12 xl:py-20">
                        <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">

                            {/* Central Body Asset - SVG Silhouette Structure from UpperBodyFrontGhost */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                                className="relative z-0 h-full w-full flex items-center justify-center"
                            >
                                <svg
                                    viewBox="0 0 480 960"
                                    className="h-full w-auto max-h-[75vh] drop-shadow-[0_20px_100px_rgba(143,169,155,0.2)]"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <g transform="translate(240, 500)">


                                        {/* Main Silhouette Path from UpperBodyFrontGhost */}
                                        <g transform="scale(3.8) translate(-103, -103)">
                                            <path
                                                d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3 c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522 c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201 c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109 c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24 c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217 c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245 c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631 c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522 c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448 c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577 c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257 c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674 c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635 c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514 c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733 C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733 c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988 c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198 c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953 c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577 c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448 c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522 c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269 c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727 c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848 c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033 c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116 c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522 c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3 c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
                                                fill="rgba(47, 74, 92, 0.03)"
                                                stroke="rgba(47, 74, 92, 0.3)"
                                                strokeWidth="0.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </g>

                                        {/* Scanning Line HUD Effect - Brand Sage Green */}
                                        <motion.line
                                            x1="-180" y1="0" x2="180" y2="0"
                                            stroke="#8FA99B"
                                            strokeWidth="3"
                                            opacity="0.85"
                                            initial={{ y: -200 }}
                                            animate={{ y: 500 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        />
                                    </g>
                                </svg>


                            </motion.div>

                            {/* ── Bullet annotation cards — large screen only ── */}
                            <div className="absolute inset-0 z-10 pointer-events-none">

                                {/* Card 1 — top left, tethered to upper body */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute top-[14%] left-0"
                                    style={{ maxWidth: 200 }}
                                >
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.55)',
                                            backdropFilter: 'blur(14px)',
                                            border: '1px solid rgba(143,169,155,0.25)',
                                            boxShadow: '0 4px 20px rgba(47,74,92,0.07)',
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                                style={{ background: 'rgba(90,122,110,0.15)', border: '1px solid rgba(90,122,110,0.35)', color: '#5A7A6E' }}
                                            >1</span>
                                            <div className="h-px flex-1" style={{ background: 'rgba(143,169,155,0.4)', borderTop: '1px dashed rgba(143,169,155,0.5)' }} />
                                        </div>
                                        <p className="font-body text-[12px] leading-snug" style={{ color: '#000000' }}>
                                            This scan identifies how your body is organizing internal pressure and stability.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Card 2 — middle right, tethered to torso */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute right-0"
                                    style={{ top: '44%', maxWidth: 190 }}
                                >
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.55)',
                                            backdropFilter: 'blur(14px)',
                                            border: '1px solid rgba(143,169,155,0.25)',
                                            boxShadow: '0 4px 20px rgba(47,74,92,0.07)',
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="h-px flex-1" style={{ borderTop: '1px dashed rgba(143,169,155,0.5)' }} />
                                            <span
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                                style={{ background: 'rgba(90,122,110,0.15)', border: '1px solid rgba(90,122,110,0.35)', color: '#5A7A6E' }}
                                            >2</span>
                                        </div>
                                        <p className="font-body text-[12px] leading-snug text-right" style={{ color: '#000000' }}>
                                            Your body works as one system.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Card 3 — bottom left, tethered to lower body */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute bottom-[14%] left-0"
                                    style={{ maxWidth: 200 }}
                                >
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.55)',
                                            backdropFilter: 'blur(14px)',
                                            border: '1px solid rgba(143,169,155,0.25)',
                                            boxShadow: '0 4px 20px rgba(47,74,92,0.07)',
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                                style={{ background: 'rgba(90,122,110,0.15)', border: '1px solid rgba(90,122,110,0.35)', color: '#5A7A6E' }}
                                            >3</span>
                                            <div className="h-px flex-1" style={{ borderTop: '1px dashed rgba(143,169,155,0.5)' }} />
                                        </div>
                                        <p className="font-body text-[12px] leading-snug" style={{ color: '#000000' }}>
                                            When one area compensates, the entire structure adjusts.
                                        </p>
                                    </div>
                                </motion.div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;

