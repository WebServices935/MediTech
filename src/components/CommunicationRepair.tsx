import React from 'react';
import { HelpCircle, RefreshCw, Type, Hand, Volume2, CheckCircle2 } from 'lucide-react';

interface CommunicationRepairProps {
  onSendRepairAction: (text: string) => void;
}

export const CommunicationRepair: React.FC<CommunicationRepairProps> = ({
  onSendRepairAction
}) => {
  const repairOptions = [
    { label: "I didn't understand", icon: HelpCircle, color: "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800" },
    { label: "Please repeat your message", icon: RefreshCw, color: "bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-800" },
    { label: "Please type it", icon: Type, color: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800" },
    { label: "Show sign", icon: Hand, color: "bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-800" },
    { label: "Speak again", icon: Volume2, color: "bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800" },
    { label: "Confirm message", icon: CheckCircle2, color: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800" }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
        Communication Repair Actions:
      </span>

      <div className="flex flex-wrap gap-1.5">
        {repairOptions.map((opt, idx) => {
          const Icon = opt.icon;
          return (
            <button
              key={idx}
              onClick={() => onSendRepairAction(opt.label)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 hover:scale-105 ${opt.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>"{opt.label}"</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
