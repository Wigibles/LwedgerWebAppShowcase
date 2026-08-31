import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowRightLeft,
  Calendar,
  Search,
  Trash2,
  Filter,
  Sparkles,
  ChevronRight,
  Landmark,
  Bot,
  Zap,
  ShoppingBag,
  Home,
  PiggyBank,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getBankByCode } from '../../db/philippineBanks';
import { TransactionType } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    totalNetWorth,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    netSavingsThisMonth,
    savingsRateThisMonth,
    daysToNextPayday,
    salarySettings,
    transactions,
    accounts,
    deleteTransaction,
    setIsQuickLogOpen,
    setQuickLogInitialType,
    setIsTransferOpen,
    setIsLwedgeChatOpen,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | TransactionType>('all');

  const accountMap = new Map(accounts.map(a => [a.id, a]));

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = selectedTypeFilter === 'all' || tx.type === selectedTypeFilter;
    const matchesQuery =
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (accountMap.get(tx.accountId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const expectedPayout = salarySettings
    ? (salarySettings.monthlyGrossIncome / (salarySettings.payoutFrequency === 'semi-monthly' ? 2 : 1))
    : 32500;

  const handleOpenQuickLog = (type: 'expense' | 'income' | 'transfer') => {
    if (type === 'transfer') {
      setIsTransferOpen(true);
    } else {
      setQuickLogInitialType(type);
      setIsQuickLogOpen(true);
    }
  };

  const getBucketBadge = (bucket?: string) => {
    if (bucket === 'needs') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-semibold border border-blue-500/20">
          <Home className="w-2.5 h-2.5" /> 50% Needs
        </span>
      );
    }
    if (bucket === 'wants') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-semibold border border-amber-500/20">
          <ShoppingBag className="w-2.5 h-2.5" /> 30% Wants
        </span>
      );
    }
    if (bucket === 'savings') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/20">
          <PiggyBank className="w-2.5 h-2.5" /> 20% Wealth
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner: Total Assets & Highlights */}
      <div className="relative rounded-3xl p-6 sm:p-8 glass-panel border border-amber-500/20 shadow-2xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Liquid Net Worth
              </span>
            </div>
            <div className="mt-2 text-3xl sm:text-5xl font-black text-white font-mono tracking-tight glow-text-gold">
              ₱{totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Aggregated across {accounts.length} active Philippine digital & commercial bank accounts.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenQuickLog('expense')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-950/40"
            >
              <Minus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
            <button
              onClick={() => handleOpenQuickLog('income')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Log Income</span>
            </button>
            <button
              onClick={() => handleOpenQuickLog('transfer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer</span>
            </button>
            <button
              onClick={() => setIsLwedgeChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-glow-gold"
            >
              <Bot className="w-4 h-4" />
              <span>AI Log</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-surface-200/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Income (This Month)</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                +₱{totalIncomeThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-200/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Spent (This Month)</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                -₱{totalExpenseThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-200/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Net Surplus & Rate</span>
              <div className={`text-xl font-bold font-mono mt-1 ${netSavingsThisMonth >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {netSavingsThisMonth >= 0 ? '+' : ''}₱{netSavingsThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
              {savingsRateThisMonth}%
            </div>
          </div>
        </div>
      </div>

      {/* Payday Countdown Ribbon */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-950/40 via-surface-100 to-surface-200 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-mono">{daysToNextPayday} Days to Next Payday</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">Expected: <strong className="text-white font-mono">₱{expectedPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            </div>
            <p className="text-xs text-slate-400">
              Automated 50/30/20 split: ₱{(expectedPayout * 0.5).toLocaleString()} Needs • ₱{(expectedPayout * 0.3).toLocaleString()} Wants • ₱{(expectedPayout * 0.2).toLocaleString()} Savings
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('salary')}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/20 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Open Salary Hub</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transactions Section */}
      <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">
              Showing {filteredTransactions.length} records • Real-time offline ledger
            </p>
          </div>

          {/* Filter pills & Search input */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Type tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-200 border border-white/5 text-xs">
              {(['all', 'expense', 'income', 'transfer'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTypeFilter(t)}
                  className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                    selectedTypeFilter === t
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-card border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2.5">
          <AnimatePresence>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No transactions found matching your criteria. Try logging one with Lwedge AI or Quick Log!
              </div>
            ) : (
              filteredTransactions.map(tx => {
                const acc = accountMap.get(tx.accountId);
                const bankPreset = acc ? getBankByCode(acc.bankCode) : undefined;
                const toAcc = tx.toAccountId ? accountMap.get(tx.toAccountId) : undefined;
                const toBankPreset = toAcc ? getBankByCode(toAcc.bankCode) : undefined;

                return (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl glass-card border border-white/5 hover:border-white/15 flex items-center justify-between gap-4 group transition-all"
                  >
                    {/* Left: Icon & Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            : tx.type === 'transfer'
                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                            : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {bankPreset?.logoEmoji || (tx.type === 'income' ? '💰' : tx.type === 'transfer' ? '⇄' : '💸')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                            {tx.note || tx.category}
                          </span>
                          {getBucketBadge(tx.budgetBucket)}
                          {tx.isAiLogged && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 font-medium text-slate-300">
                            <Landmark className="w-3 h-3 text-slate-400" />
                            {acc?.name || 'Unknown Account'}
                            {tx.type === 'transfer' && toAcc && (
                              <>
                                <span>→</span>
                                {toAcc.name}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Delete Button */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div
                          className={`text-base font-bold font-mono ${
                            tx.type === 'income'
                              ? 'text-emerald-400'
                              : tx.type === 'transfer'
                              ? 'text-cyan-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}₱
                          {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">
                          {tx.type}
                        </span>
                      </div>

                      {/* Delete action button */}
                      <button
                        onClick={() => tx.id && deleteTransaction(tx.id)}
                        title="Delete transaction (5-second undo available)"
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-surface-100 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
