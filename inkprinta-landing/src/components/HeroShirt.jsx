import { Canvas } from '@react-three/fiber'
import { Float, Environment, useGLTF, PresentationControls, ContactShadows } from '@react-three/drei'

// 1. This component loads your actual 3D file
function TShirtModel() {
    // It looks in the public folder for 'tshirt.glb'
    const { scene } = useGLTF('/tshirt.glb')

    return (
        // <primitive> is how you render a pre-made 3D object in R3F
        <primitive object={scene} scale={2} position={[0, -1, 0]} />
    )
}

// 2. This is the main scene setup you will export to your landing page
export default function HeroShirt() {
    return (
        // The canvas needs a container with a defined height and width to show up
        <div className="w-full h-[600px] cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>

                {/* LIGHTING: This is the secret to a $10,000 look. */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
                <Environment preset="city" /> {/* Adds realistic reflections to the material */}

                {/* INTERACTIVITY: Lets the user drag to spin the shirt */}
                <PresentationControls
                    global
                    rotation={[0.1, 0.1, 0]}
                    polar={[-0.4, 0.2]} // Restricts vertical rotation
                    azimuth={[-1, 1]} // Restricts horizontal rotation
                    config={{ mass: 2, tension: 400 }}
                    snap={{ mass: 4, tension: 400 }} // Snaps back to center when released
                >
                    {/* ANIMATION: Makes the shirt float up and down automatically */}
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
                        <TShirtModel />
                    </Float>
                </PresentationControls>

                {/* SHADOW: A soft shadow on the "floor" below the floating shirt */}
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />

            </Canvas>
        </div>
    )
}

// Pre-load the model so it renders instantly when the user visits the site
useGLTF.preload('/tshirt.glb')