import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  LogOut,
  Globe,
  Smartphone,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Gift,
  Coins,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';

export const ProfileTab: React.FC = () => {
  const {
    transactions,
    logout,
    showToast,
    language,
    setLanguage,
  } = useApp();

  // Settings states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Transaction history filter & detail
  const [txFilter, setTxFilter] = useState<'all' | 'send' | 'receive' | 'trade' | 'telecom' | 'deposit'>('all');
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Transactions sorted by descending date (as requested)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      return b.id.localeCompare(a.id);
    });
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (txFilter === 'all') return sortedTransactions;
    if (txFilter === 'deposit') return sortedTransactions.filter((t) => t.type === 'deposit');
    if (txFilter === 'send') return sortedTransactions.filter((t) => t.type === 'p2p_send');
    if (txFilter === 'receive') return sortedTransactions.filter((t) => t.type === 'p2p_receive' || t.type === 'envelope_claimed');
    if (txFilter === 'trade') return sortedTransactions.filter((t) => t.type === 'asset_buy' || t.type === 'asset_sell');
    if (txFilter === 'telecom') return sortedTransactions.filter((t) => t.type === 'telecom_renew' || t.type === 'telecom_gift');
    return sortedTransactions;
  }, [sortedTransactions, txFilter]);

  const getTxTypeBadge = (tx: Transaction) => {
    switch (tx.type) {
      case 'deposit':
        return { label: 'Recharge Kotani', color: 'bg-orange-100 text-[#FF6B35]', icon: ArrowDownLeft };
      case 'p2p_send':
        return { label: 'Envoi USDC', color: 'bg-red-100 text-red-700', icon: ArrowUpRight };
      case 'p2p_receive':
      case 'envelope_claimed':
        return { label: 'Réception USDC', color: 'bg-emerald-100 text-emerald-700', icon: ArrowDownLeft };
      case 'asset_buy':
        return { label: 'Achat Actif', color: 'bg-blue-100 text-blue-700', icon: ShoppingBag };
      case 'asset_sell':
        return { label: 'Vente Actif', color: 'bg-emerald-100 text-emerald-700', icon: Coins };
      case 'telecom_renew':
      case 'telecom_gift':
        return { label: 'Télécom 85', color: 'bg-purple-100 text-purple-700', icon: Gift };
      default:
        return { label: 'Paiement', color: 'bg-gray-100 text-gray-700', icon: Coins };
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-28">
      {/* SECTION: Historique des transactions USDC (TRIÉ PAR DATE DÉCROISSANTE) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Historique des Transactions</span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Trié par date décroissante • Tous flux USDC
            </p>
          </div>

          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {filteredTransactions.length} entrées
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {[
            { id: 'all' as const, label: 'Toutes' },
            { id: 'deposit' as const, label: 'Recharges' },
            { id: 'send' as const, label: 'Envois' },
            { id: 'receive' as const, label: 'Réceptions' },
            { id: 'trade' as const, label: 'Investissements' },
            { id: 'telecom' as const, label: 'Télécom' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTxFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 cursor-pointer ${
                txFilter === f.id
                  ? 'bg-[#FF6B35] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-7 px-4 space-y-2 text-xs text-gray-500">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-gray-800">Aucune transaction pour le moment</p>
              </div>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const badge = getTxTypeBadge(tx);
              const Icon = badge.icon;
              const isPositive = tx.amountUSDC > 0;

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxDetail(tx)}
                  className="p-3 rounded-2xl border border-gray-100 hover:border-[#FF6B35]/30 hover:bg-orange-50/20 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-gray-900 truncate text-xs">{tx.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span>{tx.timestamp}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-600">{badge.label}</span>
                        {tx.counterpartyAddress && (
                          <span className="font-mono text-gray-400">
                            • {tx.counterpartyAddress.substring(0, 6)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-black text-xs block ${
                        isPositive ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {tx.amountUSDC.toFixed(2)} USDC
                    </span>
                    {tx.amountFCFA && (
                      <span className="text-[9px] text-gray-400 block font-medium">
                        {tx.amountFCFA.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Security & Settings */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
          Sécurité & Paramètres
        </h3>

        <div className="space-y-2 text-xs">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-gray-900 block">Authentification 2FA</span>
                <span className="text-[10px] text-gray-500">Protection des retraits et transferts</span>
              </div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                showToast(`2FA ${!twoFactorEnabled ? 'activé' : 'désactivé'}`);
              }}
              className={`w-11 h-6 rounded-full transition p-1 cursor-pointer ${
                twoFactorEnabled ? 'bg-[#10B981]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Biometric Status */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FF6B35]" />
              <div>
                <span className="font-bold text-gray-900 block">Passkey / Face ID</span>
                <span className="text-[10px] text-gray-500">Clé matérielle Secure Enclave</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Configuré
            </span>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-gray-900 block">Langue de l&apos;application</span>
                <span className="text-[10px] text-gray-500">Français / English</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                  language === 'fr' ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                  language === 'en' ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout CTA */}
      <button
        onClick={logout}
        className="w-full py-3.5 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-2xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Déconnexion</span>
      </button>

      {/* Transaction Details Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Détails de la Transaction</h3>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Titre :</span>
                <span className="font-bold text-gray-900">{selectedTxDetail.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Montant USDC :</span>
                <span className="font-extrabold text-[#FF6B35]">
                  {selectedTxDetail.amountUSDC > 0 ? '+' : ''}
                  {selectedTxDetail.amountUSDC.toFixed(2)} USDC
                </span>
              </div>
              {selectedTxDetail.amountFCFA && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant FCFA :</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTxDetail.amountFCFA.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Heure :</span>
                <span className="font-semibold text-gray-900">{selectedTxDetail.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Catégorie :</span>
                <span className="font-semibold text-gray-900">{selectedTxDetail.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Statut :</span>
                <span className="font-bold text-emerald-600 uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">
                  {selectedTxDetail.status}
                </span>
              </div>
              {selectedTxDetail.counterparty && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Destinataire / Expéditeur :</span>
                  <span className="font-semibold text-gray-900">{selectedTxDetail.counterparty}</span>
                </div>
              )}
              {selectedTxDetail.counterpartyAddress && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Adresse de contact :</span>
                  <span className="font-mono text-[10px] text-gray-800 break-all">{selectedTxDetail.counterpartyAddress}</span>
                </div>
              )}
              <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 block font-mono">Tx Hash Smart Contract :</span>
                <span className="font-mono text-[11px] text-gray-700">{selectedTxDetail.txHash}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxDetail(null)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
