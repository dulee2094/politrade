/**
 * FEATURE FLAG: Set to true if you want to bypass trading hours during development/testing.
 * Set to false for actual 12:00 ~ 14:00 daily trading window enforcement.
 */
export const ALLOW_TRADING_24H_TEST = false;

export interface MarketStatus {
  isOpen: boolean;
  statusText: string;
  countdownText: string;
  nextOpenTimeStr: string;
}

/**
 * Check if current time is within daily trading window (12:00:00 ~ 13:59:59)
 */
export function getMarketStatus(date: Date = new Date()): MarketStatus {
  if (ALLOW_TRADING_24H_TEST) {
    return {
      isOpen: true,
      statusText: '🟢 정규장 진행 중 (24시간 테스트 모드)',
      countdownText: '테스트 모드 활성화됨',
      nextOpenTimeStr: '매일 12:00 ~ 14:00',
    };
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 12:00:00 <= time < 14:00:00
  const isOpen = hours >= 12 && hours < 14;

  if (isOpen) {
    // Remaining time in trading session (until 14:00:00)
    const endMinutes = 59 - minutes;
    const endSeconds = 59 - seconds;
    const remMinsStr = String(endMinutes).padStart(2, '0');
    const remSecsStr = String(endSeconds).padStart(2, '0');

    return {
      isOpen: true,
      statusText: '🟢 POLI주식 정규장 진행 중 (12:00 ~ 14:00)',
      countdownText: `마감까지 0${13 - hours}시간 ${remMinsStr}분 ${remSecsStr}초`,
      nextOpenTimeStr: '매일 12:00 ~ 14:00',
    };
  }

  // Off-hours calculation (next 12:00)
  let targetDate = new Date(date);
  if (hours >= 14) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  targetDate.setHours(12, 0, 0, 0);

  const diffMs = targetDate.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

  const hStr = String(diffHours).padStart(2, '0');
  const mStr = String(diffMins).padStart(2, '0');
  const sStr = String(diffSecs).padStart(2, '0');

  return {
    isOpen: false,
    statusText: '🔴 장 마감 (정규장: 매일 12:00 ~ 14:00)',
    countdownText: `다음 개장(12:00)까지 ${hStr}시간 ${mStr}분 ${sStr}초`,
    nextOpenTimeStr: '매일 12:00 ~ 14:00',
  };
}
