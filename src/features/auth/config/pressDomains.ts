export interface PressMedia {
  domain: string;
  name: string;
  category: '방송/보도' | '신문/일간지' | '경제지' | '통신/인터넷' | 'IT/전문지';
}

/**
 * FEATURE FLAG: Set to true during test phase to allow any arbitrary email/ID.
 * Set to false when ready for production strict press domain verification.
 */
export const IS_TEST_BYPASS_MODE = true;

export const PRESS_DOMAINS_LIST: PressMedia[] = [
  // 지상파 / 보도전문 / 종편
  { domain: 'kbs.co.kr', name: 'KBS 한국방송', category: '방송/보도' },
  { domain: 'sbs.co.kr', name: 'SBS', category: '방송/보도' },
  { domain: 'mbc.co.kr', name: 'MBC', category: '방송/보도' },
  { domain: 'ytn.co.kr', name: 'YTN', category: '방송/보도' },
  { domain: 'yonhapnewstv.co.kr', name: '연합뉴스TV', category: '방송/보도' },
  { domain: 'jtbc.co.kr', name: 'JTBC', category: '방송/보도' },
  { domain: 'tvchosun.com', name: 'TV조선', category: '방송/보도' },
  { domain: 'mbn.co.kr', name: 'MBN', category: '방송/보도' },
  { domain: 'ichannela.com', name: '채널A', category: '방송/보도' },

  // 주요 일간지
  { domain: 'chosun.com', name: '조선일보', category: '신문/일간지' },
  { domain: 'joongang.co.kr', name: '중앙일보', category: '신문/일간지' },
  { domain: 'donga.com', name: '동아일보', category: '신문/일간지' },
  { domain: 'hani.co.kr', name: '한겨레', category: '신문/일간지' },
  { domain: 'khan.co.kr', name: '경향신문', category: '신문/일간지' },
  { domain: 'seoul.co.kr', name: '서울신문', category: '신문/일간지' },
  { domain: 'munhwa.com', name: '문화일보', category: '신문/일간지' },
  { domain: 'kmib.co.kr', name: '국민일보', category: '신문/일간지' },
  { domain: 'hankookilbo.com', name: '한국일보', category: '신문/일간지' },
  { domain: 'segye.com', name: '세계일보', category: '신문/일간지' },

  // 경제지
  { domain: 'hankyung.com', name: '한국경제', category: '경제지' },
  { domain: 'mk.co.kr', name: '매일경제', category: '경제지' },
  { domain: 'sedaily.com', name: '서울경제', category: '경제지' },
  { domain: 'edaily.co.kr', name: '이데일리', category: '경제지' },
  { domain: 'moneytoday.co.kr', name: '머니투데이', category: '경제지' },
  { domain: 'asiae.co.kr', name: '아시아경제', category: '경제지' },
  { domain: 'etnews.com', name: '전자신문', category: 'IT/전문지' },

  // 통신사 / 인터넷 언론
  { domain: 'yonhapnews.co.kr', name: '연합뉴스', category: '통신/인터넷' },
  { domain: 'news1.kr', name: '뉴스1', category: '통신/인터넷' },
  { domain: 'newsis.com', name: '뉴시스', category: '통신/인터넷' },
  { domain: 'ohmynews.com', name: '오마이뉴스', category: '통신/인터넷' },
  { domain: 'pressian.com', name: '프레시안', category: '통신/인터넷' },
  { domain: 'sisain.co.kr', name: '시사IN', category: '통신/인터넷' },
];

/**
 * Check if the email belongs to an approved press domain (supports test bypass mode)
 */
export function validatePressEmail(email: string): { isValid: boolean; mediaName?: string; error?: string } {
  if (!email) {
    return { isValid: false, error: '아이디 또는 이메일을 입력해 주세요.' };
  }

  const cleanEmail = email.trim();
  const domain = cleanEmail.includes('@') ? cleanEmail.split('@')[1].toLowerCase() : '';
  const matched = PRESS_DOMAINS_LIST.find(p => p.domain === domain);

  if (matched) {
    return { isValid: true, mediaName: matched.name };
  }

  // If in TEST BYPASS MODE, accept any input and assign test badge!
  if (IS_TEST_BYPASS_MODE) {
    const fallbackMedia = domain ? `${domain.split('.')[0].toUpperCase()} 언론사` : '시범 언론사';
    return { isValid: true, mediaName: fallbackMedia };
  }

  return { 
    isValid: false, 
    error: `언론사 공식 이메일 도메인만 가입이 가능합니다. (예: reporter@kbs.co.kr, @chosun.com)` 
  };
}
