import React from 'react';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToContent = () => {
    const element = document.getElementById('main-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden flex flex-col items-center justify-center bg-brand-bg">
      {/* 1. Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

      {/* 2. Abstract Curvy Overlay (Silhouette Suggestion) */}
      {/* This SVG creates a soft, curvy flow reminiscent of body curves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
         <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#gradient)" className="animate-float" style={{ animationDuration: '10s' }} />
         <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.2" />
               <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.8" />
            </linearGradient>
         </defs>
      </svg>
      
      {/* 3. Central Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
         
         <div className="mb-4 inline-block px-4 py-1 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm text-pink-800 text-xs font-bold tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
            For Women • By Women
         </div>

         <div className="relative mb-6">
            <h1 className="text-8xl md:text-[10rem] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-900 via-rose-700 to-pink-500 tracking-tighter drop-shadow-sm animate-in fade-in zoom-in duration-1000">
               SHUSH!
            </h1>
            {/* Visual accent: A small circle floating near the text */}
            <div className="absolute -top-4 -right-8 w-12 h-12 bg-rose-300 rounded-full mix-blend-multiply filter blur-md opacity-80 animate-bounce" style={{ animationDuration: '3s' }}></div>
         </div>
         
         <p className="text-xl md:text-2xl font-light text-gray-600 italic mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            "Honor your body, understand your rhythm, and embrace your womanhood with confidence."
         </p>

         <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
             <button 
                onClick={scrollToContent}
                className="group px-8 py-4 bg-brand-dark-pink text-white rounded-full font-serif text-lg hover:bg-pink-700 transition-all shadow-xl shadow-pink-200 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
             >
                Start Exploring
             </button>
         </div>
      </div>
      
      {/* 4. Scroll Indicator */}
      <div className="absolute bottom-10 animate-bounce text-pink-300 cursor-pointer" onClick={scrollToContent}>
        <ArrowDown size={32} />
      </div>

      {/* 5. Decorative Side Elements (Abstract) */}
      <div className="absolute left-0 bottom-1/4 w-32 h-64 bg-gradient-to-r from-pink-200/20 to-transparent rounded-r-full blur-xl"></div>
      <div className="absolute right-0 top-1/4 w-32 h-64 bg-gradient-to-l from-rose-200/20 to-transparent rounded-l-full blur-xl"></div>
    </div>
  );
};
