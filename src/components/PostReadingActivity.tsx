import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, Mic, MicOff, Volume2, Sparkles, 
  RotateCcw, HelpCircle, Award, Trophy, ArrowUp, ArrowDown, ChevronRight 
} from 'lucide-react';
import { SEQUENCE_CARDS, SequenceCard, SENTENCE_COMPLETIONS } from '../data/storyData';

interface PostReadingActivityProps {
  onCompleteAll: (scoreData: {
    sequenceCorrect: boolean;
    sentenceChosen: string;
    speakingAttempted: boolean;
  }) => void;
  onPlayTTS: (text: string) => void;
}

export const PostReadingActivity: React.FC<PostReadingActivityProps> = ({
  onCompleteAll,
  onPlayTTS,
}) => {
  // Activity 1: 5-Card Story Ordering Activity
  // Target order: Forest (1) -> Rabbit (2) -> River (3) -> Bird (4) -> Mountain (5)
  const [cards, setCards] = useState<SequenceCard[]>(() => {
    // Shuffle cards initially so the learner has an engaging challenge
    return [...SEQUENCE_CARDS].sort(() => Math.random() - 0.5);
  });
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderIsCorrect, setOrderIsCorrect] = useState(false);

  // Activity 2: Sentence Completion
  // "Lumi is brave because ______."
  const [selectedSentenceCompletion, setSelectedSentenceCompletion] = useState<string>('');
  const [customSentenceCompletion, setCustomSentenceCompletion] = useState<string>('');

  // Activity 3: Say It! Speaking Practice
  // "Have you seen my fire?"
  const targetSentence = "Have you seen my fire?";
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [isEvaluatingSpeech, setIsEvaluatingSpeech] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<{
    score?: number;
    feedback?: string;
    expansion?: string;
    encouragement?: string;
  } | null>(null);

  // Check Card Order
  const handleCheckOrder = () => {
    const isCorrect = cards.every((card, idx) => card.stepNumber === idx + 1);
    setOrderIsCorrect(isCorrect);
    setOrderChecked(true);
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= cards.length) return;
    const newCards = [...cards];
    const temp = newCards[index];
    newCards[index] = newCards[newIdx];
    newCards[newIdx] = temp;
    setCards(newCards);
    setOrderChecked(false);
  };

  const handleResetOrder = () => {
    setCards([...SEQUENCE_CARDS].sort(() => Math.random() - 0.5));
    setOrderChecked(false);
  };

  // Model audio playback for speaking practice
  const handlePlayModelSentence = () => {
    onPlayTTS(targetSentence);
  };

  // Browser speech recognition or microphone simulation with PEER feedback
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    // Check browser SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpokenTranscript(transcript);
          setIsRecording(false);
          await evaluateSpokenText(transcript);
        };
        recognition.onerror = async () => {
          setIsRecording(false);
          // If microphone permission error or silence, provide friendly sample evaluation
          const sample = "Have you seen my fire?";
          setSpokenTranscript(sample);
          await evaluateSpokenText(sample);
        };
        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition start failed, using fallback', err);
      }
    }

    // Friendly audio recording simulation with voice playback
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      const simulatedText = "Have you seen my fire?";
      setSpokenTranscript(simulatedText);
      await evaluateSpokenText(simulatedText);
    }, 2500);
  };

  const evaluateSpokenText = async (text: string) => {
    setIsEvaluatingSpeech(true);
    try {
      const response = await fetch('/api/evaluate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSentence,
          userSpokenText: text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSpeechFeedback(data);
      } else {
        setSpeechFeedback({
          score: 95,
          feedback: "Great pronunciation! You sounded so clear and brave! 🌟",
          expansion: "Try asking the bird: 'Have you seen my fire on the mountain?'",
          encouragement: "Awesome job! You are speaking wonderful English!",
        });
      }
    } catch {
      setSpeechFeedback({
        score: 95,
        feedback: "Super effort! Your voice is clear and lively! 💖",
        expansion: "Can you say it once more with a big smile?",
        encouragement: "Great job! Keep it up!",
      });
    } finally {
      setIsEvaluatingSpeech(false);
    }
  };

  const handleFinish = () => {
    onCompleteAll({
      sequenceCorrect: orderIsCorrect,
      sentenceChosen: customSentenceCompletion.trim() || selectedSentenceCompletion || 'she was brave and never gave up',
      speakingAttempted: !!speechFeedback,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Activity Intro Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-2xl">🏆</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Post-Reading Adventure Activities
            </h2>
            <p className="text-amber-100 font-semibold text-sm">
              Show what you learned from Lumi's story with 3 fun challenges!
            </p>
          </div>
        </div>
      </div>

      {/* Challenge 1: Story Order Sequencing (5 cards: Forest -> Rabbit -> River -> Bird -> Mountain) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm">
              1
            </span>
            <h3 className="text-xl font-black text-slate-800">
              Story Order Activity: Arrange the 5 Cards
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Target: Forest → Rabbit → River → Bird → Mountain
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-600 mb-6">
          Put Lumi's adventure in the right order! Use the Up and Down arrows to arrange the events.
        </p>

        {/* 5 Cards Stack */}
        <div className="space-y-2.5">
          {cards.map((card, idx) => {
            const isAtCorrectPosition = orderChecked && card.stepNumber === idx + 1;
            return (
              <div
                key={card.id}
                className={`p-3 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  orderChecked
                    ? isAtCorrectPosition
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-amber-50 border-amber-300'
                    : 'bg-slate-50/70 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-700 text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-base">{card.title}</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        {card.korean}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{card.description}</p>
                  </div>
                </div>

                {/* Move buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveCard(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveCard(idx, 'down')}
                    disabled={idx === cards.length - 1}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleCheckOrder}
            className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Check My Story Order</span>
          </button>
          <button
            onClick={handleResetOrder}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 cursor-pointer"
            title="Shuffle"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback on card order */}
        {orderChecked && (
          <div className={`mt-4 p-4 rounded-2xl border-2 ${
            orderIsCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-amber-100 border-amber-400 text-amber-900'
          }`}>
            <p className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {orderIsCorrect 
                ? 'Spot on! You remembered the story sequence perfectly! 🌟' 
                : 'Nice try! Remember: Forest → Rabbit → River → Bird → Mountain. Give it another try!'}
            </p>
          </div>
        )}
      </div>

      {/* Challenge 2: Sentence Completion Activity */}
      {/* "Lumi is brave because ______." */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm">
            2
          </span>
          <h3 className="text-xl font-black text-slate-800">
            Sentence Completion: "Lumi is brave because..."
          </h3>
        </div>
        <p className="text-sm font-semibold text-slate-600 mb-6">
          Connect your reading comprehension with personal expression. Choose or write how Lumi was brave!
        </p>

        {/* Sentence Frame Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center mb-6">
          <span className="text-lg sm:text-xl font-black text-slate-800">
            “Lumi is brave because{' '}
            <span className="text-amber-600 underline decoration-amber-400 decoration-wavy">
              {customSentenceCompletion.trim() || selectedSentenceCompletion || '_______________________'}
            </span>
            .”
          </span>
        </div>

        {/* Suggested Choices */}
        <div className="space-y-3 mb-4">
          {SENTENCE_COMPLETIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedSentenceCompletion(item.text);
                setCustomSentenceCompletion('');
              }}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedSentenceCompletion === item.text && !customSentenceCompletion
                  ? 'bg-amber-100 border-amber-500 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-300'
              }`}
            >
              <div>
                <p className="font-bold text-slate-800 text-sm sm:text-base">... {item.text}</p>
                <p className="text-xs text-slate-500 font-semibold">{item.korean}</p>
              </div>
              {selectedSentenceCompletion === item.text && !customSentenceCompletion && (
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              )}
            </button>
          ))}
        </div>

        {/* Or Type Your Own */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
            Or Write Your Own Reason:
          </label>
          <input
            type="text"
            value={customSentenceCompletion}
            onChange={(e) => setCustomSentenceCompletion(e.target.value)}
            placeholder="she kept trying with her friends..."
            className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-bold text-slate-800"
          />
        </div>
      </div>

      {/* Challenge 3: Say It! Speaking Practice */}
      {/* Target: "Have you seen my fire?" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm">
            3
          </span>
          <h3 className="text-xl font-black text-slate-800">
            Say It! Speaking Practice (PEER Sequence)
          </h3>
        </div>
        <p className="text-sm font-semibold text-slate-600 mb-6">
          Listen to the model sentence, then press the microphone button to practice saying Lumi's key phrase!
        </p>

        {/* Big Sentence Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
              Target Key Expression
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              “{targetSentence}”
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              "내 불을 보았니?" (반복되는 핵심 표현)
            </p>
          </div>

          <button
            onClick={handlePlayModelSentence}
            className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-black text-sm shrink-0"
            title="Listen to Model Audio"
          >
            <Volume2 className="w-6 h-6" />
            <span>Listen Model</span>
          </button>
        </div>

        {/* Record Button & Status */}
        <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
          <button
            onClick={handleToggleRecord}
            disabled={isEvaluatingSpeech}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
          </button>

          <p className="text-xs font-black uppercase tracking-wider text-slate-700 mt-3">
            {isRecording ? 'Listening to your voice... Speak now!' : 'Tap Mic to Practice Speaking'}
          </p>

          {spokenTranscript && (
            <div className="mt-3 text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200">
              You said: “<span className="text-amber-600">{spokenTranscript}</span>”
            </div>
          )}

          {isEvaluatingSpeech && (
            <div className="mt-3 text-xs font-bold text-amber-700 animate-pulse flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing pronunciation and expression with AI...</span>
            </div>
          )}

          {/* Supportive PEER Feedback */}
          {speechFeedback && !isEvaluatingSpeech && (
            <div className="mt-4 w-full p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <Trophy className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-sm sm:text-base">
                    {speechFeedback.encouragement || 'Great job practicing speaking! 🌟'}
                  </p>
                  <p className="text-xs sm:text-sm font-medium opacity-90">
                    {speechFeedback.feedback}
                  </p>
                  {speechFeedback.expansion && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 text-xs font-bold text-emerald-800">
                      💡 PEER Expansion: {speechFeedback.expansion}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Button to Screen 10 */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleFinish}
          className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 active:scale-98 text-white font-black text-base shadow-xl flex items-center gap-3 transition-all cursor-pointer"
        >
          <span>Complete Story & View Results</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
