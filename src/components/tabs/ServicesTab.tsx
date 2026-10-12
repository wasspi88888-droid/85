import React, { useState } from 'react';
import {
  ShieldPlus,
  Car,
  Zap,
  Ticket,
  CreditCard,
  Tv,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock,
  Image as ImageIcon,
  Film,
  Plane,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { THIRD_PARTY_SERVICES } from '../../constants/services';
import { useApp } from '../../context/AppContext';
import { ThirdPartyService } from '../../types';

export const ServicesTab: React.FC = () => {
  const {
    balance,
    updateBalance,
    addTransaction,
    showToast,
    setIsCinemaModalOpen,
    setIsFlightsModalOpen,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [activeServiceForCheckout, setActiveServiceForCheckout] = useState<ThirdPartyService | null>(null);
  const [serviceParam, setServiceParam] = useState<string>('');

  const categories = ['Tous', 'Loisirs & Sorties', 'Voyages & Transport', 'Assurance', 'Mobilité', 'Factures', 'Numérique'];

  const filteredServices = selectedCategory === 'Tous'
    ? THIRD_PARTY_SERVICES
    : THIRD_PARTY_SERVICES.filter((s) => s.category === selectedCategory);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-rose-500" />;
      case 'Film':
        return <Film className="w-5 h-5 text-amber-500" />;
      case 'Plane':
        return <Plane className="w-5 h-5 text-sky-500" />;
      case 'ShieldPlus':
        return <ShieldPlus className="w-5 h-5 text-emerald-600" />;
      case 'Car':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Ticket':
        return <Ticket className="w-5 h-5 text-purple-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-rose-500" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-indigo-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#FF6B35]" />;
    }
  };

  const handleServiceClick = (service: ThirdPartyService) => {
    if (service.id === 'serv-cinema') {
      setIsCinemaModalOpen(true);
      return;
    }
    if (service.id === 'serv-flights') {
      setIsFlightsModalOpen(true);
      return;
    }
    setActiveServiceForCheckout(service);
  };

  const handleExecuteServicePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeServiceForCheckout) return;

    const cost = 2.5; // Standard simulation fee
    if (balance < cost) {
      showToast('Solde USDC insuffisant.');
      return;
    }

    const newBal = Number((balance - cost).toFixed(2));
    updateBalance(newBal);

    addTransaction({
      type: 'service_payment',
      title: `${activeServiceForCheckout.title} (${activeServiceForCheckout.provider})`,
      amountUSDC: -cost,
      status: 'completed',
      category: 'Services',
      note: `Référence / Compte: ${serviceParam || 'N/A'} • Connecteur OpenAPI sécurisé`,
    });

    confetti({ particleCount: 60, spread: 60 });
    showToast(`Service validé ! Réf: ${activeServiceForCheckout.title}`);
    setActiveServiceForCheckout(null);
    setServiceParam('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Services Hub Header */}
      <div>
        <h2 className="text-base font-black text-gray-900 tracking-tight">Hub de Services Partenaires</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Accédez à vos services du quotidien et payez en USDC sans changer d&apos;application.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FF6B35] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid / Cards */}
      <div className="space-y-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:border-[#FF6B35]/30 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-center shrink-0">
                  {getServiceIcon(service.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900">{service.title}</h3>
                    {service.badge && (
                      <span className="px-1.5 py-0.5 rounded-md bg-orange-50 text-[#FF6B35] text-[10px] font-bold">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{service.provider}</span>
                </div>
              </div>

              {service.priceEstimate && (
                <span className="text-[11px] font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-lg shrink-0">
                  {service.priceEstimate}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Paiement direct Smart Wallet
              </span>

              <button
                onClick={() => handleServiceClick(service)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white text-xs font-bold transition active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <span>{service.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout / Service Interaction Modal */}
      {activeServiceForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  {getServiceIcon(activeServiceForCheckout.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{activeServiceForCheckout.title}</h3>
                  <span className="text-[10px] text-gray-500">{activeServiceForCheckout.provider}</span>
                </div>
              </div>
              <button onClick={() => setActiveServiceForCheckout(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleExecuteServicePayment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Identifiant client, compteur ou numéro de dossier
                </label>
                <input
                  type="text"
                  value={serviceParam}
                  onChange={(e) => setServiceParam(e.target.value)}
                  placeholder="ex: Réf Facture CIE 0928192, Carte #..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Montant de la transaction :</span>
                  <span className="text-[#FF6B35]">2,50 USDC</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Débité immédiatement de votre solde USDC disponible ({balance.toFixed(2)} USDC).
                </p>
              </div>

              <button
                type="submit"
                disabled={balance < 2.5}
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-black text-xs shadow-md transition active:scale-98 cursor-pointer disabled:bg-gray-300"
              >
                Payer et valider le service (2.50 USDC)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
