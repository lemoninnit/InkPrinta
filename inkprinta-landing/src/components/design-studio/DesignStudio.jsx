import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from './utils/constants.js';
import { useZoom } from './hooks/useZoom.js';
import { useHistory } from './hooks/useHistory.js';
import { useTextTools } from './hooks/useTextTools.js';
import { useImageTools } from './hooks/useImageTools.js';
import { useCanvas } from './hooks/useCanvas.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { PencilBrush } from 'fabric';
import { styleTextboxControls, initializeImageObject } from './utils/helpers.js';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import StickyHeaderControls from './controls/StickyHeaderControls.jsx';
import CanvasArea from './canvas/CanvasArea.jsx';
import ProductModal from './modals/ProductModal.jsx';
import TextModal from './modals/TextModal.jsx';
import ImageModal from './modals/ImageModal.jsx';
import PaintModal from './modals/PaintModal.jsx';
import StampModal from './modals/StampModal.jsx';

export default function DesignStudio() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const [activeTab, setActiveTab] = useState('Product');
  const [showProductPanel, setShowProductPanel] = useState(false);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [showPaintPanel, setShowPaintPanel] = useState(false);
  const [showStampPanel, setShowStampPanel] = useState(false);
  const [activeTool, setActiveTool] = useState('pencil');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(1.0);
  const [currentProduct, setCurrentProduct] = useState(PRODUCTS[0]);

  const { zoom, viewportRef, zoomOut, zoomIn, resetZoom } = useZoom();

  const {
    undoStackRef,
    redoStackRef,
    isHandlingHistoryRef,
    saveStateToHistory,
    handleUndo,
    handleRedo
  } = useHistory(fabricRef);

  const textTools = useTextTools(fabricRef, saveStateToHistory);
  const imageTools = useImageTools(fabricRef, saveStateToHistory);

  const clipboardRef = useRef(null);
  const paintStartHistoryStateRef = useRef(null);

  const handleCopy = async () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    try {
      const cloned = await activeObj.clone(['rx', 'ry', 'isPaintStroke']);
      clipboardRef.current = cloned;
    } catch (err) {
      console.error('Failed to copy object:', err);
    }
  };

  const handlePaste = async () => {
    if (!fabricRef.current || !clipboardRef.current) return;
    const canvas = fabricRef.current;
    try {
      const clonedObj = await clipboardRef.current.clone(['rx', 'ry', 'isPaintStroke']);
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 24,
        top: clonedObj.top + 24,
        evented: true
      });
      if (clonedObj.type === 'image') {
        initializeImageObject(clonedObj);
      } else {
        styleTextboxControls(clonedObj);
      }
      canvas.add(clonedObj);
      canvas.setActiveObject(clonedObj);
      canvas.renderAll();
      saveStateToHistory();
    } catch (err) {
      console.error('Failed to paste object:', err);
    }
  };

  const syncSelectionAfterHistory = () => {
    const activeObj = fabricRef.current?.getActiveObject();
    textTools.setActiveObject(activeObj || null);
    textTools.setCoords(activeObj ? activeObj.getBoundingRect(true) : null);
    if (activeObj && activeObj.type === 'image') {
      imageTools.syncImageFromObject(activeObj);
    } else {
      imageTools.resetPopovers();
    }
  };

  const onUndo = () => handleUndo(syncSelectionAfterHistory);
  const onRedo = () => handleRedo(syncSelectionAfterHistory);

  useCanvas({
    canvasRef,
    fabricRef,
    currentProduct,
    zoom,
    saveStateToHistory,
    isHandlingHistoryRef,
    setActiveObject: (obj) => {
      textTools.setActiveObject(obj);
      if (!obj) {
        imageTools.resetPopovers();
      }
    },
    setCoords: textTools.setCoords,
    setIsLocked: textTools.setIsLocked,
    setIsRotating: textTools.setIsRotating,
    setRotationAngle: textTools.setRotationAngle,
    syncTextFromObject: textTools.syncTextFromObject,
    syncImageFromObject: imageTools.syncImageFromObject,
    showPaintPanel
  });

  useKeyboardShortcuts({
    fabricRef,
    handleUndo: onUndo,
    handleRedo: onRedo,
    handleDelete: textTools.handleDelete,
    handleCopy,
    handlePaste
  });

  const handleTabClick = (tabId) => {
    if (tabId === 'Product') {
      setShowProductPanel((prev) => !prev);
      setShowTextPanel(false);
      setShowImagePanel(false);
      setShowPaintPanel(false);
      setShowStampPanel(false);
    } else if (tabId === 'Text') {
      setShowTextPanel((prev) => !prev);
      setShowProductPanel(false);
      setShowImagePanel(false);
      setShowPaintPanel(false);
      setShowStampPanel(false);
    } else if (tabId === 'Image') {
      setShowImagePanel((prev) => !prev);
      setShowProductPanel(false);
      setShowTextPanel(false);
      setShowPaintPanel(false);
      setShowStampPanel(false);
    } else if (tabId === 'Paint') {
      setShowPaintPanel((prev) => {
        const next = !prev;
        if (next && fabricRef.current) {
          const json = fabricRef.current.toJSON(['rx', 'ry', 'isPaintStroke']);
          paintStartHistoryStateRef.current = JSON.stringify(json);
        }
        return next;
      });
      setShowProductPanel(false);
      setShowTextPanel(false);
      setShowImagePanel(false);
      setShowStampPanel(false);
    } else if (tabId === 'Stamp') {
      setShowStampPanel((prev) => !prev);
      setShowProductPanel(false);
      setShowTextPanel(false);
      setShowImagePanel(false);
      setShowPaintPanel(false);
    } else {
      setActiveTab(tabId);
      setShowProductPanel(false);
      setShowTextPanel(false);
      setShowImagePanel(false);
      setShowPaintPanel(false);
      setShowStampPanel(false);
    }
  };

  const handleCancelPaint = () => {
    if (paintStartHistoryStateRef.current && fabricRef.current) {
      isHandlingHistoryRef.current = true;
      const parsed = JSON.parse(paintStartHistoryStateRef.current);
      const loadPromise = fabricRef.current.loadFromJSON(parsed);
      const afterLoad = () => {
        fabricRef.current.forEachObject((obj) => {
          if (obj.type === 'textbox') {
            styleTextboxControls(obj);
          } else if (obj.type && obj.type.toLowerCase() === 'image') {
            initializeImageObject(obj);
          }
        });
        fabricRef.current.renderAll();
        isHandlingHistoryRef.current = false;
        setShowPaintPanel(false);
      };
      if (loadPromise && typeof loadPromise.then === 'function') {
        loadPromise.then(afterLoad);
      } else {
        afterLoad();
      }
    } else {
      setShowPaintPanel(false);
    }
  };

  const handleAddText = () => {
    textTools.handleAddText(() => setShowTextPanel(false));
  };

  const handleClearDrawing = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const paintObjects = canvas.getObjects().filter((obj) => obj.isPaintStroke);
    if (paintObjects.length > 0) {
      paintObjects.forEach((obj) => canvas.remove(obj));
      canvas.renderAll();
      saveStateToHistory();
    }
  };

  const hexToRgba = (hex, opacity) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    const cleanHex = hex.replace(/^#/, '');
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleSelectTool = (tool) => {
    setActiveTool(tool);
    if (tool === 'pencil') {
      setBrushSize(3);
    } else if (tool === 'brush') {
      setBrushSize(15);
    } else if (tool === 'eraser') {
      setBrushSize(25);
    }
  };

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    canvas.isDrawingMode = showPaintPanel && activeTool !== 'eraser';
    canvas.selection = !showPaintPanel;

    if (showPaintPanel) {
      canvas.discardActiveObject();
      canvas.calcOffset();
      canvas.renderAll();

      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });

      if (!canvas.freeDrawingBrush || !(canvas.freeDrawingBrush instanceof PencilBrush)) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.color = hexToRgba(brushColor, brushOpacity);
      canvas.freeDrawingBrush.width = brushSize;
    } else {
      canvas.forEachObject((obj) => {
        if (obj.isPaintStroke) {
          obj.selectable = true;
          obj.evented = true;
        } else {
          const isObjLocked = obj.lockMovementX || false;
          obj.selectable = !isObjLocked;
          obj.evented = true;
        }
      });
      canvas.renderAll();
    }
  }, [showPaintPanel, activeTool, brushColor, brushSize, brushOpacity]);

  const isErasingRef = useRef(false);
  const lastEraserPosRef = useRef(null);
  const eraserChangedRef = useRef(false);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    const handleMouseDown = (opt) => {
      if (showPaintPanel && activeTool === 'eraser') {
        isErasingRef.current = true;
        eraserChangedRef.current = false;
        const pointer = canvas.getScenePoint(opt.e);
        lastEraserPosRef.current = pointer;
        eraseAtPointer(pointer);
      }
    };

    const handleMouseMove = (opt) => {
      if (showPaintPanel && activeTool === 'eraser' && isErasingRef.current) {
        eraseAtPointer(canvas.getScenePoint(opt.e));
      }
    };

    const handleMouseUp = () => {
      if (showPaintPanel && activeTool === 'eraser') {
        isErasingRef.current = false;
        lastEraserPosRef.current = null;
        if (eraserChangedRef.current) {
          saveStateToHistory();
          eraserChangedRef.current = false;
        }
      }
    };

    const eraseAtPointer = (pointer) => {
      const objects = canvas.getObjects();
      let changed = false;

      const pointsToCheck = [];
      if (lastEraserPosRef.current) {
        const p1 = lastEraserPosRef.current;
        const p2 = pointer;
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const steps = Math.max(1, Math.floor(dist / 4)); // Check every 4px for higher precision
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          pointsToCheck.push({
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
          });
        }
      } else {
        pointsToCheck.push(pointer);
      }

      lastEraserPosRef.current = pointer;
      
      for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (obj.isPaintStroke) {
          const isNear = pointsToCheck.some((p) => isPointerNearPath(p, obj));
          if (isNear) {
            canvas.remove(obj);
            changed = true;
            eraserChangedRef.current = true;
          }
        }
      }
      
      if (changed) {
        canvas.renderAll();
      }
    };

    const isPointerNearPath = (pointer, pathObj, threshold = 15) => {
      if (!pathObj.path) return false;
      
      const halfSize = brushSize / 2;
      const adaptiveThreshold = Math.max(threshold, halfSize);
      
      const bounds = pathObj.getBoundingRect(true);
      if (
        pointer.x < bounds.left - adaptiveThreshold ||
        pointer.x > bounds.left + bounds.width + adaptiveThreshold ||
        pointer.y < bounds.top - adaptiveThreshold ||
        pointer.y > bounds.top + bounds.height + adaptiveThreshold
      ) {
        return false;
      }
      
      const matrix = pathObj.calcTransformMatrix();
      const pathOffset = pathObj.pathOffset || { x: 0, y: 0 };
      
      for (const segment of pathObj.path) {
        for (let i = 1; i < segment.length; i += 2) {
          const px = segment[i];
          const py = segment[i + 1];
          if (typeof px === 'number' && typeof py === 'number') {
            const lx = px - pathOffset.x;
            const ly = py - pathOffset.y;
            
            const gx = matrix[0] * lx + matrix[2] * ly + matrix[4];
            const gy = matrix[1] * lx + matrix[3] * ly + matrix[5];
            
            const dist = Math.hypot(pointer.x - gx, pointer.y - gy);
            if (dist <= adaptiveThreshold + (pathObj.strokeWidth || 0) / 2) {
              return true;
            }
          }
        }
      }
      return false;
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [showPaintPanel, activeTool, brushSize]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 relative overflow-hidden">
      <Header />

      <main
        ref={viewportRef}
        className="flex-1 w-full relative overflow-auto z-0 flex flex-col items-center justify-start p-6 scrollbar-thin select-none"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        <StickyHeaderControls
          textTools={textTools}
          imageTools={imageTools}
          undoStackRef={undoStackRef}
          redoStackRef={redoStackRef}
          onUndo={onUndo}
          onRedo={onRedo}
          zoom={zoom}
          onZoomOut={zoomOut}
          onZoomIn={zoomIn}
          onResetZoom={resetZoom}
        />

        <CanvasArea
          canvasRef={canvasRef}
          currentProduct={currentProduct}
          zoom={zoom}
          activeObject={textTools.activeObject}
          coords={textTools.coords}
          isRotating={textTools.isRotating}
          rotationAngle={textTools.rotationAngle}
          isLocked={textTools.isLocked}
          isAdjusting={imageTools.isSliding}
          onToggleLock={textTools.handleToggleLock}
          onDuplicate={textTools.handleDuplicate}
          onDelete={textTools.handleDelete}
          imageTools={imageTools}
          showPaintPanel={showPaintPanel}
          activeTool={activeTool}
          brushSize={brushSize}
        />
      </main>

      <Footer
        activeTab={activeTab}
        showProductPanel={showProductPanel}
        showTextPanel={showTextPanel}
        showImagePanel={showImagePanel}
        showPaintPanel={showPaintPanel}
        showStampPanel={showStampPanel}
        onTabClick={handleTabClick}
      />

      <ProductModal
        isOpen={showProductPanel}
        onClose={() => setShowProductPanel(false)}
        products={PRODUCTS}
        currentProduct={currentProduct}
        onSelectProduct={setCurrentProduct}
      />

      <TextModal
        isOpen={showTextPanel}
        onClose={() => setShowTextPanel(false)}
        textInput={textTools.textInput}
        setTextInput={textTools.setTextInput}
        fontFamily={textTools.fontFamily}
        setFontFamily={textTools.setFontFamily}
        fontSize={textTools.fontSize}
        setFontSize={textTools.setFontSize}
        textColor={textTools.textColor}
        setTextColor={textTools.setTextColor}
        hueValue={textTools.hueValue}
        setHueValue={textTools.setHueValue}
        hexInputValue={textTools.hexInputValue}
        setHexInputValue={textTools.setHexInputValue}
        showBottomFontDropdown={textTools.showBottomFontDropdown}
        setShowBottomFontDropdown={textTools.setShowBottomFontDropdown}
        onAddText={handleAddText}
        onColorSquareMouseDown={textTools.handleColorSquareMouseDown}
      />

      <ImageModal
        isOpen={showImagePanel}
        onClose={() => setShowImagePanel(false)}
        fabricRef={fabricRef}
      />

      <PaintModal
        isOpen={showPaintPanel}
        onClose={() => setShowPaintPanel(false)}
        onCancel={handleCancelPaint}
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        brushColor={brushColor}
        onSelectColor={setBrushColor}
        brushSize={brushSize}
        onChangeSize={setBrushSize}
        brushOpacity={brushOpacity}
        onChangeOpacity={setBrushOpacity}
        onClear={handleClearDrawing}
      />

      <StampModal
        isOpen={showStampPanel}
        onClose={() => setShowStampPanel(false)}
        fabricRef={fabricRef}
        saveStateToHistory={saveStateToHistory}
      />
    </div>
  );
}
