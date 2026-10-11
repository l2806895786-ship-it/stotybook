import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, MessageSquare, Volume2, Award, 
  HelpCircle, Home, CheckCircle2, ChevronRight, Wand2, Compass 
} from 'lucide-react';

import { STORY_PAGES, StoryPage, VocabularyWord, VOCABULARY_LIST, StoryQuestion } from './data/storyData';
import { CoverScreen } from './components/CoverScreen';
import { StoryBookReader } from './components/StoryBookReader';
import { PostReadingActivity } from './components/PostReadingActivity';
import { ResultsScreen } from './components/ResultsScreen';
import { VocabModal } from './components/VocabModal';
import { ComprehensionModal } from './components/ComprehensionModal';
import { ImageGenModal } from './components/ImageGenModal';
import { ChatBuddyDrawer } from './components/ChatBuddyDrawer';
import { storyAudio } from './utils/audioPlayer';

type AppView = 'cover' | 'story' | 'activities' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('cover');
  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  // Vocabulary Modal state
  const [activeVocabWord, setActiveVocabWord] = useState<VocabularyWord | null>(null);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  // Checkpoint Question Modal state
  const [activeQuestion, setActiveQuestion] = useState<StoryQuestion | null>(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  // Image Generation Modal state
  const [isImageGenOpen, setIsImageGenOpen] = useState(false);
  const [targetGenPage, setTargetGenPage] = useState<StoryPage>(STORY_PAGES[0]);
  const [customPageImages, setCustomPageImages] = useState<Record<number, string>>({});
  const [coverCustomImage, setCoverCustomImage] = useState<string | undefined>(undefined);

  // Chat Buddy Drawer state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Post-reading activity results
  const [sentenceChosen, setSentenceChosen] = useState('');
  const [speakingAttempted, setSpeakingAttempted] = useState(false);

  // Universal TTS helper
  const handlePlayTTS = async (text: string) => {
    await storyAudio.playTTS(text, 'Kore', 1.0);
  };

  const handleOpenVocab = (word: VocabularyWord) => {
    setActiveVocabWord(word);
  };

  const handleMarkWordLearned = (wordStr: string) => {
    if (!learnedWords.includes(wordStr)) {
      setLearnedWords((prev) => [...prev, wordStr]);
    }
  };

  const handleTriggerQuestion = (question: StoryQuestion) => {
    setActiveQuestion(question);
  };

  const handleQuestionAnswer = (isCorrect: boolean) => {
    if (activeQuestion && !answeredQuestionIds.includes(activeQuestion.id)) {
      setAnsweredQuestionIds((prev) => [...prev, activeQuestion.id]);
      if (isCorrect) {
        setCorrectAnswersCount((prev) => prev + 1);
      }
    }
  };

  const handleOpenImageGen = (page: StoryPage) => {
    setTargetGenPage(page);
    setIsImageGenOpen(true);
  };

  const handleOpenCoverImageGen = () => {
    setTargetGenPage(STORY_PAGES[0]);
    setIsImageGenOpen(true);
  };

  const handleApplyGeneratedImage = (pageNumber: number, imageUrl: string) => {
    if (currentView === 'cover') {
      setCoverCustomImage(imageUrl);
    } else {
      setCustomPageImages((prev) => ({
        ...prev,
        [pageNumber]: imageUrl,
      }));
    }
  };

  const handleStartReading = () => {
    setCurrentPageIdx(0);
    setCurrentView('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishReading = () => {
    setCurrentView('activities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompletePostActivities = (data: {
    sequenceCorrect: boolean;
    sentenceChosen: string;
    speakingAttempted: boolean;
  }) => {
    setSentenceChosen(data.sentenceChosen);
    setSpeakingAttempted(data.speakingAttempted);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadAgain = () => {
    setCurrentPageIdx(0);
    setCurrentView('cover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-100/40 text-slate-800 flex flex-col">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <button
            onClick={() => setCurrentView('cover')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-2xl sm:text-3xl shadow-md border-2 border-emerald-300 transform hover:scale-105 transition-transform">
              🐉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base sm:text-xl tracking-tight leading-none">
                  The Little Dragon's Lost Fire
                </span>
                <span className="hidden md:inline-block bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  Grade 5 English
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-amber-700">
                Interactive Storybook • AI Narration & Art
              </span>
            </div>
          </button>

          {/* Stepper / View Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-amber-100/70 p-1.5 rounded-2xl border border-amber-300 text-xs font-black">
            <button
              onClick={() => setCurrentView('cover')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'cover' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              1. Cover
            </button>
            <button
              onClick={() => setCurrentView('story')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'story' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              2. Read Story ({currentPageIdx + 1}/8)
            </button>
            <button
              onClick={() => setCurrentView('activities')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'activities' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              3. Activities
            </button>
            <button
              onClick={() => setCurrentView('results')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'results' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              4. Results
            </button>
          </div>

          {/* Action buttons on header right */}
          <div className="flex items-center gap-2">
            {/* Quick Vocabulary Drawer / Lookup */}
            <button
              onClick={() => handleOpenVocab(VOCABULARY_LIST['dragon'])}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 border border-amber-300 transition-colors cursor-pointer"
              title="Browse Target Vocabulary Words"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Target Words ({learnedWords.length}/12)</span>
            </button>

            {/* AI Chat Buddy Drawer Toggle */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
              title="Chat with Lumi the Dragon or Sparky Tutor"
            >
              <span className="text-base">🐉</span>
              <span className="hidden sm:inline">Ask Lumi</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md font-mono hidden md:inline">
                Gemini
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentView === 'cover' && (
          <CoverScreen
            onStartReading={handleStartReading}
            onOpenVocab={handleOpenVocab}
            onOpenImageGen={handleOpenCoverImageGen}
            coverImage={coverCustomImage}
            onPlayTTS={handlePlayTTS}
          />
        )}

        {currentView === 'story' && (
          <StoryBookReader
            pages={STORY_PAGES}
            currentPageIdx={currentPageIdx}
            onPageChange={(idx) => setCurrentPageIdx(idx)}
            onOpenVocab={handleOpenVocab}
            onOpenImageGen={handleOpenImageGen}
            customPageImages={customPageImages}
            onTriggerQuestion={handleTriggerQuestion}
            answeredQuestions={answeredQuestionIds}
            onFinishReading={handleFinishReading}
          />
        )}

        {currentView === 'activities' && (
          <PostReadingActivity
            onCompleteAll={handleCompletePostActivities}
            onPlayTTS={handlePlayTTS}
          />
        )}

        {currentView === 'results' && (
          <ResultsScreen
            score={correctAnswersCount}
            totalQuestions={5}
            learnedWords={learnedWords}
            sentenceChosen={sentenceChosen}
            speakingAttempted={speakingAttempted}
            onReadAgain={handleReadAgain}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}
      </main>

      {/* Floating Dragon Chat Button on mobile */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-2xl flex items-center justify-center text-2xl border-2 border-white active:scale-90 transition-transform cursor-pointer"
          title="Chat with Lumi"
        >
          🐉
        </button>
      </div>

      {/* Vocab Modal */}
      <VocabModal
        wordData={activeVocabWord}
        onClose={() => setActiveVocabWord(null)}
        onPlayTTS={handlePlayTTS}
        onMarkLearned={handleMarkWordLearned}
        isLearned={activeVocabWord ? learnedWords.includes(activeVocabWord.word) : false}
      />

      {/* Comprehension Checkpoint Modal */}
      {activeQuestion && (
        <ComprehensionModal
          question={activeQuestion}
          onAnswer={handleQuestionAnswer}
          onClose={() => setActiveQuestion(null)}
        />
      )}

      {/* Image Generation Modal (Supports 1K, 2K, 4K affordance with gemini-3-pro-image-preview) */}
      {isImageGenOpen && (
        <ImageGenModal
          page={targetGenPage}
          onClose={() => setIsImageGenOpen(false)}
          onApplyImage={handleApplyGeneratedImage}
          currentImage={currentView === 'cover' ? coverCustomImage : customPageImages[targetGenPage.pageNumber]}
        />
      )}

      {/* Multi-turn Chatbot Drawer (gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite) */}
      <ChatBuddyDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onPlayTTS={handlePlayTTS}
      />

      {/* Footer */}
      <footer className="bg-white/80 border-t border-amber-200/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold">
            The Little Dragon's Lost Fire • Elementary English Reading Learning Cycle: Listen → Read → Understand → Answer → Speak → Retell
          </p>
          <div className="flex items-center gap-3 font-bold text-amber-800">
            <span>TTS: gemini-3.8-flash-tts</span>
            <span>•</span>
            <span>Art: gemini-3-pro-image</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
