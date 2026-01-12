import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingOrb = ({ position, color, speed = 1, distort = 0.4, scale = 1 }: any) => {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0}
          metalness={0.1}
          distort={distort}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

const BackgroundParticles = () => {
  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Sparkles 
        ref={ref}
        count={200} 
        scale={12} 
        size={4} 
        speed={0.4} 
        opacity={0.6}
        color="#fbbf24" // Yellow stars
      />
      <Sparkles 
        count={150} 
        scale={15} 
        size={2} 
        speed={0.2} 
        opacity={0.4}
        color="#60a5fa" // Blue swirls
      />
    </group>
  );
};

export const StarryNightScene = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-vg-dark">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1e3a8a" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <BackgroundParticles />

        {/* Abstract "Stars" mimicking the painting's large swirls */}
        <FloatingOrb position={[-4, 2, -2]} color="#fbbf24" scale={1.2} speed={1.5} />
        <FloatingOrb position={[4, -2, -3]} color="#f59e0b" scale={1.5} speed={1.2} />
        <FloatingOrb position={[0, 3, -5]} color="#fcd34d" scale={0.8} speed={2} />
        <FloatingOrb position={[-3, -3, -4]} color="#1e40af" scale={1.8} distort={0.6} speed={0.8} />
        
        <fog attach="fog" args={['#020617', 5, 20]} />
      </Canvas>
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-60 pointer-events-none" />
    </div>
  );
};
