import React from 'react';
import { Politician } from '../../../types';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { Layers, CheckCircle2, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { INITIAL_IPO_PRICE } from '../../../core/orderbook/orderbookEngine';

interface OrderBookWidgetProps {
  politician: Politician;
}

export const OrderBookWidget: React.FC<OrderBookWidgetProps> = ({ politician }) => {
  const isIPO = politician.phase === 'IPO';
  
  const targetShares = politician.ipoTargetShares || 10;
  const soldShares = politician.ipoSoldShares || 0;
  const ipoPct = Math.min(100, Math.round((soldShares / targetShares) * 100));

  if (isIPO) {
    return (
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/40 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md font-mono">
              PHASE 1
            </span>
            <span className="text-xs font-bold text-white">공모가 정액 청약 단계</span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">공모가 10,000 P / 주</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>공모 달성률 ({ipoPct}%)</span>
            <span className="font-bold text-white">{soldShares} / {targetShares} 주</span>
          </div>
          
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${ipoPct}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          💡 총 10주 공모 물량이 100% 완판되면 유저간 **실시간 실제 지정가 호가창 매매(Phase 2)** 시장으로 즉시 상장 전환됩니다!
        </p>
      </div>
    );
  }

  // Phase 2: Order Book Matrix
  const orderBook = politician?.orderBook || { asks: [], bids: [] };
  const asks = Array.isArray(orderBook.asks) ? orderBook.asks.filter(a => a && typeof a.price === 'number') : [];
  const bids = Array.isArray(orderBook.bids) ? orderBook.bids.filter(b => b && typeof b.price === 'number') : [];

  return (
    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 font-sans font-extrabold text-white">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>실시간 5단계 호가창 (Phase 2)</span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-md font-mono border border-emerald-500/30">
          실제 호가 체결
        </span>
      </div>

      <div className="space-y-1">
        {/* Asks (Sell Orders - Red) */}
        {asks.slice().reverse().map((ask, i) => (
          <div key={'ask_' + i} className="flex items-center justify-between p-1.5 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors">
            <span className="text-[10px] text-rose-400 font-sans">매도 {asks.length - i}</span>
            <span className="font-bold">{formatPoints(ask.price)}</span>
            <span className="text-[11px] text-slate-300">{ask.shares}주</span>
          </div>
        ))}

        {/* Current Price Banner */}
        <div className="p-2 my-1 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-white font-bold">
          <span className="text-[10px] font-sans text-slate-400">현재 체결가</span>
          <span className="text-sm font-mono text-amber-400">{formatPoints(politician.currentPrice || 10000)}</span>
        </div>

        {/* Bids (Buy Orders - Green) */}
        {bids.map((bid, i) => (
          <div key={'bid_' + i} className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors">
            <span className="text-[10px] text-emerald-400 font-sans">매수 {i + 1}</span>
            <span className="font-bold">{formatPoints(bid.price)}</span>
            <span className="text-[11px] text-slate-300">{bid.shares}주</span>
          </div>
        ))}
      </div>
    </div>
  );
};
