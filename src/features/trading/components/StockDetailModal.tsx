import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { useTradingForm } from '../hooks/useTradingForm';
import { TradingChart } from './TradingChart';
import { NewsFeedList } from '../../news/components/NewsFeedList';
import { DiscussionSection } from '../../community/components/DiscussionSection';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { X, TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';

export const StockDetailModal: React.FC = () => {
  const { selectedPoliticianId, setSelectedPoliticianId, getPoliticianById } = useStore();

  if (!selectedPoliticianId) return null;
  const pol = getPoliticianById(selectedPoliticianId);
  if (!pol) return null;

  return <StockDetailModalContent pol={pol} onClose={() => setSelectedPoliticianId(null)} />;
};

const StockDetailModalContent: React.FC<{ pol: any; onClose: () => void }> = ({ pol, onClose }) => {
  const isUp = pol.change24h >= 0;

  const {
    tradeType,
    setTradeType,
    sharesInput,
    setSharesInput,
    sharesNum,
    userHolding,
    buyQuote,
    sellQuote,
    maxBuyShares,
    feedback,
    setFeedback,
    handleExecuteOrder,
    handlePercentSelect,
    userBalance,
  } = useTradingForm(pol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-4">
            <img
              src={pol.imageUrl}
              alt={pol.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{pol.name}</h1>
                <PartyBadge party={pol.party} />
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">{pol.district}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{pol.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Price Banner */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">실시간 AMM 주가</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {formatPoints(pol.currentPrice)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">24H 변동률</span>
                <div className={`flex items-center justify-end space-x-1 font-mono font-bold text-base ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{formatPercent(pol.change24h)}</span>
                </div>
              </div>
            </div>

            {/* Trading Chart */}
            <TradingChart data={pol.priceHistory} isUp={isUp} high24h={pol.high24h} low24h={pol.low24h} />

            {/* News List */}
            <NewsFeedList news={pol.news} />

            {/* Discussion Room */}
            <DiscussionSection politicianId={pol.id} politicianName={pol.name} />

          </div>

          {/* Right Column: Order Form */}
          <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Buy / Sell Tab Switch */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => { setTradeType('BUY'); setFeedback(null); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  매수 (Buy)
                </button>
                <button
                  onClick={() => { setTradeType('SELL'); setFeedback(null); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    tradeType === 'SELL'
                      ? 'bg-rose-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  매도 (Sell)
                </button>
              </div>

              {/* Balance & Holding Status */}
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>보유 가상머니</span>
                  <span className="text-amber-400 font-bold">{formatPoints(userBalance)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>보유 수량</span>
                  <span className="text-white font-bold">{userHolding.shares.toLocaleString()} 주</span>
                </div>
                {userHolding.shares > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>매수 평단가</span>
                    <span className="text-slate-300">{formatPoints(userHolding.avgPrice)}</span>
                  </div>
                )}
              </div>

              {/* Shares Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>{tradeType === 'BUY' ? '매수 수량' : '매도 수량'}</span>
                  <span className="text-slate-400 font-normal">
                    {tradeType === 'BUY' ? `최대 매수: ${maxBuyShares}주` : `최대 매도: ${userHolding.shares}주`}
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={sharesInput}
                    onChange={e => setSharesInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">주</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => handlePercentSelect(pct)}
                      className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-[11px] py-1 rounded-lg font-mono font-medium transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* AMM Quote Estimation */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 space-y-2 text-xs font-mono">
                <div className="text-slate-400 font-sans font-bold text-[11px] border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>AMM 시세 예상 견적</span>
                  <span className="text-blue-400 font-normal text-[10px]">Bonding Curve</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">{tradeType === 'BUY' ? '총 결제 포인트' : '총 환급 포인트'}</span>
                  <span className={`font-bold text-sm ${tradeType === 'BUY' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {tradeType === 'BUY' ? formatPoints(buyQuote.totalCost) : formatPoints(sellQuote.totalRefund)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>평균 체결가</span>
                  <span>{tradeType === 'BUY' ? formatPoints(buyQuote.avgPrice) : formatPoints(sellQuote.avgPrice)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>주가 영향도 (Price Impact)</span>
                  <span className={tradeType === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                    {tradeType === 'BUY' ? `+${buyQuote.priceImpact}%` : `${sellQuote.priceImpact}%`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>체결 후 예상 시가</span>
                  <span>{tradeType === 'BUY' ? formatPoints(buyQuote.newSpotPrice) : formatPoints(sellQuote.newSpotPrice)}</span>
                </div>
              </div>

              {/* Feedback Toast */}
              {feedback && (
                <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  feedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedback.message}</span>
                </div>
              )}

            </div>

            {/* Order Execute Button */}
            <button
              onClick={handleExecuteOrder}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center space-x-2 ${
                tradeType === 'BUY'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-rose-500/20'
              }`}
            >
              <span>{pol.name} {sharesNum}주 {tradeType === 'BUY' ? '매수하기' : '매도하기'}</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
