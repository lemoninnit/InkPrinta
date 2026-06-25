const STUDIO_TABS = [
  {
    id: 'Product',
    label: 'Product',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v1.8a3 3 0 006 0v-1.8m-6 0H4.5L3 8.25l3 1.5V20.25h12V9.75l3-1.5L19.5 4.5H15" />
      </svg>
    )
  },
  {
    id: 'Image',
    label: 'Image',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    )
  },
  {
    id: 'Stamp',
    label: 'Stamp',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.468.83-.468 1.002 0l3.001 8.163c.046.126.166.21.3.217l8.7.632c.504.037.707.658.343 1.011l-6.3 6.14a.428.428 0 00-.123.379l1.487 8.665c.086.502-.44.886-.889.65l-7.781-4.09a.434.434 0 00-.404 0l-7.781 4.09c-.449.236-.975-.148-.889-.65l1.487-8.665a.428.428 0 00-.123-.379l-6.3-6.14c-.364-.353-.161-.974.343-1.011l8.7-.632a.229.229 0 00.3-.217l3.001-8.163z" />
      </svg>
    )
  },
  {
    id: 'Text',
    label: 'Text',
    icon: (
      <span className="font-serif font-extrabold text-[22px] leading-none select-none">A</span>
    )
  },
  {
    id: 'Paint',
    label: 'Paint',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.25 2.25 0 113.182 3.182l-9.37 9.37a4.5 4.5 0 01-2.25 1.22l-3.136.627a1.125 1.125 0 01-1.327-1.327l.627-3.136a4.5 4.5 0 011.22-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5L17.5 9.5" />
      </svg>
    )
  }
];

export default function Footer({ activeTab, showProductPanel, showTextPanel, onTabClick }) {
  return (
    <footer className="w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-3.5 flex items-center justify-between relative shadow-[0_-8px_30px_rgba(0,0,0,0.02)] z-40">
      <div className="flex-1 flex justify-center items-center gap-6 md:gap-12">
        {STUDIO_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isProduct = tab.id === 'Product';
          const isText = tab.id === 'Text';
          const isHighlighted = isActive || (isProduct && showProductPanel) || (isText && showTextPanel);

          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-2xl transition-all duration-300 relative ${
                isHighlighted
                  ? 'bg-slate-100/90 text-cyan-600 scale-105 font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 hover:scale-102'
              }`}
              type="button"
            >
              <div className={`transition-transform duration-300 ${isHighlighted ? 'translate-y-[-1px]' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest select-none transition-colors ${isHighlighted ? 'text-slate-800' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isHighlighted && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-none pl-4">
        <button
          className="px-8 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-600 hover:to-cyan-500 text-white rounded-full text-xs font-black shadow-md hover:shadow-cyan-100/50 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest active:translate-y-0 active:scale-95 cursor-pointer"
          type="button"
        >
          Preview Design
        </button>
      </div>
    </footer>
  );
}
