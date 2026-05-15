import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Network, Globe2 } from 'lucide-react';

export function About() {
  const { t } = useLanguage();

  return (
    <div id="tentang-section" className="w-full py-16 md:py-24 relative overflow-hidden bg-black/20 border-t border-white/5">
      <div className="absolute inset-0 bg-cyber-grid-dense opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 md:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase">
              <Network className="w-4 h-4" />
              <span>VERIQ.ID _INTELLIGENCE //</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {t.about.title}
            </h2>
            
            <p className="text-sm md:text-lg text-slate-400 leading-relaxed font-medium">
              {t.about.desc}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
              <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <Globe2 className="w-5 h-5 md:w-6 md:h-6 text-blue-400 mb-3 md:mb-4" />
                <h4 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-widest mb-2">{t.about.missionTitle}</h4>
                <p className="text-[13px] md:text-[14px] font-medium leading-relaxed tracking-wide text-slate-400">{t.about.missionDesc}</p>
              </div>
              <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <Network className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 mb-3 md:mb-4" />
                <h4 className="text-[12px] md:text-[13px] font-bold text-white uppercase tracking-widest mb-2">{t.about.visionTitle}</h4>
                <p className="text-[13px] md:text-[14px] font-medium leading-relaxed tracking-wide text-slate-400">{t.about.visionDesc}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative h-full min-h-[350px] md:min-h-[400px] lg:min-h-[500px] rounded-[32px] md:rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 to-indigo-900/10 overflow-hidden flex items-center justify-center p-8 md:p-12 shadow-[0_0_40px_rgba(34,211,238,0.05)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-cyber-grid-dense opacity-20"></div>
            
            {/* Abstract visual representing network and protection */}
            <div className="relative w-full aspect-square max-w-[340px]">
              <div className="absolute inset-0 border-[2px] border-dashed border-cyan-400/30 rounded-full animate-[spin_20s_linear_infinite] shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
              <div className="absolute inset-6 border-[3px] border-dotted border-blue-400/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center animate-[spin_25s_linear_infinite]">
                 <div className="absolute top-[-10px] w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center animate-[spin_35s_linear_infinite_reverse]">
                 <div className="absolute bottom-[-6px] w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="absolute inset-14 border border-indigo-400/20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 shadow-[inner_0_0_30px_rgba(34,211,238,0.1)]">
                 <div className="relative flex items-center justify-center">
                   <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse-glow"></div>
                   <div className="text-cyan-400 font-mono text-sm uppercase tracking-[0.4em] font-bold text-center z-20">
                     <span className="block mb-1 text-[10px] text-indigo-400 opacity-70">STATUS_</span>
                     ACTIVE
                   </div>
                 </div>
              </div>
              
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
              <div className="absolute top-0 left-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-400/60 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
