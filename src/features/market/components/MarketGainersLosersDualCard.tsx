import React from 'react';
import { Politician } from '../../../types';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface MarketGainersLosersDualCardProps {
  politicians: Politician[];
  onSelectPolitician: (id: string) => void;
}

export const MarketGainersLosersDualCard: React.FC<MarketGainersLosersDualCardProps> = ({
  politicians,
  onSelectPolitician,
}) => {
  // 1. 어제 거래 급상승 TOP 3 (24h 변동률 내림차순)
  const topGainers = [...politicians]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 3);

  // 2. 어제 거래 급하락 TOP 3 (24h 변동률 오름차순)
  const topLosers = [...politicians]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 3);

  return (
    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
          <span className="p-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="w-3.5 h-3.5" />
          </span>
          <span>어제 거래 변동률 TOP 3 (급상승 vs 급하락)</span>
        </h4>
        <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
          24H 등락률 기준
        </span>
      </div>

      {/* 2-Column Subgrid: Gainers (Left) vs Losers (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Gainers Sub-Card (급상승 TOP 3) */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-emerald-500/30 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-1.5 font-black text-xs text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>🔥 어제 거래 급상승 TOP 3</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              최고 상승세
            </span>
          </div>

          <div className="space-y-2">
            {topGainers.map((pol, idx) => (
              <div
                key={'gainer_' + pol.id}
                onClick={() => onSelectPolitician(pol.id)}
                className="bg-slate-900/90 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`w-5 h-5 rounded-md text-[10px] font-black font-mono flex items-center justify-center shrink-0 ${
                    idx === 0 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {idx + 1}
                  </span>
                  <PoliticianAvatar
                    src={pol.imageUrl}
                    name={pol.name}
                    party={pol.party}
                    className="w-8 h-8 rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap block truncate">
                      {pol.name}
                    </span>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap block truncate">{pol.party}</div>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0 ml-2">
                  <div className="font-extrabold text-emerald-400 text-xs flex items-center justify-end gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>{formatPercent(pol.change24h)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{formatPoints(pol.currentPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers Sub-Card (급하락 TOP 3) */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-rose-500/30 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-1.5 font-black text-xs text-rose-400">
              <TrendingDown className="w-4 h-4" />
              <span>📉 어제 거래 급하락 TOP 3</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
              최고 조정세
            </span>
          </div>

          <div className="space-y-2">
            {topLosers.map((pol, idx) => (
              <div
                key={'loser_' + pol.id}
                onClick={() => onSelectPolitician(pol.id)}
                className="bg-slate-900/90 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`w-5 h-5 rounded-md text-[10px] font-black font-mono flex items-center justify-center shrink-0 ${
                    idx === 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-rose-400 border border-rose-500/30'
                  }`}>
                    {idx + 1}
                  </span>
                  <PoliticianAvatar
                    src={pol.imageUrl}
                    name={pol.name}
                    party={pol.party}
                    className="w-8 h-8 rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs text-white group-hover:text-rose-300 transition-colors whitespace-nowrap block truncate">
                      {pol.name}
                    </span>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap block truncate">{pol.party}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-extrabold text-rose-400 text-xs flex items-center justify-end gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>{formatPercent(pol.change24h)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{formatPoints(pol.currentPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
