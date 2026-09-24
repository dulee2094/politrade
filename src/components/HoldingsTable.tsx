import React from 'react';
import { useStore } from '../context/StoreContext';
import { TrendingUp, TrendingDown, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../config/constants';
import { formatPoints, formatPercent } from '../core/utils/formatters';
import { PartyBadge } from '../shared/ui/PartyBadge';
import { PoliticianAvatar } from '../shared/ui/PoliticianAvatar';
import { StockQuickSearch } from '../features/market/components/StockQuickSearch';

export const HoldingsTable: React.FC = () => {
  const { user, politicians, setSelectedPoliticianId, setActiveTab } = useStore();

  const holdingsMap = user?.holdings || {};

  const holdingsList = Object.values(holdingsMap)
    .filter(h => h && h.shares > 0)
    .map(holding => {
      const pol = politicians.find(p => p.id === holding.politicianId);
      if (!pol) return null;
      
      const currentValue = pol.currentPrice * holding.shares;
      const pnlPoints = currentValue - holding.totalInvested;
      const pnlPct = holding.totalInvested > 0 ? (pnlPoints / holding.totalInvested) * 100 : 0;

      return {
        holding,
        pol,
        currentValue,
        pnlPoints,
        pnlPct,
      };
    })
    .filter(Boolean);

  if (holdingsList.length === 0) {
    return (
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-100">현재 보유 중인 {BRAND_STOCK_NAME}이 없습니다</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              아래에서 원하시는 정치인 주식을 검색하거나 선택하여 실시간 호가창(Order Book) 지정가/시장가 매매를 바로 시작해보세요!
            </p>
          </div>
        </div>

        {/* Quick Search Selector */}
        <div className="max-w-md mx-auto">
          <StockQuickSearch variant="inline" placeholder="🔍 매매할 종목 검색 (이름/정당/지역구)..." />
        </div>

        {/* Quick Politician Buttons Grid */}
        <div className="pt-2 border-t border-slate-700/50 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 text-center font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>추천 10인 POLI주식 바로 매매하기</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {politicians.map((pol) => (
              <button
                key={pol.id}
                type="button"
                onClick={() => setSelectedPoliticianId(pol.id)}
                className="p-2 bg-slate-900/80 hover:bg-slate-700 border border-slate-700/80 hover:border-blue-500/50 rounded-xl transition-all text-left flex items-center space-x-2 group"
              >
                <PoliticianAvatar src={pol.imageUrl} name={pol.name} party={pol.party} className="w-7 h-7 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 truncate">{pol.name}</div>
                  <div className="text-[10px] font-mono text-amber-400 font-extrabold">{formatPoints(pol.currentPrice)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl space-y-0">
      
      {/* Table Header with Quick Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>보유 {BRAND_STOCK_NAME} 현황</span>
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {holdingsList.length} 종목
            </span>
          </h2>
          <p className="text-xs text-slate-400">실시간 시세 기준 {BRAND_STOCK_NAME} 평가손익</p>
        </div>

        {/* Quick Search Dropdown in Table Header */}
        <div className="shrink-0">
          <StockQuickSearch variant="inline" placeholder="🔍 전체 종목 호가창 바로가기..." />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono border-b border-slate-700/50">
            <tr>
              <th className="py-3 px-4">정치인 ({BRAND_STOCK_NAME})</th>
              <th className="py-3 px-4 text-right">보유 수량</th>
              <th className="py-3 px-4 text-right">평균 매수가</th>
              <th className="py-3 px-4 text-right">현재가</th>
              <th className="py-3 px-4 text-right">평가 금액</th>
              <th className="py-3 px-4 text-right">평가 손익</th>
              <th className="py-3 px-4 text-center">거래</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {holdingsList.map((item) => {
              if (!item) return null;
              const { holding, pol, currentValue, pnlPoints, pnlPct } = item;
              const isProfit = pnlPoints >= 0;

              return (
                <tr 
                  key={pol.id}
                  className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedPoliticianId(pol.id)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <PoliticianAvatar
                        src={pol.imageUrl}
                        name={pol.name}
                        party={pol.party}
                        className="w-10 h-10 rounded-xl"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white">{pol.name}</span>
                          <PartyBadge party={pol.party} />
                        </div>
                        <span className="text-[11px] text-slate-400">{pol.district}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                    {holding.shares.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">주</span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {formatPoints(holding.avgPrice)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {formatPoints(pol.currentPrice)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                    {formatPoints(currentValue)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono">
                    <div className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isProfit ? '+' : ''}{formatPoints(pnlPoints)}
                    </div>
                    <div className={`text-[10px] ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({formatPercent(pnlPct)})
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPoliticianId(pol.id);
                      }}
                      className="bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1 rounded-lg border border-blue-500/40 text-xs font-bold transition-all"
                    >
                      거래하기
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
