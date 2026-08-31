import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  KeyRound,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportToJson, exportToCsv, importFromJson } from '../../services/exportImport';
import { syncToGoogleSheets } from '../../services/sheetsSync';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, transactions, accounts, resetToSampleData } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [webhookUrlInput, setWebhookUrlInput] = useState(settings.googleSheetsWebhookUrl || '');
  const [syncStatus, setSyncStatus] = useState<{ message: string; success?: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4) {
      updateSettings({
        pinEnabled: true,
        pinHash: pinInput,
      });
      setPinInput('');
      alert('4-digit PIN successfully configured!');
    }
  };

  const handleDisablePin = () => {
    updateSettings({
      pinEnabled: false,
      pinHash: undefined,
      isLocked: false,
    });
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ googleSheetsWebhookUrl: webhookUrlInput });
    alert('Google Sheets Webhook URL saved!');
  };

  const handleTestSync = async () => {
    if (!webhookUrlInput) {
      setSyncStatus({ success: false, message: 'Please enter a valid Google Apps Script Webhook URL first.' });
      return;
    }
    setIsSyncing(true);
    const result = await syncToGoogleSheets(webhookUrlInput, transactions, accounts);
    setIsSyncing(false);
    setSyncStatus({ success: result.success, message: result.message });
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importFromJson(content);
        setImportStatus(res.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Settings, Privacy & Backups
        </h2>
        <p className="text-xs text-slate-400">
          Control your sovereign finance data, security locks, and Google Sheets cloud mirrors.
        </p>
      </div>

      {/* 1. Security PIN Lock Card */}
      <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">4-Digit PIN Security Lock</h3>
              <p className="text-xs text-slate-400">Protect ledger on launch and app refocus</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {settings.pinEnabled ? (
              <button
                onClick={handleDisablePin}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Disable PIN</span>
              </button>
            ) : (
              <span className="text-xs font-mono text-slate-500">Disabled</span>
            )}
          </div>
        </div>

        {!settings.pinEnabled ? (
          <form onSubmit={handleSavePin} className="flex items-center gap-3 pt-2">
            <input
              type="password"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pinInput}
              onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="w-44 px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white text-center tracking-widest focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={pinInput.length !== 4}
              className="px-4 py-2 rounded-xl bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-glow-gold cursor-pointer"
            >
              Enable PIN
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>PIN Lock is active. Lock button is available in the top navbar.</span>
          </div>
        )}
      </div>

      {/* 2. Google Sheets Webhook Cloud Mirror */}
      <div className="rounded-3xl p-6 glass-panel border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google Sheets Real-Time Webhook Mirror</h3>
            <p className="text-xs text-slate-400">
              Automatically stream transactions to your personal private Google Spreadsheet via Apps Script.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveWebhook} className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Google Apps Script Webhook Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookUrlInput}
              onChange={e => setWebhookUrlInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald cursor-pointer"
            >
              Save Webhook URL
            </button>

            <button
              type="button"
              onClick={handleTestSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {isSyncing ? 'Dispatching...' : 'Test Webhook Dispatch Now'}
            </button>
          </div>

          {syncStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                syncStatus.success
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}
            >
              {syncStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{syncStatus.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* 3. Export & Import Backups */}
      <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">Export & Restore Sovereign Backups</h3>
        <p className="text-xs text-slate-400">
          Your financial data is yours. Export full snapshots or restore from any JSON file at any time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={() => exportToJson()}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Full JSON</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportToCsv()}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Sheet</span>
          </button>

          {/* Restore JSON */}
          <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Restore JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJsonFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-300 text-xs border border-cyan-500/30">
            {importStatus}
          </div>
        )}
      </div>

      {/* 4. Reset to Demo Preset Data */}
      <div className="rounded-3xl p-6 glass-panel border border-rose-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Reset to Philippine Sample Dataset</h3>
            <p className="text-xs text-slate-400">
              Reload the realistic demo state with GoTyme, SeaBank, BPI, GCash, Vaults & Debts.
            </p>
          </div>

          <button
            onClick={async () => {
              if (confirm('Are you sure you want to reset all ledger data to default Philippine sample presets?')) {
                await resetToSampleData();
                alert('Database reset to authentic Philippine demo data!');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
