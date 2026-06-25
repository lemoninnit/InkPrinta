import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-10 shadow-sm">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-cyan-600 bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-100 rounded-full px-4 py-2 transition-all duration-200"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Home
      </button>

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-inner">
        <span className="text-cyan-600 font-black">1. Design</span>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5-7.5" />
        </svg>
        <span>2. Preview</span>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5-7.5" />
        </svg>
        <span>3. Order</span>
      </div>

      <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full px-3.5 py-1.5 shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider">Studio Live</span>
      </div>
    </header>
  );
}
