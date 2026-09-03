import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { Flame, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface LivePulsePreviewProps {
  onEnterApp: () => void;
}

export const LivePulsePreview: React.FC<LivePulsePreviewProps> = ({ onEnterApp }) => {
  const { politicians, setSelectedPoliticianId } = useStore();

  const top3 = politicians.slice(0, 3);

  return (
    <div className="space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>실시간 국회의원 주가 펄스 미리보기</span>
          </h2>
          <p className="text-xs text-slate-400">AMM 수급 풀 기반 실시간 민심 시세</p>
        </div>

        <button
          onClick={onEnterApp}
          className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
        >
          <span>전체 10인 전광판 보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((pol) => {
          const isUp = pol.change24h >= 0;

          return (
            <div
              key={pol.id}
              onClick={() => {
                onEnterApp();
                setSelectedPoliticianId(pol.id);
              }}
              className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <img src={pol.imageUrl} alt={pol.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700" />
                <PartyBadge party={pol.party} />
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>{pol.name}</span>
                  <span className="text-[11px] text-slate-400 font-normal">{pol.district}</span>
                </h3>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{pol.title}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between font-mono">
                <span className="text-sm font-extrabold text-white">{formatPoints(pol.currentPrice)}</span>
                <div className={`flex items-center space-x-1 font-bold text-xs ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{formatPercent(pol.change24h)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
