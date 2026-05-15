import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldAlert, AlertTriangle, Target, BrainCircuit, ChevronDown, Radio, Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CASES = {
  id: [
    {
      id: 'fake-hr',
      title: 'Fake HR / Rekrutmen BUMN Palsu',
      description: 'Penipu mengatasnamakan perusahaan besar (seperti BUMN/Pertamina) lalu meminta transfer uang dengan alasan biaya akomodasi tiket atau penginapan sebelum interview dimulai.',
      risk: 'HIGH',
      target: 'Pencari kerja & Fresh graduate',
      patterns: ['Fake Authority', 'Financial Pressure', 'Urgency Tactic']
    },
    { id: 'paket-palsu',
      title: 'Pemberitahuan Paket / APK Kurir',
      description: 'Pelaku mengirimkan pesan berisi resi paket atau foto bukti pengiriman dalam format aplikasi APK bodong untuk mencuri data SMS/OTP (sniffing).',
      risk: 'HIGH',
      target: 'Pembeli online',
      patterns: ['Curiosity Gap', 'Malware Phishing']
    },
    {
      id: 'otp-scam',
      title: 'OTP Scam & Salah Kirim Pulsa',
      description: 'Penipu mengirim pesan mengklaim ada kesalahan transfer atau login dan meminta kode rahasia 6 angka yang masuk via SMS. Mereka berpura-pura panik atau mendesak.',
      risk: 'HIGH',
      target: 'Pengguna akun digital / Bank',
      patterns: ['Emotional Manipulation', 'Urgency Pressure']
    },
    {
      id: 'giveaway',
      title: 'Undian Berhadiah Palsu',
      description: 'Modus pesan WhatsApp atau pop-up yang mengabarkan pengguna memenangkan hadiah ratusan juta rupiah dari bank, e-commerce, atau pemerintah dan harus segera verifikasi identitas.',
      risk: 'MEDIUM',
      target: 'Semua pengguna internet',
      patterns: ['Greed Exploitation', 'Fake Credibility', 'Time Limit']
    },
    {
      id: 'verifikasi-rekening',
      title: 'Pemblokiran Rekening',
      description: 'Nomor tidak dikenal menyamar sebagai nomor resmi bank (namun menggunakan nomor HP biasa) yang menginformasikan bahwa rekening akan diblokir kecuali menekan link tertentu.',
      risk: 'HIGH',
      target: 'Nasabah bank lokal',
      patterns: ['Fear Trigger', 'Spoofed Identity']
    },
    {
      id: 'fake-cs',
      title: 'Customer Service Palsu',
      description: 'Akun bot atau nomor palsu meniru CS resmi di platform sosial media, terutama saat pengguna mengeluhkan layanan, untuk meminta data kredensial atau transfer uang.',
      risk: 'MEDIUM',
      target: 'Orang yang sedang panik / butuh bantuan',
      patterns: ['Impersonation', 'False Sympathy']
    }
  ],
  en: [
    {
      id: 'fake-hr',
      title: 'Fake HR / Bogus Recruitment',
      description: 'Scammers masquerading as major corporations ask for an upfront transfer of funds, claiming it is for flight and accommodation fees before a job interview.',
      risk: 'HIGH',
      target: 'Job seekers & Fresh graduates',
      patterns: ['Fake Authority', 'Financial Pressure', 'Urgency Tactic']
    },
    {
      id: 'paket-palsu',
      title: 'Delivery Malicious APK',
      description: 'Attackers send messages acting as delivery couriers with an attached tracking receipt in a malicious APK format to steal SMS/OTP data (sniffing).',
      risk: 'HIGH',
      target: 'Online shoppers',
      patterns: ['Curiosity Gap', 'Malware Phishing']
    },
    {
      id: 'otp-scam',
      title: 'OTP / Verification Scam',
      description: 'Fraudsters claim an accidental money or credit transfer occurred and ask the victim to forward the 6-digit verification code sent to their phone via SMS.',
      risk: 'HIGH',
      target: 'Digital banking / App users',
      patterns: ['Emotional Manipulation', 'Urgency Pressure']
    },
    {
      id: 'giveaway',
      title: 'Fake Giveaway',
      description: 'WhatsApp messages or pop-ups claiming the user has won millions from a bank or government agency, urging immediate identity verification to claim the prize.',
      risk: 'MEDIUM',
      target: 'General internet users',
      patterns: ['Greed Exploitation', 'Fake Credibility', 'Time Limit']
    },
    {
      id: 'verifikasi-rekening',
      title: 'Account Block Threat',
      description: 'An unknown number posing as an official bank warns that the users account will be permanently blocked unless they click a specific link immediately.',
      risk: 'HIGH',
      target: 'Local bank customers',
      patterns: ['Fear Trigger', 'Spoofed Identity']
    },
    {
      id: 'fake-cs',
      title: 'Imposter Customer Service',
      description: 'Fake accounts mimicking official customer support actively reach out to users complaining on social media, aiming to steal credentials or ask for transfers.',
      risk: 'MEDIUM',
      target: 'Panicked or frustrated clients',
      patterns: ['Impersonation', 'False Sympathy']
    }
  ]
};

