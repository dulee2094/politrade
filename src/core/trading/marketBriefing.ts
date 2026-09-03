import { Politician, TradeOrder } from '../../types';
import { formatPoints, formatPercent } from '../utils/formatters';

export interface DailyMarketBriefing {
  title: string;
  timestamp: string;
  topGainerName: string;
  topGainerChange: number;
  topVolumeName: string;
  topVolumeAmount: number;
  latestTradeText: string;
  commentary: string;
  phase2Count: number;
  ipoCount: number;
}

export const IS_REALTIME_BRIEFING_TEST = true; // Instantly update briefing on every trade execution!

export function generateMarketBriefing(
  politicians: Politician[],
  lastOrder?: TradeOrder
): DailyMarketBriefing {
  const sortedByChange = [...politicians].sort((a, b) => b.change24h - a.change24h);
  const sortedByVolume = [...politicians].sort((a, b) => b.volume24h - a.volume24h);

  const topGainer = sortedByChange[0] || politicians[0];
  const topVolume = sortedByVolume[0] || politicians[0];

  const phase2Count = politicians.filter(p => p.phase === 'ORDER_BOOK').length;
  const ipoCount = politicians.filter(p => p.phase === 'IPO').length;

  const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let latestTradeText = '아직 금일 체결 내역이 없습니다.';
  if (lastOrder) {
    const isBuy = lastOrder.type === 'BUY';
    latestTradeText = `[방금 체결!] ${lastOrder.politicianName} POLI주식 ${lastOrder.shares}주 ${isBuy ? '매수' : '매도'} (체결가: ${formatPoints(lastOrder.pricePerShare)} / 총액: ${formatPoints(lastOrder.totalPoints)})`;
  }

  let commentary = '';
  if (topGainer) {
    commentary = `금일 최고 상승 종목은 ${topGainer.name} POLI주식(${formatPercent(topGainer.change24h)})이며, 최고 수급 종목은 ${topVolume.name}(${formatPoints(topVolume.volume24h)})입니다. `;
    if (phase2Count > 0) {
      commentary += `총 ${phase2Count}개 종목이 10주 공모 완판에 성공하여 Phase 2 호가창 실시간 매매 정규 시장에서 활발히 거래되고 있습니다.`;
    } else {
      commentary += `현재 10인 의원 전 종목이 Phase 1 공모가(10,000 P) 정액 청약 단계에 있으며, 10주 완판 시 즉시 호가창 시장으로 상장 전환됩니다.`;
    }
  }

  return {
    title: '📊 POLI주식 실시간 매매 체결 시황 리포트',
    timestamp: nowStr,
    topGainerName: topGainer ? topGainer.name : '-',
    topGainerChange: topGainer ? topGainer.change24h : 0,
    topVolumeName: topVolume ? topVolume.name : '-',
    topVolumeAmount: topVolume ? topVolume.volume24h : 0,
    latestTradeText,
    commentary,
    phase2Count,
    ipoCount,
  };
}
