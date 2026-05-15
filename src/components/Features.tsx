import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Brain, Fingerprint } from 'lucide-react';

export function Features() {
  const { t } = useLanguage();

  const icons = [
    <ShieldCheck className="w-8 h-8 text-cyan-400" />,
    <Activity className="w-8 h-8 text-blue-400" />,
    <Brain className="w-8 h-8 text-indigo-400" />,
    <Fingerprint className="w-8 h-8 text-cyan-400" />
  ];

  return (
    <div id="edukasi-section" className="w-full py-16 md:py-24 relative overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SYSTEM CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 md:mb-0">
            {t.features.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {t.features.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-700 overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,211,238,0.15)] backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full items-start">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center mb-6 sm:mb-8 shadow-inner group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:border-cyan-500/40 transition-all duration-500 shrink-0">
                  <div className="transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    {React.cloneElement(icons[index] as React.ReactElement, { className: "w-6 h-6 sm:w-8 sm:h-8 " + (icons[index] as React.ReactElement).props.className.split(' ').filter(c => !c.startsWith('w-') && !c.startsWith('h-')).join(' ') })}
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-50 transition-colors duration-300">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
