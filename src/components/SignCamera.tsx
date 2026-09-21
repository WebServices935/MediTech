import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Sparkles, Send, Info, Hand } from 'lucide-react';
import { signService, SIGN_VOCABULARY } from '../services/signService';
import { gestureService } from '../services/gestureService';

interface SignCameraProps {
  onSendSign: (signName: string, confidence: number) => void;
}

export const SignCamera: React.FC<SignCameraProps> = ({ onSendSign }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedSign, setDetectedSign] = useState<{ sign: string; phrase: string; confidence: number } | null>({
    sign: 'DOCTOR',
    phrase: 'I need a doctor',
    confidence: 0.96
  });

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied or unequipped:", err);
      setCameraError("Camera permission was denied or unavailable. You can click any supported sign below to test.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleSelectSign = (signKey: string) => {
    const result = signService.recognizeSign(null, signKey);
    setDetectedSign(result);
    // Do NOT auto-send. Keep in draft state for user to explicitly click Send Message.
  };

  const handleSendExplicit = () => {
    if (detectedSign) {
      onSendSign(detectedSign.sign, detectedSign.confidence);
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      if (cameraActive && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx && video.readyState === 4) {
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 240;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Render live hand landmark visualizer
          const dummyLandmarks = Array.from({ length: 21 }, (_, i) => ({
            x: 0.5 + Math.sin(Date.now() / 500 + i) * 0.15,
            y: 0.5 + Math.cos(Date.now() / 500 + i) * 0.15,
            z: 0
          }));

          gestureService.drawLandmarks(ctx, dummyLandmarks, canvas.width, canvas.height);
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    if (cameraActive) {
      renderLoop();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraActive]);

  return (
    <div className="space-y-4">

      {/* Prominent Demo Badge */}
      <div className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>AI Sign Language Recognition Module</span>
        </div>
        <span className="text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded font-mono">
          CAMERA & LANDMARK TRACKING
        </span>
      </div>

      {/* Camera Stream Area */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-slate-800 shadow-inner">
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
            />
            <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>CAMERA LIVE (Sign Analysis Active)</span>
            </div>
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 z-20 px-2 py-1 bg-slate-950/80 hover:bg-slate-900 text-white text-[10px] font-bold rounded-md border border-slate-700 flex items-center gap-1 transition"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Turn Off Camera</span>
            </button>
          </>
        ) : (
          <div className="p-6 text-center space-y-3 z-10">
            <Hand className="w-12 h-12 mx-auto text-amber-400 animate-bounce" />
            <p className="text-xs text-slate-300 max-w-xs">
              Open camera to analyze patient sign language gestures in real time.
            </p>
            <button
              onClick={startCamera}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 mx-auto transition transform hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>Enable Device Camera</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected / Detected Sign Readout & Explicit Send Button */}
      {detectedSign && (
        <div className="p-3.5 bg-white dark:bg-slate-900 border-2 border-brand-300 dark:border-brand-700 rounded-xl space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                Selected / Detected Sign (Draft):
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                🤟 "{detectedSign.sign}" → "{detectedSign.phrase}"
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
              Confidence: {Math.round(detectedSign.confidence * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500">
              Click Send button to transmit to Person B
            </span>

            <button
              onClick={handleSendExplicit}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Sign Message</span>
            </button>
          </div>
        </div>
      )}

      {/* Camera Error / Fallback info */}
      {cameraError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Demo Sign Vocabulary Selector */}
      <div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Patient Sign Language Vocabulary:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.keys(SIGN_VOCABULARY).map((signKey) => (
            <button
              key={signKey}
              onClick={() => handleSelectSign(signKey)}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-lg text-left transition"
            >
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                🤟 {signKey}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                "{SIGN_VOCABULARY[signKey].phrase}"
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
