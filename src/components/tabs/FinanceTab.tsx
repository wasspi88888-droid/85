import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Copy,
  Plus,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign,
  PieChart,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { FractionalAsset } from '../../types';

export const FinanceTab: React.FC = () => {
  const {
    balance,
    transactions,
    assets,
    buyAsset,
    sellAsset,
    addTransaction,
    updateBalance,
    showToast,
    openKotaniModal,
    user,
  } = useApp();

  const [activeAssetTab, setActiveAssetTab] = useState<'all' | 'actions' | 'metaux' | 'obligations'>('all');
  const [selectedAssetForTrade, setSelectedAssetForTrade] = useState<FractionalAsset | null>(null);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [tradeAmountUSDC, setTradeAmountUSDC] = useState<string>('20');

  // P2P Transfer modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('25');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Total Portfolio Value
  const totalAssetsValue = assets.reduce((acc, a) => acc + a.totalValueUSDC, 0);

  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopiedAddress(true);
      showToast('Adresse smart wallet copiée !');
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleExecuteP2PSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount) || 0;
    if (amount <= 0 || amount > balance) return;

    const newBal = Number((balance - amount).toFixed(2));
    updateBalance(newBal);

    addTransaction({
      type: 'p2p_send',
      title: `Transfert USDC envoyé à ${sendRecipient.substring(0, 8)}...`,
      amountUSDC: -amount,
      counterpartyAddress: sendRecipient,
      status: 'completed',
      category: 'Transfert P2P',
      note: 'Transfert instantané P2P sans frais de gaz',
    });

    confetti({ particleCount: 70, spread: 60 });
    showToast(`Transfert de ${amount} USDC effectué avec succès !`);
    setShowSendModal(false);
    setSendRecipient('');
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForTrade) return;
    const amount = parseFloat(tradeAmountUSDC) || 0;
    if (amount <= 0) return;

    if (tradeAction === 'buy') {
      buyAsset(selectedAssetForTrade.id, amount);
    } else {
      sellAsset(selectedAssetForTrade.id, amount);
    }
    setSelectedAssetForTrade(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-24">
      {/* Fractional Assets Investment Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Actifs Fractionnalisés</h3>
            <p className="text-[11px] text-gray-500">Investissez dès 1 USDC • Frais 1% fixes</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Positions: ${totalAssetsValue.toFixed(2)}
          </span>
        </div>

        {/* Assets Cards */}
        <div className="space-y-2.5">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:border-[#FF6B35]/40 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">{asset.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600 font-mono">
                      {asset.symbol}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">{asset.category}</span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-gray-900 block">
                    ${asset.currentPriceUSDC.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      asset.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {asset.change24h >= 0 ? '+' : ''}
                    {asset.change24h}% (24h)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 line-clamp-2">{asset.description}</p>

              {/* User holdings info */}
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Vos avoirs</span>
                  <span className="font-bold text-gray-800">
                    {asset.holdings} {asset.symbol} (${asset.totalValueUSDC.toFixed(2)} USDC)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedAssetForTrade(asset);
                      setTradeAction('buy');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#FF6B35] text-white font-bold text-[11px] hover:bg-[#E85520] transition active:scale-95 cursor-pointer"
                  >
                    Acheter
                  </button>
                  {asset.holdings > 0 && (
                    <button
                      onClick={() => {
                        setSelectedAssetForTrade(asset);
                        setTradeAction('sell');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-[11px] hover:bg-gray-100 transition active:scale-95 cursor-pointer"
                    >
                      Vendre
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Modal (Achat / Vente fractionnée) */}
      {selectedAssetForTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {tradeAction === 'buy' ? 'Acheter' : 'Vendre'} {selectedAssetForTrade.name}
                </h3>
                <p className="text-[10px] text-gray-500">
                  Prix actuel : ${selectedAssetForTrade.currentPriceUSDC.toFixed(2)} USDC
                </p>
              </div>
              <button
                onClick={() => setSelectedAssetForTrade(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Montant en USDC {tradeAction === 'buy' ? `(Solde: ${balance.toFixed(2)} USDC)` : `(Avoirs: $${selectedAssetForTrade.totalValueUSDC.toFixed(2)})`}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max={tradeAction === 'buy' ? balance : selectedAssetForTrade.totalValueUSDC}
                    value={tradeAmountUSDC}
                    onChange={(e) => setTradeAmountUSDC(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-900 outline-none focus:border-[#FF6B35]"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-extrabold text-[#FF6B35]">
                    USDC
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Frais de transaction fixes :</span>
                  <span className="font-semibold text-gray-900">1% ({(parseFloat(tradeAmountUSDC || '0') * 0.01).toFixed(2)} USDC)</span>
                </div>
                <div className="flex justify-between">
                  <span>Fraction estimée :</span>
                  <span className="font-semibold text-[#FF6B35]">
                    ~{(parseFloat(tradeAmountUSDC || '0') / selectedAssetForTrade.currentPriceUSDC).toFixed(4)} {selectedAssetForTrade.symbol}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-xs shadow-md transition cursor-pointer active:scale-98"
              >
                Confirmer l&apos;ordre de {tradeAction === 'buy' ? 'Achat' : 'Vente'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* P2P Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Envoyer des USDC (P2P)</h3>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleExecuteP2PSend} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adresse Smart Wallet destinataire</label>
                <input
                  type="text"
                  placeholder="0x85..."
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-xs text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Montant en USDC (Solde: {balance.toFixed(2)})</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max={balance}
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={parseFloat(sendAmount) > balance || !sendRecipient.trim()}
                className="w-full py-3 rounded-xl bg-[#FF6B35] text-white font-extrabold text-xs shadow-md transition active:scale-98 cursor-pointer disabled:bg-gray-300"
              >
                Envoyer {sendAmount} USDC
              </button>
            </form>
          </div>
        </div>
      )}

      {/* P2P Receive QR Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Recevoir des USDC</h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <div className="w-48 h-48 mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
              <QrCode className="w-36 h-36 text-gray-900" />
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Votre Adresse 85</span>
              <span className="font-mono text-xs text-gray-800 break-all select-all">
                {user?.walletAddress}
              </span>
            </div>

            <button
              onClick={handleCopyAddress}
              className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedAddress ? 'Adresse Copiée !' : 'Copier l’adresse de dépôt'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
