import React from 'react';
import HeroShirt from './HeroShirt';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center bg-white dark:bg-slate-950 py-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
      {/* Decorative background elements common in modern SaaS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl opacity-70" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-3xl opacity-70" />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full z-10">
        
        {/* Left Column (Text Content) */}
        <div className="flex flex-col items-start text-left space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              InkPrinta: Premium Custom Threads
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
              We offer custom printing with fast turnaround and no minimum order. Whether it's one piece or bulk, we deliver quality prints and reliable customer service.
            </p>
          </div>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Design Your Shirt
            </button>
            <button className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] dark:text-slate-200 dark:bg-slate-900/50 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600 rounded-xl shadow-sm hover:shadow transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500">
              Get a Bulk Quote
            </button>
          </div>
        </div>
        
        {/* Right Column (Visual) */}
        <div className="relative w-full h-[500px] lg:h-[700px] flex items-center justify-center isolate">
          <div className="w-full h-full flex items-center justify-center relative">
             <HeroShirt />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