const getRiskColor = (risk: string) => {
  if (risk === 'HIGH') return 'from-red-500/20 to-rose-600/10 border-red-500/30 text-red-400 group-hover:border-red-500/50 glow-red';
  if (risk === 'MEDIUM') return 'from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400 group-hover:border-amber-500/50 glow-amber';
  return 'from-green-500/20 to-emerald-600/10 border-green-500/30 text-green-400 group-hover:border-green-500/50 glow-green';
};

const getRiskBadgeColor = (risk: string) => {
  if (risk === 'HIGH') return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (risk === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-green-500/10 text-green-400 border-green-500/20';
};

export function ScamFeed() {
  const { language } = useLanguage();
  const cases = CASES[language];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="radar-section" className="w-full relative py-16 md:py-24 bg-black overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
        <div className="absolute inset-y-0 w-[50vw] left-0 bg-gradient-to-r from-red-900/10 to-transparent blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="flex flex-col items-center mb-10 md:mb-16 text-center space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-red-400 text-[10px] font-bold tracking-[0.2em] uppercase">VERIQ CYBER INTEL FEED • LIVE</span>
          </div>
          <h2 className="text-[32px] sm:text-4xl md:text-5xl font-black tracking-tight text-white flex flex-wrap items-center justify-center gap-2 md:gap-3 pb-2 leading-tight">
            {language === 'id' ? (
              <>Radar Ancaman <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 pb-1">Digital</span></>
            ) : (
              <>Veriq Threat <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 pb-1">Radar</span></>
            )}
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-2xl px-2 leading-relaxed">
            {language === 'id' 
              ? 'Memonitor aktivitas manipulasi digital dan scam terbaru secara real-time yang dideteksi oleh sistem intelijen Veriq.id.'
              : 'Monitoring the latest digital manipulation schemes and scams in real-time detected by Veriq.id intelligence system.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          {cases.map((scam, i) => {
            const isExpanded = expandedId === scam.id;
            return (
              <motion.div
                key={scam.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, layout: { duration: 0.3 } }}
                onClick={() => toggleExpand(scam.id)}
                className={`group relative flex flex-col rounded-[24px] bg-gradient-to-br ${getRiskColor(scam.risk)} border overflow-hidden cursor-pointer transition-colors duration-300 hover:shadow-2xl bg-black/60 backdrop-blur-xl`}
              >
                {/* Cyber Scanline Effect */}
                <div className="absolute top-0 left-0 right-0 h-px bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-scanline z-20"></div>

                <div className="p-5 md:p-6 relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-black/40 border border-white/5 text-white/80 group-hover:text-white transition-colors">
                      {scam.risk === 'HIGH' ? <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />}
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${getRiskBadgeColor(scam.risk)}`}>
                      {scam.risk}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                    {scam.title}
                  </h3>
                  
                  <p className={`text-xs sm:text-sm text-slate-300/80 font-medium leading-relaxed transition-all duration-300 ${isExpanded ? 'mb-4' : 'mb-5 sm:mb-6 line-clamp-2'}`}>
                    {scam.description}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 4 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden flex flex-col gap-4"
                      >
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-3 flex items-center gap-1.5">
                            <BrainCircuit className="w-3.5 h-3.5" /> Manipulation Patterns
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {scam.patterns.map((pattern, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300 font-mono shadow-inner">
                                <Flame className="w-3 h-3 text-orange-500/70" />
                                {pattern}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={`mt-auto pt-4 border-t border-white/5 flex items-center justify-between transition-all duration-300 ${isExpanded ? 'mt-6' : ''}`}>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <Target className="w-3.5 h-3.5" />
                      <span className="line-clamp-2">{scam.target}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
