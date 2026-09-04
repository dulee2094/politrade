import React, { createContext, useContext, useState, useEffect } from 'react';
import { Politician, UserProfile, CommentItem, Holding, TradeOrder } from '../types';
import { INITIAL_POLITICIANS } from '../data/mockPoliticians';
import { INITIAL_COMMENTS } from '../data/mockCommunity';
import { checkMonthlyAllowance } from '../core/allowance/monthlyAllowance';
import { getMarketStatus } from '../core/trading/marketHours';
import { INITIAL_IPO_PRICE, INITIAL_IPO_TARGET_SHARES, generateMockOrderBook, matchOrderBook } from '../core/orderbook/orderbookEngine';
import { generateMarketBriefing, DailyMarketBriefing } from '../core/trading/marketBriefing';

export interface ExtendedUserProfile extends UserProfile {
  isReporterVerified?: boolean;
  pressName?: string;
  verifiedEmail?: string;
  lastAllowanceMonth?: string;
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
  
  // Actions
  buyStock: (politicianId: string, shares: number) => { success: boolean; message: string };
  sellStock: (politicianId: string, shares: number) => { success: boolean; message: string };
  addComment: (politicianId: string, content: string) => void;
  getPoliticianById: (id: string) => Politician | undefined;
  updatePressVerification: (data: { isVerified: boolean; email: string; mediaName: string; verifiedAt: string }, nickname: string) => void;
  awardUserPoints: (amount: number) => void;
  resetAllCache: () => void;
}

const LOCAL_STORAGE_KEY_USER = 'politrade_user_v19';
const LOCAL_STORAGE_KEY_POLS = 'politrade_pols_v19';

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
            reserveMoney: typeof cached.reserveMoney === 'number' ? cached.reserveMoney : initPol.reserveMoney,
            reserveShares: typeof cached.reserveShares === 'number' ? cached.reserveShares : initPol.reserveShares,
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
          tradeHistory: parsed.tradeHistory || [],
        };
      } catch (e) {
        initialUser = {
          name: '여의도취재반장',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          balance: 100000,
          initialBalance: 100000,
          holdings: {},
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
        balance: 100000,
        initialBalance: 100000,
        holdings: {},
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

  const buyStock = (politicianId: string, shares: number) => {
    // Check Market Hours Enforcement (24H Test Bypass enabled)
    const mStatus = getMarketStatus();
    if (!mStatus.isOpen) {
      return {
        success: false,
        message: `🔴 장 마감: POLI주식 매매는 매일 12:00 ~ 14:00 정규장에만 가능합니다. (${mStatus.countdownText})`,
      };
    }

    const targetPol = getPoliticianById(politicianId);
    if (!targetPol) return { success: false, message: '정치인 정보를 찾을 수 없습니다.' };
    if (shares <= 0) return { success: false, message: '올바른 매수 수량을 입력해 주세요.' };

    const isIPO = targetPol.phase === 'IPO';

    if (isIPO) {
      // Phase 1: Fixed 10,000 P Public Offering (10 Shares target for testing)
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

      // Update Briefing Instantly on Real Execution
      setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));

      if (isCompleted) {
        alert(`🎉 축하합니다! ${targetPol.name} POLI주식이 10주 공모 완판되어 Phase 2 실시간 호가창 정규 시장으로 즉시 상장 전환되었습니다!`);
      }

      return {
        success: true,
        message: `[Phase 1 공모 청약] ${targetPol.name} POLI주식 ${shares}주 공모가(10,000 P) 매수 완료!`,
      };
    }

    // Phase 2: Real Order Book Execution
    const obMatch = matchOrderBook(targetPol.orderBook || generateMockOrderBook(targetPol.currentPrice), 'BUY', targetPol.currentPrice + 1000, shares);
    const totalCost = obMatch.totalCostOrRefund || shares * targetPol.currentPrice;

    if (user.balance < totalCost) {
      return { 
        success: false, 
        message: `포인트가 부족합니다. (필요: ${totalCost.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)` 
      };
    }

    const newSpotPrice = obMatch.avgExecutedPrice || targetPol.currentPrice;
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
          volume24h: p.volume24h + totalCost,
          totalVolume: p.totalVolume + totalCost,
          priceHistory: newHistory,
          orderBook: obMatch.updatedOrderBook,
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
      pricePerShare: obMatch.avgExecutedPrice,
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

    // Update Briefing Instantly on Real Execution
    setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));

    return { 
      success: true, 
      message: `[Phase 2 호가 체결] ${targetPol.name} POLI주식 ${shares}주 매수 완료! (${totalCost.toLocaleString()} P 차감)` 
    };
  };

  const sellStock = (politicianId: string, shares: number) => {
    // Check Market Hours Enforcement (24H Test Bypass enabled)
    const mStatus = getMarketStatus();
    if (!mStatus.isOpen) {
      return {
        success: false,
        message: `🔴 장 마감: POLI주식 매매는 매일 12:00 ~ 14:00 정규장에만 가능합니다. (${mStatus.countdownText})`,
      };
    }

    const targetPol = getPoliticianById(politicianId);
    if (!targetPol) return { success: false, message: '정치인 정보를 찾을 수 없습니다.' };

    const userHoldings = user.holdings || {};
    const userHolding = userHoldings[politicianId];
    if (!userHolding || userHolding.shares < shares) {
      return { success: false, message: '매도 가능한 보유 주식이 부족합니다.' };
    }
    if (shares <= 0) return { success: false, message: '올바른 매도 수량을 입력해 주세요.' };

    const isIPO = targetPol.phase === 'IPO';

    if (isIPO) {
      // Phase 1 fixed refund
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

      // Update Briefing Instantly on Real Execution
      setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));

      return {
        success: true,
        message: `[Phase 1 공모 환불] ${targetPol.name} POLI주식 ${shares}주 공모가(10,000 P) 매도 완료! (+${totalRefund.toLocaleString()} P 입금)`,
      };
    }

    // Phase 2: Real Order Book Match Sell
    const obMatch = matchOrderBook(targetPol.orderBook || generateMockOrderBook(targetPol.currentPrice), 'SELL', Math.max(1, targetPol.currentPrice - 1000), shares);
    const totalRefund = obMatch.totalCostOrRefund || shares * targetPol.currentPrice;

    const newSpotPrice = obMatch.avgExecutedPrice || targetPol.currentPrice;
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
          volume24h: p.volume24h + totalRefund,
          totalVolume: p.totalVolume + totalRefund,
          priceHistory: newHistory,
          orderBook: obMatch.updatedOrderBook,
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
      pricePerShare: obMatch.avgExecutedPrice,
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

    // Update Briefing Instantly on Real Execution
    setBriefing(generateMarketBriefing(updatedPolsList.length > 0 ? updatedPolsList : politicians, newOrder));

    return { 
      success: true, 
      message: `[Phase 2 호가 체결] ${targetPol.name} POLI주식 ${shares}주 매도 완료! (+${totalRefund.toLocaleString()} P 입금)` 
    };
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
