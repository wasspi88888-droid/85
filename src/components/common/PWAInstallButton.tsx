import React, { useState } from 'react';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20 border border-[#FF6B35]/30 transition active:scale-95 cursor-pointer shadow-xs"
        title="Installer 85 sur votre écran d'accueil"
      >
        <Download className="w-3.5 h-3.5 text-[#FF6B35]" />
        <span>Installer PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-gray-600" />
          <span>Installer PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-black text-sm">
                    85
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Installer 85 sur iPhone / iPad</h3>
                    <p className="text-[11px] text-gray-500">Expérience native plein écran</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-gray-700">
                <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Touchez l&apos;icône <strong>Partager</strong> <span className="text-blue-500">⎋</span> dans la barre Safari au bas de votre écran.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Faites défiler vers le bas et sélectionnez <strong>Sur l&apos;écran d&apos;accueil</strong> (+).
                  </span>
                </div>
                <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Touchez <strong>Ajouter</strong> en haut à droite. 85 apparaîtra comme une app native !
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#FF6B35] py-2.5 text-xs font-bold text-white hover:bg-[#E85520] transition active:scale-98"
              >
                C&apos;est compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic desktop / browser fallback button
  return (
    <button
      onClick={() => {
        alert(
          "Pour installer l'application 85 :\n1. Sur Chrome/Edge : Cliquez sur l'icône 'Installer' dans la barre d'adresse en haut à droite.\n2. Sur Mobile : Menu du navigateur > 'Ajouter à l'écran d'accueil'."
        );
      }}
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition cursor-pointer"
    >
      <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
      <span>PWA</span>
    </button>
  );
};
