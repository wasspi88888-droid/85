import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Transaction,
  FractionalAsset,
  TelecomPlan,
  Conversation,
  ChatMessage,
  WizardDraft,
  Language,
} from '../types';
import { INITIAL_FRACTIONAL_ASSETS } from '../constants/assets';

type TabType = 'messages' | 'finance' | 'telecom' | 'services' | 'profile';

interface AppContextType {
  // Navigation & User
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  wizardDraft: WizardDraft;
  updateWizardDraft: (data: Partial<WizardDraft>) => void;
  resetWizardDraft: () => void;
  logout: () => void;

  // Wallet & Real-time Balance
  balance: number;
  isLoadingBalance: boolean;
  lastUpdated: string;
  updateBalance: (newBalance: number, tx?: Transaction) => void;
  refetchBalance: () => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'txHash'>) => Transaction;

  // Assets & Telecom
  assets: FractionalAsset[];
  buyAsset: (assetId: string, amountUSDC: number) => { success: boolean; error?: string };
  sellAsset: (assetId: string, amountUSDC: number) => { success: boolean; error?: string };
  telecomPlan: TelecomPlan;
  renewTelecomPlan: () => { success: boolean; error?: string };
  giftTelecomPlan: (contactName: string, recipientPhone: string) => { success: boolean; error?: string };

  // Messaging & Gift envelopes
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, text: string) => void;
  sendGiftEnvelope: (conversationId: string, amountUSDC: number, note: string) => boolean;
  claimGiftEnvelope: (conversationId: string, messageId: string) => boolean;
  createConversation: (name: string, walletAddress?: string) => string;
  createGroupConversation: (name: string, memberNames: string[]) => string;
  blockContact: (conversationId: string) => void;
  deleteMessage: (conversationId: string, messageId: string, forEveryone: boolean) => void;
  deleteConversation: (conversationId: string) => void;

  // Modals & Overlays
  isKotaniModalOpen: boolean;
  openKotaniModal: (defaultAmount?: number) => void;
  closeKotaniModal: () => void;
  depositViaKotani: (provider: string, amountFCFA: number, amountUSDC: number) => Promise<boolean>;

  // Call simulation
  isCallModalOpen: boolean;
  callDetails: { name: string; type: 'voice' | 'video'; isIncoming?: boolean } | null;
  startCall: (name: string, type: 'voice' | 'video') => void;
  endCall: () => void;

  // Investor & Swagger Modals
  isInvestorModalOpen: boolean;
  setIsInvestorModalOpen: (open: boolean) => void;
  isSwaggerModalOpen: boolean;
  setIsSwaggerModalOpen: (open: boolean) => void;

  // New Services Modals & KPIs
  isPhotosModalOpen: boolean;
  setIsPhotosModalOpen: (open: boolean) => void;
  isCinemaModalOpen: boolean;
  setIsCinemaModalOpen: (open: boolean) => void;
  isFlightsModalOpen: boolean;
  setIsFlightsModalOpen: (open: boolean) => void;
  isKpiModalOpen: boolean;
  setIsKpiModalOpen: (open: boolean) => void;

  // Registration & Demo State
  registerNewUser: (user: UserProfile) => Promise<void>;
  loadDemoData: () => void;
  resetToEmptySpace: () => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_WIZARD_DRAFT: WizardDraft = {
  step: 1,
  language: 'fr',
  fullName: '',
  phoneDialCode: '+225',
  phoneNumber: '',
  email: '',
  country: "Côte d'Ivoire",
  termsAccepted: false,
};

