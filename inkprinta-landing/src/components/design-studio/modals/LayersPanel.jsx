import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LayersPanel({
  isOpen,
  onClose,
  canvas,
  activeObject,
  onSelectObject,
  saveStateToHistory,
  triggerRender
}) {
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  if (!isOpen || !canvas) return null;

  const objects = canvas.getObjects();
  // Reverse order so that the top-most z-index object renders at the top of the layer list
  const layerList = [...objects].reverse();

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDraggedOverIndex(null);
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    // Map reversed list index back to original fabric canvas z-index
    const actualSource = objects.length - 1 - sourceIndex;
    const actualTarget = objects.length - 1 - targetIndex;

    const fabricObjects = canvas._objects;
    const [movedObj] = fabricObjects.splice(actualSource, 1);
    fabricObjects.splice(actualTarget, 0, movedObj);

    canvas.renderAll();
    saveStateToHistory();
    triggerRender();
  };

  const getObjectLabelAndPreview = (obj) => {
    if (obj.type === 'textbox' || obj.type === 'text') {
      return {
        label: obj.text ? (obj.text.length > 20 ? obj.text.substring(0, 18) + '...' : obj.text) : 'Text Element',
        preview: (
          <div className="text-slate-700 font-extrabold text-[10px] bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded truncate max-w-[80px]">
            {obj.text || 'Text'}
          </div>
        )
      };
    }

    if (obj.type === 'image') {
      const src = obj._element?.src || obj.src;
      return {
        label: obj.isStamp ? 'Stamp Layer' : 'Image Layer',
        preview: src ? (
          <img src={src} alt="Layer Preview" className="h-7 w-7 object-contain rounded bg-slate-100 p-0.5 border border-slate-200" />
        ) : (
          <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-500 font-bold">IMG</div>
        )
      };
    }

    if (obj.type === 'path' || obj.isPaintStroke) {
      const strokeColor = obj.stroke || obj.fill || '#000000';
      return {
        label: obj.stroke ? 'Pencil Stroke' : 'Brush Stroke',
        preview: (
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded">
            <div className="w-4.5 h-4.5 rounded-full border border-slate-300 flex-shrink-0" style={{ backgroundColor: strokeColor }} />
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.25 2.25 0 113.182 3.182l-9.37 9.37a4.5 4.5 0 01-2.25 1.22l-3.136.627a1.125 1.125 0 01-1.327-1.327l.627-3.136a4.5 4.5 0 011.22-2.25z" />
            </svg>
          </div>
        )
      };
    }

    if (obj.type === 'group') {
      return {
        label: 'Grouped Layer',
        preview: (
          <div className="flex items-center gap-1 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100 text-cyan-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <path strokeDasharray="2 2" d="M3 14h3M18 10h3M10 3v3M14 18v3" />
            </svg>
            <span className="text-[9px] font-extrabold">{obj.getObjects ? obj.getObjects().length : (obj._objects?.length || 0)}</span>
          </div>
        )
      };
    }

    return {
      label: 'Canvas Object',
      preview: <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded" />
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '120%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '120%', opacity: 0 }}
        transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl z-30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col gap-4 w-[300px] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 8.5L12 13L21 8.5L12 4Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5L12 17L21 12.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5L12 21L21 16.5" />
            </svg>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Layers</h4>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
            type="button"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Layer Stack */}
        <div className="flex flex-col gap-2">
          {layerList.length === 0 ? (
            <div className="text-center py-8 text-xs font-bold text-slate-400">
              No layers yet. Add images, stamps, or text to start!
            </div>
          ) : (
            layerList.map((obj, index) => {
              const { label, preview } = getObjectLabelAndPreview(obj);
              const isSelected =
                activeObject === obj ||
                (activeObject?.type === 'activeSelection' && activeObject._objects?.includes(obj));

              if (obj.type === 'group') {
                const groupChildren = obj.getObjects ? obj.getObjects() : (obj._objects || []);
                return (
                  <div key={index} className="flex flex-col gap-1.5 border border-slate-100 rounded-2xl p-2 bg-slate-50/20">
                    {/* Group Card */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={() => setDraggedOverIndex(null)}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => onSelectObject(obj)}
                      className={`flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/70 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                        isSelected && !obj._selectedChild
                          ? 'border-cyan-200 bg-cyan-50/20 ring-2 ring-cyan-500/10'
                          : 'border-slate-100'
                      } ${draggedOverIndex === index ? 'border-dashed border-cyan-400 bg-cyan-50/30' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Drag Handle */}
                        <div className="text-slate-400 hover:text-slate-600 cursor-grab flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="9" cy="8" r="1.5" />
                            <circle cx="15" cy="8" r="1.5" />
                            <circle cx="9" cy="12" r="1.5" />
                            <circle cx="15" cy="12" r="1.5" />
                            <circle cx="9" cy="16" r="1.5" />
                            <circle cx="15" cy="16" r="1.5" />
                          </svg>
                        </div>
                        <div className="flex-shrink-0 flex items-center justify-center">
                          {preview}
                        </div>
                        <span className="text-xs font-black text-slate-700 truncate max-w-[120px]">
                          {label}
                        </span>
                      </div>
                    </div>

                    {/* Group Children sub-list */}
                    <div className="flex flex-col gap-1 pl-4 border-l border-slate-200/60 ml-3.5">
                      {groupChildren.map((child, childIdx) => {
                        const childInfo = getObjectLabelAndPreview(child);
                        const isChildSelected = activeObject === obj && obj._selectedChild === child;

                        return (
                          <div
                            key={childIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectObject(child);
                            }}
                            className={`flex items-center justify-between gap-2.5 p-2 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                              isChildSelected
                                ? 'border-cyan-200 bg-cyan-50/30 ring-2 ring-cyan-500/5'
                                : 'bg-white hover:bg-slate-50 border-slate-100/85'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex-shrink-0 flex items-center justify-center scale-90">
                                {childInfo.preview}
                              </div>
                              <span className="text-[11px] font-extrabold text-slate-600 truncate max-w-[110px]">
                                {childInfo.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={() => setDraggedOverIndex(null)}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => onSelectObject(obj)}
                  className={`flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/70 p-3 rounded-2xl border transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? 'border-cyan-200 bg-cyan-50/20 ring-2 ring-cyan-500/10'
                      : 'border-slate-100'
                  } ${draggedOverIndex === index ? 'border-dashed border-cyan-400 bg-cyan-50/30' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Drag Handle */}
                    <div className="text-slate-400 hover:text-slate-600 cursor-grab flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="9" cy="8" r="1.5" />
                        <circle cx="15" cy="8" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="16" r="1.5" />
                        <circle cx="15" cy="16" r="1.5" />
                      </svg>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                      {preview}
                    </div>

                    {/* Label */}
                    <span className="text-xs font-black text-slate-700 truncate max-w-[130px]">
                      {label}
                    </span>
                  </div>

                  {/* Actions (Unlock status or quick controls) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {obj.lockMovementX && (
                      <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
