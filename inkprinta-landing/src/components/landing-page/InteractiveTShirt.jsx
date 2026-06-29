import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Float, Html, Center } from '@react-three/drei';
import { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';

function Loader() {
  return (
    <Html center>
      <div className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 whitespace-nowrap">
        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-800 tracking-widest uppercase">Loading 3D...</span>
      </div>
    </Html>
  );
}

function TShirt({ onReady, mouseRef }) {
  const { scene } = useGLTF('/tshirt.glb');
  const ref = useRef();

  useEffect(() => {
    if (!scene) return;

    const robustMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.6,
      metalness: 0.1,
      envMapIntensity: 1.0,
      side: THREE.DoubleSide
    });

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = robustMaterial;
      }
    });

    // Wait 100ms for Center component to calculate the model's bounding box and align it
    const timer = setTimeout(() => {
      onReady();
    }, 100);

    return () => clearTimeout(timer);
  }, [scene, onReady]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Clamp delta to prevent sudden rotation jumps on framerate drops
    const clampedDelta = Math.min(delta, 0.1);

    const targetY = (mouseRef.current.x * Math.PI) / 4;
    const targetX = -(mouseRef.current.y * Math.PI) / 8;

    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 4 * clampedDelta);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 4 * clampedDelta);
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={1.2}>
      <Center position={[0, -0.5, 0]}>
        <primitive ref={ref} object={scene} scale={5.5} />
      </Center>
    </Float>
  );
}

export default function InteractiveTShirt() {
  const [isReady, setIsReady] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="transition-opacity duration-700 ease-out"
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 50, 
        cursor: 'grab',
        opacity: isReady ? 1 : 0
      }}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8.5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#e0f2fe" />

        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <TShirt onReady={() => setIsReady(true)} mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/tshirt.glb');