const EMPTY_TELECOM_PLAN: TelecomPlan = {
  id: 'pass-85-unlimited',
  name: 'Pass 85 Illimité (1 An)',
  annualPriceUSDC: 35.0,
  dataAllowance: '5G Haute Vitesse (Non activé)',
  voiceSms: 'Voix & SMS Illimités 85',
  coverageCountries: 12,
  status: 'expired',
  validUntil: 'Non activé',
  autoRenew: false,
  features: [
    'Roaming sans surcoût dans les 12 pays partenaires',
    'Chiffrement de bout en bout voix & data',
    'Priorité réseau 5G SA + e-SIM instantanée',
    'Offre partageable avec tous vos contacts 85',
  ],
};

const EMPTY_ASSETS: FractionalAsset[] = INITIAL_FRACTIONAL_ASSETS.map((a) => ({
  ...a,
  holdings: 0,
  totalValueUSDC: 0,
}));

const INITIAL_USER: UserProfile = {
  id: 'usr_85_demo',
  fullName: 'Kouamé Jean-Marc',
  phone: '0708091011',
  countryDialCode: '+225',
  email: 'jm.kouame@example.ci',
  country: "Côte d'Ivoire",
  walletAddress: '0x8542F9bC1628cD8F41A87bB60bE95a624fB2179a',
  language: 'fr',
  twoFactorEnabled: true,
  biometricType: 'Face ID',
  createdAt: '2026-03-15T10:00:00Z',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  deviceInfo: 'iPhone 15 Pro • iOS 18 (PWA Active)',
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'deposit',
    title: 'Recharge Mobile Money (Wave)',
    amountUSDC: 50.0,
    amountFCFA: 32500,
    status: 'completed',
    timestamp: 'Hier à 18:32',
    txHash: '0x3f91...81ab',
    category: 'Kotani Pay',
    note: 'Taux garanti 1 USDC = 650 FCFA',
  },
  {
    id: 'tx-2',
    type: 'envelope_claimed',
    title: 'Cadeau USDC reçu de Fatou',
    amountUSDC: 20.0,
    counterparty: 'Fatou Traoré',
    status: 'completed',
    timestamp: 'Il y a 2 jours',
    txHash: '0x94fa...22cc',
    category: 'Transfert P2P',
    note: '🎁 Enveloppe anniversaire réclamée',
  },
  {
    id: 'tx-3',
    type: 'telecom_renew',
    title: 'Pass 85 Illimité (1 An)',
    amountUSDC: -35.0,
    status: 'completed',
    timestamp: '01 Oct 2026',
    txHash: '0x81ee...9801',
    category: 'Télécom',
    note: 'Data 5G Roaming 12 pays + Voix HD',
  },
  {
    id: 'tx-4',
    type: 'asset_buy',
    title: 'Achat fractionné Apple ($AAPL)',
    amountUSDC: -25.0,
    status: 'completed',
    timestamp: '28 Sep 2026',
    txHash: '0x12a8...44bd',
    category: 'Investissement',
    note: '0.109 AAPL @ $228.45 (Frais 1%)',
  },
];

