import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from './utils/constants.js';
import { useZoom } from './hooks/useZoom.js';
import { useHistory } from './hooks/useHistory.js';
import { useTextTools } from './hooks/useTextTools.js';
import { useImageTools } from './hooks/useImageTools.js';
import { useCanvas } from './hooks/useCanvas.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { PencilBrush, Group, ActiveSelection } from 'fabric';
import { EraserBrush } from '@erase2d/fabric';
import { PaintbrushBrush } from './utils/PaintbrushBrush.js';
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
import LayersPanel from './modals/LayersPanel.jsx';
import PreviewStep from './PreviewStep.jsx';
import OrderStep from './OrderStep.jsx';
import { removeDraftFromIndexedDB } from './utils/db.js';

export default function DesignStudio() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const [step, setStep] = useState('design');
  const [designImage, setDesignImage] = useState(null);

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
  const [currentProduct, setCurrentProduct] = useState(() => {
    const savedProductId = localStorage.getItem('inkprinta_current_product');
    if (savedProductId) {
      const prod = PRODUCTS.find((p) => p.id === savedProductId);
      if (prod) return prod;
    }
    return PRODUCTS[0];
  });
  const [showLayersPanel, setShowLayersPanel] = useState(false);

  const { zoom, viewportRef, zoomOut, zoomIn, resetZoom } = useZoom();

  const {
    undoStackRef,
    redoStackRef,
    isHandlingHistoryRef,
    saveStateToHistory,
    forceSaveToLocalStorage,
    saveStatus,
    handleUndo,
    handleRedo
  } = useHistory(fabricRef);

  useEffect(() => {
    if (currentProduct) {
      localStorage.setItem('inkprinta_current_product', currentProduct.id);
      forceSaveToLocalStorage();
    }
  }, [currentProduct]);

  const handleSelectProduct = (prod) => {
    if (fabricRef.current) {
      forceSaveToLocalStorage();
    }
    setCurrentProduct(prod);
  };

  const handleEnterPreview = () => {
    if (fabricRef.current) {
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();

      // Force save the current design state to localStorage immediately
      forceSaveToLocalStorage();

      const dataUrl = fabricRef.current.toDataURL({
        format: 'png',
        multiplier: 2
      });
      setDesignImage(dataUrl);
    }
    // Close all design panels
    setShowProductPanel(false);
    setShowTextPanel(false);
    setShowImagePanel(false);
    setShowPaintPanel(false);
    setShowStampPanel(false);
    setShowLayersPanel(false);

    setStep('preview');
  };

  const handleSetStep = (newStep) => {
    // Close all design panels
    setShowProductPanel(false);
    setShowTextPanel(false);
    setShowImagePanel(false);
    setShowPaintPanel(false);
    setShowStampPanel(false);
    setShowLayersPanel(false);

    if (newStep === 'preview') {
      handleEnterPreview();
    } else {
      setStep(newStep);
    }
  };

  const textTools = useTextTools(fabricRef, saveStateToHistory);
  const imageTools = useImageTools(fabricRef, saveStateToHistory);

  const clipboardRef = useRef(null);
  const paintStartHistoryStateRef = useRef(null);

  const handleCopy = async () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    try {
      const cloned = await activeObj.clone(['rx', 'ry', 'isPaintStroke', 'erasable']);
      clipboardRef.current = cloned;
    } catch (err) {
      console.error('Failed to copy object:', err);
    }
  };

  const handlePaste = async () => {
    if (!fabricRef.current || !clipboardRef.current) return;
    const canvas = fabricRef.current;
    try {
      const clonedObj = await clipboardRef.current.clone(['rx', 'ry', 'isPaintStroke', 'erasable']);
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

  const handleToggleLayersPanel = () => {
    setShowLayersPanel((prev) => !prev);
  };

  const handleBringToFront = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    canvas.bringObjectToFront(activeObj);
    canvas.renderAll();
    saveStateToHistory();
    syncSelectionAfterHistory();
  };

  const handleBringForward = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    canvas.bringObjectForward(activeObj);
    canvas.renderAll();
    saveStateToHistory();
    syncSelectionAfterHistory();
  };

  const handleSendBackward = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    canvas.sendObjectBackwards(activeObj);
    canvas.renderAll();
    saveStateToHistory();
    syncSelectionAfterHistory();
  };

  const handleSendToBack = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    canvas.sendObjectToBack(activeObj);
    canvas.renderAll();
    saveStateToHistory();
    syncSelectionAfterHistory();
  };

  const handleGroup = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (canvas._editingGroup) {
      const { originalObjects } = canvas._editingGroup;
      canvas._editingGroup = null;

      const activeSelection = new ActiveSelection(originalObjects, { canvas });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
      saveStateToHistory();
      syncSelectionAfterHistory();
      return;
    }

    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    const isMultiple = activeObj.type === 'activeSelection' || activeObj.type === 'active-selection' || (activeObj._objects && activeObj.type !== 'group');

    if (isMultiple) {
      const objects = activeObj.getObjects();
      canvas.discardActiveObject();
      objects.forEach((obj) => canvas.remove(obj));

      const group = new Group(objects, {
        subTargetCheck: true,
        interactive: false
      });

      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
      saveStateToHistory();
      syncSelectionAfterHistory();
    } else if (activeObj.type === 'group') {
      canvas.remove(activeObj);
      const items = activeObj.removeAll();
      canvas.add(...items);

      const activeSelection = new ActiveSelection(items, { canvas });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
      saveStateToHistory();
      syncSelectionAfterHistory();
    }
  };

  const handleSelectObject = (obj) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (obj.group) {
      if (typeof canvas.selectGroupChild === 'function') {
        canvas.selectGroupChild(obj.group, obj);
      }
    } else {
      if (typeof canvas.commitGroupEditing === 'function') {
        canvas.commitGroupEditing();
      }
      canvas.setActiveObject(obj);
    }

    canvas.renderAll();
    syncSelectionAfterHistory();
  };

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
    showPaintPanel,
    step
  });

  useKeyboardShortcuts({
    fabricRef,
    handleUndo: onUndo,
    handleRedo: onRedo,
    handleDelete: textTools.handleDelete,
    handleCopy,
    handlePaste,
    handleBringToFront,
    handleBringForward,
    handleSendBackward,
    handleSendToBack,
    handleToggleLayers: handleToggleLayersPanel,
    handleGroup
  });

  // Automatically close layers panel when selection is cleared (when Layer button is not in use)
  useEffect(() => {
    if (!textTools.activeObject) {
      setShowLayersPanel(false);
    }
  }, [textTools.activeObject]);

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
          const json = fabricRef.current.toJSON(['rx', 'ry', 'isPaintStroke', 'erasable']);
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

  const handleStartOver = () => {
    // Clear draft from localStorage and IndexedDB
    localStorage.removeItem('inkprinta_design_draft');
    removeDraftFromIndexedDB();

    // Completely clear history stacks to prevent restoring or saving old state
    undoStackRef.current = [];
    redoStackRef.current = [];

    if (fabricRef.current) {
      const canvas = fabricRef.current;
      canvas.discardActiveObject();
      const objects = canvas.getObjects();
      while (objects.length > 0) {
        canvas.remove(objects[0]);
      }
      canvas.backgroundColor = 'transparent';
      canvas.renderAll();

      // Push the clean empty canvas state as the fresh initial state
      saveStateToHistory(true);
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

    const switchBrush = async () => {
      if (canvas.freeDrawingBrush instanceof EraserBrush) {
        try {
          await canvas.freeDrawingBrush.commit();
        } catch (e) {
          // no pending erase to commit, ignore
        }
      }

      canvas.isDrawingMode = showPaintPanel;
      canvas.selection = !showPaintPanel;

      if (showPaintPanel) {
        canvas.discardActiveObject();
        canvas.calcOffset();
        canvas.renderAll();

        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });

        if (activeTool === 'brush') {
          const isRealPaintbrush = canvas.freeDrawingBrush instanceof PaintbrushBrush
            && !(canvas.freeDrawingBrush instanceof EraserBrush);
          if (!canvas.freeDrawingBrush || !isRealPaintbrush) {
            canvas.freeDrawingBrush = new PaintbrushBrush(canvas);
          }
          canvas.freeDrawingBrush.color = brushColor;
          canvas.freeDrawingBrush.width = brushSize;
          canvas.freeDrawingBrush.opacity = brushOpacity;
        } else if (activeTool === 'eraser') {
          if (!canvas.freeDrawingBrush || !(canvas.freeDrawingBrush instanceof EraserBrush)) {
            const eraser = new EraserBrush(canvas);
            const originalCommit = eraser.commit.bind(eraser);
            eraser.commit = async (...args) => {
              const result = await originalCommit(...args);
              const active = canvas.getActiveObject();
              if (active) {
                const stillExists = canvas.contains(active);
                const bounds = stillExists ? active.getBoundingRect() : null;
                const isEffectivelyEmpty = !stillExists || (bounds && bounds.width < 1 && bounds.height < 1);
                if (isEffectivelyEmpty) {
                  canvas.discardActiveObject();
                  textTools.setActiveObject(null);
                  textTools.setCoords(null);
                  imageTools.resetPopovers();
                }
              }
              canvas.requestRenderAll();
              if (!isHandlingHistoryRef.current) {
                saveStateToHistory();
              }
              return result;
            };
            eraser.on('end', () => {
              const active = canvas.getActiveObject();
              if (active) {
                const stillExists = canvas.contains(active);
                const bounds = stillExists ? active.getBoundingRect() : null;
                const isEffectivelyEmpty = !stillExists || (bounds && bounds.width < 1 && bounds.height < 1);
                if (isEffectivelyEmpty) {
                  canvas.discardActiveObject();
                  textTools.setActiveObject(null);
                  textTools.setCoords(null);
                  imageTools.resetPopovers();
                  canvas.requestRenderAll();
                }
              }
              if (!isHandlingHistoryRef.current) {
                saveStateToHistory();
              }
            });
            canvas.freeDrawingBrush = eraser;
          }
          canvas.freeDrawingBrush.width = brushSize;
        } else {
          const isRealPencil = canvas.freeDrawingBrush instanceof PencilBrush
            && !(canvas.freeDrawingBrush instanceof EraserBrush);
          if (!canvas.freeDrawingBrush || !isRealPencil) {
            canvas.freeDrawingBrush = new PencilBrush(canvas);
          }
          canvas.freeDrawingBrush.color = hexToRgba(brushColor, brushOpacity);
          canvas.freeDrawingBrush.width = brushSize;
          canvas.isDrawingMode = true;
          canvas.renderAll();
        }
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
    };

    switchBrush();
  }, [showPaintPanel, activeTool, brushColor, brushSize, brushOpacity]);


  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 relative overflow-hidden">
      <Header step={step} setStep={handleSetStep} />

      {step === 'preview' ? (
        <PreviewStep
          designImage={designImage}
          currentProduct={currentProduct}
          setStep={handleSetStep}
        />
      ) : step === 'order' ? (
        <OrderStep
          designImage={designImage}
          currentProduct={currentProduct}
          setStep={handleSetStep}
          onClearCanvas={handleStartOver}
        />
      ) : (
        <>
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
              saveStatus={saveStatus}
              onForceSave={forceSaveToLocalStorage}
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
              onBringToFront={handleBringToFront}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onSendToBack={handleSendToBack}
              onToggleLayersPanel={handleToggleLayersPanel}
              onGroup={handleGroup}
              isEditingGroup={fabricRef.current && !!fabricRef.current._editingGroup}
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
            onPreview={handleEnterPreview}
          />
        </>
      )}

      <ProductModal
        isOpen={showProductPanel}
        onClose={() => setShowProductPanel(false)}
        products={PRODUCTS}
        currentProduct={currentProduct}
        onSelectProduct={handleSelectProduct}
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
        onForceSave={forceSaveToLocalStorage}
      />

      <PaintModal
        isOpen={showPaintPanel}
        onClose={() => {
          setShowPaintPanel(false);
          setActiveTab('');
        }}
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
        undoStackRef={undoStackRef}
        redoStackRef={redoStackRef}
        onUndo={onUndo}
        onRedo={onRedo}
      />

      <StampModal
        isOpen={showStampPanel}
        onClose={() => setShowStampPanel(false)}
        fabricRef={fabricRef}
        saveStateToHistory={saveStateToHistory}
      />

      <LayersPanel
        isOpen={showLayersPanel}
        onClose={() => setShowLayersPanel(false)}
        canvas={fabricRef.current}
        activeObject={textTools.activeObject}
        onSelectObject={handleSelectObject}
        saveStateToHistory={saveStateToHistory}
        triggerRender={syncSelectionAfterHistory}
      />
    </div>
  );
}
