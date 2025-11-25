
import React, { useState } from 'react';
import { VocabCard, CategoryStyle } from '../types';
import { RefreshCcw, Volume2, Layers, GitMerge, Copy } from 'lucide-react';

interface FlashcardProps {
  card: VocabCard;
  categoryStyle: CategoryStyle;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, categoryStyle }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const speak = (e: React.MouseEvent, lang: 'en-US' | 'en-GB') => {
    e.stopPropagation();
    
    // Cancel any ongoing speech to prevent overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(card.word);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clarity

    // Try to find a high quality voice for the requested lang
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang === lang && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Enhanced'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="group perspective-1000 w-full max-w-md h-[32rem] cursor-pointer"
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className={`absolute w-full h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-b-4 ${categoryStyle.border} backface-hidden`}>
          <div className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 flex items-center gap-1 text-xs uppercase tracking-wider font-bold">
            <RefreshCcw size={14} /> Tap to flip
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">{card.word}</h2>
            
            <div className="flex flex-col items-center gap-3 mb-6 w-full">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-sm bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {card.pronunciation}
              </span>
              
              <div className="flex items-center gap-3 mt-1">
                <button 
                  onClick={(e) => speak(e, 'en-US')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300`}
                  title="American English Pronunciation"
                >
                  <span className="text-lg">🇺🇸</span> US
                  <Volume2 size={14} className="opacity-70" />
                </button>
                
                <button 
                  onClick={(e) => speak(e, 'en-GB')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 border border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300`}
                  title="British English Pronunciation"
                >
                  <span className="text-lg">🇬🇧</span> UK
                  <Volume2 size={14} className="opacity-70" />
                </button>
              </div>
            </div>

            <p className="text-slate-400 dark:text-slate-500 text-sm">Gemini IELTS Coach • Band 9.0</p>
          </div>
        </div>

        {/* Back */}
        <div className={`absolute w-full h-full flex flex-col p-6 ${categoryStyle.bg} rounded-2xl shadow-xl rotate-y-180 backface-hidden text-white overflow-hidden`}>
           <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
             
             {/* Main Meaning */}
             <div className="text-center mb-4 pt-2">
                <h3 className="text-2xl font-bold mb-2 text-white/95">{card.vietnameseMeaning}</h3>
                <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-white/30 pl-3 text-left">"{card.definition}"</p>
             </div>

             {/* Extra Info Grid */}
             <div className="w-full grid grid-cols-2 gap-2 mb-4">
                {card.synonyms && card.synonyms.length > 0 && (
                  <div className="bg-black/10 rounded-lg p-2.5 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 mb-1 text-white/60">
                      <Copy size={12} /> <span className="text-[10px] uppercase font-bold">Synonyms</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.synonyms.map((s, i) => (
                        <span key={i} className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/90">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {card.wordFamily && (
                  <div className="bg-black/10 rounded-lg p-2.5 backdrop-blur-sm">
                     <div className="flex items-center gap-1.5 mb-1 text-white/60">
                      <Layers size={12} /> <span className="text-[10px] uppercase font-bold">Forms</span>
                    </div>
                    <p className="text-xs text-white/90 leading-tight">{card.wordFamily}</p>
                  </div>
                )}
             </div>

             {/* Collocations */}
             {card.collocations && card.collocations.length > 0 && (
                <div className="w-full bg-black/10 rounded-lg p-3 backdrop-blur-sm mb-4">
                  <div className="flex items-center gap-1.5 mb-1.5 text-white/60">
                    <GitMerge size={12} /> <span className="text-[10px] uppercase font-bold">Collocations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.collocations.map((c, i) => (
                      <span key={i} className="text-xs font-medium border-b border-white/20 pb-0.5 text-white/90">{c}</span>
                    ))}
                  </div>
                </div>
             )}
             
             {/* Example Section */}
             <div className="w-full bg-black/20 p-4 rounded-lg text-left border border-white/10 mt-auto">
               <p className="text-[10px] text-white/60 uppercase font-bold mb-1">Context Example</p>
               <p className="text-sm mb-2 leading-relaxed">{card.example}</p>
               <div className="h-px bg-white/10 w-full mb-2"></div>
               <p className="text-sm text-white/80 italic">{card.exampleVietnamese}</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Flashcard;
