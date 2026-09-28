import React from 'react';
import { ShieldCheck, TrendingUp, Flame, CheckCircle2 } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      badge: 'POLI 주식 마켓',
      title: '상장 국회의원 (30인+α) 실시간 매매',
      description: '차세대 정치 대장주와 저평가 우량주를 발굴하고, AMM 유동성 풀 및 실시간 호가창 주문 시스템으로 시세를 정밀 거래합니다.',
      list: ['상장 국회의원 30인+α 시세', 'AMM 호가창 100% 체결', '24시간 인터랙티브 차트'],
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-400" />,
      badge: '주간 민심 펄스',
      title: '주간 민심 펄스 & 1줄 리뷰 참여',
      description: '매주 주요 공적 이슈에 대한 긍정/부정 여론 투표와 베스트 1줄 평 참여로 살아있는 실시간 민심 지표를 함께 만들어갑니다.',
      list: ['주간 핫 이슈 투표', '베스트 1줄 리뷰 선정', '실시간 여론 지표 시각화'],
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      badge: '언론사 도메인 검증',
      title: '신뢰도 높은 기자 인증 & 리더보드',
      description: 'KBS, 조선일보 등 언론사 이메일 도메인 검증으로 인증된 취재 기자 칭호 및 전문성 높은 이슈 분석 활동 지수를 선사합니다.',
      list: ['언론사 도메인 이메일 검증', '취재반장 기자 전용 배지', '기자 활동 지수 랭킹 경쟁'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <h2 className="text-xl font-extrabold text-white">Politrade 핵심 평가 및 거래 시스템</h2>
        <p className="text-xs text-slate-400">재미있게 즐기고 깊이 있게 참여하는 정치 가치 지표 플랫폼</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] text-slate-300 font-medium">
              {item.list.map((li, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{li}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
