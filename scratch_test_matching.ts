import { executeOrderBookMatch, OrderBookSnapshot } from './src/core/orderbook/orderbookEngine';

// Orderbook matching the user screenshot:
// Current Price: 13,650
// Asks: 13,650 (4주), 13,700 (6주), 13,750 (5주), 13,800 (8주), 13,900 (5주)
// Bids: 13,600 (1주), 13,550 (1주), 13,500 (10주), 13,450 (3주), 13,400 (5주)

const customBook: OrderBookSnapshot = {
  asks: [
    { price: 13650, shares: 4, totalPoints: 13650 * 4 },
    { price: 13700, shares: 6, totalPoints: 13700 * 6 },
    { price: 13750, shares: 5, totalPoints: 13750 * 5 },
    { price: 13800, shares: 8, totalPoints: 13800 * 8 },
    { price: 13900, shares: 5, totalPoints: 13900 * 5 },
  ],
  bids: [
    { price: 13600, shares: 1, totalPoints: 13600 * 1 },
    { price: 13550, shares: 1, totalPoints: 13550 * 1 },
    { price: 13500, shares: 10, totalPoints: 13500 * 10 },
    { price: 13450, shares: 3, totalPoints: 13450 * 3 },
    { price: 13400, shares: 5, totalPoints: 13400 * 5 },
  ]
};

console.log('BEFORE MATCH:');
console.log('Asks:', customBook.asks);
console.log('Bids:', customBook.bids);

// User places LIMIT BUY 1 share at 13,650
const result = executeOrderBookMatch(customBook, 'LIMIT', 'BUY', 13650, 1);

console.log('\n--- MATCH RESULT ---');
console.log('executedShares:', result.executedShares);
console.log('unfilledShares:', result.unfilledShares);
console.log('avgExecutedPrice:', result.avgExecutedPrice);
console.log('newSpotPrice:', result.newSpotPrice);
console.log('AFTER MATCH Asks:', result.updatedOrderBook.asks);
console.log('AFTER MATCH Bids:', result.updatedOrderBook.bids);
