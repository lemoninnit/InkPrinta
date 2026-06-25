import { PREMIUM_FONTS } from '../utils/constants.js';

export default function FontDropdown({
  fontFamily,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  triggerClassName = '',
  menuClassName = '',
  menuPosition = 'top-11 left-0'
}) {
  const currentFont = PREMIUM_FONTS.find((f) => f.value === fontFamily) || PREMIUM_FONTS[0];

  return (
    <div className="relative group/tooltip">
      <button
        onClick={onToggle}
        type="button"
        className={triggerClassName}
      >
        <span style={{ fontFamily }}>{currentFont.label}</span>
        <svg className="w-3 h-3 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className={`absolute ${menuPosition} bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl py-2 shadow-xl z-50 flex flex-col min-w-[200px] max-h-[300px] overflow-y-auto scrollbar-thin ${menuClassName}`}>
            {PREMIUM_FONTS.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  onSelect(font.value);
                  onClose();
                }}
                type="button"
                style={font.style}
                className={`px-4 py-2.5 text-left text-xs font-bold transition-colors ${
                  fontFamily === font.value
                    ? 'bg-cyan-500/10 text-cyan-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {font.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function getCurrentFontLabel(fontFamily) {
  return (PREMIUM_FONTS.find((f) => f.value === fontFamily) || PREMIUM_FONTS[0]).label;
}
