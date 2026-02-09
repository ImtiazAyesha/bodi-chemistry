import React from 'react';
import { motion } from 'framer-motion';

const FloatingParticle = ({ delay, duration, x, y, size = 1 }) => (
    <motion.div
        className="absolute rounded-full bg-cyan-400"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, x: x, y: y }}
        animate={{
            opacity: [0, 0.6, 0],
            y: [y, y - 150],
            x: [x, x + Math.random() * 100 - 50],
        }}
        transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "easeOut"
        }}
    />
);

const ParticlesBackground = ({ count = 300 }) => {
    const particles = React.useMemo(() => {
        return [...Array(count)].map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 3,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            size: Math.random() * 2 + 1,
        }));
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated Mesh Gradient Background */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
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

            {/* Grid Pattern with Animation */}
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Large Glowing Orbs */}
            <motion.div
                className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />
        </div>
    );
};

export default ParticlesBackground;
