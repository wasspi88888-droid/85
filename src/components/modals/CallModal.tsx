import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CallModal: React.FC = () => {
  const { isCallModalOpen, callDetails, endCall } = useApp();

  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(callDetails?.type === 'video');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallModalOpen) {
      setSeconds(0);
      setIsVideoActive(callDetails?.type === 'video');
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallModalOpen, callDetails]);

  if (!isCallModalOpen || !callDetails) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 text-white p-4">
      <div className="relative w-full max-w-sm h-[80vh] max-h-[680px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 border border-gray-800">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Appel Chiffré de bout en bout (85 VoIP)</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">{formatDuration(seconds)}</span>
        </div>

        {/* Center: Profile / Simulated Video */}
        <div className="flex flex-col items-center justify-center text-center my-auto space-y-4">
          {isVideoActive ? (
            <div className="relative w-48 h-48 rounded-3xl bg-gray-800 overflow-hidden border-2 border-[#FF6B35]/40 flex items-center justify-center shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                alt={callDetails.name}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white">
                Flux Vidéo HD 1080p
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#E85520] p-1 flex items-center justify-center shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
                  alt={callDetails.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-extrabold text-white">{callDetails.name}</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              Connecté via réseau haut débit 85 (0 frais télécom)
            </p>
          </div>

          {/* Sound waves simulation */}
          <div className="flex items-center gap-1 h-6">
            <span className="w-1 bg-[#FF6B35] h-3 animate-[pulse_0.8s_ease-in-out_infinite] rounded-full" />
            <span className="w-1 bg-[#FF6B35] h-5 animate-[pulse_0.6s_ease-in-out_infinite] rounded-full" />
            <span className="w-1 bg-[#FF6B35] h-4 animate-[pulse_0.9s_ease-in-out_infinite] rounded-full" />
            <span className="w-1 bg-[#FF6B35] h-6 animate-[pulse_0.5s_ease-in-out_infinite] rounded-full" />
            <span className="w-1 bg-[#FF6B35] h-3 animate-[pulse_0.7s_ease-in-out_infinite] rounded-full" />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full transition cursor-pointer active:scale-95 ${
                isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
              title={isMuted ? 'Activer micro' : 'Couper micro'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoActive(!isVideoActive)}
              className={`p-3.5 rounded-full transition cursor-pointer active:scale-95 ${
                isVideoActive ? 'bg-[#FF6B35] text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
              title={isVideoActive ? 'Désactiver caméra' : 'Activer caméra'}
            >
              {isVideoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              className="p-3.5 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 transition cursor-pointer active:scale-95"
              title="Haut-parleur"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={endCall}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
            <span>Raccrocher</span>
          </button>
        </div>
      </div>
    </div>
  );
};
