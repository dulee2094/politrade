import React from 'react';
import { Politician } from '../../../types';
import { MarketTop3SpotlightCard } from './MarketTop3SpotlightCard';
import { MarketGainersLosersDualCard } from './MarketGainersLosersDualCard';
import { YesterdayTopVolumeCard } from './YesterdayTopVolumeCard';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface MarketDashboardGroupCardProps {
  politicians: Politician[];
  topVolumeList: Politician[];
  onSelectPolitician: (id: string) => void;
}

export const MarketDashboardGroupCard: React.FC<MarketDashboardGroupCardProps> = ({
  politicians,
  topVolumeList,
  onSelectPolitician,
}) => {
  const scrollToMarketGrid = () => {
    const el = document.getElementById('compact-market-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
      
      {/* Left Main Dashboard Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <TrendingUp className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white flex items-center gap-2 flex-wrap tracking-tight">
              <span className="whitespace-nowrap">주식 시장 TOP 3 종합 현황</span>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/40 font-mono font-bold whitespace-nowrap">
                MARKET DASHBOARD
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              시가총액 · 거래 변동률 · 거래량 TOP 3 주요 종목 종합 현황
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToMarketGrid}
          className="px-3.5 py-2 rounded-xl font-bold text-xs transition-all bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-500/40 flex items-center space-x-1.5 whitespace-nowrap shrink-0 shadow-md"
        >
          <span>전체 종목 매매</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. 시가총액 TOP 3 종목 카드 */}
      <MarketTop3SpotlightCard 
        politicians={politicians}
        onSelectPolitician={onSelectPolitician}
      />

      {/* 2. 어제 거래 급상승 & 급하락 TOP 3 듀얼 카드 */}
      <MarketGainersLosersDualCard
        politicians={politicians}
        onSelectPolitician={onSelectPolitician}
      />

      {/* 3. 어제 마감 거래량 & 거래대금 TOP 3 종목 카드 */}
      <YesterdayTopVolumeCard 
        topVolumeList={topVolumeList}
        onSelectPolitician={onSelectPolitician}
      />

    </div>
  );
};
