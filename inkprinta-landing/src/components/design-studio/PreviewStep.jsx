import React from 'react';

const PRODUCT_MOCKUP_CONFIGS = {
  tshirt: {
    mockupUrl: '/tshirt_mockup.png',
    printArea: {
      top: '25%',
      left: '30%',
      width: '40%',
      height: '50%'
    }
  },
  hoodie: {
    mockupUrl: '/hoodie_mockup.png',
    printArea: {
      top: '25%',
      left: '32%',
      width: '36%',
      height: '38%'
    }
  },
  tote: {
    mockupUrl: '/tote_mockup.png',
    printArea: {
      top: '38%',
      left: '30%',
      width: '40%',
      height: '42%'
    }
  }
};

export default function PreviewStep({ designImage, currentProduct, setStep }) {
  const config = PRODUCT_MOCKUP_CONFIGS[currentProduct.id] || PRODUCT_MOCKUP_CONFIGS.tshirt;

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start p-6 bg-slate-50 overflow-y-auto select-none">
      {/* Large Product Mockup (No background card, no border glow, direct clean design representation) */}
      <div className="flex-1 w-full max-w-[580px] aspect-square flex flex-col items-center justify-center mb-8 relative">
        {/* Combined Image Layer Container - outline and corner rounding directly on the image with no padding */}
        <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none border-[0.5px] border-cyan-400 rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.12)] overflow-hidden">
          {/* Garment Mockup Image */}
          <img
            src={config.mockupUrl}
            alt={`${currentProduct.label} Mockup`}
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Print Area Overlay with Design Image */}
          <div
            style={{
              position: 'absolute',
              top: config.printArea.top,
              left: config.printArea.left,
              width: config.printArea.width,
              height: config.printArea.height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
            className="pointer-events-none select-none"
          >
            {designImage ? (
              <img
                src={designImage}
                alt="Your Design Preview"
                className="w-full h-full object-contain pointer-events-none select-none mix-blend-multiply opacity-90"
              />
            ) : (
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Design</div>
            )}
          </div>
        </div>

        <div className="mt-2 text-center">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{currentProduct.label} Mockup</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">2D Production Layout Validation</p>
        </div>
      </div>

      {/* Bottom Step Control Buttons (Centered and only showing Continue to Order) */}
      <div className="w-full max-w-[640px] flex items-center justify-center z-10">
        <button
          onClick={() => setStep('order')}
          className="group px-12 py-4 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 running-glow-button border border-transparent"
          type="button"
        >
          <span className="relative z-10 flex items-center gap-2">
            Continue to Order
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
