import { TransactionType, BudgetBucket, ExpenseCategory, IncomeCategory } from '../types';

export interface ParsedAiResult {
  isTransaction: boolean;
  reply: string;
  transaction?: {
    type: TransactionType;
    amount: number;
    category: string;
    budgetBucket: BudgetBucket;
    accountCode: string;
    note: string;
    toAccountCode?: string;
  };
}

const EXPENSE_KEYWORD_MAP: Record<string, { category: ExpenseCategory; bucket: BudgetBucket }> = {
  // Food & Dining (Wants)
  jollibee: { category: 'Food & Dining', bucket: 'wants' },
  mcdo: { category: 'Food & Dining', bucket: 'wants' },
  mcdonalds: { category: 'Food & Dining', bucket: 'wants' },
  kfc: { category: 'Food & Dining', bucket: 'wants' },
  starbucks: { category: 'Food & Dining', bucket: 'wants' },
  coffee: { category: 'Food & Dining', bucket: 'wants' },
  cafe: { category: 'Food & Dining', bucket: 'wants' },
  dinner: { category: 'Food & Dining', bucket: 'wants' },
  lunch: { category: 'Food & Dining', bucket: 'wants' },
  breakfast: { category: 'Food & Dining', bucket: 'wants' },
  food: { category: 'Food & Dining', bucket: 'wants' },
  restaurant: { category: 'Food & Dining', bucket: 'wants' },
  grabfood: { category: 'Food & Dining', bucket: 'wants' },
  foodpanda: { category: 'Food & Dining', bucket: 'wants' },
  milktea: { category: 'Food & Dining', bucket: 'wants' },
  samgyup: { category: 'Food & Dining', bucket: 'wants' },
  ramen: { category: 'Food & Dining', bucket: 'wants' },

  // Groceries (Needs)
  groceries: { category: 'Groceries', bucket: 'needs' },
  grocery: { category: 'Groceries', bucket: 'needs' },
  sm: { category: 'Groceries', bucket: 'needs' },
  robinsons: { category: 'Groceries', bucket: 'needs' },
  puregold: { category: 'Groceries', bucket: 'needs' },
  supermarket: { category: 'Groceries', bucket: 'needs' },
  palengke: { category: 'Groceries', bucket: 'needs' },
  waltermart: { category: 'Groceries', bucket: 'needs' },
  snr: { category: 'Groceries', bucket: 'needs' },
  landers: { category: 'Groceries', bucket: 'needs' },

  // Bills & Utilities (Needs)
  meralco: { category: 'Bills & Utilities', bucket: 'needs' },
  electricity: { category: 'Bills & Utilities', bucket: 'needs' },
  kuryente: { category: 'Bills & Utilities', bucket: 'needs' },
  maynilad: { category: 'Bills & Utilities', bucket: 'needs' },
  manila_water: { category: 'Bills & Utilities', bucket: 'needs' },
  tubig: { category: 'Bills & Utilities', bucket: 'needs' },
  pldt: { category: 'Bills & Utilities', bucket: 'needs' },
  globe: { category: 'Bills & Utilities', bucket: 'needs' },
  smart: { category: 'Bills & Utilities', bucket: 'needs' },
  converge: { category: 'Bills & Utilities', bucket: 'needs' },
  internet: { category: 'Bills & Utilities', bucket: 'needs' },
  wifi: { category: 'Bills & Utilities', bucket: 'needs' },
  bill: { category: 'Bills & Utilities', bucket: 'needs' },
  bills: { category: 'Bills & Utilities', bucket: 'needs' },

  // Transport & Gas (Needs)
  grab: { category: 'Transport & Gas', bucket: 'needs' },
  grabcar: { category: 'Transport & Gas', bucket: 'needs' },
  angkas: { category: 'Transport & Gas', bucket: 'needs' },
  joyride: { category: 'Transport & Gas', bucket: 'needs' },
  moveit: { category: 'Transport & Gas', bucket: 'needs' },
  taxi: { category: 'Transport & Gas', bucket: 'needs' },
  gas: { category: 'Transport & Gas', bucket: 'needs' },
  gasoline: { category: 'Transport & Gas', bucket: 'needs' },
  petron: { category: 'Transport & Gas', bucket: 'needs' },
  shell: { category: 'Transport & Gas', bucket: 'needs' },
  caltex: { category: 'Transport & Gas', bucket: 'needs' },
  toll: { category: 'Transport & Gas', bucket: 'needs' },
  easytrip: { category: 'Transport & Gas', bucket: 'needs' },
  autosweep: { category: 'Transport & Gas', bucket: 'needs' },
  mrt: { category: 'Transport & Gas', bucket: 'needs' },
  lrt: { category: 'Transport & Gas', bucket: 'needs' },
  jeep: { category: 'Transport & Gas', bucket: 'needs' },

  // Housing (Needs)
  rent: { category: 'Housing & Rent', bucket: 'needs' },
  condo: { category: 'Housing & Rent', bucket: 'needs' },
  apartment: { category: 'Housing & Rent', bucket: 'needs' },
  hoa: { category: 'Housing & Rent', bucket: 'needs' },

  // Shopping & Wants (Wants)
  shopee: { category: 'Shopping & Wants', bucket: 'wants' },
  lazada: { category: 'Shopping & Wants', bucket: 'wants' },
  uniqlo: { category: 'Shopping & Wants', bucket: 'wants' },
  zara: { category: 'Shopping & Wants', bucket: 'wants' },
  tiktok_shop: { category: 'Shopping & Wants', bucket: 'wants' },
  clothes: { category: 'Shopping & Wants', bucket: 'wants' },
  shoes: { category: 'Shopping & Wants', bucket: 'wants' },
  shopping: { category: 'Shopping & Wants', bucket: 'wants' },

  // Entertainment (Wants)
  netflix: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  spotify: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  youtube: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  disney: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  cinema: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  movie: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  game: { category: 'Entertainment & Subscriptions', bucket: 'wants' },
  steam: { category: 'Entertainment & Subscriptions', bucket: 'wants' },

  // Health (Needs)
  mercury: { category: 'Health & Wellness', bucket: 'needs' },
  watsons: { category: 'Health & Wellness', bucket: 'needs' },
  medicine: { category: 'Health & Wellness', bucket: 'needs' },
  hospital: { category: 'Health & Wellness', bucket: 'needs' },
  clinic: { category: 'Health & Wellness', bucket: 'needs' },
  gym: { category: 'Health & Wellness', bucket: 'needs' },

  // Debt (Savings/Debt)
  credit_card: { category: 'Debt Repayment', bucket: 'savings' },
  spaylater: { category: 'Debt Repayment', bucket: 'savings' },
  lazpaylater: { category: 'Debt Repayment', bucket: 'savings' },
  billease: { category: 'Debt Repayment', bucket: 'savings' },
  loan: { category: 'Debt Repayment', bucket: 'savings' },
};

