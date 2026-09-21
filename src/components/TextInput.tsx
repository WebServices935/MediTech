import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface TextInputProps {
  language: LanguageCode;
  onSendMessage: (text: string) => void;
}

const QUICK_PHRASES = [
  "I need a doctor",
  "I need help",
  "Yes",
  "No",
  "Thank you",
  "Where do you have pain?",
  "Call an ambulance"
];

export const TextInput: React.FC<TextInputProps> = ({
  language,
  onSendMessage
}) => {
  const [text, setText] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleChipClick = (phrase: string) => {
    // Populate draft box so user can review/edit before explicitly clicking Send
    setText(phrase);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.typePlaceholder}
          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white resize-none shadow-sm"
          aria-label="Message text area"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {text.trim() ? "Click Send Message to transmit" : "Type your message or click a phrase below"}
          </span>

          <button
            type="submit"
            disabled={!text.trim()}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{t.send}</span>
          </button>
        </div>
      </form>

      {/* Quick Phrases */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
          Quick Patient Phrases (click to fill draft):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PHRASES.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(phrase)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition"
            >
              + {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
