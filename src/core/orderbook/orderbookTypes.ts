export type TradingPhase = 'IPO' | 'ORDER_BOOK';

export interface LimitOrder {
  id: string;
  userId: string;
  userName: string;
  politicianId: string;
  type: 'BUY' | 'SELL';
  price: number;
  shares: number;
  remainingShares: number;
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
