import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Target, Shield, Plane, Laptop, Plus, PiggyBank, CreditCard, Flame, Award, ChevronRight, X, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SavingsVault, DebtItem } from '../../types';

export const VaultsAndDebtsView: React.FC = () => {
  const { vaults, debts, addVault, depositToVault, addDebt, payDebt, accounts } = useApp();
  const [activeTab, setActiveTab] = useState<'vaults' | 'debts'>('vaults');

  // Vault Modal States
  const [isAddVaultOpen, setIsAddVaultOpen] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');
  const [newVaultCategory, setNewVaultCategory] = useState<'emergency' | 'travel' | 'purchase' | 'investment'>('emergency');
  const [selectedVaultForDeposit, setSelectedVaultForDeposit] = useState<SavingsVault | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositFromAccId, setDepositFromAccId] = useState<number>(accounts[0]?.id || 1);

  // Debt Modal States
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtCreditor, setNewDebtCreditor] = useState('');
  const [newDebtTotal, setNewDebtTotal] = useState('');
  const [newDebtApr, setNewDebtApr] = useState('36.0');
  const [newDebtMin, setNewDebtMin] = useState('1500');
  const [newDebtDueDate, setNewDebtDueDate] = useState('15');
  const [selectedDebtForPay, setSelectedDebtForPay] = useState<DebtItem | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payFromAccId, setPayFromAccId] = useState<number>(accounts[0]?.id || 1);

  // Calculations
  const totalSavedInVaults = vaults.reduce((sum, v) => sum + v.currentAmount, 0);
  const totalVaultsTarget = vaults.reduce((sum, v) => sum + v.targetAmount, 0);
  const overallVaultProgress = totalVaultsTarget > 0 ? Math.round((totalSavedInVaults / totalVaultsTarget) * 100) : 0;

  const totalDebtBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalDebtOriginal = debts.reduce((sum, d) => sum + d.totalBalance, 0);
  const totalDebtPaid = Math.max(0, totalDebtOriginal - totalDebtBalance);
  const overallDebtPaidProgress = totalDebtOriginal > 0 ? Math.round((totalDebtPaid / totalDebtOriginal) * 100) : 0;

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    const emojiMap: Record<string, string> = {
      emergency: '🛡️',
      travel: '✈️',
      purchase: '💻',
      investment: '📈',
    };
    await addVault({
      name: newVaultName,
      targetAmount: parseFloat(newVaultTarget) || 50000,
      currentAmount: 0,
      iconEmoji: emojiMap[newVaultCategory] || '🎯',
      category: newVaultCategory,
      color: '#10B981',
    });
    setIsAddVaultOpen(false);
    setNewVaultName('');
    setNewVaultTarget('');
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaultForDeposit?.id) return;
    const amt = parseFloat(depositAmount) || 0;
    if (amt > 0) {
      await depositToVault(selectedVaultForDeposit.id, amt, depositFromAccId);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    setSelectedVaultForDeposit(null);
    setDepositAmount('');
  };

  const handleCreateDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(newDebtTotal) || 10000;
    await addDebt({
      name: newDebtName,
      creditor: newDebtCreditor || 'Bank',
      totalBalance: total,
      currentBalance: total,
      apr: parseFloat(newDebtApr) || 24,
      minimumPayment: parseFloat(newDebtMin) || 1000,
      dueDateDay: parseInt(newDebtDueDate) || 15,
      category: 'credit_card',
      color: '#EF4444',
    });
    setIsAddDebtOpen(false);
    setNewDebtName('');
    setNewDebtCreditor('');
    setNewDebtTotal('');
  };

  const handlePayDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtForPay?.id) return;
    const amt = parseFloat(payAmount) || 0;
    if (amt > 0) {
      await payDebt(selectedDebtForPay.id, amt, payFromAccId);
      if (selectedDebtForPay.currentBalance - amt <= 0) {
        // CELEBRATION!
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
        });
      }
    }
    setSelectedDebtForPay(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Dual-Mode Vaults & Debt Payoff
          </h2>
          <p className="text-xs text-slate-400">
            Build intentional wealth while systematically eliminating liabilities.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-200 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('vaults')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vaults'
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Savings Vaults ({vaults.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'debts'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Debt Elimination ({debts.length})</span>
          </button>
        </div>
      </div>

      {/* VAULTS VIEW */}
      {activeTab === 'vaults' && (
        <div className="space-y-6">
          {/* Vaults Overview Banner */}
          <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-emerald-500/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Total Stashed in Vaults
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white font-mono mt-1">
                ₱{totalSavedInVaults.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Target: ₱{totalVaultsTarget.toLocaleString()} • {overallVaultProgress}% achieved
              </p>
            </div>

            <button
              onClick={() => setIsAddVaultOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-glow-emerald transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Vault</span>
            </button>
          </div>

          {/* Vaults Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map(vault => {
              const progress = vault.targetAmount > 0 ? Math.min(100, Math.round((vault.currentAmount / vault.targetAmount) * 100)) : 0;

              return (
                <div
                  key={vault.id}
                  className="rounded-3xl p-6 glass-card border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-6 group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-surface-50 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                        {vault.iconEmoji}
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {progress}%
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {vault.name}
                    </h3>
                    {vault.targetDate && (
                      <p className="text-[11px] text-slate-400">Target Date: {vault.targetDate}</p>
                    )}

                    {/* Amount progress */}
                    <div className="mt-6 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Saved:</span>
                        <span className="font-mono font-bold text-white">₱{vault.currentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Goal:</span>
                        <span className="font-mono text-emerald-400">₱{vault.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="mt-3 w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVaultForDeposit(vault)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    + Deposit Funds
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DEBTS VIEW */}
      {activeTab === 'debts' && (
        <div className="space-y-6">
          {/* Debts Overview Banner */}
          <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-rose-500/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Total Remaining Debt
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white font-mono mt-1">
                ₱{totalDebtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Original: ₱{totalDebtOriginal.toLocaleString()} • ₱{totalDebtPaid.toLocaleString()} paid ({overallDebtPaidProgress}%)
              </p>
            </div>

            <button
              onClick={() => setIsAddDebtOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Debt / Card</span>
            </button>
          </div>

          {/* Debts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {debts.map(debt => {
              const paidAmount = Math.max(0, debt.totalBalance - debt.currentBalance);
              const paidPercent = debt.totalBalance > 0 ? Math.min(100, Math.round((paidAmount / debt.totalBalance) * 100)) : 0;
              const isPaidOff = debt.currentBalance === 0;

              return (
                <div
                  key={debt.id}
                  className={`rounded-3xl p-6 glass-card border transition-all flex flex-col justify-between space-y-6 ${
                    isPaidOff ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-white/10 hover:border-rose-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                        {debt.category.replace('_', ' ')} • {debt.apr}% APR
                      </span>
                      {isPaidOff ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <Award className="w-4 h-4" /> DEBT FREE! 🎉
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">
                          Due day {debt.dueDateDay}th
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">{debt.name}</h3>
                    <p className="text-xs text-slate-400">{debt.creditor} • Min. payment: ₱{debt.minimumPayment.toLocaleString()}/mo</p>

                    {/* Balance */}
                    <div className="mt-6 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Current Balance:</span>
                        <span className="font-mono font-bold text-rose-400">₱{debt.currentBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Original Balance:</span>
                        <span className="font-mono text-slate-300">₱{debt.totalBalance.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3 w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                        style={{ width: `${paidPercent}%` }}
                      />
                    </div>
                    <div className="mt-1 text-right text-[10px] text-emerald-400 font-mono">
                      {paidPercent}% Paid off
                    </div>
                  </div>

                  {!isPaidOff && (
                    <button
                      onClick={() => setSelectedDebtForPay(debt)}
                      className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      💳 Make a Debt Payment
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deposit to Vault Modal */}
      {selectedVaultForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 border border-emerald-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Deposit to {selectedVaultForDeposit.name}</h3>
              <button onClick={() => setSelectedVaultForDeposit(null)} className="w-7 h-7 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Deposit Amount (PHP ₱)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Transfer From Account</label>
                <select
                  value={depositFromAccId}
                  onChange={e => setDepositFromAccId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (₱{acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald cursor-pointer"
              >
                Confirm Deposit
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Pay Debt Modal */}
      {selectedDebtForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 border border-rose-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Pay towards {selectedDebtForPay.name}</h3>
              <button onClick={() => setSelectedDebtForPay(null)} className="w-7 h-7 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePayDebt} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Payment Amount (PHP ₱) • Remaining: ₱{selectedDebtForPay.currentBalance.toLocaleString()}</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Pay From Bank Account</label>
                <select
                  value={payFromAccId}
                  onChange={e => setPayFromAccId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (₱{acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/60 cursor-pointer"
              >
                Execute Payment & Reduce Debt
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Create Vault Modal */}
      {isAddVaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create Savings Goal Vault</h3>
              <button onClick={() => setIsAddVaultOpen(false)} className="w-7 h-7 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVault} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Vault Name</label>
                <input
                  type="text"
                  placeholder="e.g. Japan Autumn Trip 2026"
                  value={newVaultName}
                  onChange={e => setNewVaultName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Milestone Amount (PHP ₱)</label>
                <input
                  type="number"
                  placeholder="e.g. 75000"
                  value={newVaultTarget}
                  onChange={e => setNewVaultTarget(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                  value={newVaultCategory}
                  onChange={e => setNewVaultCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white"
                >
                  <option value="emergency">🛡️ Emergency Fund</option>
                  <option value="travel">✈️ Travel & Vacation</option>
                  <option value="purchase">💻 Tech / Gadget Purchase</option>
                  <option value="investment">📈 Investment Stash</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald cursor-pointer"
              >
                Create Vault
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Create Debt Modal */}
      {isAddDebtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Debt or Credit Card Item</h3>
              <button onClick={() => setIsAddDebtOpen(false)} className="w-7 h-7 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDebt} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Debt / Card Name</label>
                <input
                  type="text"
                  placeholder="e.g. BPI Platinum Mastercard"
                  value={newDebtName}
                  onChange={e => setNewDebtName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Creditor / Bank</label>
                <input
                  type="text"
                  placeholder="e.g. Bank of the Philippine Islands"
                  value={newDebtCreditor}
                  onChange={e => setNewDebtCreditor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Current Balance (₱)</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={newDebtTotal}
                    onChange={e => setNewDebtTotal(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">APR Interest %</label>
                  <input
                    type="number"
                    placeholder="36.0"
                    value={newDebtApr}
                    onChange={e => setNewDebtApr(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 cursor-pointer"
              >
                Save Debt Item
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
