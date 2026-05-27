import { motion } from 'framer-motion';
import logo from '../assets/inkprintalogo.jpg';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-none"
    >
      <div className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
        <div className="relative">
          <div className="absolute inset-0 bg-slate-200 rounded-full blur-md opacity-30 group-hover:opacity-70 transition-opacity duration-500" />
          <img 
            src={logo} 
            alt="InkPrinta Logo" 
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-slate-200 shadow-sm" 
          />
        </div>
        <span className="text-slate-900 font-extrabold text-xl tracking-widest uppercase hidden sm:block">
          InkPrinta
        </span>
      </div>
      
      <nav className="pointer-events-auto">
        <ul className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-500">
          <li className="hidden md:block">
            <a href="#home" className="hover:text-slate-900 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] after:bg-slate-900 hover:after:w-full after:transition-all after:duration-300">
              Home
            </a>
          </li>
          <li className="hidden md:block">
            <a href="#services" className="hover:text-slate-900 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] after:bg-slate-900 hover:after:w-full after:transition-all after:duration-300">
              Services
            </a>
          </li>
          <li className="hidden md:block">
            <a href="#details" className="hover:text-slate-900 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] after:bg-slate-900 hover:after:w-full after:transition-all after:duration-300">
              Details
            </a>
          </li>
          <li>
            <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl uppercase tracking-wider text-xs font-bold">
              Contact Us
            </button>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
