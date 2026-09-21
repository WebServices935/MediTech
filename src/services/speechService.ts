import { LanguageCode } from '../types';

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export type SpeechCallback = (result: SpeechRecognitionResultPayload) => void;
export type ErrorCallback = (error: string) => void;

// Language code mapping for Web Speech API
const LANG_MAP: Record<LanguageCode, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN'
};

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: SpeechCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  private initRecognition() {
    if (!this.isSupported()) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
  }

  public startListening(
    lang: LanguageCode,
    onResult: SpeechCallback,
    onError: ErrorCallback
  ) {
    if (!this.isSupported()) {
      onError("Speech recognition is not supported in this browser. Please use Chrome or another supported browser.");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    this.recognition.lang = LANG_MAP[lang] || 'en-US';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      let confidence = 0.95;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          if (result[0].confidence) {
            confidence = result[0].confidence;
          }
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text && this.onResultCallback) {
        this.onResultCallback({
          transcript: text.trim(),
          isFinal: finalTranscript.length > 0,
          confidence: Math.round(confidence * 100) / 100
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      let errorMsg = `Speech recognition error: ${event.error}`;
      if (event.error === 'not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone permissions.";
      } else if (event.error === 'no-speech') {
        errorMsg = "No speech detected. Please speak clearly into the microphone.";
      }
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMsg);
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (err) {
      if (this.onErrorCallback) {
        this.onErrorCallback("Failed to start speech recognition.");
      }
      this.isListening = false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error("Error stopping speech recognition:", e);
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
