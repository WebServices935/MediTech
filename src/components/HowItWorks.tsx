import React from 'react';
import { X, Mic, Keyboard, Hand, ArrowRight, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  onClose: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-150">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-brand-600" />
              <span>How ConnectAble AI Works</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Central AI Meaning Layer pipeline architecture.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Positioning Banner */}
        <div className="p-4 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 rounded-2xl text-xs space-y-1.5 text-brand-950 dark:text-brand-200">
          <div className="font-extrabold flex items-center gap-1.5 text-brand-700 dark:text-brand-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Product Positioning</span>
          </div>
          <p className="font-medium">
            ConnectAble AI is an <strong className="font-bold">AI-powered communication bridge</strong> that helps people communicate across different input and output methods. Initial hackathon MVP supports a focused vocabulary and is built with modular architecture ready for expanded trained ML models.
          </p>
        </div>

        {/* Visual Pipeline Flow Chart */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Cross-Modal Pipeline Architecture:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">

            {/* Step 1 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center mx-auto">1</div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">INPUT MODALITY</h4>
              <p className="text-[11px] text-slate-500">Speech, Text, Gesture or Sign</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center mx-auto">2</div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">AI RECOGNITION</h4>
              <p className="text-[11px] text-slate-500">MediaPipe Vision / Speech API</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-brand-50 dark:bg-brand-950/60 rounded-xl border border-brand-300 dark:border-brand-700 space-y-2 ring-2 ring-brand-500/20">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center mx-auto">3</div>
              <h4 className="font-bold text-xs text-brand-950 dark:text-brand-200">NORMALIZED MEANING</h4>
              <p className="text-[11px] text-brand-700 dark:text-brand-300">Intent + Urgency + Confidence</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mx-auto">4</div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">TARGET OUTPUT</h4>
              <p className="text-[11px] text-slate-500">Text, TTS Speech or Visual Sign</p>
            </div>

          </div>
        </div>

        {/* Modality Specific Diagram Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <span className="font-bold text-teal-600 block mb-1">🎤 Speech Input:</span>
            Speech → Web Speech API → Meaning ("I need help") → Receiver Format
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <span className="font-bold text-sky-600 block mb-1">✋ Gesture Input:</span>
            Gesture (Thumbs Up) → Computer Vision → Meaning (HELP) → Text / Speech
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <span className="font-bold text-indigo-600 block mb-1">🤟 Sign Language Input:</span>
            Sign (DOCTOR) → MediaPipe Landmarks → Meaning (DOCTOR) → Text / Speech
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <span className="font-bold text-amber-600 block mb-1">⌨️ Text Input:</span>
            Text → Intent Normalizer → TTS Speech / Visual Sign Card
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition"
        >
          Got it! Back to App
        </button>

      </div>
    </div>
  );
};
