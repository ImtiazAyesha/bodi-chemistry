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
      desc: 'Precision Posture Capture',
      color: 'sage',
    },
    {
      id: 2,
      icon: FiZap,
      title: 'Analyze',
      desc: 'Neural Biomechanic Engine',
      color: 'deepSage',
    },
    {
      id: 3,
      icon: FiBarChart2,
      title: 'Report',
      desc: 'Embodied Metrics Report',
      color: 'slate',
    }
  ];

  return (
    <div className="min-h-screen bg-brand-sand relative overflow-hidden flex items-center selection:bg-brand-sage/30 font-sans">
      {/* Organic Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(143,169,155,0.1),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2DACF_1px,transparent_1px),linear-gradient(to_bottom,#E2DACF_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-30 pointer-events-none" />

      {/* Subtle Particles */}
      <ParticlesBackground />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 w-full relative z-10 py-12 lg:py-0">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-12 items-center min-h-screen lg:min-h-[90vh]">

          {/* LEFT COLUMN - Brand & Context */}
          <div className="text-center lg:text-left relative z-20 flex flex-col justify-center items-center lg:items-start h-full">
            {/* Brand Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 border border-brand-sage/20 backdrop-blur-md w-fit mb-6 lg:mb-10 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
              <span className="text-[10px] lg:text-xs font-display font-medium text-brand-deepSage tracking-[0.2em] uppercase">
                Bodi Kemistri System
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="relative mb-6 lg:mb-8 group cursor-default">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-[110px] font-display font-bold text-brand-slate leading-[0.9] tracking-tighter"
              >
                BODY <br />
                <span className="text-brand-deepSage">
                  MATRIX
                </span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1.2, ease: "circOut" }}
                className="w-16 lg:w-24 h-1 lg:h-1.5 bg-brand-sage mt-6 lg:mt-8 origin-left lg:origin-left rounded-full"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base lg:text-2xl text-brand-slate/70 mb-8 lg:mb-12 max-w-xl font-normal leading-relaxed px-4 lg:px-0"
            >
              Understand your physical architecture with <span className="text-brand-deepSage font-semibold">embodied precision</span>.
              Our diagnostics reveal the hidden metrics of your unique stature.
            </motion.p>

            {/* Premium CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#2F4A5C" }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="group relative w-full sm:w-fit px-10 py-4 lg:py-5 bg-transparent border border-brand-slate/20 rounded-2xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-4 text-brand-slate group-hover:text-white font-display font-semibold tracking-widest text-xs lg:text-sm uppercase transition-colors duration-300">
                Initialize Session
                <FiArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>

          {/* RIGHT COLUMN - Visualization - HIDDEN ON MOBILE/TABLET */}
          <div className="hidden lg:flex relative w-full h-full flex-col items-center justify-center py-12 lg:py-0">

            {/* Sophisticated Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] pointer-events-none">
              <div className="w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-brand-sage/10 rounded-full blur-[60px] lg:blur-[100px]" />
            </div>

            {/* BODY IMAGE - Centered & Organic */}
            <div className="relative z-0 h-[40vh] sm:h-[50vh] lg:h-[85vh] w-full flex items-center justify-center pointer-events-none mb-12 lg:mb-0">
              <img
                src="/Body.png"
                alt="Human Architecture"
                className="h-full w-auto object-contain drop-shadow-[0_20px_50px_rgba(111,143,132,0.15)] opacity-90 brightness-110 contrast-[1.05]"
              />

              {/* Gentle Scan Line */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-full max-w-[300px] lg:max-w-[400px] h-0.5 bg-brand-sage/40 z-20"
                initial={{ top: "15%" }}
                animate={{ top: ["15%", "85%", "15%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-[8px] lg:text-[10px] font-mono text-brand-deepSage font-semibold uppercase tracking-tighter hidden sm:block">Alignment</div>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[8px] lg:text-[10px] font-mono text-brand-deepSage font-semibold uppercase tracking-tighter hidden sm:block">Scanning</div>
              </motion.div>
            </div>

            {/* Floating Schematic Cards (Desktop) */}
            <div className="lg:absolute lg:inset-0 z-10 w-full h-full lg:pointer-events-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:block gap-4 sm:gap-6 w-full lg:h-full">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.2) }}
                    className={`
                        flex items-center lg:pointer-events-auto
                        ${index === 0 ? 'lg:absolute lg:top-[18%] lg:-left-[10%] lg:flex-row-reverse' : ''}
                        ${index === 1 ? 'lg:absolute lg:top-[45%] lg:-right-[10%]' : ''}
                        ${index === 2 ? 'lg:absolute lg:bottom-[22%] lg:-left-[10%] lg:flex-row-reverse' : ''}
                        ${index === 1 && 'sm:col-span-2 sm:justify-center lg:justify-start lg:col-auto'}
                      `}
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Schematic Connector (Desktop Only) */}
                    <div className={`hidden lg:flex w-12 h-[1px] bg-brand-sage/30 items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className="w-1.5 h-1.5 bg-brand-sage rounded-full" />
                    </div>

                    {/* Card */}
                    <div className={`
                        group relative w-full lg:w-72 p-5 lg:p-6 backdrop-blur-xl bg-white/60
                        border border-brand-sage/10 hover:border-brand-sage/30
                        shadow-glass hover:shadow-brand transition-all duration-500 rounded-3xl
                        ${index % 2 === 0 ? 'lg:mr-6' : 'lg:ml-6'}
                      `}>
                      <div className="flex items-center gap-4 mb-3 lg:mb-4">
                        <div className={`p-2.5 lg:p-3 rounded-xl bg-brand-sand border border-brand-sage/20 group-hover:bg-brand-sage group-hover:text-brand-sand transition-all duration-500`}>
                          <step.icon className="w-5 h-5 lg:w-6 lg:h-6 text-brand-sage group-hover:text-brand-sand" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-display font-bold text-brand-slate uppercase tracking-tight">{step.title}</h3>
                      </div>

                      <div className="h-0.5 w-10 lg:w-12 bg-brand-sage/20 mb-3 group-hover:w-full transition-all duration-700" />

                      <p className="text-xs lg:text-sm text-brand-deepSage font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;

