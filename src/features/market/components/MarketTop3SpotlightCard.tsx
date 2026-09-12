import React, { useState } from 'react';
import { Politician } from '../../../types';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { Sparkles, TrendingUp, TrendingDown, Crown, Zap } from 'lucide-react';
import { formatPoints, formatPercent, formatVolume } from '../../../core/utils/formatters';

type TabType = 'gainers' | 'losers' | 'marketCap' | 'volume';

interface MarketTop3SpotlightCardProps {
  politicians: Politician[];
  onSelectPolitician: (id: string) => void;
}

export const MarketTop3SpotlightCard: React.FC<MarketTop3SpotlightCardProps> = ({
  politicians,
  onSelectPolitician,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('gainers');

  // 1. 급상승 TOP 3 (24h 상승률 내림차순)
  const topGainers = [...politicians]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 3);

  // 2. 급하락 TOP 3 (24h 변동률 오름차순)
  const topLosers = [...politicians]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 3);

  // 3. 시가총액 TOP 3 (현재가 * 발행량 추정치)
  const topMarketCap = [...politicians]
    .sort((a, b) => {
      const capA = a.currentPrice * (a.ipoTargetShares || 10) * 10000;
      const capB = b.currentPrice * (b.ipoTargetShares || 10) * 10000;
      return capB - capA;
    })
    .slice(0, 3);

  // 4. 거래량 TOP 3
  const topVolume = [...politicians]
    .sort((a, b) => (b.volume24h || b.totalVolume || 0) - (a.volume24h || a.totalVolume || 0))
    .slice(0, 3);

  const getDisplayItems = () => {
    switch (activeTab) {
      case 'losers':
        return topLosers;
      case 'marketCap':
        return topMarketCap;
      case 'volume':
        return topVolume;
      case 'gainers':
      default:
        return topGainers;
    }
  };

  const currentItems = getDisplayItems();

  const tabs: { id: TabType; label: string; icon: React.ReactNode; colorClass: string }[] = [
    { id: 'gainers', label: '🔥 급상승 TOP 3', icon: <TrendingUp className="w-3.5 h-3.5" />, colorClass: 'text-emerald-400' },
    { id: 'losers', label: '📉 급하락 TOP 3', icon: <TrendingDown className="w-3.5 h-3.5" />, colorClass: 'text-rose-400' },
    { id: 'marketCap', label: '👑 시가총액 TOP 3', icon: <Crown className="w-3.5 h-3.5" />, colorClass: 'text-amber-400' },
    { id: 'volume', label: '⚡ 거래량 TOP 3', icon: <Zap className="w-3.5 h-3.5" />, colorClass: 'text-cyan-400' },
  ];

  return (
    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>시장 종목 현황 스팟라이트</span>
        </h4>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className={t.colorClass}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 3 Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {currentItems.map((pol, idx) => {
          const capValue = pol.currentPrice * (pol.ipoTargetShares || 10) * 10000;
          const volValue = pol.volume24h || pol.totalVolume || 0;

          return (
            <div
              key={`${activeTab}_${pol.id}`}
              onClick={() => onSelectPolitician(pol.id)}
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 hover:border-indigo-400/60 transition-all cursor-pointer space-y-2 group shadow-md hover:-translate-y-1"
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <PoliticianAvatar
                    src={pol.imageUrl}
                    name={pol.name}
                    party={pol.party}
                    className="w-9 h-9 rounded-xl"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-white group-hover:text-indigo-300 transition-colors">
                      {pol.name}
                    </span>
                    <div className="text-[10px] text-slate-400">{pol.party}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    idx === 0
                      ? activeTab === 'gainers'
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        : activeTab === 'losers'
                        ? 'bg-rose-400/20 text-rose-300 border border-rose-400/30'
                        : activeTab === 'marketCap'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  TOP {idx + 1}
                </span>
              </div>

              {/* Price & Secondary Metric */}
              <div className="flex items-center justify-between font-mono pt-2 border-t border-slate-700/50 text-xs">
                <span className="font-extrabold text-white text-[11px]">
                  {formatPoints(pol.currentPrice)}
                </span>

                {activeTab === 'gainers' && (
                  <div className="font-bold text-emerald-400 flex items-center gap-0.5 text-[11px]">
                    <TrendingUp className="w-3 h-3" />
                    <span>{formatPercent(pol.change24h)}</span>
                  </div>
                )}

                {activeTab === 'losers' && (
                  <div className="font-bold text-rose-400 flex items-center gap-0.5 text-[11px]">
                    <TrendingDown className="w-3 h-3" />
                    <span>{formatPercent(pol.change24h)}</span>
                  </div>
                )}

                {activeTab === 'marketCap' && (
                  <div className="font-bold text-amber-400 flex items-center gap-0.5 text-[11px]">
                    <Crown className="w-3 h-3" />
                    <span>{formatVolume(capValue)}</span>
                  </div>
                )}

                {activeTab === 'volume' && (
                  <div className="font-bold text-cyan-400 flex items-center gap-0.5 text-[11px]">
                    <Zap className="w-3 h-3" />
                    <span>{formatVolume(volValue)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
