import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Landmark, Target, PieChart, ShieldCheck, Mic, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeatureGrid: React.FC = () => {
  const { setViewMode, setActiveTab, setIsLwedgeChatOpen } = useApp();

  const features = [
    {
      icon: <Bot className="w-6 h-6 text-amber-400" />,
      tag: "AI Copilot",
      title: 'Meet "Lwedge" — Your Capybara AI Financial Copilot',
      description:
        'Log transactions with natural voice & text (e.g. "spent 350 for dinner at Jollibee with Maya"). Interactive confirmation cards let you adjust details in 1-tap with zero friction.',
      actionText: 'Chat with Lwedge AI',
      onAction: () => {
        setIsLwedgeChatOpen(true);
      },
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15',
    },
    {
      icon: <Landmark className="w-6 h-6 text-cyan-400" />,
      tag: "Philippine Ecosystem",
      title: '27+ Native PH Banks & E-Wallets',
      description:
        'Preset colors, monograms, and rates for GoTyme, SeaBank, Maya, BDO, BPI, UnionBank, GCash, Tonik, CIMB, and more. Realistic gradient card stacks with last-4 digit masking.',
      actionText: 'Explore All Banks',
      onAction: () => {
        setViewMode('app');
        setActiveTab('accounts');
      },
      gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/15',
    },
    {
      icon: <PieChart className="w-6 h-6 text-emerald-400" />,
      tag: "Paycheck Budgeting",
      title: '50/30/20 Rule Salary & Payday Planner',
      description:
        'Automated income allocation for 50% Needs, 30% Wants, and 20% Savings/Debt. Live payday countdown clock keeps you disciplined between cutoffs.',
      actionText: 'Open Salary Hub',
      onAction: () => {
        setViewMode('app');
        setActiveTab('salary');
      },
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15',
    },
    {
      icon: <Target className="w-6 h-6 text-indigo-400" />,
      tag: "Dual-Mode Vaults",
      title: 'Savings Vaults & Debt Payoff Tracker',
      description:
        'Set target milestones for Emergency Funds and travel, alongside a Debt Snowball/Avalanche payoff system that visualizes your path to becoming 100% debt-free.',
      actionText: 'View Vaults & Debt',
      onAction: () => {
        setViewMode('app');
        setActiveTab('vaults');
      },
      gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/15',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
      tag: "100% Private",
      title: 'Offline-First & Google Sheets Cloud Sync',
      description:
        'No forced logins or ads. Your data is stored locally in your browser (IndexedDB). Easily configure real-time Google Sheets webhook sync and 1-click JSON/CSV backups.',
      actionText: 'Manage Sync & PIN',
      onAction: () => {
        setViewMode('app');
        setActiveTab('settings');
      },
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500/15',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
          Architected for Wealth Builders
        </h2>
        <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything You Need to Build Lasting Financial Discipline
        </p>
        <p className="mt-4 text-slate-400 text-base sm:text-lg">
          No generic spreadsheets or clunky corporate apps. Tailored specifically for modern Filipino earners, freelancers, and smart investors.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`relative rounded-2xl p-6 glass-card border ${feat.borderColor} hover:bg-surface-100/90 transition-all flex flex-col justify-between group`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center`}>
                  {feat.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-50 border border-white/5">
                  {feat.tag}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {feat.title}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-normal">
                {feat.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={feat.onAction}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>{feat.actionText}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
