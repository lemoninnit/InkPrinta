import FontDropdown from '../shared/FontDropdown.jsx';
import ColorPicker from '../shared/ColorPicker.jsx';

export default function TextFormatToolbar({
  activeObject,
  fontFamily,
  fontSize,
  textColor,
  fontWeight,
  fontStyle,
  underline,
  linethrough,
  textAlign,
  opacity,
  opacityInput,
  hueValue,
  hexInputValue,
  showFontDropdown,
  showColorPopover,
  showOpacityPopover,
  setShowFontDropdown,
  setShowColorPopover,
  setShowOpacityPopover,
  setHueValue,
  setHexInputValue,
  setOpacityInput,
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle,
  onLinethroughToggle,
  onCaseToggle,
  onAlignToggle,
  onListToggle,
  onOpacityChange,
  onColorSquareMouseDown
}) {
  if (!activeObject || activeObject.type !== 'textbox') return null;

  const closeOtherPopovers = (except) => {
    if (except !== 'font') setShowFontDropdown(false);
    if (except !== 'color') setShowColorPopover(false);
    if (except !== 'opacity') setShowOpacityPopover(false);
  };

  return (
    <div className="flex items-center gap-1.5 md:gap-2.5">
      <div className="relative group/tooltip">
        <FontDropdown
          fontFamily={fontFamily}
          onSelect={onFontFamilyChange}
          isOpen={showFontDropdown}
          onToggle={() => {
            closeOtherPopovers('font');
            setShowFontDropdown(!showFontDropdown);
          }}
          onClose={() => setShowFontDropdown(false)}
          triggerClassName="px-3.5 py-2 bg-white/40 border border-white/60 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer min-w-[150px] shadow-sm hover:border-white hover:bg-white/60 transition-all flex items-center justify-between gap-2 h-9"
        />
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
          Font Family
        </span>
      </div>

      <div className="h-5 w-[1px] bg-slate-200/50" />

      <div className="flex items-center bg-white/40 border border-white/60 rounded-xl overflow-hidden h-9 shadow-sm focus-within:border-white focus-within:bg-white/60 transition-all">
        <div className="relative group/tooltip h-full flex items-center">
          <button
            onClick={() => onFontSizeChange(fontSize - 1)}
            className="px-2.5 h-full hover:bg-white/50 text-slate-500 hover:text-slate-800 font-extrabold text-sm transition-colors border-r border-white/40"
            type="button"
          >
            -
          </button>
        </div>
        <div className="relative group/tooltip h-full flex items-center">
          <input
            type="number"
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10) || 12)}
            className="w-10 text-center bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="relative group/tooltip h-full flex items-center">
          <button
            onClick={() => onFontSizeChange(fontSize + 1)}
            className="px-2.5 h-full hover:bg-white/50 text-slate-500 hover:text-slate-800 font-extrabold text-sm transition-colors border-l border-white/40"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      <div className="h-5 w-[1px] bg-slate-200/50" />

      <div className="relative group/tooltip">
        <button
          onClick={() => {
            closeOtherPopovers('color');
            setShowColorPopover(!showColorPopover);
          }}
          className="flex flex-col items-center justify-center w-9 h-9 rounded-xl border border-white/60 bg-white/40 hover:bg-white/60 active:scale-95 transition-all cursor-pointer relative shadow-sm"
          type="button"
        >
          <span className="text-sm font-extrabold text-slate-800 leading-none">A</span>
          <div style={{ backgroundColor: textColor }} className="w-4 h-1 rounded-full mt-0.5" />
        </button>

        {showColorPopover && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowColorPopover(false)} />
            <div className="absolute top-11 left-0 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl z-50 min-w-[240px]">
              <ColorPicker
                textColor={textColor}
                onColorChange={onTextColorChange}
                hueValue={hueValue}
                setHueValue={setHueValue}
                hexInputValue={hexInputValue}
                setHexInputValue={setHexInputValue}
                onColorSquareMouseDown={onColorSquareMouseDown}
              />
            </div>
          </>
        )}
      </div>

      <ToolbarToggleButton active={fontWeight === 'bold'} onClick={onBoldToggle} label="Bold">B</ToolbarToggleButton>
      <ToolbarToggleButton active={fontStyle === 'italic'} onClick={onItalicToggle} label="Italic" className="italic font-serif">I</ToolbarToggleButton>
      <ToolbarToggleButton active={underline} onClick={onUnderlineToggle} label="Underline" className="underline">U</ToolbarToggleButton>
      <ToolbarToggleButton active={linethrough} onClick={onLinethroughToggle} label="Strikethrough" className="line-through">S</ToolbarToggleButton>

      <div className="relative group/tooltip">
        <button
          onClick={onCaseToggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold bg-white/40 border border-white/60 hover:bg-white/60 text-slate-700 transition-all shadow-sm"
          type="button"
        >
          aA
        </button>
      </div>

      <div className="h-5 w-[1px] bg-slate-200/50" />

      <div className="relative group/tooltip">
        <button
          onClick={() => {
            const next = textAlign === 'center' ? 'left' : textAlign === 'left' ? 'right' : 'center';
            onAlignToggle(next);
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/40 border border-white/60 hover:bg-white/60 text-slate-700 transition-all shadow-sm"
          type="button"
        >
          {textAlign === 'center' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          ) : textAlign === 'left' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h12m-12 5.25h16.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M7.5 12h12.75m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      <div className="relative group/tooltip">
        <button
          onClick={onListToggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/40 border border-white/60 hover:bg-white/60 text-slate-700 transition-all shadow-sm"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </button>
      </div>

      <div className="relative group/tooltip">
        <button
          onClick={() => {
            closeOtherPopovers('opacity');
            setShowOpacityPopover(!showOpacityPopover);
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
            showOpacityPopover
              ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
              : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
          }`}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </button>

        {showOpacityPopover && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowOpacityPopover(false)} />
            <div className="absolute top-11 right-0 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3 min-w-[220px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 font-sans">Transparency</span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center w-12 h-7">
                  <input
                    type="text"
                    value={opacityInput}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setOpacityInput(raw);
                      if (raw !== '') {
                        const num = Math.min(100, parseInt(raw, 10) || 0);
                        onOpacityChange(num / 100);
                      }
                    }}
                    onBlur={() => {
                      if (opacityInput === '') {
                        setOpacityInput('0');
                        onOpacityChange(0);
                      } else {
                        const num = Math.min(100, parseInt(opacityInput, 10) || 0);
                        setOpacityInput(String(num));
                      }
                    }}
                    className="w-full text-center bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer border border-slate-200/40"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToolbarToggleButton({ active, onClick, label, children, className = '' }) {
  return (
    <div className="relative group/tooltip">
      <button
        onClick={onClick}
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm border ${className} ${
          active
            ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30'
            : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
        }`}
        type="button"
      >
        {children}
      </button>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
        {label}
      </span>
    </div>
  );
}