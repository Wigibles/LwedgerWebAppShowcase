export type TransactionType = 'expense' | 'income' | 'transfer';

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Groceries'
  | 'Transport & Gas'
  | 'Bills & Utilities'
  | 'Housing & Rent'
  | 'Shopping & Wants'
  | 'Health & Wellness'
  | 'Entertainment & Subscriptions'
  | 'Education & Career'
  | 'Travel & Leisure'
  | 'Savings & Investments'
  | 'Debt Repayment'
  | 'Other';

export type IncomeCategory =
  | 'Salary & Paycheck'
  | 'Freelance & Side Hustle'
  | 'Business'
  | 'Investments & Dividends'
  | 'Gifts & Allowance'
  | 'Other Income';

export type BudgetBucket = 'needs' | 'wants' | 'savings';

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  category: string;
  budgetBucket?: BudgetBucket; // For 50/30/20 tracking
  accountId: number;
  toAccountId?: number; // for transfers
  note?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: number;
  isAiLogged?: boolean;
}

export type BankCategory = 'digital' | 'commercial' | 'ewallet' | 'cash';

export interface BankPreset {
  code: string;
  name: string;
  shortName: string;
  category: BankCategory;
  primaryColor: string;
  gradient: string;
  textColor: string;
  iconBg: string;
  logoEmoji: string;
  tagline?: string;
  interestRate?: string;
}

export interface Account {
  id?: number;
  bankCode: string;
  name: string;
  accountNumberMasked: string; // e.g. "•••• 4821"
  balance: number;
  currency: string;
  category: BankCategory;
  customColor?: string;
  isArchived?: boolean;
}

export interface SavingsVault {
  id?: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  iconEmoji: string;
  category: 'emergency' | 'travel' | 'investment' | 'purchase' | 'other';
  color: string;
}

export interface DebtItem {
  id?: number;
  name: string;
  creditor: string;
  totalBalance: number;
  currentBalance: number;
  apr: number; // percentage e.g. 24.0
  minimumPayment: number;
  dueDateDay: number; // 1-31
  category: 'credit_card' | 'personal_loan' | 'bnpl' | 'auto_loan' | 'mortgage' | 'other';
  color: string;
}

export interface SalarySettings {
  id?: number;
  monthlyGrossIncome: number;
  payoutFrequency: 'semi-monthly' | 'monthly' | 'weekly';
  payday1: number; // e.g. 15
  payday2?: number; // e.g. 30
  needsTargetPercent: number; // 50
  wantsTargetPercent: number; // 30
  savingsTargetPercent: number; // 20
}

export interface AppSettings {
  pinEnabled: boolean;
  pinHash?: string;
  isLocked: boolean;
  googleSheetsWebhookUrl?: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  currencySymbol: string;
  viewMode: 'showcase' | 'app';
  activeTab: 'dashboard' | 'accounts' | 'salary' | 'vaults' | 'analytics' | 'settings';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'lwedge';
  text: string;
  timestamp: number;
  parsedTransaction?: {
    type: TransactionType;
    amount: number;
    category: string;
    budgetBucket: BudgetBucket;
    accountCode: string;
    note: string;
  };
  status?: 'pending_confirmation' | 'committed' | 'rejected';
}
