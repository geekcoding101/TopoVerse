'use client';

import { useEffect, useState } from 'react';
import { useStore, ShapeType } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const shapes: ShapeType[] = ['fractal', 'mobius', 'penrose', 'cardioid'];

export default function HUD() {
    const { currentShape, setShape, isAutoPlay, toggleAutoPlay } = useStore();
    const [fps, setFps] = useState(0);

    useEffect(() => {
        let lastTime = performance.now();
        let frameCount = 0;
        let animationFrameId: number;

        const loop = () => {
            const now = performance.now();
            frameCount++;
            if (now - lastTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        if (!isAutoPlay) return;
        const interval = setInterval(() => {
            const currentIndex = shapes.indexOf(currentShape);
            const nextIndex = (currentIndex + 1) % shapes.length;
            setShape(shapes[nextIndex]);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlay, currentShape, setShape]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 select-none overflow-hidden text-cyan-100">
            {/* Holographic Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-cyan-900/10 pointer-events-none" />

            {/* Top Bar */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-start z-10"
            >
                {/* Logo / System Status */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-mono text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        TOPOVERSE
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-sans tracking-widest text-cyan-500/80">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                        SYSTEM ONLINE // v2.0
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="flex flex-col items-end gap-1 font-sans">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            {fps}
                        </span>
                        <span className="text-sm font-bold text-cyan-500 tracking-wider">FPS</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-cyan-400/80 tracking-widest bg-black/40 px-3 py-1 rounded-full border border-cyan-900/50 backdrop-blur-sm">
                        <span>PARTICLES</span>
                        <div className="w-24 h-1 bg-cyan-900/50 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-cyan-400 animate-pulse" />
                        </div>
                        <span>20K</span>
                    </div>
                </div>
            </motion.div>

            {/* Center Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] border border-cyan-500/5 rounded-full pointer-events-none animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[58vh] h-[58vh] border border-dashed border-cyan-500/10 rounded-full pointer-events-none animate-[spin_40s_linear_infinite_reverse]" />

            {/* Bottom Controls */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pointer-events-auto z-10 flex flex-col items-center gap-6 mb-4"
            >
                {/* Glass Panel */}
                <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/20 px-8 py-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 group hover:border-cyan-500/40 transition-colors duration-500">
                    {/* Corner Accents */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

                    <div className="text-[10px] font-mono text-cyan-600 tracking-[0.3em] uppercase mb-1">
                        Morph Target Sequence
                    </div>

                    <div className="flex gap-3">
                        {shapes.map((shape) => (
                            <button
                                key={shape}
                                onClick={() => setShape(shape)}
                                className={`relative px-6 py-3 text-sm font-sans font-bold tracking-wider uppercase transition-all duration-300 clip-path-slant ${currentShape === shape
                                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                                    : 'bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                    }`}
                                style={{
                                    clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
                                }}
                            >
                                {shape}
                            </button>
                        ))}
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent my-1" />

                    <button
                        onClick={toggleAutoPlay}
                        className={`w-full py-2 text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${isAutoPlay
                            ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]'
                            : 'text-cyan-700 hover:text-cyan-400'
                            }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isAutoPlay ? 'bg-green-500 animate-pulse' : 'bg-cyan-900'}`} />
                        {isAutoPlay ? 'Auto-Sequence Active' : 'Initiate Auto-Sequence'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
