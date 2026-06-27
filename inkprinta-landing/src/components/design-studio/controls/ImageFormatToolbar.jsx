import React from 'react';

export default function ImageFormatToolbar({
  activeObject,
  strokeColor,
  strokeWidth,
  strokeType,
  cornerRadius,
  opacity,
  flipX,
  flipY,
  aspectRatio,
  showStrokePopover,
  setShowStrokePopover,
  showCornerPopover,
  setShowCornerPopover,
  showOpacityPopover,
  setShowOpacityPopover,
  isSliding,
  setIsSliding,
  onStrokeWidthChange,
  onStrokeTypeChange,
  onStrokeColorChange,
  onCornerRadiusChange,
  onOpacityChange,
  onFlipX,
  onFlipY,
  onStartCropping,
  isCropping,
  applyCrop,
  cancelCrop,
  setAspectRatio,
  zoom
}) {
  const hasImage = activeObject && (
    activeObject.type === 'image' ||
    (activeObject.type === 'group' && typeof activeObject.getObjects === 'function' && activeObject.getObjects().some(o => o.type === 'image'))
  );

  if (!isCropping && !hasImage) return null;

  const closeOtherPopovers = (except) => {
    if (except !== 'stroke') setShowStrokePopover(false);
    if (except !== 'corner') setShowCornerPopover(false);
    if (except !== 'opacity') setShowOpacityPopover(false);
  };

  const strokeColors = ['#000000', '#ffffff', '#06b6d4', '#2563eb', '#f59e0b', '#f43f5e'];

  return (
    <div className="flex items-center gap-1.5 md:gap-2.5">
      {/* 1. Stroke Popover */}
      <div className="relative group/tooltip">
        <button
          onClick={() => {
            closeOtherPopovers('stroke');
            setShowStrokePopover(!showStrokePopover);
          }}
          disabled={isCropping}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
            showStrokePopover
              ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
              : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
          } ${isCropping ? 'opacity-40 pointer-events-none' : ''}`}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Border & Stroke
        </span>

        {showStrokePopover && !isCropping && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowStrokePopover(false)} />
            <div className="absolute top-11 left-0 bg-white/95 backdrop-blur-md border border-slate-200/85 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-4 min-w-[260px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Border Style</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'None', component: (
                      <span className="text-xs font-black">Ø</span>
                    ) },
                    { id: 'solid', label: 'Solid', component: (
                      <svg className="w-8 h-2" viewBox="0 0 32 8" fill="none">
                        <line x1="0" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth="2.5" />
                      </svg>
                    ) },
                    { id: 'dashed-large', label: 'Dashed (Large Gaps)', component: (
                      <svg className="w-8 h-2" viewBox="0 0 32 8" fill="none">
                        <line x1="0" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8, 6" />
                      </svg>
                    ) },
                    { id: 'dashed-small', label: 'Dashed (Small Gaps)', component: (
                      <svg className="w-8 h-2" viewBox="0 0 32 8" fill="none">
                        <line x1="0" y1="4" x2="32" y2="4" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3, 3" />
                      </svg>
                    ) }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onStrokeTypeChange(style.id)}
                      className={`h-8 rounded-lg flex items-center justify-center border transition-all ${
                        strokeType === style.id
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-white/50'
                      }`}
                      type="button"
                      title={style.label}
                    >
                      {style.component}
                    </button>
                  ))}
                </div>
              </div>

              {strokeType !== 'none' && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stroke weight</span>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center w-12 h-6 px-1 shadow-sm">
                        <input
                          type="text"
                          value={strokeWidth}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            const num = Math.min(100, parseInt(raw, 10) || 0);
                            onStrokeWidthChange(num);
                          }}
                          className="w-8 text-center bg-transparent text-xs font-black text-slate-700 focus:outline-none"
                        />
                        <span className="text-[9px] font-bold text-slate-400 select-none">px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={strokeWidth || 1}
                      onChange={(e) => onStrokeWidthChange(parseInt(e.target.value, 10))}
                      onMouseDown={() => setIsSliding(true)}
                      onMouseUp={() => setIsSliding(false)}
                      onTouchStart={() => setIsSliding(true)}
                      onTouchEnd={() => setIsSliding(false)}
                      className="w-full accent-cyan-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer border border-slate-200/40"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Stroke Color</span>
                    <div className="flex gap-2 items-center">
                      {strokeColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => onStrokeColorChange(color)}
                          style={{ backgroundColor: color }}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            strokeColor === color
                              ? 'scale-110 shadow-md ring-2 ring-cyan-500 ring-offset-2'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                          type="button"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* 2. Corner Rounding Popover */}
      <div className="relative group/tooltip">
        <button
          onClick={() => {
            closeOtherPopovers('corner');
            setShowCornerPopover(!showCornerPopover);
          }}
          disabled={isCropping}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
            showCornerPopover
              ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
              : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
          } ${isCropping ? 'opacity-40 pointer-events-none' : ''}`}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4c0 0 0 4 4 4" />
          </svg>
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Corner Rounding
        </span>

        {showCornerPopover && !isCropping && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCornerPopover(false)} />
            <div className="absolute top-11 left-0 bg-white/95 backdrop-blur-md border border-slate-200/85 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3 min-w-[220px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Corner Radius</span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center w-12 h-6 px-1 shadow-sm">
                  <input
                    type="text"
                    value={cornerRadius}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      const num = Math.min(100, parseInt(raw, 10) || 0);
                      onCornerRadiusChange(num);
                    }}
                    className="w-8 text-center bg-transparent text-xs font-black text-slate-700 focus:outline-none"
                  />
                  <span className="text-[9px] font-bold text-slate-400 select-none">px</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cornerRadius}
                onChange={(e) => onCornerRadiusChange(parseInt(e.target.value, 10))}
                onMouseDown={() => setIsSliding(true)}
                onMouseUp={() => setIsSliding(false)}
                onTouchStart={() => setIsSliding(true)}
                onTouchEnd={() => setIsSliding(false)}
                className="w-full accent-cyan-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer border border-slate-200/40"
              />
            </div>
          </>
        )}
      </div>

      <div className="h-5 w-[1px] bg-slate-200/50" />

      {/* 3. Crop Button & Popover */}
      <div className="relative group/tooltip">
        <button
          onClick={() => {
            if (isCropping) {
              cancelCrop();
            } else {
              closeOtherPopovers();
              onStartCropping(activeObject);
            }
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
            isCropping
              ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
              : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
          }`}
          type="button"
        >
          {isCropping ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18V6a2 2 0 012-2h12M18 6v12a2 2 0 01-2 2H6m0-12H4m14 14v2M4 6h2m12 0h2" />
            </svg>
          )}
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          {isCropping ? 'Cancel Crop' : 'Crop Image'}
        </span>

        {isCropping && (
          <>
            {/* Aspect Ratio Floating Popover */}
            <div className="absolute top-11 left-0 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3 min-w-[280px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2.5">Aspect Ratio</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'free', label: 'Freeform' },
                    { id: 'original', label: 'Original' },
                    { id: '1:1', label: '1:1' },
                    { id: '4:3', label: '4:3' },
                    { id: '16:9', label: '16:9' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setAspectRatio(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        aspectRatio === r.id
                          ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/40 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                      type="button"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-[1px] bg-slate-100 my-1" />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelCrop}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-extrabold rounded-xl transition-colors uppercase tracking-wider"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => applyCrop(zoom)}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-extrabold rounded-xl transition-colors shadow-md shadow-cyan-500/25 uppercase tracking-wider"
                  type="button"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="h-5 w-[1px] bg-slate-200/50" />

      {/* 4. Flip Horizontal & Flip Vertical Controls */}
      <div className="flex items-center gap-1.5">
        <div className="relative group/tooltip">
          <button
            onClick={onFlipX}
            disabled={isCropping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shadow-sm ${
              flipX
                ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
                : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
            } ${isCropping ? 'opacity-40 pointer-events-none' : ''}`}
            type="button"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25v13.5" />
            </svg>
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
            Flip Horizontal
          </span>
        </div>

        <div className="relative group/tooltip">
          <button
            onClick={onFlipY}
            disabled={isCropping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shadow-sm ${
              flipY
                ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
                : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
            } ${isCropping ? 'opacity-40 pointer-events-none' : ''}`}
            type="button"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25L18.75 12 15 15.75m-6-7.5L5.25 12l3.75 3.75" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12h13.5" />
            </svg>
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
            Flip Vertical
          </span>
        </div>
      </div>

      <div className="h-5 w-[1px] bg-slate-200/50" />

      {/* 5. Transparency (Opacity) Popover */}
      <div className="relative group/tooltip">
        <button
          onClick={() => {
            closeOtherPopovers('opacity');
            setShowOpacityPopover(!showOpacityPopover);
          }}
          disabled={isCropping}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
            showOpacityPopover
              ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
              : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
          } ${isCropping ? 'opacity-40 pointer-events-none' : ''}`}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01M16 16h.01M20 20h.01" />
          </svg>
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Transparency
        </span>

        {showOpacityPopover && !isCropping && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowOpacityPopover(false)} />
            <div className="absolute top-11 right-0 bg-white/95 backdrop-blur-md border border-slate-200/85 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3 min-w-[220px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Transparency</span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center w-12 h-6 px-1 shadow-sm">
                  <input
                    type="text"
                    value={Math.round(opacity * 100)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      const num = Math.min(100, parseInt(raw, 10) || 0);
                      onOpacityChange(num / 100);
                    }}
                    className="w-8 text-center bg-transparent text-xs font-black text-slate-700 focus:outline-none"
                  />
                  <span className="text-[9px] font-bold text-slate-400 select-none">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                onMouseDown={() => setIsSliding(true)}
                onMouseUp={() => setIsSliding(false)}
                onTouchStart={() => setIsSliding(true)}
                onTouchEnd={() => setIsSliding(false)}
                className="w-full accent-cyan-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer border border-slate-200/40"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
