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
  onGoToMarket?: () => void;
}

export const MarketDashboardGroupCard: React.FC<MarketDashboardGroupCardProps> = ({
  politicians,
  topVolumeList,
  onSelectPolitician,
  onGoToMarket,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 p-5 rounded-3xl border border-blue-500/30 shadow-2xl h-full flex flex-col justify-between space-y-4">
      
      {/* Left Main Dashboard Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
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

        {onGoToMarket && (
          <button
            type="button"
            onClick={onGoToMarket}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 flex items-center space-x-1.5 whitespace-nowrap shrink-0 shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
          >
            <span>📈 주식 매매하러 가기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Flexible Equal-Height Inner Content Container */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
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

    </div>
  );
};
