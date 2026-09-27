import { Holding } from '../../../types';
import { WeeklyPulseSummary } from '../types/pulseTypes';

export interface DividendItemBreakdown {
  politicianId: string;
  politicianName: string;
  type: 'BEST_DIVIDEND' | 'WORST_PENALTY';
  shares: number;
  ratePerShare: number;
  amount: number; // positive for dividend, negative for penalty
}

export interface WeeklySettlementResult {
  totalDividend: number;
  totalPenalty: number;
  netAmount: number;
  breakdown: DividendItemBreakdown[];
  qualifiedBestCount: number;
  qualifiedWorstCount: number;
  isQuorumMet: boolean;
}

export const MIN_VOTES_REQUIRED = 31; // 30명 초과 = 최소 31표 이상

// 순위별 배당/감액 단가 (1위 3,000P / 2위 2,000P / 3위 1,000P/주)
export function getRankRewardRate(rankIndex: number): number {
  if (rankIndex === 0) return 3000;
  if (rankIndex === 1) return 2000;
  if (rankIndex === 2) return 1000;
  return 1000;
}

export function calculateWeeklySettlement(
  holdingsMap: Record<string, Holding> = {},
  weeklySummary: WeeklyPulseSummary
): WeeklySettlementResult {
  let totalDividend = 0;
  let totalPenalty = 0;
  const breakdown: DividendItemBreakdown[] = [];

  const totalUsers = weeklySummary.totalUsersCount || 50;
  const quorum30Pct = totalUsers * 0.30;

  // Filter politicians who satisfy BOTH conditions (득표수 > 30명 AND 득표수 > 전체 유저 30%)
  const qualifiedBestPols = weeklySummary.bestTop3.filter(b => b.voteCount >= MIN_VOTES_REQUIRED && b.voteCount > quorum30Pct);
  const qualifiedWorstPols = weeklySummary.worstTop3.filter(w => w.voteCount >= MIN_VOTES_REQUIRED && w.voteCount > quorum30Pct);

  Object.values(holdingsMap).forEach(holding => {
    if (!holding || holding.shares <= 0) return;

    const polId = holding.politicianId;

    // Check Best Top 3 Rank
    const bestRankIdx = qualifiedBestPols.findIndex(b => b.politicianId === polId);
    if (bestRankIdx !== -1) {
      const bestPol = qualifiedBestPols[bestRankIdx];
      const ratePerShare = getRankRewardRate(bestRankIdx);
      const amount = holding.shares * ratePerShare;

      totalDividend += amount;
      breakdown.push({
        politicianId: polId,
        politicianName: bestPol.politicianName,
        type: 'BEST_DIVIDEND',
        shares: holding.shares,
        ratePerShare: ratePerShare,
        amount: amount,
      });
    }

    // Check Worst Top 3 Rank
    const worstRankIdx = qualifiedWorstPols.findIndex(w => w.politicianId === polId);
    if (worstRankIdx !== -1) {
      const worstPol = qualifiedWorstPols[worstRankIdx];
      const ratePerShare = getRankRewardRate(worstRankIdx);
      const amount = holding.shares * ratePerShare;

      totalPenalty += amount;
      breakdown.push({
        politicianId: polId,
        politicianName: worstPol.politicianName,
        type: 'WORST_PENALTY',
        shares: holding.shares,
        ratePerShare: ratePerShare,
        amount: -amount,
      });
    }
  });

  const netAmount = totalDividend - totalPenalty;
  const isQuorumMet = qualifiedBestPols.length > 0 || qualifiedWorstPols.length > 0;

  return {
    totalDividend,
    totalPenalty,
    netAmount,
    breakdown,
    qualifiedBestCount: qualifiedBestPols.length,
    qualifiedWorstCount: qualifiedWorstPols.length,
    isQuorumMet,
  };
}
