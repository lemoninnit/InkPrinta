import { hexToHsl, hslToHsv, hslToHex } from '../utils/calculations.js';
import { COLOR_SWATCHES } from '../utils/constants.js';

export default function ColorPicker({
  textColor,
  onColorChange,
  hueValue,
  setHueValue,
  hexInputValue,
  setHexInputValue,
  onColorSquareMouseDown,
  variant = 'popover',
  showSelectedDot = false
}) {
  const isInline = variant === 'inline';
  const swatchSize = isInline ? 'w-7 h-7' : 'w-6 h-6';
  const squareClass = isInline
    ? 'relative w-full h-28 rounded-xl cursor-crosshair overflow-hidden border border-slate-200 select-none'
    : 'relative w-full h-28 rounded-xl cursor-crosshair overflow-hidden border border-slate-200 select-none';

  const handleSquareMouseDown = (e) => {
    if (onColorSquareMouseDown) {
      onColorSquareMouseDown(e, onColorChange);
    }
  };

  const hsl = hexToHsl(textColor);
  const hsv = hslToHsv(hsl.h, hsl.s, hsl.l);

  return (
    <div className={`flex flex-col ${isInline ? 'gap-3.5' : 'gap-3'}`}>
      {!isInline && (
        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Text Color</span>
          <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full uppercase">#{hexInputValue}</span>
        </div>
      )}

      <div
        onMouseDown={handleSquareMouseDown}
        className={squareClass}
        style={{ backgroundColor: `hsl(${hueValue}, 100%, 50%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div
          className="absolute w-3.5 h-3.5 -ml-1.75 -mt-1.75 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
        />
      </div>

      <div className={`flex items-center flex-wrap ${isInline ? 'gap-2' : 'gap-1.5'}`}>
        {COLOR_SWATCHES.map((color) => {
          const isSelected = textColor === color.hex;
          return (
            <button
              key={color.hex}
              onClick={() => {
                onColorChange(color.hex);
                try {
                  setHueValue(hexToHsl(color.hex).h);
                } catch {
                  /* ignore */
                }
              }}
              style={{ backgroundColor: color.hex }}
              className={`${swatchSize} rounded-full transition-transform active:scale-90 border flex items-center justify-center ${
                isSelected
                  ? 'scale-110 shadow-sm border-cyan-400 border-2'
                  : 'border-slate-200/50 hover:scale-105'
              }`}
              title={color.name}
              type="button"
            >
              {showSelectedDot && isSelected && (
                <div className={`w-1.5 h-1.5 rounded-full ${color.hex === '#ffffff' ? 'bg-slate-950' : 'bg-white'}`} />
              )}
            </button>
          );
        })}
      </div>

      <div className={`flex flex-col mt-1 ${isInline ? 'gap-1.5' : 'gap-1'}`}>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Adjust Hue</span>
        <input
          type="range"
          min="0"
          max="360"
          value={hueValue}
          onChange={(e) => {
            const hue = parseInt(e.target.value, 10);
            setHueValue(hue);
            const currentHsl = hexToHsl(textColor);
            onColorChange(hslToHex(hue, currentHsl.s, currentHsl.l));
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer border border-slate-100 shadow-sm"
          style={{
            background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
          }}
        />
      </div>

      <div className={`flex items-center ${
        isInline ? 'gap-3.5' : 'gap-2'
      } ${
        isInline
          ? 'bg-white/40 border border-white/60 focus-within:border-cyan-500 focus-within:bg-white/80 rounded-2xl px-4 py-2.5 h-11 transition-all shadow-sm focus-within:shadow-md'
          : 'bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 h-8'
      }`}>
        <span className={`text-slate-400 font-bold ${isInline ? 'text-xs' : 'text-[10px]'}`}>HEX</span>
        <input
          type="text"
          value={hexInputValue}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
            setHexInputValue(val);
            if (val.length === 3 || val.length === 6) {
              onColorChange(`#${val}`);
              try {
                setHueValue(hexToHsl(`#${val}`).h);
              } catch {
                /* ignore */
              }
            }
          }}
          className={`bg-transparent font-extrabold text-slate-800 focus:outline-none w-full uppercase ${
            isInline ? 'text-xs' : 'text-[11px]'
          }`}
          placeholder="000000"
          maxLength={6}
        />
        <div
          style={{ backgroundColor: textColor }}
          className={`rounded-full border border-slate-200/50 shadow-sm flex-shrink-0 ${
            isInline ? 'w-5 h-5' : 'w-4 h-4'
          }`}
        />
      </div>
    </div>
  );
}
