import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, Landmark, PieChart, Target, BarChart3, Settings, Volume2, VolumeX, Lock, Download, Plus, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppNavbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    lockApp,
    setIsQuickLogOpen,
    setQuickLogInitialType,
    setIsLwedgeChatOpen,
    setIsApkModalOpen,
    totalNetWorth,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'accounts', label: 'Accounts & Banks', icon: <Landmark className="w-4 h-4" /> },
    { id: 'salary', label: 'Salary Hub (50/30/20)', icon: <PieChart className="w-4 h-4" /> },
    { id: 'vaults', label: 'Vaults & Debts', icon: <Target className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'showcase' ? 'app' : 'showcase')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-glow-gold group-hover:scale-105 transition-transform">
              🦁
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight">Lwedger</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                  PH
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
                {viewMode === 'showcase' ? 'Presentation Mode' : 'Live Ledger App'}
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Switcher / Pill Dock (when in app mode) */}
        {viewMode === 'app' ? (
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-surface-200/90 border border-white/10 shadow-inner">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl shadow-glow-gold -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#app-mockup" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1">
              <span>📱 Android UI Mockup</span>
            </a>
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#banking" className="hover:text-amber-400 transition-colors">27+ PH Banks</a>
            <a href="#budgeting" className="hover:text-amber-400 transition-colors">50/30/20 Budget</a>
          </div>
        )}

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2.5">
          {/* View Switcher Toggle Button */}
          <button
            onClick={() => setViewMode(viewMode === 'showcase' ? 'app' : 'showcase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'showcase'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-gold'
                : 'glass-card border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{viewMode === 'showcase' ? 'Launch App' : 'Showcase Mode'}</span>
          </button>

          {/* Quick Log FAB in Header (when in App Mode) */}
          {viewMode === 'app' && (
            <button
              onClick={() => {
                setQuickLogInitialType('expense');
                setIsQuickLogOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-glow-emerald transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Log</span>
            </button>
          )}

          {/* AI Capybara Trigger */}
          <button
            onClick={() => setIsLwedgeChatOpen(true)}
            title="Chat with Lwedge AI"
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-50 border border-amber-500/30 text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            title={settings.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* PIN Lock Trigger if enabled */}
          {settings.pinEnabled && (
            <button
              onClick={lockApp}
              title="Lock Ledger"
              className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* APK Modal Trigger */}
          <button
            onClick={() => setIsApkModalOpen(true)}
            title="Download Android APK"
            className="hidden sm:flex w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-cyan-400 items-center justify-center transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Bottom Dock navigation bar when in app mode */}
      {viewMode === 'app' && (
        <div className="md:hidden flex items-center justify-around py-2 border-t border-white/10 -mx-4 px-2 bg-surface-300 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === item.id ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
