import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UndoBar: React.FC = () => {
  const { undoItem, triggerUndo, clearUndo } = useApp();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!undoItem) return;

    setProgress(100);
    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          clearUndo();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [undoItem]);

  if (!undoItem) return null;

  const getMessage = () => {
    if (undoItem.type === 'delete_transaction') return 'Transaction deleted';
    if (undoItem.type === 'add_transaction') return 'Transaction logged';
    return 'Action performed';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
      >
        <div className="rounded-2xl glass-panel border border-amber-500/40 p-3.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-4 overflow-hidden relative bg-[#0D121F]/95">
          {/* Top Progress Countdown Line */}
          <div
            className="absolute top-0 left-0 h-1 bg-amber-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-white font-medium">{getMessage()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow-glow-gold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo (5s)</span>
            </button>
            <button
              onClick={clearUndo}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
