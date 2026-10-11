import React from 'react';
import { Sparkles, Wand2, RefreshCw, ZoomIn } from 'lucide-react';
import { StoryPage } from '../data/storyData';

interface StoryIllustrationProps {
  page: StoryPage;
  customImageUrl?: string;
  onOpenImageGen: () => void;
  isGenerating?: boolean;
}

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  page,
  customImageUrl,
  onOpenImageGen,
  isGenerating = false,
}) => {
  return (
    <div className="relative w-full h-72 sm:h-84 md:h-96 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200/80 bg-gradient-to-b group">
      {customImageUrl ? (
        <div className="w-full h-full relative">
          <img
            src={customImageUrl}
            alt={page.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-amber-900/75 backdrop-blur-md text-amber-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-lg border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            AI Gemini Pro Art
          </div>
        </div>
      ) : (
        /* Built-in rich animated vector scene for each story page */
        <div className={`w-full h-full bg-gradient-to-b ${page.illustrationSvgTheme.bgGradient} relative flex flex-col items-center justify-between p-6 select-none overflow-hidden`}>
          {/* Decorative sky/ambient elements */}
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>☁️</span>
            <span className="text-2xl animate-pulse text-amber-400">✨</span>
          </div>
          <div className="absolute top-6 right-8 flex items-center gap-3">
            <span className="text-4xl animate-spin" style={{ animationDuration: '24s' }}>☀️</span>
          </div>

          {/* Main Visual Scene Rendering per page */}
          <div className="w-full h-full flex items-center justify-center relative my-auto">
            {page.pageNumber === 1 && (
              <div className="text-center relative">
                <div className="relative inline-block">
                  <div className="w-48 h-36 bg-amber-900/15 rounded-full filter blur-md absolute -bottom-3 left-1/2 -translate-x-1/2" />
                  <div className="text-8xl transform hover:scale-110 transition-transform cursor-pointer filter drop-shadow-lg animate-pulse" style={{ animationDuration: '4s' }}>
                    🐉
                  </div>
                  <span className="absolute -top-3 -right-2 text-3xl animate-bounce">💖</span>
                  <span className="absolute bottom-1 -left-4 text-2xl">🌿</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
                    Lumi's Cozy Cave
                  </span>
                </div>
              </div>
            )}

            {page.pageNumber === 2 && (
              <div className="text-center relative">
                <div className="relative inline-block">
                  <div className="text-8xl transform -rotate-6 filter drop-shadow-md">
                    🐲
                  </div>
                  <div className="absolute -top-6 -right-6 text-4xl animate-ping" style={{ animationDuration: '2s' }}>
                    💨
                  </div>
                  <div className="absolute -top-1 -right-3 text-2xl font-black text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300 animate-bounce">
                    Achoo!
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
                    Where is the Fire? 🔥❓
                  </span>
                </div>
              </div>
            )}

            {page.pageNumber === 3 && (
              <div className="text-center relative w-full flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <span className="text-6xl filter drop-shadow">🌲</span>
                  <div className="relative inline-block">
                    <span className="text-7xl transform hover:scale-110 transition-transform filter drop-shadow">🐉</span>
                    <span className="absolute -top-4 -right-1 text-2xl animate-pulse">❓</span>
                  </div>
                  <span className="text-7xl filter drop-shadow">🌳</span>
                  <span className="text-6xl filter drop-shadow">🌲</span>
                </div>
                <div className="absolute bottom-0 text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
                  The Deep Green Forest
                </div>
              </div>
            )}

            {page.pageNumber === 4 && (
              <div className="text-center relative flex items-center justify-center gap-8">
                <div className="text-7xl filter drop-shadow-md transform hover:scale-105 transition-transform">
                  🐉
                </div>
                <div className="text-3xl text-rose-400 font-bold animate-pulse">
                  💬
                </div>
                <div className="text-7xl filter drop-shadow-md transform hover:scale-105 transition-transform animate-bounce" style={{ animationDuration: '2.5s' }}>
                  🐰
                </div>
                <div className="absolute bottom-0 text-xs font-black uppercase tracking-wider text-lime-900 bg-lime-100/90 px-3 py-1 rounded-full border border-lime-300">
                  "I can help you look!"
                </div>
              </div>
            )}

            {page.pageNumber === 5 && (
              <div className="text-center relative w-full flex flex-col items-center">
                <div className="flex items-center justify-center gap-6 mb-2">
                  <span className="text-6xl">🐉</span>
                  <span className="text-6xl">🐰</span>
                  <div className="relative">
                    <span className="text-7xl filter drop-shadow animate-bounce">🐦</span>
                    <span className="absolute -top-3 right-0 text-xl">🎵</span>
                  </div>
                </div>
                <div className="w-4/5 h-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-xs text-white font-bold tracking-widest">~~~ Sparkling River ~~~</span>
                </div>
              </div>
            )}

            {page.pageNumber === 6 && (
              <div className="text-center relative flex flex-col items-center">
                <div className="relative inline-block mb-3">
                  <span className="text-8xl filter drop-shadow-lg">🏔️</span>
                  <span className="absolute -top-3 right-4 text-3xl animate-ping" style={{ animationDuration: '1.8s' }}>
                    ✨
                  </span>
                  <span className="absolute -top-1 right-6 text-2xl animate-pulse">
                    🔥
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-5xl">🐦</span>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-100/90 px-3 py-1 rounded-full border border-indigo-300">
                    "Look high on the mountain!"
                  </span>
                </div>
              </div>
            )}

            {page.pageNumber === 7 && (
              <div className="text-center relative flex flex-col items-center">
                <div className="flex items-end justify-center gap-4 mb-3">
                  <span className="text-6xl filter drop-shadow">🐉</span>
                  <span className="text-5xl filter drop-shadow">🐰</span>
                  <span className="text-5xl filter drop-shadow">🐦</span>
                  <span className="text-7xl">🧗</span>
                </div>
                <div className="text-xs font-black uppercase tracking-wider text-orange-900 bg-orange-100/90 px-4 py-1.5 rounded-full border border-orange-300 flex items-center gap-1.5">
                  <span className="animate-spin text-amber-500">⭐</span>
                  "Be brave, Lumi! You can do it!"
                </div>
              </div>
            )}

            {page.pageNumber === 8 && (
              <div className="text-center relative flex flex-col items-center">
                <div className="relative inline-block mb-2">
                  <span className="text-8xl filter drop-shadow-xl animate-pulse">🐉</span>
                  <div className="absolute -top-6 -right-6 text-5xl animate-bounce">
                    🔥✨
                  </div>
                  <span className="absolute -bottom-2 -left-4 text-3xl">🎉</span>
                  <span className="absolute -bottom-2 -right-4 text-3xl">🎊</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-300/90 px-4 py-1 rounded-full border-2 border-amber-500 shadow-md animate-pulse">
                    🌟 Golden Sparks & Brave Heart! 🌟
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom badge */}
          <div className="w-full flex items-center justify-between text-xs text-slate-600 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/60">
            <span className="font-semibold truncate">Page {page.pageNumber} Illustration: {page.title}</span>
            <span className="text-amber-700 font-bold shrink-0">CEFR A1 Story</span>
          </div>
        </div>
      )}

      {/* Floating Action Button to generate new AI illustration */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={onOpenImageGen}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl transition-all border-2 border-white/80 cursor-pointer disabled:opacity-60"
          title="Generate a new AI illustration for this page (supports 1K, 2K, 4K)"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Drawing Art...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-amber-200" />
              <span>Generate Illustration</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                1K/2K/4K
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
