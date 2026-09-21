import { ConfidenceLevel } from '../types';

class ConfidenceService {
  /**
   * Returns ConfidenceLevel badge category
   */
  public getConfidenceLevel(confidence: number): ConfidenceLevel {
    if (confidence >= 0.90) return 'HIGH';
    if (confidence >= 0.70) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Returns true if message should be held for confirmation before sending
   */
  public requiresUserConfirmation(confidence: number): boolean {
    return confidence < 0.70;
  }

  /**
   * Formats confidence as clean percentage string e.g. "94%"
   */
  public formatPercentage(confidence: number): string {
    const pct = Math.round(confidence * 100);
    return `${pct}%`;
  }

  /**
   * Returns color class string for confidence level
   */
  public getBadgeColorClass(confidence: number): { bg: string; text: string; border: string } {
    const level = this.getConfidenceLevel(confidence);
    switch (level) {
      case 'HIGH':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800'
        };
      case 'LOW':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40',
          text: 'text-rose-700 dark:text-rose-400',
          border: 'border-rose-200 dark:border-rose-800'
        };
    }
  }
}

export const confidenceService = new ConfidenceService();
