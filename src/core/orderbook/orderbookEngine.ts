import { LimitOrder, OrderBookSnapshot, OrderBookLevel } from './orderbookTypes';

export const INITIAL_IPO_PRICE = 50000;
export const INITIAL_IPO_TARGET_SHARES = 10; // 10 shares for testing

export const TICK_INTERVAL = 1000;

/**
 * Generates initial 5-level mock orderbook around current price.
 * Asks: sorted ascending by price (lowest ask first)
 * Bids: sorted descending by price (highest bid first)
 */
export function generateMockOrderBook(currentPrice: number): OrderBookSnapshot {
  const basePrice = Math.max(TICK_INTERVAL, currentPrice || INITIAL_IPO_PRICE);
  
  const asks: OrderBookLevel[] = [
    { price: basePrice + 1000, shares: 1, totalPoints: (basePrice + 1000) * 1 },
    { price: basePrice + 2000, shares: 1, totalPoints: (basePrice + 2000) * 1 },
    { price: basePrice + 3000, shares: 2, totalPoints: (basePrice + 3000) * 2 },
    { price: basePrice + 4000, shares: 1, totalPoints: (basePrice + 4000) * 1 },
    { price: basePrice + 5000, shares: 1, totalPoints: (basePrice + 5000) * 1 },
  ];

  const bids: OrderBookLevel[] = [
    { price: Math.max(TICK_INTERVAL, basePrice - 1000), shares: 1, totalPoints: Math.max(TICK_INTERVAL, basePrice - 1000) * 1 },
    { price: Math.max(TICK_INTERVAL, basePrice - 2000), shares: 2, totalPoints: Math.max(TICK_INTERVAL, basePrice - 2000) * 2 },
    { price: Math.max(TICK_INTERVAL, basePrice - 3000), shares: 1, totalPoints: Math.max(TICK_INTERVAL, basePrice - 3000) * 1 },
    { price: Math.max(TICK_INTERVAL, basePrice - 4000), shares: 1, totalPoints: Math.max(TICK_INTERVAL, basePrice - 4000) * 1 },
    { price: Math.max(TICK_INTERVAL, basePrice - 5000), shares: 1, totalPoints: Math.max(TICK_INTERVAL, basePrice - 5000) * 1 },
  ];

  return { asks, bids };
}

export function ensureMinOrderBookLevels(orderBook: OrderBookSnapshot, currentPrice: number): OrderBookSnapshot {
  const basePrice = Math.max(TICK_INTERVAL, currentPrice || INITIAL_IPO_PRICE);
  
  // Clean & sort asks ascending by price (only keep positive shares)
  let asks = Array.isArray(orderBook?.asks)
    ? orderBook.asks.filter(a => a && typeof a.price === 'number' && a.shares > 0).map(a => ({ ...a }))
    : [];
  asks.sort((a, b) => a.price - b.price);

  // Clean & sort bids descending by price (only keep positive shares)
  let bids = Array.isArray(orderBook?.bids)
    ? orderBook.bids.filter(b => b && typeof b.price === 'number' && b.shares > 0).map(b => ({ ...b }))
    : [];
  bids.sort((a, b) => b.price - a.price);

  // If asks < 5 levels, append missing levels starting above the highest existing ask
  if (asks.length < 5) {
    const existingPrices = new Set(asks.map(a => a.price));
    let startPrice = asks.length > 0 ? asks[asks.length - 1].price : basePrice;
    let nextOffset = TICK_INTERVAL;
    while (asks.length < 5) {
      let p = startPrice + nextOffset;
      if (!existingPrices.has(p)) {
        asks.push({ price: p, shares: 1, totalPoints: p * 1 });
        existingPrices.add(p);
      }
      nextOffset += TICK_INTERVAL;
    }
    asks.sort((a, b) => a.price - b.price);
  }

  // If bids < 5 levels, append missing levels starting below the lowest existing bid
  if (bids.length < 5) {
    const existingPrices = new Set(bids.map(b => b.price));
    let startPrice = bids.length > 0 ? bids[bids.length - 1].price : basePrice;
    let nextOffset = TICK_INTERVAL;
    while (bids.length < 5) {
      let p = Math.max(TICK_INTERVAL, startPrice - nextOffset);
      if (!existingPrices.has(p) && p > 0) {
        bids.push({ price: p, shares: 1, totalPoints: p * 1 });
        existingPrices.add(p);
      }
      nextOffset += TICK_INTERVAL;
      if (p <= TICK_INTERVAL) break;
    }
    bids.sort((a, b) => b.price - a.price);
  }

  return {
    asks: asks.slice(0, 5),
    bids: bids.slice(0, 5),
  };
}

export interface MatchOrderBookResult {
  executedShares: number;
  unfilledShares: number;
  avgExecutedPrice: number;
  totalCostOrRefund: number;
  newSpotPrice: number;
  updatedOrderBook: OrderBookSnapshot;
}

/**
 * Legacy wrapper for backward compatibility
 */
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
  const result = executeOrderBookMatch(orderBook, 'MARKET', orderType, targetPrice, targetShares);
  return {
    executedShares: result.executedShares,
    avgExecutedPrice: result.avgExecutedPrice,
    totalCostOrRefund: result.totalCostOrRefund,
    updatedOrderBook: result.updatedOrderBook,
  };
}

/**
 * Execute limit or market order matching against the orderbook depth.
 */
