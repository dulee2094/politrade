import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { useTradingForm } from '../hooks/useTradingForm';
import { TradingChart } from './TradingChart';
import { OrderBookWidget } from './OrderBookWidget';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { X, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../../../config/constants';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { getMarketStatus } from '../../../core/trading/marketHours';

export const StockDetailModal: React.FC = () => {
  const { selectedPoliticianId, setSelectedPoliticianId, getPoliticianById, user } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'chart' | 'news'>('chart');

  if (!selectedPoliticianId) return null;
  const politician = getPoliticianById(selectedPoliticianId);
  if (!politician) return null;

  const mStatus = getMarketStatus();
  const isUp = politician.change24h >= 0;
  const userHolding = user.holdings[politician.id];
  const userShares = userHolding ? userHolding.shares : 0;
  const isIPO = politician.phase === 'IPO';

  const {
    tradeType,
    setTradeType,
    sharesInput,
    setSharesInput,
    buyQuote,
    sellQuote,
    handleExecuteOrder,
    feedback,
  } = useTradingForm(politician);

  const currentQuote = tradeType === 'BUY' ? buyQuote : sellQuote;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPoliticianId(null);
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-4">
            <PoliticianAvatar
              src={politician.imageUrl}
              name={politician.name}
              party={politician.party}
              className="w-14 h-14 rounded-2xl"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">{politician.name}</h2>
                <PartyBadge party={politician.party} />
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {politician.district}
                </span>
                {isIPO ? (
                  <span className="bg-indigo-600/30 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-mono font-bold">
                    Phase 1 공모 중 (10,000 P)
                  </span>
                ) : (
                  <span className="bg-emerald-600/30 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold">
                    Phase 2 호가창 시장
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{politician.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPoliticianId(null);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market Status Lock Banner if Closed */}
        {!mStatus.isOpen && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-bold">🔴 현재는 {BRAND_STOCK_NAME} 정규 장 마감 시간입니다.</span>
            </div>
            <span className="font-mono text-[11px] bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-500/30">
              정규장: 매일 12:00 ~ 14:00 ({mStatus.countdownText})
            </span>
          </div>
        )}

        {/* Main Content Grid: Chart/OrderBook & Trading Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: OrderBook / Chart & Info */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Phase Status OrderBook Widget */}
            <OrderBookWidget politician={politician} />

            {/* Price Cards Header */}
            <div className="grid grid-cols-3 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans">현재가</span>
                <div className="text-lg font-extrabold text-white">{formatPoints(politician.currentPrice)}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-sans">24시간 변동률</span>
                <div className={`text-base font-extrabold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{formatPercent(politician.change24h)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-sans">내 보유 수량</span>
                <div className="text-lg font-extrabold text-amber-400">{userShares} 주</div>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('chart')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeSubTab === 'chart' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                주가 추이 차트
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('news')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeSubTab === 'news' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                관련 뉴스 ({politician.news.length})
              </button>
            </div>

            {/* Chart / News Body */}
            {activeSubTab === 'chart' ? (
              <TradingChart
                data={politician.priceHistory}
                isUp={isUp}
                high24h={politician.high24h}
                low24h={politician.low24h}
              />
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {politician.news.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Order Form */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white">
                  {isIPO ? 'Phase 1 공모 청약' : 'Phase 2 호가 주문'}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isIPO ? '고정가 10,000 P' : '실시간 지정가 호가'}
                </span>
              </div>

              {/* Order Type Switch */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isIPO ? '공모 매수' : '매수 (Buy)'}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                    tradeType === 'SELL'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isIPO ? '공모 환불' : '매도 (Sell)'}
                </button>
              </div>

              {/* Share Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">주문 수량 (주)</label>
                <input
                  type="number"
                  min={1}
                  max={tradeType === 'SELL' ? userShares : 100}
                  value={sharesInput}
                  onChange={e => setSharesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quote Estimates */}
              <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">총 필요 포인트</span>
                  <span className="font-bold text-white text-sm">
                    {formatPoints(tradeType === 'BUY' ? buyQuote.totalCost : sellQuote.totalRefund)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">주당 체결가</span>
                  <span className="text-slate-300">{formatPoints(currentQuote.avgPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">가격 체결 방식</span>
                  <span className="text-indigo-400 font-bold font-sans">
                    {isIPO ? '10,000P 고정가' : '유저 실제 호가'}
                  </span>
                </div>
              </div>

              {/* Feedback messages */}
              {feedback && (
                <div className={`p-3 rounded-xl border text-xs ${
                  feedback.type === 'error'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  {feedback.message}
                </div>
              )}
            </div>

            {/* Execute Order Button (Locked during Off-Hours) */}
            <button
              type="button"
              onClick={handleExecuteOrder}
              disabled={!mStatus.isOpen}
              className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center justify-center space-x-1 ${
                !mStatus.isOpen
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : tradeType === 'BUY'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-500/20'
              }`}
            >
              {!mStatus.isOpen ? (
                <span>🔒 장 마감 (정규장: 매일 12:00 ~ 14:00)</span>
              ) : (
                <span>{politician.name} {BRAND_STOCK_NAME} {tradeType === 'BUY' ? (isIPO ? '공모 청약' : '매수하기') : '매도하기'}</span>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
