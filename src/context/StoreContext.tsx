import React, { createContext, useContext, useState, useEffect } from 'react';
import { Politician, UserProfile, CommentItem, Holding, TradeOrder } from '../types';
import { INITIAL_POLITICIANS } from '../data/mockPoliticians';
import { INITIAL_COMMENTS } from '../data/mockCommunity';
import { calculateBuyQuote, calculateSellQuote, getSpotPrice } from '../utils/amm';
import { checkMonthlyAllowance } from '../core/allowance/monthlyAllowance';
import { getMarketStatus } from '../core/trading/marketHours';
import { INITIAL_IPO_PRICE, generateMockOrderBook, matchOrderBook } from '../core/orderbook/orderbookEngine';

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
  resetAllCache: () => void;
}

const LOCAL_STORAGE_KEY_USER = 'politrade_user_v12';
const LOCAL_STORAGE_KEY_POLS = 'politrade_pols_v12';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always force fresh politicians data on version bump v12
  const [politicians, setPoliticians] = useState<Politician[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POLS);
    if (saved) {
      try { 
        const parsed: Politician[] = JSON.parse(saved); 
        return INITIAL_POLITICIANS.map(initPol => {
          const cached = parsed.find(p => p.id === initPol.id);
          if (!cached) return initPol;
          return {
            ...cached,
            imageUrl: initPol.imageUrl,
            name: initPol.name,
            party: initPol.party,
            district: initPol.district,
            title: initPol.title,
            phase: cached.phase || initPol.phase,
            ipoSoldShares: cached.ipoSoldShares ?? initPol.ipoSoldShares,
            ipoTargetShares: initPol.ipoTargetShares,
            orderBook: cached.orderBook || initPol.orderBook,
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
        initialUser = JSON.parse(saved); 
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

  // Simulated live market price ticks for Phase 2 OrderBook stocks
  useEffect(() => {
    const interval = setInterval(() => {
      setPoliticians(prevPols => {
        return prevPols.map(pol => {
          if (pol.phase === 'IPO' || Math.random() > 0.4) return pol;
          const deltaShares = Math.floor(Math.random() * 3) + 1;
          const isBuy = Math.random() > 0.48;
          
          let newReserveMoney = pol.reserveMoney;
          let newReserveShares = pol.reserveShares;

          if (isBuy) {
            const quote = calculateBuyQuote(pol.reserveMoney, pol.reserveShares, deltaShares);
            newReserveShares -= deltaShares;
            newReserveMoney += quote.totalCost;
          } else {
            const quote = calculateSellQuote(pol.reserveMoney, pol.reserveShares, deltaShares);
            newReserveShares += deltaShares;
            newReserveMoney -= quote.totalRefund;
          }

          const newSpot = getSpotPrice(newReserveMoney, newReserveShares);
          const changePct = parseFloat((((newSpot - pol.previousClose) / pol.previousClose) * 100).toFixed(2));
          
          const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newHistory = [...pol.priceHistory, { time: nowStr, price: newSpot, volume: deltaShares * 100 }];
          if (newHistory.length > 20) newHistory.shift();

          return {
            ...pol,
            reserveMoney: newReserveMoney,
            reserveShares: newReserveShares,
            currentPrice: newSpot,
            change24h: changePct,
            high24h: Math.max(pol.high24h, newSpot),
            low24h: Math.min(pol.low24h, newSpot),
            volume24h: pol.volume24h + newSpot * deltaShares,
            priceHistory: newHistory,
            orderBook: generateMockOrderBook(newSpot),
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getPoliticianById = (id: string) => politicians.find(p => p.id === id);

  const buyStock = (politicianId: string, shares: number) => {
    // Check Market Hours Enforcement
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
      // Phase 1: Fixed 10,000 P Public Offering
      const totalCost = shares * INITIAL_IPO_PRICE;
      if (user.balance < totalCost) {
        return {
          success: false,
          message: `포인트가 부족합니다. (필요: ${totalCost.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)`,
        };
      }

      const newSold = targetPol.ipoSoldShares + shares;
      const isCompleted = newSold >= targetPol.ipoTargetShares;

      setPoliticians(prev => prev.map(p => {
        if (p.id !== politicianId) return p;
        return {
          ...p,
          phase: isCompleted ? 'ORDER_BOOK' : 'IPO',
          ipoSoldShares: Math.min(p.ipoTargetShares, newSold),
          currentPrice: INITIAL_IPO_PRICE,
          orderBook: isCompleted ? generateMockOrderBook(INITIAL_IPO_PRICE) : p.orderBook,
        };
      }));

      setUser(prevUser => {
        const existingHolding: Holding = prevUser.holdings[politicianId] || {
          politicianId,
          shares: 0,
          avgPrice: 0,
          totalInvested: 0,
        };

        const newTotalShares = existingHolding.shares + shares;
        const newTotalInvested = existingHolding.totalInvested + totalCost;
        const newAvgPrice = Math.round(newTotalInvested / newTotalShares);

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

        return {
          ...prevUser,
          balance: prevUser.balance - totalCost,
          holdings: {
            ...prevUser.holdings,
            [politicianId]: {
              politicianId,
              shares: newTotalShares,
              avgPrice: newAvgPrice,
              totalInvested: newTotalInvested,
            },
          },
          tradeHistory: [newOrder, ...prevUser.tradeHistory],
        };
      });

      if (isCompleted) {
        alert(`🎉 축하합니다! ${targetPol.name} POLI주식이 1,000주 공모 완판되어 Phase 2 실시간 호가창 정규 시장으로 즉시 상장 전환되었습니다!`);
      }

      return {
        success: true,
        message: `[Phase 1 공모 청약] ${targetPol.name} POLI주식 ${shares}주 공모가(10,000 P) 매수 완료!`,
      };
    }

    // Phase 2: Order Book Execution
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

    setPoliticians(prev => prev.map(p => {
      if (p.id !== politicianId) return p;
      return {
        ...p,
        currentPrice: newSpotPrice,
        change24h: newChange24h,
        high24h: Math.max(p.high24h, newSpotPrice),
        volume24h: p.volume24h + totalCost,
        totalVolume: p.totalVolume + totalCost,
        priceHistory: [...p.priceHistory, { time: nowStr, price: newSpotPrice, volume: shares * 100 }],
        orderBook: obMatch.updatedOrderBook,
      };
    }));

    setUser(prevUser => {
      const existingHolding: Holding = prevUser.holdings[politicianId] || {
        politicianId,
        shares: 0,
        avgPrice: 0,
        totalInvested: 0,
      };

      const newTotalShares = existingHolding.shares + shares;
      const newTotalInvested = existingHolding.totalInvested + totalCost;
      const newAvgPrice = Math.round(newTotalInvested / newTotalShares);

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

      return {
        ...prevUser,
        balance: prevUser.balance - totalCost,
        holdings: {
          ...prevUser.holdings,
          [politicianId]: {
            politicianId,
            shares: newTotalShares,
            avgPrice: newAvgPrice,
            totalInvested: newTotalInvested,
          },
        },
        tradeHistory: [newOrder, ...prevUser.tradeHistory],
      };
    });

    return { 
      success: true, 
      message: `[Phase 2 호가 체결] ${targetPol.name} POLI주식 ${shares}주 매수 완료! (${totalCost.toLocaleString()} P 차감)` 
    };
  };

  const sellStock = (politicianId: string, shares: number) => {
    // Check Market Hours Enforcement
    const mStatus = getMarketStatus();
    if (!mStatus.isOpen) {
      return {
        success: false,
        message: `🔴 장 마감: POLI주식 매매는 매일 12:00 ~ 14:00 정규장에만 가능합니다. (${mStatus.countdownText})`,
      };
    }

    const targetPol = getPoliticianById(politicianId);
    if (!targetPol) return { success: false, message: '정치인 정보를 찾을 수 없습니다.' };

    const userHolding = user.holdings[politicianId];
    if (!userHolding || userHolding.shares < shares) {
      return { success: false, message: '매도 가능한 보유 주식이 부족합니다.' };
    }
    if (shares <= 0) return { success: false, message: '올바른 매도 수량을 입력해 주세요.' };

    const isIPO = targetPol.phase === 'IPO';

    if (isIPO) {
      // Phase 1 fixed refund
      const totalRefund = shares * INITIAL_IPO_PRICE;

      setPoliticians(prev => prev.map(p => {
        if (p.id !== politicianId) return p;
        return {
          ...p,
          ipoSoldShares: Math.max(0, p.ipoSoldShares - shares),
        };
      }));

      setUser(prevUser => {
        const remainingShares = userHolding.shares - shares;
        const updatedHoldings = { ...prevUser.holdings };

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

        return {
          ...prevUser,
          balance: prevUser.balance + totalRefund,
          holdings: updatedHoldings,
          tradeHistory: [newOrder, ...prevUser.tradeHistory],
        };
      });

      return {
        success: true,
        message: `[Phase 1 공모 환불] ${targetPol.name} POLI주식 ${shares}주 공모가(10,000 P) 매도 완료! (+${totalRefund.toLocaleString()} P 입금)`,
      };
    }

    // Phase 2: Order Book Match Sell
    const obMatch = matchOrderBook(targetPol.orderBook || generateMockOrderBook(targetPol.currentPrice), 'SELL', Math.max(1, targetPol.currentPrice - 1000), shares);
    const totalRefund = obMatch.totalCostOrRefund || shares * targetPol.currentPrice;

    const newSpotPrice = obMatch.avgExecutedPrice || targetPol.currentPrice;
    const newChange24h = parseFloat((((newSpotPrice - targetPol.previousClose) / targetPol.previousClose) * 100).toFixed(2));
    const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    setPoliticians(prev => prev.map(p => {
      if (p.id !== politicianId) return p;
      return {
        ...p,
        currentPrice: newSpotPrice,
        change24h: newChange24h,
        low24h: Math.min(p.low24h, newSpotPrice),
        volume24h: p.volume24h + totalRefund,
        totalVolume: p.totalVolume + totalRefund,
        priceHistory: [...p.priceHistory, { time: nowStr, price: newSpotPrice, volume: shares * 100 }],
        orderBook: obMatch.updatedOrderBook,
      };
    }));

    setUser(prevUser => {
      const remainingShares = userHolding.shares - shares;
      const updatedHoldings = { ...prevUser.holdings };

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

      return {
        ...prevUser,
        balance: prevUser.balance + totalRefund,
        holdings: updatedHoldings,
        tradeHistory: [newOrder, ...prevUser.tradeHistory],
      };
    });

    return { 
      success: true, 
      message: `[Phase 2 호가 체결] ${targetPol.name} POLI주식 ${shares}주 매도 완료! (+${totalRefund.toLocaleString()} P 입금)` 
    };
  };

  const addComment = (politicianId: string, content: string) => {
    if (!content.trim()) return;
    const isHolder = user.holdings[politicianId] && user.holdings[politicianId].shares > 0;
    
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
