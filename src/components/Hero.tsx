import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Scan, Binary } from 'lucide-react';

export function Hero() {
  const { language } = useLanguage();

  return (
    <div className="relative w-full flex items-center justify-center pt-8 pb-16 lg:py-0 lg:min-h-[85vh] mt-4 lg:mt-12 overflow-visible">
      {/* Background Neural Effects for Hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden render-isolate gpu-accel-transform">
        <div className="absolute top-[30%] lg:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] bg-cyan-600/10 lg:bg-cyan-600/5 rounded-full blur-[80px] lg:blur-[120px] animate-pulse gpu-accel-transform"></div>
        <div className="absolute top-1/4 right-[5%] lg:right-[10%] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] bg-indigo-600/15 lg:bg-indigo-600/10 rounded-full blur-[60px] lg:blur-[100px] animate-pulse gpu-accel-transform" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 2xl:gap-16">
        
        {/* LEFT SIDE: Cinematic Copy */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 relative z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[34px] sm:text-5xl lg:text-7xl xl:text-[84px] leading-[1.15] sm:leading-tight lg:leading-[1.05] font-black tracking-tight text-white max-w-3xl"
          >
            <span className="block mb-1 sm:mb-2 text-slate-300">
              {language === 'id' ? 'Jangan mudah' : 'Do not easily'}
            </span>
            <span className="block mb-1 sm:mb-2 relative pb-1">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-indigo-400 animate-pulse drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]">
                {language === 'id' ? 'percaya,' : 'trust,'}
              </span>
              <span className="absolute inset-0 z-0 bg-clip-text text-transparent bg-gradient-to-r from-red-500/30 to-indigo-500/30 font-black blur-md lg:blur-xl animate-pulse">
                {language === 'id' ? 'percaya,' : 'trust,'}
              </span>
            </span>
            <span className="block text-white leading-tight mt-0.5">
              {language === 'id' ? 'biarkan Veriq memverifikasi.' : 'let Veriq verify it.'}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15px] sm:text-lg lg:text-xl text-slate-400 max-w-2xl leading-relaxed font-medium"
          >
            {language === 'id' 
              ? 'Lebih dari sekadar deteksi. Kami menganalisis psikologi di balik pesan penipuan secara real-time dan mengungkap manipulasi sebelum Anda bertindak.' 
              : 'Beyond detection. We analyze the psychology behind scams in real-time and uncover manipulation before you take action.'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 w-full pt-2 lg:pt-4"
          >
            <button
              onClick={() => {
                const element = document.getElementById('scanner-section');
                if (element) {
                  const top = element.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({ top: top - 80, behavior: 'smooth' });
                }
              }}
              className="group relative flex items-center justify-center h-12 lg:h-14 px-8 lg:px-10 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 text-[13px] lg:text-[14px] tracking-wider uppercase">
                <Scan className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-90 transition-transform duration-500" />
                {language === 'id' ? 'Mulai Pemindaian' : 'Start Scan'}
              </span>
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('VERIQ_RUN_DEMO'))}
              className="group relative flex items-center justify-center h-12 lg:h-14 px-8 lg:px-10 bg-white/[0.03] border border-white/10 text-white font-bold rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-md w-full sm:w-auto gap-2 text-[13px] lg:text-[14px] uppercase tracking-wider"
            >
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-400 group-hover:animate-pulse" />
              Live Demo
            </button>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Interactive Cyber Intelligence UI */}
        <div className="w-full lg:w-[45%] flex items-center justify-center perspective-1000 mt-8 lg:mt-0">
          
          <div className="relative w-full max-w-[500px]">
            {/* Main Holographic Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/3.5] sm:aspect-[4/3] lg:h-[450px] lg:aspect-auto rounded-[16px] lg:rounded-[24px] bg-black/40 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(8,145,178,0.2)] lg:shadow-[0_0_50px_rgba(8,145,178,0.2)] overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
              
              {/* Neural Grid Background */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>

              {/* UI Header */}
              <div className="absolute top-0 left-0 w-full p-2 lg:p-4 border-b border-cyan-500/20 bg-black/60 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5 lg:gap-2 text-cyan-400">
                  <ShieldCheck className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-[8px] lg:text-[10px] font-mono uppercase tracking-widest">Live Feed Analysis</span>
                </div>
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span className="text-[8px] lg:text-[10px] font-mono text-cyan-500">SYS_ONLINE</span>
                </div>
              </div>

              {/* Suspicious Image Scan Container */}
              <div className="absolute top-10 lg:top-16 left-3 lg:left-6 right-3 lg:right-6 bottom-3 lg:bottom-6 flex flex-col justify-center z-20 perspective-1000">
                
                <div className="text-[8px] lg:text-[10px] uppercase font-mono text-slate-400 mb-2 lg:mb-3 tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Binary className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-cyan-400" /> <span className="hidden sm:inline">Image Scan</span> Active
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-red-400 font-bold truncate">THREAT FOUND</span>
                  </div>
                </div>

                {/* The "Uploaded Screenshot" UI */}
                <div className="relative w-full h-[180px] sm:h-[220px] lg:h-[320px] rounded-lg lg:rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl relative">
                  
                  {/* Fake Image OS Header */}
                  <div className="bg-slate-800/90 h-6 lg:h-8 flex items-center justify-between px-2 lg:px-3 relative z-10 border-b border-slate-700/50">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-red-500/80"></div>
                      <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-[7px] lg:text-[9px] font-mono text-slate-500 tracking-wider">screenshot_wa_04.jpg</div>
                    <div className="w-8 lg:w-10"></div>
                  </div>

                  {/* Fake WhatsApp Message Content */}
                  <div className="p-2 lg:p-4 bg-slate-950 h-full w-full relative">
                    {/* Subtle noise/grid under image */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    
                    {/* The message bubble */}
                    <div className="relative z-10 bg-[#1e293b] p-2.5 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl rounded-tl-sm border border-slate-700/50 w-[96%] lg:w-[90%] shadow-lg">
                      <div className="font-semibold text-orange-400 text-[10px] lg:text-xs mb-1.5 flex items-center gap-1.5">
                        +62 812-9988-7766
                        <div className="bg-slate-700 text-slate-300 text-[6px] lg:text-[8px] px-1 lg:px-1.5 rounded-sm">Unsaved</div>
                      </div>
                      <p className="text-slate-300 text-[9px] sm:text-[10px] lg:text-xs leading-relaxed space-y-1 lg:space-y-2">
                        <span className="block">PENGUMUMAN RESMI HRD<br/>Selamat! Nomor Anda terpilih untuk bekerja paruh waktu.</span>
                        <span className="block">Gaji harian Rp 500.000 - Rp 2.000.000.</span>
                        <span className="block line-clamp-3 lg:line-clamp-none">Hubungi admin kami sekarang untuk klaim posisi:<br/>
                          <span className="text-blue-400 underline decoration-blue-400/30 break-all">https://bit.ly/admin-loker-resmi-2024</span>
                        </span>
                      </p>

                      {/* --- DYNAMIC AI BOUNDING BOXES --- */}
                      
                      {/* Box 1: Fake Authority */}
                      <motion.div 
                        className="absolute top-1.5 lg:top-2 left-1.5 lg:left-2 w-[120px] lg:w-[160px] h-4 lg:h-5 border border-red-500 bg-red-500/15 rounded z-20"
                        animate={{ opacity: [0, 0, 1, 1, 0] }}
                        transition={{ duration: 4, times: [0, 0.1, 0.15, 0.4, 1], repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-3 lg:-top-4 left-0 text-[5px] lg:text-[7px] font-mono bg-red-500 text-white px-1 lg:px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                          [!] FAKE AUTHORITY
                        </div>
                      </motion.div>

                      {/* Box 2: Urgency / Unrealistic Offer */}
                      <motion.div 
                        className="absolute top-6 lg:top-10 left-1.5 lg:left-2 right-2 lg:right-4 h-7 lg:h-9 border border-amber-500 bg-amber-500/15 rounded z-20"
                        animate={{ opacity: [0, 0, 1, 1, 0] }}
                        transition={{ duration: 4, times: [0, 0.3, 0.35, 0.6, 1], repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-3 lg:-top-4 left-0 text-[5px] lg:text-[7px] font-mono bg-amber-500 text-black font-bold px-1 lg:px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                          [VAR] UNREALISTIC OFFER
                        </div>
                      </motion.div>

                      {/* Box 3: Phishing URL */}
                      <motion.div 
                        className="absolute bottom-1.5 lg:bottom-2 left-1.5 lg:left-2 right-2 lg:right-4 h-4 lg:h-5 border border-fuchsia-500 bg-fuchsia-500/15 rounded z-20"
                        animate={{ opacity: [0, 0, 1, 1, 0] }}
                        transition={{ duration: 4, times: [0, 0.65, 0.7, 0.9, 1], repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -bottom-3 lg:-bottom-4 right-0 text-[5px] lg:text-[7px] font-mono bg-fuchsia-500 text-white px-1 lg:px-1.5 py-0.5 rounded-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                          [CRITICAL] PHISHING LINK
                        </div>
                      </motion.div>

                    </div>

                  </div>

                  {/* Animated Image Scanline */}
                  <motion.div 
                    className="absolute left-0 right-0 h-[1.5px] lg:h-[2px] bg-cyan-400 z-30 shadow-[0_0_15px_rgba(34,211,238,1)] pointer-events-none"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  >
                    {/* Heatmap trail behind the scanline */}
                    <div className="absolute bottom-0 left-0 w-full h-[40px] lg:h-[80px] bg-gradient-to-t from-cyan-500/30 to-transparent pointer-events-none"></div>
                  </motion.div>

                </div>
              </div>
            </motion.div>

            {/* Floating Trust Meter Widget */}
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="absolute -right-2 sm:-right-8 lg:-right-10 top-[15%] sm:top-[20%] lg:top-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 rounded-full bg-black/60 border border-red-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.15)] lg:shadow-[0_0_40px_rgba(239,68,68,0.15)] flex flex-col items-center justify-center z-30"
            >
              <div className="absolute inset-0 rounded-full border-r-2 border-t-2 border-red-500 animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute inset-1.5 lg:inset-2 rounded-full border-l-2 border-b-2 border-red-500/30 animate-[spin_6s_linear_infinite_reverse]"></div>
              
              <span className="text-xl lg:text-3xl font-black text-red-500 leading-none mb-0.5 lg:mb-1">98%</span>
              <span className="text-[6px] lg:text-[9px] uppercase font-mono tracking-widest text-red-400">Risk Level</span>
            </motion.div>
            
            {/* Decorative Corner Cyber Elements */}
            <div className="absolute top-0 -left-1 lg:-top-4 lg:-left-4 w-6 h-6 lg:w-8 lg:h-8 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-lg z-0"></div>
            <div className="absolute bottom-0 -right-1 lg:-bottom-4 lg:-right-4 w-6 h-6 lg:w-8 lg:h-8 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg z-0"></div>

          </div>
        </div>
      </div>
    </div>
  );
}
