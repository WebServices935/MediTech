import { useState, useEffect, useCallback } from 'react';
import { ConversationMessage, Session, CommunicationModality, OutputModality, LanguageCode } from '../types';
import { conversationService } from '../services/conversationService';
import { communicationEngine } from '../services/communicationEngine';
import { confidenceService } from '../services/confidenceService';
import { ttsService } from '../services/ttsService';

export function useSession(initialSessionId: string = 'CONNECT-4821') {
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [session, setSession] = useState<Session>(() => conversationService.getOrCreateSession(initialSessionId));
  const [messages, setMessages] = useState<ConversationMessage[]>(() => conversationService.getMessages(initialSessionId));

  // Modality preferences for Person A and Person B
  const [personAInput, setPersonAInput] = useState<CommunicationModality>('speech');
  const [personAOutput, setPersonAOutput] = useState<OutputModality>('text');

  const [personBInput, setPersonBInput] = useState<CommunicationModality>('text');
  const [personBOutput, setPersonBOutput] = useState<OutputModality>('speech');

  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const activeSession = conversationService.getOrCreateSession(sessionId);
    setSession(activeSession);
    setMessages(conversationService.getMessages(sessionId));

    const unsubscribe = conversationService.subscribeMessages((updated) => {
      setMessages(updated);
    });

    return () => {
      unsubscribe();
    };
  }, [sessionId]);

  const joinSession = useCallback((newId: string) => {
    setSessionId(newId);
  }, []);

  const sendMessage = useCallback((
    senderId: 'personA' | 'personB',
    modality: CommunicationModality,
    content: string,
    confidenceOverride?: number,
    forceSend: boolean = false
  ) => {
    if (!content.trim()) return;

    const receiverOutput = senderId === 'personA' ? personBOutput : personAOutput;
    const senderName = senderId === 'personA' ? 'Person A' : 'Person B';

    const processed = communicationEngine.processCommunication({
      sender: senderId,
      modality,
      content,
      receiverOutput,
      confidence: confidenceOverride
    });

    const isLowConfidence = confidenceService.requiresUserConfirmation(processed.confidence);
    const needsConfirmation = isLowConfidence && !forceSend;

    const newMessage: ConversationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sessionId,
      senderId,
      senderName,
      modality,
      originalInput: content,
      normalizedText: processed.text,
      outputType: receiverOutput,
      confidence: processed.confidence,
      intent: processed.intent,
      urgency: processed.urgency,
      timestamp: Date.now(),
      needsConfirmation
    };

    conversationService.addMessage(newMessage);

    // Auto Text-to-Speech if receiver requested Speech output and message is not blocked for confirmation
    if (receiverOutput === 'speech' && !needsConfirmation && processed.text) {
      ttsService.speak(processed.text, language);
    }

    return newMessage;
  }, [sessionId, personAOutput, personBOutput, language]);

  const confirmMessage = useCallback((messageId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.id === messageId) {
          const confirmedMsg = { ...msg, needsConfirmation: false };
          // Speak aloud if receiver output is speech
          if (confirmedMsg.outputType === 'speech') {
            ttsService.speak(confirmedMsg.normalizedText, language);
          }
          return confirmedMsg;
        }
        return msg;
      });
      localStorage.setItem(`messages_${sessionId}`, JSON.stringify(updated));
      return updated;
    });
  }, [sessionId, language]);

  const clearHistory = useCallback(() => {
    conversationService.clearMessages(sessionId);
    setMessages([]);
  }, [sessionId]);

  return {
    sessionId,
    session,
    messages,
    personAInput,
    setPersonAInput,
    personAOutput,
    setPersonAOutput,
    personBInput,
    setPersonBInput,
    personBOutput,
    setPersonBOutput,
    language,
    setLanguage: setLanguageState,
    sendMessage,
    confirmMessage,
    clearHistory,
    joinSession
  };
}
