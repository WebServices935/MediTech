import { LanguageCode } from '../types';

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private rate: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public setRate(rate: number) {
    this.rate = rate;
  }

  public speak(text: string, lang: LanguageCode = 'en', onEnd?: () => void) {
    if (!this.synth) {
      console.warn("Speech Synthesis is not supported in this browser.");
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;

    const langCodes: Record<LanguageCode, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      kn: 'kn-IN'
    };

    utterance.lang = langCodes[lang] || 'en-US';

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(lang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("TTS Utterance error:", e);
      this.isSpeaking = false;
      this.isPaused = false;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      isSupported: this.isSupported()
    };
  }
}

export const ttsService = new TTSService();
