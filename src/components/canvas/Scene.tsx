'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import ParticleSystem from './ParticleSystem';
import { Suspense } from 'react';

export default function Scene() {
    return (
        <div className="w-full h-full absolute top-0 left-0 bg-black">
            <Canvas dpr={[1, 2]} gl={{ antialias: false, alpha: false }}>
                <color attach="background" args={['#050505']} />

                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={5}
                    maxDistance={20}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                    dampingFactor={0.05}
                />

                <Suspense fallback={null}>
                    <ParticleSystem />
                </Suspense>

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.6}
                    />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
