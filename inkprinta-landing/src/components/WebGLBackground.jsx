import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';

function TShirt({ scrollYProgress }) {
  const { scene } = useGLTF('/tshirt.glb');
  const ref = useRef();
  
  // Clone materials to prevent mutations across hot reloads or instances
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Make the material glossy but clean for a white background
        if (child.material) {
           child.material.roughness = 0.2; // Smooth
           child.material.metalness = 0.4; // Slight metallic sheen
           child.material.envMapIntensity = 1.5; // Good reflection
           child.material.color = new THREE.Color('#f8fafc'); // Very light slate base
           child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!ref.current) return;
    
    // Get current scroll progress (0 to 1)
    const progress = scrollYProgress.get();

    // Tie rotation to scroll (spin 360 degrees)
    const targetRotationY = progress * Math.PI * 2;
    
    // Tie scale to scroll (starts at 2.2, scales up to 3.2)
    const targetScale = 2.2 + progress * 1.5;

    // Tie position to scroll (starts centered, moves right and slightly down)
    const targetPositionX = progress * 3;
    const targetPositionY = -1 + progress * -0.5;

    // Smoothly interpolate for a premium WebGL feel (easing)
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.05);
    const currentScale = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.05);
    ref.current.scale.setScalar(currentScale);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetPositionX, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetPositionY, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <primitive ref={ref} object={scene} />
    </Float>
  );
}

export default function WebGLBackground({ scrollYProgress }) {
  return (
    <div className="fixed inset-0 z-0 bg-slate-50 pointer-events-none">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
        {/* Soft, premium lighting for a white theme */}
        <ambientLight intensity={1.5} />
        
        {/* Crisp directional lighting to create depth without harsh neon colors */}
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={3} 
          color="#ffffff" 
          castShadow 
        />
        <spotLight 
          position={[-5, 5, 5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={2} 
          color="#e0f2fe" /* Light sky blue tint */
        />
        
        {/* Studio environment for clean, glossy reflections */}
        <Environment preset="studio" />

        <Suspense fallback={null}>
          <TShirt scrollYProgress={scrollYProgress} />
        </Suspense>

        {/* Post-Processing Effects optimized for Light Theme */}
        <EffectComposer disableNormalPass>
          {/* Lower bloom intensity for light backgrounds to prevent blowout */}
          <Bloom 
            luminanceThreshold={0.9} 
            luminanceSmoothing={0.1} 
            mipmapBlur 
            intensity={0.4} 
          />
          <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Pre-load the model
useGLTF.preload('/tshirt.glb');
