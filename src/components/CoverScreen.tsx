import React from 'react';
import { BookOpen, Sparkles, Volume2, HelpCircle, ArrowRight, Wand2 } from 'lucide-react';
import { VOCABULARY_LIST, VocabularyWord } from '../data/storyData';

interface CoverScreenProps {
  onStartReading: () => void;
  onOpenVocab: (word: VocabularyWord) => void;
  onOpenImageGen: () => void;
  coverImage?: string;
  onPlayTTS: (text: string) => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  onStartReading,
  onOpenVocab,
  onOpenImageGen,
  coverImage,
  onPlayTTS,
}) => {
  // 4 target preview vocabulary words from PDF: dragon, fire, forest, friend
  const previewWords = ['dragon', 'fire', 'forest', 'friend'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Big Enchanted Storybook Cover */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-gradient-to-br from-emerald-100 via-amber-50 to-orange-100 p-6 sm:p-10 text-center">
        {/* Cover Art / Hero */}
        <div className="relative max-w-md mx-auto mb-6">
          {coverImage ? (
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border-4 border-amber-200">
              <img
                src={coverImage}
                alt="The Little Dragon's Lost Fire"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-amber-900/80 text-amber-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini Pro Cover Art
              </div>
            </div>
          ) : (
            <div className="relative py-8 select-none">
              <div className="w-56 h-56 mx-auto bg-gradient-to-tr from-emerald-300 to-teal-200 rounded-full flex items-center justify-center text-8xl shadow-2xl border-4 border-white animate-pulse" style={{ animationDuration: '4s' }}>
                🐉
              </div>
              <span className="absolute top-6 right-16 text-4xl animate-bounce">🔥</span>
              <span className="absolute bottom-6 left-16 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
            </div>
          )}
        </div>

        {/* Story Title & Subtitle */}
        <div className="space-y-2 mb-6">
          <span className="inline-block bg-amber-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Interactive English Storybook • Grade 5 (CEFR A1)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            The Little Dragon's Lost Fire
          </h1>
          <p className="text-base sm:text-lg font-bold text-amber-800">
            꼬마 용 루미의 잃어버린 불꽃을 찾는 마법 같은 모험
          </p>
        </div>

        {/* Guiding Question from PDF: "Can you help Lumi find her fire?" */}
        <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border-2 border-amber-200 mb-8 flex items-center justify-center gap-3">
          <HelpCircle className="w-6 h-6 text-amber-600 shrink-0" />
          <span className="text-base sm:text-lg font-black text-slate-800">
            “Can you help Lumi find her fire?”
          </span>
          <button
            onClick={() => onPlayTTS("Can you help Lumi find her fire?")}
            className="p-1.5 rounded-full hover:bg-amber-100 text-amber-700 transition-colors"
            title="Listen"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Start Button & Custom Art button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onStartReading}
            className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-white font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <BookOpen className="w-6 h-6" />
            <span>Start Adventure</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenImageGen}
            className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-white hover:bg-amber-50 active:scale-95 text-slate-800 font-extrabold text-sm shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Generate custom Cover Art with Gemini Pro Image"
          >
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Customize Cover</span>
          </button>
        </div>
      </div>

      {/* Screen 1 requirement from PDF: 3-4 target vocabulary preview cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                Pre-Reading Vocabulary Preview
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Tap each card to hear pronunciation and learn its meaning before reading!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full hidden sm:inline">
            Tap to Listen
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {previewWords.map((wordKey) => {
            const word = VOCABULARY_LIST[wordKey];
            if (!word) return null;
            return (
              <button
                key={word.word}
                onClick={() => onOpenVocab(word)}
                className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/80 to-white hover:from-amber-100/80 border-2 border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all text-left cursor-pointer flex flex-col items-center text-center group active:scale-95"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {word.icon}
                </div>
                <div className="font-black text-slate-800 text-base capitalize">
                  {word.word}
                </div>
                <div className="text-xs font-bold text-amber-700 mt-0.5">
                  {word.korean.split(' ')[0]}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {word.phonetic}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
