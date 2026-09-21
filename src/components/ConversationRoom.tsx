import React, { useState } from 'react';
import {
  Users,
  User,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { LanguageCode, ConversationMessage } from '../types';
import { ParticipantPanel } from './ParticipantPanel';
import { translations } from '../i18n/translations';

interface ConversationRoomProps {
  sessionId: string;
  language: LanguageCode;
  messages: ConversationMessage[];
  personAInput: any;
  setPersonAInput: any;
  personAOutput: any;
  setPersonAOutput: any;
  personBInput: any;
  setPersonBInput: any;
  personBOutput: any;
  setPersonBOutput: any;
  onSendMessage: (senderId: 'personA' | 'personB', modality: any, content: string, confidence?: number) => void;
  onConfirmMessage: (id: string) => void;
  onClearHistory: () => void;
  onBackToLanding: () => void;
  initialRole?: 'both' | 'personA' | 'personB';
}

export const ConversationRoom: React.FC<ConversationRoomProps> = ({
  sessionId,
  language,
  messages,
  personAInput,
  setPersonAInput,
  personAOutput,
  setPersonAOutput,
  personBInput,
  setPersonBInput,
  personBOutput,
  setPersonBOutput,
  onSendMessage,
  onConfirmMessage,
  onClearHistory,
  onBackToLanding,
  initialRole = 'both'
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'personA' | 'personB'>(initialRole);
  const t = translations[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">

      {/* Control Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBackToLanding}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
              Session: <span className="text-brand-600 dark:text-brand-400 font-mono">{sessionId}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Two-Person Real-Time Communication Bridge
            </p>
          </div>
        </div>

        {/* View Mode Toggle (Both vs Single User) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'both'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Split View (Both)
            </button>

            <button
              onClick={() => setViewMode('personA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'personA'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Person A Only
            </button>

            <button
              onClick={() => setViewMode('personB')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'personB'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Person B Only
            </button>
          </div>

          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-400 dark:hover:text-rose-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            title={t.clearHistory}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.clearHistory}</span>
          </button>
        </div>

      </div>

      {/* Main Split-Screen Panels */}
      <div className={`grid gap-6 ${
        viewMode === 'both'
          ? 'grid-cols-1 lg:grid-cols-2'
          : 'grid-cols-1 max-w-3xl mx-auto'
      }`}>

        {/* Person A Panel */}
        {(viewMode === 'both' || viewMode === 'personA') && (
          <ParticipantPanel
            participantId="personA"
            participantName="Person A"
            badgeColor="bg-brand-600"
            inputModality={personAInput}
            onSetInputModality={setPersonAInput}
            outputModality={personAOutput}
            onSetOutputModality={setPersonAOutput}
            language={language}
            messages={messages}
            onSendMessage={(modality, content, conf) => onSendMessage('personA', modality, content, conf)}
            onConfirmMessage={onConfirmMessage}
            onSendRepairAction={(act) => onSendMessage('personA', 'text', act, 0.99)}
          />
        )}

        {/* Person B Panel */}
        {(viewMode === 'both' || viewMode === 'personB') && (
          <ParticipantPanel
            participantId="personB"
            participantName="Person B"
            badgeColor="bg-sky-600"
            inputModality={personBInput}
            onSetInputModality={setPersonBInput}
            outputModality={personBOutput}
            onSetOutputModality={setPersonBOutput}
            language={language}
            messages={messages}
            onSendMessage={(modality, content, conf) => onSendMessage('personB', modality, content, conf)}
            onConfirmMessage={onConfirmMessage}
            onSendRepairAction={(act) => onSendMessage('personB', 'text', act, 0.99)}
          />
        )}

      </div>

    </div>
  );
};