const BANK_ALIASES: Record<string, string> = {
  gotyme: 'GOTYME',
  tyme: 'GOTYME',
  seabank: 'SEABANK',
  sea: 'SEABANK',
  maya: 'MAYA_WALLET',
  paymaya: 'MAYA_WALLET',
  mayabank: 'MAYA_BANK',
  'maya bank': 'MAYA_BANK',
  tonik: 'TONIK',
  cimb: 'CIMB',
  uno: 'UNOBANK',
  unobank: 'UNOBANK',
  ownbank: 'OWNBANK',
  diskartech: 'DISKARTECH',
  komo: 'KOMO',
  bdo: 'BDO',
  bpi: 'BPI',
  unionbank: 'UNIONBANK',
  ub: 'UNIONBANK',
  metrobank: 'METROBANK',
  securitybank: 'SECURITY_BANK',
  sb: 'SECURITY_BANK',
  rcbc: 'RCBC',
  landbank: 'LANDBANK',
  pnb: 'PNB',
  chinabank: 'CHINABANK',
  eastwest: 'EASTWEST',
  psbank: 'PSBANK',
  dbp: 'DBP',
  gcash: 'GCASH',
  grabpay: 'GRABPAY',
  shopeepay: 'SHOPEEPAY',
  coins: 'COINSPH',
  coinsph: 'COINSPH',
  palawanpay: 'PALAWANPAY',
  cash: 'CASH',
  wallet: 'CASH',
};

