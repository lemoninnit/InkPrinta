import CanvasControls from './CanvasControls.jsx';

export default function CanvasArea({
  canvasRef,
  currentProduct,
  zoom,
  activeObject,
  coords,
  isRotating,
  rotationAngle,
  isLocked,
  onToggleLock,
  onDuplicate,
  onDelete
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-12 flex-shrink-0 my-auto">
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
              height: `${currentProduct.printHeight * zoom}px`
            }}
            className="relative overflow-hidden rounded-xl"
          >
            <canvas ref={canvasRef} />
          </div>

          <CanvasControls
            activeObject={activeObject}
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
