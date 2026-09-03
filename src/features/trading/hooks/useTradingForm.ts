import { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { calculateBuyQuote, calculateSellQuote, calculateMaxBuyShares } from '../../../core/amm/ammEngine';
import { Politician } from '../../../types';

export function useTradingForm(politician: Politician) {
  const { user, buyStock, sellStock } = useStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState<string>('1');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const userHolding = user.holdings[politician.id] || { shares: 0, avgPrice: 0, totalInvested: 0 };
  const sharesNum = parseInt(sharesInput, 10) || 0;

  const buyQuote = calculateBuyQuote(politician.reserveMoney, politician.reserveShares, sharesNum);
  const sellQuote = calculateSellQuote(politician.reserveMoney, politician.reserveShares, sharesNum);
  const maxBuyShares = calculateMaxBuyShares(politician.reserveMoney, politician.reserveShares, user.balance);

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

  const handlePercentSelect = (pct: number) => {
    if (tradeType === 'BUY') {
      const targetShares = Math.floor(maxBuyShares * (pct / 100));
      setSharesInput(targetShares > 0 ? targetShares.toString() : '1');
    } else {
      const targetShares = Math.floor(userHolding.shares * (pct / 100));
      setSharesInput(targetShares > 0 ? targetShares.toString() : '1');
    }
  };

  return {
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
    userBalance: user.balance,
  };
}
