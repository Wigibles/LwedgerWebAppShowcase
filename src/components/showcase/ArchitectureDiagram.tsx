import React from 'react';
import { motion } from 'framer-motion';
import { Database, Bot, FileSpreadsheet, Smartphone, ShieldCheck, Zap, Server, Cpu, HardDrive } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
          Engineered for Speed & Sovereign Privacy
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Modern Hybrid Offline-First Architecture
        </h2>
        <p className="mt-3 text-slate-400 text-base">
          Zero third-party tracking or mandatory central servers. Your ledger is owned by you, synced locally, and optionally mirrored to your Google Sheets.
        </p>
      </div>

      <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Node 1: Offline DB */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-5 glass-card border border-cyan-500/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-white">1. Offline IndexedDB</h4>
            <p className="mt-2 text-xs text-slate-400">
              Zero network latency. Reads and writes happen instantly in your browser sandbox via Dexie.js.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-cyan-300 font-mono">
            <Zap className="w-3.5 h-3.5" /> 0ms Latency
          </div>
        </motion.div>

        {/* Node 2: AI Copilot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl p-5 glass-card border border-amber-500/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-white">2. Lwedge AI Copilot</h4>
            <p className="mt-2 text-xs text-slate-400">
              Natural language speech & text parsing. Instant offline regex fallback + LLM smart cards.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-amber-300 font-mono">
            <Cpu className="w-3.5 h-3.5" /> Client NLP
          </div>
        </motion.div>

        {/* Node 3: Google Sheets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl p-5 glass-card border border-emerald-500/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-white">3. Google Sheets Mirror</h4>
            <p className="mt-2 text-xs text-slate-400">
              Dispatches transactions via Apps Script Webhook directly into your private Google Spreadsheet.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Private
          </div>
        </motion.div>

        {/* Node 4: Android App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl p-5 glass-card border border-indigo-500/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-white">4. Android Native APK</h4>
            <p className="mt-2 text-xs text-slate-400">
              Kotlin Jetpack Compose, Room SQLite, Glance home widgets, and offline background reminders.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-indigo-300 font-mono">
            <Smartphone className="w-3.5 h-3.5" /> v1.0 Ready
          </div>
        </motion.div>
      </div>
    </section>
  );
};
