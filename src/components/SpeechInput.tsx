import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle, Send } from 'lucide-react';
import { LanguageCode } from '../types';
import { speechService } from '../services/speechService';
import { translations } from '../i18n/translations';

interface SpeechInputProps {
  language: LanguageCode;
  onSendMessage: (text: string, confidence?: number) => void;
  senderName: string;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({
  language,
  onSendMessage,
  senderName
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSupported = speechService.isSupported();
  const t = translations[language];

  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setErrorMessage(null);

      speechService.startListening(
        language,
        (result) => {
          setTranscript(result.transcript);
          setConfidence(result.confidence);
          // Do NOT auto-send. Keep transcript in draft box for manual user confirmation.
        },
        (err) => {
          setErrorMessage(err);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const handleSendManual = () => {
    if (transcript.trim()) {
      onSendMessage(transcript.trim(), confidence || 0.94);
      setTranscript('');
      setConfidence(null);
      if (isListening) {
        speechService.stopListening();
        setIsListening(false);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Speech Recognition Unsupported</span>
        </div>
        <p className="text-amber-700 dark:text-amber-400">
          Speech recognition is not supported in this browser. Please use Chrome or another supported browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Mic Control Button */}
      <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">

        <button
          onClick={handleToggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform shadow-lg ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/40 scale-105'
              : 'bg-brand-600 hover:bg-brand-700 text-white hover:scale-105 shadow-brand-600/30'
          }`}
          aria-label={isListening ? "Stop Listening" : "Start Listening"}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <span className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
          {isListening ? t.listening : "Tap microphone to speak"}
        </span>

        {confidence !== null && (
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-semibold">
            {t.confidence}: {Math.round(confidence * 100)}%
          </div>
        )}
      </div>

      {/* Draft Transcript Display & Manual Send Button */}
      {transcript ? (
        <div className="p-3 bg-white dark:bg-slate-900 border-2 border-brand-300 dark:border-brand-700 rounded-xl space-y-3 shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-brand-700 dark:text-brand-400">
            <span>Speech Draft ({senderName}):</span>
            <span className="text-[11px] text-slate-500 font-medium">Click Send button below to deliver</span>
          </div>

          <p className="text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            "{transcript}"
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setTranscript('')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition"
            >
              Clear Draft
            </button>

            <button
              onClick={handleSendManual}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 text-center text-xs text-slate-500 dark:text-slate-400 italic">
          Spoken words will appear here as a draft. Click "Send Message" to send.
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

    </div>
  );
};
