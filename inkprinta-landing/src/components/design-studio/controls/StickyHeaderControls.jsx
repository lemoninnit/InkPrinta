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
  onResetZoom,
  saveStatus,
  onForceSave
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
        <button
          onClick={onForceSave}
          className={`px-4 h-8 border text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm hover:shadow transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
            saveStatus === 'saved'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/80 hover:border-emerald-200'
              : 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100/80 hover:border-amber-200 animate-pulse'
          }`}
          title={saveStatus === 'saved' ? 'All changes saved to draft' : 'Saving changes...'}
          type="button"
        >
          {saveStatus === 'saved' ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 4 4L19 7" />
              </svg>
              Saved
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Saving...
            </>
          )}
        </button>
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
