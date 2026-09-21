import React from 'react';
import { AlertTriangle, Phone, X, ShieldAlert, HeartPulse, Stethoscope, Ambulance, Pill, MapPin } from 'lucide-react';
import { EMERGENCY_CARDS } from '../data/emergencyPhrases';

interface EmergencyPanelProps {
  onClose: () => void;
  onSendEmergencyMessage: (phrase: string) => void;
}

export const EmergencyPanel: React.FC<EmergencyPanelProps> = ({
  onClose,
  onSendEmergencyMessage
}) => {
  const handleSelectCard = (phrase: string) => {
    onSendEmergencyMessage(phrase);
    onClose();
  };

  const handleCallEmergencyServices = () => {
    window.location.href = 'tel:112';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-4 border-rose-600 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse shadow-lg shadow-rose-600/40">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                EMERGENCY MODE
              </h2>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Tap any emergency card to instantly alert your conversation partner.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition"
            aria-label="Close Emergency Mode"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Call Emergency Services Direct Button */}
        <div className="bg-rose-50 dark:bg-rose-950/60 p-4 rounded-2xl border-2 border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-rose-900 dark:text-rose-200 text-base">
              Need Immediate Emergency Responders?
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
              Dial official emergency telephone services (112 / 911 / 108).
            </p>
          </div>

          <button
            onClick={handleCallEmergencyServices}
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
          >
            <Phone className="w-5 h-5 fill-current" />
            <span>Call Emergency Services (112)</span>
          </button>
        </div>

        {/* Emergency Quick Cards Grid */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Quick Emergency Communication Cards:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EMERGENCY_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => handleSelectCard(card.phrase)}
                className="p-4 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border-2 border-slate-200 hover:border-rose-500 dark:border-slate-700 dark:hover:border-rose-600 rounded-2xl text-left transition transform hover:-translate-y-0.5 shadow-sm group"
              >
                <div className="text-lg font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  {card.title}
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  "{card.phrase}"
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
