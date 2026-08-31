import { db } from './schema';
import { Account, Transaction, SavingsVault, DebtItem, SalarySettings } from '../types';

export const INITIAL_ACCOUNTS: Omit<Account, 'id'>[] = [
  {
    bankCode: 'GOTYME',
    name: 'GoTyme High-Yield Savings',
    accountNumberMasked: '•••• 8920',
    balance: 65400.00,
    currency: 'PHP',
    category: 'digital',
  },
  {
    bankCode: 'SEABANK',
    name: 'SeaBank Daily Interest',
    accountNumberMasked: '•••• 3314',
    balance: 32150.00,
    currency: 'PHP',
    category: 'digital',
  },
  {
    bankCode: 'BPI',
    name: 'BPI Payroll & Checking',
    accountNumberMasked: '•••• 5109',
    balance: 28500.00,
    currency: 'PHP',
    category: 'commercial',
  },
  {
    bankCode: 'BDO',
    name: 'BDO Savings Account',
    accountNumberMasked: '•••• 7021',
    balance: 14200.00,
    currency: 'PHP',
    category: 'commercial',
  },
  {
    bankCode: 'GCASH',
    name: 'GCash Wallet',
    accountNumberMasked: '0917 •••• 421',
    balance: 5500.00,
    currency: 'PHP',
    category: 'ewallet',
  },
  {
    bankCode: 'MAYA_WALLET',
    name: 'Maya E-Wallet',
    accountNumberMasked: '0918 •••• 992',
    balance: 2500.00,
    currency: 'PHP',
    category: 'ewallet',
  },
];

export const INITIAL_VAULTS: Omit<SavingsVault, 'id'>[] = [
  {
    name: '6-Month Emergency Fund',
    targetAmount: 180000,
    currentAmount: 97550,
    iconEmoji: '🛡️',
    category: 'emergency',
    color: '#10B981',
    targetDate: '2026-12-31',
  },
  {
    name: 'Tokyo Autumn Trip 🇯🇵',
    targetAmount: 75000,
    currentAmount: 38200,
    iconEmoji: '✈️',
    category: 'travel',
    color: '#06B6D4',
    targetDate: '2026-10-15',
  },
  {
    name: 'MacBook M3 Pro Upgrade',
    targetAmount: 110000,
    currentAmount: 42000,
    iconEmoji: '💻',
    category: 'purchase',
    color: '#8B5CF6',
    targetDate: '2026-11-30',
  },
];

export const INITIAL_DEBTS: Omit<DebtItem, 'id'>[] = [
  {
    name: 'BPI Gold Rewards Mastercard',
    creditor: 'Bank of the Philippine Islands',
    totalBalance: 35000,
    currentBalance: 12450,
    apr: 36.0,
    minimumPayment: 1500,
    dueDateDay: 18,
    category: 'credit_card',
    color: '#EF4444',
  },
  {
    name: 'Shopee SPayLater Installment',
    creditor: 'SeaMoney (SPayLater)',
    totalBalance: 15000,
    currentBalance: 4200,
    apr: 24.0,
    minimumPayment: 1400,
    dueDateDay: 15,
    category: 'bnpl',
    color: '#F97316',
  },
];

export const INITIAL_SALARY_SETTINGS: Omit<SalarySettings, 'id'> = {
  monthlyGrossIncome: 65000,
  payoutFrequency: 'semi-monthly',
  payday1: 15,
  payday2: 30,
  needsTargetPercent: 50,
  wantsTargetPercent: 30,
  savingsTargetPercent: 20,
};

