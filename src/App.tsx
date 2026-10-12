import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { KotaniPayModal } from './components/common/KotaniPayModal';
import { CallModal } from './components/modals/CallModal';
import { InvestorPitchModal } from './components/modals/InvestorPitchModal';
import { SwaggerDocsModal } from './components/modals/SwaggerDocsModal';
import { KpiDashboardModal } from './components/modals/KpiDashboardModal';
import { PhotosCloudModal } from './components/services/PhotosCloudModal';
import { CinemaTicketModal } from './components/services/CinemaTicketModal';
import { FlightBookingModal } from './components/services/FlightBookingModal';
import { RegistrationWizard } from './components/wizard/RegistrationWizard';
import { MessagesTab } from './components/tabs/MessagesTab';
import { FinanceTab } from './components/tabs/FinanceTab';
import { TelecomTab } from './components/tabs/TelecomTab';
import { ServicesTab } from './components/tabs/ServicesTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { WifiOff, CheckCircle } from 'lucide-react';

const MainAppLayout: React.FC = () => {
  const {
    user,
    currentTab,
    toastMessage,
    isPhotosModalOpen,
    setIsPhotosModalOpen,
    isCinemaModalOpen,
    setIsCinemaModalOpen,
    isFlightsModalOpen,
    setIsFlightsModalOpen,
    isKpiModalOpen,
    setIsKpiModalOpen,
  } = useApp();
  const isOnline = useOnlineStatus();

  // If user is not yet registered or created wallet, show strict 6-step sequential wizard
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center">
        <RegistrationWizard />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'messages':
        return <MessagesTab />;
      case 'finance':
        return <FinanceTab />;
      case 'telecom':
        return <TelecomTab />;
      case 'services':
        return <ServicesTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <MessagesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col">
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Mode Hors-Ligne • Cache PWA Actif</span>
        </div>
      )}

      {/* Global Balance Header */}
      <Header />

      {/* Main Tab Screen */}
      <main className="flex-1 w-full">
        {renderActiveTab()}
      </main>

      {/* Global Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <KotaniPayModal />
      <CallModal />
      <InvestorPitchModal />
      <SwaggerDocsModal />
      <PhotosCloudModal isOpen={isPhotosModalOpen} onClose={() => setIsPhotosModalOpen(false)} />
      <CinemaTicketModal isOpen={isCinemaModalOpen} onClose={() => setIsCinemaModalOpen(false)} />
      <FlightBookingModal isOpen={isFlightsModalOpen} onClose={() => setIsFlightsModalOpen(false)} />
      <KpiDashboardModal isOpen={isKpiModalOpen} onClose={() => setIsKpiModalOpen(false)} />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-gray-700 text-xs font-semibold flex items-center gap-2 animate-slide-up max-w-[90vw]">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
