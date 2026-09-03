import { AMMBuyQuote, AMMSellQuote } from '../../utils/amm';

export function getSpotPrice(reserveMoney: number, reserveShares: number): number {
  if (reserveShares <= 0) return 0;
  return Math.round(reserveMoney / reserveShares);
}

export function calculateBuyQuote(
  reserveMoney: number,
  reserveShares: number,
  sharesToBuy: number
): AMMBuyQuote {
  if (sharesToBuy <= 0 || sharesToBuy >= reserveShares) {
    const spot = getSpotPrice(reserveMoney, reserveShares);
    return {
      totalCost: 0,
      avgPrice: spot,
      spotPrice: spot,
      newSpotPrice: spot,
      priceImpact: 0,
      slippage: 0,
    };
  }

  const currentSpot = getSpotPrice(reserveMoney, reserveShares);
  const totalCost = Math.ceil(reserveMoney * (sharesToBuy / (reserveShares - sharesToBuy)));
  const avgPrice = Math.round(totalCost / sharesToBuy);
  
  const newReserveShares = reserveShares - sharesToBuy;
  const newReserveMoney = reserveMoney + totalCost;
  const newSpotPrice = Math.round(newReserveMoney / newReserveShares);
  
  const priceImpact = ((newSpotPrice - currentSpot) / currentSpot) * 100;
  const slippage = ((avgPrice - currentSpot) / currentSpot) * 100;

  return {
    totalCost,
    avgPrice,
    spotPrice: currentSpot,
    newSpotPrice,
    priceImpact: parseFloat(priceImpact.toFixed(2)),
    slippage: parseFloat(slippage.toFixed(2)),
  };
}

export function calculateSellQuote(
  reserveMoney: number,
  reserveShares: number,
  sharesToSell: number
): AMMSellQuote {
  if (sharesToSell <= 0) {
    const spot = getSpotPrice(reserveMoney, reserveShares);
    return {
      totalRefund: 0,
      avgPrice: spot,
      spotPrice: spot,
      newSpotPrice: spot,
      priceImpact: 0,
      slippage: 0,
    };
  }

  const currentSpot = getSpotPrice(reserveMoney, reserveShares);
  const totalRefund = Math.floor(reserveMoney * (sharesToSell / (reserveShares + sharesToSell)));
  const avgPrice = Math.round(totalRefund / sharesToSell);
  
  const newReserveShares = reserveShares + sharesToSell;
  const newReserveMoney = reserveMoney - totalRefund;
  const newSpotPrice = Math.round(newReserveMoney / newReserveShares);

  const priceImpact = ((newSpotPrice - currentSpot) / currentSpot) * 100;
  const slippage = ((currentSpot - avgPrice) / currentSpot) * 100;

  return {
    totalRefund,
    avgPrice,
    spotPrice: currentSpot,
    newSpotPrice,
    priceImpact: parseFloat(priceImpact.toFixed(2)),
    slippage: parseFloat(slippage.toFixed(2)),
  };
}

export function calculateMaxBuyShares(
  reserveMoney: number,
  reserveShares: number,
  userBalance: number
): number {
  if (userBalance <= 0 || reserveMoney <= 0) return 0;
  const maxShares = Math.floor(reserveShares * (userBalance / (reserveMoney + userBalance)));
  return Math.max(0, maxShares);
}
