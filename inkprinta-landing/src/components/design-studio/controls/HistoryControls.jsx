export default function HistoryControls({ undoStackRef, redoStackRef, onUndo, onRedo }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/40 border border-white/60 rounded-full px-2.5 py-1 shadow-sm h-9">
      <div className="relative group/tooltip">
        <button
          onClick={onUndo}
          disabled={undoStackRef.current.length <= 1}
          className="w-7 h-7 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          type="button"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Undo (Ctrl+Z)
        </span>
      </div>

      <div className="relative group/tooltip">
        <button
          onClick={onRedo}
          disabled={redoStackRef.current.length === 0}
          className="w-7 h-7 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          type="button"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
          </svg>
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Redo (Ctrl+Y)
        </span>
      </div>
    </div>
  );
}
