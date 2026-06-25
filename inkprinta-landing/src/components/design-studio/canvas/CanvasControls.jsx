export default function CanvasControls({
  activeObject,
  coords,
  zoom,
  isRotating,
  rotationAngle,
  isLocked,
  onToggleLock,
  onDuplicate,
  onDelete
}) {
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
          className="z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 rounded-full px-2.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] whitespace-nowrap select-none"
        >
          <button
            onClick={onToggleLock}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
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

          <button
            onClick={onDuplicate}
            disabled={isLocked}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
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

          <button
            onClick={onDelete}
            disabled={isLocked}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Delete"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      )}

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
