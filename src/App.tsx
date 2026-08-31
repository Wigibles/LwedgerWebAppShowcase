import React from 'react';
import { useApp } from './context/AppContext';
import { AppNavbar } from './components/app/AppNavbar';
import { HeroSection } from './components/showcase/HeroSection';
import { InteractivePhoneMockup } from './components/showcase/InteractivePhoneMockup';
import { FeatureGrid } from './components/showcase/FeatureGrid';
import { BankEcosystemShowcase } from './components/showcase/BankEcosystemShowcase';
import { Paycheck503020Explainer } from './components/showcase/Paycheck503020Explainer';
import { ArchitectureDiagram } from './components/showcase/ArchitectureDiagram';
import { TestimonialsSection } from './components/showcase/TestimonialsSection';
import { Footer } from './components/showcase/Footer';
import { ApkDownloadModal } from './components/showcase/ApkDownloadModal';

import { DashboardView } from './components/app/DashboardView';
import { AccountsView } from './components/app/AccountsView';
import { SalaryHubView } from './components/app/SalaryHubView';
import { VaultsAndDebtsView } from './components/app/VaultsAndDebtsView';
import { AnalyticsView } from './components/app/AnalyticsView';
import { SettingsView } from './components/app/SettingsView';
import { QuickLogModal } from './components/app/QuickLogModal';
import { TransferModal } from './components/app/TransferModal';
import { LwedgeChatOrb } from './components/app/LwedgeChatOrb';
import { UndoBar } from './components/app/UndoBar';
import { PinLockModal } from './components/app/PinLockModal';

export const AppContent: React.FC = () => {
  const { viewMode, activeTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-3xl shadow-glow-gold animate-bounce mb-4">
          🦁
        </div>
        <div className="text-sm font-semibold tracking-wider uppercase text-amber-300 font-mono">
          Initializing Lwedger Philippine Ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <AppNavbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'showcase' ? (
          <div>
            <HeroSection />
            <InteractivePhoneMockup />
            <FeatureGrid />
            <BankEcosystemShowcase />
            <Paycheck503020Explainer />
            <ArchitectureDiagram />
            <TestimonialsSection />
            <Footer />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'accounts' && <AccountsView />}
            {activeTab === 'salary' && <SalaryHubView />}
            {activeTab === 'vaults' && <VaultsAndDebtsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        )}
      </main>

      {/* Global AI Copilot & Modals */}
      <LwedgeChatOrb />
      <QuickLogModal />
      <TransferModal />
      <ApkDownloadModal />
      <UndoBar />
      <PinLockModal />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
