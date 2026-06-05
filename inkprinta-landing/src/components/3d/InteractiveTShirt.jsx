import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Float, Html, Center } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
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

function TShirt() {
  const { scene } = useGLTF('/tshirt.glb');
  const ref = useRef();
  
  useEffect(() => {
    if (!scene) return;
    
    // Bulletproof material override
    const robustMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.6,
      metalness: 0.1,
      envMapIntensity: 1.0,
      side: THREE.DoubleSide
    });

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = robustMaterial;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    // Only respond to mouse movement if the tab is focused
    if (!ref.current || !document.hasFocus()) return;
    
    // Calculate target rotations based purely on mouse coordinates
    const targetY = (state.pointer.x * Math.PI) / 4; 
    const targetX = -(state.pointer.y * Math.PI) / 8;
    
    // Smoothly interpolate to the target cursor rotation
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 4 * delta);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 4 * delta);
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
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, cursor: 'grab' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8.5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#e0f2fe" />
        
        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <TShirt />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/tshirt.glb');
