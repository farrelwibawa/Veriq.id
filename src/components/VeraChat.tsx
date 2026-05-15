import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { AnalysisResult, askVera } from '../services/ai';

interface VeraChatProps {
  scanResult: AnalysisResult;
  contextText: string;
  language: 'id' | 'en';
}

interface Message {
  id: string;
  role: 'user' | 'vera';
  text: string;
}

export function VeraChat({ scanResult, contextText, language }: VeraChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const t = {
    intro: language === 'id' ? 'Masih bingung dengan hasil analisis ini?' : 'Still confused about this analysis?',
    subIntro: language === 'id' 
      ? 'Vera siap membantu menjelaskan pola manipulasi dan motif di balik pesan tersebut secara lehih mendalam.' 
      : 'Vera is ready to help explain the manipulation patterns and motives behind this message in more detail.',
    placeholder: language === 'id' ? 'Tanya Vera di sini...' : 'Ask Vera here...',
    thinking: language === 'id' ? 'Vera sedang menganalisis motif manipulasi...' : 'Vera is analyzing the manipulation motives...',
    error: language === 'id' ? 'Maaf, terjadi kesalahan saat menghubungi Vera.' : 'Sorry, an error occurred while connecting to Vera.',
    suggested1: scanResult.suggestedQuestions?.[0] || (language === 'id' ? 'Apa tujuan utama scam ini?' : 'What is the main goal of this scam?'),
    suggested2: scanResult.suggestedQuestions?.[1] || (language === 'id' ? 'Kenapa pesan ini terlihat meyakinkan?' : 'Why does this message look convincing?')
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const container = chatContainerRef.current;
      if (!container) return;

      if (isLoading && wrapperRef.current) {
        // Ensure the whole chat section is visible in browser viewport when loading starts
        const rect = wrapperRef.current.getBoundingClientRect();
        if (rect.bottom > window.innerHeight || rect.top < 0) {
          wrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        return;
      }

      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        const lastMsgIndex = messages.length - 1;
        const msgElement = document.getElementById(`vera-msg-${lastMsgIndex}`);
        
        if (msgElement) {
          if (lastMsg.role === 'user') {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          } else {
            const offsetTop = msgElement.offsetTop;
            const messageHeight = msgElement.offsetHeight;
            const containerHeight = container.clientHeight;
            
            if (messageHeight > containerHeight * 0.6) {
              container.scrollTo({ top: offsetTop - 32, behavior: 'smooth' });
            } else {
              container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }
          }
        } else {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askVera(text.trim(), contextText, scanResult, language);
      const veraMsg: Message = { id: (Date.now() + 1).toString(), role: 'vera', text: response };
      setMessages(prev => [...prev, veraMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'vera', text: t.error };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full mt-6 flex flex-col gap-4">
      {/* Vera Header/Intro */}
      {messages.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative p-6 sm:p-8 rounded-[24px] border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-[0_0_40px_rgba(79,70,229,0.05)]"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse pointer-events-none"></div>
          
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            {/* Holographic orbit rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-4px] rounded-full border border-indigo-500/30 border-t-indigo-400 gpu-accel-transform"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-8px] rounded-full border border-purple-500/20 border-b-purple-400 gpu-accel-transform"
            />
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.intro}
            </h3>
            <p className="text-[15px] sm:text-base text-indigo-200/80 leading-relaxed font-medium">
              {t.subIntro}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              <button 
                onClick={() => handleSend(t.suggested1)}
                className="px-4 py-2.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[13px] sm:text-[14px] font-semibold tracking-wide transition-all duration-300"
              >
                {t.suggested1}
              </button>
              <button 
                onClick={() => handleSend(t.suggested2)}
                className="px-4 py-2.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[13px] sm:text-[14px] font-semibold tracking-wide transition-all duration-300"
              >
                {t.suggested2}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Area */}
      {messages.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-col rounded-[24px] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl overflow-hidden ring-1 ring-white/5"
        >
          {/* Fixed Header */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-4 border-b border-indigo-500/20 z-10 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.6)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-[0.15em] text-white uppercase leading-none">Vera.AI</span>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 mt-1 uppercase">Intelligence Mentor</span>
            </div>
          </div>

          {/* Scrollable Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex flex-col gap-6 p-6 sm:p-8 max-h-[350px] sm:max-h-[420px] lg:max-h-[490px] overflow-y-auto custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                id={`vera-msg-${index}`}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full gpu-accel ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] sm:max-w-[85%] rounded-[24px] p-6 sm:p-8 ${
                  msg.role === 'user' 
                    ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' 
                    : 'bg-indigo-950/40 text-indigo-50 rounded-tl-sm border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.05)]'
                }`}>
                  <p className="text-[15px] sm:text-[16px] leading-[1.8] whitespace-pre-wrap font-medium">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-start"
            >
              <div className="max-w-[85%] rounded-[20px] rounded-tl-sm p-5 bg-indigo-950/20 border border-indigo-500/10 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                <p className="text-[13px] sm:text-[14px] font-medium text-indigo-300 animate-pulse">{t.thinking}</p>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
          </div>
        </motion.div>
      )}

      {/* Input Form */}
      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="relative flex items-center gap-2 mt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          disabled={isLoading}
          className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 lg:py-5 text-[14px] sm:text-[15px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-950/10 transition-all duration-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-colors duration-300"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </motion.form>
    </div>
  );
}
