import React from 'react';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { Wallet, TrendingUp, TrendingDown, ChevronRight, DollarSign, PieChart, ArrowUpRight } from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface HeroAssetSpotlightProps {
  onOpenDetail: () => void;
}

export const HeroAssetSpotlight: React.FC<HeroAssetSpotlightProps> = ({ onOpenDetail }) => {
  const { totalAsset, holdingsValue, netPnL, returnRate, isPositive, user } = usePortfolioStats();
  
  const holdings = user?.holdings || {};
  const holdingsCount = Object.values(holdings).filter(h => h && h.shares > 0).length;
  const userBalance = user?.balance || 0;

  // Calculate Asset Allocation Percentages
  const cashPct = totalAsset > 0 ? Math.round((userBalance / totalAsset) * 100) : 100;
  const stockPct = totalAsset > 0 ? 100 - cashPct : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-5 h-full flex flex-col justify-between">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>마이 자산 대시보드</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30 font-mono">
                SPOTLIGHT
              </span>
            </h2>
            <p className="text-xs text-slate-400">포트폴리오 성과 및 가상 자산 비중</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDetail}
          className="bg-slate-800/80 hover:bg-slate-800 text-blue-400 hover:text-white border border-slate-700/80 hover:border-blue-500/50 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1.5"
        >
          <span>상세 잔고 & 분석</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Net Worth & ROI Display */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">총 평가 자산 (Net Worth)</span>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {formatPoints(totalAsset)}
          </div>
          <p className="text-[11px] text-slate-400">초기 100,000 P 대비 실시간 손익 평가액</p>
        </div>

        <div className="flex flex-col justify-end space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">평가 손익 / 수익률</span>
            <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              isPositive 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{formatPercent(returnRate)}</span>
            </div>
          </div>
          <div className={`text-xl font-extrabold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '+' : ''}{formatPoints(netPnL)}
          </div>
        </div>
      </div>

      {/* Asset Allocation Bar */}
      <div className="relative z-10 space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1 font-sans">
            <PieChart className="w-3.5 h-3.5 text-indigo-400" />
            자산 포트폴리오 비중
          </span>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-amber-400 font-bold">현금 {cashPct}%</span>
            <span className="text-indigo-300 font-bold">POLI주식 {stockPct}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-l-full transition-all duration-500"
            style={{ width: `${cashPct}%` }}
            title={`보유 현금: ${formatPoints(userBalance)} (${cashPct}%)`}
          />
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-r-full transition-all duration-500"
            style={{ width: `${stockPct}%` }}
            title={`보유 주식: ${formatPoints(holdingsValue)} (${stockPct}%)`}
          />
        </div>
      </div>

      {/* Bottom Summary Cards */}
      <div className="relative z-10 grid grid-cols-2 gap-3 font-mono text-xs pt-1">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            보유 가상 현금
          </span>
          <div className="text-sm font-extrabold text-amber-400">
            {formatPoints(userBalance)}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
            <PieChart className="w-3 h-3 text-indigo-400" />
            보유 주식 ({holdingsCount}종목)
          </span>
          <div className="text-sm font-extrabold text-white">
            {formatPoints(holdingsValue)}
          </div>
        </div>
      </div>

    </div>
  );
};
