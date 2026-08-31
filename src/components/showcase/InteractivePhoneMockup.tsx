import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  ArrowRightLeft,
  Search,
  SlidersHorizontal,
  Receipt,
  PieChart,
  Gauge,
  AlertTriangle,
  PiggyBank,
  Sparkles,
  Send,
  Trash2,
  X,
  TrendingDown,
  TrendingUp,
  ArrowDown,
  ArrowUp,
  Bot,
  CheckCircle2,
  Smartphone,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InteractivePhoneMockup: React.FC = () => {
  const { setViewMode, setIsApkModalOpen } = useApp();
  const [activeScreen, setActiveScreen] = useState<'home' | 'budget' | 'coach'>('home');
  const [activeActivityTab, setActiveActivityTab] = useState<'all' | 'expense' | 'income'>('all');
  const [activeBudgetTab, setActiveBudgetTab] = useState<'cap' | 'allocation'>('allocation');
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [coachInput, setCoachInput] = useState('');

  const handleAuditClick = (type: string) => {
    if (type === '503020') {
      setCoachResponse(
        '📊 **50/30/20 Health Audit for Luigi**:\n• **Net Income**: ₱23,650.00\n• **Allocated (Needs + Wants)**: 52% (₱12,500.00)\n• **Unallocated / Savings**: ₱11,150.00 (47.1%)\n\n✅ *Verdict*: Outstanding savings capacity! Recommended: channel ₱5,000 to Emergency Vault and ₱6,150 to GoTyme High Yield (5% p.a.).'
      );
    } else if (type === 'cashflow') {
      setCoachResponse(
        '⏱️ **Payday Velocity Projection**:\n• **14 Days remaining** until next payout (₱23,650.00).\n• **Liquid balance**: ₱1,900.00 in GoTyme.\n• **Safe Daily Burn Rate**: ₱135.71/day.\n\n⚠️ *Advice*: Keep discretionary dining under ₱100/day until salary credit.'
      );
    } else if (type === 'leaks') {
      setCoachResponse(
        '🔍 **Spending Drift Analysis**:\n• Food Cap: ₱5,000.00 (₱0.00 spent so far — 100% remaining).\n• Zero leakages detected for August 2026!\n• 100% compliant with intentional spending targets.'
      );
    } else if (type === 'vaults') {
      setCoachResponse(
        '🏦 **Vault Feasibility Projection**:\n• GoTyme Direct: ₱1,900.00\n• At ₱5,000/month allocation, your 6-Month Emergency Buffer will reach 50% milestone within 4 pay cycles.'
      );
    }
  };

  const handleSendCoach = () => {
    if (!coachInput.trim()) return;
    setCoachResponse(
      `🐾 **Lwedge Assistant**: Understood "${coachInput}". I've recorded your query. With your ₱1,900.00 GoTyme balance and 14 days to payday, this keeps you within your safe spending limit!`
    );
    setCoachInput('');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="app-mockup">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-amber-500/30 text-xs font-semibold text-amber-300 tracking-wide uppercase shadow-glow-gold mb-4">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Pixel-Perfect Android Native UI</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Experience the Native Android Interface
        </h2>
        <p className="mt-4 text-slate-400 text-base sm:text-lg">
          Click around the interactive Android mockup below to preview the exact screens, budget allocations, and AI Copilot built into the Lwedger APK.
        </p>

        {/* Screen Switcher Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-surface-200/80 border border-white/10 max-w-lg mx-auto">
          <button
            onClick={() => {
              setActiveScreen('home');
              setCoachResponse(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeScreen === 'home'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            1. Home Dashboard
          </button>
          <button
            onClick={() => {
              setActiveScreen('budget');
              setCoachResponse(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeScreen === 'budget'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            2. Budget Allocations
          </button>
          <button
            onClick={() => setActiveScreen('coach')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeScreen === 'coach'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-glow-gold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            3. Lwedge AI Coach
          </button>
        </div>
      </div>

      {/* Main Mockup Showcase Area */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
        
        {/* Left Side: Screen Context & Highlights */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                {activeScreen === 'home' && <Layers className="w-5 h-5" />}
                {activeScreen === 'budget' && <PieChart className="w-5 h-5" />}
                {activeScreen === 'coach' && <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  {activeScreen === 'home' && 'Live Android Screen 1 of 3'}
                  {activeScreen === 'budget' && 'Live Android Screen 2 of 3'}
                  {activeScreen === 'coach' && 'Live Android Screen 3 of 3'}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeScreen === 'home' && 'Dashboard & Liquid Assets'}
                  {activeScreen === 'budget' && 'Spending Targets & Paycheck'}
                  {activeScreen === 'coach' && 'Lwedge Copilot Diagnostics'}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeScreen === 'home' &&
                'Clean, glanceable financial status for Filipino wealth builders. Features real-time GoTyme balances, instant payday countdowns, and quick logging buttons with 0-friction.'}
              {activeScreen === 'budget' &&
                'Automatic 50/30/20 income allocation planning. Features monthly activity heatmaps, category budget caps, and unallocated fund tracking for maximum savings discipline.'}
              {activeScreen === 'coach' &&
                'Offline + DeepSeek AI financial coach. Instant 1-tap audits evaluate your 50/30/20 ratio, calculate remaining daily burn rate velocity, and detect leaks before you overspend.'}
            </p>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Rendering Engine:</span>
                <span className="text-white font-mono">Jetpack Compose + Material 3</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Theme:</span>
                <span className="text-amber-300 font-mono">OLED Deep Dark (#0B0F19)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Bank Integration:</span>
                <span className="text-cyan-400 font-mono">GoTyme Bank Digital Direct</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsApkModalOpen(true)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-gold hover:opacity-95 cursor-pointer"
              >
                <span>Install on Device (APK)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('app')}
                className="py-3 px-4 rounded-xl glass-card border border-white/10 hover:border-white/20 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Launch Web App
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: THE PIXEL-PERFECT ANDROID DEVICE FRAME */}
        <div className="relative w-full max-w-[390px] sm:max-w-[410px]">
          
          {/* Ambient Glow behind phone */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-indigo-500/15 to-emerald-500/20 blur-2xl rounded-[50px] pointer-events-none" />

          {/* Android Smartphone Outer Chassis */}
          <div className="relative rounded-[48px] p-3 bg-gradient-to-b from-[#2B303C] via-[#151922] to-[#0D1017] border-[4px] border-[#384050] shadow-2xl shadow-black">
            
            {/* Phone Screen Container */}
            <div className="relative rounded-[38px] bg-[#07090E] overflow-hidden text-slate-100 min-h-[780px] max-h-[820px] flex flex-col font-sans select-none border border-white/5">
              
              {/* Android Status Bar */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-30">
                <span className="font-mono">11:08</span>
                
                {/* Punch Hole Camera */}
                <div className="w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#121722]" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                  <span>⚙️</span>
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  SCREEN 1: HOME DASHBOARD (Screenshot 1)
                  ───────────────────────────────────────────────────────────── */}
              {activeScreen === 'home' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex-1 px-4 pt-2 pb-6 overflow-y-auto space-y-4 no-scrollbar"
                >
                  {/* Top Profile Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#1A2234] border border-white/10 flex items-center justify-center text-slate-200 font-bold text-lg">
                        L
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white">Good morning, Luigi</h3>
                        <p className="text-[11px] text-slate-400">Build wealth with intentionality & discipline</p>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#131927] hover:bg-[#1C2538] flex items-center justify-center text-slate-300 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Total Liquid Assets Card */}
                  <div className="p-5 rounded-3xl bg-[#0D1424] border border-white/5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Total Liquid Assets</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1C2538] text-slate-300 text-[11px] font-semibold">
                        Savings: 0%
                      </span>
                    </div>

                    <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                      ₱1,900.00
                    </div>

                    {/* Sub Container: Income & Spent */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#151D2F] border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#202B42] flex items-center justify-center text-slate-400">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Income</div>
                          <div className="text-xs font-bold text-white font-mono">₱0.00</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
                        <div className="w-8 h-8 rounded-full bg-[#202B42] flex items-center justify-center text-slate-400">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Spent</div>
                          <div className="text-xs font-bold text-white font-mono">₱0.00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payday Banner Card */}
                  <div
                    onClick={() => setActiveScreen('budget')}
                    className="p-3.5 rounded-2xl bg-[#0E1526] border border-white/5 flex items-center justify-between hover:border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#182136] flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">14 days to Payday</div>
                        <div className="text-[11px] text-slate-400">Salary: ₱23,650.00</div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-slate-400 gap-0.5">
                      <span>Salary Hub</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* 3 Quick Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button className="py-2.5 px-2 rounded-xl bg-[#28131B] border border-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#381B26] transition-colors cursor-pointer">
                      <Minus className="w-3.5 h-3.5" />
                      <span>Expense</span>
                    </button>
                    <button className="py-2.5 px-2 rounded-xl bg-[#0E281F] border border-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#13382B] transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Income</span>
                    </button>
                    <button className="py-2.5 px-2 rounded-xl bg-[#0F2038] border border-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#152B4B] transition-colors cursor-pointer">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Transfer</span>
                    </button>
                  </div>

                  {/* My Accounts Header */}
                  <div className="flex items-center justify-between pt-1">
                    <h4 className="text-sm font-bold text-white">My Accounts</h4>
                    <span className="text-xs text-slate-400 hover:text-white cursor-pointer">Manage</span>
                  </div>

                  {/* GoTyme Bank Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#5E6BFF] to-[#7B86FF] text-white shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">GoTyme Bank</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold tracking-wider">
                        BANK
                      </span>
                    </div>
                    <div className="text-xl font-black font-mono">₱1,900.00</div>
                    <div className="text-[10px] text-white/80">Direct Account</div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/5 text-xs text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                      <span>Search transactions...</span>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-[#0E1526] border border-white/5 flex items-center justify-center text-slate-300">
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Recent Activity Section */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Recent Activity</h4>
                      <div className="flex gap-1 text-[10px]">
                        <button
                          onClick={() => setActiveActivityTab('all')}
                          className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                            activeActivityTab === 'all'
                              ? 'bg-slate-200 text-slate-950'
                              : 'bg-[#151D2F] text-slate-400'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setActiveActivityTab('expense')}
                          className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                            activeActivityTab === 'expense'
                              ? 'bg-slate-200 text-slate-950'
                              : 'bg-[#151D2F] text-slate-400'
                          }`}
                        >
                          Expense
                        </button>
                        <button
                          onClick={() => setActiveActivityTab('income')}
                          className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                            activeActivityTab === 'income'
                              ? 'bg-slate-200 text-slate-950'
                              : 'bg-[#151D2F] text-slate-400'
                          }`}
                        >
                          Income
                        </button>
                      </div>
                    </div>

                    {/* Empty State */}
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-1.5">
                      <Receipt className="w-8 h-8 text-slate-600 mb-1" />
                      <div className="text-xs font-bold text-slate-300">No transactions found</div>
                      <div className="text-[10px] text-slate-500">
                        Tap + to add your first expense or income
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  SCREEN 2: BUDGET ALLOCATIONS (Screenshot 2)
                  ───────────────────────────────────────────────────────────── */}
              {activeScreen === 'budget' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 px-4 pt-2 pb-6 overflow-y-auto space-y-4 no-scrollbar"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Spending Targets</span>
                      <h3 className="text-xl font-extrabold text-white">Budget Allocations</h3>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1C2436] hover:bg-[#253046] text-white text-xs font-semibold">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Budget</span>
                    </button>
                  </div>

                  {/* Month Picker */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1526] border border-white/5">
                    <button className="text-slate-400 hover:text-white">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">August 2026</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#1C2538] text-[9px] font-bold text-slate-300">
                        Current
                      </span>
                    </div>
                    <button className="text-slate-400 hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Income Allocation Plan Card */}
                  <div className="p-4 rounded-3xl bg-[#0D1424] border border-white/5 space-y-3">
                    {/* Segmented Control */}
                    <div className="grid grid-cols-2 p-1 rounded-xl bg-[#141B2D] text-xs font-semibold">
                      <button
                        onClick={() => setActiveBudgetTab('cap')}
                        className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeBudgetTab === 'cap' ? 'bg-[#1F293D] text-white' : 'text-slate-400'
                        }`}
                      >
                        Spending Target Cap
                      </button>
                      <button
                        onClick={() => setActiveBudgetTab('allocation')}
                        className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeBudgetTab === 'allocation' ? 'bg-[#1F293D] text-white' : 'text-slate-400'
                        }`}
                      >
                        Income Allocation Plan
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">Monthly Net Income</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#0F3025] text-emerald-300 text-[10px] font-bold">
                        52% Allocated
                      </span>
                    </div>

                    <div className="text-2xl font-black text-white font-mono">
                      ₱23,650.00
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#182136] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[52%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-400 font-medium">Unallocated: ₱11,150.00</span>
                      <span className="text-slate-400">4 Categories</span>
                    </div>
                  </div>

                  {/* Monthly Activity Calendar Card */}
                  <div className="p-4 rounded-3xl bg-[#0D1424] border border-white/5 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-white">Monthly Activity Calendar</h4>
                      <p className="text-[10px] text-slate-400">Transaction frequency for August 2026</p>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-slate-500 font-semibold py-1">
                          {d}
                        </div>
                      ))}
                      {/* Empty slots for month start */}
                      <div /><div /><div /><div /><div /><div />
                      {/* Day 1 */}
                      <div className="py-1.5 text-slate-400 font-mono">1</div>
                      {/* Days 2 to 30 */}
                      {Array.from({ length: 29 }, (_, i) => i + 2).map(day => (
                        <div key={day} className="py-1.5 text-slate-400 font-mono">
                          {day}
                        </div>
                      ))}
                      {/* Day 31 (Selected pill) */}
                      <div className="py-1 text-white font-bold font-mono rounded-lg border border-slate-500 bg-[#1C2538]">
                        31
                      </div>
                    </div>
                  </div>

                  {/* Category Budgets (4) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold text-white">Category Budgets (4)</h4>
                      <span className="text-slate-400 text-[11px]">Select to edit limit</span>
                    </div>

                    {/* Food Budget Card */}
                    <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#1C2538] flex items-center justify-center text-base">
                            🍔
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Food</div>
                            <div className="text-[10px] text-slate-400">Cap: ₱5,000.00</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-1.5 py-0.5 rounded bg-[#0E281F] text-emerald-400 text-[9px] font-bold">
                            Healthy
                          </span>
                          <div className="text-xs font-bold text-white font-mono mt-0.5">₱0.00</div>
                          <div className="text-[9px] text-slate-400">0% used</div>
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#182136]" />

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Remaining: ₱5,000.00</span>
                        <span>100% left</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  SCREEN 3: LWEDGE COACH MODAL / COPILOT (Screenshot 3)
                  ───────────────────────────────────────────────────────────── */}
              {activeScreen === 'coach' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="flex-1 px-3 pt-1 pb-4 flex flex-col justify-between overflow-y-auto no-scrollbar"
                >
                  {/* Coach Modal Inner Card */}
                  <div className="p-4 rounded-3xl bg-[#111726] border border-white/10 shadow-2xl space-y-3 flex-1 flex flex-col">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#1F2A3F] flex items-center justify-center text-lg">
                          🐾
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-extrabold text-white">Lwedge Coach</h3>
                            <span className="px-1.5 py-0.2 rounded bg-[#0E2C1E] text-emerald-400 text-[9px] font-mono font-bold">
                              Online
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400">Deterministic + GenAI Copilot</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCoachResponse(null)}
                          className="w-7 h-7 rounded-full text-slate-400 hover:text-white flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveScreen('home')}
                          className="w-7 h-7 rounded-full text-slate-400 hover:text-white flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Instant Diagnostics Card */}
                    <div className="p-3 rounded-2xl bg-[#161F33] border border-white/5 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">Instant Financial Diagnostics</div>
                          <div className="text-[9px] text-slate-400">Runs 100% locally or via DeepSeek AI</div>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        I have real-time access to your balances (<strong className="text-white">₱1,900.00</strong>), budgets, and pay cycles. Select an instant audit below:
                      </p>

                      {/* 4 Instant Diagnostic Actions */}
                      <div className="space-y-1.5 pt-1">
                        {/* 1. 50/30/20 Health Audit */}
                        <button
                          onClick={() => handleAuditClick('503020')}
                          className="w-full p-2.5 rounded-xl bg-[#1A253E] hover:bg-[#223050] text-left flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#103026] text-emerald-400 flex items-center justify-center shrink-0">
                            <PieChart className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-white flex items-center justify-between">
                              <span>50/30/20 Financial Health Audit</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              Calculate ratio compliance across Needs, Wants & Savings
                            </div>
                          </div>
                        </button>

                        {/* 2. Payday Cash Flow */}
                        <button
                          onClick={() => handleAuditClick('cashflow')}
                          className="w-full p-2.5 rounded-xl bg-[#1A253E] hover:bg-[#223050] text-left flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#202B40] text-cyan-400 flex items-center justify-center shrink-0">
                            <Gauge className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-white flex items-center justify-between">
                              <span>Payday Cash Flow Projection</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              Daily spending velocity until next expected paycheck
                            </div>
                          </div>
                        </button>

                        {/* 3. Spending Leaks */}
                        <button
                          onClick={() => handleAuditClick('leaks')}
                          className="w-full p-2.5 rounded-xl bg-[#1A253E] hover:bg-[#223050] text-left flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#351B22] text-rose-400 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-white flex items-center justify-between">
                              <span>Spending Leaks & Drift Audit</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              Detect overspending categories against your budget
                            </div>
                          </div>
                        </button>

                        {/* 4. Savings Feasibility */}
                        <button
                          onClick={() => handleAuditClick('vaults')}
                          className="w-full p-2.5 rounded-xl bg-[#1A253E] hover:bg-[#223050] text-left flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#162744] text-blue-400 flex items-center justify-center shrink-0">
                            <PiggyBank className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-white flex items-center justify-between">
                              <span>Savings & Vaults Feasibility</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              Timeline projection for all active savings targets
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* AI Response Output Card if generated */}
                    {coachResponse && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl bg-[#1E2942] border border-amber-500/30 text-[10px] text-slate-200 leading-relaxed whitespace-pre-line"
                      >
                        {coachResponse}
                      </motion.div>
                    )}

                    {/* Bottom Quick Chips */}
                    <div className="flex gap-1 overflow-x-auto text-[9px] no-scrollbar pt-1">
                      <button
                        onClick={() => handleAuditClick('503020')}
                        className="px-2 py-1 rounded-full bg-[#18233A] text-slate-300 whitespace-nowrap cursor-pointer hover:text-white"
                      >
                        50/30/20 Financial Health Audit
                      </button>
                      <button
                        onClick={() => handleAuditClick('cashflow')}
                        className="px-2 py-1 rounded-full bg-[#18233A] text-slate-300 whitespace-nowrap cursor-pointer hover:text-white"
                      >
                        Payday Cash Flow...
                      </button>
                    </div>

                    {/* Input Bar */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Ask Lwedge about your finances..."
                        value={coachInput}
                        onChange={e => setCoachInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSendCoach();
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#182236] border border-white/5 text-[10px] text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        onClick={handleSendCoach}
                        className="w-8 h-8 rounded-xl bg-[#202C45] hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  FLOATING ELEMENTS & GESTURE NAV BAR (COMMON TO SCREENS 1 & 2)
                  ───────────────────────────────────────────────────────────── */}
              {activeScreen !== 'coach' && (
                <>
                  {/* Floating Action Capybara Orb */}
                  <div
                    onClick={() => setActiveScreen('coach')}
                    className="absolute bottom-10 right-5 w-12 h-12 rounded-full bg-[#1A253A] border border-amber-500/40 flex items-center justify-center text-xl cursor-pointer shadow-glow-gold hover:scale-105 transition-transform z-30"
                  >
                    <span>🐾</span>
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1A253A]" />
                  </div>

                  {/* Floating Capsule Bottom Pill */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <button
                      onClick={() => setActiveScreen(activeScreen === 'home' ? 'budget' : 'home')}
                      className="px-4 py-2 rounded-full bg-[#131B2C]/90 border border-white/10 backdrop-blur-md text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow-xl hover:bg-[#1C253B] transition-colors cursor-pointer"
                    >
                      {activeScreen === 'home' ? (
                        <>
                          <span>🏠</span>
                          <span>Home ^</span>
                        </>
                      ) : (
                        <>
                          <span>🗂️</span>
                          <span>Budget Scopes ^</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Android Home Navigation Bar */}
              <div className="h-4 flex items-center justify-center pb-1 z-30">
                <div className="w-28 h-1 rounded-full bg-slate-500/50" />
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
