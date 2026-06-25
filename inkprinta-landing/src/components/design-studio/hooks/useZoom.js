import { useState, useEffect, useRef } from 'react';
import { ZOOM_MIN, ZOOM_MAX } from '../utils/constants.js';

export function useZoom() {
  const [zoom, setZoom] = useState(1.0);
  const viewportRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();

        const delta = -e.deltaY;

        setZoom((prevZoom) => {
          const zoomFactor = prevZoom * 0.08;
          let newZoom = delta > 0 ? prevZoom + zoomFactor : prevZoom - zoomFactor;
          newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));

          if (newZoom !== prevZoom) {
            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const contentX = (viewport.scrollLeft + mouseX) / prevZoom;
            const contentY = (viewport.scrollTop + mouseY) / prevZoom;

            requestAnimationFrame(() => {
              viewport.scrollLeft = contentX * newZoom - mouseX;
              viewport.scrollTop = contentY * newZoom - mouseY;
            });
          }
          return newZoom;
        });
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - 0.1));
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + 0.1));
  const resetZoom = () => setZoom(1.0);

  return { zoom, setZoom, viewportRef, zoomOut, zoomIn, resetZoom };
}
