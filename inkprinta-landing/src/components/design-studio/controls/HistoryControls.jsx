export default function HistoryControls({ undoStackRef, redoStackRef, onUndo, onRedo }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-full px-1.5 py-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] h-8">
      <div className="relative group/tooltip">
        <button
          onClick={onUndo}
          disabled={undoStackRef.current.length <= 1}
          className="w-6.5 h-6.5 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-25 transition-colors cursor-pointer"
          type="button"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
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
          className="w-6.5 h-6.5 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-25 transition-colors cursor-pointer"
          type="button"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
          </svg>
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Redo (Ctrl+Y)
        </span>
      </div>
    </div>
  );
}
