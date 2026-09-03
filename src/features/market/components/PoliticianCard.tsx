import React from 'react';
import { Politician } from '../../../types';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { formatPoints, formatPercent, formatVolume } from '../../../core/utils/formatters';

interface PoliticianCardProps {
  politician: Politician;
  onSelect: (id: string) => void;
}

export const PoliticianCard: React.FC<PoliticianCardProps> = ({ politician: pol, onSelect }) => {
  const isUp = pol.change24h >= 0;
  const isIPO = pol.phase === 'IPO';
  const ipoPct = Math.round((pol.ipoSoldShares / pol.ipoTargetShares) * 100);

  return (
    <div
      onClick={() => onSelect(pol.id)}
      className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-blue-500/50 p-4 transition-all duration-200 shadow-xl cursor-pointer group flex flex-col justify-between space-y-4 hover:-translate-y-1"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="relative">
            <PoliticianAvatar
              src={pol.imageUrl}
              name={pol.name}
              party={pol.party}
              className="w-14 h-14 rounded-2xl"
            />
            {pol.change24h > 10 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                <Flame className="w-3 h-3 fill-slate-950" /> HOT
              </span>
            )}
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <PartyBadge party={pol.party} />
            {isIPO ? (
              <span className="bg-indigo-600/30 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-indigo-500/30">
                Phase 1 공모 중
              </span>
            ) : (
              <span className="bg-emerald-600/30 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                Phase 2 호가 상장
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
            <span>{pol.name}</span>
            <span className="text-xs text-slate-400 font-normal">{pol.district}</span>
          </h3>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{pol.title}</p>
        </div>
      </div>

      {isIPO ? (
        <div className="bg-slate-900/80 rounded-xl p-3 border border-indigo-500/30 space-y-1 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">공모 청약가</span>
            <span className="font-bold text-amber-400">10,000 P (고정)</span>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>공모 달성률</span>
              <span>{ipoPct}% ({pol.ipoSoldShares}/1000주)</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ipoPct}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 space-y-1 font-mono">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-slate-400 font-sans">현재가</span>
            <div className="text-base font-extrabold text-white">
              {formatPoints(pol.currentPrice)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-sans">24H 변동</span>
            <div className={`flex items-center space-x-1 font-bold text-xs ${
              isUp ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{formatPercent(pol.change24h)}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="w-full bg-blue-600/20 group-hover:bg-blue-600 text-blue-300 group-hover:text-white font-extrabold text-xs py-2.5 rounded-xl border border-blue-500/30 transition-all text-center"
      >
        {isIPO ? 'Phase 1 공모 청약하기' : '차트보기 / 호가 매매'}
      </button>
    </div>
  );
};
