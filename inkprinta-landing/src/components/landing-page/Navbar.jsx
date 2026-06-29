import { motion } from 'framer-motion';
import logo from '../../assets/images/inkprintalogo.jpg';

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full px-6 md:px-12 py-6 flex items-center justify-between bg-white relative z-50"
    >
      <div className="flex items-center gap-3 cursor-pointer">
        <img
          src={logo}
          alt="InkPrinta Logo"
          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
        />
        <div className="flex flex-col">
          <span className="text-slate-900 font-bold text-xl leading-none tracking-tight">
            InkPrinta
          </span>
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1 hidden sm:block">
            Premium Custom Apparel
          </span>
        </div>
      </div>

      <nav className="hidden lg:block">
        <ul className="flex items-center gap-8 text-sm font-bold text-slate-700">
          <li><a href="#home" className="hover:text-slate-900 transition-colors">Home</a></li>
          <li><a href="#services" className="hover:text-slate-900 transition-colors">Services</a></li>
          <li><a href="#details" className="hover:text-slate-900 transition-colors">Details</a></li>
          <li>
            <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-md text-sm font-bold ml-4" type="button">
              Contact Us
            </button>
          </li>
        </ul>
      </nav>

      <div className="lg:hidden flex items-center">
        <button className="text-slate-900 p-2" type="button">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
