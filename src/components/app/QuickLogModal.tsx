import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRightLeft, Calendar, Tag, Landmark, Sparkles, Home, ShoppingBag, PiggyBank } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionType, BudgetBucket, ExpenseCategory, IncomeCategory } from '../../types';
import { getBankByCode } from '../../db/philippineBanks';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Groceries',
  'Transport & Gas',
  'Bills & Utilities',
  'Housing & Rent',
  'Shopping & Wants',
  'Health & Wellness',
  'Entertainment & Subscriptions',
  'Education & Career',
  'Travel & Leisure',
  'Savings & Investments',
  'Debt Repayment',
  'Other',
];

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary & Paycheck',
  'Freelance & Side Hustle',
  'Business',
  'Investments & Dividends',
  'Gifts & Allowance',
  'Other Income',
];

export const QuickLogModal: React.FC = () => {
  const {
    isQuickLogOpen,
    setIsQuickLogOpen,
    quickLogInitialType,
    accounts,
    addTransaction,
  } = useApp();

  const [type, setType] = useState<TransactionType>(quickLogInitialType || 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Food & Dining');
  const [budgetBucket, setBudgetBucket] = useState<BudgetBucket>('wants');
  const [accountId, setAccountId] = useState<number>(accounts[0]?.id || 1);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setType(quickLogInitialType);
    if (quickLogInitialType === 'income') {
      setCategory('Salary & Paycheck');
      setBudgetBucket('needs');
    } else {
      setCategory('Food & Dining');
      setBudgetBucket('wants');
    }
  }, [quickLogInitialType, isQuickLogOpen]);

  if (!isQuickLogOpen) return null;

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    // Auto bucket heuristics
    if (['Housing & Rent', 'Bills & Utilities', 'Groceries', 'Transport & Gas', 'Health & Wellness'].includes(cat)) {
      setBudgetBucket('needs');
    } else if (['Savings & Investments', 'Debt Repayment'].includes(cat)) {
      setBudgetBucket('savings');
    } else {
      setBudgetBucket('wants');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    await addTransaction({
      type,
      amount: parsedAmount,
      category,
      budgetBucket,
      accountId: Number(accountId),
      note: note.trim() || category,
      date,
    });

    setIsQuickLogOpen(false);
    setAmount('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${type === 'expense' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {type === 'expense' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h3 className="text-lg font-bold text-white">
              {type === 'expense' ? 'Log Expense' : 'Log Income'}
            </h3>
          </div>
          <button
            onClick={() => setIsQuickLogOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="flex p-1 rounded-2xl bg-surface-200 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('Food & Dining');
              setBudgetBucket('wants');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('Salary & Paycheck');
              setBudgetBucket('needs');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field with Large Typography */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Amount (PHP ₱)
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
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-surface-100 border border-white/10 text-2xl sm:text-3xl font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Description / Merchant Note
            </label>
            <input
              type="text"
              placeholder="e.g. Jollibee Chickenjoy dinner, Grab ride, SM Groceries"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Account Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Select Bank Account / E-Wallet
            </label>
            <select
              value={accountId}
              onChange={e => setAccountId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              {accounts.map(acc => {
                const bank = getBankByCode(acc.bankCode);
                return (
                  <option key={acc.id} value={acc.id}>
                    {bank.logoEmoji} {acc.name} (Bal: ₱{acc.balance.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Category & 50/30/20 Bucket Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                {type === 'expense'
                  ? EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                  : INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">50/30/20 Bucket</label>
              <select
                value={budgetBucket}
                onChange={e => setBudgetBucket(e.target.value as BudgetBucket)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                <option value="needs">50% Needs (Essential)</option>
                <option value="wants">30% Wants (Discretionary)</option>
                <option value="savings">20% Savings / Debt Payoff</option>
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-glow-gold'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-emerald'
              }`}
            >
              {type === 'expense' ? 'Record Expense' : 'Record Income'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
