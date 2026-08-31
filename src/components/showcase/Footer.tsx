import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setViewMode, setActiveTab } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#05070B] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-glow-gold">
              🦁
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Lwedger
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              v1.0
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            The intentional Philippine personal finance ledger. Offline-first, privacy-respecting, 50/30/20 paycheck splits, and your personal Capybara AI copilot.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setViewMode('app');
                    setActiveTab('dashboard');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Live Web App
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setViewMode('app');
                    setActiveTab('accounts');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  27+ PH Banks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setViewMode('app');
                    setActiveTab('salary');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  50/30/20 Salary Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setViewMode('app');
                    setActiveTab('vaults');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Vaults & Debt Snowball
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Security & Tech</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Zero Account Tracking</span>
              </li>
              <li>IndexedDB Local Cache</li>
              <li>Google Sheets Webhook</li>
              <li>PIN / Biometric Lock</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="text-amber-300 font-medium">Crafted for PH Wealth Builders 🇵🇭</li>
              <li className="text-slate-400">DeepSeek & Gemini AI Capybara</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} Lwedger. Built with intentionality and discipline.
        </div>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