export const getInitialTransactions = (accountMap: Record<string, number>): Omit<Transaction, 'id'>[] => {
  const now = new Date();
  const formatIsoDate = (daysAgo: number) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  const bpiId = accountMap['BPI'] || 3;
  const gcashId = accountMap['GCASH'] || 5;
  const goTymeId = accountMap['GOTYME'] || 1;
  const seaBankId = accountMap['SEABANK'] || 2;
  const mayaId = accountMap['MAYA_WALLET'] || 6;

  return [
    {
      type: 'income',
      amount: 32500,
      category: 'Salary & Paycheck',
      budgetBucket: 'needs',
      accountId: bpiId,
      note: 'Semi-monthly Tech Payroll (15th Cutoff)',
      date: formatIsoDate(15),
      createdAt: Date.now() - 15 * 86400000,
    },
    {
      type: 'income',
      amount: 15000,
      category: 'Freelance & Side Hustle',
      budgetBucket: 'savings',
      accountId: seaBankId,
      note: 'Frontend Consulting for SG Client',
      date: formatIsoDate(10),
      createdAt: Date.now() - 10 * 86400000,
    },
    {
      type: 'income',
      amount: 17500,
      category: 'Salary & Paycheck',
      budgetBucket: 'needs',
      accountId: bpiId,
      note: 'Mid-Month Project Bonus & Allowance',
      date: formatIsoDate(2),
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      type: 'expense',
      amount: 12500,
      category: 'Housing & Rent',
      budgetBucket: 'needs',
      accountId: bpiId,
      note: 'Condo Rent Bonifacio Global City',
      date: formatIsoDate(14),
      createdAt: Date.now() - 14 * 86400000,
    },
    {
      type: 'expense',
      amount: 4850,
      category: 'Bills & Utilities',
      budgetBucket: 'needs',
      accountId: gcashId,
      note: 'Meralco Electricity Bill Payment',
      date: formatIsoDate(12),
      createdAt: Date.now() - 12 * 86400000,
    },
    {
      type: 'expense',
      amount: 1699,
      category: 'Bills & Utilities',
      budgetBucket: 'needs',
      accountId: gcashId,
      note: 'PLDT Home Fiber Internet',
      date: formatIsoDate(11),
      createdAt: Date.now() - 11 * 86400000,
    },
    {
      type: 'expense',
      amount: 3450,
      category: 'Groceries',
      budgetBucket: 'needs',
      accountId: goTymeId,
      note: 'SM Hypermarket Groceries & Meat',
      date: formatIsoDate(8),
      createdAt: Date.now() - 8 * 86400000,
    },
    {
      type: 'expense',
      amount: 620,
      category: 'Food & Dining',
      budgetBucket: 'wants',
      accountId: gcashId,
      note: 'Jollibee Chickenjoy 6pc bucket dinner',
      date: formatIsoDate(6),
      createdAt: Date.now() - 6 * 86400000,
      isAiLogged: true,
    },
    {
      type: 'expense',
      amount: 850,
      category: 'Food & Dining',
      budgetBucket: 'wants',
      accountId: mayaId,
      note: 'GrabFood Ramen Kuroda Delivery',
      date: formatIsoDate(4),
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      type: 'expense',
      amount: 450,
      category: 'Transport & Gas',
      budgetBucket: 'needs',
      accountId: gcashId,
      note: 'GrabCar ride to Makati CBD meeting',
      date: formatIsoDate(3),
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      type: 'expense',
      amount: 549,
      category: 'Entertainment & Subscriptions',
      budgetBucket: 'wants',
      accountId: goTymeId,
      note: 'Netflix Premium 4K Family Plan',
      date: formatIsoDate(2),
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      type: 'expense',
      amount: 1450,
      category: 'Shopping & Wants',
      budgetBucket: 'wants',
      accountId: mayaId,
      note: 'Uniqlo AIRism Oversized T-Shirt',
      date: formatIsoDate(1),
      createdAt: Date.now() - 1 * 86400000,
    },
    {
      type: 'transfer',
      amount: 5000,
      category: 'Savings & Investments',
      budgetBucket: 'savings',
      accountId: bpiId,
      toAccountId: goTymeId,
      note: 'Automatic Transfer to GoTyme High Yield 5% p.a.',
      date: formatIsoDate(1),
      createdAt: Date.now() - 1 * 86400000,
    }
  ];
};

export const seedDatabaseIfEmpty = async () => {
  const accountCount = await db.accounts.count();
  if (accountCount === 0) {
    const accountIds: Record<string, number> = {};
    for (const acc of INITIAL_ACCOUNTS) {
      const id = await db.accounts.add(acc);
      accountIds[acc.bankCode] = id;
    }

    for (const vault of INITIAL_VAULTS) {
      await db.vaults.add(vault);
    }

    for (const debt of INITIAL_DEBTS) {
      await db.debts.add(debt);
    }

    await db.salarySettings.add(INITIAL_SALARY_SETTINGS);

    const initialTxs = getInitialTransactions(accountIds);
    for (const tx of initialTxs) {
      await db.transactions.add(tx);
    }
  }
};
