import React from 'react';
import { X, Eye, Volume2, Type, Sun, Moon, Sparkles } from 'lucide-react';
import { UserPreferences } from '../types';

interface AccessibilitySettingsProps {
  preferences: UserPreferences;
  onUpdatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  preferences,
  onUpdatePreference,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-150">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-600" />
            <span>Accessibility Preferences</span>
          </h2>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Stack */}
        <div className="space-y-4 text-sm font-medium">

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">High Contrast Mode</div>
              <div className="text-xs text-slate-500">Enhance border and text contrast for low vision.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.highContrast}
              onChange={(e) => onUpdatePreference('highContrast', e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
            />
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Large Text Scaling</div>
              <div className="text-xs text-slate-500">Increase base font sizing throughout the app.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.largeText}
              onChange={(e) => onUpdatePreference('largeText', e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
            />
          </div>

          {/* Audio Feedback */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Audio Feedback</div>
              <div className="text-xs text-slate-500">Play sound cues on message delivery & recognition.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.audioFeedback}
              onChange={(e) => onUpdatePreference('audioFeedback', e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Reduce Motion</div>
              <div className="text-xs text-slate-500">Minimize animations and transition effects.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => onUpdatePreference('reducedMotion', e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
            />
          </div>

          {/* Theme Selector */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Color Theme</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdatePreference('theme', 'light')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  preferences.theme === 'light'
                    ? 'bg-white border-brand-500 text-brand-900 font-bold ring-2 ring-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => onUpdatePreference('theme', 'dark')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  preferences.theme === 'dark'
                    ? 'bg-slate-950 border-brand-500 text-white font-bold ring-2 ring-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition"
        >
          Save & Close
        </button>

      </div>
    </div>
  );
};
