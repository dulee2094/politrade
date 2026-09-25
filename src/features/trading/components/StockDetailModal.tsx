import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { useTradingForm } from '../hooks/useTradingForm';
import { TradingChart } from './TradingChart';
import { OrderBookWidget } from './OrderBookWidget';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { X, TrendingUp, TrendingDown, Lock, Clock, Trash2, ArrowUpRight, ArrowDownRight, Layers, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../../../config/constants';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { getMarketStatus } from '../../../core/trading/marketHours';

export const StockDetailModal: React.FC = () => {
  // 1. ALL React Hooks MUST execute unconditionally at the top level
  const { selectedPoliticianId, setSelectedPoliticianId, getPoliticianById, user, placeOrder } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'chart' | 'news' | 'openOrders'>('chart');

  // 2-Step Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ success: boolean; message: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const politician = selectedPoliticianId ? getPoliticianById(selectedPoliticianId) : undefined;

  const {
    tradeType,
    setTradeType,
    orderClass,
    setOrderClass,
    sharesInput,
    setSharesInput,
    priceInput,
    setPriceInput,
    handleSelectPrice,
    estimatedCostOrRefund,
    estimatedAvgPrice,
    cancelOrder,
    feedback,
    openOrders,
  } = useTradingForm(politician);

  // 2. Early return AFTER all hooks have executed
  if (!selectedPoliticianId || !politician) return null;

  const mStatus = getMarketStatus();
  const change24h = typeof politician.change24h === 'number' ? politician.change24h : 0;
  const currentPrice = typeof politician.currentPrice === 'number' ? politician.currentPrice : 10000;
  const high24h = typeof politician.high24h === 'number' ? politician.high24h : currentPrice;
  const low24h = typeof politician.low24h === 'number' ? politician.low24h : currentPrice;
  const isUp = change24h >= 0;
  const userHoldingsMap = user?.holdings || {};
  const userHolding = userHoldingsMap[politician.id];
  const userShares = userHolding ? userHolding.shares : 0;
  const isIPO = politician.phase === 'IPO';

  const newsList = Array.isArray(politician.news) ? politician.news : [];
  const priceHistoryData = Array.isArray(politician.priceHistory) ? politician.priceHistory : [];

  // Filter open orders for current politician
  const polOpenOrders = openOrders.filter(o => o.politicianId === politician.id);

  const priceNum = parseInt(priceInput, 10) || currentPrice;

  const adjustPrice = (delta: number) => {
    const nextP = Math.max(100, priceNum + delta);
    setPriceInput(nextP.toString());
  };

  const handleOrderInitiate = (selectedType: 'BUY' | 'SELL') => {
    setValidationError(null);
    if (!politician) return;
    setTradeType(selectedType);

    const sharesNum = parseInt(sharesInput, 10) || 0;
    if (sharesNum <= 0) {
      setValidationError('주문 수량을 1주 이상 입력해주세요.');
      return;
    }

    const targetPrice = orderClass === 'LIMIT' ? priceNum : currentPrice;
    if (orderClass === 'LIMIT' && targetPrice <= 0) {
      setValidationError('올바른 주문 가격을 입력해주세요.');
      return;
    }

    if (isIPO) {
      if (selectedType === 'BUY') {
        const totalCost = sharesNum * 10000;
        if (user.balance < totalCost) {
          setValidationError(`포인트가 부족합니다. (필요: ${totalCost.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)`);
          return;
        }
      } else {
        if (userShares < sharesNum) {
          setValidationError('매도 가능한 보유 주식이 부족합니다.');
          return;
        }
      }
    } else {
      if (selectedType === 'BUY') {
        const totalCost = targetPrice * sharesNum;
        if (user.balance < totalCost) {
          setValidationError(`포인트가 부족합니다. (필요: ${totalCost.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)`);
          return;
        }
      } else {
        const lockedSellShares = (user.openOrders || [])
          .filter(o => o.politicianId === politician.id && o.type === 'SELL')
          .reduce((acc, o) => acc + o.remainingShares, 0);
        const availableShares = userShares - lockedSellShares;
        if (availableShares < sharesNum) {
          setValidationError(`매도 가능한 보유 주식이 부족합니다. (가능: ${availableShares}주 / 주문: ${sharesNum}주)`);
          return;
        }
      }
    }

    // Pre-validation passed -> open confirmation modal
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmOpen(false);
    if (!politician) return;

    const sharesNum = Math.max(1, parseInt(sharesInput, 10) || 1);
    const targetPrice = orderClass === 'LIMIT' ? priceNum : currentPrice;

    const res = placeOrder(
      politician.id,
      orderClass,
      tradeType,
      targetPrice,
      sharesNum
    );

    setResultInfo(res);
    setIsResultOpen(true);
  };

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
                    Phase 2 실시간 호가 시장
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
            
            {/* Phase Status OrderBook Widget with Price Select Callback */}
            <OrderBookWidget politician={politician} onSelectPrice={handleSelectPrice} />

            {/* Price Cards Header */}
            <div className="grid grid-cols-3 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans">현재가</span>
                <div className="text-lg font-extrabold text-white">{formatPoints(politician.currentPrice || 10000)}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-sans">24시간 변동률</span>
                <div className={`text-base font-extrabold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{formatPercent(politician.change24h || 0)}</span>
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
                관련 뉴스 ({newsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('openOrders')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                  activeSubTab === 'openOrders' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>미체결 주문</span>
                {polOpenOrders.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {polOpenOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* SubTab Body */}
            {activeSubTab === 'chart' && (
              <TradingChart
                data={priceHistoryData}
                isUp={isUp}
                high24h={high24h}
                low24h={low24h}
              />
            )}

            {activeSubTab === 'news' && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {newsList.map((item) => (
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

            {activeSubTab === 'openOrders' && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {polOpenOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-slate-800/40 rounded-xl border border-slate-700/40">
                    대기 중인 미체결 주문이 없습니다.
                  </div>
                ) : (
                  polOpenOrders.map((ord) => (
                    <div key={ord.id} className="p-3 bg-slate-800/90 rounded-xl border border-slate-700/80 flex items-center justify-between font-mono text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            ord.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {ord.type === 'BUY' ? '매수 지정가' : '매도 지정가'}
                          </span>
                          <span className="text-white font-bold">{formatPoints(ord.price)}</span>
                          <span className="text-slate-400 text-[11px]">{ord.remainingShares}주 대기</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          주문 시각: {ord.createdAt} | 상태: {ord.status === 'PARTIALLY_FILLED' ? '부분 체결' : '체결 대기'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => cancelOrder(ord.id)}
                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 rounded-lg border border-rose-500/30 text-xs font-sans font-bold flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>주문 취소</span>
                      </button>
                    </div>
                  ))
                )}
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
                  {isIPO ? '고정가 10,000 P' : '지정가 / 시장가 선택'}
                </span>
              </div>

              {/* Order Class Switcher (Limit vs Market) - Only in Phase 2 */}
              {!isIPO && (
                <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setOrderClass('LIMIT')}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderClass === 'LIMIT'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎯 지정가 (Limit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderClass('MARKET')}
                    className={`py-1.5 rounded-lg transition-all ${
                      orderClass === 'MARKET'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ 시장가 (Market)
                  </button>
                </div>
              )}

              {/* Order Execution Action Buttons (Buy Order vs Sell Order) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOrderInitiate('BUY')}
                  disabled={!mStatus.isOpen}
                  className={`py-3 px-2 rounded-xl font-sans font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-1 ${
                    !mStatus.isOpen
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : tradeType === 'BUY'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 ring-2 ring-emerald-400/50'
                      : 'bg-emerald-700/80 hover:bg-emerald-600 text-white opacity-90'
                  }`}
                >
                  <span>
                    {!mStatus.isOpen
                      ? '🔒 매수 (장마감)'
                      : isIPO
                      ? '공모 청약 주문하기'
                      : `${orderClass === 'LIMIT' ? '지정가' : '시장가'} 매수 주문하기`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOrderInitiate('SELL')}
                  disabled={!mStatus.isOpen}
                  className={`py-3 px-2 rounded-xl font-sans font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-1 ${
                    !mStatus.isOpen
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : tradeType === 'SELL'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20 ring-2 ring-rose-400/50'
                      : 'bg-rose-700/80 hover:bg-rose-600 text-white opacity-90'
                  }`}
                >
                  <span>
                    {!mStatus.isOpen
                      ? '🔒 매도 (장마감)'
                      : isIPO
                      ? '공모 환불 주문하기'
                      : `${orderClass === 'LIMIT' ? '지정가' : '시장가'} 매도 주문하기`}
                  </span>
                </button>
              </div>

              {/* Order Price Input (Visible when Limit Order in Phase 2) */}
              {!isIPO && orderClass === 'LIMIT' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>주문 가격 (P)</span>
                    <span className="text-[10px] text-slate-400 font-sans">💡 호가 클릭 시 자동 채움</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      step={50}
                      value={priceInput}
                      onChange={e => setPriceInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => adjustPrice(-100)}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 font-mono text-xs"
                      >
                        -100
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustPrice(100)}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 font-mono text-xs"
                      >
                        +100
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Share Amount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>주문 수량 (주)</span>
                  <span
                    onClick={() => setSharesInput(userShares.toString())}
                    className="text-[10px] text-amber-400 cursor-pointer hover:underline font-sans"
                  >
                    최대 ({userShares}주)
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={tradeType === 'SELL' ? userShares : 1000}
                  value={sharesInput}
                  onChange={e => setSharesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quote Estimates */}
              <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">총 {tradeType === 'BUY' ? '필요 포인트' : '예상 환불액'}</span>
                  <span className="font-bold text-white text-sm">
                    {formatPoints(estimatedCostOrRefund)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">주당 체결가</span>
                  <span className="text-slate-300">{formatPoints(estimatedAvgPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">가격 체결 방식</span>
                  <span className="text-indigo-400 font-bold font-sans">
                    {isIPO
                      ? '10,000P 고정가'
                      : orderClass === 'LIMIT'
                      ? '지정가 체결 / 미체결 잔량 호가 등록'
                      : '실시간 시장가 체결'}
                  </span>
                </div>
              </div>

              {/* Validation & Feedback messages */}
              {(validationError || feedback) && (
                <div className={`p-3 rounded-xl border text-xs font-sans font-bold ${
                  (validationError || feedback?.type === 'error')
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  {validationError || feedback?.message}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 1. Order Confirmation Modal Overlay */}
      {isConfirmOpen && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl text-slate-100 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">주문 제출 전 최종 확인</h3>
                <p className="text-xs text-slate-400">아래 내용을 확인하신 후 주문을 최종 제출하세요.</p>
              </div>
            </div>

            {/* Target Politician & Trade Info */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between font-sans">
                <span className="text-slate-400 text-xs font-medium">대상 주식</span>
                <div className="flex items-center space-x-2">
                  <PoliticianAvatar src={politician.imageUrl} name={politician.name} party={politician.party} className="w-6 h-6 rounded-lg" />
                  <span className="font-extrabold text-white text-sm">{politician.name} POLI주식</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-700/50 pt-2 font-sans">
                <span className="text-slate-400 text-xs font-medium">주문 구분</span>
                <span className={`px-2.5 py-1 rounded-md font-extrabold text-xs ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {isIPO
                    ? tradeType === 'BUY' ? '공모 청약 주문' : '공모 환불 주문'
                    : `${orderClass === 'LIMIT' ? '지정가' : '시장가'} ${tradeType === 'BUY' ? '매수' : '매도'} 주문`}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-700/50 pt-2">
                <span className="text-slate-400 font-sans">주문 단가</span>
                <span className="font-bold text-white">
                  {isIPO ? '10,000 P (고정가)' : orderClass === 'LIMIT' ? `${formatPoints(parseInt(priceInput, 10) || currentPrice)}` : '실시간 시장가'}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-700/50 pt-2">
                <span className="text-slate-400 font-sans">주문 수량</span>
                <span className="font-bold text-amber-400">{sharesInput} 주</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-700/50 pt-2 text-sm font-bold">
                <span className="text-slate-300 font-sans">총 {tradeType === 'BUY' ? '필요 포인트' : '예상 환불액'}</span>
                <span className="text-emerald-400 font-extrabold">{formatPoints(estimatedCostOrRefund)}</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 text-center font-medium font-sans">
              💡 위 내용으로 매매 주문을 최종 제출하시겠습니까?
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 font-sans">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-colors border border-slate-700"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className={`py-3 rounded-xl font-extrabold text-xs transition-all shadow-lg text-white ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                }`}
              >
                확인 및 주문 제출
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Order Result Modal Overlay */}
      {isResultOpen && resultInfo && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl text-slate-100 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className={`p-2.5 rounded-xl border ${
                resultInfo.success
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-600/20 text-rose-400 border-rose-500/30'
              }`}>
                {resultInfo.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {resultInfo.success ? '주문 처리 결과 안내' : '주문 처리 실패'}
                </h3>
                <p className="text-xs text-slate-400">
                  {resultInfo.success ? '요청하신 주문이 정상 처리되었습니다.' : '주문 처리 중 오류가 발생하였습니다.'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
              resultInfo.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}>
              <p className="font-bold text-sm mb-1">{resultInfo.message}</p>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 font-mono text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span>현재 보유 포인트</span>
                <span className="font-bold text-amber-400">{formatPoints(user?.balance || 0)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{politician.name} 보유 수량</span>
                <span className="font-bold text-white">{userShares} 주</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsResultOpen(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-blue-600/20 transition-all font-sans"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
