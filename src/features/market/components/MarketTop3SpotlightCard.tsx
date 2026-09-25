import React from 'react';
import { Politician } from '../../../types';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { Crown, Sparkles } from 'lucide-react';
import { formatPoints, formatVolume } from '../../../core/utils/formatters';

interface MarketTop3SpotlightCardProps {
  politicians: Politician[];
  onSelectPolitician: (id: string) => void;
}

export const MarketTop3SpotlightCard: React.FC<MarketTop3SpotlightCardProps> = ({
  politicians,
  onSelectPolitician,
}) => {
  // 시가총액 TOP 3 (현재가 * 발행량 추정치 내림차순)
  const topMarketCap = [...politicians]
    .sort((a, b) => {
      const capA = a.currentPrice * (a.ipoTargetShares || 10) * 10000;
      const capB = b.currentPrice * (b.ipoTargetShares || 10) * 10000;
      return capB - capA;
    })
    .slice(0, 3);

  return (
    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
          <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5" />
          </span>
          <span>시가총액 TOP 3 종목 (Market Cap Leaders)</span>
        </h4>
        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>시가총액 상위</span>
        </span>
      </div>

      {/* Grid of 3 Top Market Cap Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {topMarketCap.map((pol, idx) => {
          const capValue = pol.currentPrice * (pol.ipoTargetShares || 10) * 10000;

          return (
            <div
              key={'mcap_' + pol.id}
              onClick={() => onSelectPolitician(pol.id)}
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 hover:border-amber-400/60 transition-all cursor-pointer space-y-2.5 group shadow-md hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Top-Right Rank Badge Overlay */}
              <span
                className={`absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10 ${
                  idx === 0
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-700/60'
                }`}
              >
                {idx === 0 ? '👑 TOP 1' : `TOP ${idx + 1}`}
              </span>

              {/* Header inside card */}
              <div className="flex items-center space-x-2.5 pr-14">
                <PoliticianAvatar
                  src={pol.imageUrl}
                  name={pol.name}
                  party={pol.party}
                  className="w-10 h-10 rounded-xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-black text-sm text-white group-hover:text-amber-300 transition-colors block leading-tight">
                    {pol.name}
                  </span>
                  <div className="text-[11px] text-slate-400 font-medium block mt-0.5">{pol.party}</div>
                </div>
              </div>

              {/* Price & Market Cap Value */}
              <div className="pt-2 border-t border-slate-700/50 space-y-1 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-sans">현재가</span>
                  <span className="font-extrabold text-white text-[11px]">
                    {formatPoints(pol.currentPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-slate-400 font-sans">추정 시가총액</span>
                  <span className="font-bold text-amber-400">
                    {formatVolume(capValue)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
