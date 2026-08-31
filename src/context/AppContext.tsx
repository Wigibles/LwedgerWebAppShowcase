import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { seedDatabaseIfEmpty } from '../db/seedData';
import { Transaction, Account, SavingsVault, DebtItem, SalarySettings, AppSettings, ChatMessage, BudgetBucket } from '../types';
import { soundManager } from '../services/soundEffects';

interface UndoItem {
  type: 'delete_transaction' | 'delete_account' | 'add_transaction';
  item: Transaction | Account;
  timestamp: number;
}

interface AppContextType {
  // Mode & Navigation
  viewMode: 'showcase' | 'app';
  setViewMode: (mode: 'showcase' | 'app') => void;
  activeTab: 'dashboard' | 'accounts' | 'salary' | 'vaults' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'accounts' | 'salary' | 'vaults' | 'analytics' | 'settings') => void;

  // Data Collections
  transactions: Transaction[];
  accounts: Account[];
  vaults: SavingsVault[];
  debts: DebtItem[];
  salarySettings: SalarySettings | undefined;
  isLoading: boolean;

  // Financial Stats
  totalNetWorth: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  netSavingsThisMonth: number;
  savingsRateThisMonth: number;
  daysToNextPayday: number;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<number>;
  deleteTransaction: (id: number) => Promise<void>;
  addAccount: (acc: Omit<Account, 'id'>) => Promise<number>;
  updateAccountBalance: (id: number, newBalance: number) => Promise<void>;
  transferFunds: (fromId: number, toId: number, amount: number, note?: string) => Promise<void>;
  addVault: (vault: Omit<SavingsVault, 'id'>) => Promise<number>;
  depositToVault: (vaultId: number, amount: number, fromAccountId?: number) => Promise<void>;
  addDebt: (debt: Omit<DebtItem, 'id'>) => Promise<number>;
  payDebt: (debtId: number, amount: number, fromAccountId?: number) => Promise<void>;
  updateSalarySettings: (settings: Partial<SalarySettings>) => Promise<void>;
  resetToSampleData: () => Promise<void>;

  // Undo System
  undoItem: UndoItem | null;
  triggerUndo: () => Promise<void>;
  clearUndo: () => void;

  // Modals & Chat
  isQuickLogOpen: boolean;
  setIsQuickLogOpen: (open: boolean) => void;
  quickLogInitialType: 'expense' | 'income' | 'transfer';
  setQuickLogInitialType: (type: 'expense' | 'income' | 'transfer') => void;
  isTransferOpen: boolean;
  setIsTransferOpen: (open: boolean) => void;
  isLwedgeChatOpen: boolean;
  setIsLwedgeChatOpen: (open: boolean) => void;
  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;

  // AI Chat Messages
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  // Security & App Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'showcase' | 'app'>('showcase');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'salary' | 'vaults' | 'analytics' | 'settings'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogInitialType, setQuickLogInitialType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isLwedgeChatOpen, setIsLwedgeChatOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Undo State
  const [undoItem, setUndoItem] = useState<UndoItem | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'lwedge',
      text: "👋 Kamusta! I'm **Lwedge**, your personal Capybara AI wealth assistant. You can log expenses with natural speech/text like *'spent 350 for dinner at Jollibee with Maya'* or ask me any Philippine banking questions!",
      timestamp: Date.now(),
    }
  ]);

  // App Settings & Security
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('lwedger_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      pinEnabled: false,
      isLocked: false,
      googleSheetsWebhookUrl: '',
      soundEnabled: true,
      hapticEnabled: true,
      currencySymbol: '₱',
      viewMode: 'showcase',
      activeTab: 'dashboard',
    };
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('lwedger_settings', JSON.stringify(updated));
      if (newSettings.soundEnabled !== undefined) {
        soundManager.enabled = newSettings.soundEnabled;
      }
      return updated;
    });
  };

  // Seed DB on mount
  useEffect(() => {
    const initDb = async () => {
      await seedDatabaseIfEmpty();
      setIsLoading(false);
    };
    initDb();
  }, []);

  // Live queries
  const transactions = useLiveQuery(() => db.transactions.orderBy('createdAt').reverse().toArray()) ?? [];
  const accounts = useLiveQuery(() => db.accounts.filter(a => !a.isArchived).toArray()) ?? [];
  const vaults = useLiveQuery(() => db.vaults.toArray()) ?? [];
  const debts = useLiveQuery(() => db.debts.toArray()) ?? [];
  const salarySettingsList = useLiveQuery(() => db.salarySettings.toArray()) ?? [];
  const salarySettings = salarySettingsList[0];

  // Calculated Financial Metrics
  const totalNetWorth = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  // Month to date calculations
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentMonthTxs = transactions.filter(tx => tx.date.startsWith(currentMonthStr));
  const totalIncomeThisMonth = currentMonthTxs
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenseThisMonth = currentMonthTxs
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const netSavingsThisMonth = totalIncomeThisMonth - totalExpenseThisMonth;
  const savingsRateThisMonth = totalIncomeThisMonth > 0 ? Math.max(0, Math.round((netSavingsThisMonth / totalIncomeThisMonth) * 100)) : 0;

  // Payday countdown
  const getDaysToPayday = useCallback(() => {
    const today = now.getDate();
    const p1 = salarySettings?.payday1 || 15;
    const p2 = salarySettings?.payday2 || 30;

    if (today <= p1) {
      return p1 - today;
    } else if (today <= p2) {
      return p2 - today;
    } else {
      // Days left in month + p1
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return (lastDayOfMonth - today) + p1;
    }
  }, [now, salarySettings]);

  const daysToNextPayday = getDaysToPayday();

  // Action Methods
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<number> => {
    const createdAt = Date.now();
    const newTx: Transaction = {
      ...tx,
      createdAt,
    };

    const id = await db.transactions.add(newTx);
    newTx.id = id;

    // Update account balance
    const acc = await db.accounts.get(tx.accountId);
    if (acc) {
      if (tx.type === 'expense') {
        await db.accounts.update(tx.accountId, { balance: acc.balance - tx.amount });
      } else if (tx.type === 'income') {
        await db.accounts.update(tx.accountId, { balance: acc.balance + tx.amount });
      } else if (tx.type === 'transfer' && tx.toAccountId) {
        await db.accounts.update(tx.accountId, { balance: acc.balance - tx.amount });
        const targetAcc = await db.accounts.get(tx.toAccountId);
        if (targetAcc) {
          await db.accounts.update(tx.toAccountId, { balance: targetAcc.balance + tx.amount });
        }
      }
    }

    soundManager.playCoin();

    // Set undo
    setUndoItem({
      type: 'add_transaction',
      item: newTx,
      timestamp: Date.now(),
    });

    return id;
  };

  const deleteTransaction = async (id: number) => {
    const tx = await db.transactions.get(id);
    if (!tx) return;

    // Revert account balance
    const acc = await db.accounts.get(tx.accountId);
    if (acc) {
      if (tx.type === 'expense') {
        await db.accounts.update(tx.accountId, { balance: acc.balance + tx.amount });
      } else if (tx.type === 'income') {
        await db.accounts.update(tx.accountId, { balance: acc.balance - tx.amount });
      } else if (tx.type === 'transfer' && tx.toAccountId) {
        await db.accounts.update(tx.accountId, { balance: acc.balance + tx.amount });
        const targetAcc = await db.accounts.get(tx.toAccountId);
        if (targetAcc) {
          await db.accounts.update(tx.toAccountId, { balance: targetAcc.balance - tx.amount });
        }
      }
    }

    await db.transactions.delete(id);
    soundManager.playDelete();

    setUndoItem({
      type: 'delete_transaction',
      item: tx,
      timestamp: Date.now(),
    });
  };

  const addAccount = async (acc: Omit<Account, 'id'>): Promise<number> => {
    const id = await db.accounts.add(acc);
    soundManager.playSuccess();
    return id;
  };

  const updateAccountBalance = async (id: number, newBalance: number) => {
    await db.accounts.update(id, { balance: newBalance });
  };

  const transferFunds = async (fromId: number, toId: number, amount: number, note?: string) => {
    const fromAcc = await db.accounts.get(fromId);
    const toAcc = await db.accounts.get(toId);
    if (!fromAcc || !toAcc) return;

    await db.accounts.update(fromId, { balance: fromAcc.balance - amount });
    await db.accounts.update(toId, { balance: toAcc.balance + amount });

    const todayStr = new Date().toISOString().split('T')[0];
    await db.transactions.add({
      type: 'transfer',
      amount,
      category: 'Savings & Investments',
      budgetBucket: 'savings',
      accountId: fromId,
      toAccountId: toId,
      note: note || `Transfer from ${fromAcc.name} to ${toAcc.name}`,
      date: todayStr,
      createdAt: Date.now(),
    });

    soundManager.playCoin();
  };

  const addVault = async (vault: Omit<SavingsVault, 'id'>): Promise<number> => {
    const id = await db.vaults.add(vault);
    soundManager.playSuccess();
    return id;
  };

  const depositToVault = async (vaultId: number, amount: number, fromAccountId?: number) => {
    const vault = await db.vaults.get(vaultId);
    if (!vault) return;

    await db.vaults.update(vaultId, { currentAmount: vault.currentAmount + amount });

    if (fromAccountId) {
      const acc = await db.accounts.get(fromAccountId);
      if (acc) {
        await db.accounts.update(fromAccountId, { balance: acc.balance - amount });
        await db.transactions.add({
          type: 'expense',
          amount,
          category: 'Savings & Investments',
          budgetBucket: 'savings',
          accountId: fromAccountId,
          note: `Deposit to Vault: ${vault.name}`,
          date: new Date().toISOString().split('T')[0],
          createdAt: Date.now(),
        });
      }
    }

    soundManager.playSuccess();
  };

  const addDebt = async (debt: Omit<DebtItem, 'id'>): Promise<number> => {
    const id = await db.debts.add(debt);
    soundManager.playSuccess();
    return id;
  };

  const payDebt = async (debtId: number, amount: number, fromAccountId?: number) => {
    const debt = await db.debts.get(debtId);
    if (!debt) return;

    const newBalance = Math.max(0, debt.currentBalance - amount);
    await db.debts.update(debtId, { currentBalance: newBalance });

    if (fromAccountId) {
      const acc = await db.accounts.get(fromAccountId);
      if (acc) {
        await db.accounts.update(fromAccountId, { balance: acc.balance - amount });
        await db.transactions.add({
          type: 'expense',
          amount,
          category: 'Debt Repayment',
          budgetBucket: 'savings',
          accountId: fromAccountId,
          note: `Payment for ${debt.name}`,
          date: new Date().toISOString().split('T')[0],
          createdAt: Date.now(),
        });
      }
    }

    soundManager.playSuccess();
  };

  const updateSalarySettings = async (newSalarySettings: Partial<SalarySettings>) => {
    const existing = await db.salarySettings.toArray();
    if (existing.length > 0 && existing[0].id) {
      await db.salarySettings.update(existing[0].id, newSalarySettings);
    } else {
      await db.salarySettings.add({
        monthlyGrossIncome: 65000,
        payoutFrequency: 'semi-monthly',
        payday1: 15,
        payday2: 30,
        needsTargetPercent: 50,
        wantsTargetPercent: 30,
        savingsTargetPercent: 20,
        ...newSalarySettings,
      });
    }
  };

  const resetToSampleData = async () => {
    await db.transaction('rw', db.transactions, db.accounts, db.vaults, db.debts, db.salarySettings, async () => {
      await db.transactions.clear();
      await db.accounts.clear();
      await db.vaults.clear();
      await db.debts.clear();
      await db.salarySettings.clear();
      await seedDatabaseIfEmpty();
    });
    soundManager.playSuccess();
  };

  const triggerUndo = async () => {
    if (!undoItem) return;

    if (undoItem.type === 'delete_transaction') {
      const tx = undoItem.item as Transaction;
      const { id, ...rest } = tx;
      await db.transactions.add({ ...rest, createdAt: Date.now() });
      const acc = await db.accounts.get(tx.accountId);
      if (acc) {
        if (tx.type === 'expense') await db.accounts.update(tx.accountId, { balance: acc.balance - tx.amount });
        else if (tx.type === 'income') await db.accounts.update(tx.accountId, { balance: acc.balance + tx.amount });
      }
    } else if (undoItem.type === 'add_transaction') {
      const tx = undoItem.item as Transaction;
      if (tx.id) {
        await db.transactions.delete(tx.id);
        const acc = await db.accounts.get(tx.accountId);
        if (acc) {
          if (tx.type === 'expense') await db.accounts.update(tx.accountId, { balance: acc.balance + tx.amount });
          else if (tx.type === 'income') await db.accounts.update(tx.accountId, { balance: acc.balance - tx.amount });
        }
      }
    }

    soundManager.playClick();
    setUndoItem(null);
  };

  const clearUndo = () => setUndoItem(null);

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'welcome-reset',
        sender: 'lwedge',
        text: "🐾 Chat reset! What Philippine transaction or financial goal are we working on next?",
        timestamp: Date.now(),
      }
    ]);
  };

  const unlockApp = (pin: string): boolean => {
    if (settings.pinHash === pin) {
      updateSettings({ isLocked: false });
      soundManager.playSuccess();
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (settings.pinEnabled) {
      updateSettings({ isLocked: true });
    }
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        transactions,
        accounts,
        vaults,
        debts,
        salarySettings,
        isLoading,
        totalNetWorth,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        netSavingsThisMonth,
        savingsRateThisMonth,
        daysToNextPayday,
        addTransaction,
        deleteTransaction,
        addAccount,
        updateAccountBalance,
        transferFunds,
        addVault,
        depositToVault,
        addDebt,
        payDebt,
        updateSalarySettings,
        resetToSampleData,
        undoItem,
        triggerUndo,
        clearUndo,
        isQuickLogOpen,
        setIsQuickLogOpen,
        quickLogInitialType,
        setQuickLogInitialType,
        isTransferOpen,
        setIsTransferOpen,
        isLwedgeChatOpen,
        setIsLwedgeChatOpen,
        isApkModalOpen,
        setIsApkModalOpen,
        chatMessages,
        addChatMessage,
        clearChat,
        settings,
        updateSettings,
        unlockApp,
        lockApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
