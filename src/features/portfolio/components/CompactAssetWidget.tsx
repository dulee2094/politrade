import React from 'react';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { Wallet, TrendingUp, TrendingDown, ChevronRight, DollarSign, PieChart } from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface CompactAssetWidgetProps {
  onClick: () => void;
}

export const CompactAssetWidget: React.FC<CompactAssetWidgetProps> = ({ onClick }) => {
  const { totalAsset, holdingsValue, netPnL, returnRate, isPositive, user } = usePortfolioStats();
  const holdingsCount = Object.values(user.holdings).filter(h => h.shares > 0).length;

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer shadow-xl group space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-300">내 자산 현황 요약</h3>
            <p className="text-[10px] text-slate-400">클릭 시 보유 주식 상세 및 맞춤 뉴스 조회</p>
          </div>
        </div>

        <button className="text-xs text-blue-400 group-hover:text-blue-300 font-extrabold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
          <span>마이 자산 상세보기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono">
        
        {/* Total Net Worth */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-sans font-medium">총 평가 자산</span>
          <div className="text-sm sm:text-base font-extrabold text-white">
            {formatPoints(totalAsset)}
          </div>
        </div>

        {/* ROI % */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-sans font-medium">수익률 / 손익</span>
          <div className={`text-sm sm:text-base font-extrabold flex items-center space-x-1 ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{formatPercent(returnRate)}</span>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-sans font-medium flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            보유 현금
          </span>
          <div className="text-sm sm:text-base font-extrabold text-amber-400">
            {formatPoints(user.balance)}
          </div>
        </div>

        {/* Holdings Evaluation */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-sans font-medium flex items-center gap-1">
            <PieChart className="w-3 h-3 text-indigo-400" />
            보유 주식 ({holdingsCount}종목)
          </span>
          <div className="text-sm sm:text-base font-extrabold text-white">
            {formatPoints(holdingsValue)}
          </div>
        </div>

      </div>
    </div>
  );
};
