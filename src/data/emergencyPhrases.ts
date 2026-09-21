import { EmergencyCardData } from '../types';

export const EMERGENCY_CARDS: EmergencyCardData[] = [
  {
    id: 'em_help',
    title: '🚨 I NEED HELP',
    phrase: 'I need urgent help!',
    icon: 'AlertTriangle',
    urgency: 'emergency',
    category: 'general'
  },
  {
    id: 'em_ambulance',
    title: '🚑 CALL AMBULANCE',
    phrase: 'Please call an ambulance immediately!',
    icon: 'Ambulance',
    urgency: 'emergency',
    category: 'medical'
  },
  {
    id: 'em_doctor',
    title: '🏥 I NEED A DOCTOR',
    phrase: 'I need to see a doctor right away.',
    icon: 'Stethoscope',
    urgency: 'high',
    category: 'medical'
  },
  {
    id: 'em_chest_pain',
    title: '❤️ CHEST PAIN',
    phrase: 'I am experiencing severe chest pain.',
    icon: 'HeartPulse',
    urgency: 'emergency',
    category: 'medical'
  },
  {
    id: 'em_pain',
    title: '😣 I AM IN PAIN',
    phrase: 'I am in severe pain and need assistance.',
    icon: 'Activity',
    urgency: 'high',
    category: 'medical'
  },
  {
    id: 'em_medicine',
    title: '💊 I NEED MEDICINE',
    phrase: 'I urgently need my medication.',
    icon: 'Pill',
    urgency: 'high',
    category: 'medical'
  },
  {
    id: 'em_sos',
    title: '🆘 EMERGENCY',
    phrase: 'Emergency! Please assist me right now.',
    icon: 'ShieldAlert',
    urgency: 'emergency',
    category: 'general'
  },
  {
    id: 'em_location',
    title: '📍 I NEED HELP HERE',
    phrase: 'I need help at my current location.',
    icon: 'MapPin',
    urgency: 'high',
    category: 'general'
  }
];

export const OFFLINE_CACHED_PHRASES = [
  'HELP',
  'CALL AMBULANCE',
  'I NEED A DOCTOR',
  'I AM IN PAIN',
  'YES',
  'NO',
  'WAIT',
  'STOP',
  'THANK YOU',
  'PLEASE HELP ME'
];
