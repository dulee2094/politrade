import { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import { executeOrderBookMatch, generateMockOrderBook, INITIAL_IPO_PRICE } from '../../../core/orderbook/orderbookEngine';
import { Politician } from '../../../types';

export function useTradingForm(politician?: Politician) {
  const { user, placeOrder, cancelOrder } = useStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderClass, setOrderClass] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [sharesInput, setSharesInput] = useState<string>('1');
  const [priceInput, setPriceInput] = useState<string>(
    politician?.currentPrice ? politician.currentPrice.toString() : '10000'
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Update priceInput when politician changes
  useEffect(() => {
    if (politician?.currentPrice) {
      setPriceInput(politician.currentPrice.toString());
    }
  }, [politician?.id, politician?.currentPrice]);

  const userHoldingsMap = user?.holdings || {};
  const userHolding = (politician?.id && userHoldingsMap[politician.id]) || { shares: 0, avgPrice: 0, totalInvested: 0 };
  const sharesNum = Math.max(1, parseInt(sharesInput, 10) || 1);
  const spotPrice = politician?.currentPrice || 10000;
  const priceNum = Math.max(100, parseInt(priceInput, 10) || spotPrice);

  const isIPO = politician?.phase === 'IPO';

  // Calculate Quotes
  let estimatedCostOrRefund = 0;
  let estimatedAvgPrice = spotPrice;

  if (isIPO) {
    estimatedCostOrRefund = sharesNum * INITIAL_IPO_PRICE;
    estimatedAvgPrice = INITIAL_IPO_PRICE;
  } else if (orderClass === 'LIMIT') {
    estimatedCostOrRefund = sharesNum * priceNum;
    estimatedAvgPrice = priceNum;
  } else {
    // MARKET order preview
    const safeOrderBook = politician?.orderBook || generateMockOrderBook(spotPrice);
    const matchRes = executeOrderBookMatch(safeOrderBook, 'MARKET', tradeType, spotPrice, sharesNum);
    estimatedCostOrRefund = matchRes.totalCostOrRefund || (sharesNum * spotPrice);
    estimatedAvgPrice = matchRes.avgExecutedPrice || spotPrice;
  }

  const handleSelectPrice = (price: number) => {
    setPriceInput(price.toString());
    setOrderClass('LIMIT');
  };

  const handleExecuteOrder = () => {
    setFeedback(null);
    if (!politician) return;
    if (sharesNum <= 0) {
      setFeedback({ type: 'error', message: '수량을 1주 이상 입력해주세요.' });
      return;
    }
    if (orderClass === 'LIMIT' && priceNum <= 0) {
      setFeedback({ type: 'error', message: '올바른 주문 가격을 입력해주세요.' });
      return;
    }

    const res = placeOrder(
      politician.id,
      orderClass,
      tradeType,
      orderClass === 'LIMIT' ? priceNum : spotPrice,
      sharesNum
    );

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return {
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
    handleExecuteOrder,
    cancelOrder,
    feedback,
    userBalance: user?.balance || 0,
    openOrders: user?.openOrders || [],
  };
}
