import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRightLeft, Landmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getBankByCode } from '../../db/philippineBanks';

export const TransferModal: React.FC = () => {
  const { isTransferOpen, setIsTransferOpen, accounts, transferFunds } = useApp();

  const [fromAccountId, setFromAccountId] = useState<number>(accounts[0]?.id || 1);
  const [toAccountId, setToAccountId] = useState<number>(accounts[1]?.id || 2);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  if (!isTransferOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (fromAccountId === toAccountId) {
      alert('Source and destination accounts must be different.');
      return;
    }

    await transferFunds(fromAccountId, toAccountId, parsedAmount, note);
    setIsTransferOpen(false);
    setAmount('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Transfer Between Accounts</h3>
          </div>
          <button
            onClick={() => setIsTransferOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Transfer Amount (PHP ₱)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono font-bold text-slate-400">
                ₱
              </span>
              <input
                type="number"
                step="any"
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-100 border border-white/10 text-2xl font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          {/* From Account */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              From Account (Sender)
            </label>
            <select
              value={fromAccountId}
              onChange={e => setFromAccountId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {accounts.map(acc => {
                const b = getBankByCode(acc.bankCode);
                return (
                  <option key={acc.id} value={acc.id}>
                    {b.logoEmoji} {acc.name} (Bal: ₱{acc.balance.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>

          {/* To Account */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              To Account (Receiver)
            </label>
            <select
              value={toAccountId}
              onChange={e => setToAccountId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {accounts.map(acc => {
                const b = getBankByCode(acc.bankCode);
                return (
                  <option key={acc.id} value={acc.id}>
                    {b.logoEmoji} {acc.name} (Bal: ₱{acc.balance.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Moved to GoTyme for 5% daily interest"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer"
            >
              Execute Instant Transfer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
