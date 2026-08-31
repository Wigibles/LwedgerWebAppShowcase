import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRightLeft, Landmark, Wallet, Smartphone, Sparkles, Check, Edit2, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PHILIPPINE_BANKS, getBankByCode } from '../../db/philippineBanks';
import { Account, BankCategory } from '../../types';

export const AccountsView: React.FC = () => {
  const { accounts, addAccount, setIsTransferOpen, transactions } = useApp();
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState('GOTYME');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const selectedBankPreset = getBankByCode(selectedBankCode);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const preset = getBankByCode(selectedBankCode);
    const balanceNum = parseFloat(initialBalance) || 0;

    await addAccount({
      bankCode: preset.code,
      name: accountName || `${preset.name} Account`,
      accountNumberMasked: accountNumber ? `•••• ${accountNumber.slice(-4)}` : '•••• 0000',
      balance: balanceNum,
      currency: 'PHP',
      category: preset.category,
    });

    setIsAddAccountModalOpen(false);
    setAccountName('');
    setAccountNumber('');
    setInitialBalance('');
  };

  const activeFilteredTransactions = selectedAccountId
    ? transactions.filter(t => t.accountId === selectedAccountId || t.toAccountId === selectedAccountId)
    : [];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Philippine Bank Accounts & Wallets
          </h2>
          <p className="text-xs text-slate-400">
            {accounts.length} active connected accounts • Native brand visualizers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/10 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Funds</span>
          </button>

          <button
            onClick={() => setIsAddAccountModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-glow-gold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Link Bank / Wallet</span>
          </button>
        </div>
      </div>

      {/* Grid of Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => {
          const bank = getBankByCode(acc.bankCode);
          const isSelected = selectedAccountId === acc.id;

          return (
            <motion.div
              key={acc.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedAccountId(isSelected ? null : (acc.id || null))}
              className={`relative rounded-3xl p-6 bg-gradient-to-br ${bank.gradient} text-white shadow-xl overflow-hidden cursor-pointer border transition-all ${
                isSelected ? 'ring-2 ring-amber-400 border-transparent' : 'border-white/10'
              }`}
            >
              {/* Subtle background monogram/chip */}
              <div className="absolute top-4 right-5 text-4xl opacity-30 select-none">
                {bank.logoEmoji}
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 block">
                    {bank.shortName} • {acc.category.toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold tracking-tight mt-0.5 max-w-[200px] truncate">
                    {acc.name}
                  </h3>
                </div>
              </div>

              {/* Masked Card Number & Chip */}
              <div className="mt-8 flex items-center justify-between">
                <div className="w-8 h-6 rounded bg-amber-300/30 border border-amber-200/40 flex items-center justify-center">
                  <div className="w-4 h-3 border border-amber-200/60 rounded-sm" />
                </div>
                <span className="text-xs font-mono tracking-widest opacity-90">
                  {acc.accountNumberMasked}
                </span>
              </div>

              {/* Balance */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-75">Available Balance</span>
                  <div className="text-2xl font-black font-mono tracking-tight">
                    ₱{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {bank.interestRate && (
                  <span className="px-2 py-0.5 rounded-full bg-black/30 border border-white/20 text-[10px] font-mono font-semibold">
                    {bank.interestRate}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Account Transactions Drilldown */}
      {selectedAccountId && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 glass-panel border border-amber-500/30 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Transactions for {accounts.find(a => a.id === selectedAccountId)?.name}
              </h3>
              <p className="text-xs text-slate-400">Filtered view</p>
            </div>
            <button
              onClick={() => setSelectedAccountId(null)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-surface-100 cursor-pointer"
            >
              Clear Filter
            </button>
          </div>

          <div className="space-y-2">
            {activeFilteredTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No transactions recorded for this account yet.</p>
            ) : (
              activeFilteredTransactions.map(tx => (
                <div key={tx.id} className="p-3 rounded-xl glass-card border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{tx.note || tx.category}</span>
                    <div className="text-[10px] text-slate-400">{tx.date} • {tx.category}</div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}₱{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Add Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Link Philippine Bank or Wallet</h3>
              <button
                onClick={() => setIsAddAccountModalOpen(false)}
                className="w-7 h-7 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              {/* Select Bank Preset */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Select Philippine Institution Preset
                </label>
                <select
                  value={selectedBankCode}
                  onChange={e => {
                    setSelectedBankCode(e.target.value);
                    const preset = getBankByCode(e.target.value);
                    setAccountName(`${preset.shortName} Account`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-card border border-white/10 text-xs text-white bg-surface-200 focus:outline-none focus:border-amber-500/50"
                >
                  <optgroup label="Digital Banks">
                    {PHILIPPINE_BANKS.filter(b => b.category === 'digital').map(b => (
                      <option key={b.code} value={b.code}>
                        {b.logoEmoji} {b.name} ({b.shortName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Commercial & Traditional Banks">
                    {PHILIPPINE_BANKS.filter(b => b.category === 'commercial').map(b => (
                      <option key={b.code} value={b.code}>
                        {b.logoEmoji} {b.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="E-Wallets">
                    {PHILIPPINE_BANKS.filter(b => b.category === 'ewallet').map(b => (
                      <option key={b.code} value={b.code}>
                        {b.logoEmoji} {b.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cash">
                    <option value="CASH">💵 Cash on Hand</option>
                  </optgroup>
                </select>
              </div>

              {/* Custom Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Account Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. GoTyme Emergency Stash"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-card border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Account Number (Last 4 digits) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Account Number / Phone (Masked)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8920 or 0917"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-card border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Initial Balance */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Starting Balance (PHP ₱)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={initialBalance}
                  onChange={e => setInitialBalance(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-card border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-glow-gold hover:opacity-95 transition-all cursor-pointer"
                >
                  Create & Link Account
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
