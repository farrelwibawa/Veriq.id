import React from 'react';

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/5 bg-black/20 backdrop-blur-md mt-auto w-full">
      <div className="mx-auto max-w-[1600px] w-full px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest md:tracking-[0.3em] text-slate-500 font-bold gap-4 md:gap-0 text-center md:text-left">
        <div className="uppercase leading-loose md:leading-normal">© {new Date().getFullYear()} <span className="normal-case tracking-normal">Veriq.id</span> LABS — KEAMANAN MASA DEPAN</div>
        <div className="flex gap-4 md:gap-8 flex-wrap justify-center uppercase">
          <a href="#" className="hover:text-cyan-400 transition-colors">Syarat Layanan</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Privasi</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Status Sistem</a>
        </div>
      </div>
    </footer>
  );
}
