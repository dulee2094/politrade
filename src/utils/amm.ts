/**
 * AMM (Constant Product Bonding Curve) Trading Utilities for Politrade
 * Constant Product Formula: ReserveMoney * ReserveShares = K
 */

export interface AMMBuyQuote {
  totalCost: number;        // 결제할 총 가상포인트
  avgPrice: number;         // 주당 평균 체결가
  spotPrice: number;        // 현재 시가
  newSpotPrice: number;     // 매수 후 예상 시가
  priceImpact: number;      // 주가 상승 영향도 (%)
  slippage: number;         // 슬리피지 (%)
}

export interface AMMSellQuote {
  totalRefund: number;      // 환급받을 총 가상포인트
  avgPrice: number;         // 주당 평균 체결가
  spotPrice: number;        // 현재 시가
  newSpotPrice: number;     // 매도 후 예상 시가
  priceImpact: number;      // 주가 하락 영향도 (%)
  slippage: number;         // 슬리피지 (%)
}

/**
 * 현재 Spot Price (시가) 계산
 */
export function getSpotPrice(reserveMoney: number, reserveShares: number): number {
  if (reserveShares <= 0) return 0;
  return Math.round(reserveMoney / reserveShares);
}

/**
 * 매수 견적 계산
 * @param reserveMoney 현재 풀의 가상 포인트 잔액
 * @param reserveShares 현재 풀의 유동 주식 잔액
 * @param sharesToBuy 매수하려는 주식 수
 */
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
  
  // Constant product formula: (R_shares - dS) * (R_money + dM) = R_shares * R_money
  // dM = R_money * (dS / (R_shares - dS))
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

/**
 * 매도 견적 계산
 * @param reserveMoney 현재 풀의 가상 포인트 잔액
 * @param reserveShares 현재 풀의 유동 주식 잔액
 * @param sharesToSell 매도하려는 주식 수
 */
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
  
  // dM = R_money * (dS / (R_shares + dS))
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

/**
 * 주어진 유저 잔액으로 매수 가능한 최대 주식 수
 */
export function calculateMaxBuyShares(
  reserveMoney: number,
  reserveShares: number,
  userBalance: number
): number {
  if (userBalance <= 0 || reserveMoney <= 0) return 0;
  // dS = R_shares * (dM / (R_money + dM))
  const maxShares = Math.floor(reserveShares * (userBalance / (reserveMoney + userBalance)));
  return Math.max(0, maxShares);
}
