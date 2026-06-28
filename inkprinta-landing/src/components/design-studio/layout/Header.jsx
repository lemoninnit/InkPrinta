import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/inkprintalogo.jpg';

export default function Header({ step = 'design', setStep }) {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 md:px-12 py-6 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-sm">
      {/* InkPrinta Logo — identical to landing page Navbar */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
        type="button"
        aria-label="Back to Home"
      >
        <img
          src={logo}
          alt="InkPrinta Logo"
          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
        />
        <div className="flex flex-col items-start">
          <span className="text-slate-900 font-bold text-xl leading-none tracking-tight">
            InkPrinta
          </span>
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1 hidden sm:block">
            Premium Custom Apparel
          </span>
        </div>
      </button>

      {/* Step Breadcrumb */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-inner">
        <button
          onClick={() => setStep?.('design')}
          className={`cursor-pointer transition-colors uppercase font-black ${step === 'design' ? 'text-cyan-600' : 'hover:text-slate-600'}`}
          type="button"
        >
          1. Design
        </button>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5-7.5" />
        </svg>
        <button
          onClick={() => setStep?.('preview')}
          className={`cursor-pointer transition-colors uppercase font-black ${step === 'preview' ? 'text-cyan-600' : 'hover:text-slate-600'}`}
          type="button"
        >
          2. Preview
        </button>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5-7.5" />
        </svg>
        <button
          onClick={() => setStep?.('order')}
          className={`cursor-pointer transition-colors uppercase font-black ${step === 'order' ? 'text-cyan-600' : 'hover:text-slate-600'}`}
          type="button"
        >
          3. Order
        </button>
      </div>

      {/* Studio Live Badge */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full px-3.5 py-1.5 shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider">Studio Live</span>
      </div>
    </header>
  );
}
