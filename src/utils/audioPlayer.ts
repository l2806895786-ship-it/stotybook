// Audio Player Utility for Gemini 3.8 Flash TTS with browser fallback

class StoryAudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>();

  // Play text using server-side Gemini 3.8 Flash TTS
  async playTTS(
    text: string,
    voice: string = 'Kore',
    speed: number = 1.0,
    onEnded?: () => void
  ): Promise<void> {
    this.stop();

    const cacheKey = `${voice}_${text.trim()}`;

    try {
      let audioBase64 = this.audioCache.get(cacheKey);

      if (!audioBase64) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim(),
            voice,
            style: 'Warm, expressive, gentle storybook narrator speaking clearly for Grade 5 elementary English learners',
          }),
        });

        if (!response.ok) {
          throw new Error(`TTS server error (${response.status})`);
        }

        const data = await response.json();
        if (typeof data.audio === 'string') {
          audioBase64 = data.audio;
          this.audioCache.set(cacheKey, data.audio);
        } else {
          throw new Error('No audio returned');
        }
      }

      const mimeType = 'audio/wav';
      const audioUrl = `data:${mimeType};base64,${audioBase64}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = speed;

      audio.onended = () => {
        this.currentAudio = null;
        if (onEnded) onEnded();
      };

      audio.onerror = () => {
        console.warn('Audio tag playback failed, falling back to Web Speech API');
        this.fallbackWebSpeech(text, speed, onEnded);
      };

      this.currentAudio = audio;
      await audio.play();
    } catch (err) {
      console.warn('Gemini TTS failed, falling back to Web Speech synthesis:', err);
      this.fallbackWebSpeech(text, speed, onEnded);
    }
  }

  // Graceful browser speech synthesis fallback
  private fallbackWebSpeech(text: string, speed: number, onEnded?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speed * 0.9;
    utterance.onend = () => {
      if (onEnded) onEnded();
    };
    utterance.onerror = () => {
      if (onEnded) onEnded();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const storyAudio = new StoryAudioService();
