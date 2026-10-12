import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { formattedBalance, isLoading, refetch, openKotaniReload } = useWalletBalance();
  const { language } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs pt-safe">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between gap-2">
        {/* BalanceHeader (Positionné en haut à gauche) */}
        <div className="flex items-center gap-2">
          <div
            onClick={openKotaniReload}
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-gray-50/90 hover:bg-orange-50/80 border border-gray-200 hover:border-[#FF6B35]/40 transition active:scale-98 cursor-pointer shadow-2xs"
            title="Cliquez pour recharger via Kotani Pay (Mobile Money / Banque)"
          >
            {/* Quick reload + icon button */}
            <div className="w-7 h-7 rounded-lg bg-[#FF6B35] group-hover:bg-[#E85520] flex items-center justify-center text-white shadow-xs transition shrink-0">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                  {language === 'fr' ? 'Solde' : 'Balance'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    refetch();
                  }}
                  className={`p-0.5 text-gray-400 hover:text-gray-700 transition ${
                    isLoading ? 'animate-spin text-[#FF6B35]' : ''
                  }`}
                  title="Rafraîchir le solde"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5 leading-tight">
                <span className="text-xs font-black tracking-tight text-gray-900 group-hover:text-[#FF6B35] transition">
                  {formattedBalance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
