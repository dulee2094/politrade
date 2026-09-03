import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { MarketStatusBadge } from '../../../shared/ui/MarketStatusBadge';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { BRAND_STOCK_NAME } from '../../../config/constants';
import { TrendingUp, TrendingDown, BarChart2, Flame } from 'lucide-react';

export const CompactMarketGrid: React.FC = () => {
  const { politicians, setSelectedPoliticianId } = useStore();

  return (
    <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span>{BRAND_STOCK_NAME} 실시간 전광판</span>
          </h3>
          <p className="text-[11px] text-slate-400">10인 의원 AMM 수급 시세 현황</p>
        </div>

        <MarketStatusBadge />
      </div>

      {/* 2-Column Dense Grid of 10 Politicians */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
        {politicians.map((pol) => {
          const isUp = pol.change24h >= 0;

          return (
            <div
              key={pol.id}
              onClick={() => setSelectedPoliticianId(pol.id)}
              className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer space-y-1.5 group shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={pol.imageUrl}
                  alt={pol.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                      {pol.name}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">{pol.district}</div>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono pt-1 border-t border-slate-700/40 text-[11px]">
                <span className="font-extrabold text-slate-200">{formatPoints(pol.currentPrice)}</span>
                <div className={`flex items-center font-bold text-[10px] ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
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
