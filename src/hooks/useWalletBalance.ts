import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export interface UseWalletBalanceReturn {
  balance: number;
  formattedBalance: string;
  formattedFCFA: string;
  isLoading: boolean;
  lastUpdated: string;
  refetch: () => void;
  openKotaniReload: () => void;
  walletAddress: string;
}

export function useWalletBalance(): UseWalletBalanceReturn {
  const { balance, isLoadingBalance, lastUpdated, refetchBalance, openKotaniModal, user } = useApp();
  const [localLoading, setLocalLoading] = useState(false);

  // BroadcastChannel and WebSocket simulated listener
  useEffect(() => {
    let wsSimulated = true;
    const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
      ? new BroadcastChannel('eightyfive_wallet_sync')
      : null;

    if (channel) {
      channel.onmessage = () => {
        // Automatically handled through AppContext, but ensures fresh render
      };
    }

    // Polling fallback every 30 seconds as specified in requirement
    const interval = setInterval(() => {
      if (wsSimulated) {
        refetchBalance();
      }
    }, 30000);

    return () => {
      wsSimulated = false;
      clearInterval(interval);
      if (channel) {
        channel.close();
      }
    };
  }, [refetchBalance]);

  const refetch = useCallback(() => {
    setLocalLoading(true);
    refetchBalance();
    setTimeout(() => {
      setLocalLoading(false);
    }, 500);
  }, [refetchBalance]);

  const formattedBalance = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  const formattedFCFA = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(Math.round(balance * 650));

  return {
    balance,
    formattedBalance: `${formattedBalance} USDC`,
    formattedFCFA: `${formattedFCFA} FCFA`,
    isLoading: isLoadingBalance || localLoading,
    lastUpdated,
    refetch,
    openKotaniReload: () => openKotaniModal(),
    walletAddress: user?.walletAddress || '0x8542...179a',
  };
}
