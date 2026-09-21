import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Globe,
  Settings,
  AlertTriangle,
  QrCode,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  sessionId: string;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenAccessibility: () => void;
  onOpenEmergency: () => void;
  onOpenPrivacy: () => void;
  onOpenSessionModal: () => void;
  onOpenDemo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sessionId,
  language,
  onLanguageChange,
  onOpenAccessibility,
  onOpenEmergency,
  onOpenPrivacy,
  onOpenSessionModal,
  onOpenDemo,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [isOnline] = useState<boolean>(navigator.onLine);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">

        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Connect<span className="text-brand-600 dark:text-brand-400">Able</span> AI
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800">
                MVP
              </span>
            </div>
            <p className="hidden md:block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center: Session badge & Demo button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSessionModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 transition"
            title="Click to view QR code or share session link"
          >
            <QrCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>{sessionId}</span>
          </button>

          <button
            onClick={onOpenDemo}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge Demo</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Emergency Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition animate-pulse"
            aria-label="Open Emergency Mode"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.emergency}</span>
          </button>

          {/* Connection status indicator */}
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            title={isOnline ? t.online : t.offline}
          >
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Wifi className="w-3.5 h-3.5" />
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-500">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              </span>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 absolute left-2 text-slate-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="pl-7 pr-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Select Language"
            >
              <option value="en">EN (English)</option>
              <option value="hi">HI (हिंदी)</option>
              <option value="te">TE (తెలుగు)</option>
              <option value="kn">KN (ಕನ್ನಡ)</option>
            </select>
          </div>

          {/* Privacy First Indicator */}
          <button
            onClick={onOpenPrivacy}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
            title="Privacy First - No video stored"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy First</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            aria-label={t.accessibilitySettings}
            title={t.accessibilitySettings}
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
