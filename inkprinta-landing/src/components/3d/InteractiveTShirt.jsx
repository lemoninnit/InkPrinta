import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Float } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';

function TShirt() {
  const { scene } = useGLTF('/tshirt.glb');
  const ref = useRef();
  
  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
           child.material.roughness = 0.5;
           child.material.metalness = 0.1;
           child.material.envMapIntensity = 1.0;
           child.material.color = new THREE.Color('#ffffff');
           child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    const targetY = (state.pointer.x * Math.PI) / 4; 
    const targetX = -(state.pointer.y * Math.PI) / 8;
    const baseRotationY = state.clock.getElapsedTime() * 0.15;
    
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, baseRotationY + targetY, 4 * delta);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 4 * delta);
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={1.5}>
      <primitive ref={ref} object={scene} scale={3.5} position={[0, -1, 0]} />
    </Float>
  );
}

export default function InteractiveTShirt() {
  return (
    <div className="absolute inset-0 w-full h-full z-50 cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#e0f2fe" />
        
        <Environment preset="city" />

        <Suspense fallback={null}>
          <TShirt />
        </Suspense>
      </Canvas>
    </div>
  );
}

try {
  useGLTF.preload('/tshirt.glb');
} catch (e) {
  console.error("Preload error:", e);
}
