import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ConversationRoom } from './components/ConversationRoom';
import { EmergencyPanel } from './components/EmergencyPanel';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { HowItWorks } from './components/HowItWorks';
import { PrivacyModal } from './components/PrivacyModal';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { SessionJoin } from './components/SessionJoin';
import { useAccessibility } from './hooks/useAccessibility';
import { useSession } from './hooks/useSession';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'room'>('landing');
  const [selectedRole, setSelectedRole] = useState<'both' | 'personA' | 'personB'>('both');

  // Modal States
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Custom Hooks
  const {
    preferences,
    updatePreference,
    toggleHighContrast,
    toggleLargeText,
    setLanguage
  } = useAccessibility();

  const {
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
    setLanguage: setSessionLanguage,
    sendMessage,
    confirmMessage,
    clearHistory,
    joinSession
  } = useSession('CONNECT-4821');

  const handleLanguageChange = (lang: any) => {
    setLanguage(lang);
    setSessionLanguage(lang);
  };

  const handleStartConversation = (role: 'both' | 'personA' | 'personB') => {
    setSelectedRole(role);
    setCurrentView('room');
  };

  // Hackathon Guided Demo Trigger Handler
  const handleRunDemoStep = (stepNumber: number) => {
    setCurrentView('room');
    if (stepNumber === 1) {
      // Step 1: Person A (Gesture/Sign HELP) -> Person B (Text/Speech "I need help.")
      sendMessage('personA', 'gesture', 'HELP', 0.94);
    } else if (stepNumber === 2) {
      // Step 2: Person B (Speech "Where do you need help?") -> Person A (Text)
      sendMessage('personB', 'speech', 'Where do you need help?', 0.96);
    } else if (stepNumber === 3) {
      // Step 3: Person A (Sign DOCTOR) -> Person B (Speech "I need a doctor.")
      sendMessage('personA', 'sign', 'DOCTOR', 0.96);
    } else if (stepNumber === 4) {
      // Step 4: Low confidence ambiguous result (< 70% confidence)
      sendMessage('personA', 'gesture', 'Pain in side', 0.62);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors ${
      preferences.highContrast ? 'high-contrast' : ''
    }`}>

      {/* Main Navigation Header */}
      <Header
        sessionId={sessionId}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSessionModal={() => setIsSessionModalOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        isDarkMode={preferences.theme === 'dark'}
        onToggleDarkMode={() => updatePreference('theme', preferences.theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            language={language}
            sessionId={sessionId}
            onStartConversation={handleStartConversation}
            onJoinSession={(newId) => {
              joinSession(newId);
              setCurrentView('room');
            }}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onOpenDemo={() => setIsDemoOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        ) : (
          <ConversationRoom
            sessionId={sessionId}
            language={language}
            messages={messages}
            personAInput={personAInput}
            setPersonAInput={setPersonAInput}
            personAOutput={personAOutput}
            setPersonAOutput={setPersonAOutput}
            personBInput={personBInput}
            setPersonBInput={setPersonBInput}
            personBOutput={personBOutput}
            setPersonBOutput={setPersonBOutput}
            onSendMessage={sendMessage}
            onConfirmMessage={confirmMessage}
            onClearHistory={clearHistory}
            onBackToLanding={() => setCurrentView('landing')}
            initialRole={selectedRole}
          />
        )}
      </main>

      {/* Modals */}
      {isEmergencyOpen && (
        <EmergencyPanel
          onClose={() => setIsEmergencyOpen(false)}
          onSendEmergencyMessage={(phrase) => {
            sendMessage('personA', 'text', phrase, 0.99);
            setCurrentView('room');
          }}
        />
      )}

      {isAccessibilityOpen && (
        <AccessibilitySettings
          preferences={preferences}
          onUpdatePreference={updatePreference}
          onClose={() => setIsAccessibilityOpen(false)}
        />
      )}

      {isHowItWorksOpen && (
        <HowItWorks onClose={() => setIsHowItWorksOpen(false)} />
      )}

      {isPrivacyOpen && (
        <PrivacyModal
          onClose={() => setIsPrivacyOpen(false)}
          onClearHistory={clearHistory}
        />
      )}

      {isDemoOpen && (
        <GuidedDemoModal
          onClose={() => setIsDemoOpen(false)}
          onRunStep={handleRunDemoStep}
        />
      )}

      {isSessionModalOpen && (
        <SessionJoin
          sessionId={sessionId}
          onClose={() => setIsSessionModalOpen(false)}
          onJoinNewSession={(newId) => {
            joinSession(newId);
            setCurrentView('room');
          }}
        />
      )}

    </div>
  );
};

export default App;
