import { LimitOrder, OrderBookSnapshot, OrderBookLevel } from './orderbookTypes';

export const INITIAL_IPO_PRICE = 10000;
export const INITIAL_IPO_TARGET_SHARES = 1000;

export function generateMockOrderBook(currentPrice: number): OrderBookSnapshot {
  const basePrice = Math.max(1000, currentPrice);
  
  const asks: OrderBookLevel[] = [
    { price: basePrice + 400, shares: 120, totalPoints: (basePrice + 400) * 120 },
    { price: basePrice + 300, shares: 85, totalPoints: (basePrice + 300) * 85 },
    { price: basePrice + 200, shares: 60, totalPoints: (basePrice + 200) * 60 },
    { price: basePrice + 100, shares: 45, totalPoints: (basePrice + 100) * 45 },
    { price: basePrice + 50, shares: 20, totalPoints: (basePrice + 50) * 20 },
  ];

  const bids: OrderBookLevel[] = [
    { price: basePrice - 50, shares: 30, totalPoints: (basePrice - 50) * 30 },
    { price: basePrice - 100, shares: 55, totalPoints: (basePrice - 100) * 55 },
    { price: basePrice - 200, shares: 90, totalPoints: (basePrice - 200) * 90 },
    { price: basePrice - 300, shares: 110, totalPoints: (basePrice - 300) * 110 },
    { price: basePrice - 400, shares: 150, totalPoints: (basePrice - 400) * 150 },
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

  const newAsks = [...orderBook.asks];
  const newBids = [...orderBook.bids];

  if (orderType === 'BUY') {
    // Match against Asks (lowest ask first)
    for (let i = newAsks.length - 1; i >= 0; i--) {
      const ask = newAsks[i];
      if (ask.price <= targetPrice && remainingSharesToFill > 0) {
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
      if (bid.price >= targetPrice && remainingSharesToFill > 0) {
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
  const filteredAsks = newAsks.filter(a => a.shares > 0);
  const filteredBids = newBids.filter(b => b.shares > 0);

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
