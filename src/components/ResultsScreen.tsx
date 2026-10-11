import React from 'react';
import { Trophy, Star, Sparkles, BookOpen, MessageSquare, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { VOCABULARY_LIST } from '../data/storyData';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  learnedWords: string[];
  sentenceChosen: string;
  speakingAttempted: boolean;
  onReadAgain: () => void;
  onOpenChat: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  learnedWords,
  sentenceChosen,
  speakingAttempted,
  onReadAgain,
  onOpenChat,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 text-white text-center shadow-2xl border-4 border-amber-200 relative overflow-hidden">
        {/* Floating confetti icons */}
        <div className="absolute top-2 left-6 text-3xl animate-bounce">🎉</div>
        <div className="absolute top-4 right-8 text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute bottom-2 left-10 text-3xl animate-pulse">🌟</div>
        <div className="absolute bottom-3 right-12 text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🐉</div>

        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-white/40">
          🏆
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Great Job, Junior Explorer!
        </h1>
        <p className="text-amber-100 font-bold text-base max-w-lg mx-auto">
          You finished the whole story of "The Little Dragon's Lost Fire"! Lumi found her brave golden sparks with your help!
        </p>

        {/* Motivational Motto */}
        <div className="mt-4 inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-amber-100 font-extrabold text-sm">
          “Believe in yourself! I can do it!” 💖
        </div>
      </div>

      {/* Badges and Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Story Completion Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-black text-slate-800 text-base">Story Finished</h3>
          <p className="text-2xl font-black text-emerald-600 mt-1">8 / 8 Pages</p>
          <span className="text-xs font-bold text-slate-400">Complete A1 Session</span>
        </div>

        {/* Checkpoint Questions */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
            <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
          </div>
          <h3 className="font-black text-slate-800 text-base">Comprehension</h3>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {score} / {totalQuestions} Correct
          </p>
          <span className="text-xs font-bold text-emerald-600">Encouraging Master!</span>
        </div>

        {/* Speaking Badge */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="font-black text-slate-800 text-base">Say It! Speaking</h3>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {speakingAttempted ? 'Completed! ⭐' : 'Practiced!'}
          </p>
          <span className="text-xs font-bold text-slate-400">"Have you seen my fire?"</span>
        </div>
      </div>

      {/* Target Vocabulary Mastered */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Target Vocabulary Words Learned ({Object.keys(VOCABULARY_LIST).length} Target Words)
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            CEFR A1 Core
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(VOCABULARY_LIST).map((item) => {
            const hasTapped = learnedWords.includes(item.word);
            return (
              <div
                key={item.word}
                className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center gap-2.5"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="overflow-hidden">
                  <div className="font-black text-slate-800 text-sm truncate capitalize">
                    {item.word}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    {item.korean.split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sentence Completion Reflection */}
      {sentenceChosen && (
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800">
            Your Personal Story Retelling
          </span>
          <p className="text-lg font-black text-slate-800 mt-2">
            “Lumi is brave because <span className="text-amber-600">{sentenceChosen}</span>.”
          </p>
        </div>
      )}

      {/* Action Buttons: Read Again or Chat with Lumi */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onReadAgain}
          className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Read Story Again</span>
        </button>

        <button
          onClick={onOpenChat}
          className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat with Lumi the Dragon</span>
        </button>
      </div>
    </div>
  );
};
