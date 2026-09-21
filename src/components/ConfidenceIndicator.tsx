import React, { useState } from 'react';
import { AlertTriangle, Check, Edit2, RotateCcw } from 'lucide-react';
import { ConversationMessage } from '../types';
import { confidenceService } from '../services/confidenceService';

interface ConfidenceIndicatorProps {
  message: ConversationMessage;
  onConfirm: () => void;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  message,
  onConfirm
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [correctedText, setCorrectedText] = useState(message.normalizedText);

  return (
    <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-xl space-y-3 text-slate-900 dark:text-slate-100">

      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
        <span>I'm not completely sure. (Confidence: {confidenceService.formatPercentage(message.confidence)})</span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60">
        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
          Possible AI Interpretation:
        </span>
        {isEditing ? (
          <input
            type="text"
            value={correctedText}
            onChange={(e) => setCorrectedText(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
        ) : (
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            "{message.normalizedText}"
          </p>
        )}
      </div>

      {/* Verification Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => {
            message.normalizedText = correctedText;
            onConfirm();
          }}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
        >
          <Check className="w-3.5 h-3.5" />
          <span>✓ Confirm</span>
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Save Edit' : '✏️ Correct'}</span>
        </button>

        <button
          onClick={onConfirm}
          className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 dark:bg-amber-900 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>🔄 Try Again</span>
        </button>
      </div>

    </div>
  );
};
