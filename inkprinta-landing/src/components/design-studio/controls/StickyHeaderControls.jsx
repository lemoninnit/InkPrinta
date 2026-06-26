import TextFormatToolbar from './TextFormatToolbar.jsx';
import ImageFormatToolbar from './ImageFormatToolbar.jsx';
import HistoryControls from './HistoryControls.jsx';
import ZoomControls from './ZoomControls.jsx';

export default function StickyHeaderControls({
  textTools,
  imageTools,
  undoStackRef,
  redoStackRef,
  onUndo,
  onRedo,
  zoom,
  onZoomOut,
  onZoomIn,
  onResetZoom
}) {
  return (
    <div className="sticky top-0 w-full max-w-[1168px] flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 z-20 bg-white/70 backdrop-blur-xl py-3 px-5 rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.04)] flex-shrink-0">
      <div className="flex-1 flex items-center justify-start overflow-visible py-1 min-h-[40px]">
        <TextFormatToolbar
          activeObject={textTools.activeObject}
          fontFamily={textTools.fontFamily}
          fontSize={textTools.fontSize}
          textColor={textTools.textColor}
          fontWeight={textTools.fontWeight}
          fontStyle={textTools.fontStyle}
          underline={textTools.underline}
          linethrough={textTools.linethrough}
          textAlign={textTools.textAlign}
          opacity={textTools.opacity}
          opacityInput={textTools.opacityInput}
          hueValue={textTools.hueValue}
          hexInputValue={textTools.hexInputValue}
          showFontDropdown={textTools.showFontDropdown}
          showColorPopover={textTools.showColorPopover}
          showOpacityPopover={textTools.showOpacityPopover}
          setShowFontDropdown={textTools.setShowFontDropdown}
          setShowColorPopover={textTools.setShowColorPopover}
          setShowOpacityPopover={textTools.setShowOpacityPopover}
          setHueValue={textTools.setHueValue}
          setHexInputValue={textTools.setHexInputValue}
          setOpacityInput={textTools.setOpacityInput}
          onFontFamilyChange={textTools.handleFontFamilyChange}
          onFontSizeChange={textTools.handleFontSizeChange}
          onTextColorChange={textTools.handleTextColorChange}
          onBoldToggle={textTools.handleBoldToggle}
          onItalicToggle={textTools.handleItalicToggle}
          onUnderlineToggle={textTools.handleUnderlineToggle}
          onLinethroughToggle={textTools.handleLinethroughToggle}
          onCaseToggle={textTools.handleCaseToggle}
          onAlignToggle={textTools.handleAlignToggle}
          onListToggle={textTools.handleListToggle}
          onOpacityChange={textTools.handleOpacityChange}
          onColorSquareMouseDown={textTools.handleColorSquareMouseDown}
        />

        <ImageFormatToolbar
          activeObject={textTools.activeObject}
          strokeColor={imageTools.strokeColor}
          strokeWidth={imageTools.strokeWidth}
          strokeType={imageTools.strokeType}
          cornerRadius={imageTools.cornerRadius}
          opacity={imageTools.opacity}
          flipX={imageTools.flipX}
          flipY={imageTools.flipY}
          aspectRatio={imageTools.aspectRatio}
          showStrokePopover={imageTools.showStrokePopover}
          setShowStrokePopover={imageTools.setShowStrokePopover}
          showCornerPopover={imageTools.showCornerPopover}
          setShowCornerPopover={imageTools.setShowCornerPopover}
          showOpacityPopover={imageTools.showOpacityPopover}
          setShowOpacityPopover={imageTools.setShowOpacityPopover}
          isSliding={imageTools.isSliding}
          setIsSliding={imageTools.setIsSliding}
          onStrokeWidthChange={imageTools.handleStrokeWidthChange}
          onStrokeTypeChange={imageTools.handleStrokeTypeChange}
          onStrokeColorChange={imageTools.handleStrokeColorChange}
          onCornerRadiusChange={imageTools.handleCornerRadiusChange}
          onOpacityChange={imageTools.handleOpacityChange}
          onFlipX={imageTools.handleFlipX}
          onFlipY={imageTools.handleFlipY}
          onStartCropping={imageTools.startCropping}
          isCropping={imageTools.isCropping}
          applyCrop={imageTools.applyCrop}
          cancelCrop={imageTools.cancelCrop}
          setAspectRatio={imageTools.setAspectRatio}
          zoom={zoom}
        />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <HistoryControls
          undoStackRef={undoStackRef}
          redoStackRef={redoStackRef}
          onUndo={onUndo}
          onRedo={onRedo}
        />
        <ZoomControls
          zoom={zoom}
          onZoomOut={onZoomOut}
          onZoomIn={onZoomIn}
          onReset={onResetZoom}
        />
      </div>
    </div>
  );
}
