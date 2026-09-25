const path = require('path');
const tsNode = require('ts-node');
tsNode.register({ transpileOnly: true });

const { executeOrderBookMatch, generateMockOrderBook } = require('./src/core/orderbook/orderbookEngine.ts');

const initialBook = generateMockOrderBook(13600);
console.log('BEFORE ORDERBOOK:');
console.log('Asks:', initialBook.asks);
console.log('Bids:', initialBook.bids);

// User places LIMIT BUY for 1 share at 13650 (matching ask 1)
const result = executeOrderBookMatch(initialBook, 'LIMIT', 'BUY', 13650, 1);

console.log('\nMATCH RESULT:');
console.log('executedShares:', result.executedShares);
console.log('unfilledShares:', result.unfilledShares);
console.log('avgExecutedPrice:', result.avgExecutedPrice);
console.log('newSpotPrice:', result.newSpotPrice);
console.log('AFTER ORDERBOOK:');
console.log('Asks:', result.updatedOrderBook.asks);
console.log('Bids:', result.updatedOrderBook.bids);
