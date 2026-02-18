import React from 'react';
import { motion } from 'framer-motion';

const FloatingParticle = ({ delay, duration, x, y, size = 1 }) => (
    <motion.div
        className="absolute rounded-full bg-brand-deepSage"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, x: x, y: y }}
        animate={{
            opacity: [0, 0.4, 0],
            y: [y, y - 120],
            x: [x, x + Math.random() * 60 - 30],
        }}
        transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "easeOut"
        }}
    />
);

const ParticlesBackground = ({ count = 200 }) => {
    const particles = React.useMemo(() => {
        if (typeof window === 'undefined') return [];
        return [...Array(count)].map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            duration: 4 + Math.random() * 4,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.5 + 0.5,
        }));
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Soft Brand Gradients */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        'radial-gradient(circle at 10% 20%, rgba(143, 169, 155, 0.05) 0%, transparent 40%)',
                        'radial-gradient(circle at 90% 80%, rgba(111, 143, 132, 0.05) 0%, transparent 40%)',
                        'radial-gradient(circle at 10% 20%, rgba(143, 169, 155, 0.05) 0%, transparent 40%)',
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Particles */}
            {particles.map((particle) => (
                <FloatingParticle
                    key={particle.id}
                    delay={particle.delay}
                    duration={particle.duration}
                    x={particle.x}
                    y={particle.y}
                    size={particle.size}
                />
            ))}

            {/* Subtle Texture/Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(143,169,155,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(143,169,155,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
        </div>
    );
};

export default ParticlesBackground;

