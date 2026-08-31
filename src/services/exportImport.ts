import { db } from '../db/schema';
import { Transaction, Account, SavingsVault, DebtItem } from '../types';

export interface FullBackupData {
  version: string;
  exportedAt: string;
  transactions: Transaction[];
  accounts: Account[];
  vaults: SavingsVault[];
  debts: DebtItem[];
}

export const exportToJson = async (): Promise<string> => {
  const transactions = await db.transactions.toArray();
  const accounts = await db.accounts.toArray();
  const vaults = await db.vaults.toArray();
  const debts = await db.debts.toArray();

  const backup: FullBackupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    transactions,
    accounts,
    vaults,
    debts,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lwedger_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return jsonStr;
};

export const exportToCsv = async (): Promise<void> => {
  const transactions = await db.transactions.toArray();
  const accounts = await db.accounts.toArray();
  const accountMap = new Map(accounts.map(a => [a.id, a.name]));

  const headers = ['ID', 'Date', 'Type', 'Category', 'Budget Bucket', 'Amount (PHP)', 'Account', 'Note'];
  const rows = transactions.map(tx => [
    tx.id ?? '',
    tx.date,
    tx.type.toUpperCase(),
    `"${tx.category.replace(/"/g, '""')}"`,
    tx.budgetBucket || 'wants',
    tx.amount.toFixed(2),
    `"${(accountMap.get(tx.accountId) || 'Unknown').replace(/"/g, '""')}"`,
    `"${(tx.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lwedger_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromJson = async (jsonString: string): Promise<{ success: boolean; message: string }> => {
  try {
    const data: FullBackupData = JSON.parse(jsonString);
    if (!data.transactions || !data.accounts) {
      return { success: false, message: 'Invalid backup file structure.' };
    }

    await db.transaction('rw', db.transactions, db.accounts, db.vaults, db.debts, async () => {
      await db.transactions.clear();
      await db.accounts.clear();
      await db.vaults.clear();
      await db.debts.clear();

      await db.accounts.bulkAdd(data.accounts);
      await db.transactions.bulkAdd(data.transactions);
      if (data.vaults) await db.vaults.bulkAdd(data.vaults);
      if (data.debts) await db.debts.bulkAdd(data.debts);
    });

    return { success: true, message: `Successfully restored ${data.transactions.length} transactions and ${data.accounts.length} accounts!` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: `Import failed: ${errorMsg}` };
  }
};
