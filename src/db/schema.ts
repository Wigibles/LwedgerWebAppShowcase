import Dexie, { Table } from 'dexie';
import { Transaction, Account, SavingsVault, DebtItem, SalarySettings } from '../types';

export class LwedgerDatabase extends Dexie {
  transactions!: Table<Transaction, number>;
  accounts!: Table<Account, number>;
  vaults!: Table<SavingsVault, number>;
  debts!: Table<DebtItem, number>;
  salarySettings!: Table<SalarySettings, number>;

  constructor() {
    super('LwedgerDB');
    this.version(1).stores({
      transactions: '++id, type, amount, category, budgetBucket, accountId, date, createdAt',
      accounts: '++id, bankCode, name, balance, category, isArchived',
      vaults: '++id, name, targetAmount, currentAmount, category',
      debts: '++id, name, creditor, currentBalance, apr, category',
      salarySettings: '++id',
    });
  }
}

export const db = new LwedgerDatabase();
