import { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import { INITIAL_IPO_PRICE } from '../../../core/orderbook/orderbookEngine';
import { Politician } from '../../../types';

export function useTradingForm(politician?: Politician) {
  const { user, placeOrder, cancelOrder } = useStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderClass, setOrderClass] = useState<'LIMIT'>('LIMIT');
  const [sharesInput, setSharesInput] = useState<string>('1');
  const [priceInput, setPriceInput] = useState<string>(
    politician?.currentPrice ? politician.currentPrice.toString() : INITIAL_IPO_PRICE.toString()
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
  const spotPrice = politician?.currentPrice || INITIAL_IPO_PRICE;
  const priceNum = Math.max(100, parseInt(priceInput, 10) || spotPrice);

  const isIPO = politician?.phase === 'IPO';

  // Calculate Quotes (Strict Limit Order Pricing)
  let estimatedCostOrRefund = 0;
  let estimatedAvgPrice = spotPrice;

  if (isIPO) {
    estimatedCostOrRefund = sharesNum * INITIAL_IPO_PRICE;
    estimatedAvgPrice = INITIAL_IPO_PRICE;
  } else {
    estimatedCostOrRefund = sharesNum * priceNum;
    estimatedAvgPrice = priceNum;
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
    if (priceNum <= 0) {
      setFeedback({ type: 'error', message: '올바른 주문 가격을 입력해주세요.' });
      return;
    }

    const res = placeOrder(
      politician.id,
      'LIMIT',
      tradeType,
      priceNum,
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
