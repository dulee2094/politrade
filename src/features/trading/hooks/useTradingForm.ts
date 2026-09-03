import { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { calculateBuyQuote, calculateSellQuote } from '../../../core/amm/ammEngine';
import { matchOrderBook, INITIAL_IPO_PRICE } from '../../../core/orderbook/orderbookEngine';
import { Politician } from '../../../types';

export function useTradingForm(politician: Politician) {
  const { user, buyStock, sellStock } = useStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState<string>('1');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const userHolding = user.holdings[politician.id] || { shares: 0, avgPrice: 0, totalInvested: 0 };
  const sharesNum = parseInt(sharesInput, 10) || 0;

  const isIPO = politician.phase === 'IPO';

  // Calculations for Phase 1 vs Phase 2
  let buyQuote = calculateBuyQuote(politician.reserveMoney, politician.reserveShares, sharesNum);
  let sellQuote = calculateSellQuote(politician.reserveMoney, politician.reserveShares, sharesNum);

  if (isIPO) {
    buyQuote = {
      totalCost: sharesNum * INITIAL_IPO_PRICE,
      avgPrice: INITIAL_IPO_PRICE,
      spotPrice: INITIAL_IPO_PRICE,
      slippage: 0,
      priceImpact: 0,
      newSpotPrice: INITIAL_IPO_PRICE,
    };
    sellQuote = {
      totalRefund: sharesNum * INITIAL_IPO_PRICE,
      avgPrice: INITIAL_IPO_PRICE,
      spotPrice: INITIAL_IPO_PRICE,
      slippage: 0,
      priceImpact: 0,
      newSpotPrice: INITIAL_IPO_PRICE,
    };
  } else if (politician.orderBook) {
    const obMatchBuy = matchOrderBook(politician.orderBook, 'BUY', politician.currentPrice + 1000, sharesNum);
    const obMatchSell = matchOrderBook(politician.orderBook, 'SELL', Math.max(1, politician.currentPrice - 1000), sharesNum);
    
    buyQuote = {
      totalCost: obMatchBuy.totalCostOrRefund,
      avgPrice: obMatchBuy.avgExecutedPrice,
      spotPrice: politician.currentPrice,
      slippage: 0,
      priceImpact: 0,
      newSpotPrice: obMatchBuy.avgExecutedPrice,
    };

    sellQuote = {
      totalRefund: obMatchSell.totalCostOrRefund,
      avgPrice: obMatchSell.avgExecutedPrice,
      spotPrice: politician.currentPrice,
      slippage: 0,
      priceImpact: 0,
      newSpotPrice: obMatchSell.avgExecutedPrice,
    };
  }

  const handleExecuteOrder = () => {
    setFeedback(null);
    if (sharesNum <= 0) {
      setFeedback({ type: 'error', message: '수량을 1주 이상 입력해주세요.' });
      return;
    }

    if (tradeType === 'BUY') {
      const res = buyStock(politician.id, sharesNum);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else {
      const res = sellStock(politician.id, sharesNum);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }
  };

  return {
    tradeType,
    setTradeType,
    sharesInput,
    setSharesInput,
    buyQuote,
    sellQuote,
    handleExecuteOrder,
    feedback,
    userBalance: user.balance,
  };
}
