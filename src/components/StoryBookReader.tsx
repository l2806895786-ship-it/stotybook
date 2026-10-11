import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Volume2, Sparkles, HelpCircle, 
  BookOpen, Star, Wand2, Award, CheckCircle2 
} from 'lucide-react';
import { StoryPage, VocabularyWord, VOCABULARY_LIST } from '../data/storyData';
import { StoryIllustration } from './StoryIllustration';
import { NarrationBar } from './NarrationBar';
import { storyAudio } from '../utils/audioPlayer';

interface StoryBookReaderProps {
  pages: StoryPage[];
  currentPageIdx: number;
  onPageChange: (newIdx: number) => void;
  onOpenVocab: (word: VocabularyWord) => void;
  onOpenImageGen: (page: StoryPage) => void;
  customPageImages: Record<number, string>;
  onTriggerQuestion: (question: any) => void;
  answeredQuestions: string[];
  onFinishReading: () => void;
}

export const StoryBookReader: React.FC<StoryBookReaderProps> = ({
  pages,
  currentPageIdx,
  onPageChange,
  onOpenVocab,
  onOpenImageGen,
  customPageImages,
  onTriggerQuestion,
  answeredQuestions,
  onFinishReading,
}) => {
  const currentPage = pages[currentPageIdx];
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [narratorVoice, setNarratorVoice] = useState('Kore');
  const [narrationSpeed, setNarrationSpeed] = useState(1.0);

  // Stop audio on page change
  useEffect(() => {
    storyAudio.stop();
    setIsPlaying(false);
    setActiveSentenceIdx(-1);
  }, [currentPageIdx]);

  // Check if checkpoint question exists on this page and hasn't been answered yet
  const hasUnansweredQuestion = 
    currentPage.checkpointQuestion && 
    !answeredQuestions.includes(currentPage.checkpointQuestion.id);

  // Play narration for the whole page sentence by sentence
  const handlePlayPage = async () => {
    if (isPlaying) {
      storyAudio.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setIsLoadingAudio(true);

    try {
      for (let i = 0; i < currentPage.sentences.length; i++) {
        setActiveSentenceIdx(i);
        const sentence = currentPage.sentences[i];
        setIsLoadingAudio(false);

        await new Promise<void>((resolve) => {
          storyAudio.playTTS(sentence.text, narratorVoice, narrationSpeed, () => {
            resolve();
          });
        });
      }
    } catch (err) {
      console.error('Play error', err);
    } finally {
      setIsPlaying(false);
      setIsLoadingAudio(false);

      // Check if checkpoint question should trigger after reading
      if (hasUnansweredQuestion) {
        onTriggerQuestion(currentPage.checkpointQuestion);
      }
    }
  };

  // Play a single sentence when clicked
  const handlePlaySentence = (idx: number, sentenceText: string) => {
    setActiveSentenceIdx(idx);
    setIsPlaying(true);
    storyAudio.playTTS(sentenceText, narratorVoice, narrationSpeed, () => {
      setIsPlaying(false);
    });
  };

  const handlePause = () => {
    storyAudio.stop();
    setIsPlaying(false);
  };

  const handleReplay = () => {
    storyAudio.stop();
    setIsPlaying(false);
    setTimeout(() => {
      handlePlayPage();
    }, 150);
  };

  const handleNextPage = () => {
    if (hasUnansweredQuestion) {
      onTriggerQuestion(currentPage.checkpointQuestion);
      return;
    }

    if (currentPageIdx < pages.length - 1) {
      onPageChange(currentPageIdx + 1);
    } else {
      onFinishReading();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      onPageChange(currentPageIdx - 1);
    }
  };

  // Helper to render text with tappable target vocabulary words
  const renderInteractiveSentence = (sentenceText: string, targetWords: string[] = []) => {
    // Break sentence into words and punctuation
    const words = sentenceText.split(/(\s+)/);

    return words.map((chunk, index) => {
      const cleanWord = chunk.toLowerCase().replace(/[^a-z]/g, '');
      const vocabItem = VOCABULARY_LIST[cleanWord];

      if (vocabItem) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onOpenVocab(vocabItem);
            }}
            className="inline-block mx-0.5 px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-black cursor-pointer transform hover:scale-105 active:scale-95 transition-all shadow-xs underline decoration-amber-500 decoration-2 underline-offset-4"
            title={`Tap for Korean meaning & pronunciation (${vocabItem.korean})`}
          >
            {chunk}
            <span className="text-[10px] ml-1 opacity-70">💡</span>
          </span>
        );
      }

      return <span key={index}>{chunk}</span>;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Navigation & Page Progress Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-md border-2 border-amber-200">
        <button
          onClick={handlePrevPage}
          disabled={currentPageIdx === 0}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page Dots & Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => onPageChange(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentPageIdx === idx
                    ? 'w-7 bg-amber-500 shadow-sm'
                    : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Go to Page ${p.pageNumber}`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-slate-800 mt-1.5">
            Page {currentPage.pageNumber} of {pages.length}: {currentPage.title}
          </span>
        </div>

        <button
          onClick={handleNextPage}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95"
        >
          <span>{currentPageIdx === pages.length - 1 ? 'Next: Activities' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Illustration Component (Supports AI Generation with 1K, 2K, 4K!) */}
      <StoryIllustration
        page={currentPage}
        customImageUrl={customPageImages[currentPage.pageNumber]}
        onOpenImageGen={() => onOpenImageGen(currentPage)}
      />

      {/* Story Text Box with Sentence Highlighting and Tappable Words */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
          <span className="flex items-center gap-1.5 text-amber-700 font-black">
            <Sparkles className="w-4 h-4" />
            Tap highlighted words for Korean definitions & audio!
          </span>
          <span className="hidden sm:inline">Grade 5 CEFR A1</span>
        </div>

        {/* Sentences */}
        <div className="space-y-3 pt-2">
          {currentPage.sentences.map((sentence, idx) => {
            const isSentenceActive = activeSentenceIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => handlePlaySentence(idx, sentence.text)}
                className={`p-4 rounded-2xl transition-all cursor-pointer border-2 flex items-start justify-between gap-3 ${
                  isSentenceActive
                    ? 'bg-amber-100/80 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-amber-50/30 hover:bg-amber-50/70 border-slate-100 hover:border-amber-200'
                }`}
              >
                <div className="text-lg sm:text-2xl font-black text-slate-800 leading-relaxed">
                  {renderInteractiveSentence(sentence.text, sentence.highlightWords)}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySentence(idx, sentence.text);
                  }}
                  className={`p-2 rounded-xl shrink-0 transition-all ${
                    isSentenceActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-amber-100'
                  }`}
                  title="Read this sentence aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Checkpoint question trigger badge if available */}
        {currentPage.checkpointQuestion && (
          <div className="pt-3">
            <button
              onClick={() => onTriggerQuestion(currentPage.checkpointQuestion)}
              className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>
                {answeredQuestions.includes(currentPage.checkpointQuestion.id)
                  ? 'Review Checkpoint Question ⭐'
                  : 'Answer Page Checkpoint Question 🎯'}
              </span>
            </button>
          </div>
        )}

        {/* Screen 8 ending requirement: "I can do it! Believe in yourself!" */}
        {currentPage.pageNumber === 8 && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white text-center shadow-lg border-2 border-white animate-pulse">
            <h4 className="text-2xl sm:text-3xl font-black mb-1">“I can do it!”</h4>
            <p className="text-base sm:text-lg font-bold text-amber-100">
              🌟 Believe in yourself! You found your brave spark! 🌟
            </p>
          </div>
        )}
      </div>

      {/* Audio Narration Bar using gemini-3.8-flash-tts */}
      <NarrationBar
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        onPlayPage={handlePlayPage}
        onPause={handlePause}
        onReplay={handleReplay}
        currentSentenceIdx={activeSentenceIdx >= 0 ? activeSentenceIdx : 0}
        totalSentences={currentPage.sentences.length}
        voice={narratorVoice}
        onChangeVoice={setNarratorVoice}
        speed={narrationSpeed}
        onChangeSpeed={setNarrationSpeed}
      />
    </div>
  );
};
