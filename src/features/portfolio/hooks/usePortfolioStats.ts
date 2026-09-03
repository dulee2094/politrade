import { useStore } from '../../../context/StoreContext';

export function usePortfolioStats() {
  const { user, politicians } = useStore();

  let holdingsValue = 0;
  let totalCostBasis = 0;

  const holdings = user?.holdings || {};

  Object.values(holdings).forEach(holding => {
    if (!holding) return;
    const pol = politicians.find(p => p.id === holding.politicianId);
    if (pol && holding.shares > 0) {
      holdingsValue += pol.currentPrice * holding.shares;
      totalCostBasis += holding.totalInvested || 0;
    }
  });

  const balance = user?.balance || 0;
  const initialBalance = user?.initialBalance || 100000;

  const totalAsset = balance + holdingsValue;
  const netPnL = totalAsset - initialBalance;
  const returnRate = initialBalance > 0 ? (netPnL / initialBalance) * 100 : 0;
  const isPositive = netPnL >= 0;

  return {
    user,
    totalAsset,
    holdingsValue,
    totalCostBasis,
    netPnL,
    returnRate,
    isPositive,
  };
}
