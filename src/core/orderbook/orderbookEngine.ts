import { LimitOrder, OrderBookSnapshot, OrderBookLevel } from './orderbookTypes';

export const INITIAL_IPO_PRICE = 10000;
export const INITIAL_IPO_TARGET_SHARES = 10; // 10 shares for quick testing!

export function generateMockOrderBook(currentPrice: number): OrderBookSnapshot {
  const basePrice = Math.max(1000, currentPrice || 10000);
  
  const asks: OrderBookLevel[] = [
    { price: basePrice + 400, shares: 12, totalPoints: (basePrice + 400) * 12 },
    { price: basePrice + 300, shares: 8, totalPoints: (basePrice + 300) * 8 },
    { price: basePrice + 200, shares: 6, totalPoints: (basePrice + 200) * 6 },
    { price: basePrice + 100, shares: 4, totalPoints: (basePrice + 100) * 4 },
    { price: basePrice + 50, shares: 2, totalPoints: (basePrice + 50) * 2 },
  ];

  const bids: OrderBookLevel[] = [
    { price: basePrice - 50, shares: 3, totalPoints: (basePrice - 50) * 3 },
    { price: basePrice - 100, shares: 5, totalPoints: (basePrice - 100) * 5 },
    { price: basePrice - 200, shares: 9, totalPoints: (basePrice - 200) * 9 },
    { price: basePrice - 300, shares: 11, totalPoints: (basePrice - 300) * 11 },
    { price: basePrice - 400, shares: 15, totalPoints: (basePrice - 400) * 15 },
  ];

  return { asks, bids };
}

export function matchOrderBook(
  orderBook: OrderBookSnapshot,
  orderType: 'BUY' | 'SELL',
  targetPrice: number,
  targetShares: number
): {
  executedShares: number;
  avgExecutedPrice: number;
  totalCostOrRefund: number;
  updatedOrderBook: OrderBookSnapshot;
} {
  let remainingSharesToFill = targetShares;
  let totalCostOrRefund = 0;
  let executedShares = 0;

  const safeOrderBook = orderBook || generateMockOrderBook(targetPrice);
  const newAsks = Array.isArray(safeOrderBook.asks) ? safeOrderBook.asks.map(a => ({ ...a })) : generateMockOrderBook(targetPrice).asks;
  const newBids = Array.isArray(safeOrderBook.bids) ? safeOrderBook.bids.map(b => ({ ...b })) : generateMockOrderBook(targetPrice).bids;

  if (orderType === 'BUY') {
    // Match against Asks (lowest ask first)
    for (let i = newAsks.length - 1; i >= 0; i--) {
      const ask = newAsks[i];
      if (ask && ask.price <= targetPrice && remainingSharesToFill > 0) {
        const fillQty = Math.min(remainingSharesToFill, ask.shares);
        executedShares += fillQty;
        totalCostOrRefund += fillQty * ask.price;
        remainingSharesToFill -= fillQty;
        ask.shares -= fillQty;
        ask.totalPoints = ask.price * ask.shares;
      }
    }
  } else {
    // Match against Bids (highest bid first)
    for (let i = 0; i < newBids.length; i++) {
      const bid = newBids[i];
      if (bid && bid.price >= targetPrice && remainingSharesToFill > 0) {
        const fillQty = Math.min(remainingSharesToFill, bid.shares);
        executedShares += fillQty;
        totalCostOrRefund += fillQty * bid.price;
        remainingSharesToFill -= fillQty;
        bid.shares -= fillQty;
        bid.totalPoints = bid.price * bid.shares;
      }
    }
  }

  // Filter out emptied levels
  const filteredAsks = newAsks.filter(a => a && a.shares > 0);
  const filteredBids = newBids.filter(b => b && b.shares > 0);

  const avgExecutedPrice = executedShares > 0 ? Math.round(totalCostOrRefund / executedShares) : targetPrice;

  return {
    executedShares,
    avgExecutedPrice,
    totalCostOrRefund,
    updatedOrderBook: {
      asks: filteredAsks,
      bids: filteredBids,
    },
  };
}
