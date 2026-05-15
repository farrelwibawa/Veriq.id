/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Scanner } from './components/Scanner';
import { ScamFeed } from './components/ScamFeed';
import { Features } from './components/Features';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

const BackgroundAtmosphere = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden render-isolate gpu-accel-transform">
      {/* Base Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#040f29] to-[#020617]"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 70%)'}}></div>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]">
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none"></div>
      </div>
      
      {/* Cinematic Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse gpu-accel-transform"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse glow-cyan gpu-accel-transform" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] gpu-accel"
            initial={{ 
              opacity: Math.random() * 0.5 + 0.1, 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
            }}
            animate={{ 
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              opacity: [null, Math.random() * 0.8 + 0.2, Math.random() * 0.5 + 0.1]
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity, 
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default function App() {
  return (
    <LanguageProvider>
      <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
        <BackgroundAtmosphere />
        <Navbar />
        <main className="relative z-10 flex-1 w-full mx-auto flex flex-col pt-20 md:pt-32">
          <section id="beranda-section" className="w-full flex items-center justify-center min-h-[85vh] pb-8 md:pb-16">
            <Hero />
          </section>
          
          <section id="scanner-section" className="w-full min-h-[90vh] flex items-center justify-center py-16 md:py-24 border-t border-white/5 bg-black/20">
            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  Scanner Module
                </div>
                <h2 className="text-[32px] sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 leading-tight">Neural Analysis Scanner</h2>
              </motion.div>
              <Scanner />
            </div>
          </section>
          
          <ScamFeed />
          <Features />
          <About />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
