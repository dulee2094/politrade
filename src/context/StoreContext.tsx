import React, { createContext, useContext, useState, useEffect } from 'react';
import { Politician, UserProfile, CommentItem, Holding, TradeOrder, ListingPetition, Party } from '../types';
import { INITIAL_POLITICIANS } from '../data/mockPoliticians';
import { INITIAL_COMMENTS } from '../data/mockCommunity';
import { checkMonthlyAllowance } from '../core/allowance/monthlyAllowance';
import { getMarketStatus } from '../core/trading/marketHours';
import { LimitOrder } from '../core/orderbook/orderbookTypes';
import { INITIAL_IPO_PRICE, INITIAL_IPO_TARGET_SHARES, generateMockOrderBook, matchOrderBook, executeOrderBookMatch, cancelLimitOrderInBook } from '../core/orderbook/orderbookEngine';
import { generateMarketBriefing, DailyMarketBriefing } from '../core/trading/marketBriefing';

export interface ExtendedUserProfile extends UserProfile {
  isReporterVerified?: boolean;
  pressName?: string;
  verifiedEmail?: string;
  lastAllowanceMonth?: string;
  openOrders?: LimitOrder[];
}

interface StoreContextType {
  politicians: Politician[];
  user: ExtendedUserProfile;
  comments: CommentItem[];
  briefing: DailyMarketBriefing;
  selectedPoliticianId: string | null;
  setSelectedPoliticianId: (id: string | null) => void;
  activeTab: 'dashboard' | 'market' | 'board' | 'leaderboard';
  setActiveTab: (tab: 'dashboard' | 'market' | 'board' | 'leaderboard') => void;
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: (open: boolean) => void;
  allowanceNotice: string | null;
  setAllowanceNotice: (msg: string | null) => void;
  
  // Listing Petitions
  petitions: ListingPetition[];
  createPetition: (data: { name: string; party: Party; district: string; title: string; bio: string }) => { success: boolean; message: string };
  agreePetition: (petitionId: string) => { success: boolean; message: string };

  // Actions
  placeOrder: (politicianId: string, orderClass: 'LIMIT' | 'MARKET', type: 'BUY' | 'SELL', price: number, shares: number) => { success: boolean; message: string };
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  buyStock: (politicianId: string, shares: number) => { success: boolean; message: string };
  sellStock: (politicianId: string, shares: number) => { success: boolean; message: string };
  addComment: (politicianId: string, content: string) => void;
  getPoliticianById: (id: string) => Politician | undefined;
  updatePressVerification: (data: { isVerified: boolean; email: string; mediaName: string; verifiedAt: string }, nickname: string) => void;
  awardUserPoints: (amount: number) => void;
  resetAllCache: () => void;
}

const LOCAL_STORAGE_KEY_USER = 'politrade_user_v30';
const LOCAL_STORAGE_KEY_POLS = 'politrade_pols_v30';
const LOCAL_STORAGE_KEY_PETITIONS = 'politrade_petitions_v30';

