import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal({
  isOpen,
  onClose,
  products,
  currentProduct,
  onSelectProduct
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
            className="absolute inset-0 bg-slate-900/10 z-20"
          />
          <motion.div
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '120%', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="absolute bottom-20 left-4 right-4 bg-white border border-slate-200/80 rounded-2xl z-30 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.1)] flex flex-col gap-4 max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex flex-col">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Garment Catalog</h4>
                <p className="text-[10px] text-slate-400 font-medium">Select a premium custom print size ratio</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1" type="button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {products.map((prod) => {
                const isSelected = currentProduct.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/20 shadow-sm'
                        : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                    type="button"
                  >
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-slate-800">{prod.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Ratio: {prod.printWidth} x {prod.printHeight} px
                      </p>
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-cyan-600' : 'text-slate-500'}`}>
                      {prod.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
