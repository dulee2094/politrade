import React, { useState, useEffect } from 'react';
import { getMarketStatus, MarketStatus } from '../../core/trading/marketHours';
import { Clock, Lock, CheckCircle2, Zap, ShieldAlert } from 'lucide-react';

export const MarketStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<MarketStatus>(() => getMarketStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getMarketStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOpen = status.isOpen;

  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl transition-all duration-300 ${
      isOpen
        ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-500/5'
        : 'bg-slate-900/95 border-slate-800 text-slate-200'
    }`}>
      {/* Left: Status Indicator & Label */}
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
          isOpen
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-inner'
            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
        }`}>
          {isOpen ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Lock className="w-5 h-5 text-rose-400" />
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-black font-sans text-white">
              실시간 POLI 주식 시장 작동 상태
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold border ${
              isOpen
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {isOpen ? 'LIVE TRADING OPEN' : 'TEST MODE ENABLED'}
            </span>
          </div>

          <p className="text-xs font-mono font-bold text-slate-300">
            {status.message}
          </p>
        </div>
      </div>

      {/* Right: Real-time Countdown Timer */}
      <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center space-x-1.5 text-indigo-400">
          <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-[11px] font-sans font-bold text-slate-400">카운트다운:</span>
        </div>
        <span className="font-extrabold text-amber-400 tracking-wide text-xs">
          {status.countdownText}
        </span>
      </div>
    </div>
  );
};
