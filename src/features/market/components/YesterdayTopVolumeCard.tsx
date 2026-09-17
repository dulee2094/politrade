import React from 'react';
import { Politician } from '../../../types';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { BarChart3 } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface YesterdayTopVolumeCardProps {
  topVolumeList: Politician[];
  onSelectPolitician: (id: string) => void;
}

export const YesterdayTopVolumeCard: React.FC<YesterdayTopVolumeCardProps> = ({
  topVolumeList,
  onSelectPolitician,
}) => {
  return (
    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
          <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BarChart3 className="w-3.5 h-3.5" />
          </span>
          <span>어제 마감 거래량 & 거래대금 TOP 3 종목</span>
        </h4>
        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30">
          어제 최종 집계
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {topVolumeList.map((pol, idx) => {
          const approxShares = pol.currentPrice > 0 ? Math.round((pol.volume24h || 100000) / pol.currentPrice) : 0;

          return (
            <div
              key={'vol_' + pol.id}
              onClick={() => onSelectPolitician(pol.id)}
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 hover:border-cyan-400/60 transition-all cursor-pointer space-y-2 group shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <PoliticianAvatar
                    src={pol.imageUrl}
                    name={pol.name}
                    party={pol.party}
                    className="w-9 h-9 rounded-xl"
                  />
                  <div>
                    <span className="font-extrabold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {pol.name}
                    </span>
                    <div className="text-[10px] text-slate-400">{pol.party}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    idx === 0
                      ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {idx === 0 ? '🥇 1위' : idx === 1 ? '🥈 2위' : '🥉 3위'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700/50 space-y-0.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-slate-400 font-sans">거래대금</span>
                  <span className="font-extrabold text-cyan-300 text-[11px]">
                    {formatPoints(pol.volume24h || 120000)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span className="font-sans">거래량</span>
                  <span className="font-bold text-slate-300">약 {approxShares}주</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
