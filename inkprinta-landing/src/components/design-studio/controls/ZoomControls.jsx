export default function ZoomControls({ zoom, onZoomOut, onZoomIn, onReset }) {
  return (
    <div className="flex items-center gap-3 bg-white/40 border border-white/60 rounded-full px-4 py-1.5 shadow-sm">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 select-none">Zoom</span>
      <div className="flex items-center gap-2">
        <div className="relative group/tooltip">
          <button
            onClick={onZoomOut}
            className="w-6 h-6 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors border border-white/40"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
            Zoom Out
          </span>
        </div>

        <span className="text-xs font-extrabold text-slate-700 min-w-[36px] text-center select-none">
          {Math.round(zoom * 100)}%
        </span>

        <div className="relative group/tooltip">
          <button
            onClick={onZoomIn}
            className="w-6 h-6 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors border border-white/40"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
            Zoom In
          </span>
        </div>
      </div>
      <div className="h-3 w-[1px] bg-slate-200/50 mx-0.5" />
      <div className="relative group/tooltip">
        <button
          onClick={onReset}
          className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider hover:text-cyan-700 transition-colors"
          type="button"
        >
          Reset
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Reset Zoom
        </span>
      </div>
    </div>
  );
}
