import React from 'react';
import { useStore } from '../context/StoreContext';
import { TrendingUp, TrendingDown, ArrowRight, Layers } from 'lucide-react';

export const HoldingsTable: React.FC = () => {
  const { user, politicians, setSelectedPoliticianId, setActiveTab } = useStore();

  const holdingsList = Object.values(user.holdings)
    .filter(h => h.shares > 0)
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
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-200">보유 중인 정치인 주식이 없습니다</h3>
          <p className="text-xs text-slate-400">
            정치인 전광판에서 마음에 드는 국회의원의 주식을 가상머니로 매수해 보세요!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('market')}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <span>정치인 전광판 보러가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const getPartyColorClass = (party: string) => {
    switch (party) {
      case '국민의힘': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case '더불어민주당': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case '조국혁신당': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case '개혁신당': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-700/60 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>보유 정치인 주식 현황</span>
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {holdingsList.length} 종목
            </span>
          </h2>
          <p className="text-xs text-slate-400">AMM 실시간 시세 기준 평가손익</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono border-b border-slate-700/50">
            <tr>
              <th className="py-3 px-4">정치인</th>
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
                  {/* Politician Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={pol.imageUrl}
                        alt={pol.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white">{pol.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getPartyColorClass(pol.party)}`}>
                            {pol.party}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{pol.district}</span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                    {holding.shares.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">주</span>
                  </td>

                  {/* Avg Price */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {holding.avgPrice.toLocaleString()} P
                  </td>

                  {/* Current Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {pol.currentPrice.toLocaleString()} P
                  </td>

                  {/* Total Value */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                    {Math.round(currentValue).toLocaleString()} P
                  </td>

                  {/* PnL */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    <div className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                      <div>{isProfit ? '+' : ''}{Math.round(pnlPoints).toLocaleString()} P</div>
                      <div className="text-[11px] font-normal opacity-90 flex items-center justify-end gap-0.5">
                        {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isProfit ? '+' : ''}{pnlPct.toFixed(2)}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPoliticianId(pol.id);
                      }}
                      className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 text-xs px-3 py-1.5 rounded-lg transition-all font-semibold"
                    >
                      매매 / 차트
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
