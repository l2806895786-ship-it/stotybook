import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, Sparkles, Smile } from 'lucide-react';
import { StoryQuestion } from '../data/storyData';

interface ComprehensionModalProps {
  question: StoryQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

export const ComprehensionModal: React.FC<ComprehensionModalProps> = ({
  question,
  onAnswer,
  onClose,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isCorrect = selectedIdx === question.correctAnswer;

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedIdx(idx);
    setHasSubmitted(true);
    onAnswer(idx === question.correctAnswer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Story Checkpoint Question
          </span>
          <span className="text-xs font-bold text-slate-400">Low-Anxiety Practice</span>
        </div>

        {/* Question Title & Korean subtitle */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
          {question.question}
        </h3>
        <p className="text-sm font-semibold text-slate-500 mt-1 mb-6">
          {question.koreanQuestion}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isThisSelected = selectedIdx === idx;
            const isThisCorrect = idx === question.correctAnswer;

            let buttonStyle = 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-700 hover:border-amber-300';

            if (hasSubmitted) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-300';
              } else if (isThisSelected) {
                buttonStyle = 'bg-amber-100/90 border-amber-300 text-amber-900';
              } else {
                buttonStyle = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={hasSubmitted}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600 shadow-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {hasSubmitted && isThisCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Supportive Feedback (No penalties, gentle explanation) */}
        {hasSubmitted && (
          <div className={`mt-6 p-4 rounded-2xl border-2 animate-in zoom-in-95 duration-200 ${
            isCorrect 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <Sparkles className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Smile className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-extrabold text-sm sm:text-base">
                  {isCorrect ? 'Fantastic reading! 🌟' : 'Good effort! Let\'s remember together: 💖'}
                </p>
                <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
            >
              <span>Continue the Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
