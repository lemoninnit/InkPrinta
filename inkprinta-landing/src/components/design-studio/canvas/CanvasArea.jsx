import CanvasControls from './CanvasControls.jsx';
import CropOverlay from './CropOverlay.jsx';

export default function CanvasArea({
  canvasRef,
  currentProduct,
  zoom,
  activeObject,
  coords,
  isRotating,
  rotationAngle,
  isLocked,
  isAdjusting,
  onToggleLock,
  onDuplicate,
  onDelete,
  imageTools,
  showPaintPanel,
  activeTool,
  brushSize
}) {
  const PENCIL_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/><path d='m15 5 4 4'/></svg>") 0 24, pointer`;
  const BRUSH_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m12 22 .711-2.143a9.9 9.9 0 0 0 .506-4.577L12 11.236 8.783 15.28a9.9 9.9 0 0 0 .506 4.577Z'/><path d='M12 11.236V2.428a2.43 2.43 0 0 1 4.86 0v2.43'/></svg>") 0 24, pointer`;

  const getEraserCursor = (width, z) => {
    const size = Math.max(width * z, 4); // minimum 4px
    const radius = size / 2;
    const canvasSize = size + 4; // Add padding so stroke isn't clipped
    const center = canvasSize / 2;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${canvasSize}' height='${canvasSize}' viewBox='0 0 ${canvasSize} ${canvasSize}'><circle cx='${center}' cy='${center}' r='${radius}' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-dasharray='3, 3' /><circle cx='${center}' cy='${center}' r='1.5' fill='%23ef4444' /></svg>`;
    return `url("data:image/svg+xml;utf8,${svg}") ${center} ${center}, auto`;
  };

  const ERASER_CURSOR = getEraserCursor(brushSize, zoom);

  return (
    <div className="flex-1 flex items-center justify-center py-12 flex-shrink-0 my-auto">
      <style>{`
        .pencil-cursor, .pencil-cursor *, .pencil-cursor .upper-canvas {
          cursor: ${PENCIL_CURSOR} !important;
        }
        .brush-cursor, .brush-cursor *, .brush-cursor .upper-canvas {
          cursor: ${BRUSH_CURSOR} !important;
        }
        .eraser-cursor, .eraser-cursor *, .eraser-cursor .upper-canvas {
          cursor: ${ERASER_CURSOR} !important;
        }
        
        .canvas-container, canvas, .upper-canvas {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-user-drag: none !important;
          outline: none !important;
        }
      `}</style>
      <div className="relative flex items-center justify-center flex-shrink-0">
        <div
          style={{
            width: `${currentProduct.printWidth * zoom}px`,
            height: `${currentProduct.printHeight * zoom}px`,
            backgroundColor: '#ffffff'
          }}
          className="relative z-10 border border-dashed border-cyan-400/50 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center justify-center bg-white"
        >
          <div
            style={{
              width: `${currentProduct.printWidth * zoom}px`,
              height: `${currentProduct.printHeight * zoom}px`,
              touchAction: 'none'
            }}
            className={`relative overflow-hidden rounded-xl ${
              showPaintPanel ? (activeTool === 'pencil' ? 'pencil-cursor' : activeTool === 'brush' ? 'brush-cursor' : 'eraser-cursor') : ''
            }`}
          >
            <canvas ref={canvasRef} style={{ touchAction: 'none' }} />

            {imageTools?.isCropping && (
              <CropOverlay
                imageTools={imageTools}
                zoom={zoom}
              />
            )}
          </div>

          <CanvasControls
            activeObject={(isAdjusting || imageTools?.isCropping) ? null : activeObject}
            coords={coords}
            zoom={zoom}
            isRotating={isRotating}
            rotationAngle={rotationAngle}
            isLocked={isLocked}
            onToggleLock={onToggleLock}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
