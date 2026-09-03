export const REGULAR_MARKET_START_HOUR = 12; // 12:00
export const REGULAR_MARKET_END_HOUR = 14;   // 14:00

// Test Bypass Switch: set to true to allow 24H trading for testing
export const ALLOW_TRADING_24H_TEST = true;

export interface MarketStatus {
  isOpen: boolean;
  message: string;
  nextOpeningText: string;
  countdownText: string;
}

export function getMarketStatus(date: Date = new Date()): MarketStatus {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const isWithinRegularHours = hours >= REGULAR_MARKET_START_HOUR && hours < REGULAR_MARKET_END_HOUR;
  const isOpen = ALLOW_TRADING_24H_TEST || isWithinRegularHours;

  let nextOpen = new Date(date);
  if (hours >= REGULAR_MARKET_END_HOUR) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }
  nextOpen.setHours(REGULAR_MARKET_START_HOUR, 0, 0, 0);

  const diffMs = nextOpen.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const countdownText = `다음 개장(12:00)까지 ${String(diffHours).padStart(2, '0')}시간 ${String(diffMinutes).padStart(2, '0')}분 ${String(diffSeconds).padStart(2, '0')}초`;

  if (isWithinRegularHours) {
    return {
      isOpen: true,
      message: '🟢 POLI주식 정규장 개장 중 (12:00 ~ 14:00)',
      nextOpeningText: '오늘 14:00 장 마감 예정',
      countdownText: '14:00 정규장 운용 중',
    };
  }

  return {
    isOpen: ALLOW_TRADING_24H_TEST ? true : false,
    message: ALLOW_TRADING_24H_TEST
      ? '🔴 정규장 마감 (⚡ 테스트 모드: 24시간 매매 가능)'
      : '🔴 POLI주식 장 마감 (정규장: 매일 12:00 ~ 14:00)',
    nextOpeningText: '다음 개장: 매일 12:00',
    countdownText,
  };
}
