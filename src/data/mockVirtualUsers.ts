import { ExtendedUserProfile } from '../context/StoreContext';

export interface VirtualUserPersona {
  id: string;
  name: string;
  pressName: string;
  email: string;
  avatar: string;
  balance: number;
  initialBalance: number;
  holdings: Record<string, { politicianId: string; shares: number; avgPrice: number; totalInvested: number }>;
  votedBestIds: string[];
  votedWorstIds: string[];
  oneLineReview: string;
}

export const VIRTUAL_10_USERS: VirtualUserPersona[] = [
  {
    id: 'vu_01',
    name: '여의도취재반장',
    pressName: 'KBS',
    email: 'reporter01@kbs.co.kr',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    balance: 145000,
    initialBalance: 100000,
    holdings: {
      POL01: { politicianId: 'POL01', shares: 5, avgPrice: 10000, totalInvested: 50000 },
      POL03: { politicianId: 'POL03', shares: 3, avgPrice: 12500, totalInvested: 37500 },
    },
    votedBestIds: ['POL01', 'POL03', 'POL04'],
    votedWorstIds: ['POL02', 'POL05', 'POL07'],
    oneLineReview: '우원식 국회의장의 공정한 중재안과 이준석 의원의 반도체 특구 입법 노고를 드높게 평가함!',
  },
  {
    id: 'vu_02',
    name: '정치모니터링단',
    pressName: 'MBC',
    email: 'reporter02@mbc.co.kr',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    balance: 112000,
    initialBalance: 100000,
    holdings: {
      POL03: { politicianId: 'POL03', shares: 4, avgPrice: 12500, totalInvested: 50000 },
      POL06: { politicianId: 'POL06', shares: 2, avgPrice: 11900, totalInvested: 23800 },
    },
    votedBestIds: ['POL03', 'POL01', 'POL06'],
    votedWorstIds: ['POL02', 'POL08', 'POL09'],
    oneLineReview: '청년 기술 스타트업 육성법을 발의한 이준석 의원에 1표! 입법 속도감이 뛰어남.',
  },
  {
    id: 'vu_03',
    name: '데이터청년',
    pressName: 'SBS',
    email: 'reporter03@sbs.co.kr',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    balance: 128000,
    initialBalance: 100000,
    holdings: {
      POL04: { politicianId: 'POL04', shares: 6, avgPrice: 12800, totalInvested: 76800 },
      POL01: { politicianId: 'POL01', shares: 2, avgPrice: 10000, totalInvested: 20000 },
    },
    votedBestIds: ['POL04', 'POL01', 'POL03'],
    votedWorstIds: ['POL05', 'POL07', 'POL10'],
    oneLineReview: '박주민 보건복지위원장의 약자 복지 입법 속도감이 돋보입니다. 의료 공백 중재 기대!',
  },
  {
    id: 'vu_04',
    name: '의정관찰자',
    pressName: 'YTN',
    email: 'reporter04@ytn.co.kr',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    balance: 98000,
    initialBalance: 100000,
    holdings: {
      POL01: { politicianId: 'POL01', shares: 4, avgPrice: 10000, totalInvested: 40000 },
      POL06: { politicianId: 'POL06', shares: 3, avgPrice: 11900, totalInvested: 35700 },
    },
    votedBestIds: ['POL01', 'POL04', 'POL06'],
    votedWorstIds: ['POL02', 'POL05', 'POL09'],
    oneLineReview: '국회의장의 공정한 민생 안건 안배에 깊이 동의합니다. 민생 위기 극복에 집중해 주세요.',
  },
  {
    id: 'vu_05',
    name: '국회데이터랩',
    pressName: 'JTBC',
    email: 'reporter05@jtbc.co.kr',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    balance: 135000,
    initialBalance: 100000,
    holdings: {
      POL03: { politicianId: 'POL03', shares: 5, avgPrice: 12500, totalInvested: 62500 },
    },
    votedBestIds: ['POL03', 'POL08', 'POL01'],
    votedWorstIds: ['POL02', 'POL07', 'POL09'],
    oneLineReview: '반도체 AI 특구 특별법 및 과학기술 입법 주도로 개혁신당 이준석 의원 매수 가치 높음.',
  },
  {
    id: 'vu_06',
    name: '민심분석가',
    pressName: '조선일보',
    email: 'reporter06@chosun.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    balance: 105000,
    initialBalance: 100000,
    holdings: {
      POL05: { politicianId: 'POL05', shares: 3, avgPrice: 11500, totalInvested: 34500 },
      POL07: { politicianId: 'POL07', shares: 4, avgPrice: 11400, totalInvested: 45600 },
    },
    votedBestIds: ['POL05', 'POL07', 'POL03'],
    votedWorstIds: ['POL08', 'POL10', 'POL06'],
    oneLineReview: '안철수 의원의 딥테크 벤처 육성안과 나경원 의원의 저출생 패키지법 적극 동의함.',
  },
  {
    id: 'vu_07',
    name: '정책다이어리',
    pressName: '중앙일보',
    email: 'reporter07@joongang.co.kr',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    balance: 118000,
    initialBalance: 100000,
    holdings: {
      POL01: { politicianId: 'POL01', shares: 3, avgPrice: 10000, totalInvested: 30000 },
      POL08: { politicianId: 'POL08', shares: 4, avgPrice: 12300, totalInvested: 49200 },
    },
    votedBestIds: ['POL08', 'POL01', 'POL04'],
    votedWorstIds: ['POL02', 'POL05', 'POL09'],
    oneLineReview: '정청래 법사위원장의 법안 가속화 정책과 우원식 의장의 합리적 입법 운영 지지!',
  },
  {
    id: 'vu_08',
    name: '청년정치클럽',
    pressName: '동아일보',
    email: 'reporter08@donga.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    balance: 160000,
    initialBalance: 100000,
    holdings: {
      POL03: { politicianId: 'POL03', shares: 7, avgPrice: 12500, totalInvested: 87500 },
    },
    votedBestIds: ['POL03', 'POL04', 'POL01'],
    votedWorstIds: ['POL02', 'POL07', 'POL09'],
    oneLineReview: '청년층 정책에 특화된 이준석 의원에 올인! 7주 보유로 주간 배당금 7,000P 획득 확신.',
  },
  {
    id: 'vu_09',
    name: '핀테크트레이더',
    pressName: '한겨레',
    email: 'reporter09@hani.co.kr',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80',
    balance: 125000,
    initialBalance: 100000,
    holdings: {
      POL04: { politicianId: 'POL04', shares: 5, avgPrice: 12800, totalInvested: 64000 },
      POL06: { politicianId: 'POL06', shares: 3, avgPrice: 11900, totalInvested: 35700 },
    },
    votedBestIds: ['POL04', 'POL06', 'POL10'],
    votedWorstIds: ['POL02', 'POL05', 'POL07'],
    oneLineReview: '박주민 보건복지위원장과 박찬대 원내대표의 민생 회복 법안 입법 속도에 기대감.',
  },
  {
    id: 'vu_10',
    name: '입법탐정',
    pressName: '경향신문',
    email: 'reporter10@khan.co.kr',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    balance: 110000,
    initialBalance: 100000,
    holdings: {
      POL01: { politicianId: 'POL01', shares: 6, avgPrice: 10000, totalInvested: 60000 },
    },
    votedBestIds: ['POL01', 'POL03', 'POL08'],
    votedWorstIds: ['POL02', 'POL09', 'POL05'],
    oneLineReview: '국회의장 공모 청약으로 안정적 6주 확보! 매주 +6,000P 주주 배당 수익 창출 중.',
  },
];
