import React, { useState, useEffect } from 'react';
import { getMarketStatus, MarketStatus } from '../../core/trading/marketHours';
import { Clock, Lock, CheckCircle2 } from 'lucide-react';

export const MarketStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<MarketStatus>(() => getMarketStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getMarketStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
      status.isOpen
        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
        : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
    }`}>
      {status.isOpen ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      )}

      <span className="font-sans font-bold">{status.message}</span>
      <span className="opacity-80 border-l border-slate-700 pl-2 ml-1 text-[11px] hidden sm:inline">
        {status.countdownText}
      </span>
    </div>
  );
};
