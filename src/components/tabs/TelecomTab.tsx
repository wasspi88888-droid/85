import React, { useState } from 'react';
import {
  Smartphone,
  Signal,
  Globe,
  Gift,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AFRICAN_COUNTRIES } from '../../constants/countries';

export const TelecomTab: React.FC = () => {
  const {
    telecomPlan,
    renewTelecomPlan,
    giftTelecomPlan,
    balance,
    conversations,
    showToast,
    openKotaniModal,
  } = useApp();

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftContactName, setGiftContactName] = useState('Fatou Traoré');
  const [giftRecipientPhone, setGiftRecipientPhone] = useState('0708091011');
  const [isRenewing, setIsRenewing] = useState(false);

  const handleRenew = () => {
    if (balance < 35) {
      showToast('Solde insuffisant (35 USDC requis). Veuillez recharger via Kotani Pay.');
      openKotaniModal();
      return;
    }
    setIsRenewing(true);
    setTimeout(() => {
      renewTelecomPlan();
      setIsRenewing(false);
    }, 600);
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftContactName.trim() || !giftRecipientPhone.trim()) return;

    giftTelecomPlan(giftContactName.trim(), giftRecipientPhone.trim());
    setShowGiftModal(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-24">
      {/* Active Pass Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B35] via-[#E85520] to-orange-700 text-white p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-200 block">
                Connectivité 85 MVNO
              </span>
              <h2 className="text-base font-black tracking-tight">{telecomPlan.name}</h2>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
            telecomPlan.status === 'active' ? 'bg-emerald-400 text-gray-950' : 'bg-white/30 text-white'
          }`}>
            {telecomPlan.status === 'active' ? 'Actif' : 'Non activé'}
          </span>
        </div>

        {/* Plan Highlights */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-orange-200 block">Données Mobiles</span>
            <span className="text-sm font-black text-white mt-0.5 block">5G Illimitée</span>
            <span className="text-[9px] text-orange-100">Roaming 12 pays inclus</span>
          </div>

          <div className="bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-orange-200 block">Tarif Annuel</span>
            <span className="text-sm font-black text-white mt-0.5 block">35$ USDC / an</span>
            <span className="text-[9px] text-orange-100">Soit ~2,9$ / mois</span>
          </div>
        </div>

        {/* Renewal & Expiry date */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-orange-100">
            <Calendar className="w-4 h-4" />
            <span>Valable jusqu&apos;au : <strong className="text-white">{telecomPlan.validUntil}</strong></span>
          </div>
        </div>

        {/* Action CTAs: Renew + Gift */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleRenew}
            disabled={isRenewing}
            className="py-3 px-3 rounded-2xl bg-white hover:bg-orange-50 text-[#FF6B35] font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer disabled:bg-white/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? 'animate-spin' : ''}`} />
            <span>{telecomPlan.status === 'active' ? 'Renouveler (35$)' : 'Activer le Pass (35$)'}</span>
          </button>

          <button
            onClick={() => setShowGiftModal(true)}
            className="py-3 px-3 rounded-2xl bg-black/25 hover:bg-black/35 text-white font-black text-xs flex items-center justify-center gap-1.5 border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-orange-300" />
            <span>Offrir à un contact</span>
          </button>
        </div>
      </div>

      {/* 12 Covered Countries Flag Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Couverture Roaming Sans Surcoût (12 Pays)</span>
          </h3>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            100% Inclus
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {AFRICAN_COUNTRIES.map((c) => (
            <span
              key={c.code}
              className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200/70 text-xs font-semibold text-gray-700 flex items-center gap-1"
            >
              <span>{c.flag}</span>
              <span className="text-[11px]">{c.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Plan Features */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
          Avantages Inclus avec votre Pass 85
        </h3>
        <ul className="space-y-2 text-xs text-gray-600">
          {telecomPlan.features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Gift Telecom Pass Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Offrir un Forfait 85 (1 An)</h3>
                  <p className="text-[10px] text-gray-500">Débité de votre wallet USDC (35$)</p>
                </div>
              </div>
              <button onClick={() => setShowGiftModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleGiftSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Sélectionner un contact existant ou entrer son nom
                </label>
                <input
                  type="text"
                  value={giftContactName}
                  onChange={(e) => setGiftContactName(e.target.value)}
                  placeholder="ex: Aminata Diallo, Koffi Mensah..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Numéro de téléphone du bénéficiaire
                </label>
                <input
                  type="tel"
                  value={giftRecipientPhone}
                  onChange={(e) => setGiftRecipientPhone(e.target.value)}
                  placeholder="ex: +225 07 08 09 10 11"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-gray-700 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Coût du cadeau :</span>
                  <span className="text-[#FF6B35]">35,00 USDC</span>
                </div>
                <p className="text-gray-500 text-[10px]">
                  Votre contact recevra une enveloppe cadeau télécom interactive directement dans son chat 85.
                </p>
              </div>

              <button
                type="submit"
                disabled={balance < 35}
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-black text-xs shadow-md transition active:scale-98 cursor-pointer disabled:bg-gray-300"
              >
                Confirmer le don de forfait (35 USDC)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
