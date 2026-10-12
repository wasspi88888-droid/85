import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  ShieldCheck,
  Users,
  Zap,
  Globe2,
  DollarSign,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InvestorPitchModal: React.FC = () => {
  const { isInvestorModalOpen, setIsInvestorModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'flywheel' | 'architecture' | 'traction'>('overview');

  if (!isInvestorModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-[#FF6B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#FF6B35] flex items-center justify-center font-black text-xl shadow-md">
              85
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">85 • Investor Pitch Deck & Scalability</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                  Seed Round
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                The Everything App for the Next Billion Users in Emerging Markets
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInvestorModalOpen(false)}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-6 gap-2 pt-2">
          {[
            { id: 'overview' as const, label: 'Thèse & Vision' },
            { id: 'flywheel' as const, label: 'Super-App Flywheel' },
            { id: 'architecture' as const, label: 'Scalabilité 1000+ Concurrence' },
            { id: 'traction' as const, label: 'Unit Economics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#FF6B35] text-[#FF6B35]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-800 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-orange-50/80 border border-orange-200/80 p-4 rounded-2xl">
                <h4 className="text-sm font-extrabold text-[#FF6B35] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Le Problème : Fragmentation & Frais Extorbitants en Afrique
                </h4>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  L&apos;Afrique compte plus de 600 millions d&apos;utilisateurs de smartphones, mais ils jonglent entre 5 à 8 applications isolées : WhatsApp pour chatter, Mobile Money (Orange, Wave, MTN) pour payer avec 1-3% de frais, et des forfaits télécoms data rechargés au quotidien qui coûtent jusqu&apos;à 15$/mois.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-xs">Seedless Biometric Wallet</h5>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Zéro phrase secrète à retenir. Authentification Face ID / Passkey instantanée et sécurisée.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-xs">Forfait Télécom 35$/an</h5>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Connectivité illimitée transfrontalière sur 12 pays africains, payable directement en USDC.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-xs">Kotani Pay On/Off-Ramp</h5>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Passerelle unique Mobile Money (Wave, MTN, Orange, Moov) au taux garanti 1$ = 650 FCFA.
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 space-y-2">
                <span className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                  Pourquoi 85 gagne le marché ?
                </span>
                <ul className="space-y-1.5 text-gray-600 text-[11px]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B35] font-black">•</span>
                    <span><strong>Viralité organique P2P :</strong> L&apos;envoi d&apos;enveloppes cadeaux USDC et le don de forfait mobile dans le chat obligent les contacts à installer la PWA 85 en 1 clic.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B35] font-black">•</span>
                    <span><strong>Démocratisation de l&apos;investissement :</strong> Achat fractionné d&apos;actions Apple ($AAPL), d&apos;Or physique et d&apos;obligations souveraines UEMOA dès 1 USDC.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'flywheel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200">
                <h4 className="text-sm font-extrabold text-gray-900 mb-2">
                  La boucle d&apos;amplification 85 (Flywheel)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <strong className="text-gray-900">Acquisition par Télécom & Messagerie :</strong>
                      <p className="text-[11px] text-gray-500">Forfait 35$/an et chat gratuit attirent la masse d&apos;utilisateurs.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <strong className="text-gray-900">Rétention par le Wallet USDC & Kotani Pay :</strong>
                      <p className="text-[11px] text-gray-500">Les utilisateurs stockent leurs fonds en stablecoin dollar pour se protéger des dévaluations.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <strong className="text-gray-900">Monétisation par Services & Investissements :</strong>
                      <p className="text-[11px] text-gray-500">Frais de 1% sur le trading d&apos;actifs fractionnés, commissions sur hub de services (assurance, VTC, factures).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3">
              <div className="bg-gray-900 text-gray-200 p-4 rounded-2xl font-mono text-[11px] space-y-2">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Architecture Production-Ready (1000 Concurrence)
                </div>
                <p className="text-gray-400">
                  • <strong>Backend Gateway :</strong> Node.js 20+ Express + TypeScript, cluster horizontal.
                  <br />
                  • <strong>Base de Données :</strong> PostgreSQL 15 (Supabase connection pooler PgBouncer).
                  <br />
                  • <strong>Cache & Sessions :</strong> Redis 7 (Upstash) avec TTL 5s sur requêtes solde USDC.
                  <br />
                  • <strong>WebSockets :</strong> Socket.io avec Redis Pub/Sub adapter pour diffusion rooms temps réel.
                  <br />
                  • <strong>Sécurité & Auth :</strong> JWT en cookies httpOnly, SameSite=Strict, bcrypt 10 rounds, Rate limiter 100 req/min.
                  <br />
                  • <strong>Validation :</strong> Validation Zod stricte sur 100% des routes API entrantes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 block">Temps de réponse P99 :</span>
                  <span className="text-emerald-600 font-extrabold text-sm">&lt; 18ms</span> (Cache Redis L1)
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 block">Throughput Max :</span>
                  <span className="text-[#FF6B35] font-extrabold text-sm">4 500 req/sec</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traction' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl">
                  <span className="text-gray-400 font-medium">LTV Estimé (12 mois)</span>
                  <div className="text-lg font-black text-gray-900 mt-1">$68,50 / user</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+ Telecom pass + trade fees</span>
                </div>

                <div className="p-3.5 bg-white border border-gray-200 rounded-xl">
                  <span className="text-gray-400 font-medium">CAC Ciblé (PWA Viral)</span>
                  <div className="text-lg font-black text-gray-900 mt-1">&lt; $2,80</div>
                  <span className="text-[10px] text-blue-600 font-bold">K-Factor &gt; 1.4 (Gifts)</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900">
                <div className="font-extrabold text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Levée de Fonds Amorçage (Seed Target : 1.5M$)
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Financement dédié à l&apos;obtention des licences télécom MVNO locales en Côte d&apos;Ivoire et au Sénégal, au fonds de liquidité Kotani Pay, et à l&apos;accélération marketing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium">
            Contact Founder : wasspi88888@gmail.com
          </span>
          <button
            onClick={() => setIsInvestorModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-xs transition active:scale-95"
          >
            Fermer le Deck
          </button>
        </div>
      </div>
    </div>
  );
};
