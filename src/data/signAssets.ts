import { SignAsset } from '../types';

export const SIGN_ASSETS: Record<string, SignAsset> = {
  hello: {
    id: 'hello',
    word: 'HELLO',
    phrase: 'Hello! Nice to meet you.',
    category: 'greetings',
    diagramDescription: 'Open hand with flat palm held near temple, moving outwards in a gentle wave.',
    handShape: 'B-Hand (Flat palm, fingers together)',
    movement: 'Wave outward from temple'
  },
  help: {
    id: 'help',
    word: 'HELP',
    phrase: 'I need help.',
    category: 'emergency',
    diagramDescription: 'Closed fist with thumb up placed on open flat palm of non-dominant hand, lifting upward together.',
    handShape: 'A-Hand (Thumbs up) on flat B-Hand base',
    movement: 'Upward lifting motion'
  },
  yes: {
    id: 'yes',
    word: 'YES',
    phrase: 'Yes, I agree.',
    category: 'responses',
    diagramDescription: 'Closed fist nodding up and down like a head nodding.',
    handShape: 'S-Hand (Fist)',
    movement: 'Vertical nodding movement'
  },
  no: {
    id: 'no',
    word: 'NO',
    phrase: 'No, thank you.',
    category: 'responses',
    diagramDescription: 'Index finger and middle finger snapping down to touch thumb repeatedly.',
    handShape: 'H-Hand (Index + Middle extended)',
    movement: 'Quick double tap against thumb'
  },
  thank_you: {
    id: 'thank_you',
    word: 'THANK YOU',
    phrase: 'Thank you very much.',
    category: 'greetings',
    diagramDescription: 'Fingertips touch chin, then open hand moves forward towards the other person.',
    handShape: 'Flat hand starting at chin',
    movement: 'Forward arc outward'
  },
  doctor: {
    id: 'doctor',
    word: 'DOCTOR',
    phrase: 'I need a doctor.',
    category: 'medical',
    diagramDescription: 'Bent fingertips tap twice on the inner wrist pulse point of non-dominant arm.',
    handShape: 'Bent C-Hand tapping wrist pulse',
    movement: 'Double tap on wrist'
  },
  ambulance: {
    id: 'ambulance',
    word: 'AMBULANCE',
    phrase: 'Call an ambulance.',
    category: 'emergency',
    diagramDescription: 'Both hands open with fingers splayed, rotating near shoulders mimicking flashing emergency lights.',
    handShape: 'Open splayed 5-hands',
    movement: 'Alternating rotation at shoulders'
  },
  pain: {
    id: 'pain',
    word: 'PAIN',
    phrase: 'I am in pain.',
    category: 'medical',
    diagramDescription: 'Index fingers pointed at each other and jabbed towards each other repeatedly near the location of hurt.',
    handShape: '1-Hands (Index fingers extended)',
    movement: 'Inward twisting jabs'
  },
  water: {
    id: 'water',
    word: 'WATER',
    phrase: 'I need water.',
    category: 'needs',
    diagramDescription: 'Index, middle, and ring fingers extended in W shape, tapping index finger on chin twice.',
    handShape: 'W-Hand (3 fingers up)',
    movement: 'Double tap against chin'
  },
  stop: {
    id: 'stop',
    word: 'STOP',
    phrase: 'Please stop.',
    category: 'actions',
    diagramDescription: 'Edge of open dominant hand comes down sharply across the open palm of non-dominant hand.',
    handShape: 'Flat hand chop',
    movement: 'Downward swift chop onto palm'
  }
};
