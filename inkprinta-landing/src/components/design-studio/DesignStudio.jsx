import { useState, useRef } from 'react';
import { PRODUCTS } from './utils/constants.js';
import { useZoom } from './hooks/useZoom.js';
import { useHistory } from './hooks/useHistory.js';
import { useTextTools } from './hooks/useTextTools.js';
import { useCanvas } from './hooks/useCanvas.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import StickyHeaderControls from './controls/StickyHeaderControls.jsx';
import CanvasArea from './canvas/CanvasArea.jsx';
import ProductModal from './modals/ProductModal.jsx';
import TextModal from './modals/TextModal.jsx';

export default function DesignStudio() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const [activeTab, setActiveTab] = useState('Product');
  const [showProductPanel, setShowProductPanel] = useState(false);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(PRODUCTS[0]);

  const { zoom, viewportRef, zoomOut, zoomIn, resetZoom } = useZoom();
  const textTools = useTextTools(fabricRef);

  const {
    undoStackRef,
    redoStackRef,
    isHandlingHistoryRef,
    saveStateToHistory,
    handleUndo,
    handleRedo
  } = useHistory(fabricRef);

  const syncSelectionAfterHistory = () => {
    const activeObj = fabricRef.current?.getActiveObject();
    textTools.setActiveObject(activeObj || null);
    textTools.setCoords(activeObj ? activeObj.getBoundingRect(true) : null);
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
    setActiveObject: textTools.setActiveObject,
    setCoords: textTools.setCoords,
    setIsLocked: textTools.setIsLocked,
    setIsRotating: textTools.setIsRotating,
    setRotationAngle: textTools.setRotationAngle,
    syncTextFromObject: textTools.syncTextFromObject
  });

  useKeyboardShortcuts({
    fabricRef,
    handleUndo: onUndo,
    handleRedo: onRedo,
    handleDelete: textTools.handleDelete
  });

  const handleTabClick = (tabId) => {
    if (tabId === 'Product') {
      setShowProductPanel((prev) => !prev);
      setShowTextPanel(false);
    } else if (tabId === 'Text') {
      setShowTextPanel((prev) => !prev);
      setShowProductPanel(false);
    } else {
      setActiveTab(tabId);
      setShowProductPanel(false);
      setShowTextPanel(false);
    }
  };

  const handleAddText = () => {
    textTools.handleAddText(() => setShowTextPanel(false));
  };

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
          onToggleLock={textTools.handleToggleLock}
          onDuplicate={textTools.handleDuplicate}
          onDelete={textTools.handleDelete}
        />
      </main>

      <Footer
        activeTab={activeTab}
        showProductPanel={showProductPanel}
        showTextPanel={showTextPanel}
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
    </div>
  );
}
