import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeText, analyzeImage, AnalysisResult } from '../services/ai';
import { VeraChat } from './VeraChat';
import { ShieldAlert, ShieldCheck, AlertTriangle, ScanLine, Loader2, ChevronRight, Activity, BrainCircuit, Flame, Timer, BadgeCheck, HeartCrack, MousePointerClick, Globe, CheckCircle2, XCircle, FileImage, UploadCloud, X, ScanFace, Sparkles } from 'lucide-react';

const PATTERN_CONFIG: Record<string, any> = {
  "Fear Trigger": { icon: Flame, color: "text-red-500", label: "Fear Trigger", glowColor: "rgba(239,68,68,0.4)" },
  "Urgency Pressure": { icon: Timer, color: "text-amber-500", label: "Urgency Pressure", glowColor: "rgba(245,158,11,0.4)" },
  "Fake Authority": { icon: BadgeCheck, color: "text-blue-500", label: "Fake Authority", glowColor: "rgba(59,130,246,0.4)" },
  "Emotional Manipulation": { icon: HeartCrack, color: "text-purple-500", label: "Emotional Manipulation", glowColor: "rgba(168,85,247,0.4)" },
  "Forced Action Pattern": { icon: MousePointerClick, color: "text-cyan-500", label: "Forced Action Pattern", glowColor: "rgba(6,182,212,0.4)" }
};

const ScanningProgressValue = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 5 + 1;
      if (current > 98) current = 98;
      setValue(Math.floor(current));
    }, 150);
    return () => clearInterval(interval);
  }, []);
  return <>{value}%</>;
};

