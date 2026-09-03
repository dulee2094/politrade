export interface PressVerificationState {
  isVerified: boolean;
  email: string;
  mediaName: string;
  verifiedAt: string;
}

export interface UserAuthProfile {
  id: string;
  name: string;
  avatar: string;
  pressAuth: PressVerificationState;
}
