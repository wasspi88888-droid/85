export type Language = 'fr' | 'en';

export interface AfricanCountry {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  currency: string;
  popularPayment: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  countryDialCode: string;
  email: string;
  country: string;
  walletAddress: string;
  language: Language;
  twoFactorEnabled: boolean;
  biometricType: 'Face ID' | 'Empreinte digitale' | 'Passkey';
  createdAt: string;
  avatarUrl?: string;
  deviceInfo?: string;
}

export type TransactionType =
  | 'deposit'
  | 'p2p_send'
  | 'p2p_receive'
  | 'telecom_renew'
  | 'telecom_gift'
  | 'asset_buy'
  | 'asset_sell'
  | 'service_payment'
  | 'envelope_claimed';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amountUSDC: number;
  amountFCFA?: number;
  counterparty?: string;
  counterpartyAddress?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txHash: string;
  note?: string;
  category: 'Kotani Pay' | 'Transfert P2P' | 'Télécom' | 'Investissement' | 'Services';
}

export interface FractionalAsset {
  id: string;
  symbol: string;
  name: string;
  category: 'Actions US' | 'Métaux Précieux' | 'Obligations UEMOA';
  currentPriceUSDC: number;
  change24h: number; // percentage
  holdings: number; // units owned
  totalValueUSDC: number;
  description: string;
  dividendYield?: string;
  sparkline: number[];
}

export interface TelecomPlan {
  id: string;
  name: string;
  annualPriceUSDC: number;
  dataAllowance: string;
  voiceSms: string;
  coverageCountries: number;
  status: 'active' | 'expired' | 'pending';
  validUntil: string;
  autoRenew: boolean;
  features: string[];
}

export interface ThirdPartyService {
  id: string;
  title: string;
  category: string;
  provider: string;
  iconName: string;
  description: string;
  priceEstimate?: string;
  badge?: string;
  externalUrl?: string;
  actionLabel: string;
}

export type MessageContentType = 'text' | 'gift_envelope' | 'telecom_gift' | 'call_event';

export interface GiftEnvelopeData {
  amountUSDC: number;
  note: string;
  claimed: boolean;
  claimedAt?: string;
  openedBy?: string;
}

export interface TelecomGiftData {
  planName: string;
  durationMonths: number;
  validityYear: number;
  recipientPhone: string;
  claimed: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAddress: string;
  type: MessageContentType;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  envelopeData?: GiftEnvelopeData;
  telecomGiftData?: TelecomGiftData;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name: string;
  avatarUrl: string;
  walletAddress?: string;
  memberAddresses: string[];
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
  isOnline?: boolean;
  isBlocked?: boolean;
}

export interface WizardDraft {
  step: number;
  language: Language;
  fullName: string;
  phoneDialCode: string;
  phoneNumber: string;
  email: string;
  country: string;
  walletAddress?: string;
  termsAccepted: boolean;
}
