import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, ArrowRight, ShieldCheck, Database, FileSpreadsheet, Zap, Plus, Minus, ArrowRightLeft, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const {
    setViewMode,
    setActiveTab,
    setIsQuickLogOpen,
    setQuickLogInitialType,
    setIsApkModalOpen,
    totalNetWorth,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    netSavingsThisMonth,
    savingsRateThisMonth,
    daysToNextPayday,
    salarySettings,
  } = useApp();

  const handleQuickLog = (type: 'expense' | 'income' | 'transfer') => {
    setQuickLogInitialType(type);
    setIsQuickLogOpen(true);
  };

  const expectedPayout = salarySettings
    ? (salarySettings.monthlyGrossIncome / (salarySettings.payoutFrequency === 'semi-monthly' ? 2 : 1))
    : 32500;

  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-emerald-500/10 to-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-amber-500/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Top Banner Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-amber-500/30 text-xs font-semibold text-amber-300 tracking-wide uppercase shadow-glow-gold">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>Next-Gen Philippine Personal Finance & AI Ledger</span>
        </div>
      </motion.div>

      {/* Hero Headline & Subhead */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mt-6 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
          Master Your Money with{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent glow-text-gold">
            AI-Driven Discipline.
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
          Experience the precision of an offline-first ledger combined with intelligent{' '}
          <strong className="text-white font-semibold">27+ Philippine banking presets</strong>,{' '}
          <strong className="text-white font-semibold">50/30/20 paycheck splits</strong>, and real-time guidance from{' '}
          <span className="text-amber-300 font-semibold inline-flex items-center gap-1">🐾 Lwedge AI</span>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setViewMode('app')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-base shadow-glow-gold hover:shadow-amber-500/50 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>Launch Live Web App</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsApkModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-xl glass-card border border-slate-700 hover:border-slate-500 text-white font-semibold text-base hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <span>Download Android APK (v1.0)</span>
          </motion.button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Mandatory Signups</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>100% Offline-First IndexedDB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Google Sheets Cloud Sync</span>
          </div>
        </div>
      </motion.div>

      {/* 💳 INTERACTIVE HERO PREVIEW COMPONENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-14 max-w-4xl mx-auto"
      >
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-amber-500/30 via-slate-800/40 to-slate-900/80 shadow-2xl shadow-black/80">
          <div className="rounded-[22px] bg-[#0c101a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 overflow-hidden">
            
            {/* Header Badge in Preview */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4" />
                <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
                  Live Interactive Ledger Preview
                </span>
              </div>
              <button
                onClick={() => setViewMode('app')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Open Full App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Liquid Assets & Savings Rate */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Total Liquid Assets
                </span>
                <div className="text-3xl sm:text-5xl font-black text-white font-mono mt-1 tracking-tight">
                  ₱{totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm font-semibold self-start sm:self-auto">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Savings Rate: {savingsRateThisMonth}%</span>
              </div>
            </div>

            {/* Cashflow Row */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-200/70 border border-white/5">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">↓ Income This Month</span>
                <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  +₱{totalIncomeThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">↑ Total Spent</span>
                <span className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                  -₱{totalExpenseThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">💰 Net Surplus</span>
                <span className={`text-lg font-bold font-mono mt-0.5 ${netSavingsThisMonth >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {netSavingsThisMonth >= 0 ? '+' : ''}₱{netSavingsThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Payday Ticker Banner */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-surface-100 to-surface-200 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-amber-300 font-mono">{daysToNextPayday} Days to Payday</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-300">Expected Payout: <strong className="text-white font-mono">₱{expectedPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                </div>
              </div>
              <button
                onClick={() => {
                  setViewMode('app');
                  setActiveTab('salary');
                }}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Salary Hub 50/30/20 →
              </button>
            </div>

            {/* Quick Action Button Bar */}
            <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleQuickLog('expense')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Log Expense</span>
                </button>
                <button
                  onClick={() => handleQuickLog('income')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Income</span>
                </button>
                <button
                  onClick={() => handleQuickLog('transfer')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewMode('app');
                    setActiveTab('accounts');
                  }}
                  className="text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/5 transition-all cursor-pointer"
                >
                  ⚡ View All 27+ Bank Cards
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
};
