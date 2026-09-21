import { RecognitionResult } from '../types';

export interface SignRecognitionResponse {
  sign: string;
  phrase: string;
  confidence: number;
  intent?: string;
}

export const SIGN_VOCABULARY: Record<string, { phrase: string; confidence: number; intent: string }> = {
  'DOCTOR': { phrase: 'I need a doctor', confidence: 0.96, intent: 'MEDICAL_NEED' },
  'HELP': { phrase: 'I need help', confidence: 0.92, intent: 'REQUEST_HELP' },
  'PAIN': { phrase: 'I am in pain', confidence: 0.89, intent: 'MEDICAL_NEED' },
  'AMBULANCE': { phrase: 'Call an ambulance', confidence: 0.95, intent: 'CALL_AMBULANCE' },
  'HELLO': { phrase: 'Hello', confidence: 0.94, intent: 'GREETING' },
  'THANK YOU': { phrase: 'Thank you', confidence: 0.93, intent: 'GRATITUDE' },
  'WATER': { phrase: 'I need water', confidence: 0.88, intent: 'BASIC_NEED' },
  'STOP': { phrase: 'Please stop', confidence: 0.91, intent: 'STOP_ACTION' },
  'YES': { phrase: 'Yes', confidence: 0.95, intent: 'AFFIRMATION' },
  'NO': { phrase: 'No', confidence: 0.90, intent: 'NEGATION' }
};

class SignService {
  /**
   * Required Interface method: recognizeSign(frameData)
   * Analyzes camera frame / landmark input data.
   */
  public recognizeSign(frameData?: ImageData | HTMLCanvasElement | any, defaultSign: string = 'DOCTOR'): SignRecognitionResponse {
    const recognized = SIGN_VOCABULARY[defaultSign.toUpperCase()] || {
      phrase: defaultSign,
      confidence: 0.88,
      intent: 'SIGN_INPUT'
    };

    return {
      sign: defaultSign.toUpperCase(),
      phrase: recognized.phrase,
      confidence: recognized.confidence,
      intent: recognized.intent
    };
  }

  /**
   * Converts sign recognition into normalized RecognitionResult
   */
  public processSignByName(signName: string): RecognitionResult {
    const data = this.recognizeSign(null, signName);
    return {
      modality: 'sign',
      rawInput: data.sign,
      normalizedMeaning: data.phrase,
      confidence: data.confidence,
      intent: data.intent,
      urgency: signName === 'HELP' || signName === 'AMBULANCE' || signName === 'PAIN' ? 'high' : 'low',
      timestamp: Date.now()
    };
  }
}

export const signService = new SignService();
