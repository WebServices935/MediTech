import { RecognitionResult } from '../types';

export interface GestureDetectionResult {
  gesture: string;
  phrase: string;
  confidence: number;
  landmarks?: Array<{ x: number; y: number; z: number }>;
}

export const DEMO_GESTURES: Record<string, { phrase: string; confidence: number; intent: string }> = {
  'HELLO': { phrase: 'Hello!', confidence: 0.95, intent: 'GREETING' },
  'HELP': { phrase: 'I need help.', confidence: 0.92, intent: 'REQUEST_HELP' },
  'YES': { phrase: 'Yes', confidence: 0.94, intent: 'AFFIRMATION' },
  'NO': { phrase: 'No', confidence: 0.91, intent: 'NEGATION' },
  'THANK YOU': { phrase: 'Thank you.', confidence: 0.96, intent: 'GRATITUDE' },
  'STOP': { phrase: 'Please stop.', confidence: 0.93, intent: 'STOP_ACTION' },
  'WAIT': { phrase: 'Please wait a moment.', confidence: 0.89, intent: 'WAIT' },
  'I NEED HELP': { phrase: 'I need urgent assistance.', confidence: 0.94, intent: 'URGENT_HELP' },
  'CALL DOCTOR': { phrase: 'I need a doctor.', confidence: 0.90, intent: 'MEDICAL_NEED' },
  'AMBULANCE': { phrase: 'Please call an ambulance!', confidence: 0.95, intent: 'CALL_AMBULANCE' }
};

class GestureService {
  private isProcessing: boolean = false;

  /**
   * Evaluates hand landmark points (21 normalized 3D keypoints from hand detection)
   * or accepts a simulated gesture string when running in manual/demo mode.
   */
  public detectGestureFromLandmarks(landmarks: Array<{ x: number; y: number; z: number }>): GestureDetectionResult | null {
    if (!landmarks || landmarks.length < 21) return null;

    // Key points index:
    // 0: Wrist, 4: Thumb tip, 8: Index tip, 12: Middle tip, 16: Ring tip, 20: Pinky tip
    // 5: Index MCP, 9: Middle MCP, 13: Ring MCP, 17: Pinky MCP

    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const indexMcp = landmarks[5];
    const middleMcp = landmarks[9];

    // Calculate extended fingers (y position tip vs mcp)
    const isIndexExtended = indexTip.y < indexMcp.y;
    const isMiddleExtended = middleTip.y < middleMcp.y;
    const isRingExtended = ringTip.y < landmarks[13].y;
    const isPinkyExtended = pinkyTip.y < landmarks[17].y;
    const isThumbUp = thumbTip.y < wrist.y && thumbTip.y < indexMcp.y;

    // Rule-based classification
    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      // All fingers extended -> HELLO or STOP
      if (thumbTip.x > indexMcp.x + 0.1 || thumbTip.x < indexMcp.x - 0.1) {
        return { gesture: 'HELLO', phrase: 'Hello!', confidence: 0.94, landmarks };
      }
      return { gesture: 'STOP', phrase: 'Please stop.', confidence: 0.92, landmarks };
    }

    if (isThumbUp && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // Thumbs up -> HELP
      return { gesture: 'HELP', phrase: 'I need help.', confidence: 0.93, landmarks };
    }

    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // Index only -> WAIT
      return { gesture: 'WAIT', phrase: 'Please wait a moment.', confidence: 0.88, landmarks };
    }

    if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // Closed fist -> YES
      return { gesture: 'YES', phrase: 'Yes', confidence: 0.91, landmarks };
    }

    if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      // Index + Middle -> NO
      return { gesture: 'NO', phrase: 'No', confidence: 0.89, landmarks };
    }

    // Default fallback return
    return { gesture: 'HELP', phrase: 'I need help.', confidence: 0.87, landmarks };
  }

  /**
   * Helper to evaluate gesture by key identifier (for demo / trigger selection)
   */
  public processGestureByName(gestureName: string): RecognitionResult {
    const data = DEMO_GESTURES[gestureName] || { phrase: gestureName, confidence: 0.85, intent: 'GENERAL_GESTURE' };
    return {
      modality: 'gesture',
      rawInput: gestureName,
      normalizedMeaning: data.phrase,
      confidence: data.confidence,
      intent: data.intent,
      urgency: gestureName.includes('HELP') || gestureName.includes('AMBULANCE') ? 'high' : 'low',
      timestamp: Date.now()
    };
  }

  /**
   * Draws hand skeleton on Canvas context
   */
  public drawLandmarks(ctx: CanvasRenderingContext2D, landmarks: Array<{ x: number; y: number; z?: number }>, width: number, height: number) {
    ctx.save();
    ctx.strokeStyle = '#14b8a6'; // brand teal
    ctx.lineWidth = 3;
    ctx.fillStyle = '#0ea5e9'; // sky accent

    // Connections map (wrist to fingers)
    const connections = [
      [0,1],[1,2],[2,3],[3,4], // Thumb
      [0,5],[5,6],[6,7],[7,8], // Index
      [5,9],[9,10],[10,11],[11,12], // Middle
      [9,13],[13,14],[14,15],[15,16], // Ring
      [13,17],[17,18],[18,19],[19,20], // Pinky
      [0,17] // Wrist to pinky base
    ];

    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
        ctx.stroke();
      }
    });

    // Draw joints
    landmarks.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.restore();
  }
}

export const gestureService = new GestureService();
