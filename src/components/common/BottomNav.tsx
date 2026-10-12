import React from 'react';
import { MessageSquare, Wallet, Smartphone, Layers, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS } from '../../constants/translations';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, conversations, language } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const t = TRANSLATIONS[language].tabs;

  const navItems = [
    {
      id: 'messages' as const,
      label: t.messages,
      icon: MessageSquare,
      badge: totalUnread > 0 ? totalUnread : null,
    },
    {
      id: 'finance' as const,
      label: t.finance,
      icon: Wallet,
      badge: null,
    },
    {
      id: 'telecom' as const,
      label: t.telecom,
      icon: Smartphone,
      badge: null,
    },
    {
      id: 'services' as const,
      label: t.services,
      icon: Layers,
      badge: null,
    },
    {
      id: 'profile' as const,
      label: t.profile,
      icon: User,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-all active:scale-95 cursor-pointer select-none ${
                isActive ? 'text-[#FF6B35]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#FF6B35] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 transition-all ${
                  isActive ? 'font-bold text-[#FF6B35]' : 'font-medium text-gray-500'
                }`}
              >
                {item.label}
              </span>

              {/* Active tiny indicator bar */}
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-[#FF6B35]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
