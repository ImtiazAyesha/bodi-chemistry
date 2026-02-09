import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiZap, FiCamera, FiBarChart2, FiArrowRight, FiCheck } from 'react-icons/fi';
import ParticlesBackground from './ui/ParticlesBackground';


const LandingPage = ({ onStart }) => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      id: 1,
      icon: FiCamera,
      title: 'Scan',
      desc: 'Capture Alignment',
      color: 'cyan',
    },
    {
      id: 2,
      icon: FiZap,
      title: 'Process',
      desc: 'Neural Analysis',
      color: 'blue',
    },
    {
      id: 3,
      icon: FiBarChart2,
      title: 'Report',
      desc: 'Biometric Data',
      color: 'cyan',
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center selection:bg-cyan-500/30">
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.15),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Dense Particles for Depth */}
      <ParticlesBackground />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center h-[90vh]">

          {/* LEFT COLUMN - Brand & Context */}
          <div className="text-left relative z-20 flex flex-col justify-center h-full pt-10">
            {/* Brand Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-md w-fit mb-12 shadow-lg shadow-cyan-900/10"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-100 tracking-[0.2em] uppercase">
                Bodi Kemistri System
              </span>
            </motion.div>

            {/* Main Headline with Depth Effect */}
            <div className="relative mb-10 group cursor-default">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter"
              >
                BODY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] animate-gradient">
                  MATRIX
                </span>
              </motion.h1>

              {/* Decorative "Ghost" Text for Visual Interest */}
              <h1 className="absolute top-1 left-1 text-7xl lg:text-9xl font-black text-cyan-500/5 leading-[0.85] tracking-tighter pointer-events-none -z-10 blur-sm">
                BODY <br /> MATRIX
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1.2, ease: "circOut" }}
                className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 mt-8 origin-left rounded-r-full"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg lg:text-xl text-slate-400 mb-14 max-w-lg font-light leading-relaxed"
            >
              Analyze your biomechanics with <span className="text-cyan-200 font-medium">clinical precision</span>.
              Our AI-driven posture diagnostics reveal the hidden metrics of your physical performance.
            </motion.p>

            {/* Premium CTA Button */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="group relative w-fit px-8 py-4 bg-transparent border border-cyan-500/30 overflow-hidden rounded-sm"
            >
              <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300" />

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

              <span className="relative z-10 flex items-center gap-4 text-cyan-50 font-bold tracking-widest text-sm uppercase">
                Initiate Analysis
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            {/* Tech Specs Footer */}
            {/* <div className="mt-16 flex gap-8 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
              <span>AI-Powered Core</span>
              <span>Real-time Mapping</span>
              <span>ISO 27001 Secure</span>
            </div> */}
          </div>

          {/* RIGHT COLUMN - Visualization */}
          <div className="relative h-full flex items-center justify-center">

            {/* Central Platform & Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]">
              <div className="w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>

            {/* FULL BODY IMAGE - Centered & Optimized */}
            <div className="relative z-0 h-[85vh] w-full flex items-center justify-center pointer-events-none">
              <img
                src="/Human_body-removebg-preview.png"
                alt="Body Analysis Model"
                className="h-[95%] w-auto object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.15)] opacity-95"
              />

              {/* Horizontal Scan Line */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-[350px] h-0.5 bg-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,1)] z-20"
                initial={{ top: "20%" }}
                animate={{ top: ["20%", "80%", "20%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-300">SCAN: ACTV</div>
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-300">01011</div>
              </motion.div>
            </div>

            {/* Floating Info Cards - Schematic Style */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.2) }}
                  className={`absolute pointer-events-auto flex items-center
                      ${index === 0 ? 'top-[20%] -left-[5%]  flex-row-reverse' : ''}
                      ${index === 1 ? 'top-[48%] -right-[5%]' : ''}
                      ${index === 2 ? 'bottom-[25%] -left-[5%] flex-row-reverse' : ''}
                    `}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Schematic Connector */}
                  <div className={`w-8 h-[1px] bg-cyan-500/30 flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className="min-w-[4px] h-[4px] bg-cyan-400 rounded-full" />
                  </div>

                  {/* Card */}
                  <div className={`
                      group relative w-64 p-5 backdrop-blur-xl bg-[#0B1221]/80
                      border border-cyan-500/10 hover:border-cyan-500/30
                      transition-all duration-300
                      ${index % 2 === 0 ? 'mr-4 rounded-l-xl rounded-br-xl' : 'ml-4 rounded-r-xl rounded-bl-xl'}
                    `}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`p-2 rounded bg-cyan-950/50 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">{step.title}</h3>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-cyan-500/20 to-transparent mb-3" />

                    <p className="text-xs text-slate-400 font-mono leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
