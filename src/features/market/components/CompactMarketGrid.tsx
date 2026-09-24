import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { MarketStatusBadge } from '../../../shared/ui/MarketStatusBadge';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { BRAND_STOCK_NAME } from '../../../config/constants';
import { TrendingUp, TrendingDown, BarChart2, Zap } from 'lucide-react';

export const CompactMarketGrid: React.FC = () => {
  const { politicians, setSelectedPoliticianId } = useStore();

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 shadow-xl space-y-4 backdrop-blur-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BarChart2 className="w-4 h-4" />
            </span>
            <span>{BRAND_STOCK_NAME} 실시간 전광판</span>
          </h3>
          <p className="text-xs text-slate-400">💡 의원 카드 클릭 시 호가창 매매 모달 즉시 이동</p>
        </div>

        <MarketStatusBadge />
      </div>

      {/* Responsive 5-Column Grid of 10 Politicians */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {politicians.map((pol) => {
          const isUp = pol.change24h >= 0;

          return (
            <div
              key={pol.id}
              onClick={() => setSelectedPoliticianId(pol.id)}
              className="bg-slate-950/70 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 hover:border-cyan-400/60 transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:-translate-y-0.5 relative overflow-hidden"
            >
              <div className="flex items-center space-x-2.5">
                <PoliticianAvatar
                  src={pol.imageUrl}
                  name={pol.name}
                  party={pol.party}
                  className="w-10 h-10 rounded-xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-xs text-white group-hover:text-cyan-300 transition-colors block truncate">
                    {pol.name}
                  </span>
                  <div className="text-[10px] text-slate-400 truncate">{pol.district}</div>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono pt-1.5 border-t border-slate-800 text-xs">
                <span className="font-extrabold text-slate-200">{formatPoints(pol.currentPrice)}</span>
                <div className={`flex items-center font-bold text-[10px] ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  <span>{formatPercent(pol.change24h)}</span>
                </div>
              </div>

              {/* Hover Badge */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-x-0 bottom-0 bg-cyan-600 text-slate-950 font-black text-[10px] py-1 text-center font-sans flex items-center justify-center gap-1 shadow-md">
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>호가창 매매하기</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
