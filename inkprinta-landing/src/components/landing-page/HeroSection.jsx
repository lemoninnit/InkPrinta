import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/inkprintalogo.jpg';
import InteractiveTShirt from './InteractiveTShirt.jsx';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full flex flex-col bg-white relative">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'white',
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: '40px 40px, 40px 40px, 100% 100%'
        }}
      />

      <div className="relative z-10 flex flex-col w-full h-full">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full pt-8 pb-6 md:pt-12 md:pb-8 flex flex-col items-center text-center px-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.15] drop-shadow-sm">
            Premium Apparel,<br className="hidden sm:block" />Effortlessly Personalized.
          </h1>
          <p className="text-slate-600 font-medium max-w-2xl text-base mb-6">
            Craft bespoke t-shirts, hoodies, and more with our high-end custom printing service for brands and businesses.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/design')}
              className="w-full sm:w-auto px-6 py-3 bg-cyan-200 hover:bg-cyan-300 text-slate-900 rounded-full font-bold transition-all text-xs uppercase tracking-widest shadow-sm"
              type="button"
            >
              Design Yours Now
            </button>
            <button className="w-full sm:w-auto px-6 py-3 text-slate-700 font-bold hover:text-slate-900 underline underline-offset-4 text-xs uppercase tracking-widest transition-all" type="button">
              Request a Sample
            </button>
          </div>
        </motion.div>

        <div className="w-full flex-1 max-w-[1600px] mx-auto px-6 md:px-12 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 relative items-center">
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-8 lg:gap-12 justify-center lg:pr-4 z-40">
            {/* The Design Lab: sequential slide from left */}
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center text-center lg:items-start lg:text-left cursor-pointer"
              >
                <div className="text-cyan-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-3">The Design Lab</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium mb-5 max-w-[280px]">Intuitive online customizer. Upload art or design live directly on the garment.</p>
                <span className="text-sm font-bold text-cyan-600 uppercase tracking-widest group-hover:text-cyan-500 flex items-center gap-1">Explore Tools &rarr;</span>
              </motion.div>
            </motion.div>

            {/* Bulk & Team Orders: sequential slide from left */}
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center text-center lg:items-start lg:text-left cursor-pointer"
              >
                <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-3">Bulk & Team Orders</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium mb-5 max-w-[280px]">Dedicated support, fast turnaround, and competitive pricing for large scale projects.</p>
                <span className="text-sm font-bold text-purple-600 uppercase tracking-widest group-hover:text-purple-500 flex items-center gap-1">Get Bulk Quote &rarr;</span>
              </motion.div>
            </motion.div>
          </div>

          <div className="col-span-1 lg:col-span-6 order-first lg:order-none relative flex flex-col items-center justify-center min-h-[450px] lg:min-h-[750px] z-30 pointer-events-none">
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
              <InteractiveTShirt />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3 flex flex-col gap-8 lg:gap-12 justify-center lg:pl-4 z-40">
            {/* Premium Fabrics: sequential slide from right */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <motion.div
                whileHover={{ x: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center text-center lg:items-start lg:text-left cursor-pointer"
              >
                <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-3">Premium Fabrics</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium mb-5 max-w-[280px]">Sustainable, high-grade cottons & blends. Ethically sourced for lasting comfort.</p>
                <span className="text-sm font-bold text-amber-600 uppercase tracking-widest group-hover:text-amber-500 flex items-center gap-1">&larr; View Materials</span>
              </motion.div>
            </motion.div>

            {/* Trusted Quality: sequential slide from right */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            >
              <motion.div
                whileHover={{ x: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex flex-col items-center text-center lg:items-start lg:text-left cursor-pointer"
              >
                <div className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-3">Trusted Quality</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium mb-5 max-w-[280px]">Flawless prints, reliable delivery, and full design satisfaction on every order.</p>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest group-hover:text-emerald-500 flex items-center gap-1">&larr; Our Process</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <footer className="w-full mt-auto py-8 border-t border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 relative z-20 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="InkPrinta Logo" className="w-8 h-8 rounded-lg object-cover border border-slate-300 shadow-sm" />
            <span className="text-slate-900 font-bold text-sm tracking-tight">InkPrinta &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a 
              href="https://www.instagram.com/inkprintacebu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-900 transition-colors"
            >
              Instagram
            </a>
            <a 
              href="https://www.facebook.com/inkprintacebu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-900 transition-colors"
            >
              Facebook
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
