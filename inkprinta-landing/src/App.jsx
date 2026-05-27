import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import WebGLBackground from './components/WebGLBackground';
import OverlayUI from './components/OverlayUI';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main ref={containerRef} className="relative min-h-[400vh] bg-slate-50 overflow-x-hidden selection:bg-cyan-200/50 font-sans cursor-none">
      <CustomCursor />
      <Navbar />
      <WebGLBackground scrollYProgress={scrollYProgress} />
      <OverlayUI />
    </main>
  );
}

export default App;