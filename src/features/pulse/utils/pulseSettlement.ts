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
}

export const DIVIDEND_PER_SHARE = 1000;
export const PENALTY_PER_SHARE = 1000;

export function calculateWeeklySettlement(
  holdingsMap: Record<string, Holding> = {},
  weeklySummary: WeeklyPulseSummary
): WeeklySettlementResult {
  let totalDividend = 0;
  let totalPenalty = 0;
  const breakdown: DividendItemBreakdown[] = [];

  const bestIds = weeklySummary.bestTop3.map(b => b.politicianId);
  const worstIds = weeklySummary.worstTop3.map(w => w.politicianId);

  Object.values(holdingsMap).forEach(holding => {
    if (!holding || holding.shares <= 0) return;

    const polId = holding.politicianId;
    const isBest = bestIds.includes(polId);
    const isWorst = worstIds.includes(polId);

    if (isBest) {
      const bestPol = weeklySummary.bestTop3.find(b => b.politicianId === polId);
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
      const worstPol = weeklySummary.worstTop3.find(w => w.politicianId === polId);
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

  return {
    totalDividend,
    totalPenalty,
    netAmount,
    breakdown,
  };
}
