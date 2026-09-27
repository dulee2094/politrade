import React from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { X, Award, CheckCircle2, Wallet, Lock, AlertTriangle } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface PastWeekBestWorstDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PastWeekBestWorstDetailModal: React.FC<PastWeekBestWorstDetailModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    userSettlement,
  } = usePulseVoting();

  if (!isOpen) return null;

  // Past week closed top 3 list with quorum flag to support partial/full selection display
  const pastBest3 = [
    { politicianId: 'POL01', politicianName: '우원식', party: '무소속', voteCount: 142, imageUrl: '/images/politicians/POL01.jpg', isQuorumMet: true },
    { politicianId: 'POL03', politicianName: '이준석', party: '개혁신당', voteCount: 118, imageUrl: '/images/politicians/POL03.jpg', isQuorumMet: true },
    { politicianId: 'POL04', politicianName: '박주민', party: '더불어민주당', voteCount: 95, imageUrl: '/images/politicians/POL04.png', isQuorumMet: true },
  ];

  const pastWorst3 = [
    { politicianId: 'POL05', politicianName: '안철수', party: '국민의힘', voteCount: 130, imageUrl: '/images/politicians/POL05.png', isQuorumMet: true },
    { politicianId: 'POL02', politicianName: '한동훈', party: '무소속', voteCount: 105, imageUrl: '/images/politicians/POL02.png', isQuorumMet: true },
    { politicianId: 'POL07', politicianName: '나경원', party: '국민의힘', voteCount: 88, imageUrl: '/images/politicians/POL07.png', isQuorumMet: true },
  ];

  const metBestCount = pastBest3.filter(p => p.isQuorumMet).length;
  const metWorstCount = pastWorst3.filter(p => p.isQuorumMet).length;

  const isFullQuorum = metBestCount === 3 && metWorstCount === 3;
  const isPartialQuorum = (metBestCount > 0 || metWorstCount > 0) && !isFullQuorum;
  const isNoQuorum = metBestCount === 0 && metWorstCount === 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto p-6 space-y-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-indigo-500/30 pb-4 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-xl font-black text-white">🔒 지난 주 최종 BEST / WORST 확정 리포트</h2>
                {isFullQuorum && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                    ✅ 지난주 자동 정산 완료
                  </span>
                )}
                {isPartialQuorum && (
                  <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                    ⚠️ 부분 자동 정산 완료 (일부 순위 정족수 미달)
                  </span>
                )}
                {isNoQuorum && (
                  <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-0.5 rounded-full border border-rose-500/40 font-bold">
                    🚨 지난주 정산 미발생 (전체 정족수 미달)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                월요일 11:00 마감 시점의 지난주 최종 선정결과 및 내 보유주식 자동 배당/감액 정산 내역입니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">

          {/* Quorum / Selection Context Banner */}
          {isPartialQuorum && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold text-amber-300 block">💡 주간 Best/Worst 일부 순위 미선정 안내</span>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  지난주는 최소 득표 정족수 조건(의원별 31표 이상 득표)을 충족하지 못한 일부 순위가 존재합니다. 최소조건을 충족하여 정식 선정된 의원주식에 대해서만 배당/감액 정산이 적용되었습니다.
                </p>
              </div>
            </div>
          )}

          {isNoQuorum && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold text-rose-300 block">🚨 지난주 Best/Worst 의원 전체 미선정 안내</span>
                <p className="text-[11px] leading-relaxed text-rose-200/90">
                  지난주는 최소 득표 정족수 조건(전체 참여 유저의 30% 이상 & 의원별 31표 이상 득표)을 충족한 정치인이 없어 Best 및 Worst 의원이 선정되지 않았습니다. 이에 따라 주간 배당금 및 감액 정산은 발생하지 않았습니다 (0 P).
                </p>
              </div>
            </div>
          )}

          {/* Dual Grid: Past Best 3 vs Past Worst 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* PAST BEST 3 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  🏆 지난 주 최종 확정 BEST 3 의원
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  순위별 +3천/+2천/+1천P/주 배당
                </span>
              </div>

              <div className="space-y-2">
                {pastBest3.map((pol, idx) => {
                  const rateStr = idx === 0 ? '+3,000P/주' : idx === 1 ? '+2,000P/주' : '+1,000P/주';
                  
                  if (!pol.isQuorumMet) {
                    return (
                      <div key={'pb_' + idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-md text-xs font-mono font-bold bg-slate-800 text-slate-500 flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <AlertTriangle className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-xs">{idx + 1}위: 최소 득표 조건 미달 (미선정)</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">0P (배당 미발생)</span>
                      </div>
                    );
                  }

                  return (
                    <div key={'pb_' + pol.politicianId} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-md text-xs font-black font-mono flex items-center justify-center ${
                          idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-9 h-9 rounded-lg" />
                        <div>
                          <span className="font-extrabold text-white">{pol.politicianName}</span>
                          <div className="text-[10px] text-slate-400">{pol.party}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400 text-sm">{pol.voteCount}표</div>
                        <div className="text-[10px] text-emerald-300 font-mono">{rateStr}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PAST WORST 3 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  ⚠️ 지난 주 최종 확정 WORST 3 의원
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  순위별 -3천/-2천/-1천P/주 감액
                </span>
              </div>

              <div className="space-y-2">
                {pastWorst3.map((pol, idx) => {
                  const rateStr = idx === 0 ? '-3,000P/주' : idx === 1 ? '-2,000P/주' : '-1,000P/주';

                  if (!pol.isQuorumMet) {
                    return (
                      <div key={'pw_' + idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-md text-xs font-mono font-bold bg-slate-800 text-slate-500 flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <AlertTriangle className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-xs">{idx + 1}위: 최소 득표 조건 미달 (미선정)</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">0P (감액 미발생)</span>
                      </div>
                    );
                  }

                  return (
                    <div key={'pw_' + pol.politicianId} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-md text-xs font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-9 h-9 rounded-lg" />
                        <div>
                          <span className="font-extrabold text-white">{pol.politicianName}</span>
                          <div className="text-[10px] text-slate-400">{pol.party}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-rose-400 text-sm">{pol.voteCount}표</div>
                        <div className="text-[10px] text-rose-300 font-mono">{rateStr}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Personal Settlement Summary Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/40 space-y-4 font-mono shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>내 주식 주간 배당금 및 손실 자동 정산 내역</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">지난주 확정 Best/Worst 3 지정 의원 중 내가 보유한 주식 수량 기반 자동 정산 결과</p>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/90 text-emerald-300 border border-emerald-500/30 shadow-sm flex items-center space-x-1.5 shrink-0">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>🔒 자동 정산 반영 완료 (매주 월요일 11:00)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Best 배당금 확정액</span>
                <span className="font-extrabold text-emerald-400 text-sm">+{formatPoints(userSettlement.totalDividend)}</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Worst 손실 감액 확정액</span>
                <span className="font-extrabold text-rose-400 text-sm">-{formatPoints(userSettlement.totalPenalty)}</span>
              </div>

              <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-500/40 flex items-center justify-between">
                <span className="text-slate-300 font-sans font-bold">최종 순 정산 반영액</span>
                <span className={`font-black text-base ${userSettlement.netAmount >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  {userSettlement.netAmount >= 0 ? '+' : ''}{formatPoints(userSettlement.netAmount)}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-400 font-sans flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>💡 매주 월요일 11:00 투표 마감 직후 사용자 포인트 지갑 및 주식 평가금에 자동 정산 반영된 내역입니다.</span>
            </div>
          </div>

        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all border border-slate-700"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
