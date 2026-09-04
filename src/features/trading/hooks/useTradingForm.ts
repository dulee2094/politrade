import { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { calculateBuyQuote, calculateSellQuote } from '../../../core/amm/ammEngine';
import { matchOrderBook, generateMockOrderBook, INITIAL_IPO_PRICE } from '../../../core/orderbook/orderbookEngine';
import { Politician } from '../../../types';

export function useTradingForm(politician: Politician) {
  const { user, buyStock, sellStock } = useStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState<string>('1');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const userHoldingsMap = user?.holdings || {};
  const userHolding = userHoldingsMap[politician?.id || ''] || { shares: 0, avgPrice: 0, totalInvested: 0 };
  const sharesNum = Math.max(1, parseInt(sharesInput, 10) || 1);

  const isIPO = politician?.phase === 'IPO';

  // Default Quotes
  let buyQuote = {
    totalCost: sharesNum * INITIAL_IPO_PRICE,
    avgPrice: INITIAL_IPO_PRICE,
    spotPrice: INITIAL_IPO_PRICE,
    slippage: 0,
    priceImpact: 0,
    newSpotPrice: INITIAL_IPO_PRICE,
  };

  let sellQuote = {
    totalRefund: sharesNum * INITIAL_IPO_PRICE,
    avgPrice: INITIAL_IPO_PRICE,
    spotPrice: INITIAL_IPO_PRICE,
    slippage: 0,
    priceImpact: 0,
    newSpotPrice: INITIAL_IPO_PRICE,
  };

  try {
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
    } else {
      const safeOrderBook = politician?.orderBook || generateMockOrderBook(politician?.currentPrice || 10000);
      const obMatchBuy = matchOrderBook(safeOrderBook, 'BUY', (politician?.currentPrice || 10000) + 1000, sharesNum);
      const obMatchSell = matchOrderBook(safeOrderBook, 'SELL', Math.max(1, (politician?.currentPrice || 10000) - 1000), sharesNum);
      
      buyQuote = {
        totalCost: obMatchBuy.totalCostOrRefund,
        avgPrice: obMatchBuy.avgExecutedPrice,
        spotPrice: politician?.currentPrice || 10000,
        slippage: 0,
        priceImpact: 0,
        newSpotPrice: obMatchBuy.avgExecutedPrice,
      };

      sellQuote = {
        totalRefund: obMatchSell.totalCostOrRefund,
        avgPrice: obMatchSell.avgExecutedPrice,
        spotPrice: politician?.currentPrice || 10000,
        slippage: 0,
        priceImpact: 0,
        newSpotPrice: obMatchSell.avgExecutedPrice,
      };
    }
  } catch (e) {
    /* Safe fallback quotes */
  }

  const handleExecuteOrder = () => {
    setFeedback(null);
    if (!politician) return;
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
    userBalance: user?.balance || 0,
  };
}
