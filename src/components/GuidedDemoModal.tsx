import React, { useState } from 'react';
import { X, Sparkles, Play, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { ConversationMessage } from '../types';

interface GuidedDemoModalProps {
  onClose: () => void;
  onRunStep: (stepNumber: number) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({ onClose, onRunStep }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      step: 1,
      title: "Step 1: Person A Uses Gesture / Sign (HELP)",
      description: "Person A (cannot speak) performs gesture 'HELP'. AI detects 'I need help.' and delivers text/speech to Person B.",
      sender: "Person A",
      modality: "Gesture / Sign ✋🤟",
      output: "Text / Speech 📝🔊"
    },
    {
      step: 2,
      title: "Step 2: Person B Responds with Speech",
      description: "Person B speaks 'Where do you need help?'. System converts speech to text on Person A's panel.",
      sender: "Person B",
      modality: "Speech 🎤",
      output: "Text 📝"
    },
    {
      step: 3,
      title: "Step 3: Person A Signs DOCTOR",
      description: "Person A signs 'DOCTOR'. AI engine normalizes to 'I need a doctor.' and reads aloud to Person B.",
      sender: "Person A",
      modality: "Sign Language 🤟",
      output: "Speech + Visual Sign 🔊🤟"
    },
    {
      step: 4,
      title: "Step 4: Low Confidence Safety Flow",
      description: "System receives ambiguous input (65% confidence). Triggers 'I'm not completely sure' confirmation prompt.",
      sender: "Person A",
      modality: "Gesture ✋ (Ambiguous)",
      output: "Confirmation Dialog ⚠️"
    }
  ];

  const handleExecuteStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    onRunStep(stepNumber);
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Hackathon Judge Guided Demo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience the complete 4-step cross-modal communication bridge flow.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((s) => {
            const isCompleted = completedSteps.includes(s.step);
            const isActive = activeStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-amber-50 border-amber-500 dark:bg-amber-950/40 dark:border-amber-600 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-amber-700 dark:text-amber-400">
                      {s.title}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {s.description}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Sender: {s.sender} • Input: {s.modality} → Target: {s.output}
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteStep(s.step)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Trigger Step {s.step}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCompletedSteps([])}
            className="text-xs text-slate-500 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Steps</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition"
          >
            Return to Split-Screen Room
          </button>
        </div>

      </div>
    </div>
  );
};
