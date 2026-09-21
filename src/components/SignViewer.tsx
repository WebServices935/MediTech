import React from 'react';
import { Hand, ArrowRight, Play, Info } from 'lucide-react';
import { SIGN_ASSETS } from '../data/signAssets';

interface SignViewerProps {
  signKey: string | null;
  text: string;
}

export const SignViewer: React.FC<SignViewerProps> = ({ signKey, text }) => {
  const assetKey = signKey ? signKey.toLowerCase() : 'help';
  const asset = SIGN_ASSETS[assetKey] || SIGN_ASSETS['help'];

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3 shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Visual Sign Representation
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold font-mono">
          ISL / ASL VISUAL CARD
        </span>
      </div>

      {/* Main Sign Visual Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-950 p-3.5 rounded-lg border border-slate-800">

        {/* Hand Shape Graphic Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 animate-pulse">
            <Hand className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-amber-300">
            "{asset.word}"
          </span>
        </div>

        {/* Movement and Hand Details */}
        <div className="sm:col-span-2 space-y-2">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Hand Shape & Position:</span>
            <span className="text-xs font-bold text-slate-200">{asset.handShape}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Movement:</span>
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{asset.movement}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-800">
            "{asset.diagramDescription}"
          </div>
        </div>

      </div>

      {/* Avatar integration placeholder notice */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded border border-slate-800">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>3D Avatar Sign Animation placeholder • Extensible architecture ready for video clips</span>
      </div>

    </div>
  );
};
