import { motion, AnimatePresence } from 'framer-motion';

const PAINT_COLORS = [
  '#000000', '#ffffff', '#cbd5e1', '#94a3b8', '#64748b', '#334155', // Row 1
  '#be185d', '#ef4444', '#f97316', '#f59e0b', '#facc15', '#eab308', // Row 2
  '#a3e635', '#22c55e', '#059669', '#06b6d4', '#3b82f6', '#1d4ed8', // Row 3
  '#7c3aed', '#581c87', '#ffedd5', '#d2b48c', '#8b5a2b', '#4a2f13', // Row 4
  '#ff007f', '#fdba74', '#fef08a', '#86efac', '#7dd3fc', '#c084fc'  // Row 5
];

export default function PaintModal({
  isOpen,
  onClose,
  onCancel,
  activeTool,
  onSelectTool,
  brushColor,
  onSelectColor,
  brushSize,
  onChangeSize,
  brushOpacity,
  onChangeOpacity,
  onClear,
  undoStackRef,
  redoStackRef,
  onUndo,
  onRedo
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-120%', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl z-30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col gap-4 w-[380px] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-col">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Paint Studio</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Draw free-hand designs directly on your canvas</p>
              </div>
              
              <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-1" type="button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Tool Selection Segment */}
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100/50">
              <button
                onClick={() => onSelectTool('pencil')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTool === 'pencil'
                    ? 'bg-white text-cyan-600 shadow-sm border border-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                type="button"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                Pencil
              </button>
              <button
                onClick={() => onSelectTool('brush')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTool === 'brush'
                    ? 'bg-white text-cyan-600 shadow-sm border border-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                type="button"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.25 2.25 0 113.182 3.182l-9.37 9.37a4.5 4.5 0 01-2.25 1.22l-3.136.627a1.125 1.125 0 01-1.327-1.327l.627-3.136a4.5 4.5 0 011.22-2.25z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5L17.5 9.5" />
                </svg>
                Brush
              </button>
              <button
                onClick={() => onSelectTool('eraser')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-white text-cyan-600 shadow-sm border border-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                type="button"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eraser
              </button>
            </div>

            {/* Colors Section */}
            {activeTool !== 'eraser' && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Colors</span>
                <div className="grid grid-cols-6 gap-2">
                  {PAINT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onSelectColor(color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 rounded-full border border-slate-200/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-90 ${
                        brushColor === color
                          ? 'ring-2 ring-cyan-500 ring-offset-2 scale-105'
                          : 'hover:scale-105'
                      }`}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Section */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Size</span>
                <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{brushSize}px</span>
              </div>
              
              {/* Brush/Eraser line preview */}
              <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                {activeTool === 'eraser' ? (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                    <div
                      style={{
                        width: `${Math.min(brushSize, 25)}px`,
                        height: `${Math.min(brushSize, 25)}px`,
                        backgroundColor: '#e2e8f0',
                        border: '2px dashed #94a3b8',
                        borderRadius: '50%'
                      }}
                    />
                    <span>Eraser Width ({brushSize}px)</span>
                  </div>
                ) : (
                  <svg className="w-full h-full px-4" viewBox="0 0 300 40">
                    <path
                      d="M 20 20 Q 80 5, 150 20 T 280 20"
                      fill="none"
                      stroke={brushColor}
                      strokeWidth={Math.min(brushSize, 25)}
                      opacity={brushOpacity}
                      strokeLinecap="round"
                      className="transition-all duration-150"
                    />
                  </svg>
                )}
              </div>
              
              {/* Slider */}
              <input
                type="range"
                min="1"
                max={activeTool === 'eraser' ? 100 : activeTool === 'brush' ? 80 : 20}
                value={brushSize}
                onChange={(e) => onChangeSize(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
            </div>

            {/* Opacity Section */}
            {activeTool !== 'eraser' && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Opacity</span>
                  <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{Math.round(brushOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={brushOpacity}
                  onChange={(e) => onChangeOpacity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2">
              <button
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 hover:text-slate-800 transition-colors active:scale-95 cursor-pointer"
                type="button"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-600 hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-cyan-100/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer"
                type="button"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
