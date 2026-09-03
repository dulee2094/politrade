import React from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, Calendar } from 'lucide-react';
import { formatPoints, formatPercent } from '../core/utils/formatters';

export const PortfolioSummary: React.FC = () => {
  const { user, politicians } = useStore();

  let holdingsValue = 0;
  let totalCostBasis = 0;

  Object.values(user.holdings).forEach(holding => {
    const pol = politicians.find(p => p.id === holding.politicianId);
    if (pol && holding.shares > 0) {
      holdingsValue += pol.currentPrice * holding.shares;
      totalCostBasis += holding.totalInvested;
    }
  });

  const totalAsset = user.balance + holdingsValue;
  const netPnL = totalAsset - user.initialBalance;
  const returnRate = user.initialBalance > 0 ? (netPnL / user.initialBalance) * 100 : 0;
  const isPositive = netPnL >= 0;

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span>총 평가 자산 (Net Worth)</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {formatPoints(totalAsset)}
            </span>

            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold font-mono ${
              isPositive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{formatPercent(returnRate)}</span>
              <span className="text-[10px] opacity-75">({formatPoints(netPnL)})</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            초기 지급 자산 <span className="font-mono text-slate-300">100,000 P</span> 대비 실시간 평가 손익
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
          
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-indigo-400" />
              보유 주식 평가액
            </span>
            <div className="text-lg font-bold text-white font-mono">
              {formatPoints(holdingsValue)}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              보유 가상 현금
            </span>
            <div className="text-lg font-bold text-amber-400 font-mono">
              {formatPoints(user.balance)}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-1 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              정기 지원금
            </span>
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
              <span className="text-xs font-mono font-bold text-blue-300">매월 1일 +10만P</span>
              <p className="text-[9px] text-slate-500 mt-0.5">자동 정기 입금 시스템</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
