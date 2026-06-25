import { motion, AnimatePresence } from 'framer-motion';
import FontDropdown from '../shared/FontDropdown.jsx';
import ColorPicker from '../shared/ColorPicker.jsx';

export default function TextModal({
  isOpen,
  onClose,
  textInput,
  setTextInput,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  textColor,
  setTextColor,
  hueValue,
  setHueValue,
  hexInputValue,
  setHexInputValue,
  showBottomFontDropdown,
  setShowBottomFontDropdown,
  onAddText,
  onColorSquareMouseDown
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm z-20"
          />
          <motion.div
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '120%', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="absolute bottom-20 left-4 right-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl z-30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col gap-5 max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between border-b border-white/40 pb-3">
              <div className="flex flex-col">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Add Custom Text</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Customize your typography and style</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1" type="button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Your Message</label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 border border-white/60 focus:border-cyan-500 focus:bg-white/80 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none transition-all shadow-sm focus:shadow-md"
                placeholder="Enter text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Font Style</label>
                <FontDropdown
                  fontFamily={fontFamily}
                  onSelect={setFontFamily}
                  isOpen={showBottomFontDropdown}
                  onToggle={() => setShowBottomFontDropdown(!showBottomFontDropdown)}
                  onClose={() => setShowBottomFontDropdown(false)}
                  triggerClassName="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none transition-all cursor-pointer shadow-sm hover:border-slate-300 flex items-center justify-between gap-2 h-11"
                  menuClassName="w-full"
                  menuPosition="top-12 left-0"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Font Size</label>
                <div className="flex items-center border border-white/60 rounded-2xl overflow-hidden bg-white/40 h-11 shadow-sm focus-within:border-cyan-500 focus-within:bg-white/80 focus-within:shadow-md transition-all">
                  <button
                    onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                    className="px-3.5 h-full hover:bg-white/50 text-slate-600 font-extrabold transition-colors border-r border-white/40"
                    type="button"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Math.max(1, parseInt(e.target.value, 10) || 12))}
                    className="w-full text-center bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setFontSize(fontSize + 1)}
                    className="px-3.5 h-full hover:bg-white/50 text-slate-600 font-extrabold transition-colors border-l border-white/40"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 border-t border-slate-100/50 pt-3.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Text Color</label>
                <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-full uppercase">#{hexInputValue}</span>
              </div>
              <ColorPicker
                variant="inline"
                showSelectedDot
                textColor={textColor}
                onColorChange={setTextColor}
                hueValue={hueValue}
                setHueValue={setHueValue}
                hexInputValue={hexInputValue}
                setHexInputValue={setHexInputValue}
                onColorSquareMouseDown={onColorSquareMouseDown}
              />
            </div>

            <button
              onClick={onAddText}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.25)] transition-all active:scale-98 mt-2"
              type="button"
            >
              Add Text to Canvas
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}