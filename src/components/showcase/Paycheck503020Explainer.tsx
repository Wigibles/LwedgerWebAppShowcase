import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, DollarSign, Home, ShoppingBag, PiggyBank, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Paycheck503020Explainer: React.FC = () => {
  const { setViewMode, setActiveTab } = useApp();
  const [monthlySalary, setMonthlySalary] = useState<number>(65000);

  const needsAmount = monthlySalary * 0.5;
  const wantsAmount = monthlySalary * 0.3;
  const savingsAmount = monthlySalary * 0.2;

  const presets = [
    { label: '₱35,000 (Junior)', val: 35000 },
    { label: '₱65,000 (Mid-level)', val: 65000 },
    { label: '₱120,000 (Senior)', val: 120000 },
    { label: '₱180,000 (Lead/Remote)', val: 180000 },
  ];

  return (
    <section id="budgeting" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
          50 / 30 / 20 Budget Architecture
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Lwedger Eliminates Financial Stress
        </h2>
        <p className="mt-3 text-slate-400 text-base sm:text-lg">
          Instead of micromanaging every centavo, allocate your paycheck into 3 purposeful buckets before spending.
        </p>
      </div>

      {/* Interactive Simulator Box */}
      <div className="mt-12 max-w-4xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-500/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Interactive Paycheck Simulator
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
              ₱{monthlySalary.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-slate-400">/ month</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map(p => (
              <button
                key={p.val}
                onClick={() => setMonthlySalary(p.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  monthlySalary === p.val
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                    : 'bg-surface-100 hover:bg-surface-50 text-slate-300 border border-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>₱15,000</span>
            <span>Adjust Monthly Income</span>
            <span>₱300,000</span>
          </div>
          <input
            type="range"
            min="15000"
            max="300000"
            step="5000"
            value={monthlySalary}
            onChange={e => setMonthlySalary(Number(e.target.value))}
            className="w-full h-2.5 bg-surface-100 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* 3 Split Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 50% Needs */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-blue-950/40 to-surface-200 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  50%
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-white">Essential Needs</h4>
              <p className="text-xs text-slate-400 mt-1">Rent, Meralco, Maynilad, groceries, commute & medicine.</p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5">
              <span className="text-xs text-slate-400">Monthly Budget:</span>
              <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">
                ₱{needsAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* 30% Wants */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-amber-950/40 to-surface-200 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  30%
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-white">Guilt-Free Wants</h4>
              <p className="text-xs text-slate-400 mt-1">Dining out, coffee, shopping, Netflix, weekends & hobbies.</p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5">
              <span className="text-xs text-slate-400">Monthly Budget:</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                ₱{wantsAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* 20% Savings & Debt */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-emerald-950/40 to-surface-200 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  20%
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-white">Savings & Debt Payoff</h4>
              <p className="text-xs text-slate-400 mt-1">GoTyme 5%, MP2, emergency fund, and clearing credit cards.</p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5">
              <span className="text-xs text-slate-400">Monthly Wealth Growth:</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                ₱{savingsAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Lwedger auto-tags every transaction to its 50/30/20 bucket in real time.</span>
          </div>
          <button
            onClick={() => {
              setViewMode('app');
              setActiveTab('salary');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:opacity-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Configure in Live App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
