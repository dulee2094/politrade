export type Party = '국민의힘' | '더불어민주당' | '조국혁신당' | '개혁신당' | '무소속';

export interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

export interface Politician {
  id: string;
  name: string;
  party: Party;
  district: string;
  title: string;
  imageUrl: string;
  bio: string;
  
  // AMM Reserves
  reserveMoney: number;  // R_money (가상 유동성 포인트)
  reserveShares: number; // R_shares (가상 유동성 주식 수량)
  
  // Dynamic Stats
  currentPrice: number;
  previousClose: number; // 전일 종가
  change24h: number;     // 24시간 변동율 (%)
  high24h: number;
  low24h: number;
  volume24h: number;     // 24시간 거래량
  totalVolume: number;   // 누적 거래액
  
  priceHistory: PricePoint[];
  news: { id: string; title: string; source: string; time: string; url: string }[];
}

export interface Holding {
  politicianId: string;
  shares: number;        // 보유 수량
  avgPrice: number;      // 평균 매수단가
  totalInvested: number; // 총 투자금액
}

export interface TradeOrder {
  id: string;
  politicianId: string;
  politicianName: string;
  type: 'BUY' | 'SELL';
  shares: number;
  pricePerShare: number;
  totalPoints: number;
  timestamp: string;
}

export interface CommentItem {
  id: string;
  politicianId: string;
  userName: string;
  userAvatar: string;
  content: string;
  holdingStatus?: 'BUYER' | 'SELLER' | 'HOLDER' | 'OBSERVER';
  likes: number;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  balance: number;      // 보유 사이버머니 (Point)
  initialBalance: number; // 초기 지급 포인트 (1,000,000 P)
  holdings: Record<string, Holding>; // politicianId -> Holding
  tradeHistory: TradeOrder[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  totalAsset: number;
  returnRate: number;
  badge: string;
}
