import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, ShieldCheck, Check, Terminal, QrCode, Cpu, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApkDownloadModal: React.FC = () => {
  const { isApkModalOpen, setIsApkModalOpen } = useApp();
  const [isCopied, setIsCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isApkModalOpen) return null;

  const handleDownload = () => {
    setDownloadStarted(true);
    // Create a mock download trigger for app-debug.apk
    const element = document.createElement('a');
    const file = new Blob([
      'Lwedger Native Android Package v1.0\nArchitecture: arm64-v8a, armeabi-v7a, x86_64\nTarget: Android 14+ (API 34)\nBuilt with Kotlin & Jetpack Compose'
    ], { type: 'application/vnd.android.package-archive' });
    element.href = URL.createObjectURL(file);
    element.download = 'Lwedger-v1.0-release.apk';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const copyAdbCommand = () => {
    navigator.clipboard.writeText('adb install app-debug.apk');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden"
      >
        {/* Top Close Button */}
        <button
          onClick={() => setIsApkModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-50 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-glow-gold">
            🦁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">Lwedger for Android</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                v1.0 Stable
              </span>
            </div>
            <p className="text-xs text-slate-400">Offline-first Jetpack Compose application</p>
          </div>
        </div>

        {/* Architecture Spec Pill */}
        <div className="mt-6 p-4 rounded-2xl bg-surface-200/80 border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Package Name:</span>
            <span className="font-mono text-white">com.luigi.lwedger</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Tech Stack:</span>
            <span className="font-mono text-amber-300">Kotlin, Compose, Room, Glance</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Target OS:</span>
            <span className="text-white">Android 8.0+ (API 26 to API 35)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Permissions:</span>
            <span className="text-emerald-400">Zero Internet Required (100% Offline)</span>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6">
          <button
            onClick={handleDownload}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-glow-gold hover:opacity-95 transition-all cursor-pointer"
          >
            {downloadStarted ? (
              <>
                <Check className="w-5 h-5" />
                <span>Downloading Lwedger APK...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download APK (app-debug.apk)</span>
              </>
            )}
          </button>
        </div>

        {/* ADB Sideload instruction */}
        <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> Sideload via Terminal / ADB:
            </span>
            <button
              onClick={copyAdbCommand}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <code className="text-[11px] font-mono text-emerald-300 block bg-surface-300 p-2 rounded-lg select-all">
            adb install app-debug.apk
          </code>
        </div>
      </motion.div>
    </div>
  );
};
