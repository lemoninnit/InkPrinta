import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  // Directly bind cursor coordinates and styles to MotionValues to completely bypass React renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const cursorScale = useMotionValue(1);
  const cursorOpacity = useMotionValue(0.6);

  // High-performance physics springs
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const scaleSpring = useSpring(cursorScale, { damping: 20, stiffness: 300 });
  const opacitySpring = useSpring(cursorOpacity, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'h1' ||
        e.target.tagName.toLowerCase() === 'h2' ||
        e.target.tagName.toLowerCase() === 'h3' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('div.group') ||
        e.target.closest('header')
      ) {
        cursorScale.set(3);
        cursorOpacity.set(0.9);
      } else {
        cursorScale.set(1);
        cursorOpacity.set(0.6);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, cursorScale, cursorOpacity]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[100] border-2 border-white mix-blend-difference bg-white"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        scale: scaleSpring,
        opacity: opacitySpring,
      }}
    />
  );
}
