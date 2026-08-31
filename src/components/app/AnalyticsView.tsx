import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Housing & Rent': '#6366F1',
  'Food & Dining': '#F59E0B',
  'Bills & Utilities': '#3B82F6',
  'Groceries': '#10B981',
  'Shopping & Wants': '#EC4899',
  'Transport & Gas': '#06B6D4',
  'Entertainment & Subscriptions': '#8B5CF6',
  'Health & Wellness': '#14B8A6',
  'Savings & Investments': '#22C55E',
  'Debt Repayment': '#EF4444',
  'Other': '#64748B',
};

const DEFAULT_COLOR = '#F59E0B';

export const AnalyticsView: React.FC = () => {
  const { transactions, totalIncomeThisMonth, totalExpenseThisMonth, netSavingsThisMonth, savingsRateThisMonth } = useApp();

  // Aggregate expenses by category
  const expenseByCategoryMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategoryMap[t.category] = (expenseByCategoryMap[t.category] || 0) + t.amount;
    });

  const pieData = Object.entries(expenseByCategoryMap)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || DEFAULT_COLOR,
    }))
    .sort((a, b) => b.value - a.value);

  // Group by Date for Trend Chart (last 14 days)
  const last14DaysMap: Record<string, { date: string; income: number; expense: number; net: number }> = {};
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    last14DaysMap[dateStr] = { date: label, income: 0, expense: 0, net: 0 };
  }

  transactions.forEach(t => {
    if (last14DaysMap[t.date]) {
      if (t.type === 'income') {
        last14DaysMap[t.date].income += t.amount;
      } else if (t.type === 'expense') {
        last14DaysMap[t.date].expense += t.amount;
      }
    }
  });

  const areaChartData = Object.values(last14DaysMap).map(item => ({
    ...item,
    net: item.income - item.expense,
  }));

  // Group by 50/30/20 Bucket
  const bucketMap = {
    needs: 0,
    wants: 0,
    savings: 0,
  };

  transactions.forEach(t => {
    if (t.type === 'expense') {
      const b = t.budgetBucket || 'wants';
      bucketMap[b] = (bucketMap[b] || 0) + t.amount;
    }
  });

  const bucketBarData = [
    { name: '50% Needs', amount: bucketMap.needs, fill: '#3B82F6' },
    { name: '30% Wants', amount: bucketMap.wants, fill: '#F59E0B' },
    { name: '20% Savings', amount: bucketMap.savings, fill: '#10B981' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Financial Analytics & Cashflow Trends
        </h2>
        <p className="text-xs text-slate-400">
          Visual breakdowns of your income, expenses, and 50/30/20 allocation.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Income</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ₱{totalIncomeThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500">Current Month</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Outflow</span>
          <div className="text-xl font-bold font-mono text-rose-400">
            ₱{totalExpenseThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500">Current Month</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Net Cashflow</span>
          <div className={`text-xl font-bold font-mono ${netSavingsThisMonth >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {netSavingsThisMonth >= 0 ? '+' : ''}₱{netSavingsThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500">Net Surplus</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Savings Rate</span>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {savingsRateThisMonth}%
          </div>
          <span className="text-[10px] text-slate-500">Of Total Inflow</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Expense Breakdown (Donut Pie Chart) */}
        <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-amber-400" />
              <span>Expense by Category</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total: ₱{totalExpenseThisMonth.toLocaleString()}
            </span>
          </div>

          <div className="h-64 w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No expense data recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#07090E" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`₱${val.toLocaleString()}`, 'Spent']}
                    contentStyle={{
                      backgroundColor: '#0F131D',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#FFF',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top Categories Legend List */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            {pieData.slice(0, 6).map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-surface-200/50">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-[11px]">
                  ₱{item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 14-Day Cashflow Area Chart */}
        <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>14-Day Cashflow Velocity</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Income vs Expense</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={val => `₱${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: number) => [`₱${val.toLocaleString()}`]}
                  contentStyle={{
                    backgroundColor: '#0F131D',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span>Expense</span>
            </div>
          </div>
        </div>

      </div>

      {/* 50/30/20 Distribution Bar */}
      <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>50/30/20 Paycheck Allocation Realization</span>
        </h3>
        <p className="text-xs text-slate-400">
          How your spending compares across Needs (50%), Wants (30%), and Wealth/Savings (20%).
        </p>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bucketBarData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={val => `₱${val.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} />
              <Tooltip
                formatter={(val: number) => [`₱${val.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  backgroundColor: '#0F131D',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                {bucketBarData.map((entry, idx) => (
                  <Cell key={`bar-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
