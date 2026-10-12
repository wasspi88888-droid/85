import React, { useState } from 'react';
import {
  Search,
  Plus,
  Send,
  Gift,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Sparkles,
  Users,
  UserPlus,
  Trash2,
  Ban,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  Copy,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, Conversation } from '../../types';

export const MessagesTab: React.FC = () => {
  const {
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
    startCall,
    balance,
    user,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showEnvelopeModal, setShowEnvelopeModal] = useState(false);
  const [envelopeAmount, setEnvelopeAmount] = useState<string>('10');
  const [envelopeNote, setEnvelopeNote] = useState<string>('Un cadeau pour toi ! 🎁');
  const [newContactName, setNewContactName] = useState('');
  const [newContactAddress, setNewContactAddress] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [showConversationMenu, setShowConversationMenu] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages: ChatMessage[] = activeConversationId ? messages[activeConversationId] || [] : [];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !inputText.trim()) return;
    sendMessage(activeConversationId, inputText);
    setInputText('');
  };

  const handleSendGiftEnvelopeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId) return;
    const amount = parseFloat(envelopeAmount) || 0;
    if (amount <= 0 || amount > balance) return;

    sendGiftEnvelope(activeConversationId, amount, envelopeNote);
    setShowEnvelopeModal(false);
    setEnvelopeAmount('10');
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    createConversation(newContactName.trim(), newContactAddress.trim() || undefined);
    setNewContactName('');
    setNewContactAddress('');
    setShowNewChatModal(false);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createGroupConversation(newGroupName.trim(), selectedGroupMembers);
    setNewGroupName('');
    setSelectedGroupMembers([]);
    setShowNewGroupModal(false);
  };

  // If in an active conversation view on mobile
  if (activeConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-md mx-auto bg-white">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between sticky top-14 z-20 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveConversationId(null)}
              className="p-1 -ml-1 rounded-full text-gray-500 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={activeConv.avatarUrl}
                alt={activeConv.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              {activeConv.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight flex items-center gap-1.5">
                {activeConv.name}
                {activeConv.isBlocked && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded-md">Bloqué</span>
                )}
              </h3>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                {activeConv.isOnline ? (
                  <span className="text-emerald-600 font-medium">En ligne</span>
                ) : (
                  <span>Hors ligne</span>
                )}
                {activeConv.walletAddress && (
                  <span className="font-mono text-gray-400 truncate max-w-[120px]">
                    • {activeConv.walletAddress.substring(0, 6)}...{activeConv.walletAddress.substring(38)}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => startCall(activeConv.name, 'voice')}
              className="p-2 rounded-full text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 transition cursor-pointer"
              title="Appel Vocal 85"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => startCall(activeConv.name, 'video')}
              className="p-2 rounded-full text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 transition cursor-pointer"
              title="Appel Vidéo HD"
            >
              <Video className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowConversationMenu(!showConversationMenu)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showConversationMenu && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30 animate-fade-in text-xs">
                  <button
                    onClick={() => {
                      blockContact(activeConv.id);
                      setShowConversationMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <Ban className="w-3.5 h-3.5 text-amber-500" />
                    <span>{activeConv.isBlocked ? 'Débloquer' : 'Bloquer le contact'}</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteConversation(activeConv.id);
                      setShowConversationMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer le contact</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]">
          {activeMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <p>Aucun message pour l&apos;instant.</p>
              <p className="mt-1">Dites bonjour ou envoyez une enveloppe cadeau USDC !</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
              const isMe = msg.senderId === (user?.id || 'usr_85_demo');

              // Telecom Gift Card Message
              if (msg.type === 'telecom_gift' && msg.telecomGiftData) {
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                      isMe
                        ? 'ml-auto bg-gradient-to-br from-orange-500 to-[#FF6B35] text-white border-orange-400'
                        : 'mr-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-white/20 text-white">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                          Cadeau Télécom 85
                        </span>
                        <h4 className="text-xs font-black">{msg.telecomGiftData.planName}</h4>
                      </div>
                    </div>
                    <p className="text-[11px] opacity-90 mb-3">
                      Valable sur les 12 pays africains partenaires avec data illimitée et appels chiffrés.
                    </p>
                    <div className="bg-white/10 rounded-xl p-2 text-center text-xs font-bold border border-white/20">
                      ✓ Forfait activé sur le numéro {msg.telecomGiftData.recipientPhone}
                    </div>
                    <span className="text-[9px] block text-right mt-2 opacity-70">{msg.timestamp}</span>
                  </div>
                );
              }

              // Gift Envelope Message
              if (msg.type === 'gift_envelope' && msg.envelopeData) {
                const env = msg.envelopeData;
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                      isMe
                        ? 'ml-auto bg-gradient-to-br from-amber-500 via-orange-500 to-[#FF6B35] text-white border-orange-400'
                        : 'mr-auto bg-gradient-to-br from-amber-50 via-white to-orange-50 text-gray-900 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-white text-[#FF6B35] flex items-center justify-center font-bold shadow-xs">
                        🎁
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isMe ? 'text-orange-100' : 'text-[#FF6B35]'}`}>
                          Enveloppe Cadeau USDC
                        </span>
                        <h4 className="text-sm font-black">
                          {env.amountUSDC} USDC
                        </h4>
                      </div>
                    </div>

                    <p className={`text-xs italic mb-3 ${isMe ? 'text-white/90' : 'text-gray-600'}`}>
                      &ldquo;{env.note}&rdquo;
                    </p>

                    {/* Claim action */}
                    {env.claimed ? (
                      <div className={`p-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 ${
                        isMe ? 'bg-black/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Enveloppe réclamée (+{env.amountUSDC} USDC au solde)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => claimGiftEnvelope(activeConv.id, msg.id)}
                        className={`w-full py-2.5 rounded-xl font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isMe
                            ? 'bg-white text-[#FF6B35] hover:bg-orange-50'
                            : 'bg-[#FF6B35] hover:bg-[#E85520] text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ouvrir l&apos;enveloppe</span>
                      </button>
                    )}

                    <span className={`text-[9px] block text-right mt-2 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                );
              }

              // Standard Text Message
              return (
                <div
                  key={msg.id}
                  className={`relative group max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'ml-auto bg-[#FF6B35] text-white rounded-br-xs shadow-xs'
                      : 'mr-auto bg-white text-gray-900 border border-gray-200/80 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-white inline" />
                        ) : (
                          <Check className="w-3 h-3 text-orange-200 inline" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Delete message dropdown */}
                  <button
                    onClick={() => setActiveMenuMessageId(activeMenuMessageId === msg.id ? null : msg.id)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-gray-600 transition"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </button>

                  {activeMenuMessageId === msg.id && (
                    <div className="absolute right-0 top-6 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-30 text-[11px] text-gray-700">
                      <button
                        onClick={() => {
                          deleteMessage(activeConv.id, msg.id, false);
                          setActiveMenuMessageId(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-gray-50"
                      >
                        Supprimer pour moi
                      </button>
                      {isMe && (
                        <button
                          onClick={() => {
                            deleteMessage(activeConv.id, msg.id, true);
                            setActiveMenuMessageId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-gray-50 text-red-600"
                        >
                          Supprimer pour tous
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200 sticky bottom-16 z-20">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEnvelopeModal(true)}
              className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B35] border border-orange-200 transition cursor-pointer active:scale-95 shrink-0"
              title="Envoyer une Enveloppe Cadeau USDC"
            >
              <Gift className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez un message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] text-xs outline-none bg-gray-50 focus:bg-white text-gray-900"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] disabled:bg-gray-200 text-white transition active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Send Gift Envelope Modal */}
        {showEnvelopeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl animate-scale-up space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-[#FF6B35] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    🎁
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Enveloppe Cadeau USDC</h3>
                    <p className="text-[10px] text-gray-500">Envoyer des fonds dans la discussion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEnvelopeModal(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSendGiftEnvelopeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Montant en USDC (Solde: {balance.toFixed(2)} USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max={balance}
                      value={envelopeAmount}
                      onChange={(e) => setEnvelopeAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-900 outline-none focus:border-[#FF6B35]"
                      required
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-extrabold text-[#FF6B35]">
                      USDC
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Message personnalisé
                  </label>
                  <input
                    type="text"
                    value={envelopeNote}
                    onChange={(e) => setEnvelopeNote(e.target.value)}
                    placeholder="Joyeux anniversaire !"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={parseFloat(envelopeAmount) > balance || parseFloat(envelopeAmount) <= 0}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF6B35] text-white font-black text-xs shadow-md transition cursor-pointer active:scale-98"
                >
                  Envoyer l&apos;enveloppe ({envelopeAmount} USDC)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Conversation List View
  return (
    <div className="max-w-md mx-auto px-4 py-3 space-y-3 pb-24">
      {/* Search & Actions Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation ou contact..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-900 outline-none focus:border-[#FF6B35]"
          />
        </div>

        <button
          onClick={() => setShowNewChatModal(true)}
          className="p-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white transition active:scale-95 shadow-xs cursor-pointer"
          title="Nouvelle conversation par adresse"
        >
          <UserPlus className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowNewGroupModal(true)}
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition active:scale-95 cursor-pointer"
          title="Créer un groupe"
        >
          <Users className="w-4 h-4" />
        </button>
      </div>

      {/* Conversations List */}
      <div className="space-y-1.5">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-900">Votre messagerie est prête</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-0.5">
                Démarrez une conversation chiffrée avec vos proches, envoyez des messages et partagez des enveloppes USDC.
              </p>
            </div>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-xs shadow-xs transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Démarrer un échange</span>
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-[#FF6B35]/40 hover:bg-orange-50/20 transition cursor-pointer active:scale-99 shadow-2xs"
            >
              <div className="relative shrink-0">
                <img
                  src={conv.avatarUrl}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
                {conv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] ring-2 ring-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 truncate flex items-center gap-1.5">
                    {conv.name}
                    {conv.isGroup && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 font-bold">
                        Groupe
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    {conv.lastMessageTimestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {conv.lastMessage || 'Nouvelle conversation'}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl animate-scale-up space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Nouvelle Conversation</h3>
            <p className="text-xs text-gray-500">Ajoutez un contact par son nom pour démarrer un échange.</p>

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom du contact</label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="ex: Patrick Achi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-gray-100 shadow-2xl animate-scale-up space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Créer un Groupe 85</h3>
            <p className="text-xs text-gray-500">Regroupez vos proches pour des transferts groupés.</p>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom du groupe</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="ex: Famille Abidjan, Startup Team"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold"
                >
                  Créer le groupe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
