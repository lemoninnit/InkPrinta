import React from 'react';
import { motion } from 'framer-motion';

const STUDIO_TABS = [
  {
    id: 'Product',
    label: 'Product',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4V7a3 3 0 0 1-6 0V4H4.5L3 8.25l3 1.5v10.5h12V9.75l3-1.5L19.5 4H15Z" />
      </svg>
    )
  },
  {
    id: 'Image',
    label: 'Image',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  },
  {
    id: 'Stamp',
    label: 'Stamp',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L9 9H2l5.5 4.5L5.5 21l6.5-5 6.5 5-2-7.5L22 9h-7L12 2z" />
      </svg>
    )
  },
  {
    id: 'Text',
    label: 'Text',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    )
  },
  {
    id: 'Paint',
    label: 'Paint',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.7 5.3a2.1 2.1 0 1 0-3 3L18 10.5l.7-5.2z" />
        <path d="M15.7 8.3L4.5 19.5a1.5 1.5 0 0 0 0 2.1l0 0a1.5 1.5 0 0 0 2.1 0L17.8 10.4" />
      </svg>
    )
  }
];

export default function Footer({
  activeTab,
  showProductPanel,
  showTextPanel,
  showImagePanel,
  showPaintPanel,
  showStampPanel,
  onTabClick
}) {
  return (
    <footer className="w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 px-8 py-3.5 flex items-center justify-between relative shadow-[0_-8px_30px_rgba(0,0,0,0.02)] z-40">
      <div className="flex-1 flex justify-center items-center gap-6 md:gap-10">
        {STUDIO_TABS.map((tab) => {
          const isProduct = tab.id === 'Product';
          const isText = tab.id === 'Text';
          const isImage = tab.id === 'Image';
          const isPaint = tab.id === 'Paint';
          const isStamp = tab.id === 'Stamp';

          // Highlight is directly tied to the active/open state of the corresponding panel/modal
          const isHighlighted =
            (isProduct && showProductPanel) ||
            (isText && showTextPanel) ||
            (isImage && showImagePanel) ||
            (isPaint && showPaintPanel) ||
            (isStamp && showStampPanel);

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-6 rounded-2.5xl relative cursor-pointer group select-none ${
                isHighlighted
                  ? 'text-cyan-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              type="button"
            >
              {/* Modern glassmorphic active tab indicator bubble with spring transition */}
              {isHighlighted && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.08] to-indigo-500/[0.08] border border-cyan-500/20 rounded-2.5xl -z-10 shadow-[0_4px_12px_rgba(6,182,212,0.04)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className={`transition-transform duration-300 ${isHighlighted ? 'scale-110 text-cyan-600' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest select-none transition-colors ${isHighlighted ? 'text-slate-800' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              
              {isHighlighted && (
                <motion.span
                  layoutId="activeTabIndicatorDot"
                  className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
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
