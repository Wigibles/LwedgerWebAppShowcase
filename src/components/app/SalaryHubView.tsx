import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Calendar, Home, ShoppingBag, PiggyBank, Settings, Save, AlertCircle, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalaryHubView: React.FC = () => {
  const { salarySettings, updateSalarySettings, transactions, daysToNextPayday, totalIncomeThisMonth } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [grossIncome, setGrossIncome] = useState(salarySettings?.monthlyGrossIncome || 65000);
  const [frequency, setFrequency] = useState<'semi-monthly' | 'monthly' | 'weekly'>(salarySettings?.payoutFrequency || 'semi-monthly');
  const [payday1, setPayday1] = useState(salarySettings?.payday1 || 15);
  const [payday2, setPayday2] = useState(salarySettings?.payday2 || 30);
  const [needsPercent, setNeedsPercent] = useState(salarySettings?.needsTargetPercent || 50);
  const [wantsPercent, setWantsPercent] = useState(salarySettings?.wantsTargetPercent || 30);
  const [savingsPercent, setSavingsPercent] = useState(salarySettings?.savingsTargetPercent || 20);

  const effectiveIncome = salarySettings?.monthlyGrossIncome || 65000;
  const payoutDivisor = frequency === 'semi-monthly' ? 2 : frequency === 'weekly' ? 4 : 1;
  const nextPayoutAmount = effectiveIncome / payoutDivisor;

  // Calculate actual spending in each bucket for the current month
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTxs = transactions.filter(t => t.date.startsWith(currentMonthStr));

  const actualNeedsSpent = currentMonthTxs
    .filter(t => t.type === 'expense' && t.budgetBucket === 'needs')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualWantsSpent = currentMonthTxs
    .filter(t => t.type === 'expense' && t.budgetBucket === 'wants')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualSavingsContributed = currentMonthTxs
    .filter(t => (t.type === 'expense' || t.type === 'transfer') && t.budgetBucket === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  // Target caps
  const targetNeedsCap = effectiveIncome * (needsPercent / 100);
  const targetWantsCap = effectiveIncome * (wantsPercent / 100);
  const targetSavingsCap = effectiveIncome * (savingsPercent / 100);

  const needsUsagePercent = targetNeedsCap > 0 ? Math.min(100, Math.round((actualNeedsSpent / targetNeedsCap) * 100)) : 0;
  const wantsUsagePercent = targetWantsCap > 0 ? Math.min(100, Math.round((actualWantsSpent / targetWantsCap) * 100)) : 0;
  const savingsUsagePercent = targetSavingsCap > 0 ? Math.min(100, Math.round((actualSavingsContributed / targetSavingsCap) * 100)) : 0;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSalarySettings({
      monthlyGrossIncome: Number(grossIncome),
      payoutFrequency: frequency,
      payday1: Number(payday1),
      payday2: Number(payday2),
      needsTargetPercent: Number(needsPercent),
      wantsTargetPercent: Number(wantsPercent),
      savingsTargetPercent: Number(savingsPercent),
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner: Payday Countdown & Income Summary */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Calendar className="w-4 h-4" />
              <span>Next Payday Countdown</span>
            </div>
            <div className="mt-2 text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {daysToNextPayday} <span className="text-xl sm:text-2xl font-medium text-slate-400">days until cutoff</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Configured for <strong className="text-white">{frequency}</strong> payout on the {payday1}th {frequency === 'semi-monthly' ? `& ${payday2}th` : ''} of the month.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-200/80 border border-white/5 space-y-1 self-start md:self-auto min-w-[240px]">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Expected Next Payout</span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              ₱{nextPayoutAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500">
              Gross Monthly: ₱{effectiveIncome.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Edit settings toggle */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-xs font-semibold text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Salary & Splits'}</span>
          </button>
        </div>

        {/* Settings Editor Collapse */}
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSaveSettings}
            className="mt-4 p-5 rounded-2xl bg-surface-300/90 border border-amber-500/30 space-y-4"
          >
            <h4 className="text-sm font-bold text-white">Configure Paycheck Settings</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Monthly Gross Income (₱)</label>
                <input
                  type="number"
                  value={grossIncome}
                  onChange={e => setGrossIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Payout Frequency</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="semi-monthly">Semi-Monthly (15th & 30th)</option>
                  <option value="monthly">Monthly (End of month)</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Payday Cutoff Days</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={payday1}
                    onChange={e => setPayday1(Number(e.target.value))}
                    className="w-1/2 px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white"
                  />
                  {frequency === 'semi-monthly' && (
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payday2}
                      onChange={e => setPayday2(Number(e.target.value))}
                      className="w-1/2 px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Split Percentages */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Budget Splits (% Needs / % Wants / % Savings) — Total: {Number(needsPercent) + Number(wantsPercent) + Number(savingsPercent)}%
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Needs %"
                  value={needsPercent}
                  onChange={e => setNeedsPercent(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-surface-100 border border-blue-500/40 text-xs font-mono text-blue-300"
                />
                <input
                  type="number"
                  placeholder="Wants %"
                  value={wantsPercent}
                  onChange={e => setWantsPercent(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-surface-100 border border-amber-500/40 text-xs font-mono text-amber-300"
                />
                <input
                  type="number"
                  placeholder="Savings %"
                  value={savingsPercent}
                  onChange={e => setSavingsPercent(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-surface-100 border border-emerald-500/40 text-xs font-mono text-emerald-300"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-gold cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Salary Settings</span>
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* 3 Budget Buckets Real-time Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Needs Card */}
        <div className="rounded-3xl p-6 glass-card border border-blue-500/30 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Needs ({needsPercent}%)</h3>
                  <span className="text-[10px] text-slate-400">Essentials & Living</span>
                </div>
              </div>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                {needsUsagePercent}% Used
              </span>
            </div>

            {/* Spent vs Budget */}
            <div className="mt-6 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Spent:</span>
                <span className="font-mono font-bold text-white">₱{actualNeedsSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Allocation:</span>
                <span className="font-mono text-blue-400">₱{targetNeedsCap.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full h-2.5 rounded-full bg-surface-200 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all ${
                  needsUsagePercent > 90 ? 'bg-rose-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(needsUsagePercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-white/5">
            Remaining: <strong className="text-white font-mono">₱{Math.max(0, targetNeedsCap - actualNeedsSpent).toLocaleString()}</strong> for rent, utilities & groceries.
          </div>
        </div>

        {/* Wants Card */}
        <div className="rounded-3xl p-6 glass-card border border-amber-500/30 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Wants ({wantsPercent}%)</h3>
                  <span className="text-[10px] text-slate-400">Guilt-Free Spending</span>
                </div>
              </div>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {wantsUsagePercent}% Used
              </span>
            </div>

            {/* Spent vs Budget */}
            <div className="mt-6 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Spent:</span>
                <span className="font-mono font-bold text-white">₱{actualWantsSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Allocation:</span>
                <span className="font-mono text-amber-400">₱{targetWantsCap.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full h-2.5 rounded-full bg-surface-200 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all ${
                  wantsUsagePercent > 90 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(wantsUsagePercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-white/5">
            Remaining: <strong className="text-white font-mono">₱{Math.max(0, targetWantsCap - actualWantsSpent).toLocaleString()}</strong> for dining out & fun.
          </div>
        </div>

        {/* Savings & Wealth Card */}
        <div className="rounded-3xl p-6 glass-card border border-emerald-500/30 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Savings ({savingsPercent}%)</h3>
                  <span className="text-[10px] text-slate-400">Digibanks & Debt Payoff</span>
                </div>
              </div>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                {savingsUsagePercent}% Funded
              </span>
            </div>

            {/* Contributed vs Target */}
            <div className="mt-6 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Allocated to Wealth:</span>
                <span className="font-mono font-bold text-white">₱{actualSavingsContributed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Target Monthly Goal:</span>
                <span className="font-mono text-emerald-400">₱{targetSavingsCap.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full h-2.5 rounded-full bg-surface-200 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(savingsUsagePercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-white/5">
            Target Growth: <strong className="text-white font-mono">₱{targetSavingsCap.toLocaleString()}</strong> towards GoTyme 5%, MP2 & vaults.
          </div>
        </div>
      </div>
    </div>
  );
};
