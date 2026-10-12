import React, { useState } from 'react';
import { X, Smartphone, Building, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KOTANI_EXCHANGE_RATE } from '../../constants/countries';

const PRESET_AMOUNTS = [
  { fcfa: 5000, usdc: 7.69 },
  { fcfa: 10000, usdc: 15.38 },
  { fcfa: 25000, usdc: 38.46 },
  { fcfa: 50000, usdc: 76.92 },
  { fcfa: 100000, usdc: 153.85 },
];

const PROVIDERS = [
  { id: 'Wave', name: 'Wave', color: 'bg-cyan-500', text: 'text-white', logoText: '🌊 Wave', fee: '0%' },
  { id: 'Orange Money', name: 'Orange Money', color: 'bg-orange-500', text: 'text-white', logoText: '🍊 Orange', fee: '0%' },
  { id: 'MTN MoMo', name: 'MTN Mobile Money', color: 'bg-amber-400', text: 'text-black', logoText: '💛 MTN', fee: '0%' },
  { id: 'Moov Money', name: 'Moov Money', color: 'bg-blue-600', text: 'text-white', logoText: '💙 Moov', fee: '0%' },
  { id: 'Carte / Virement', name: 'Banque & Carte', color: 'bg-gray-800', text: 'text-white', logoText: '💳 Banque', fee: '0.5%' },
];

export const KotaniPayModal: React.FC = () => {
  const { isKotaniModalOpen, closeKotaniModal, depositViaKotani, user } = useApp();

  const [selectedProvider, setSelectedProvider] = useState<string>('Wave');
  const [amountFCFA, setAmountFCFA] = useState<number>(25000);
  const [customInput, setCustomInput] = useState<string>('25000');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || '0708091011');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [lastCreditedUSDC, setLastCreditedUSDC] = useState<number>(0);

  if (!isKotaniModalOpen) return null;

  const calculatedUSDC = Number((amountFCFA / KOTANI_EXCHANGE_RATE).toFixed(2));

  const handleCustomChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setCustomInput(val);
    setAmountFCFA(num);
  };

  const handleSelectPreset = (fcfa: number) => {
    setAmountFCFA(fcfa);
    setCustomInput(fcfa.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountFCFA < 1000) return;

    setIsProcessing(true);
    // Simulate Kotani Pay API gateway call + instant webhook confirmation
    await new Promise((res) => setTimeout(res, 1400));

    await depositViaKotani(selectedProvider, amountFCFA, calculatedUSDC);
    setLastCreditedUSDC(calculatedUSDC);
    setIsProcessing(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    closeKotaniModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-50 via-white to-orange-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white font-black text-sm shadow-xs">
              KP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-gray-900">Kotani Pay On-Ramp</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Instantané
                </span>
              </div>
              <p className="text-xs text-gray-500">
                1 USDC = <span className="font-semibold text-gray-700">{KOTANI_EXCHANGE_RATE} FCFA</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeKotaniModal}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-gray-900">Paiement Validé !</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Webhook Kotani Pay acquitté avec succès. Vos USDC sont immédiatement disponibles.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant crédité :</span>
                  <span className="font-bold text-[#FF6B35] text-sm">+{lastCreditedUSDC} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant débité :</span>
                  <span className="font-medium text-gray-900">{amountFCFA.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Moyen de paiement :</span>
                  <span className="font-medium text-gray-900">{selectedProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statut Smart Wallet :</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sécurisé & Actif
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold text-sm shadow-md transition active:scale-98"
              >
                Retourner à l’application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Mobile Money / Bank Provider */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  1. Choisissez le moyen de paiement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROVIDERS.map((prov) => {
                    const isSelected = selectedProvider === prov.id;
                    return (
                      <button
                        type="button"
                        key={prov.id}
                        onClick={() => setSelectedProvider(prov.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B35] bg-orange-50/60 ring-2 ring-[#FF6B35]/20 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-900">{prov.logoText}</span>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                          <span>Frais: {prov.fee}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  2. Montant en FCFA
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {PRESET_AMOUNTS.map((p) => {
                    const isSelected = amountFCFA === p.fcfa;
                    return (
                      <button
                        type="button"
                        key={p.fcfa}
                        onClick={() => handleSelectPreset(p.fcfa)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF6B35] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {p.fcfa.toLocaleString('fr-FR')} F
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customInput}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    placeholder="Montant personnalisé"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 text-sm font-semibold text-gray-900 outline-none transition"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400">
                    FCFA (XOF/XAF)
                  </span>
                </div>
              </div>

              {/* Converted USDC Preview Banner */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-gray-600 block">Vous recevez sur votre wallet :</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-black text-[#FF6B35]">
                      +{calculatedUSDC}
                    </span>
                    <span className="text-xs font-extrabold text-gray-700">USDC</span>
                  </div>
                </div>
                <div className="text-right text-[10px] text-gray-500">
                  <div className="flex items-center gap-1 font-semibold text-emerald-600">
                    <Sparkles className="w-3 h-3" /> Zéro frais de gaz
                  </div>
                  <span>Règlement instantané</span>
                </div>
              </div>

              {/* Phone number validation */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Numéro Mobile Money pour la validation
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="ex: 0708091011"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 text-sm font-semibold text-gray-900 outline-none"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Une notification USSD (push prompt) vous sera envoyée pour taper votre code secret.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing || amountFCFA < 1000}
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] disabled:bg-gray-300 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Communication avec Kotani Pay...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmer la recharge de {calculatedUSDC} USDC</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement sécurisé par Kotani Pay & Smart Contracts 85</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
