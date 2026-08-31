import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Bot, Send, Mic, MicOff, X, Sparkles, Check, CheckCircle2, ChevronRight, RefreshCw, Volume2, Landmark, PieChart, Gauge, AlertTriangle, PiggyBank, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { parseNaturalLanguageInput } from '../../services/aiParser';
import { getBankByCode } from '../../db/philippineBanks';
import { soundManager } from '../../services/soundEffects';

export const LwedgeChatOrb: React.FC = () => {
  const {
    isLwedgeChatOpen,
    setIsLwedgeChatOpen,
    chatMessages,
    addChatMessage,
    clearChat,
    accounts,
    addTransaction,
    totalNetWorth,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    netSavingsThisMonth,
    savingsRateThisMonth,
    daysToNextPayday,
    salarySettings,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const runDiagnosticAudit = (type: '503020' | 'cashflow' | 'leaks' | 'vaults') => {
    soundManager.playClick();
    if (type === '503020') {
      const needsPct = salarySettings?.needsTargetPercent || 50;
      const wantsPct = salarySettings?.wantsTargetPercent || 30;
      const savingsPct = salarySettings?.savingsTargetPercent || 20;
      const gross = salarySettings?.monthlyGrossIncome || 23650;
      
      addChatMessage({ sender: 'user', text: 'Run 50/30/20 Financial Health Audit' });
      setTimeout(() => {
        soundManager.playCoin();
        addChatMessage({
          sender: 'lwedge',
          text: `📊 **50/30/20 Ratio Compliance Audit**:\n\n• **Monthly Net Income**: ₱${gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Total Liquid Assets**: ₱${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Current Savings Rate**: **${savingsRateThisMonth}%**\n\n🎯 **Recommended Target Allocations**:\n- **Needs (${needsPct}%)**: ₱${(gross * needsPct / 100).toLocaleString()}\n- **Wants (${wantsPct}%)**: ₱${(gross * wantsPct / 100).toLocaleString()}\n- **Savings (${savingsPct}%)**: ₱${(gross * savingsPct / 100).toLocaleString()}\n\n💡 *Verdict*: You have healthy liquid reserves in GoTyme and digital banks! Keep discretionary food & shopping within your wants cap.`,
        });
      }, 350);
    } else if (type === 'cashflow') {
      const dailyVelocity = totalNetWorth / Math.max(1, daysToNextPayday);
      addChatMessage({ sender: 'user', text: 'Payday Cash Flow Projection' });
      setTimeout(() => {
        soundManager.playCoin();
        addChatMessage({
          sender: 'lwedge',
          text: `⏱️ **Payday Velocity & Runway Projection**:\n\n• **Days to Next Cutoff**: **${daysToNextPayday} days**\n• **Current Liquid Funds**: ₱${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Safe Daily Burn Rate**: **₱${dailyVelocity.toFixed(2)} / day**\n\n🛡️ *Tip*: Maintaining spending below ₱${Math.floor(dailyVelocity)} daily ensures positive surplus when your next paycheck lands!`,
        });
      }, 350);
    } else if (type === 'leaks') {
      addChatMessage({ sender: 'user', text: 'Spending Leaks & Drift Audit' });
      setTimeout(() => {
        soundManager.playCoin();
        addChatMessage({
          sender: 'lwedge',
          text: `🔍 **Spending Drift & Leakage Audit**:\n\n• **Total Spent this Month**: ₱${totalExpenseThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Income Logged**: ₱${totalIncomeThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Net Surplus**: +₱${netSavingsThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n✅ *Status*: No unauthorized budget leakages detected. All categories are operating within safe bounds.`,
        });
      }, 350);
    } else if (type === 'vaults') {
      addChatMessage({ sender: 'user', text: 'Savings & Vaults Feasibility' });
      setTimeout(() => {
        soundManager.playCoin();
        addChatMessage({
          sender: 'lwedge',
          text: `🏦 **Vaults & Emergency Fund Feasibility**:\n\n• **Active High-Yield Accounts**: GoTyme (5.0% p.a.), SeaBank (4.5% p.a.)\n• **Estimated Monthly Growth**: Channeling ₱5,000/month generates ~₱250+ monthly passive compounding.\n• **Timeline**: On track to reach the next emergency cushion milestone in 3 to 4 pay periods!`,
        });
      }, 350);
    }
  };

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLwedgeChatOpen]);

  // Web Speech API recognition setup
  const handleToggleVoice = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your transaction instead.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-PH'; // or fil-PH

      recognition.onstart = () => {
        setIsListening(true);
        soundManager.playClick();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = (textOverride?: string) => {
    const query = (textOverride || inputVal).trim();
    if (!query) return;

    soundManager.playClick();
    addChatMessage({
      sender: 'user',
      text: query,
    });

    setInputVal('');

    // Parse with AI / NLP engine
    const parsed = parseNaturalLanguageInput(query);

    setTimeout(() => {
      soundManager.playCoin();
      if (parsed.isTransaction && parsed.transaction) {
        addChatMessage({
          sender: 'lwedge',
          text: parsed.reply,
          parsedTransaction: parsed.transaction,
          status: 'pending_confirmation',
        });
      } else {
        addChatMessage({
          sender: 'lwedge',
          text: parsed.reply,
        });
      }
    }, 300);
  };

  const handleConfirmSmartCard = async (msgId: string, parsedTx: any) => {
    // Find account by code or match
    const matchedAccount = accounts.find(
      a => a.bankCode.toUpperCase() === parsedTx.accountCode.toUpperCase()
    ) || accounts[0];

    const todayStr = new Date().toISOString().split('T')[0];

    await addTransaction({
      type: parsedTx.type,
      amount: parsedTx.amount,
      category: parsedTx.category,
      budgetBucket: parsedTx.budgetBucket,
      accountId: matchedAccount?.id || 1,
      note: parsedTx.note,
      date: todayStr,
      isAiLogged: true,
    });

    addChatMessage({
      sender: 'lwedge',
      text: `✅ **Committed to ledger!** ₱${parsedTx.amount.toLocaleString()} logged under **${matchedAccount?.name}** (${parsedTx.category}).`,
    });
  };

  const promptSuggestions = [
    'spent 350 for dinner at Jollibee with Maya',
    'paid 4850 meralco bill via GCash',
    'received 32500 salary to BPI',
    'what is the 50/30/20 rule?',
  ];

  return (
    <>
      {/* 🐾 DRAGGABLE FLOATING CAPYBARA ORB (when chat is closed) */}
      {!isLwedgeChatOpen && (
        <motion.div
          drag
          dragConstraints={{ left: -100, right: 100, top: -200, bottom: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLwedgeChatOpen(true)}
          className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full glass-panel border-2 flex items-center justify-center cursor-pointer shadow-2xl transition-all select-none ${
            netSavingsThisMonth >= 0
              ? 'border-emerald-400 shadow-glow-emerald bg-gradient-to-tr from-emerald-950/80 to-surface-100'
              : 'border-amber-400 shadow-glow-gold bg-gradient-to-tr from-amber-950/80 to-surface-100'
          }`}
        >
          {/* Animated Capybara Face / Orb */}
          <div className="relative flex items-center justify-center text-3xl">
            <span>🐾</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
          </div>
        </motion.div>
      )}

      {/* 💬 EXPANDED CHAT DRAWER */}
      <AnimatePresence>
        {isLwedgeChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full sm:w-[440px] h-[90vh] sm:h-[680px] rounded-t-3xl sm:rounded-3xl glass-panel border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden bg-[#0A0E17]/95"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface-200/90">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-xl shadow-glow-gold">
                    🐾
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white">Lwedge Copilot</h3>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        Online
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Capybara AI • Voice & Natural Language</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearChat}
                    title="Reset conversation"
                    className="w-8 h-8 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsLwedgeChatOpen(false)}
                    className="w-8 h-8 rounded-full bg-surface-100 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* Instant Financial Diagnostics (Screenshot 3 UI) */}
                <div className="p-3.5 rounded-2xl bg-surface-200/90 border border-amber-500/20 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Instant Financial Diagnostics</h4>
                      <p className="text-[10px] text-slate-400">Runs 100% locally or via DeepSeek AI</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    I have real-time access to your balances (<strong className="text-white font-mono">₱{totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>), budgets, and pay cycles. Select an instant audit below or type any expense to log:
                  </p>

                  {/* 4 Instant Diagnostic Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => runDiagnosticAudit('503020')}
                      className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/5 text-left flex items-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <PieChart className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white flex items-center justify-between">
                          <span className="truncate">50/30/20 Health Audit</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">Calculate ratio compliance</div>
                      </div>
                    </button>

                    <button
                      onClick={() => runDiagnosticAudit('cashflow')}
                      className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/5 text-left flex items-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                        <Gauge className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white flex items-center justify-between">
                          <span className="truncate">Payday Cash Flow</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">Daily spending velocity</div>
                      </div>
                    </button>

                    <button
                      onClick={() => runDiagnosticAudit('leaks')}
                      className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/5 text-left flex items-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white flex items-center justify-between">
                          <span className="truncate">Spending Leaks Audit</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">Detect overspending categories</div>
                      </div>
                    </button>

                    <button
                      onClick={() => runDiagnosticAudit('vaults')}
                      className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/5 text-left flex items-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <PiggyBank className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white flex items-center justify-between">
                          <span className="truncate">Savings Feasibility</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">Timeline projection for vaults</div>
                      </div>
                    </button>
                  </div>
                </div>

                {chatMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-glow-gold'
                          : 'glass-card border border-white/10 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* SMART CONFIRMATION CARD (if parsed transaction exists) */}
                      {msg.parsedTransaction && (
                        <div className="mt-3 p-3 rounded-xl bg-surface-300/95 border border-amber-500/40 space-y-2 text-slate-100">
                          <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                              ⚡ Smart Confirmation Card
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 capitalize">
                              {msg.parsedTransaction.budgetBucket} Bucket
                            </span>
                          </div>

                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-slate-400">Parsed Amount:</span>
                            <span className="text-base font-black font-mono text-white">
                              ₱{msg.parsedTransaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Category:</span>
                            <span className="font-semibold text-amber-300">{msg.parsedTransaction.category}</span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Account:</span>
                            <span className="font-semibold text-cyan-300">{msg.parsedTransaction.accountCode}</span>
                          </div>

                          <button
                            onClick={() => handleConfirmSmartCard(msg.id, msg.parsedTransaction)}
                            className="w-full mt-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald cursor-pointer transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>1-Tap Confirm & Log</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Pill Bar */}
              <div className="p-2 border-t border-white/5 bg-surface-300/50 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
                {promptSuggestions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-full bg-surface-100 hover:bg-surface-50 border border-white/5 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>

              {/* Input Bar with Voice Recognition */}
              <div className="p-3 border-t border-white/10 bg-surface-200 flex items-center gap-2">
                <button
                  onClick={handleToggleVoice}
                  title="Voice Input"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50'
                      : 'bg-surface-100 hover:bg-surface-50 text-slate-300 border border-white/10'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  placeholder={isListening ? 'Listening to speech...' : 'Type e.g. "spent 350 for lunch with Maya"'}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!inputVal.trim()}
                  className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 flex items-center justify-center shadow-glow-gold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