const INITIAL_PETITIONS: ListingPetition[] = [
  {
    id: 'PET_001',
    politicianName: '김태호',
    party: '국민의힘',
    district: '경남 산청·함양·거창·합천',
    title: '제22대 국회의원 / 4선 중진',
    bio: '경남도지사 출신 4선 의원. 지역 균형 발전 및 농어촌 경제 활성화 입법 추진으로 상장 청원합니다.',
    petitionerName: '여의도취재반장',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    agreedUsers: ['여의도취재반장', '정치분석가', '뉴스리포터', '의정모니터', '국회인사이드', '정치개혁러', '민심추적자', '투표참여왕'],
    status: 'ACTIVE',
  },
  {
    id: 'PET_002',
    politicianName: '배준영',
    party: '국민의힘',
    district: '인천 중구·강화군·옹진군',
    title: '국민의힘 원내수석부대표 / 재선',
    bio: '인천 항만 및 도서 지역 원도심 개발 특구 법안 추진 이슈로 상장 청원합니다.',
    petitionerName: '인천정치통',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    agreedUsers: ['인천정치통', '바다사랑', '수도권유권자', '의정뉴스', '민심체크'],
    status: 'ACTIVE',
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always force fresh politicians data on version bump v16
  const [politicians, setPoliticians] = useState<Politician[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POLS);
    if (saved) {
      try { 
        const parsed: Politician[] = JSON.parse(saved); 
        return INITIAL_POLITICIANS.map(initPol => {
          const cached = parsed.find(p => p.id === initPol.id);
          if (!cached) return initPol;

          const validOrderBook = (cached.orderBook && Array.isArray(cached.orderBook.asks) && Array.isArray(cached.orderBook.bids))
            ? cached.orderBook
            : initPol.orderBook;

          const validPriceHistory = (Array.isArray(cached.priceHistory) && cached.priceHistory.length > 0)
            ? cached.priceHistory
            : initPol.priceHistory;

          const validNews = Array.isArray(cached.news)
            ? cached.news
            : initPol.news;

          return {
            ...initPol,
            ...cached,
            imageUrl: initPol.imageUrl,
            name: initPol.name,
            party: initPol.party,
            district: initPol.district,
            title: initPol.title,
            bio: cached.bio || initPol.bio,
            phase: cached.phase || initPol.phase,
            ipoSoldShares: typeof cached.ipoSoldShares === 'number' ? cached.ipoSoldShares : initPol.ipoSoldShares,
            ipoTargetShares: INITIAL_IPO_TARGET_SHARES,
            orderBook: validOrderBook,
            priceHistory: validPriceHistory,
            news: validNews,
            currentPrice: typeof cached.currentPrice === 'number' ? cached.currentPrice : initPol.currentPrice,
            previousClose: typeof cached.previousClose === 'number' ? cached.previousClose : initPol.previousClose,
            change24h: typeof cached.change24h === 'number' ? cached.change24h : initPol.change24h,
            high24h: typeof cached.high24h === 'number' ? cached.high24h : initPol.high24h,
            low24h: typeof cached.low24h === 'number' ? cached.low24h : initPol.low24h,
            volume24h: typeof cached.volume24h === 'number' ? cached.volume24h : initPol.volume24h,
            totalVolume: typeof cached.totalVolume === 'number' ? cached.totalVolume : initPol.totalVolume,
          };
        });
      } catch (e) { /* fallback */ }
    }
    return INITIAL_POLITICIANS;
  });

  const [user, setUser] = useState<ExtendedUserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    let initialUser: ExtendedUserProfile;
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        initialUser = {
          ...parsed,
          holdings: parsed.holdings || {},
          openOrders: parsed.openOrders || [],
          tradeHistory: parsed.tradeHistory || [],
        };
      } catch (e) {
        initialUser = {
          name: '여의도취재반장',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          balance: 300000,
          initialBalance: 300000,
          holdings: {},
          openOrders: [],
          tradeHistory: [],
          isReporterVerified: true,
          pressName: 'KBS',
          verifiedEmail: 'reporter@kbs.co.kr',
        };
      }
    } else {
      initialUser = {
        name: '여의도취재반장',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        balance: 300000,
        initialBalance: 300000,
        holdings: {},
        openOrders: [],
        tradeHistory: [],
        isReporterVerified: true,
        pressName: 'KBS',
        verifiedEmail: 'reporter@kbs.co.kr',
      };
    }
    return initialUser;
  });

  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [selectedPoliticianId, setSelectedPoliticianId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'market' | 'board' | 'leaderboard'>('dashboard');
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [allowanceNotice, setAllowanceNotice] = useState<string | null>(null);

  // Live Trade-Triggered Briefing State
  const [briefing, setBriefing] = useState<DailyMarketBriefing>(() => 
    generateMarketBriefing(politicians, (user.tradeHistory || [])[0])
  );

  // Automatic monthly allowance check on mount
  useEffect(() => {
    const { updatedUser, result } = checkMonthlyAllowance(user);
    if (result.granted) {
      setUser(updatedUser);
      setAllowanceNotice(result.message || null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_POLS, JSON.stringify(politicians));
  }, [politicians]);

  const getPoliticianById = (id: string) => politicians.find(p => p.id === id);

  const awardUserPoints = (amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: (prev.balance || 0) + amount,
    }));
  };

  const placeOrder = (
    politicianId: string,
    orderClass: 'LIMIT' | 'MARKET',
    type: 'BUY' | 'SELL',
    targetPrice: number,
    shares: number
  ): { success: boolean; message: string } => {
    const mStatus = getMarketStatus();
    if (!mStatus.isOpen) {
      return {
        success: false,
        message: `🔴 장 마감: POLI주식 매매는 매일 12:00 ~ 14:00 정규장에만 가능합니다. (${mStatus.countdownText})`,
      };
    }

    const targetPol = getPoliticianById(politicianId);
    if (!targetPol) return { success: false, message: '정치인 정보를 찾을 수 없습니다.' };
    if (shares <= 0) return { success: false, message: '올바른 수량을 입력해 주세요.' };

    const isIPO = targetPol.phase === 'IPO';
    if (isIPO) {
      if (type === 'BUY') {
        const totalCost = shares * INITIAL_IPO_PRICE;
        if (user.balance < totalCost) {
          return {
            success: false,
            message: `포인트가 부족합니다. (필요: ${totalCost.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)`,
          };
        }

        const newSold = targetPol.ipoSoldShares + shares;
        const isCompleted = newSold >= targetPol.ipoTargetShares;

        const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        const newHistory = [...targetPol.priceHistory, { time: nowStr, price: INITIAL_IPO_PRICE, volume: shares * 100 }];
        if (newHistory.length > 20) newHistory.shift();

        let updatedPolsList: Politician[] = [];
        setPoliticians(prev => {
          updatedPolsList = prev.map(p => {
            if (p.id !== politicianId) return p;
            return {
              ...p,
              phase: isCompleted ? 'ORDER_BOOK' : 'IPO',
              ipoSoldShares: Math.min(p.ipoTargetShares, newSold),
              currentPrice: INITIAL_IPO_PRICE,
              volume24h: p.volume24h + totalCost,
              totalVolume: p.totalVolume + totalCost,
              priceHistory: newHistory,
              orderBook: isCompleted ? generateMockOrderBook(INITIAL_IPO_PRICE) : p.orderBook,
            };
          });
          return updatedPolsList;
        });

        const newOrder: TradeOrder = {
          id: 'ord_' + Date.now(),
          politicianId,
          politicianName: targetPol.name,
          type: 'BUY',
          shares,
          pricePerShare: INITIAL_IPO_PRICE,
          totalPoints: totalCost,
          timestamp: new Date().toLocaleString('ko-KR'),
        };

        setUser(prevUser => {
          const userHoldings = prevUser.holdings || {};
          const existingHolding: Holding = userHoldings[politicianId] || {
            politicianId,
            shares: 0,
            avgPrice: 0,
            totalInvested: 0,
          };

          const newTotalShares = existingHolding.shares + shares;
          const newTotalInvested = existingHolding.totalInvested + totalCost;
          const newAvgPrice = Math.round(newTotalInvested / newTotalShares);

          return {
            ...prevUser,
            balance: prevUser.balance - totalCost,
            holdings: {
              ...userHoldings,
              [politicianId]: {
                politicianId,
                shares: newTotalShares,
                avgPrice: newAvgPrice,
                totalInvested: newTotalInvested,
              },
            },
            tradeHistory: [newOrder, ...(prevUser.tradeHistory || [])],
          };
        });

        setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));

        if (isCompleted) {
          alert(`🎉 축하합니다! ${targetPol.name} POLI주식이 10주 공모 완판되어 Phase 2 실시간 호가창 정규 시장으로 즉시 상장 전환되었습니다!`);
        }

        return {
          success: true,
          message: `[Phase 1 공모 청약] ${targetPol.name} POLI주식 ${shares}주 공모가(10,000 P) 매수 완료!`,
        };
      } else {
        const userHoldings = user.holdings || {};
        const userHolding = userHoldings[politicianId];
        if (!userHolding || userHolding.shares < shares) {
          return { success: false, message: '매도 가능한 보유 주식이 부족합니다.' };
        }

        const totalRefund = shares * INITIAL_IPO_PRICE;
        const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

        let updatedPolsList: Politician[] = [];
        setPoliticians(prev => {
          updatedPolsList = prev.map(p => {
            if (p.id !== politicianId) return p;
            const newHistory = [...p.priceHistory, { time: nowStr, price: INITIAL_IPO_PRICE, volume: shares * 100 }];
            if (newHistory.length > 20) newHistory.shift();

            return {
              ...p,
              ipoSoldShares: Math.max(0, p.ipoSoldShares - shares),
              volume24h: p.volume24h + totalRefund,
              totalVolume: p.totalVolume + totalRefund,
              priceHistory: newHistory,
            };
          });
          return updatedPolsList;
        });

        const newOrder: TradeOrder = {
          id: 'ord_' + Date.now(),
          politicianId,
          politicianName: targetPol.name,
          type: 'SELL',
          shares,
          pricePerShare: INITIAL_IPO_PRICE,
          totalPoints: totalRefund,
          timestamp: new Date().toLocaleString('ko-KR'),
        };

        setUser(prevUser => {
          const remainingShares = userHolding.shares - shares;
          const updatedHoldings = { ...(prevUser.holdings || {}) };

          if (remainingShares === 0) {
            delete updatedHoldings[politicianId];
          } else {
            const costBasisSold = userHolding.avgPrice * shares;
            updatedHoldings[politicianId] = {
              ...userHolding,
              shares: remainingShares,
              totalInvested: Math.max(0, userHolding.totalInvested - costBasisSold),
            };
          }

          return {
            ...prevUser,
            balance: prevUser.balance + totalRefund,
            holdings: updatedHoldings,
            tradeHistory: [newOrder, ...(prevUser.tradeHistory || [])],
          };
        });

        setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));

        return {
          success: true,
          message: `[Phase 1 공모 환불] ${targetPol.name} POLI주식 ${shares}주 공모가(10,000 P) 매도 완료! (+${totalRefund.toLocaleString()} P 입금)`,
        };
      }
    }

    // Phase 2: Real Order Book Matching
    const validPrice = orderClass === 'LIMIT' && targetPrice > 0 ? Math.round(targetPrice) : targetPol.currentPrice;

    if (type === 'BUY') {
      const maxBudgetRequired = validPrice * shares;
      if (user.balance < maxBudgetRequired) {
        return {
          success: false,
          message: `포인트가 부족합니다. (필요: ${maxBudgetRequired.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)`,
        };
      }

      const matchRes = executeOrderBookMatch(
        targetPol.orderBook || generateMockOrderBook(targetPol.currentPrice),
        orderClass,
        'BUY',
        validPrice,
        shares
      );

      const executedShares = matchRes.executedShares;
      const unfilledShares = matchRes.unfilledShares;
      const totalCostExecuted = matchRes.totalCostOrRefund;
      const lockedUnfilledCost = (orderClass === 'LIMIT' && unfilledShares > 0) ? unfilledShares * validPrice : 0;
      const totalDeductedBalance = totalCostExecuted + lockedUnfilledCost;

      const newSpotPrice = matchRes.newSpotPrice || targetPol.currentPrice;
      const newChange24h = parseFloat((((newSpotPrice - targetPol.previousClose) / targetPol.previousClose) * 100).toFixed(2));
      const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

      let updatedPolsList: Politician[] = [];
      setPoliticians(prev => {
        updatedPolsList = prev.map(p => {
          if (p.id !== politicianId) return p;
          const newHistory = [...p.priceHistory, { time: nowStr, price: newSpotPrice, volume: shares * 100 }];
          if (newHistory.length > 20) newHistory.shift();

          return {
            ...p,
            currentPrice: newSpotPrice,
            change24h: newChange24h,
            high24h: Math.max(p.high24h, newSpotPrice),
            volume24h: p.volume24h + totalCostExecuted,
            totalVolume: p.totalVolume + totalCostExecuted,
            priceHistory: newHistory,
            orderBook: matchRes.updatedOrderBook,
          };
        });
        return updatedPolsList;
      });

      let newOrder: TradeOrder | null = null;
      if (executedShares > 0) {
        newOrder = {
          id: 'ord_' + Date.now(),
          politicianId,
          politicianName: targetPol.name,
          type: 'BUY',
          shares: executedShares,
          pricePerShare: matchRes.avgExecutedPrice,
          totalPoints: totalCostExecuted,
          timestamp: new Date().toLocaleString('ko-KR'),
        };
      }

      let newOpenOrder: LimitOrder | null = null;
      if (orderClass === 'LIMIT' && unfilledShares > 0) {
        newOpenOrder = {
          id: 'lmt_' + Date.now(),
          userId: user.name,
          userName: user.name,
          politicianId,
          politicianName: targetPol.name,
          type: 'BUY',
          orderClass: 'LIMIT',
          price: validPrice,
          shares,
          remainingShares: unfilledShares,
          status: executedShares > 0 ? 'PARTIALLY_FILLED' : 'PENDING',
          createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setUser(prevUser => {
        const userHoldings = prevUser.holdings || {};
        const existingHolding: Holding = userHoldings[politicianId] || {
          politicianId,
          shares: 0,
          avgPrice: 0,
          totalInvested: 0,
        };

        const newTotalShares = existingHolding.shares + executedShares;
        const newTotalInvested = existingHolding.totalInvested + totalCostExecuted;
        const newAvgPrice = newTotalShares > 0 ? Math.round(newTotalInvested / newTotalShares) : 0;

        const updatedHoldings = { ...userHoldings };
        if (newTotalShares > 0) {
          updatedHoldings[politicianId] = {
            politicianId,
            shares: newTotalShares,
            avgPrice: newAvgPrice,
            totalInvested: newTotalInvested,
          };
        }

        const prevOpenOrders = prevUser.openOrders || [];
        const nextOpenOrders = newOpenOrder ? [newOpenOrder, ...prevOpenOrders] : prevOpenOrders;
        const prevTradeHistory = prevUser.tradeHistory || [];
        const nextTradeHistory = newOrder ? [newOrder, ...prevTradeHistory] : prevTradeHistory;

        return {
          ...prevUser,
          balance: prevUser.balance - totalDeductedBalance,
          holdings: updatedHoldings,
          openOrders: nextOpenOrders,
          tradeHistory: nextTradeHistory,
        };
      });

      if (newOrder) {
        setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));
      }

      if (executedShares > 0 && unfilledShares > 0) {
        return {
          success: true,
          message: `[지정가 매수 부분체결] ${executedShares}주 체결 완료! 남은 ${unfilledShares}주는 ${validPrice.toLocaleString()} P에 매수 호가 등록되었습니다.`,
        };
      } else if (executedShares > 0) {
        return {
          success: true,
          message: `[매수 체결 완료] ${targetPol.name} POLI주식 ${executedShares}주 매수 완료! (${totalCostExecuted.toLocaleString()} P 차감)`,
        };
      } else {
        return {
          success: true,
          message: `[지정가 매수 대기] ${validPrice.toLocaleString()} P에 ${unfilledShares}주 매수 호가 등록 완료! (미체결 포인트 락업)`,
        };
      }

    } else {
      // SELL ORDER
      const userHoldings = user.holdings || {};
      const userHolding = userHoldings[politicianId];

      const lockedSellShares = (user.openOrders || [])
        .filter(o => o.politicianId === politicianId && o.type === 'SELL')
        .reduce((acc, o) => acc + o.remainingShares, 0);

      const availableShares = (userHolding ? userHolding.shares : 0) - lockedSellShares;

      if (availableShares < shares) {
        return { success: false, message: `매도 가능한 보유 주식이 부족합니다. (가능: ${availableShares}주 / 주문: ${shares}주)` };
      }

      const matchRes = executeOrderBookMatch(
        targetPol.orderBook || generateMockOrderBook(targetPol.currentPrice),
        orderClass,
        'SELL',
        validPrice,
        shares
      );

      const executedShares = matchRes.executedShares;
      const unfilledShares = matchRes.unfilledShares;
      const totalRefundExecuted = matchRes.totalCostOrRefund;

      const newSpotPrice = matchRes.newSpotPrice || targetPol.currentPrice;
      const newChange24h = parseFloat((((newSpotPrice - targetPol.previousClose) / targetPol.previousClose) * 100).toFixed(2));
      const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

      let updatedPolsList: Politician[] = [];
      setPoliticians(prev => {
        updatedPolsList = prev.map(p => {
          if (p.id !== politicianId) return p;
          const newHistory = [...p.priceHistory, { time: nowStr, price: newSpotPrice, volume: shares * 100 }];
          if (newHistory.length > 20) newHistory.shift();

          return {
            ...p,
            currentPrice: newSpotPrice,
            change24h: newChange24h,
            low24h: Math.min(p.low24h, newSpotPrice),
            volume24h: p.volume24h + totalRefundExecuted,
            totalVolume: p.totalVolume + totalRefundExecuted,
            priceHistory: newHistory,
            orderBook: matchRes.updatedOrderBook,
          };
        });
        return updatedPolsList;
      });

      let newOrder: TradeOrder | null = null;
      if (executedShares > 0) {
        newOrder = {
          id: 'ord_' + Date.now(),
          politicianId,
          politicianName: targetPol.name,
          type: 'SELL',
          shares: executedShares,
          pricePerShare: matchRes.avgExecutedPrice,
          totalPoints: totalRefundExecuted,
          timestamp: new Date().toLocaleString('ko-KR'),
        };
      }

      let newOpenOrder: LimitOrder | null = null;
      if (orderClass === 'LIMIT' && unfilledShares > 0) {
        newOpenOrder = {
          id: 'lmt_' + Date.now(),
          userId: user.name,
          userName: user.name,
          politicianId,
          politicianName: targetPol.name,
          type: 'SELL',
          orderClass: 'LIMIT',
          price: validPrice,
          shares,
          remainingShares: unfilledShares,
          status: executedShares > 0 ? 'PARTIALLY_FILLED' : 'PENDING',
          createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setUser(prevUser => {
        const remainingHoldingShares = userHolding.shares - executedShares;
        const updatedHoldings = { ...(prevUser.holdings || {}) };

        if (remainingHoldingShares <= 0) {
          delete updatedHoldings[politicianId];
        } else {
          const costBasisSold = userHolding.avgPrice * executedShares;
          updatedHoldings[politicianId] = {
            ...userHolding,
            shares: remainingHoldingShares,
            totalInvested: Math.max(0, userHolding.totalInvested - costBasisSold),
          };
        }

        const prevOpenOrders = prevUser.openOrders || [];
        const nextOpenOrders = newOpenOrder ? [newOpenOrder, ...prevOpenOrders] : prevOpenOrders;
        const prevTradeHistory = prevUser.tradeHistory || [];
        const nextTradeHistory = newOrder ? [newOrder, ...prevTradeHistory] : prevTradeHistory;

        return {
          ...prevUser,
          balance: prevUser.balance + totalRefundExecuted,
          holdings: updatedHoldings,
          openOrders: nextOpenOrders,
          tradeHistory: nextTradeHistory,
        };
      });

      if (newOrder) {
        setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));
      }

      if (executedShares > 0 && unfilledShares > 0) {
        return {
          success: true,
          message: `[지정가 매도 부분체결] ${executedShares}주 체결 완료! 남은 ${unfilledShares}주는 ${validPrice.toLocaleString()} P에 매도 호가 등록되었습니다.`,
        };
      } else if (executedShares > 0) {
        return {
          success: true,
          message: `[매도 체결 완료] ${targetPol.name} POLI주식 ${executedShares}주 매도 완료! (+${totalRefundExecuted.toLocaleString()} P 입금)`,
        };
      } else {
        return {
          success: true,
          message: `[지정가 매도 대기] ${validPrice.toLocaleString()} P에 ${unfilledShares}주 매도 호가 등록 완료! (미체결 주식 락업)`,
        };
      }
    }
  };

  const cancelOrder = (orderId: string): { success: boolean; message: string } => {
    const openOrders = user.openOrders || [];
    const targetOrder = openOrders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: '해당 미체결 주문을 찾을 수 없습니다.' };
    }

    const politician = getPoliticianById(targetOrder.politicianId);
    const curPrice = politician?.currentPrice || targetOrder.price;

    if (politician) {
      setPoliticians(prev => prev.map(p => {
        if (p.id !== targetOrder.politicianId) return p;
        return {
          ...p,
          orderBook: cancelLimitOrderInBook(p.orderBook, targetOrder.type, targetOrder.price, targetOrder.remainingShares, curPrice),
        };
      }));
    }

    setUser(prevUser => {
      const remainingOpenOrders = (prevUser.openOrders || []).filter(o => o.id !== orderId);
      let newBalance = prevUser.balance;

      if (targetOrder.type === 'BUY') {
        const refundPoints = targetOrder.remainingShares * targetOrder.price;
        newBalance += refundPoints;
      }

      return {
        ...prevUser,
        balance: newBalance,
        openOrders: remainingOpenOrders,
      };
    });

    return {
      success: true,
      message: `미체결 ${targetOrder.type === 'BUY' ? '매수' : '매도'} 주문 (${targetOrder.remainingShares}주) 취소 완료!`,
    };
  };

  const buyStock = (politicianId: string, shares: number) => {
    const targetPol = getPoliticianById(politicianId);
    const price = targetPol?.currentPrice || 10000;
    return placeOrder(politicianId, 'MARKET', 'BUY', price, shares);
  };

  const sellStock = (politicianId: string, shares: number) => {
    const targetPol = getPoliticianById(politicianId);
    const price = targetPol?.currentPrice || 10000;
    return placeOrder(politicianId, 'MARKET', 'SELL', price, shares);
  };

  const addComment = (politicianId: string, content: string) => {
    if (!content.trim()) return;
    const userHoldings = user.holdings || {};
    const isHolder = userHoldings[politicianId] && userHoldings[politicianId].shares > 0;
    
    const newComment: CommentItem = {
      id: 'cmt_' + Date.now(),
      politicianId,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      holdingStatus: isHolder ? 'HOLDER' : 'OBSERVER',
      likes: 0,
      timestamp: '방금 전',
    };

    setComments(prev => [newComment, ...prev]);
  };

  const [petitions, setPetitions] = useState<ListingPetition[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PETITIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PETITIONS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PETITIONS, JSON.stringify(petitions));
  }, [petitions]);

  const createPetition = (data: { name: string; party: Party; district: string; title: string; bio: string }) => {
    const alreadyListed = politicians.some(p => p.name.trim() === data.name.trim());
    if (alreadyListed) {
      return { success: false, message: `'${data.name}' 의원은 이미 POLI주식 시장에 상장되어 있습니다.` };
    }

    const activePet = petitions.find(p => p.politicianName.trim() === data.name.trim() && p.status === 'ACTIVE');
    if (activePet) {
      return { success: false, message: `'${data.name}' 의원의 상장 청원이 이미 진행 중입니다. 청원소 목록에서 동의해 주세요!` };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();

    const newPet: ListingPetition = {
      id: `PET_${Date.now()}`,
      politicianName: data.name,
      party: data.party,
      district: data.district,
      title: data.title,
      bio: data.bio || `${data.name} 의원의 제22대 의정 활동 지표 검증 상장 청원입니다.`,
      petitionerName: user.name,
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      agreedUsers: [user.name],
      status: 'ACTIVE',
    };

    setPetitions(prev => [newPet, ...prev]);
    return { success: true, message: `'${data.name}' 의원의 상장 청원이 성공적으로 발의되었습니다! (10일 기한 카운트다운 시작)` };
  };

  const agreePetition = (petitionId: string) => {
    const pet = petitions.find(p => p.id === petitionId);
    if (!pet) return { success: false, message: '청원 건을 찾을 수 없습니다.' };

    if (pet.status !== 'ACTIVE') {
      return { success: false, message: '이미 종료되었거나 상장이 완료된 청원입니다.' };
    }

    if (new Date() > new Date(pet.expiresAt)) {
      setPetitions(prev => prev.map(p => p.id === petitionId ? { ...p, status: 'EXPIRED' } : p));
      return { success: false, message: '10일 청원 기간이 만료되어 상장에 실패했습니다.' };
    }

    if (pet.agreedUsers.includes(user.name)) {
      return { success: false, message: '이미 본 청원에 동의하셨습니다.' };
    }

    const updatedAgreedUsers = [...pet.agreedUsers, user.name];
    const TOTAL_MOCK_USERS = 50;
    const TARGET_REQUIRED = Math.max(10, Math.ceil(TOTAL_MOCK_USERS * 0.10));

    const isApproved = updatedAgreedUsers.length >= TARGET_REQUIRED;

    if (isApproved) {
      setPetitions(prev => prev.map(p => p.id === petitionId ? { ...p, agreedUsers: updatedAgreedUsers, status: 'APPROVED' } : p));

      const newPolId = `POL_${Date.now()}`;
      const newPolitician: Politician = {
        id: newPolId,
        name: pet.politicianName,
        party: pet.party,
        district: pet.district,
        title: pet.title,
        imageUrl: pet.imageUrl || '',
        bio: pet.bio || `${pet.politicianName} 의원의 유저 청원 100% 달성 신규 상장 주식입니다.`,
        phase: 'IPO',
        ipoSoldShares: 0,
        ipoTargetShares: 10,
        orderBook: generateMockOrderBook(10000),
        currentPrice: 10000,
        previousClose: 10000,
        change24h: 0,
        high24h: 10000,
        low24h: 10000,
        volume24h: 0,
        totalVolume: 0,
        priceHistory: [
          { time: '09:00', price: 10000, volume: 0 },
          { time: '17:00', price: 10000, volume: 0 },
        ],
        news: [
          { id: `n_auto_${Date.now()}_1`, title: `${pet.politicianName} 의원, 유저 상장 청원 승인으로 POLI주식 신규 상장!`, source: 'POLITRADE 공시', time: '방금 전', url: '#' },
          { id: `n_auto_${Date.now()}_2`, title: `제22대 국회 의정 활동 기대... 유저 동의율 100% 달성`, source: '국회이슈', time: '10분 전', url: '#' },
        ]
      };

      setPoliticians(prev => [...prev, newPolitician]);
      return { success: true, message: `🎉 축하합니다! 동의 수 ${updatedAgreedUsers.length}명 달성으로 '${pet.politicianName}' 의원이 POLI주식 시장에 자동 신규 상장되었습니다!` };
    } else {
      setPetitions(prev => prev.map(p => p.id === petitionId ? { ...p, agreedUsers: updatedAgreedUsers } : p));
      return { success: true, message: `'${pet.politicianName}' 의원의 상장 청원에 동의하셨습니다. (현재 ${updatedAgreedUsers.length}/${TARGET_REQUIRED}명)` };
    }
  };

  const updatePressVerification = (data: { isVerified: boolean; email: string; mediaName: string; verifiedAt: string }, nickname: string) => {
    setUser(prev => ({
      ...prev,
      name: nickname || prev.name,
      isReporterVerified: data.isVerified,
      pressName: data.mediaName,
      verifiedEmail: data.email,
    }));
  };

  const resetAllCache = () => {
    localStorage.clear();
    setPoliticians(INITIAL_POLITICIANS);
    window.location.reload();
  };

  return (
    <StoreContext.Provider
      value={{
        politicians,
        user,
        comments,
        briefing,
        selectedPoliticianId,
        setSelectedPoliticianId,
        activeTab,
        setActiveTab,
        isSignUpModalOpen,
        setIsSignUpModalOpen,
        allowanceNotice,
        setAllowanceNotice,
        petitions,
        createPetition,
        agreePetition,
        placeOrder,
        cancelOrder,
        buyStock,
        sellStock,
        addComment,
        getPoliticianById,
        updatePressVerification,
        awardUserPoints,
        resetAllCache,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
