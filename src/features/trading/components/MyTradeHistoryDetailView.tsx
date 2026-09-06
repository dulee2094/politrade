import React, { useState } from 'react';
import { usePortfolioStats } from '../../portfolio/hooks/usePortfolioStats';
import { useStore } from '../../../context/StoreContext';
import { HoldingsTable } from '../../../components/HoldingsTable';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShoppingBag, 
  History, 
  Search, 
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface MyTradeHistoryDetailViewProps {
  onBackToDashboard: () => void;
}

export const MyTradeHistoryDetailView: React.FC<MyTradeHistoryDetailViewProps> = ({ onBackToDashboard }) => {
  const { user, politicians, setSelectedPoliticianId } = useStore();
  const { totalAsset, holdingsValue, netPnL, returnRate, isPositive } = usePortfolioStats();
  
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const tradeHistory = user?.tradeHistory || [];

  const filteredLogs = tradeHistory.filter(t => {
    if (filterType === 'BUY') return t.type === 'BUY';
    if (filterType === 'SELL') return t.type === 'SELL';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/40 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all border border-slate-700 flex items-center space-x-1 font-sans font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </button>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>주식 보유 & 매매 거래 체결 상세 리포트</span>
            </h2>
            <p className="text-xs text-slate-400">보유 종목 실시간 손익 평가, 평균 매수 단가 및 누적 체결 내역</p>
          </div>
        </div>

        <span className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/40 font-mono font-bold">
          TRADE & HOLDINGS
        </span>
      </div>

      {/* 1. Full Holdings Table View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>보유 종목 상세 실시간 평가 현황</span>
          </h3>
        </div>
        <HoldingsTable />
      </div>

      {/* 2. Full Trade Execution Logs Table */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-xl font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white">
              누적 체결 매매 거래 내역 ({tradeHistory.length}건)
            </h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              전체 ({tradeHistory.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('BUY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'BUY' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              매수 체결
            </button>
            <button
              type="button"
              onClick={() => setFilterType('SELL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'SELL' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              매도 체결
            </button>
          </div>
        </div>

        {/* Execution Logs Table */}
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">구분</th>
                  <th className="p-3">종목명</th>
                  <th className="p-3 text-right">수량</th>
                  <th className="p-3 text-right">체결 단가</th>
                  <th className="p-3 text-right">총 결제 금액</th>
                  <th className="p-3 text-right">체결 시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((trade) => {
                  const pol = politicians.find(p => p.id === trade.politicianId);
                  const isBuy = trade.type === 'BUY';

                  return (
                    <tr 
                      key={trade.id} 
                      onClick={() => setSelectedPoliticianId(trade.politicianId)}
                      className="hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <td className="p-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-sans ${
                          isBuy 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>{isBuy ? '매수' : '매도'}</span>
                        </span>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="flex items-center space-x-2">
                          {pol && (
                            <PoliticianAvatar src={pol.imageUrl} name={pol.name} party={pol.party} className="w-6 h-6 rounded-md" />
                          )}
                          <span className="font-extrabold text-white text-xs">{trade.politicianName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold text-white">{trade.shares}주</td>
                      <td className="p-3 text-right text-slate-300">{formatPoints(trade.pricePerShare)}</td>
                      <td className="p-3 text-right font-extrabold text-amber-400">{formatPoints(trade.totalPoints)}</td>
                      <td className="p-3 text-right text-slate-500 text-[11px]">{trade.timestamp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">체결된 매매 거래 내역이 없습니다.</p>
          </div>
        )}
      </div>

    </div>
  );
};
