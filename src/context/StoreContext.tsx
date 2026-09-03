import React, { createContext, useContext, useState, useEffect } from 'react';
import { Politician, UserProfile, CommentItem, Holding, TradeOrder } from '../types';
import { INITIAL_POLITICIANS } from '../data/mockPoliticians';
import { INITIAL_COMMENTS } from '../data/mockCommunity';
import { calculateBuyQuote, calculateSellQuote, getSpotPrice } from '../utils/amm';
import { checkMonthlyAllowance, MONTHLY_ALLOWANCE_AMOUNT } from '../core/allowance/monthlyAllowance';

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
}

const LOCAL_STORAGE_KEY_USER = 'politrade_user_v4';
const LOCAL_STORAGE_KEY_POLS = 'politrade_pols_v4';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politicians, setPoliticians] = useState<Politician[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POLS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
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

  // Simulated live market price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setPoliticians(prevPols => {
        return prevPols.map(pol => {
          if (Math.random() > 0.4) return pol;
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
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getPoliticianById = (id: string) => politicians.find(p => p.id === id);

  const buyStock = (politicianId: string, shares: number) => {
    const targetPol = getPoliticianById(politicianId);
    if (!targetPol) return { success: false, message: '정치인 정보를 찾을 수 없습니다.' };
    if (shares <= 0) return { success: false, message: '올바른 매수 수량을 입력해 주세요.' };

    const quote = calculateBuyQuote(targetPol.reserveMoney, targetPol.reserveShares, shares);
    if (user.balance < quote.totalCost) {
      return { 
        success: false, 
        message: `포인트가 부족합니다. (필요: ${quote.totalCost.toLocaleString()} P / 보유: ${user.balance.toLocaleString()} P)` 
      };
    }

    const newReserveShares = targetPol.reserveShares - shares;
    const newReserveMoney = targetPol.reserveMoney + quote.totalCost;
    const newSpotPrice = getSpotPrice(newReserveMoney, newReserveShares);
    const newChange24h = parseFloat((((newSpotPrice - targetPol.previousClose) / targetPol.previousClose) * 100).toFixed(2));

    const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    setPoliticians(prev => prev.map(p => {
      if (p.id !== politicianId) return p;
      return {
        ...p,
        reserveShares: newReserveShares,
        reserveMoney: newReserveMoney,
        currentPrice: newSpotPrice,
        change24h: newChange24h,
        high24h: Math.max(p.high24h, newSpotPrice),
        volume24h: p.volume24h + quote.totalCost,
        totalVolume: p.totalVolume + quote.totalCost,
        priceHistory: [...p.priceHistory, { time: nowStr, price: newSpotPrice, volume: shares * 100 }],
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
      const newTotalInvested = existingHolding.totalInvested + quote.totalCost;
      const newAvgPrice = Math.round(newTotalInvested / newTotalShares);

      const newOrder: TradeOrder = {
        id: 'ord_' + Date.now(),
        politicianId,
        politicianName: targetPol.name,
        type: 'BUY',
        shares,
        pricePerShare: quote.avgPrice,
        totalPoints: quote.totalCost,
        timestamp: new Date().toLocaleString('ko-KR'),
      };

      return {
        ...prevUser,
        balance: prevUser.balance - quote.totalCost,
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
      message: `${targetPol.name} ${shares}주 매수 완료! (${quote.totalCost.toLocaleString()} P 차감)` 
    };
  };

  const sellStock = (politicianId: string, shares: number) => {
    const targetPol = getPoliticianById(politicianId);
    if (!targetPol) return { success: false, message: '정치인 정보를 찾을 수 없습니다.' };

    const userHolding = user.holdings[politicianId];
    if (!userHolding || userHolding.shares < shares) {
      return { success: false, message: '매도 가능한 보유 주식이 부족합니다.' };
    }
    if (shares <= 0) return { success: false, message: '올바른 매도 수량을 입력해 주세요.' };

    const quote = calculateSellQuote(targetPol.reserveMoney, targetPol.reserveShares, shares);

    const newReserveShares = targetPol.reserveShares + shares;
    const newReserveMoney = targetPol.reserveMoney - quote.totalRefund;
    const newSpotPrice = getSpotPrice(newReserveMoney, newReserveShares);
    const newChange24h = parseFloat((((newSpotPrice - targetPol.previousClose) / targetPol.previousClose) * 100).toFixed(2));

    const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    setPoliticians(prev => prev.map(p => {
      if (p.id !== politicianId) return p;
      return {
        ...p,
        reserveShares: newReserveShares,
        reserveMoney: newReserveMoney,
        currentPrice: newSpotPrice,
        change24h: newChange24h,
        low24h: Math.min(p.low24h, newSpotPrice),
        volume24h: p.volume24h + quote.totalRefund,
        totalVolume: p.totalVolume + quote.totalRefund,
        priceHistory: [...p.priceHistory, { time: nowStr, price: newSpotPrice, volume: shares * 100 }],
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
        pricePerShare: quote.avgPrice,
        totalPoints: quote.totalRefund,
        timestamp: new Date().toLocaleString('ko-KR'),
      };

      return {
        ...prevUser,
        balance: prevUser.balance + quote.totalRefund,
        holdings: updatedHoldings,
        tradeHistory: [newOrder, ...prevUser.tradeHistory],
      };
    });

    return { 
      success: true, 
      message: `${targetPol.name} ${shares}주 매도 완료! (+${quote.totalRefund.toLocaleString()} P 입금)` 
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