export const parseNaturalLanguageInput = (input: string): ParsedAiResult => {
  const text = input.trim();
  const lower = text.toLowerCase();

  // Check if it's a general question or greeting first
  if (lower.startsWith('hi') || lower.startsWith('hello') || lower.includes('who are you')) {
    return {
      isTransaction: false,
      reply: "🐾 Kumusta! I'm **Lwedge**, your chill and disciplined Capybara financial assistant. I help you log expenses in plain Filipino/English, track Philippine banks, and master the 50/30/20 rule! Try saying *'spent 350 for Jollibee with Maya'* or *'received 35000 salary to BPI'*."
    };
  }

  if (lower.includes('50/30/20') || lower.includes('50 30 20') || lower.includes('budget rule')) {
    return {
      isTransaction: false,
      reply: "📊 The **50/30/20 Rule** is the ultimate wealth builder:\n• **50% Needs**: Rent, Meralco, groceries, commute.\n• **30% Wants**: Dining out, shopping, Netflix, hobbies.\n• **20% Savings & Debt**: Digibanks (GoTyme, SeaBank), MP2, or clearing high-APR credit cards. Check the **Salary Hub** tab to see your live breakdown!"
    };
  }

  if (lower.includes('best bank') || lower.includes('interest rate') || lower.includes('digibank')) {
    return {
      isTransaction: false,
      reply: "🇵🇭 Top Philippine High-Yield Digital Banks in 2026:\n1. **GoTyme Bank**: Up to 5.0% p.a. + Go Rewards\n2. **SeaBank**: 4.5% p.a. credited daily with 15 free transfers weekly\n3. **Maya Bank**: 3.5% up to 14.0% p.a. with mission boosters\n4. **OwnBank**: Up to 7.5% p.a. Time Deposits\n5. **Tonik**: 6.0% p.a. 6-month Stashes!"
    };
  }

  // Extract Amount (supports ₱, PHP, php, 15k, 1,500, 350.50)
  let amount = 0;
  const kMatch = lower.match(/(?:(?:php|p|₱)\s*)?(\d+(?:\.\d+)?)\s*k(?:ilo)?\b/);
  if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1000;
  } else {
    const numMatch = lower.match(/(?:(?:php|p|₱)\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)/);
    if (numMatch) {
      amount = parseFloat(numMatch[1].replace(/,/g, ''));
    }
  }

  // Determine Type (Expense vs Income vs Transfer)
  let type: TransactionType = 'expense';
  let category = 'Other';
  let budgetBucket: BudgetBucket = 'wants';

  const isIncome = /received|earned|got|salary|sweldo|sahod|freelance|bonus|dividend|income|deposit/i.test(lower) && !/deposited to|transferred to|spent/i.test(lower);
  const isTransfer = /transferred|transfer|moved|lipat|from .* to/i.test(lower);

  if (isTransfer) {
    type = 'transfer';
    category = 'Savings & Investments';
    budgetBucket = 'savings';
  } else if (isIncome) {
    type = 'income';
    if (lower.includes('salary') || lower.includes('sweldo') || lower.includes('sahod') || lower.includes('payroll')) {
      category = 'Salary & Paycheck';
      budgetBucket = 'needs';
    } else if (lower.includes('freelance') || lower.includes('client') || lower.includes('upwork') || lower.includes('side hustle')) {
      category = 'Freelance & Side Hustle';
      budgetBucket = 'savings';
    } else if (lower.includes('dividend') || lower.includes('crypto') || lower.includes('stock')) {
      category = 'Investments & Dividends';
      budgetBucket = 'savings';
    } else {
      category = 'Other Income';
      budgetBucket = 'needs';
    }
  } else {
    // Expense - find category from keywords
    type = 'expense';
    let matchedCategory = false;
    for (const [kw, info] of Object.entries(EXPENSE_KEYWORD_MAP)) {
      if (lower.includes(kw.replace('_', ' '))) {
        category = info.category;
        budgetBucket = info.bucket;
        matchedCategory = true;
        break;
      }
    }
    if (!matchedCategory) {
      if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('snack') || lower.includes('eat')) {
        category = 'Food & Dining';
        budgetBucket = 'wants';
      } else if (lower.includes('bill') || lower.includes('pay')) {
        category = 'Bills & Utilities';
        budgetBucket = 'needs';
      } else {
        category = 'Shopping & Wants';
        budgetBucket = 'wants';
      }
    }
  }

  // Detect Bank Account
  let accountCode = 'GCASH'; // default fallback
  for (const [alias, code] of Object.entries(BANK_ALIASES)) {
    // Word boundary check
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(lower)) {
      accountCode = code;
      break;
    }
  }

  // Format note cleanly
  let note = text;
  if (note.length > 50) {
    note = note.slice(0, 50) + '...';
  }

  if (amount > 0) {
    const formattedAmount = `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const actionWord = type === 'expense' ? '💸 Logged expense' : type === 'income' ? '💰 Logged income' : '⇄ Transfer recorded';
    
    return {
      isTransaction: true,
      reply: `🐾 Got it! I prepared a smart card for **${formattedAmount}** (${category}) via **${accountCode}**. Check the details below and tap confirm to log!`,
      transaction: {
        type,
        amount,
        category,
        budgetBucket,
        accountCode,
        note: text,
      }
    };
  }

  return {
    isTransaction: false,
    reply: "🐾 I couldn't quite catch the amount! Try something like: *'Spent 450 on Jollibee with GCash'* or *'Received 25k salary to BPI'*."
  };
};
