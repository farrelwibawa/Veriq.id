import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda-section');

  useEffect(() => {
    let timeoutId: number;
    const handleScroll = () => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      
      timeoutId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        
        // Calculate active section based on scroll position
        const sections = ['beranda-section', 'scanner-section', 'radar-section', 'edukasi-section', 'tentang-section'];
        let current = sections[0];
        
        // If we are at the bottom of the page (within 50px), force the last section
        if (window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 50) {
          current = sections[sections.length - 1];
        } else {
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Wait until the section's top is at least 40% down from the top of the viewport
              if (rect.top <= window.innerHeight * 0.4) {
                current = section;
              }
            }
          }
        }
        
        setActiveSection(current);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) window.cancelAnimationFrame(timeoutId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'tentang-section') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 100, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled ? 'backdrop-blur-[30px] bg-black/60 border-white/10 py-3 md:py-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'backdrop-blur-md bg-transparent border-transparent py-5 md:py-8'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 grid grid-cols-2 lg:grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-2.5 md:gap-3 cursor-pointer group" onClick={() => scrollToSection('beranda-section')}>
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-4 h-4 md:w-5 md:h-5 border-[2px] md:border-[2.5px] border-white rotate-45 flex items-center justify-center transition-transform duration-700 group-hover:rotate-[225deg]">
                  <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-cyan-50 transition-colors flex items-baseline">
                  Veriq<span className="text-cyan-400 opacity-80 text-base md:text-lg ml-0.5">.id</span>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 text-[13px] font-bold tracking-widest uppercase text-slate-400">
            <button 
              onClick={() => scrollToSection('beranda-section')} 
              className={`transition-all duration-300 relative py-2 ${activeSection === 'beranda-section' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'hover:text-cyan-300'}`}
            >
              {t.nav.home}
              {activeSection === 'beranda-section' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_cyan] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('scanner-section')} 
              className={`transition-all duration-300 relative py-2 ${activeSection === 'scanner-section' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'hover:text-cyan-300'}`}
            >
              {t.nav.analyze}
              {activeSection === 'scanner-section' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_cyan] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('radar-section')} 
              className={`transition-all duration-300 relative py-2 ${activeSection === 'radar-section' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'hover:text-cyan-300'}`}
            >
              {t.nav.radar}
              {activeSection === 'radar-section' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_cyan] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('edukasi-section')} 
              className={`transition-all duration-300 relative py-2 ${activeSection === 'edukasi-section' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'hover:text-cyan-300'}`}
            >
              {t.nav.education}
              {activeSection === 'edukasi-section' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_cyan] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('tentang-section')} 
              className={`transition-all duration-300 relative py-2 ${activeSection === 'tentang-section' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'hover:text-cyan-300'}`}
            >
              {t.nav.about}
              {activeSection === 'tentang-section' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_cyan] rounded-full" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 md:gap-4">
            <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl p-1 shadow-inner h-[38px] sm:h-[40px] w-auto backdrop-blur-md">
              <button 
                onClick={() => setLanguage('id')}
                title="Indonesia"
                className={`flex items-center justify-center h-full px-4 sm:px-5 min-w-[48px] sm:min-w-[54px] rounded-lg text-[10px] sm:text-[11px] tracking-widest font-bold transition-all duration-300 ${
                  language === 'id' ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                ID
              </button>
              <button 
                onClick={() => setLanguage('en')}
                title="English"
                className={`flex items-center justify-center h-full px-4 sm:px-5 min-w-[48px] sm:min-w-[54px] rounded-lg text-[10px] sm:text-[11px] tracking-widest font-bold transition-all duration-300 ${
                  language === 'en' ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                EN
              </button>
            </div>
            
            <button 
              className="lg:hidden text-white hover:text-cyan-400 transition-colors w-11 h-11 flex items-center justify-center rounded-lg active:bg-white/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
                <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl pt-24 pb-8 px-6 flex flex-col lg:hidden overflow-y-auto overflow-x-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-start gap-2 text-[22px] sm:text-2xl font-semibold tracking-tight text-slate-300 w-full mt-4 pb-12"
            >
              <button 
                onClick={() => scrollToSection('beranda-section')} 
                className={`transition-colors w-full text-left py-4 border-b border-white/5 flex items-center justify-between ${activeSection === 'beranda-section' ? 'text-white' : 'hover:text-cyan-400'}`}
              >
                {t.nav.home}
                {activeSection === 'beranda-section' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />}
              </button>
              <button 
                onClick={() => scrollToSection('scanner-section')} 
                className={`transition-colors w-full text-left py-4 border-b border-white/5 flex items-center justify-between ${activeSection === 'scanner-section' ? 'text-white' : 'hover:text-cyan-400'}`}
              >
                {t.nav.analyze}
                {activeSection === 'scanner-section' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />}
              </button>
              <button 
                onClick={() => scrollToSection('radar-section')} 
                className={`transition-colors w-full text-left py-4 border-b border-white/5 flex items-center justify-between ${activeSection === 'radar-section' ? 'text-white' : 'hover:text-cyan-400'}`}
              >
                {t.nav.radar}
                {activeSection === 'radar-section' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />}
              </button>
              <button 
                onClick={() => scrollToSection('edukasi-section')} 
                className={`transition-colors w-full text-left py-4 border-b border-white/5 flex items-center justify-between ${activeSection === 'edukasi-section' ? 'text-white' : 'hover:text-cyan-400'}`}
              >
                {t.nav.education}
                {activeSection === 'edukasi-section' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />}
              </button>
              <button 
                onClick={() => scrollToSection('tentang-section')} 
                className={`transition-colors w-full text-left py-4 flex items-center justify-between ${activeSection === 'tentang-section' ? 'text-white' : 'hover:text-cyan-400'}`}
              >
                {t.nav.about}
                {activeSection === 'tentang-section' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
