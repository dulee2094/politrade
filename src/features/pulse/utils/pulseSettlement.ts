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

export const DIVIDEND_PER_SHARE = 1000;
export const PENALTY_PER_SHARE = 1000;
export const MIN_VOTES_REQUIRED = 31; // 30명 초과 = 최소 31표 이상

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

  const bestIds = qualifiedBestPols.map(b => b.politicianId);
  const worstIds = qualifiedWorstPols.map(w => w.politicianId);

  Object.values(holdingsMap).forEach(holding => {
    if (!holding || holding.shares <= 0) return;

    const polId = holding.politicianId;
    const isBest = bestIds.includes(polId);
    const isWorst = worstIds.includes(polId);

    if (isBest) {
      const bestPol = qualifiedBestPols.find(b => b.politicianId === polId);
      const polName = bestPol ? bestPol.politicianName : polId;
      const amount = holding.shares * DIVIDEND_PER_SHARE;

      totalDividend += amount;
      breakdown.push({
        politicianId: polId,
        politicianName: polName,
        type: 'BEST_DIVIDEND',
        shares: holding.shares,
        ratePerShare: DIVIDEND_PER_SHARE,
        amount: amount,
      });
    }

    if (isWorst) {
      const worstPol = qualifiedWorstPols.find(w => w.politicianId === polId);
      const polName = worstPol ? worstPol.politicianName : polId;
      const amount = holding.shares * PENALTY_PER_SHARE;

      totalPenalty += amount;
      breakdown.push({
        politicianId: polId,
        politicianName: polName,
        type: 'WORST_PENALTY',
        shares: holding.shares,
        ratePerShare: PENALTY_PER_SHARE,
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
