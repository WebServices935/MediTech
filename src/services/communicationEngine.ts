import {
  CommunicationModality,
  OutputModality,
  ProcessedCommunicationOutput
} from '../types';

export interface CommunicationEngineInput {
  sender: 'personA' | 'personB';
  modality: CommunicationModality;
  content: string;
  receiverOutput: OutputModality;
  confidence?: number;
}

// Intent mapper dictionary
const INTENT_MAPPING: Record<string, { intent: string; normalizedText: string; urgency: 'low' | 'medium' | 'high' | 'emergency'; signKey?: string }> = {
  'DOCTOR': { intent: 'MEDICAL_NEED', normalizedText: 'I need a doctor.', urgency: 'high', signKey: 'doctor' },
  'I NEED A DOCTOR': { intent: 'MEDICAL_NEED', normalizedText: 'I need a doctor.', urgency: 'high', signKey: 'doctor' },
  'I NEED A DOCTOR.': { intent: 'MEDICAL_NEED', normalizedText: 'I need a doctor.', urgency: 'high', signKey: 'doctor' },
  'HELP': { intent: 'REQUEST_HELP', normalizedText: 'I need help.', urgency: 'high', signKey: 'help' },
  'I NEED HELP': { intent: 'REQUEST_HELP', normalizedText: 'I need help.', urgency: 'high', signKey: 'help' },
  'I NEED HELP.': { intent: 'REQUEST_HELP', normalizedText: 'I need help.', urgency: 'high', signKey: 'help' },
  'AMBULANCE': { intent: 'CALL_AMBULANCE', normalizedText: 'Please call an ambulance!', urgency: 'emergency', signKey: 'ambulance' },
  'CALL AMBULANCE': { intent: 'CALL_AMBULANCE', normalizedText: 'Please call an ambulance!', urgency: 'emergency', signKey: 'ambulance' },
  'PAIN': { intent: 'MEDICAL_NEED', normalizedText: 'I am in pain.', urgency: 'high', signKey: 'pain' },
  'CHEST PAIN': { intent: 'MEDICAL_NEED', normalizedText: 'I am experiencing chest pain.', urgency: 'emergency', signKey: 'pain' },
  'MY CHEST HURTS': { intent: 'MEDICAL_NEED', normalizedText: 'My chest hurts.', urgency: 'emergency', signKey: 'pain' },
  'YES': { intent: 'AFFIRMATION', normalizedText: 'Yes', urgency: 'low', signKey: 'yes' },
  'NO': { intent: 'NEGATION', normalizedText: 'No', urgency: 'low', signKey: 'no' },
  'HELLO': { intent: 'GREETING', normalizedText: 'Hello!', urgency: 'low', signKey: 'hello' },
  'THANK YOU': { intent: 'GRATITUDE', normalizedText: 'Thank you.', urgency: 'low', signKey: 'thank_you' },
  'WATER': { intent: 'BASIC_NEED', normalizedText: 'I need water.', urgency: 'low', signKey: 'water' },
  'STOP': { intent: 'STOP_ACTION', normalizedText: 'Please stop.', urgency: 'medium', signKey: 'stop' }
};

class CommunicationEngine {
  /**
   * Section 21 requirement: processCommunication(input)
   */
  public processCommunication(input: CommunicationEngineInput): ProcessedCommunicationOutput {
    const rawUpper = input.content.trim().toUpperCase();
    const mapped = INTENT_MAPPING[rawUpper];

    let normalizedText = input.content.trim();
    let intent = 'GENERAL_STATEMENT';
    let urgency: 'low' | 'medium' | 'high' | 'emergency' = 'low';
    let signKey: string | null = null;

    if (mapped) {
      normalizedText = mapped.normalizedText;
      intent = mapped.intent;
      urgency = mapped.urgency;
      signKey = mapped.signKey || null;
    } else {
      // Check for partial sign keywords
      const words = rawUpper.split(' ');
      for (const w of words) {
        if (INTENT_MAPPING[w]?.signKey) {
          signKey = INTENT_MAPPING[w].signKey!;
          break;
        }
      }
    }

    // Default confidence calculation based on modality
    let confidence = input.confidence !== undefined ? input.confidence : 0.95;
    if (input.modality === 'gesture') confidence = input.confidence || 0.92;
    if (input.modality === 'sign') confidence = input.confidence || 0.91;

    // Generate output formats based on receiver preferences
    let textOutput = normalizedText;
    let speechOutput: string | null = null;
    let visualSignOutput: string | null = signKey;

    if (input.receiverOutput === 'speech' || input.receiverOutput === 'text') {
      speechOutput = normalizedText;
    }

    if (input.receiverOutput === 'sign') {
      if (!visualSignOutput) {
        // Fallback sign representation
        visualSignOutput = 'help';
      }
    }

    return {
      text: textOutput,
      speech: speechOutput,
      sign: visualSignOutput,
      confidence: Math.round(confidence * 100) / 100,
      intent,
      urgency,
      modality: input.modality,
      rawInput: input.content
    };
  }
}

export const communicationEngine = new CommunicationEngine();