export function Scanner() {
  const { language, t } = useLanguage();
  const [scanMode, setScanMode] = useState<'text' | 'image'>('text');
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanningRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isScanning) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % t.analysis.analyzing.length);
      }, 2000);
      
      // Auto-scroll to the scanning section when it starts
      setTimeout(() => {
        const inputArea = document.getElementById('analysis-input-area');
        if (inputArea) {
          const top = inputArea.getBoundingClientRect().top + window.scrollY;
          const navHeight = window.innerWidth < 768 ? 90 : 110;
          window.scrollTo({ top: top - navHeight, behavior: 'smooth' });
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isScanning, t.analysis.analyzing.length]);

  useEffect(() => {
    const handleDemo = () => {
      const demoText = language === 'id' 
        ? "SELAMAT! Nomor WhatsApp Anda terpilih mendapatkan subsidi Rp 100.000.000 dari Pemerintah. Segera klik link berikut untuk verifikasi pencairan dana Anda: http://google-security-login.com/klaim. Harap selesaikan dalam 10 menit atau hangus!"
        : "CONGRATULATIONS! Your WhatsApp number has been selected to receive a $10,000 government subsidy. Click the following link immediately to verify your fund disbursement: http://google-security-login.com/claim. Please complete within 10 minutes or it will be forfeited!";
      
      setInput(demoText);
      
      // Scroll to scanner
      const element = document.getElementById('scanner-section');
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 100, behavior: 'smooth' });
      }
      
      // Auto analyze after a short delay to let scroll happen
      setTimeout(() => {
        executeAnalysis(demoText);
      }, 800);
    };

    window.addEventListener('VERIQ_RUN_DEMO', handleDemo);
    return () => window.removeEventListener('VERIQ_RUN_DEMO', handleDemo);
  }, [language]);

  const lastLanguage = useRef(language);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && !isScanning && resultRef.current) {
      setTimeout(() => {
        const element = resultRef.current;
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY;
          const navHeight = window.innerWidth < 768 ? 90 : 110; // nav height + a little breathing room
          window.scrollTo({ top: top - navHeight, behavior: 'smooth' });
        }
      }, 600); // Wait for exit animations to complete so layout is perfectly stable
    }
  }, [result, isScanning]);

  useEffect(() => {
    if (lastLanguage.current !== language) {
      lastLanguage.current = language;
      if (result && !isScanning && input.trim()) {
        executeAnalysis(input);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const executeAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) {
      setError(t.error.empty);
      return;
    }
    setError(null);
    setIsScanning(true);
    setResult(null);
    setLoadingTextIndex(0);

    try {
      const res = await analyzeText(textToAnalyze, language);
      setResult(res);
    } catch (err: any) {
      console.error("Analysis execution error:", err);
      if (err instanceof Error && err.message === "QUOTA_EXCEEDED") {
        setError((t.error as any).quota || "System is busy or quota exceeded. Please try again later.");
      } else {
        setError(t.error.failed);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const executeImageAnalysis = async () => {
    if (!selectedImage) {
      setError((t.error as any).noImage || "Please select an image to analyze.");
      return;
    }
    setError(null);
    setIsScanning(true);
    setResult(null);
    setLoadingTextIndex(0);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Extract base64 part
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(selectedImage);
      const base64Data = await base64Promise;

      const res = await analyzeImage(base64Data, selectedImage.type || 'image/jpeg', language);
      setResult(res);
    } catch (err: any) {
      console.error("Image analysis execution error:", err);
      if (err instanceof Error && err.message === "QUOTA_EXCEEDED") {
        setError((t.error as any).quota || "System is busy or quota exceeded. Please try again later.");
      } else {
        setError(t.error.failed);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError((t.error as any).invalidImage || "Please upload an image file (PNG, JPG, etc).");
      return;
    }
    setSelectedImage(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setError(null);
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleInstantDemo = (type: 'giveaway' | 'fake_hr' | 'phishing' | 'safe') => {
    let demoText = '';
    if (language === 'id') {
      if (type === 'giveaway') demoText = "SELAMAT! Nomor WhatsApp Anda terpilih mendapatkan subsidi Rp 100.000.000 dari Pemerintah. Segera klik link berikut untuk verifikasi pencairan dana Anda: http://google-security-login.com/klaim. Harap selesaikan dalam 10 menit atau hangus!";
      if (type === 'fake_hr') demoText = "Panggilan Interview! Anda dinyatakan lolos seleksi PT Pertamina. Mohon segera transfer biaya akomodasi tiket pesawat sebesar Rp 2.500.000 ke rekening bendahara HRD kami. Biaya akan diganti setelah tiba di lokasi.";
      if (type === 'phishing') demoText = "Akun Bank Anda terdeteksi melakukan transaksi mencurigakan dari perangkat baru. Untuk alasan keamanan, akun Anda akan diblokir sementara. Verifikasi identitas Anda sekarang di: http://bca-secure-update.com/login";
      if (type === 'safe') demoText = "Halo Budi, jangan lupa besok kita ada meeting jam 10 pagi di ruang rapat utama ya. Bawa dokumen laporan bulanan yang kemarin kita kerjakan. Terima kasih!";
    } else {
      if (type === 'giveaway') demoText = "CONGRATULATIONS! Your WhatsApp number has been selected to receive a $10,000 government subsidy. Click the following link immediately to verify your fund disbursement: http://google-security-login.com/claim. Please complete within 10 minutes or it will be forfeited!";
      if (type === 'fake_hr') demoText = "Interview Invitation! You have passed the selection for PT Pertamina. Please immediately transfer the flight accommodation fee of $250 to our HR treasurer's account. The fee will be reimbursed upon arrival at the location.";
      if (type === 'phishing') demoText = "Your Bank Account has been detected making a suspicious transaction from a new device. For security reasons, your account will be temporarily blocked. Verify your identity now at: http://bca-secure-update.com/login";
      if (type === 'safe') demoText = "Hi Budi, don't forget we have a meeting tomorrow at 10 AM in the main meeting room. Bring the monthly report document we worked on yesterday. Thanks!";
    }
    
    setScanMode('text');
    setInput(demoText);
    
    // Auto analyze after a short delay
    setTimeout(() => {
      executeAnalysis(demoText);
    }, 400);
  };

  const handleAnalyze = () => {
    if (scanMode === 'image') {
      executeImageAnalysis();
    } else {
      executeAnalysis(input);
    }
  };


  const getRiskColor = (level: string) => {
    if (level === 'HIGH') return 'text-red-500 border-red-500/20 bg-red-500/5';
    if (level === 'MEDIUM') return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-green-500 border-green-500/20 bg-green-500/5';
  };

  const getRiskIconColor = (level: string) => {
    if (level === 'HIGH') return 'text-red-500';
    if (level === 'MEDIUM') return 'text-amber-500';
    return 'text-green-500';
  };

  const getRiskIcon = (level: string) => {
    if (level === 'HIGH') return <ShieldAlert className={`w-8 h-8 md:w-12 md:h-12 ${getRiskIconColor(level)}`} />;
    if (level === 'MEDIUM') return <AlertTriangle className={`w-8 h-8 md:w-12 md:h-12 ${getRiskIconColor(level)}`} />;
    return <ShieldCheck className={`w-8 h-8 md:w-12 md:h-12 ${getRiskIconColor(level)}`} />;
  };

  const getRiskLabel = (level: string) => {
    if (level === 'HIGH') return t.analysis.riskHigh;
    if (level === 'MEDIUM') return t.analysis.riskMedium;
    return t.analysis.riskLow;
  };

  const getAtmosphere = () => {
    if (isScanning) return { bg: "bg-cyan-500/10", border: 'border-cyan-500/30', glow: 'shadow-[0_0_50px_rgba(34,211,238,0.15)] glow-cyan' };
    if (!result) return { bg: "bg-white/[0.03]", border: 'border-white/10', glow: 'shadow-2xl' };

    switch (result.riskLevel) {
      case 'HIGH':
        return { bg: "bg-red-950/20", border: 'border-red-500/40', glow: 'shadow-[0_0_80px_rgba(239,68,68,0.25)]' };
      case 'MEDIUM':
        return { bg: "bg-amber-950/20", border: 'border-amber-500/30', glow: 'shadow-[0_0_60px_rgba(245,158,11,0.2)]' };
      case 'LOW':
        return { bg: "bg-cyan-950/20", border: 'border-cyan-500/20', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.1)]' };
      default:
        return { bg: "bg-white/[0.03]", border: 'border-white/10', glow: 'shadow-2xl' };
    }
  };

  const atmosphere = getAtmosphere();

  return (
    <div className="w-full relative flex items-center justify-center transition-all duration-1000">
      <div className={`absolute -top-10 -right-10 w-48 h-48 blur-[80px] z-0 pointer-events-none transition-colors duration-1000 ${
        result?.riskLevel === 'HIGH' ? 'bg-red-500/40' : 
        result?.riskLevel === 'MEDIUM' ? 'bg-amber-500/30' : 
        result?.riskLevel === 'LOW' ? 'bg-cyan-500/20' : 
        isScanning ? 'bg-cyan-500/40' : 'bg-cyan-500/10'
      }`}></div>
      <div className={`absolute -bottom-10 -left-10 w-48 h-48 blur-[80px] z-0 pointer-events-none transition-colors duration-1000 ${
        result?.riskLevel === 'HIGH' ? 'bg-red-700/30' : 
        result?.riskLevel === 'MEDIUM' ? 'bg-amber-700/20' : 
        result?.riskLevel === 'LOW' ? 'bg-blue-600/10' : 
        isScanning ? 'bg-blue-600/30' : 'bg-transparent'
      }`}></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full backdrop-blur-3xl border rounded-[40px] p-6 sm:p-8 relative overflow-hidden z-10 transition-all duration-1000 ${atmosphere.bg} ${atmosphere.border} ${atmosphere.glow}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 pointer-events-none opacity-50 ${
          result?.riskLevel === 'HIGH' ? 'from-red-500/10 to-transparent' :
          result?.riskLevel === 'MEDIUM' ? 'from-amber-500/10 to-transparent' :
          'from-cyan-500/10 to-transparent'
        }`}></div>
        
        <div className="relative z-20 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Neural Trust Node</h2>
                <div className="text-[10px] font-mono text-cyan-500/70 tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  Active Monitoring
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10 hidden sm:block">Scanner v4.0.2</div>
          </div>

          {/* Instant Demo */}
          <div className="mb-6 space-y-3">
            <div className="text-[11px] sm:text-xs text-cyan-500/70 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              Live Sandbox Simulator
            </div>
            <div className="flex flex-row overflow-x-auto gap-2 sm:gap-3 pb-2 sm:pb-0 snap-x [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              <button onClick={() => handleInstantDemo('giveaway')} disabled={isScanning} className="group flex-none relative h-10 px-5 flex items-center justify-center rounded-xl bg-white/[0.02] text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] snap-start shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="translate-y-[1px] whitespace-nowrap">Giveaway Scam</span>
              </button>
              <button onClick={() => handleInstantDemo('fake_hr')} disabled={isScanning} className="group flex-none relative h-10 px-5 flex items-center justify-center rounded-xl bg-white/[0.02] text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] snap-start shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="translate-y-[1px] whitespace-nowrap">Fake HR</span>
              </button>
              <button onClick={() => handleInstantDemo('phishing')} disabled={isScanning} className="group flex-none relative h-10 px-5 flex items-center justify-center rounded-xl bg-white/[0.02] text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] snap-start shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="translate-y-[1px] whitespace-nowrap">Phishing Link</span>
              </button>
              <button onClick={() => handleInstantDemo('safe')} disabled={isScanning} className="group flex-none relative h-10 px-5 flex items-center justify-center rounded-xl bg-white/[0.02] text-slate-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/5 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] snap-start shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="translate-y-[1px] whitespace-nowrap">Safe Message</span>
              </button>
            </div>
          </div>
          
          {/* Input Area */}
          <div id="analysis-input-area" className="flex-1 flex flex-col space-y-4">
            {isScanning && <div className="scanline" />}
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 sm:pb-2 gap-3 sm:gap-0">
                <div className="text-[11px] sm:text-[13px] text-slate-500 font-mono tracking-tighter uppercase flex items-center gap-2">
                  <span>ANALYSIS_INPUT:</span>
                </div>
                <div className="flex bg-black/40 rounded-xl p-1 sm:p-1.5 border border-white/5 relative z-20 w-full sm:w-fit shadow-inner h-[44px] sm:h-[48px]">
                  <button
                    disabled={isScanning}
                    onClick={() => setScanMode('text')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 h-full sm:min-w-[140px] rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] lg:text-[13px] font-bold uppercase tracking-widest transition-all ${
                      scanMode === 'text' 
                        ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    <ScanLine className="w-4 h-4 shrink-0" />
                    <span className="translate-y-[1px] whitespace-nowrap">{t.analysis.tabText}</span>
                  </button>
                  <button
                    disabled={isScanning}
                    onClick={() => setScanMode('image')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 h-full sm:min-w-[140px] rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] lg:text-[13px] font-bold uppercase tracking-widest transition-all ${
                      scanMode === 'image' 
                        ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    <ScanFace className="w-4 h-4 shrink-0" />
                    <span className="translate-y-[1px] whitespace-nowrap">{t.analysis.tabImage}</span>
                  </button>
                </div>
              </div>

              <div className="relative group">
                {scanMode === 'text' ? (
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.analysis.placeholder}
                    className={`w-full h-40 border p-5 rounded-2xl text-[15px] md:text-[16px] leading-[1.8] font-medium italic placeholder:text-slate-600 resize-none outline-none focus:ring-1 transition-all duration-1000 ${
                      isScanning ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-100/50 opacity-80 shadow-inner' : 
                      result?.riskLevel === 'HIGH' ? 'bg-red-950/20 border-red-500/30 text-red-100 focus:ring-red-500/50 hover:border-red-500/50 shadow-inner' :
                      result?.riskLevel === 'MEDIUM' ? 'bg-amber-950/20 border-amber-500/30 text-amber-100 focus:ring-amber-500/50 hover:border-amber-500/50 shadow-inner' :
                      result?.riskLevel === 'LOW' ? 'bg-green-950/20 border-green-500/30 text-green-100 focus:ring-green-500/50 hover:border-green-500/50 shadow-inner' :
                      'bg-black/40 border-white/5 text-slate-300 focus:ring-cyan-500/50 hover:border-white/10 hover:bg-black/60 shadow-inner group-hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]'
                    }`}
                    spellCheck={false}
                    disabled={isScanning}
                  />
                ) : (
                  <div 
                    className={`w-full h-40 sm:h-52 rounded-xl flex flex-col items-center justify-center p-6 border-2 border-dashed transition-all duration-500 relative overflow-hidden ${
                      isDragging ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]' :
                      isScanning ? 'border-cyan-500/30 bg-cyan-950/10' :
                      imagePreview ? 'border-cyan-500/20 bg-black/40' :
                      'border-white/10 bg-black/40 hover:border-cyan-500/30 hover:bg-white/[0.02]'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      key={imagePreview ? 'has-img' : 'no-img'}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className={`absolute inset-0 opacity-0 cursor-pointer ${imagePreview ? 'z-0' : 'z-20'}`}
                      disabled={isScanning}
                      title="Upload Image"
                    />
                    
                    {imagePreview ? (
                      <div className="absolute inset-0 flex items-center justify-center p-2 z-10 bg-black/50 backdrop-blur-sm">
                        <img src={imagePreview} alt="Selected" className="max-w-full max-h-full object-contain rounded-lg border border-white/10" />
                        {!isScanning && (
                          <div className="absolute top-4 right-4 z-30">
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImagePreview(null); setSelectedImage(null); }}
                              className="bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {isScanning && (
                          <>
                            <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none z-0 render-contain"></div>
                            <motion.div 
                              className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)] z-20 gpu-accel-transform pointer-events-none" 
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center z-10 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
                          <UploadCloud className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300">{t.analysis.uploadDragText}</p>
                        <p className="text-xs text-slate-500 mt-1">{t.analysis.uploadBrowseText}</p>
                      </div>
                    )}
                  </div>
                )}

                <AnimatePresence>
                    {isScanning && (
                      <motion.div 
                        className="absolute inset-0 z-10 pointer-events-none rounded-xl overflow-hidden bg-cyan-900/10 mix-blend-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Scanning glitch blocks to simulate text parsing */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute bg-cyan-400/20 shadow-[0_0_8px_rgba(34,211,238,0.5)] border border-cyan-400/30 rounded-sm"
                            initial={{ 
                              top: `${Math.random() * 80}%`, 
                              left: `${Math.random() * 80}%`,
                              width: `${Math.random() * 20 + 10}%`, 
                              height: '1.5em',
                              opacity: 0
                            }}
                            animate={{ 
                              opacity: [0, 1, 0, 1, 0],
                              left: [`${Math.random() * 80}%`, `${Math.random() * 80}%`]
                            }}
                            transition={{
                              duration: Math.random() * 2.5 + 1.5,
                              repeat: Infinity,
                              delay: Math.random() * 1,
                              times: [0, 0.1, 0.2, 0.9, 1]
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between items-center pt-2 gap-4 sm:gap-0">
              <div className="text-red-500 text-sm font-medium w-full sm:w-auto text-center sm:text-left">{error}</div>
              <button
                onClick={handleAnalyze}
                disabled={isScanning || (scanMode === 'text' ? !input.trim() : !selectedImage)}
                className="group relative flex items-center justify-center h-12 px-8 w-full sm:w-auto bg-white/[0.05] text-white text-[13px] uppercase tracking-wider font-bold rounded-xl overflow-hidden transition-all sm:hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 sm:ml-auto border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                  <ScanLine className="w-4 h-4 group-hover:animate-pulse shrink-0" />
                  <span className="truncate">{t.analysis.button}</span>
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300 z-0"></div>
              </button>
            </div>
          </div>

          {/* Scanning State */}
          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div 
                ref={scanningRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 flex flex-col items-center justify-center py-12 rounded-2xl border border-cyan-500/20 bg-black/40 overflow-hidden relative render-isolate"
              >
                {/* Visual Effects */}
                <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none" />
                <motion.div 
                  className="absolute left-0 right-0 h-[2px] bg-cyan-400 opacity-50 shadow-[0_0_20px_5px_rgba(34,211,238,0.5)] z-0 gpu-accel-transform pointer-events-none" 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.8)] gpu-accel"
                      initial={{ 
                        opacity: 0, 
                        left: `${Math.random() * 100}%`, 
                        bottom: "-10%" 
                      }}
                      animate={{ 
                        opacity: [0, 0.8, 0], 
                        bottom: "110%",
                        x: Math.random() * 40 - 20 
                      }}
                      transition={{ 
                        duration: Math.random() * 3 + 2, 
                        repeat: Infinity, 
                        delay: Math.random() * 2,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 flex flex-col items-center w-full px-6">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-cyan-500 blur-[40px] opacity-20 rounded-full animate-pulse-glow"></div>
                    <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center bg-black/50 backdrop-blur-sm relative overflow-hidden">
                       <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                  </div>

                  {/* Progressive Meter */}
                  <div className="w-full max-w-[280px] space-y-3 mb-6">
                    <div className="flex justify-between items-end text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                       <span>Neural Uplink</span>
                       <span className="text-xs font-bold font-sans tracking-tight">
                         <ScanningProgressValue />
                       </span>
                    </div>
                    <div className="h-1.5 bg-black/50 rounded-full border border-white/10 overflow-hidden w-full relative">
                       <motion.div 
                         className="absolute inset-y-0 left-0 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                         initial={{ width: '0%' }}
                         animate={{ width: '95%' }}
                         transition={{ duration: 4, ease: "easeOut" }}
                       />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadingTextIndex}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      className="font-mono text-cyan-300 tracking-[0.2em] uppercase text-[10px] md:text-xs text-center h-4"
                    >
                      {t.analysis.analyzing[loadingTextIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

      <AnimatePresence mode="wait">
        {result && !isScanning && (
          <motion.div 
            ref={resultRef}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 sm:gap-6"
          >
            {/* Simplified Compact Result Area */}
            <motion.div 
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative p-5 md:p-6 rounded-[20px] md:rounded-[24px] border ${getRiskColor(result.riskLevel)} bg-black/40 backdrop-blur-md overflow-hidden flex flex-col gap-4 md:gap-5 shadow-[0_0_40px_rgba(34,211,238,0.05)]`}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
              
              {/* 1. Risk Header & Neural Threat Graph */}
              <div className="relative z-10 flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center justify-between border-b border-white/5 pb-5 md:pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
                  <div className="relative shrink-0">
                    <div className={`absolute inset-0 rounded-full blur-[20px] opacity-40 animate-pulse ${
                      result.riskLevel === 'HIGH' ? 'bg-red-500' :
                      result.riskLevel === 'MEDIUM' ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}></div>
                    <div className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full flex flex-col items-center justify-center border-[3px] sm:border-[4px] relative z-10 bg-black/80 backdrop-blur-xl ${
                      result.riskLevel === 'HIGH' ? 'border-red-500/80 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]' :
                      result.riskLevel === 'MEDIUM' ? 'border-amber-500/80 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]' :
                      'border-green-500/80 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                    }`}>
                      <div className="flex items-baseline">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none tracking-tighter">{result.probabilityPercentage}</span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-black leading-none ml-0.5">%</span>
                      </div>
                      <span className="text-[10px] sm:text-xs lg:text-[13px] font-mono uppercase tracking-[0.2em] mt-1 lg:mt-2 opacity-80 ml-[0.2em]">Match</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full relative">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${getRiskIconColor(result.riskLevel)} uppercase flex items-center gap-2 lg:gap-3`}>
                        {getRiskLabel(result.riskLevel)}
                        {result.riskLevel === 'HIGH' && <Flame className="w-6 h-6 lg:w-8 lg:h-8 animate-pulse" />}
                      </h3>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest font-mono text-slate-400">
                         <Activity className="w-4 h-4 text-cyan-400" /> Neural Analysis
                      </div>
                    </div>
                    
                    {/* Visual Threat Bar */}
                    <div className="h-3 lg:h-4 w-full bg-black/60 rounded-full border border-white/30 overflow-hidden mb-3 md:max-w-md relative flex shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] render-isolate">
                      <motion.div 
                        className={`h-full relative ${
                          result.riskLevel === 'HIGH' ? 'bg-gradient-to-r from-red-600 to-red-400 border-r border-r-white/40 shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                          result.riskLevel === 'MEDIUM' ? 'bg-gradient-to-r from-amber-600 to-amber-400 border-r border-r-white/40 shadow-[0_0_10px_rgba(245,158,11,0.8)]' :
                          'bg-gradient-to-r from-green-600 to-green-400 border-r border-r-white/40 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${result.probabilityPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* High-Level Intelligence Summary */}
              <div className="relative z-10 w-full mb-8 lg:mb-10">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl lg:rounded-[24px] p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    result.riskLevel === 'HIGH' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]' : 
                    result.riskLevel === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,1)]' : 
                    'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)]'
                  }`}></div>
                  <div className="flex items-start gap-4 lg:gap-6">
                    <div className={`mt-1 blur-[0.5px] ${getRiskIconColor(result.riskLevel)} shrink-0`}>
                       <BrainCircuit className="w-6 h-6 lg:w-8 lg:h-8 opacity-70" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] sm:text-[12px] lg:text-[13px] font-mono uppercase tracking-[0.2em] mb-3 opacity-60 text-white font-bold">Executive Intel Summary</div>
                      <p className="text-[14px] sm:text-[16px] lg:text-[17px] text-slate-200 font-medium leading-loose tracking-wide max-w-4xl">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {/* 2. Domain Analysis (Visual Mode) */}
                    {result.domainAnalysis && result.domainAnalysis.isPresent && (
                      <div className="p-0 space-y-5 md:col-span-2">
                        <div className="flex items-center gap-2 text-purple-400 border-b border-white/5 pb-3">
                          <Globe className="w-5 h-5" />
                          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em]">Domain Radar</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch gap-5 mt-3">
                          {result.domainAnalysis.suspiciousDomain && (
                            <div className="flex-1 bg-white/[0.02] p-5 lg:p-6 rounded-2xl border border-red-500/20 flex flex-col justify-center items-center relative overflow-hidden group">
                              <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                              <span className="text-[11px] sm:text-[12px] text-red-500 uppercase tracking-widest font-bold mb-2">Detected Target</span>
                              <span className="text-red-400/90 font-mono text-[14px] sm:text-[16px] break-all font-medium text-center">{result.domainAnalysis.suspiciousDomain}</span>
                            </div>
                          )}
                          
                          {result.domainAnalysis.suspiciousDomain && result.domainAnalysis.legitimateDomain && (
                            <div className="flex items-center justify-center py-3 sm:py-0 shrink-0">
                               <div className="text-[11px] sm:text-xs font-bold text-slate-500 bg-white/[0.05] px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest">VS</div>
                            </div>
                          )}

                          {result.domainAnalysis.legitimateDomain && (
                            <div className="flex-1 bg-white/[0.02] p-5 lg:p-6 rounded-2xl border border-green-500/20 flex flex-col justify-center items-center relative overflow-hidden group">
                               <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                               <span className="text-[11px] sm:text-[12px] text-green-500 uppercase tracking-widest font-bold mb-2">Authentic Target</span>
                               <span className="text-green-400/90 font-mono text-[14px] sm:text-[16px] break-all font-medium text-center">{result.domainAnalysis.legitimateDomain}</span>
                            </div>
                          )}
                        </div>
                        
                        {result.domainAnalysis.explanation && (
                          <div className="mt-3 text-slate-300 text-[14px] sm:text-[15px] leading-relaxed font-medium bg-white/[0.02] p-5 rounded-xl border border-white/5">
                            {result.domainAnalysis.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. Suspicious Fragments (Heatmap Snippets) */}
                    {result.suspiciousHighlights && result.suspiciousHighlights.length > 0 && (
                      <div className="p-0 space-y-5 md:col-span-2 mt-2">
                        <div className="flex items-center gap-2 text-amber-500 border-b border-white/5 pb-3">
                          <ScanLine className="w-5 h-5" />
                          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em]">{t.analysis.highlightsTitle}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                          {result.suspiciousHighlights.map((hl, i) => (
                            <div key={i} className="flex-1 min-w-[300px] bg-black/40 border border-amber-500/10 p-5 rounded-2xl hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group">
                              <span className="font-mono text-amber-200/90 text-[14px] sm:text-[16px] leading-[1.6] break-words mb-4 block border-l-[3px] border-amber-500/40 pl-4">{`"${hl.phrase}"`}</span>
                              <div className="flex items-center gap-2 text-slate-400">
                                <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0" />
                                <span className="text-[12px] sm:text-[13px] leading-tight font-medium uppercase tracking-wide text-amber-400/90">{hl.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Manipulation Vector Flow */}
                    {result.manipulationBreakdown && result.manipulationBreakdown.length > 0 && (
                      <div className="p-0 space-y-5 md:col-span-2 mt-4">
                        <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-3">
                          <BrainCircuit className="w-5 h-5" />
                          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em]">Manipulation Vectors</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {result.manipulationBreakdown.map((item, i) => {
                            const config = PATTERN_CONFIG[item.pattern] || { icon: Activity, color: "text-indigo-400", label: item.pattern, glowColor: "rgba(99,102,241,0.4)" };
                            const Icon = config.icon;
                            return (
                              <div key={i} className="relative group bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all z-10 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition-all relative overflow-hidden">
                                     <div className={`absolute inset-0 opacity-20 ${config.bg || 'bg-indigo-500'}`}></div>
                                     <Icon className={`w-5 h-5 ${config.color}`} />
                                  </div>
                                  <span className="text-white text-[13px] sm:text-[14px] font-bold uppercase tracking-wider">{item.pattern}</span>
                                </div>
                                <span className="text-slate-300 text-[12px] sm:text-[13px] leading-relaxed font-medium">{item.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 5. Security Recommendations (Visual Action Cards) */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="p-0 space-y-5 md:col-span-2 mt-4">
                        <div className="flex items-center gap-2 text-cyan-500 border-b border-white/5 pb-3">
                          <ShieldCheck className="w-5 h-5" />
                          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em]">{t.analysis.recommendationsTitle}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {result.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/10 hover:bg-cyan-900/40 hover:border-cyan-400/40 transition-all group shrink-0">
                               <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400 shrink-0 group-hover:bg-cyan-500/20 transition-all">
                                 <CheckCircle2 className="w-5 h-5" />
                               </div>
                               <span className="text-[14px] sm:text-[15px] text-cyan-100/90 leading-snug font-medium">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. Veriq Cyber Awareness Insights */}
                    {result.educationalInsights && result.educationalInsights.length > 0 && (
                      <div className="pt-6 md:col-span-2">
                        <div className="p-8 sm:p-10 rounded-[24px] bg-gradient-to-br from-indigo-950/40 to-fuchsia-950/20 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
                          <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                          
                          <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                              <BrainCircuit className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                               <span className="text-[11px] sm:text-[12px] font-mono text-fuchsia-400 uppercase tracking-widest block mb-1.5 opacity-80">
                                {language === 'id' ? 'Core Psikologi' : 'Psychology Core'}
                              </span>
                              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                                {language === 'id' ? 'Mengapa Orang Percaya?' : 'Why People Fall For This'}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                            {result.educationalInsights.map((insight, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 * i + 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative p-8 rounded-[20px] bg-black/60 backdrop-blur border border-white/10 hover:border-fuchsia-500/40 overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_-10px_rgba(217,70,239,0.4)] h-full"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 -translate-x-full group-hover:translate-x-full"></div>
                                
                                <h5 className="relative z-10 text-white font-bold mb-4 flex items-center gap-3 leading-snug text-[15px] sm:text-[17px]">
                                  <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.8)] shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                                  {insight.title}
                                </h5>
                                <p className="relative z-10 text-slate-300 text-[14px] sm:text-[15px] leading-[1.8] group-hover:text-slate-200 transition-colors duration-300 font-medium">
                                  {insight.description}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vera Chat Module - Only shown when analysis is complete */}
          {result && !isScanning && (
            <VeraChat 
              scanResult={result} 
              contextText={scanMode === 'image' ? 'Image uploaded.' : input} 
              language={language}
            />
          )}

          <div className="mt-8 flex items-center justify-between text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <span>Neural Engine Active</span>
            <span>Syncing with Cloud...</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
