import { CommentItem } from '../types';

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  pressName: string;
  badge?: string;
  returnRate: number;
  totalAsset: number;
  isCurrentUser?: boolean;
}

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: '정치분석통', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', pressName: '조선일보', badge: '조선일보 기자', returnRate: 48.5, totalAsset: 148500 },
  { rank: 2, name: '여의도취재반장', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', pressName: 'KBS', badge: 'KBS 기자', returnRate: 35.2, totalAsset: 135200 },
  { rank: 3, name: '시사포커스', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', pressName: 'MBC', badge: 'MBC 기자', returnRate: 28.9, totalAsset: 128900 },
  { rank: 4, name: '국회입법분석가', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', pressName: 'SBS', badge: 'SBS 기자', returnRate: 19.4, totalAsset: 119400 },
  { rank: 5, name: '민심펄스탐다원', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', pressName: 'JTBC', badge: 'JTBC 기자', returnRate: 12.1, totalAsset: 112100 },
];

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    politicianId: 'POL01',
    userName: '여의도개미',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    content: '민생 법안 관련 뉴스 나오고 오늘 상승세 강하네요. 풀매수 완료했습니다!',
    holdingStatus: 'HOLDER',
    likes: 12,
    timestamp: '5분 전',
  },
  {
    id: 'c2',
    politicianId: 'POL01',
    userName: '국회의원추적기',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    content: '다음 주 대정부 질문 일정 있으니 그때 주가 더 오를 듯합니다.',
    holdingStatus: 'HOLDER',
    likes: 8,
    timestamp: '15분 전',
  },
  {
    id: 'c3',
    politicianId: 'POL03',
    userName: '청년투자자',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    content: '이준석 의원 오늘 거래량 급증 장난 아니네요. 14,000P 돌파 🚀',
    holdingStatus: 'HOLDER',
    likes: 24,
    timestamp: '2분 전',
  },
  {
    id: 'c4',
    politicianId: 'POL02',
    userName: '보수개혁파',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80',
    content: '단기 조정 받는 중인데 지금 가격대가 분할 매수 적기인 것 같습니다.',
    holdingStatus: 'HOLDER',
    likes: 5,
    timestamp: '20분 전',
  },
];
