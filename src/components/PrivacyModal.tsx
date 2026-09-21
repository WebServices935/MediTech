import React from 'react';
import { X, ShieldCheck, Camera, Mic, Trash2, Lock } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
  onClearHistory: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose, onClearHistory }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-150">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Privacy First Commitment
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Principles */}
        <div className="space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300">

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <Camera className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Zero Video Storage</div>
              <div>Camera feed is processed locally in real time for hand landmarks. Video frames are never recorded or saved to servers.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <Mic className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Active Microphone Only</div>
              <div>Microphone is accessed strictly when you activate Speech Input mode and disengages immediately when stopped.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Browser Local Storage Control</div>
              <div>Session message history is stored transiently on your device and can be wiped at any time.</div>
            </div>
          </div>

        </div>

        {/* Clear History Direct Action */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClearHistory();
              onClose();
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Clear Conversation History</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
