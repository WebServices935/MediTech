import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Users } from 'lucide-react';
import QRCode from 'qrcode';

interface SessionJoinProps {
  sessionId: string;
  onClose: () => void;
  onJoinNewSession: (newId: string) => void;
}

export const SessionJoin: React.FC<SessionJoinProps> = ({
  sessionId,
  onClose,
  onJoinNewSession
}) => {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [inputCode, setInputCode] = useState('');

  const shareUrl = `${window.location.origin}?session=${sessionId}`;

  React.useEffect(() => {
    QRCode.toDataURL(shareUrl, { margin: 2, width: 200 }, (err, url) => {
      if (!err && url) {
        setQrUrl(url);
      }
    });
  }, [shareUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinNewSession(inputCode.trim().toUpperCase());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-150">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Connect to Session
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Session Info & QR Code */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
            {qrUrl ? (
              <img src={qrUrl} alt="Session QR Code" className="w-44 h-44 mx-auto rounded-lg" />
            ) : (
              <div className="w-44 h-44 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg text-xs font-mono text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Current Session ID
            </span>
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono tracking-widest mt-0.5">
              {sessionId}
            </div>
          </div>

          {/* Copy Share Link */}
          <div className="flex items-center gap-2 max-w-sm mx-auto">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Join Different Session Form */}
        <form onSubmit={handleJoinSubmit} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Join Existing Session Code:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CONNECT-9921"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold rounded-xl transition"
            >
              Switch Session
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
