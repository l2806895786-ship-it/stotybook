import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Settings2 } from 'lucide-react';

interface NarrationBarProps {
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onPlayPage: () => void;
  onPause: () => void;
  onReplay: () => void;
  currentSentenceIdx: number;
  totalSentences: number;
  voice: string;
  onChangeVoice: (voice: string) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

export const NarrationBar: React.FC<NarrationBarProps> = ({
  isPlaying,
  isLoadingAudio,
  onPlayPage,
  onPause,
  onReplay,
  currentSentenceIdx,
  totalSentences,
  voice,
  onChangeVoice,
  speed,
  onChangeSpeed,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const voiceOptions = [
    { id: 'Kore', label: 'Kore (Warm Storyteller)', emoji: '🌸' },
    { id: 'Puck', label: 'Puck (Playful Narrator)', emoji: '✨' },
    { id: 'Fenrir', label: 'Fenrir (Brave & Deep)', emoji: '🛡️' },
    { id: 'Zephyr', label: 'Zephyr (Gentle Calm)', emoji: '🍃' },
  ];

  return (
    <div className="relative w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-amber-300 flex flex-wrap items-center justify-between gap-3">
      {/* Play / Pause / Replay buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={isPlaying ? onPause : onPlayPage}
          disabled={isLoadingAudio}
          className="h-12 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-white font-black text-sm shadow-lg flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
        >
          {isLoadingAudio ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Voice Readying...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white ml-0.5" />
              <span>Read Aloud</span>
            </>
          )}
        </button>

        <button
          onClick={onReplay}
          className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 active:scale-90 transition-all cursor-pointer"
          title="Replay Page from Beginning"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Center status info: Sentence indicator and Model label */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gemini 3.8 Flash TTS</span>
        </div>

        {totalSentences > 0 && (
          <div className="text-xs font-extrabold text-slate-500">
            Sentence <span className="text-amber-600">{currentSentenceIdx + 1}</span> / {totalSentences}
          </div>
        )}
      </div>

      {/* Voice and Speed settings button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
            showSettings
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">Voice & Speed</span>
        </button>
      </div>

      {/* Dropdown settings popup */}
      {showSettings && (
        <div className="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-2xl p-4 shadow-2xl border-2 border-amber-300 z-30 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
            Narrator Voice (gemini-3.8-flash-tts)
          </div>
          <div className="space-y-1 mb-4">
            {voiceOptions.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onChangeVoice(v.id)}
                className={`w-full p-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  voice === v.id
                    ? 'bg-amber-100 text-amber-900 border border-amber-400'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{v.emoji} {v.label}</span>
                {voice === v.id && <span className="text-amber-600 text-xs font-black">✓</span>}
              </button>
            ))}
          </div>

          <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
            Reading Pace (Speed)
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeSpeed(s)}
                className={`py-1.5 rounded-lg text-xs font-extrabold cursor-pointer border ${
                  speed === s
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s}x {s === 0.8 ? 'Slow' : s === 1.0 ? 'Normal' : 'Fast'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
