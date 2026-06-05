import { motion } from 'framer-motion';
import logo from '../../assets/images/inkprintalogo.jpg';
import InteractiveTShirt from '../3d/InteractiveTShirt';

export default function HeroOverlay() {
  return (
    <div className="flex-1 w-full flex flex-col bg-white relative">
      
      {/* Background ambient gradients - lowered opacity to ensure text contrast */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.15]">
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-cyan-400 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] bg-fuchsia-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[40%] w-[600px] h-[600px] bg-yellow-300 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col w-full h-full">
        
        {/* Top Header Section */}
        <div className="w-full py-16 md:py-24 flex flex-col items-center text-center px-6">
           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] drop-shadow-sm">
             Premium Apparel,<br className="hidden sm:block" />Effortlessly Personalized.
           </h1>
           <p className="text-slate-700 font-medium max-w-2xl text-base md:text-lg mb-10">
             Craft bespoke t-shirts, hoodies, and more with our high-end custom printing service for brands and businesses.
           </p>
           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
             <button className="w-full sm:w-auto px-8 py-3.5 bg-cyan-200 hover:bg-cyan-300 text-slate-900 rounded-full font-bold transition-all text-sm uppercase tracking-widest shadow-sm">
               Design Yours Now
             </button>
             <button className="w-full sm:w-auto px-8 py-3.5 text-slate-700 font-bold hover:text-slate-900 underline underline-offset-8 text-sm uppercase tracking-widest transition-all">
               Request a Sample
             </button>
           </div>
        </div>

        {/* 3-Column Features & Product Section */}
        <div className="w-full flex-1 max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 relative">
          
          {/* Left Column */}
          <div className="col-span-1 flex flex-col gap-6 lg:gap-8 lg:pr-8 justify-center">
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-center text-center lg:items-start lg:text-left bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:border-cyan-200/50 hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/40 via-transparent to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-12 h-12 mb-5 text-slate-800 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:text-cyan-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </div>
              <h3 className="relative z-10 text-sm font-black text-slate-900 uppercase tracking-widest mb-3">The Design Lab</h3>
              <p className="relative z-10 text-slate-600 text-sm mb-5 leading-relaxed font-medium">Intuitive online customizer. Upload art or design live.</p>
              <span className="relative z-10 text-xs font-bold text-cyan-700 uppercase tracking-widest group-hover:text-cyan-600 flex items-center gap-1">Explore Tools <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>&rarr;</motion.span></span>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-center text-center lg:items-start lg:text-left bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:border-purple-200/50 hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-12 h-12 mb-5 text-slate-800 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:text-purple-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Bulk & Team Orders</h3>
              <p className="relative z-10 text-slate-600 text-sm mb-5 leading-relaxed font-medium">Dedicated support, competitive pricing for large scale projects.</p>
              <span className="relative z-10 text-xs font-bold text-cyan-700 uppercase tracking-widest group-hover:text-purple-600 flex items-center gap-1">Get Bulk Quote <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>&rarr;</motion.span></span>
            </motion.div>
          </div>

          {/* Center Column - High Fidelity Interactive 3D T-Shirt */}
          <div className="col-span-1 order-first lg:order-none relative flex flex-col items-center justify-center p-0 lg:p-4 min-h-[450px] lg:min-h-[600px] z-30">
             <div className="relative w-full h-[450px] lg:h-[600px] max-w-md mx-auto flex items-center justify-center">
                <InteractiveTShirt />
             </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1 flex flex-col gap-6 lg:gap-8 lg:pl-8 justify-center">
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-center text-center lg:items-start lg:text-left bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:border-yellow-200/50 hover:shadow-yellow-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 via-transparent to-red-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-12 h-12 mb-5 text-slate-800 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:text-amber-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Premium Fabrics</h3>
              <p className="relative z-10 text-slate-600 text-sm mb-5 leading-relaxed font-medium">Sustainable, high-grade cottons & blends. Ethically sourced.</p>
              <span className="relative z-10 text-xs font-bold text-cyan-700 uppercase tracking-widest group-hover:text-amber-600 flex items-center gap-1">View All Materials <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>&rarr;</motion.span></span>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-center text-center lg:items-start lg:text-left bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:border-emerald-200/50 hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-transparent to-cyan-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-12 h-12 mb-5 text-slate-800 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:text-emerald-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Trusted Quality</h3>
              <p className="relative z-10 text-slate-600 text-sm mb-5 leading-relaxed font-medium">Flawless prints, reliable delivery, and full design satisfaction.</p>
              <span className="relative z-10 text-xs font-bold text-cyan-700 uppercase tracking-widest group-hover:text-emerald-600 flex items-center gap-1">Our Process <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>&rarr;</motion.span></span>
            </motion.div>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="w-full mt-auto py-8 border-t border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 relative z-20 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="InkPrinta Logo" className="w-8 h-8 rounded-lg object-cover border border-slate-300 shadow-sm" />
            <span className="text-slate-900 font-bold text-sm tracking-tight">InkPrinta &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-600">
             <a href="#" className="hover:text-slate-900 transition-colors">Instagram</a>
             <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
             <a href="#" className="hover:text-slate-900 transition-colors">Facebook</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
