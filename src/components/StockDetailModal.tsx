import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateBuyQuote, calculateSellQuote, calculateMaxBuyShares } from '../utils/amm';
import { X, TrendingUp, TrendingDown, MessageSquare, Newspaper, Info, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const StockDetailModal: React.FC = () => {
  const { 
    selectedPoliticianId, 
    setSelectedPoliticianId, 
    getPoliticianById, 
    user, 
    buyStock, 
    sellStock, 
    comments, 
    addComment 
  } = useStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState<string>('1');
  const [commentInput, setCommentInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!selectedPoliticianId) return null;
  const pol = getPoliticianById(selectedPoliticianId);
  if (!pol) return null;

  const isUp = pol.change24h >= 0;
  const userHolding = user.holdings[pol.id] || { shares: 0, avgPrice: 0, totalInvested: 0 };

  const sharesNum = parseInt(sharesInput, 10) || 0;

  // AMM Quotes
  const buyQuote = calculateBuyQuote(pol.reserveMoney, pol.reserveShares, sharesNum);
  const sellQuote = calculateSellQuote(pol.reserveMoney, pol.reserveShares, sharesNum);
  const maxBuyShares = calculateMaxBuyShares(pol.reserveMoney, pol.reserveShares, user.balance);

  const handleOrder = () => {
    setFeedback(null);
    if (sharesNum <= 0) {
      setFeedback({ type: 'error', message: '수량을 1주 이상 입력해주세요.' });
      return;
    }

    if (tradeType === 'BUY') {
      const res = buyStock(pol.id, sharesNum);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else {
      const res = sellStock(pol.id, sharesNum);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }
  };

  const handlePercentClick = (pct: number) => {
    if (tradeType === 'BUY') {
      const targetShares = Math.floor(maxBuyShares * (pct / 100));
      setSharesInput(targetShares > 0 ? targetShares.toString() : '1');
    } else {
      const targetShares = Math.floor(userHolding.shares * (pct / 100));
      setSharesInput(targetShares > 0 ? targetShares.toString() : '1');
    }
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(pol.id, commentInput);
    setCommentInput('');
  };

  const polComments = comments.filter(c => c.politicianId === pol.id);

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
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-500/30">
                  {pol.party}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">{pol.district}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{pol.title}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedPoliticianId(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Chart, News, Discussion (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Price Banner */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">실시간 AMM 주가</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {pol.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">P</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">24H 변동률</span>
                <div className={`flex items-center justify-end space-x-1 font-mono font-bold text-base ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isUp ? '+' : ''}{pol.change24h}%</span>
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200">실시간 주가 추이 (P)</span>
                <span className="font-mono text-[11px]">24H 최고: {pol.high24h.toLocaleString()} P | 최저: {pol.low24h.toLocaleString()} P</span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pol.priceHistory}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} orientation="right" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()} P`, '주가']}
                    />
                    <Area type="monotone" dataKey="price" stroke={isUp ? '#10b981' : '#f43f5e'} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* News Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-400" />
                <span>관련 핫뉴스 및 이슈</span>
              </h3>
              <div className="space-y-2">
                {pol.news.map((item) => (
                  <div key={item.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between hover:bg-slate-800 transition-colors">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 hover:text-blue-400 cursor-pointer">{item.title}</h4>
                      <span className="text-[10px] text-slate-400">{item.source} • {item.time}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Room */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>종목 실시간 토론방</span>
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`${pol.name} 의원에 대한 의견을 남겨보세요...`}
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </form>

              {/* Comment Feed */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {polComments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">첫 번째 댓글을 작성해 보세요!</p>
                ) : (
                  polComments.map((cmt) => (
                    <div key={cmt.id} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img src={cmt.userAvatar} alt={cmt.userName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-bold text-slate-300">{cmt.userName}</span>
                          {cmt.holdingStatus === 'HOLDER' && (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30">
                              주주
                            </span>
                          )}
                          {cmt.holdingStatus === 'BUYER' && (
                            <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.2 rounded border border-blue-500/30">
                              매수자
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{cmt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300">{cmt.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: AMM Order Form (5 Cols) */}
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
                  <span className="text-amber-400 font-bold">{user.balance.toLocaleString()} P</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>보유 수량</span>
                  <span className="text-white font-bold">{userHolding.shares.toLocaleString()} 주</span>
                </div>
                {userHolding.shares > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>매수 평단가</span>
                    <span className="text-slate-300">{userHolding.avgPrice.toLocaleString()} P</span>
                  </div>
                )}
              </div>

              {/* Shares Input & Percent Buttons */}
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

                {/* Quick Percent Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => handlePercentClick(pct)}
                      className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-[11px] py-1 rounded-lg font-mono font-medium transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* AMM Quote Estimation Box */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 space-y-2 text-xs font-mono">
                <div className="text-slate-400 font-sans font-bold text-[11px] border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>AMM 시세 예상 견적</span>
                  <span className="text-blue-400 font-normal text-[10px]">Bonding Curve</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">{tradeType === 'BUY' ? '총 결제 포인트' : '총 환급 포인트'}</span>
                  <span className={`font-bold text-sm ${tradeType === 'BUY' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {tradeType === 'BUY' ? buyQuote.totalCost.toLocaleString() : sellQuote.totalRefund.toLocaleString()} P
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>평균 체결가</span>
                  <span>{tradeType === 'BUY' ? buyQuote.avgPrice.toLocaleString() : sellQuote.avgPrice.toLocaleString()} P</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>주가 영향도 (Price Impact)</span>
                  <span className={tradeType === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                    {tradeType === 'BUY' ? `+${buyQuote.priceImpact}%` : `${sellQuote.priceImpact}%`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>체결 후 예상 시가</span>
                  <span>{tradeType === 'BUY' ? buyQuote.newSpotPrice.toLocaleString() : sellQuote.newSpotPrice.toLocaleString()} P</span>
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

            {/* Execute Order Button */}
            <button
              onClick={handleOrder}
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