export function executeOrderBookMatch(
  orderBook: OrderBookSnapshot,
  orderClass: 'LIMIT' | 'MARKET',
  orderType: 'BUY' | 'SELL',
  targetPrice: number,
  targetShares: number
): MatchOrderBookResult {
  let remainingShares = targetShares;
  let totalCostOrRefund = 0;
  let executedShares = 0;

  const currentBook = orderBook && Array.isArray(orderBook.asks) && Array.isArray(orderBook.bids)
    ? orderBook
    : generateMockOrderBook(targetPrice);

  // Clone levels
  let asks: OrderBookLevel[] = currentBook.asks.map(a => ({ ...a })).sort((a, b) => a.price - b.price);
  let bids: OrderBookLevel[] = currentBook.bids.map(b => ({ ...b })).sort((a, b) => b.price - a.price);

  let lastMatchPrice = targetPrice;

  if (orderType === 'BUY') {
    // BUY order matches against ASKS (lowest ask first)
    for (let i = 0; i < asks.length; i++) {
      const ask = asks[i];
      if (!ask || ask.shares <= 0) continue;
      
      // If LIMIT order, only match if ask.price <= targetPrice
      if (orderClass === 'LIMIT' && ask.price > targetPrice) {
        break;
      }

      if (remainingShares <= 0) break;

      const fillQty = Math.min(remainingShares, ask.shares);
      executedShares += fillQty;
      totalCostOrRefund += fillQty * ask.price;
      remainingShares -= fillQty;
      ask.shares -= fillQty;
      ask.totalPoints = ask.price * ask.shares;
      lastMatchPrice = ask.price;
    }

    // Filter out emptied asks
    asks = asks.filter(a => a.shares > 0);

    // If LIMIT order and there are remaining unfilled shares, place them onto BIDS orderbook
    if (orderClass === 'LIMIT' && remainingShares > 0) {
      const existingBid = bids.find(b => b.price === targetPrice);
      if (existingBid) {
        existingBid.shares += remainingShares;
        existingBid.totalPoints = existingBid.price * existingBid.shares;
      } else {
        bids.push({
          price: targetPrice,
          shares: remainingShares,
          totalPoints: targetPrice * remainingShares,
        });
      }
      bids.sort((a, b) => b.price - a.price);
    }

  } else {
    // SELL order matches against BIDS (highest bid first)
    for (let i = 0; i < bids.length; i++) {
      const bid = bids[i];
      if (!bid || bid.shares <= 0) continue;

      // If LIMIT order, only match if bid.price >= targetPrice
      if (orderClass === 'LIMIT' && bid.price < targetPrice) {
        break;
      }

      if (remainingShares <= 0) break;

      const fillQty = Math.min(remainingShares, bid.shares);
      executedShares += fillQty;
      totalCostOrRefund += fillQty * bid.price;
      remainingShares -= fillQty;
      bid.shares -= fillQty;
      bid.totalPoints = bid.price * bid.shares;
      lastMatchPrice = bid.price;
    }

    // Filter out emptied bids
    bids = bids.filter(b => b.shares > 0);

    // If LIMIT order and there are remaining unfilled shares, place them onto ASKS orderbook
    if (orderClass === 'LIMIT' && remainingShares > 0) {
      const existingAsk = asks.find(a => a.price === targetPrice);
      if (existingAsk) {
        existingAsk.shares += remainingShares;
        existingAsk.totalPoints = existingAsk.price * existingAsk.shares;
      } else {
        asks.push({
          price: targetPrice,
          shares: remainingShares,
          totalPoints: targetPrice * remainingShares,
        });
      }
      asks.sort((a, b) => a.price - b.price);
    }
  }

  const avgExecutedPrice = executedShares > 0 ? Math.round(totalCostOrRefund / executedShares) : targetPrice;
  const newSpotPrice = executedShares > 0 ? lastMatchPrice : targetPrice;

  // Ensure healthy level depth
  const updatedOrderBook = ensureMinOrderBookLevels({ asks, bids }, newSpotPrice);

  return {
    executedShares,
    unfilledShares: remainingShares,
    avgExecutedPrice,
    totalCostOrRefund,
    newSpotPrice,
    updatedOrderBook,
  };
}

/**
 * Remove/Cancel an unexecuted limit order quantity from the orderbook
 */
export function cancelLimitOrderInBook(
  orderBook: OrderBookSnapshot | undefined,
  orderType: 'BUY' | 'SELL',
  price: number,
  sharesToCancel: number,
  currentPrice: number
): OrderBookSnapshot {
  const safeBook = orderBook || generateMockOrderBook(currentPrice);
  let asks = Array.isArray(safeBook?.asks) ? safeBook.asks.map(a => ({ ...a })) : [];
  let bids = Array.isArray(safeBook?.bids) ? safeBook.bids.map(b => ({ ...b })) : [];

  if (orderType === 'BUY') {
    // Cancelled buy order was resting in bids
    const targetBid = bids.find(b => b.price === price);
    if (targetBid) {
      targetBid.shares = Math.max(0, targetBid.shares - sharesToCancel);
      targetBid.totalPoints = targetBid.price * targetBid.shares;
    }
  } else {
    // Cancelled sell order was resting in asks
    const targetAsk = asks.find(a => a.price === price);
    if (targetAsk) {
      targetAsk.shares = Math.max(0, targetAsk.shares - sharesToCancel);
      targetAsk.totalPoints = targetAsk.price * targetAsk.shares;
    }
  }

  asks = asks.filter(a => a.shares > 0);
  bids = bids.filter(b => b.shares > 0);

  return ensureMinOrderBookLevels({ asks, bids }, currentPrice);
}
