import { ExtendedUserProfile } from '../../context/StoreContext';

export const MONTHLY_ALLOWANCE_AMOUNT = 100000; // 100,000 P 매월 초 정기 지원금

export interface MonthlyAllowanceResult {
  granted: boolean;
  amount: number;
  monthKey: string;
  message?: string;
}

/**
 * Check if the user is eligible for the current month's automatic allowance (1st of every month or monthly check)
 */
export function checkMonthlyAllowance(user: ExtendedUserProfile): { updatedUser: ExtendedUserProfile; result: MonthlyAllowanceResult } {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const lastClaimed = (user as any).lastAllowanceMonth || '';

  if (lastClaimed !== currentMonthKey) {
    const updatedUser: ExtendedUserProfile = {
      ...user,
      balance: user.balance + MONTHLY_ALLOWANCE_AMOUNT,
      ...( { lastAllowanceMonth: currentMonthKey } as any),
    };

    return {
      updatedUser,
      result: {
        granted: true,
        amount: MONTHLY_ALLOWANCE_AMOUNT,
        monthKey: currentMonthKey,
        message: `📅 ${now.getMonth() + 1}월 정기 지원금 ${MONTHLY_ALLOWANCE_AMOUNT.toLocaleString()} P가 자동으로 입금되었습니다!`,
      },
    };
  }

  return {
    updatedUser: user,
    result: {
      granted: false,
      amount: 0,
      monthKey: currentMonthKey,
    },
  };
}
