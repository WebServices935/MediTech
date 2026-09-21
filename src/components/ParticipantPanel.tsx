import React from 'react';
import {
  Mic,
  Keyboard,
  Hand,
  Volume2,
  FileText,
  Sparkles,
  User,
  Settings2
} from 'lucide-react';
import { CommunicationModality, OutputModality, LanguageCode, ConversationMessage } from '../types';
import { SpeechInput } from './SpeechInput';
import { TextInput } from './TextInput';
import { GestureCamera } from './GestureCamera';
import { SignCamera } from './SignCamera';
import { MessageBubble } from './MessageBubble';
import { CommunicationRepair } from './CommunicationRepair';
import { translations } from '../i18n/translations';

interface ParticipantPanelProps {
  participantId: 'personA' | 'personB';
  participantName: string;
  badgeColor: string;
  inputModality: CommunicationModality;
  onSetInputModality: (modality: CommunicationModality) => void;
  outputModality: OutputModality;
  onSetOutputModality: (modality: OutputModality) => void;
  language: LanguageCode;
  messages: ConversationMessage[];
  onSendMessage: (modality: CommunicationModality, content: string, confidence?: number) => void;
  onConfirmMessage: (id: string) => void;
  onSendRepairAction: (text: string) => void;
}

export const ParticipantPanel: React.FC<ParticipantPanelProps> = ({
  participantId,
  participantName,
  badgeColor,
  inputModality,
  onSetInputModality,
  outputModality,
  onSetOutputModality,
  language,
  messages,
  onSendMessage,
  onConfirmMessage,
  onSendRepairAction
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg overflow-hidden transition-all">

      {/* Panel Top Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`w-8 h-8 rounded-full text-white font-black text-sm flex items-center justify-center shadow-md ${badgeColor}`}>
            {participantId === 'personA' ? 'A' : 'B'}
          </span>
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
              {participantName}
            </h2>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Input: <span className="text-brand-600 dark:text-brand-400 font-bold uppercase">{inputModality}</span> • Output: <span className="text-sky-600 dark:text-sky-400 font-bold uppercase">{outputModality}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="p-3 bg-slate-100/70 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Input Selector */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t.inputMethod}:
          </label>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => onSetInputModality('speech')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                inputModality === 'speech'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Speech Input"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Speech</span>
            </button>

            <button
              onClick={() => onSetInputModality('text')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                inputModality === 'text'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Text Input"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Text</span>
            </button>

            <button
              onClick={() => onSetInputModality('gesture')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                inputModality === 'gesture'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Gesture Camera"
            >
              <Hand className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Gesture</span>
            </button>

            <button
              onClick={() => onSetInputModality('sign')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                inputModality === 'sign'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Sign Camera"
            >
              <Hand className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xl:inline">Sign</span>
            </button>
          </div>
        </div>

        {/* Output Selector */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t.outputMethod}:
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => onSetOutputModality('text')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                outputModality === 'text'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              onClick={() => onSetOutputModality('speech')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                outputModality === 'speech'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Speech</span>
            </button>

            <button
              onClick={() => onSetOutputModality('sign')}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                outputModality === 'sign'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Sign</span>
            </button>
          </div>
        </div>

      </div>

      {/* Input Action Controls Container */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        {inputModality === 'speech' && (
          <SpeechInput
            language={language}
            onSendMessage={(text, conf) => onSendMessage('speech', text, conf)}
            senderName={participantName}
          />
        )}

        {inputModality === 'text' && (
          <TextInput
            language={language}
            onSendMessage={(text) => onSendMessage('text', text, 0.98)}
          />
        )}

        {inputModality === 'gesture' && (
          <GestureCamera
            onSendGesture={(gestureName, conf) => onSendMessage('gesture', gestureName, conf)}
          />
        )}

        {inputModality === 'sign' && (
          <SignCamera
            onSendSign={(signName, conf) => onSendMessage('sign', signName, conf)}
          />
        )}
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] min-h-[220px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            <p className="text-xs font-medium">
              No messages yet in this session. Start speaking, typing, or gesturing!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUserId={participantId}
              language={language}
              onConfirmMessage={onConfirmMessage}
              onRepairAction={(act) => onSendMessage('text', act, 0.99)}
            />
          ))
        )}
      </div>

      {/* Communication Repair Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <CommunicationRepair
          onSendRepairAction={(phrase) => onSendMessage('text', phrase, 0.99)}
        />
      </div>

    </div>
  );
};