const INITIAL_TELECOM_PLAN: TelecomPlan = {
  id: 'pass-85-unlimited',
  name: 'Pass 85 Illimité Afrique & Monde',
  annualPriceUSDC: 35.0,
  dataAllowance: 'Illimité (5G Haute Vitesse)',
  voiceSms: 'Appels & SMS Illimités via réseau 85',
  coverageCountries: 12,
  status: 'active',
  validUntil: '2027-10-15',
  autoRenew: true,
  features: [
    'Roaming sans surcoût dans les 12 pays partenaires',
    'Chiffrement de bout en bout voix & data',
    'Priorité réseau 5G SA + e-SIM instantanée',
    'Offre partageable avec tous vos contacts 85',
  ],
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    isGroup: false,
    name: 'Aminata Diallo',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    walletAddress: '0x8577Fa1B920c812E3De40a1bA69C451D2b29Fa02',
    memberAddresses: ['0x8577Fa1B920c812E3De40a1bA69C451D2b29Fa02'],
    lastMessage: 'Merci pour le transfert instantané ! 🙌',
    lastMessageTimestamp: '14:20',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'conv-2',
    isGroup: false,
    name: 'Fatou Traoré',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
    walletAddress: '0x8599Db4F11A57cd21394aB029147B576bA84c172',
    memberAddresses: ['0x8599Db4F11A57cd21394aB029147B576bA84c172'],
    lastMessage: '🎁 Tu as reçu une enveloppe cadeau USDC !',
    lastMessageTimestamp: '10:05',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'conv-3',
    isGroup: true,
    name: 'Tech & Fintech Abidjan 🇨🇮',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=256&q=80',
    memberAddresses: ['0x85...', '0x86...', '0x87...'],
    lastMessage: 'Koffi: Les obligations UEMOA rapportent du 6.5% net.',
    lastMessageTimestamp: 'Hier',
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: 'conv-4',
    isGroup: false,
    name: '85 Support VIP 24/7',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    walletAddress: '0x8500000000000000000000000000000000000000',
    memberAddresses: ['0x8500000000000000000000000000000000000000'],
    lastMessage: 'Bienvenue sur 85 ! Votre wallet biométrique est sécurisé.',
    lastMessageTimestamp: '09:00',
    unreadCount: 0,
    isOnline: true,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm1-1',
      conversationId: 'conv-1',
      senderId: 'conv-1',
      senderName: 'Aminata Diallo',
      senderAddress: '0x8577Fa1B920c812E3De40a1bA69C451D2b29Fa02',
      type: 'text',
      content: 'Salut Jean-Marc ! Tu as testé le forfait télécom 85 ?',
      timestamp: '14:15',
      status: 'read',
    },
    {
      id: 'm1-2',
      conversationId: 'conv-1',
      senderId: 'usr_85_demo',
      senderName: 'Kouamé Jean-Marc',
      senderAddress: '0x8542F9bC1628cD8F41A87bB60bE95a624fB2179a',
      type: 'text',
      content: 'Oui, 35$/an pour toute l’Afrique c’est révolutionnaire ! Et je t’ai envoyé les USDC pour le déjeuner.',
      timestamp: '14:18',
      status: 'read',
    },
    {
      id: 'm1-3',
      conversationId: 'conv-1',
      senderId: 'conv-1',
      senderName: 'Aminata Diallo',
      senderAddress: '0x8577Fa1B920c812E3De40a1bA69C451D2b29Fa02',
      type: 'text',
      content: 'Merci pour le transfert instantané ! 🙌',
      timestamp: '14:20',
      status: 'read',
    },
  ],
  'conv-2': [
    {
      id: 'm2-1',
      conversationId: 'conv-2',
      senderId: 'conv-2',
      senderName: 'Fatou Traoré',
      senderAddress: '0x8599Db4F11A57cd21394aB029147B576bA84c172',
      type: 'gift_envelope',
      content: 'Enveloppe Cadeau USDC',
      timestamp: '10:05',
      status: 'delivered',
      envelopeData: {
        amountUSDC: 15.0,
        note: 'Voici ta part pour notre projet commun ! Profites-en bien 🚀',
        claimed: false,
      },
    },
  ],
  'conv-3': [
    {
      id: 'm3-1',
      conversationId: 'conv-3',
      senderId: 'member-koffi',
      senderName: 'Koffi Mensah',
      senderAddress: '0x85718a...22',
      type: 'text',
      content: 'Les obligations UEMOA rapportent du 6.5% net directement sur le wallet 85.',
      timestamp: 'Hier à 17:40',
      status: 'read',
    },
  ],
  'conv-4': [
    {
      id: 'm4-1',
      conversationId: 'conv-4',
      senderId: 'support',
      senderName: '85 Support VIP',
      senderAddress: '0x8500000000000000000000000000000000000000',
      type: 'text',
      content: 'Bienvenue sur 85 ! Votre wallet biométrique sans phrase secrète est opérationnel. Besoin d’aide ? Nous répondons en moins de 2 minutes.',
      timestamp: '09:00',
      status: 'read',
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_current_tab');
      return (saved as TabType) || 'messages';
    } catch {
      return 'messages';
    }
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_language');
      return (saved as Language) || user?.language || 'fr';
    } catch {
      return user?.language || 'fr';
    }
  });

  const [wizardDraft, setWizardDraft] = useState<WizardDraft>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_wizard_progress');
      return saved ? JSON.parse(saved) : DEFAULT_WIZARD_DRAFT;
    } catch {
      return DEFAULT_WIZARD_DRAFT;
    }
  });

  // Balance (Default 0 USDC for fresh clean space, or saved balance)
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_balance');
      return saved ? parseFloat(saved) : 0.0;
    } catch {
      return 0.0;
    }
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(() => new Date().toLocaleTimeString());

  // Transactions & Portfolio
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [assets, setAssets] = useState<FractionalAsset[]>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_assets');
      return saved ? JSON.parse(saved) : EMPTY_ASSETS;
    } catch {
      return EMPTY_ASSETS;
    }
  });

  const [telecomPlan, setTelecomPlan] = useState<TelecomPlan>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_telecom');
      return saved ? JSON.parse(saved) : EMPTY_TELECOM_PLAN;
    } catch {
      return EMPTY_TELECOM_PLAN;
    }
  });

  // Conversations & Messages (Empty space by default)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('eightyfive_messages');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals
  const [isKotaniModalOpen, setIsKotaniModalOpen] = useState(false);
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [isSwaggerModalOpen, setIsSwaggerModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [isFlightsModalOpen, setIsFlightsModalOpen] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [callDetails, setCallDetails] = useState<{ name: string; type: 'voice' | 'video'; isIncoming?: boolean } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const registerNewUser = async (newUser: UserProfile) => {
    setUser(newUser);
    setConversations([]);
    setMessages({});
    setTransactions([]);
    setBalance(0.0);
    setTelecomPlan(EMPTY_TELECOM_PLAN);
    setAssets(EMPTY_ASSETS);
    resetWizardDraft();

    try {
      await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newUser.id,
          fullName: newUser.fullName,
          country: newUser.country,
        }),
      });
    } catch {
      // Offline fallback
    }

    showToast(`Bienvenue sur 85, ${newUser.fullName} ! Votre espace vierge est prêt.`);
  };

  const loadDemoData = () => {
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setTransactions(INITIAL_TRANSACTIONS);
    setBalance(125.5);
    setTelecomPlan(INITIAL_TELECOM_PLAN);
    setAssets(INITIAL_FRACTIONAL_ASSETS);
    showToast('Données de démonstration chargées avec succès !');
  };

  const resetToEmptySpace = () => {
    setConversations([]);
    setMessages({});
    setTransactions([]);
    setBalance(0.0);
    setTelecomPlan(EMPTY_TELECOM_PLAN);
    setAssets(EMPTY_ASSETS);
    showToast('Espace réinitialisé à l’état vierge.');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('eightyfive_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('eightyfive_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('eightyfive_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eightyfive_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('eightyfive_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('eightyfive_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('eightyfive_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('eightyfive_telecom', JSON.stringify(telecomPlan));
  }, [telecomPlan]);

  useEffect(() => {
    localStorage.setItem('eightyfive_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('eightyfive_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('eightyfive_wizard_progress', JSON.stringify(wizardDraft));
  }, [wizardDraft]);

  // BroadcastChannel Multi-tab synchronization
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('eightyfive_wallet_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'BALANCE_UPDATE') {
          setBalance(event.data.balance);
          setLastUpdated(new Date().toLocaleTimeString());
          if (event.data.toast) {
            showToast(event.data.toast);
          }
        }
      };
    } catch {
      // BroadcastChannel fallback if not supported
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [showToast]);

  // Polling fallback every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const broadcastBalance = (newVal: number, toastText?: string) => {
    try {
      const channel = new BroadcastChannel('eightyfive_wallet_sync');
      channel.postMessage({ type: 'BALANCE_UPDATE', balance: newVal, toast: toastText });
      channel.close();
    } catch {
      // Ignored
    }
  };

  const updateBalance = (newBalance: number, tx?: Transaction) => {
    setBalance(newBalance);
    setLastUpdated(new Date().toLocaleTimeString());
    broadcastBalance(newBalance);
    if (tx) {
      setTransactions((prev) => [tx, ...prev]);
    }
  };

  const refetchBalance = () => {
    setIsLoadingBalance(true);
    setTimeout(() => {
      setIsLoadingBalance(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }, 600);
  };

  const updateWizardDraft = (data: Partial<WizardDraft>) => {
    setWizardDraft((prev) => ({ ...prev, ...data }));
  };

  const resetWizardDraft = () => {
    setWizardDraft(DEFAULT_WIZARD_DRAFT);
    localStorage.removeItem('eightyfive_wizard_progress');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eightyfive_user');
    resetWizardDraft();
    showToast('Session déconnectée avec succès (Session Redis invalidée)');
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'timestamp' | 'txHash'>): Transaction => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      timestamp: 'À l’instant',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  // Kotani Pay Modal actions
  const openKotaniModal = () => {
    setIsKotaniModalOpen(true);
  };

  const closeKotaniModal = () => {
    setIsKotaniModalOpen(false);
  };

  const depositViaKotani = async (provider: string, amountFCFA: number, amountUSDC: number): Promise<boolean> => {
    const newBalance = Number((balance + amountUSDC).toFixed(2));
    setBalance(newBalance);
    setLastUpdated(new Date().toLocaleTimeString());
    broadcastBalance(newBalance, `Recharge Kotani Pay validée : +${amountUSDC} USDC`);

    addTransaction({
      type: 'deposit',
      title: `Recharge Kotani Pay (${provider})`,
      amountUSDC,
      amountFCFA,
      status: 'completed',
      category: 'Kotani Pay',
      note: `Taux 1$ = 650 FCFA • Mobile Money ${provider}`,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`Dépôt Kotani Pay réussi ! +${amountUSDC.toFixed(2)} USDC crédités.`);
    return true;
  };

  // Fractional Assets
  const buyAsset = (assetId: string, amountUSDC: number) => {
    if (balance < amountUSDC) {
      showToast('Solde USDC insuffisant pour cet achat.');
      return { success: false, error: 'Solde insuffisant' };
    }

    const fee = Number((amountUSDC * 0.01).toFixed(2));
    const netInvested = amountUSDC - fee;

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const additionalUnits = Number((netInvested / a.currentPriceUSDC).toFixed(4));
          const newHoldings = Number((a.holdings + additionalUnits).toFixed(4));
          const newTotal = Number((newHoldings * a.currentPriceUSDC).toFixed(2));
          return { ...a, holdings: newHoldings, totalValueUSDC: newTotal };
        }
        return a;
      })
    );

    const newBal = Number((balance - amountUSDC).toFixed(2));
    updateBalance(newBal);

    const assetName = assets.find((a) => a.id === assetId)?.name || assetId;
    addTransaction({
      type: 'asset_buy',
      title: `Achat fractionné ${assetName}`,
      amountUSDC: -amountUSDC,
      status: 'completed',
      category: 'Investissement',
      note: `Montant net: ${netInvested.toFixed(2)} USDC • Frais 1%: ${fee.toFixed(2)} USDC`,
    });

    showToast(`Investissement confirmé : ${amountUSDC} USDC dans ${assetName}`);
    return { success: true };
  };

  const sellAsset = (assetId: string, amountUSDC: number) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset || asset.totalValueUSDC < amountUSDC) {
      showToast('Position insuffisante pour cette vente.');
      return { success: false, error: 'Montant supérieur aux avoirs' };
    }

    const fee = Number((amountUSDC * 0.01).toFixed(2));
    const netReceived = Number((amountUSDC - fee).toFixed(2));

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const soldUnits = Number((amountUSDC / a.currentPriceUSDC).toFixed(4));
          const newHoldings = Math.max(0, Number((a.holdings - soldUnits).toFixed(4)));
          const newTotal = Number((newHoldings * a.currentPriceUSDC).toFixed(2));
          return { ...a, holdings: newHoldings, totalValueUSDC: newTotal };
        }
        return a;
      })
    );

    const newBal = Number((balance + netReceived).toFixed(2));
    updateBalance(newBal);

    addTransaction({
      type: 'asset_sell',
      title: `Vente fractionnée ${asset.name}`,
      amountUSDC: netReceived,
      status: 'completed',
      category: 'Investissement',
      note: `Montant brut: ${amountUSDC.toFixed(2)} USDC • Frais 1%: ${fee.toFixed(2)} USDC`,
    });

    showToast(`Vente effectuée : +${netReceived} USDC crédités sur votre wallet.`);
    return { success: true };
  };

  // Telecom actions
  const renewTelecomPlan = () => {
    const cost = 35.0;
    if (balance < cost) {
      showToast('Solde insuffisant pour renouveler le Pass 85 (35 USDC requis).');
      return { success: false, error: 'Solde insuffisant' };
    }

    const newBal = Number((balance - cost).toFixed(2));
    updateBalance(newBal);

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    setTelecomPlan((prev) => ({
      ...prev,
      status: 'active',
      validUntil: nextYear.toISOString().split('T')[0],
    }));

    addTransaction({
      type: 'telecom_renew',
      title: 'Renouvellement Pass 85 Illimité (1 An)',
      amountUSDC: -cost,
      status: 'completed',
      category: 'Télécom',
      note: '35$/an débités du wallet • eSIM et roaming 12 pays réactivés',
    });

    confetti({ particleCount: 60, spread: 60 });
    showToast('Pass 85 renouvelé avec succès pour 1 an !');
    return { success: true };
  };

  const giftTelecomPlan = (contactName: string, recipientPhone: string) => {
    const cost = 35.0;
    if (balance < cost) {
      showToast('Solde insuffisant pour offrir un forfait (35 USDC).');
      return { success: false, error: 'Solde insuffisant' };
    }

    const newBal = Number((balance - cost).toFixed(2));
    updateBalance(newBal);

    addTransaction({
      type: 'telecom_gift',
      title: `Forfait Pass 85 offert à ${contactName}`,
      amountUSDC: -cost,
      counterparty: contactName,
      status: 'completed',
      category: 'Télécom',
      note: `Destinataire: ${recipientPhone} • Enveloppe télécom envoyée dans le chat`,
    });

    // Also inject telecom gift envelope in conversation or create one
    let targetConv = conversations.find((c) => c.name.toLowerCase() === contactName.toLowerCase());
    if (!targetConv) {
      const newId = `conv-gift-${Date.now()}`;
      targetConv = {
        id: newId,
        isGroup: false,
        name: contactName,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        memberAddresses: ['0x85...'],
        lastMessage: '🎁 Pass 85 Illimité offert !',
        lastMessageTimestamp: 'À l’instant',
        unreadCount: 0,
      };
      setConversations((prev) => [targetConv!, ...prev]);
    }

    const giftMsg: ChatMessage = {
      id: `msg-tel-${Date.now()}`,
      conversationId: targetConv.id,
      senderId: user?.id || 'usr_85',
      senderName: user?.fullName || 'Moi',
      senderAddress: user?.walletAddress || '0x85...',
      type: 'telecom_gift',
      content: `Pass 85 Illimité 1 An offert`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      telecomGiftData: {
        planName: 'Pass 85 Illimité 1 An (12 pays)',
        durationMonths: 12,
        validityYear: 2027,
        recipientPhone,
        claimed: false,
      },
    };

    setMessages((prev) => ({
      ...prev,
      [targetConv!.id]: [...(prev[targetConv!.id] || []), giftMsg],
    }));

    confetti({ particleCount: 90, spread: 80 });
    showToast(`Pass 85 envoyé à ${contactName} dans votre conversation !`);
    return { success: true };
  };

  // Messaging actions
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user?.id || 'usr_85',
      senderName: user?.fullName || 'Moi',
      senderAddress: user?.walletAddress || '0x85...',
      type: 'text',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTimestamp: newMsg.timestamp,
            }
          : c
      )
    );

    // Auto-respond simulation for interactive richness
    if (conversationId === 'conv-1' || conversationId === 'conv-4') {
      setTimeout(() => {
        const replyText =
          conversationId === 'conv-4'
            ? 'Notre équipe support a bien reçu votre demande. Votre session et votre wallet USDC sont actifs et sécurisés.'
            : 'Super ! Merci pour ton message, je regarde ça tout de suite 🚀';

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          senderId: conversationId,
          senderName: conversationId === 'conv-4' ? '85 Support VIP' : 'Aminata Diallo',
          senderAddress: '0x85...',
          type: 'text',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: replyText,
                  lastMessageTimestamp: replyMsg.timestamp,
                }
              : c
          )
        );
      }, 1200);
    }
  };

  const sendGiftEnvelope = (conversationId: string, amountUSDC: number, note: string): boolean => {
    if (balance < amountUSDC) {
      showToast('Solde USDC insuffisant pour envoyer cette enveloppe.');
      return false;
    }

    const newBal = Number((balance - amountUSDC).toFixed(2));
    updateBalance(newBal);

    const conv = conversations.find((c) => c.id === conversationId);
    const targetName = conv?.name || 'Contact';

    addTransaction({
      type: 'p2p_send',
      title: `Enveloppe cadeau envoyée à ${targetName}`,
      amountUSDC: -amountUSDC,
      counterparty: targetName,
      status: 'completed',
      category: 'Transfert P2P',
      note: note || '🎁 Enveloppe cadeau USDC',
    });

    const envelopeMsg: ChatMessage = {
      id: `msg-env-${Date.now()}`,
      conversationId,
      senderId: user?.id || 'usr_85',
      senderName: user?.fullName || 'Moi',
      senderAddress: user?.walletAddress || '0x85...',
      type: 'gift_envelope',
      content: `Enveloppe Cadeau : ${amountUSDC} USDC`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      envelopeData: {
        amountUSDC,
        note: note || 'Un cadeau spécialement pour toi ! ✨',
        claimed: false,
      },
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), envelopeMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: `🎁 Enveloppe Cadeau : ${amountUSDC} USDC`,
              lastMessageTimestamp: envelopeMsg.timestamp,
            }
          : c
      )
    );

    confetti({ particleCount: 75, spread: 70 });
    showToast(`Enveloppe de ${amountUSDC} USDC envoyée avec succès !`);
    return true;
  };

  const claimGiftEnvelope = (conversationId: string, messageId: string): boolean => {
    const list = messages[conversationId] || [];
    const msg = list.find((m) => m.id === messageId);
    if (!msg || !msg.envelopeData || msg.envelopeData.claimed) {
      return false;
    }

    const amount = msg.envelopeData.amountUSDC;
    const newBal = Number((balance + amount).toFixed(2));
    updateBalance(newBal);

    setMessages((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId].map((m) =>
        m.id === messageId
          ? {
              ...m,
              envelopeData: {
                ...m.envelopeData!,
                claimed: true,
                claimedAt: new Date().toISOString(),
                openedBy: user?.fullName || 'Moi',
              },
            }
          : m
      ),
    }));

    const conv = conversations.find((c) => c.id === conversationId);
    addTransaction({
      type: 'envelope_claimed',
      title: `Enveloppe reçue de ${conv?.name || 'Contact'}`,
      amountUSDC: amount,
      counterparty: conv?.name,
      status: 'completed',
      category: 'Transfert P2P',
      note: `Montant crédité instantanément sur le wallet USDC`,
    });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    showToast(`Félicitations ! +${amount} USDC crédités sur votre wallet.`);
    return true;
  };

  const createConversation = (name: string, walletAddress?: string): string => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      isGroup: false,
      name,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
      walletAddress: walletAddress || `0x85${Math.random().toString(16).substring(2, 38)}`,
      memberAddresses: [walletAddress || '0x85...'],
      lastMessage: 'Conversation démarrée',
      lastMessageTimestamp: 'À l’instant',
      unreadCount: 0,
      isOnline: true,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({ ...prev, [newId]: [] }));
    setActiveConversationId(newId);
    showToast(`Conversation créée avec ${name}`);
    return newId;
  };

  const createGroupConversation = (name: string, memberNames: string[]): string => {
    const newId = `conv-grp-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      isGroup: true,
      name,
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=256&q=80',
      memberAddresses: memberNames.map(() => `0x85${Math.random().toString(16).substring(2, 8)}`),
      lastMessage: `Groupe créé (${memberNames.length + 1} membres)`,
      lastMessageTimestamp: 'À l’instant',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          id: `m-${Date.now()}`,
          conversationId: newId,
          senderId: 'system',
          senderName: 'Système',
          senderAddress: '0x8500',
          type: 'text',
          content: `Bienvenue dans le groupe "${name}". Tous les membres peuvent s'échanger des USDC et des forfaits 85.`,
          timestamp: 'À l’instant',
          status: 'read',
        },
      ],
    }));
    setActiveConversationId(newId);
    showToast(`Groupe "${name}" créé avec succès !`);
    return newId;
  };

  const blockContact = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, isBlocked: !c.isBlocked } : c))
    );
    showToast('Statut du contact mis à jour.');
  };

  const deleteMessage = (conversationId: string, messageId: string, forEveryone: boolean) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).filter((m) => m.id !== messageId),
    }));
    showToast(forEveryone ? 'Message supprimé pour tous.' : 'Message supprimé pour vous.');
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
    showToast('Conversation supprimée.');
  };

  // Calls
  const startCall = (name: string, type: 'voice' | 'video') => {
    setCallDetails({ name, type });
    setIsCallModalOpen(true);
  };

  const endCall = () => {
    setIsCallModalOpen(false);
    setCallDetails(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        user,
        setUser,
        language,
        setLanguage,
        wizardDraft,
        updateWizardDraft,
        resetWizardDraft,
        logout,

        balance,
        isLoadingBalance,
        lastUpdated,
        updateBalance,
        refetchBalance,

        transactions,
        addTransaction,

        assets,
        buyAsset,
        sellAsset,
        telecomPlan,
        renewTelecomPlan,
        giftTelecomPlan,

        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        sendGiftEnvelope,
        claimGiftEnvelope,
        createConversation,
        createGroupConversation,
        blockContact,
        deleteMessage,
        deleteConversation,

        isKotaniModalOpen,
        openKotaniModal,
        closeKotaniModal,
        depositViaKotani,

        isCallModalOpen,
        callDetails,
        startCall,
        endCall,

        isInvestorModalOpen,
        setIsInvestorModalOpen,
        isSwaggerModalOpen,
        setIsSwaggerModalOpen,

        isPhotosModalOpen,
        setIsPhotosModalOpen,
        isCinemaModalOpen,
        setIsCinemaModalOpen,
        isFlightsModalOpen,
        setIsFlightsModalOpen,
        isKpiModalOpen,
        setIsKpiModalOpen,

        registerNewUser,
        loadDemoData,
        resetToEmptySpace,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
