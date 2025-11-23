import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFractal, generateMobius, generatePenrose, generateCardioid, PARTICLE_COUNT } from '@/utils/shapes';
import { useStore, ShapeType } from '@/store/useStore';

const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec4 uWeights; // Weights for Fractal, Mobius, Penrose, Cardioid
  
  attribute vec3 aPosFractal;
  attribute vec3 aPosMobius;
  attribute vec3 aPosPenrose;
  attribute vec3 aPosCardioid;
  attribute float aRandom;
  
  varying vec3 vColor;
  varying float vAlpha;

  // Simplex noise or simple hash for movement
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Mix positions based on weights
    vec3 targetPos = 
      aPosFractal * uWeights.x +
      aPosMobius * uWeights.y +
      aPosPenrose * uWeights.z +
      aPosCardioid * uWeights.w;
      
    // Add some noise movement
    float noiseFreq = 0.5;
    float noiseAmp = 0.1;
    vec3 noise = vec3(
      sin(uTime * noiseFreq + aRandom * 100.0),
      cos(uTime * noiseFreq + aRandom * 100.0),
      sin(uTime * noiseFreq + aRandom * 50.0)
    ) * noiseAmp;
    
    vec3 pos = targetPos + noise;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = (4.0 * uPixelRatio) * (1.0 / -mvPosition.z);
    
    // Color variation
    // Base color: Neon Cyan / Magenta / Gold mix
    vec3 color1 = vec3(0.0, 1.0, 1.0); // Bright Cyan
    vec3 color2 = vec3(1.0, 0.0, 0.8); // Bright Magenta
    vec3 color3 = vec3(1.0, 0.8, 0.0); // Gold
    
    // Mix based on position
    float mixFactor = smoothstep(-3.0, 3.0, pos.y);
    vec3 baseColor = mix(color1, color2, mixFactor);
    baseColor = mix(baseColor, color3, sin(uTime * 0.5 + pos.x) * 0.5 + 0.5);
    
    vColor = baseColor;
    
    // Higher alpha for better visibility
    vAlpha = 0.8 + 0.2 * sin(uTime * 3.0 + aRandom * 10.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circular particle
    vec2 uv = gl_PointCoord.xy - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    
    // Soft glow with white core
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);
    
    // Add white core
    float core = smoothstep(0.1, 0.0, r);
    vec3 finalColor = mix(vColor, vec3(1.0), core);
    
    gl_FragColor = vec4(finalColor, vAlpha * glow);
  }
`;

export default function ParticleSystem() {
    const mesh = useRef<THREE.Points>(null);
    const material = useRef<THREE.ShaderMaterial>(null);
    const currentShape = useStore((state) => state.currentShape);

    // Generate all shape positions once
    const { positionsFractal, positionsMobius, positionsPenrose, positionsCardioid, randoms } = useMemo(() => {
        const pFractal = generateFractal(PARTICLE_COUNT);
        const pMobius = generateMobius(PARTICLE_COUNT);
        const pPenrose = generatePenrose(PARTICLE_COUNT);
        const pCardioid = generateCardioid(PARTICLE_COUNT);
        const rands = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            rands[i] = Math.random();
        }

        return {
            positionsFractal: pFractal,
            positionsMobius: pMobius,
            positionsPenrose: pPenrose,
            positionsCardioid: pCardioid,
            randoms: rands
        };
    }, []);

    // Target weights for interpolation
    const targetWeights = useRef(new THREE.Vector4(1, 0, 0, 0));
    const currentWeights = useRef(new THREE.Vector4(1, 0, 0, 0));

    useEffect(() => {
        // Set target weights based on current shape
        switch (currentShape) {
            case 'fractal': targetWeights.current.set(1, 0, 0, 0); break;
            case 'mobius': targetWeights.current.set(0, 1, 0, 0); break;
            case 'penrose': targetWeights.current.set(0, 0, 1, 0); break;
            case 'cardioid': targetWeights.current.set(0, 0, 0, 1); break;
        }
    }, [currentShape]);

    useFrame((state) => {
        if (!material.current) return;

        // Update time
        material.current.uniforms.uTime.value = state.clock.elapsedTime;

        // Smoothly interpolate weights
        currentWeights.current.lerp(targetWeights.current, 0.05);
        material.current.uniforms.uWeights.value.copy(currentWeights.current);
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uPixelRatio: { value: typeof window !== 'undefined' ? window.devicePixelRatio : 1 },
        uWeights: { value: new THREE.Vector4(1, 0, 0, 0) }
    }), []);

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position" // Helper, though we use custom attrs
                    count={PARTICLE_COUNT}
                    array={positionsFractal} // Initial positions for bounding box
                    itemSize={3}
                    args={[positionsFractal, 3]}
                />
                <bufferAttribute
                    attach="attributes-aPosFractal"
                    count={PARTICLE_COUNT}
                    array={positionsFractal}
                    itemSize={3}
                    args={[positionsFractal, 3]}
                />
                <bufferAttribute
                    attach="attributes-aPosMobius"
                    count={PARTICLE_COUNT}
                    array={positionsMobius}
                    itemSize={3}
                    args={[positionsMobius, 3]}
                />
                <bufferAttribute
                    attach="attributes-aPosPenrose"
                    count={PARTICLE_COUNT}
                    array={positionsPenrose}
                    itemSize={3}
                    args={[positionsPenrose, 3]}
                />
                <bufferAttribute
                    attach="attributes-aPosCardioid"
                    count={PARTICLE_COUNT}
                    array={positionsCardioid}
                    itemSize={3}
                    args={[positionsCardioid, 3]}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    count={PARTICLE_COUNT}
                    array={randoms}
                    itemSize={1}
                    args={[randoms, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={material}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
