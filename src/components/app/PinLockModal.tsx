import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PinLockModal: React.FC = () => {
  const { settings, unlockApp } = useApp();
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  if (!settings.pinEnabled || !settings.isLocked) return null;

  const handleNumClick = (num: number) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = unlockApp(nextPin);
          if (!success) {
            setErrorShake(true);
            setTimeout(() => {
              setErrorShake(false);
              setPin('');
            }, 500);
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B] backdrop-blur-xl">
      <motion.div
        animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs text-center space-y-6"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-3xl shadow-glow-gold mb-3">
            🦁
          </div>
          <h2 className="text-xl font-bold text-white">Lwedger Secured</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your 4-digit PIN</p>
        </div>

        {/* PIN Dots indicator */}
        <div className="flex justify-center items-center gap-4 py-2">
          {[0, 1, 2, 3].map(index => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isFilled
                    ? 'bg-amber-400 border-amber-400 scale-110 shadow-glow-gold'
                    : 'border-slate-600 bg-surface-100'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="w-16 h-16 rounded-2xl glass-card border border-white/10 text-xl font-bold font-mono text-white hover:bg-surface-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumClick(0)}
            className="w-16 h-16 rounded-2xl glass-card border border-white/10 text-xl font-bold font-mono text-white hover:bg-surface-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-2xl glass-card border border-white/10 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
