import { useState, useEffect } from 'react';
import { UserPreferences, LanguageCode } from '../types';

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredInput: 'speech',
  preferredOutput: 'text',
  language: 'en',
  largeText: false,
  highContrast: false,
  audioFeedback: true,
  reducedMotion: false,
  fontSize: 'normal',
  theme: 'light'
};

export function useAccessibility() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('connectable_user_prefs');
    if (saved) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    localStorage.setItem('connectable_user_prefs', JSON.stringify(preferences));

    // Apply high contrast mode class to html element
    const root = document.documentElement;
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font size class
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    if (preferences.fontSize === 'large' || preferences.largeText) {
      root.classList.add('text-size-large');
    } else if (preferences.fontSize === 'xlarge') {
      root.classList.add('text-size-xlarge');
    } else {
      root.classList.add('text-size-normal');
    }
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleHighContrast = () => {
    updatePreference('highContrast', !preferences.highContrast);
  };

  const toggleLargeText = () => {
    const nextLarge = !preferences.largeText;
    updatePreference('largeText', nextLarge);
    updatePreference('fontSize', nextLarge ? 'large' : 'normal');
  };

  const setLanguage = (lang: LanguageCode) => {
    updatePreference('language', lang);
  };

  return {
    preferences,
    updatePreference,
    toggleHighContrast,
    toggleLargeText,
    setLanguage
  };
}
