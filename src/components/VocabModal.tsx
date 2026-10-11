import React, { useState } from 'react';
import { X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { VocabularyWord } from '../data/storyData';

interface VocabModalProps {
  wordData: VocabularyWord | null;
  onClose: () => void;
  onPlayTTS: (text: string) => void;
  onMarkLearned?: (word: string) => void;
  isLearned?: boolean;
}

export const VocabModal: React.FC<VocabModalProps> = ({
  wordData,
  onClose,
  onPlayTTS,
  onMarkLearned,
  isLearned = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!wordData) return null;

  const handlePronounce = async () => {
    setIsPlaying(true);
    try {
      await onPlayTTS(`${wordData.word}. ${wordData.example}`);
    } finally {
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 transform scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Word Header with cute icon & pronunciation button */}
        <div className="text-center pt-2">
          <div className="w-24 h-24 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center text-5xl shadow-inner border-2 border-amber-200">
            {wordData.icon}
          </div>

          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight capitalize">
              {wordData.word}
            </h2>
            <button
              onClick={handlePronounce}
              className={`p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-90 text-white shadow-md transition-all ${
                isPlaying ? 'ring-4 ring-amber-300 animate-pulse' : ''
              }`}
              title="Listen to pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Phonetic & Korean Meaning (as specified in PDF: e.g. 불 /faɪər/) */}
          <div className="mt-2 flex items-center justify-center gap-2 text-slate-500 font-mono text-sm">
            <span>{wordData.phonetic}</span>
            <span>•</span>
            <span className="font-extrabold text-amber-600 text-lg font-sans">
              {wordData.korean}
            </span>
          </div>
        </div>

        {/* Definition and Example */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Simple English Meaning
            </div>
            <p className="text-slate-700 font-medium text-base">
              {wordData.definition}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Example Sentence in Story
            </div>
            <p className="text-slate-800 font-semibold text-base italic">
              "{wordData.example}"
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              if (onMarkLearned) onMarkLearned(wordData.word);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isLearned ? 'Learned! Keep Reading' : 'I Learned This Word! ⭐'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
