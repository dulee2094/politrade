import React from 'react';
import { Politician } from '../../../types';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { formatPoints, formatPercent, formatVolume } from '../../../core/utils/formatters';

interface PoliticianCardProps {
  politician: Politician;
  onSelect: (id: string) => void;
}

export const PoliticianCard: React.FC<PoliticianCardProps> = ({ politician: pol, onSelect }) => {
  const isUp = pol.change24h >= 0;

  return (
    <div
      onClick={() => onSelect(pol.id)}
      className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-blue-500/50 p-4 transition-all duration-200 shadow-xl cursor-pointer group flex flex-col justify-between space-y-4 hover:-translate-y-1"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="relative">
            <img
              src={pol.imageUrl}
              alt={pol.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-blue-500 transition-all shadow-md"
            />
            {pol.change24h > 10 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                <Flame className="w-3 h-3 fill-slate-950" /> HOT
              </span>
            )}
          </div>
          
          <PartyBadge party={pol.party} />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
            <span>{pol.name}</span>
            <span className="text-xs text-slate-400 font-normal">{pol.district}</span>
          </h3>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{pol.title}</p>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-slate-400">현재 주가</span>
          <div className="text-base font-extrabold text-white font-mono">
            {formatPoints(pol.currentPrice)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">24H 변동</span>
          <div className={`flex items-center space-x-1 font-mono font-bold text-xs ${
            isUp ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{formatPercent(pol.change24h)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
          <span>24H 거래액</span>
          <span>{formatVolume(pol.volume24h)}</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(pol.id);
        }}
        className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 font-bold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1"
      >
        <span>차트보기 / 매매하기</span>
      </button>

    </div>
  );
};
