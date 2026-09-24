export type TradingPhase = 'IPO' | 'ORDER_BOOK';

export interface LimitOrder {
  id: string;
  userId: string;
  userName: string;
  politicianId: string;
  politicianName?: string;
  type: 'BUY' | 'SELL';
  orderClass: 'LIMIT' | 'MARKET';
  price: number;
  shares: number;
  remainingShares: number;
  status: 'PENDING' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';
  createdAt: string;
}

export interface OrderBookLevel {
  price: number;
  shares: number;
  totalPoints: number;
}

export interface OrderBookSnapshot {
  bids: OrderBookLevel[]; // Buy Orders (sorted descending by price)
  asks: OrderBookLevel[]; // Sell Orders (sorted ascending by price)
}

export interface IPOMetadata {
  targetShares: number; // 1,000 shares
  soldShares: number;   // e.g. 850 shares
  fixedPrice: number;   // 10,000 P
  isCompleted: boolean;
}
