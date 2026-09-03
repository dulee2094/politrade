import React from 'react';
import { ShieldCheck, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      badge: '신뢰 검증 회원',
      title: '신뢰도 높은 검증 회원 시스템 (Trust & Verification)',
      description: '가짜 뉴스와 상업적 어뷰징을 예방하고 공적 토론의 신뢰성을 보장하기 위한 도메인 검증 시스템. 자유 닉네임으로 취재 및 의견 개진의 안전한 익명성을 보장합니다.',
      list: ['신뢰할 수 있는 도메인 검증', '자유 닉네임 익명성 보장', '가짜 뉴스/어뷰징 100% 차단'],
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      badge: 'AMM Bonding Curve',
      title: '스마트 유동성 체결 엔진 (Bonding Curve)',
      description: '매수 수량이 몰리면 주가가 즉시 상승하고, 매도가 몰리면 하락하는 자동화 시장 조성자(AMM)로 유동성 기근 없이 100% 즉시 체결됩니다.',
      list: ['1,000주 유동성 풀 기준', '실시간 슬리피지 & 주가 영향도 계산', '24시간 인터랙티브 차트'],
    },
    {
      icon: <Calendar className="w-6 h-6 text-amber-400" />,
      badge: '월간 정기 지원금',
      title: '매월 1일 정기 지원금 (100,000 P) 자동 입금',
      description: '현금 결제나 포인트 획득용 도배를 완벽히 배제했습니다. 모든 회원이 매월 동일한 소액 예산으로 순수 지지도 예측력을 겨룹니다.',
      list: ['현금 충전 결제 0원', '활동 도배 어뷰징 0%', '매월 1일 자동 이월 지급'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <h2 className="text-xl font-extrabold text-white">Politrade만의 3대 혁신 시스템</h2>
        <p className="text-xs text-slate-400">신뢰성 높은 지지도 예측과 투명한 AMM 주가 체결 엔진</p>
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
