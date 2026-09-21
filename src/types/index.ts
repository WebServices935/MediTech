export type CommunicationModality = 'speech' | 'text' | 'gesture' | 'sign';
export type OutputModality = 'text' | 'speech' | 'sign';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type LanguageCode = 'en' | 'hi' | 'te' | 'kn';

export interface RecognitionResult {
  modality: CommunicationModality;
  rawInput: string;
  normalizedMeaning: string;
  confidence: number; // 0 to 1
  intent?: string;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  timestamp: number;
}

export interface ProcessedCommunicationOutput {
  text: string;
  speech: string | null;
  sign: string | null;
  confidence: number;
  intent?: string;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  modality: CommunicationModality;
  rawInput: string;
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  senderId: 'personA' | 'personB';
  senderName: string;
  modality: CommunicationModality;
  originalInput: string;
  normalizedText: string;
  outputType: OutputModality;
  confidence: number; // 0 to 1 (e.g. 0.94)
  intent?: string;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  timestamp: number;
  needsConfirmation?: boolean;
}

export interface UserPreferences {
  preferredInput: CommunicationModality;
  preferredOutput: OutputModality;
  language: LanguageCode;
  largeText: boolean;
  highContrast: boolean;
  audioFeedback: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  theme: 'light' | 'dark' | 'system';
}

export interface SessionParticipant {
  id: 'personA' | 'personB';
  name: string;
  inputModality: CommunicationModality;
  outputModality: OutputModality;
  language: LanguageCode;
  joined: boolean;
  lastActive: number;
}

export interface Session {
  sessionId: string;
  createdAt: number;
  participants: {
    personA: SessionParticipant;
    personB: SessionParticipant;
  };
  active: boolean;
}

export interface GestureDefinition {
  id: string;
  label: string;
  phrase: string;
  category: 'common' | 'medical' | 'emergency';
  description: string;
  iconName: string;
}

export interface SignAsset {
  id: string;
  word: string;
  phrase: string;
  category: string;
  diagramDescription: string;
  handShape: string;
  movement: string;
}

export interface EmergencyCardData {
  id: string;
  title: string;
  phrase: string;
  icon: string;
  urgency: 'high' | 'emergency';
  category: string;
}
