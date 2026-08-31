import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Landmark, Smartphone, Wallet, Sparkles, Check, ArrowRight } from 'lucide-react';
import { PHILIPPINE_BANKS } from '../../db/philippineBanks';
import { BankCategory, BankPreset } from '../../types';
import { useApp } from '../../context/AppContext';

export const BankEcosystemShowcase: React.FC = () => {
  const { setViewMode, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<BankCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBanks = PHILIPPINE_BANKS.filter(bank => {
    const matchesCat = selectedCategory === 'all' || bank.category === selectedCategory;
    const matchesQuery =
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bank.tagline && bank.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const categories: { id: BankCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All 27+ Presets', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'digital', label: 'Digital Banks', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'commercial', label: 'Commercial Banks', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'ewallet', label: 'E-Wallets', icon: <Wallet className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id="banking" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Philippine Financial Ecosystem
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Native Support for 27+ Local Banks & Wallets
          </h2>
          <p className="mt-3 text-slate-400 text-base max-w-2xl">
            Pre-tuned brand colors, high-yield digital bank interest rates, and instant masked card visualizers.
          </p>
        </div>

        <button
          onClick={() => {
            setViewMode('app');
            setActiveTab('accounts');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <span>Manage My Accounts in App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                  : 'glass-card border border-white/5 text-slate-300 hover:text-white hover:bg-surface-50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bank, e-wallet, interest..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-card border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Bank Cards Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredBanks.map((bank, index) => (
            <motion.div
              key={bank.code}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
              className="group relative rounded-2xl p-4 overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all glass-card-hover"
            >
              {/* Background gradient subtle header */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${bank.gradient}`} />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner bg-surface-50 border border-white/10">
                    {bank.logoEmoji}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {bank.shortName}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {bank.category}
                    </span>
                  </div>
                </div>

                {bank.interestRate && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                    {bank.interestRate}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <p className="text-xs text-slate-400 line-clamp-1">
                  {bank.tagline || bank.name}
                </p>
              </div>

              {/* Sample Card Mockup preview */}
              <div className={`mt-3 p-3 rounded-xl bg-gradient-to-br ${bank.gradient} text-white shadow-md relative overflow-hidden`}>
                <div className="flex justify-between items-center text-[10px] opacity-80">
                  <span>PHILIPPINES</span>
                  <span className="font-mono">•••• 5821</span>
                </div>
                <div className="mt-2 text-xs font-bold font-mono tracking-wider">
                  ₱ 45,000.00
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
