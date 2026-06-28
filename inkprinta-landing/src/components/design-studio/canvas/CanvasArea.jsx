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
  brushSize,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onToggleLayersPanel,
  onGroup,
  isEditingGroup
}) {
  const PENCIL_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/><path d='m15 5 4 4'/></svg>") 0 24, pointer`;
  const BRUSH_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 512 512' fill='%2306b6d4'><path d='M167.02 309.34c-40.12 2.58-76.53 17.86-97.19 72.3-2.35 6.21-8 9.98-14.59 9.98-11.11 0-45.46-27.67-55.25-34.35C0 439.62 37.93 512 128 512c75.86 0 128-43.77 128-120.19 0-3.11-.65-6.08-.97-9.13l-88.01-73.34zM457.89 0c-15.16 0-29.37 6.71-40.21 16.45C213.27 199.05 192 203.34 192 257.09c0 13.7 3.25 26.76 8.73 38.7l63.82 53.18c7.14 5.95 16 9.03 25.1 9.03H384c25.4 0 54.57-27.76 60.19-54.58L495.55 40c3.27-15.53-6.01-31.02-21.66-34.31A32.557 32.557 0 0 0 457.89 0z'/></svg>") 0 24, pointer`;

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
            onBringToFront={onBringToFront}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onSendToBack={onSendToBack}
            onToggleLayersPanel={onToggleLayersPanel}
            onGroup={onGroup}
            isEditingGroup={isEditingGroup}
          />
        </div>
      </div>
    </div>
  );
}
