import { GestureDefinition } from '../types';

export const GESTURE_DEFINITIONS: GestureDefinition[] = [
  {
    id: 'g_hello',
    label: 'HELLO',
    phrase: 'Hello!',
    category: 'common',
    description: 'Open hand raised with palm facing camera, fingers straight.',
    iconName: 'Hand'
  },
  {
    id: 'g_help',
    label: 'HELP',
    phrase: 'I need help.',
    category: 'emergency',
    description: 'Thumbs up gesture held vertically in front of camera.',
    iconName: 'ThumbsUp'
  },
  {
    id: 'g_yes',
    label: 'YES',
    phrase: 'Yes',
    category: 'common',
    description: 'Closed fist raised with thumb tucked on side.',
    iconName: 'CheckCircle'
  },
  {
    id: 'g_no',
    label: 'NO',
    phrase: 'No',
    category: 'common',
    description: 'Index and middle finger extended horizontal, tapping together.',
    iconName: 'XCircle'
  },
  {
    id: 'g_thankyou',
    label: 'THANK YOU',
    phrase: 'Thank you.',
    category: 'common',
    description: 'Flat open palm touching chin and moving forward.',
    iconName: 'Heart'
  },
  {
    id: 'g_stop',
    label: 'STOP',
    phrase: 'Stop',
    category: 'common',
    description: 'Flat palm pushing straight toward camera.',
    iconName: 'Octagon'
  },
  {
    id: 'g_wait',
    label: 'WAIT',
    phrase: 'Please wait a moment.',
    category: 'common',
    description: 'Raised index finger pointing upward.',
    iconName: 'Clock'
  },
  {
    id: 'g_needhelp',
    label: 'I NEED HELP',
    phrase: 'I need urgent assistance.',
    category: 'emergency',
    description: 'Both hands raised palms out near shoulders.',
    iconName: 'AlertCircle'
  },
  {
    id: 'g_doctor',
    label: 'CALL DOCTOR',
    phrase: 'I need a doctor.',
    category: 'medical',
    description: 'Finger tapping opposite wrist pulse point.',
    iconName: 'Stethoscope'
  },
  {
    id: 'g_ambulance',
    label: 'AMBULANCE',
    phrase: 'Call an ambulance!',
    category: 'emergency',
    description: 'Open hands splayed overhead rotating.',
    iconName: 'Ambulance'
  }
];
