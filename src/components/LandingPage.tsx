import React, { useState } from 'react';
import {
  MessageSquare,
  Mic,
  Keyboard,
  Hand,
  Sparkles,
  Users,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface LandingPageProps {
  language: LanguageCode;
  sessionId: string;
  onStartConversation: (role: 'personA' | 'personB' | 'both') => void;
  onJoinSession: (id: string) => void;
  onOpenHowItWorks: () => void;
  onOpenDemo: () => void;
  onOpenEmergency: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  sessionId,
  onStartConversation,
  onJoinSession,
  onOpenHowItWorks,
  onOpenDemo,
  onOpenEmergency,
  onOpenPrivacy
}) => {
  const t = translations[language];
  const [joinInput, setJoinInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<'both' | 'personA' | 'personB'>('both');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinInput.trim()) {
      onJoinSession(joinInput.trim().toUpperCase());
      onStartConversation('both');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300 text-xs sm:text-sm font-semibold animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Hackathon MVP • Accessible Communication Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Connect<span className="text-brand-600 dark:text-brand-400">Able</span> AI
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300">
          "{t.tagline}"
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.shortDesc} A two-person real-time bridge converting between <strong className="text-slate-800 dark:text-slate-200 font-semibold">Speech</strong>, <strong className="text-slate-800 dark:text-slate-200 font-semibold">Text</strong>, <strong className="text-slate-800 dark:text-slate-200 font-semibold">Gestures</strong>, and <strong className="text-slate-800 dark:text-slate-200 font-semibold">Sign Language</strong> seamlessly.
        </p>

        {/* Role Selection Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 max-w-xl mx-auto text-left">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            {t.whoAreYou}
          </label>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedRole('both')}
              className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'both'
                  ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/60 dark:border-brand-500 dark:text-brand-200 ring-2 ring-brand-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold">Split-Screen (Both)</span>
            </button>

            <button
              onClick={() => setSelectedRole('personA')}
              className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'personA'
                  ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/60 dark:border-brand-500 dark:text-brand-200 ring-2 ring-brand-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">A</span>
              <span className="text-xs font-bold">{t.personA}</span>
            </button>

            <button
              onClick={() => setSelectedRole('personB')}
              className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'personB'
                  ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/60 dark:border-brand-500 dark:text-brand-200 ring-2 ring-brand-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">B</span>
              <span className="text-xs font-bold">{t.personB}</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onStartConversation(selectedRole)}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>{t.startConversation}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto py-3.5 px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.startDemo}</span>
            </button>
          </div>
        </div>

        {/* Join Session Direct Form */}
        <form onSubmit={handleJoin} className="flex items-center justify-center gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Enter Session ID e.g. CONNECT-4821"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Join</span>
          </button>
        </form>

      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Speech Recognition</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Live Web Speech API transcription in English, Hindi, Telugu & Kannada with confidence scoring.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-3 block">Speech ↔ Text / Sign</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Hand className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Gesture & Sign AI</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Camera-based landmark detection using MediaPipe with demo classifier for 10+ core gestures.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-3 block">Gesture / Sign ↔ Text</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Emergency & Repair</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              One-tap emergency communication cards and quick repair actions ("Please repeat", "Type it").
            </p>
          </div>
          <button
            onClick={onOpenEmergency}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-3 text-left hover:underline"
          >
            Open Emergency Mode →
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Privacy & Offline</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Zero video storage guarantee. Built-in offline phrase cache for low connectivity situations.
            </p>
          </div>
          <button
            onClick={onOpenPrivacy}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-3 text-left hover:underline"
          >
            Privacy Guarantee →
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <button onClick={onOpenHowItWorks} className="hover:underline flex items-center gap-1 font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.learnHowItWorks}</span>
          </button>
          <button onClick={onOpenPrivacy} className="hover:underline font-semibold">
            Privacy Policy
          </button>
        </div>
        <div>
          <span>Current Session: <strong className="text-slate-800 dark:text-slate-200 font-bold">{sessionId}</strong></span>
        </div>
      </div>

    </div>
  );
};
