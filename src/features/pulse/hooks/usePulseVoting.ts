import { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import { PulseVoteRecord, WeeklyPulseSummary, PoliticianVoteCount } from '../types/pulseTypes';
import { calculateWeeklySettlement, WeeklySettlementResult } from '../utils/pulseSettlement';

const LOCAL_STORAGE_PULSE_KEY = 'politrade_pulse_votes_v1';
const LOCAL_STORAGE_SETTLED_KEY = 'politrade_pulse_settled_v1';
const DAILY_VOTE_REWARD = 100;
const BEST_REVIEW_REWARD = 2000;

export function usePulseVoting() {
  const { user, politicians, awardUserPoints } = useStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const [votes, setVotes] = useState<PulseVoteRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PULSE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { /* fallback */ }
    }

    // Seed mock data for last 7 days so weekly chart & reviews look alive immediately
    return [
      {
        id: 'pv_1',
        userId: 'user_mock_1',
        userName: '여의도취재반장',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        date: todayStr,
        bestPoliticianIds: ['POL03', 'POL01', 'POL04'],
        worstPoliticianIds: ['POL02', 'POL05', 'POL07'],
        oneLineReview: '우원식 국회의장의 상임위 중재안과 이준석 의원의 반도체 특구 법안이 실질적 민생 도움이 됨!',
        likes: 24,
        createdAt: '1시간 전',
      },
      {
        id: 'pv_2',
        userId: 'user_mock_2',
        userName: '정책모니터링단',
        date: todayStr,
        bestPoliticianIds: ['POL03', 'POL01', 'POL06'],
        worstPoliticianIds: ['POL02', 'POL08', 'POL09'],
        oneLineReview: '청년 기술 스타트업 육성법 발의한 이준석 의원에 1표! 야당 중재 노고 인정합니다.',
        likes: 18,
        createdAt: '3시간 전',
      },
      {
        id: 'pv_3',
        userId: 'user_mock_3',
        userName: '데이터청년',
        date: todayStr,
        bestPoliticianIds: ['POL04', 'POL01', 'POL03'],
        worstPoliticianIds: ['POL05', 'POL07', 'POL10'],
        oneLineReview: '박주민 보건복지위원장의 약자 복지 입법 속도감이 돋보입니다. 의료 공백 중재 기대!',
        likes: 12,
        createdAt: '5시간 전',
      },
      {
        id: 'pv_4',
        userId: 'user_mock_4',
        userName: '의정관찰자',
        date: todayStr,
        bestPoliticianIds: ['POL01', 'POL04', 'POL06'],
        worstPoliticianIds: ['POL02', 'POL05', 'POL09'],
        oneLineReview: '국회의장의 공정한 민생 안건 안배에 깊이 동의합니다. 민생 위기 극복에 집중해 주세요.',
        likes: 8,
        createdAt: '7시간 전',
      },
    ];
  });

  const [settledDate, setSettledDate] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_SETTLED_KEY);
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PULSE_KEY, JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    if (settledDate) {
      localStorage.setItem(LOCAL_STORAGE_SETTLED_KEY, settledDate);
    }
  }, [settledDate]);

  // Check if current user voted today
  const hasVotedToday = votes.some(v => v.userId === (user?.verifiedEmail || user?.name || 'user') && v.date === todayStr);

  // Submit new vote
  const submitDailyVote = (
    bestIds: string[],
    worstIds: string[],
    review?: string
  ): { success: boolean; message: string } => {
    if (hasVotedToday) {
      return { success: false, message: '오늘 이미 Best/Worst 투표에 참여하셨습니다. 매일 1회만 투표 가능합니다.' };
    }

    if (bestIds.length === 0 && worstIds.length === 0) {
      return { success: false, message: 'Best 의원 또는 Worst 의원을 최소 1인 이상 선택해 주세요.' };
    }

    const userId = user?.verifiedEmail || user?.name || 'user';
    const newRecord: PulseVoteRecord = {
      id: 'pv_' + Date.now(),
      userId,
      userName: user?.name || '참여회원',
      userAvatar: user?.avatar,
      date: todayStr,
      bestPoliticianIds: bestIds,
      worstPoliticianIds: worstIds,
      oneLineReview: review?.trim() || undefined,
      likes: 0,
      createdAt: '방금 전',
    };

    setVotes(prev => [newRecord, ...prev]);

    // Award +100 Points to user balance
    if (awardUserPoints) {
      awardUserPoints(DAILY_VOTE_REWARD);
    }

    return {
      success: true,
      message: `🎉 투표 제출 완료! 참여 보상 (+${DAILY_VOTE_REWARD} P)이 즉시 적립되었습니다.`,
    };
  };

  // Like a review
  const likeReview = (reviewId: string) => {
    setVotes(prev =>
      prev.map(v => (v.id === reviewId ? { ...v, likes: v.likes + 1 } : v))
    );
  };

  // Calculate 7-Day Cumulative Weekly Summary
  const calculateWeeklySummary = (): WeeklyPulseSummary => {
    const bestCounts: Record<string, number> = {};
    const worstCounts: Record<string, number> = {};

    votes.forEach(record => {
      record.bestPoliticianIds.forEach(id => {
        bestCounts[id] = (bestCounts[id] || 0) + 1;
      });
      record.worstPoliticianIds.forEach(id => {
        worstCounts[id] = (worstCounts[id] || 0) + 1;
      });
    });

    const buildTopList = (countsMap: Record<string, number>): PoliticianVoteCount[] => {
      return Object.entries(countsMap)
        .map(([id, count]) => {
          const pol = politicians.find(p => p.id === id);
          return {
            politicianId: id,
            politicianName: pol ? pol.name : id,
            party: pol ? pol.party : '무소속',
            imageUrl: pol ? pol.imageUrl : '',
            voteCount: count,
          };
        })
        .sort((a, b) => b.voteCount - a.voteCount)
        .slice(0, 3);
    };

    const bestTop3 = buildTopList(bestCounts);
    const worstTop3 = buildTopList(worstCounts);

    // Reviews with text, sorted by likes
    const reviewsWithText = votes
      .filter(v => v.oneLineReview && v.oneLineReview.length > 0)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    return {
      startDate: '최근 7일',
      endDate: todayStr,
      totalVotesCount: votes.length,
      bestTop3,
      worstTop3,
      bestReviews: reviewsWithText,
    };
  };

  const weeklySummary = calculateWeeklySummary();
  const userSettlement: WeeklySettlementResult = calculateWeeklySettlement(user?.holdings || {}, weeklySummary);

  const hasSettledThisWeek = settledDate === todayStr;

  const executeWeeklySettlement = (): { success: boolean; message: string } => {
    if (userSettlement.netAmount === 0 && userSettlement.breakdown.length === 0) {
      return {
        success: false,
        message: '현재 주간 Best 3 / Worst 3 해당 의원의 주식을 보유하고 있지 않습니다.',
      };
    }

    if (hasSettledThisWeek) {
      return {
        success: false,
        message: '이번 주 주간 배당금 및 감액 정산이 이미 완료되었습니다.',
      };
    }

    if (awardUserPoints) {
      awardUserPoints(userSettlement.netAmount);
    }

    setSettledDate(todayStr);

    const sign = userSettlement.netAmount >= 0 ? '+' : '';
    return {
      success: true,
      message: `🎉 [주간 정산 완료] Best3 배당금 (+${userSettlement.totalDividend.toLocaleString()}P) 및 Worst3 감액 (-${userSettlement.totalPenalty.toLocaleString()}P) 정산으로 순 ${sign}${userSettlement.netAmount.toLocaleString()} P가 잔고에 반영되었습니다!`,
    };
  };

  return {
    votes,
    hasVotedToday,
    submitDailyVote,
    likeReview,
    weeklySummary,
    userSettlement,
    hasSettledThisWeek,
    executeWeeklySettlement,
    DAILY_VOTE_REWARD,
    BEST_REVIEW_REWARD,
  };
}
