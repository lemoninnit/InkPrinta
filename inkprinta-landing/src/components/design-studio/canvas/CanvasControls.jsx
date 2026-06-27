import { useState, useEffect, useRef } from 'react';

export default function CanvasControls({
  activeObject,
  coords,
  zoom,
  isRotating,
  rotationAngle,
  isLocked,
  onToggleLock,
  onDuplicate,
  onDelete,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onToggleLayersPanel,
  onGroup
}) {
  const [showLayerDropdown, setShowLayerDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLayerDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isMultiple = activeObject && (
    activeObject.type === 'activeSelection' ||
    activeObject.type === 'active-selection' ||
    (activeObject._objects && activeObject.type !== 'group')
  );
  const isGroup = activeObject && activeObject.type === 'group';

  return (
    <>
      {activeObject && coords && !isRotating && (
        <div
          style={{
            position: 'absolute',
            top: `${coords.top * zoom - 64}px`,
            left: `${(coords.left + coords.width / 2) * zoom}px`,
            transform: 'translateX(-50%)'
          }}
          className="z-35 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 rounded-full px-3 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Lock/Unlock */}
          <button
            onClick={onToggleLock}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isLocked
                ? 'bg-cyan-50 border border-cyan-200 text-cyan-600 font-extrabold'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
            title={isLocked ? 'Unlock Object' : 'Lock Object'}
            type="button"
          >
            {isLocked ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            )}
          </button>

          <div className="w-[1px] h-3 bg-slate-200/80" />

          {/* Group / Ungroup Button */}
          {(isMultiple || isGroup) && (
            <>
              <button
                onClick={onGroup}
                disabled={isLocked}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title={isGroup ? 'Ungroup Elements' : 'Group Elements'}
                type="button"
              >
                {isGroup ? (
                  <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18V6H6v12h12zm0 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <path strokeDasharray="2 2" d="M3 14h3M18 10h3M10 3v3M14 18v3" />
                  </svg>
                )}
              </button>
              <div className="w-[1px] h-3 bg-slate-200/80" />
            </>
          )}

          {/* Layer Controls Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLayerDropdown(!showLayerDropdown)}
              disabled={isLocked}
              className={`w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer ${
                showLayerDropdown ? 'bg-slate-100 text-slate-800' : ''
              }`}
              title="Layers"
              type="button"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 8.5L12 13L21 8.5L12 4Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5L12 17L21 12.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5L12 21L21 16.5" />
              </svg>
            </button>

            {/* Submenu Dropdown */}
            {showLayerDropdown && (
              <div className="absolute top-full right-0 mt-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-1.5 z-55 flex flex-col gap-0.5 w-[210px] text-slate-700 text-[11px] font-bold animate-in fade-in slide-in-from-top-1.5 duration-150">
                <button
                  onClick={() => {
                    onBringToFront();
                    setShowLayerDropdown(false);
                  }}
                  className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 8.5L12 13L21 8.5L12 4Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13v6M9 16l3-3 3 3" />
                    </svg>
                    <span>Bring to front</span>
                  </div>
                  <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/60 font-bold">Ctrl+Alt+]</span>
                </button>

                <button
                  onClick={() => {
                    onBringForward();
                    setShowLayerDropdown(false);
                  }}
                  className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5L12 17L21 12.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5M10 10l2-2 2 2" />
                    </svg>
                    <span>Bring forward</span>
                  </div>
                  <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/60 font-bold">Ctrl+]</span>
                </button>

                <button
                  onClick={() => {
                    onSendBackward();
                    setShowLayerDropdown(false);
                  }}
                  className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5L12 17L21 12.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v5M10 14l2 2 2-2" />
                    </svg>
                    <span>Send backward</span>
                  </div>
                  <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/60 font-bold">Ctrl+[</span>
                </button>

                <button
                  onClick={() => {
                    onSendToBack();
                    setShowLayerDropdown(false);
                  }}
                  className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 8.5L12 13L21 8.5L12 4Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v10M9 13l3 3 3-3" />
                    </svg>
                    <span>Send to back</span>
                  </div>
                  <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/60 font-bold">Ctrl+Alt+[</span>
                </button>

                <div className="h-[1px] bg-slate-100 my-1" />

                <button
                  onClick={() => {
                    onToggleLayersPanel();
                    setShowLayerDropdown(false);
                  }}
                  className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 8.5L12 13L21 8.5L12 4Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5L12 17L21 12.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5L12 21L21 16.5" />
                    </svg>
                    <span>Show layers</span>
                  </div>
                  <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/60 font-bold">Alt+1</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-[1px] h-3 bg-slate-200/80" />

          {/* Duplicate */}
          <button
            onClick={onDuplicate}
            disabled={isLocked}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Duplicate"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2" />
              <rect x="9" y="4" width="11" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5h5m-2.5-2.5v5" />
            </svg>
          </button>

          <div className="w-[1px] h-3 bg-slate-200/80" />

          {/* Delete */}
          <button
            onClick={onDelete}
            disabled={isLocked}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Delete"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      )}

      {/* Rotation Indicator */}
      {isRotating && rotationAngle !== null && coords && (
        <div
          style={{
            position: 'absolute',
            top: `${(coords.top + coords.height) * zoom + 24}px`,
            left: `${(coords.left + coords.width / 2) * zoom}px`,
            transform: 'translateX(-50%)'
          }}
          className="z-30 px-2 py-1 bg-cyan-600 text-white text-[11px] font-extrabold rounded shadow-md pointer-events-none select-none border border-cyan-500"
        >
          {rotationAngle}°
        </div>
      )}
    </>
  );
}
