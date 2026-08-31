import { Transaction, Account } from '../types';

export interface SyncPayload {
  transactions: Transaction[];
  accounts: Account[];
  timestamp: string;
  device: string;
}

export const syncToGoogleSheets = async (
  webhookUrl: string,
  transactions: Transaction[],
  accounts: Account[]
): Promise<{ success: boolean; message: string; timestamp: number }> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return {
      success: false,
      message: 'Invalid Google Sheets Webhook URL provided. Please check settings.',
      timestamp: Date.now(),
    };
  }

  const payload: SyncPayload = {
    transactions,
    accounts,
    timestamp: new Date().toISOString(),
    device: 'Lwedger Web App (PWA)',
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // standard for Google Apps Script Webhooks
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Successfully dispatched payload to Google Sheets Webhook!',
      timestamp: Date.now(),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      message: `Sync failed: ${errorMsg}`,
      timestamp: Date.now(),
    };
  }
};
