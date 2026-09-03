import { useStore } from '../../../context/StoreContext';

export function usePortfolioStats() {
  const { user, politicians } = useStore();

  let holdingsValue = 0;
  let totalCostBasis = 0;

  Object.values(user.holdings).forEach(holding => {
    const pol = politicians.find(p => p.id === holding.politicianId);
    if (pol && holding.shares > 0) {
      holdingsValue += pol.currentPrice * holding.shares;
      totalCostBasis += holding.totalInvested;
    }
  });

  const totalAsset = user.balance + holdingsValue;
  const netPnL = totalAsset - user.initialBalance;
  const returnRate = user.initialBalance > 0 ? (netPnL / user.initialBalance) * 100 : 0;
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
