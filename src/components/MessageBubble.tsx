import React, { useState } from 'react';
import {
  Mic,
  Keyboard,
  Hand,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ConversationMessage, LanguageCode } from '../types';
import { confidenceService } from '../services/confidenceService';
import { ttsService } from '../services/ttsService';
import { SignViewer } from './SignViewer';
import { ConfidenceIndicator } from './ConfidenceIndicator';

interface MessageBubbleProps {
  message: ConversationMessage;
  currentUserId: 'personA' | 'personB';
  language: LanguageCode;
  onConfirmMessage: (id: string) => void;
  onRepairAction: (action: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  language,
  onConfirmMessage,
  onRepairAction
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSignViewer, setShowSignViewer] = useState(false);

  const isSelf = message.senderId === currentUserId;
  const badgeStyle = confidenceService.getBadgeColorClass(message.confidence);

  const handleSpeak = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      ttsService.speak(message.normalizedText, language, () => {
        setIsPlaying(false);
      });
    }
  };

  const getModalityIcon = () => {
    switch (message.modality) {
      case 'speech':
        return <Mic className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'text':
        return <Keyboard className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      case 'gesture':
        return <Hand className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'sign':
        return <Hand className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${isSelf ? 'items-end' : 'items-start'}`}>

      <div className={`max-w-xl w-full p-4 rounded-2xl border shadow-sm space-y-3 transition ${
        isSelf
          ? 'bg-brand-50/60 dark:bg-slate-800 border-brand-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
      }`}>

        {/* Top bar: Sender & Modality */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full text-[11px] font-extrabold text-white flex items-center justify-center ${
              message.senderId === 'personA' ? 'bg-brand-600' : 'bg-sky-600'
            }`}>
              {message.senderId === 'personA' ? 'A' : 'B'}
            </span>
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              {message.senderName}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {getModalityIcon()}
              <span>{message.modality}</span>
            </span>
          </div>

          {/* Confidence Badge */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
            Confidence: {confidenceService.formatPercentage(message.confidence)}
          </span>
        </div>

        {/* Low Confidence Warning Box */}
        {message.needsConfirmation ? (
          <ConfidenceIndicator
            message={message}
            onConfirm={() => onConfirmMessage(message.id)}
          />
        ) : (
          <div className="space-y-2">
            {/* Translated Output Text */}
            <div className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
              "{message.normalizedText}"
            </div>

            {/* Original Input Raw details if AI converted */}
            {message.originalInput !== message.normalizedText && (
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-lg">
                <span className="font-semibold">Raw Input ({message.modality}):</span> "{message.originalInput}"
              </div>
            )}
          </div>
        )}

        {/* Controls & Output Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            {/* TTS Speak button */}
            <button
              onClick={handleSpeak}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-md transition"
              title="Speak message aloud"
            >
              {isPlaying ? <Square className="w-3.5 h-3.5 text-rose-500 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-brand-600" />}
              <span>{isPlaying ? 'Stop' : 'Speak'}</span>
            </button>

            {/* Toggle Sign Representation */}
            <button
              onClick={() => setShowSignViewer(!showSignViewer)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-md transition"
            >
              <Hand className="w-3.5 h-3.5 text-amber-500" />
              <span>{showSignViewer ? 'Hide Sign' : 'Visual Sign'}</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Expanded Visual Sign View */}
        {showSignViewer && (
          <div className="pt-2">
            <SignViewer signKey={message.intent?.toLowerCase() || 'help'} text={message.normalizedText} />
          </div>
        )}

      </div>

    </div>
  );
};
