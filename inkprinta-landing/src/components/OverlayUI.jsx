import { motion } from 'framer-motion';
import coverPhoto from '../assets/coverphoto.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const CMYKLogo = ({ className }) => (
  <div className={`relative flex items-center justify-center w-16 h-16 ${className}`}>
    <div className="absolute w-8 h-8 rounded-full bg-[#00aeef] mix-blend-multiply -translate-x-2 -translate-y-2 opacity-90"></div>
    <div className="absolute w-8 h-8 rounded-full bg-[#ec008c] mix-blend-multiply translate-x-2 -translate-y-2 opacity-90"></div>
    <div className="absolute w-8 h-8 rounded-full bg-[#fff200] mix-blend-multiply translate-y-2 opacity-90"></div>
  </div>
);

// Animated floating ambient orb for lively background
const FloatingOrb = ({ className, delay = 0, duration = 15, yOffset = 50 }) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] pointer-events-none mix-blend-multiply ${className}`}
    animate={{ 
      y: [0, yOffset, 0],
      x: [0, yOffset/2, 0],
      scale: [1, 1.2, 1] 
    }}
    transition={{ 
      duration: duration, 
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay 
    }}
  />
);

const FineSplatter = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`absolute fill-current text-black ${className}`}>
    <circle cx="100" cy="100" r="3" />
    <circle cx="110" cy="90" r="1.5" />
    <circle cx="90" cy="105" r="2.5" />
    <circle cx="120" cy="110" r="1" />
    <circle cx="105" cy="120" r="2" />
    <circle cx="85" cy="85" r="3" />
    <circle cx="115" cy="80" r="1" />
    <circle cx="130" cy="95" r="1.5" />
    <circle cx="75" cy="115" r="2" />
    <circle cx="100" cy="80" r="1" />
    <circle cx="95" cy="130" r="1.5" />
    <circle cx="125" cy="125" r="0.5" />
    <circle cx="140" cy="100" r="2.5" />
    <circle cx="70" cy="95" r="1" />
    <circle cx="105" cy="70" r="1.5" />
    <circle cx="80" cy="75" r="1" />
    <circle cx="135" cy="85" r="1" />
    <circle cx="65" cy="105" r="2" />
    <circle cx="90" cy="65" r="0.5" />
    <circle cx="115" cy="135" r="1" />
    <circle cx="145" cy="110" r="1" />
    <circle cx="150" cy="90" r="1.5" />
    <circle cx="60" cy="85" r="0.5" />
    <circle cx="85" cy="125" r="1" />
    <circle cx="108" cy="102" r="0.5" />
    <circle cx="92" cy="98" r="0.8" />
    <circle cx="102" cy="112" r="0.5" />
    <circle cx="98" cy="88" r="0.6" />
    <circle cx="115" cy="95" r="0.4" />
    <circle cx="85" cy="105" r="0.7" />
    <circle cx="105" cy="125" r="0.5" />
    <circle cx="95" cy="75" r="0.6" />
    <circle cx="122" cy="102" r="0.4" />
    <circle cx="78" cy="98" r="0.5" />
    <circle cx="95" cy="95" r="4.5" />
    <circle cx="105" cy="108" r="3.5" />
  </svg>
);

export default function OverlayUI() {
  return (
    <div className="relative w-full pointer-events-none overflow-hidden">
      
      {/* Animated Decorative Ambient Glows */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
         <FloatingOrb className="top-[0%] left-[-10%] w-[50%] h-[50%] bg-cyan-200/40" duration={18} yOffset={80} />
         <FloatingOrb className="top-[40%] right-[-10%] w-[40%] h-[60%] bg-fuchsia-200/30" delay={2} duration={22} yOffset={-60} />
         <FloatingOrb className="bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-yellow-200/30" delay={5} duration={15} yOffset={50} />
         
         {/* Fine Ink Spray Patterns */}
         <FineSplatter className="top-[10%] left-[5%] w-32 h-32 opacity-70 rotate-45" />
         <FineSplatter className="top-[40%] right-[5%] w-40 h-40 opacity-60 -rotate-12" />
         <FineSplatter className="bottom-[20%] left-[10%] w-48 h-48 opacity-75 rotate-90" />
         <FineSplatter className="top-[70%] right-[15%] w-24 h-24 opacity-50 rotate-180" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="min-h-[100vh] w-full flex flex-col items-center justify-center px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-center pointer-events-auto relative flex flex-col items-center w-full max-w-5xl"
          >
            <div className="absolute inset-0 bg-white/60 blur-3xl -z-10 rounded-full" />
            
            <motion.div variants={fadeInUp} className="w-full flex justify-center">
              <img 
                src={coverPhoto} 
                alt="InkPrinta Custom Printing" 
                className="w-[90%] sm:max-w-md md:max-w-xl object-contain mix-blend-multiply drop-shadow-xl"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section - Glossy Interactive Cards */}
        <section id="services" className="min-h-[150vh] w-full flex flex-col justify-center px-6 sm:px-12 md:px-24">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="max-w-6xl mx-auto w-full flex flex-col pointer-events-auto relative z-10"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/50 blur-3xl -z-10 rounded-full" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Bulk Orders', desc: 'Seamlessly scale your merch with deep discounts on massive orders.', color: 'hover:shadow-[#00aeef]/30' },
                { title: '1-on-1 Design', desc: 'Work directly with our design experts to bring your vision to life.', color: 'hover:shadow-[#ec008c]/30' },
                { title: 'Next-Day Delivery', desc: 'Lightning fast turnaround options when you need your threads tomorrow.', color: 'hover:shadow-[#fff200]/40' },
                { title: 'Eco Inks', desc: 'Sustainable, water-based printing that looks vibrant and protects the planet.', color: 'hover:shadow-[#00aeef]/30' },
                { title: 'Premium Fabric', desc: 'Ethically sourced, ultra-soft garments tailored for incredible print retention.', color: 'hover:shadow-[#ec008c]/30' },
                { title: 'Global Shipping', desc: 'We ship your custom threads anywhere in the world, securely and quickly.', color: 'hover:shadow-[#fff200]/40' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] ${feature.color} transition-all duration-300 cursor-pointer group`}
                >
                  {/* Glossy sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12 z-0" />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-950 mb-3 tracking-tighter uppercase">{feature.title}</h3>
                    <p className="text-slate-600 font-bold leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Details Section (100vh) */}
        <section id="details" className="min-h-[100vh] w-full flex flex-col justify-center items-end px-6 sm:px-12 md:px-24">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="max-w-2xl w-full text-right pointer-events-auto relative"
          >
            <div className="absolute -right-[10%] top-[10%] w-[80%] h-[80%] bg-white/80 blur-3xl -z-10 rounded-full" />
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-none"
              style={{ fontFamily: 'Impact, sans-serif' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aeef] to-[#ec008c]">The Perfect</span> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec008c] to-[#fff200]">Canvas</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl leading-relaxed text-slate-800 font-bold"
            >
              Our premium shirts are tailored for the best possible print retention. Ethically sourced, ultra-soft, and made to last. Experience apparel that speaks volumes before you even say a word.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="relative overflow-hidden px-10 py-5 bg-black text-white font-black uppercase tracking-widest transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(236,0,140,0.6)] group rounded-xl"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12" />
                 Explore Catalog
               </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <section className="w-full pointer-events-auto mt-24">
          <div className="w-full bg-white text-black border-t-8 border-black pt-16 pb-12 px-6 sm:px-12 md:px-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fff200] opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <motion.footer 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="w-full flex flex-col md:flex-row justify-between items-center gap-10 relative z-10"
            >
              <div className="flex flex-col gap-3 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <CMYKLogo className="w-8 h-8 scale-75 origin-left" />
                  <span className="text-3xl font-black tracking-tighter uppercase text-black" style={{ fontFamily: 'Impact, sans-serif' }}>
                    INKPRINTA
                  </span>
                </div>
                <span className="text-slate-600 font-bold text-sm uppercase tracking-wider">
                  &copy; 2026 InkPrinta. Premium Custom Apparel.
                </span>
              </div>
              <div className="flex gap-8 text-black uppercase tracking-widest text-sm font-black">
                 <a href="#" className="hover:text-[#ec008c] transition-colors">Instagram</a>
                 <a href="#" className="hover:text-[#00aeef] transition-colors">Twitter</a>
                 <a href="#" className="hover:text-[#fff200] transition-colors">Facebook</a>
              </div>
            </motion.footer>
          </div>
        </section>
      </div>

    </div>
  );
}
