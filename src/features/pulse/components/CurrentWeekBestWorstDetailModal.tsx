import React from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { X, Vote, Sparkles, CheckCircle2, Wallet, Flame } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface CurrentWeekBestWorstDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoteModal: () => void;
}

export const CurrentWeekBestWorstDetailModal: React.FC<CurrentWeekBestWorstDetailModalProps> = ({
  isOpen,
  onClose,
  onOpenVoteModal,
}) => {
  const {
    hasVotedToday,
    weeklySummary,
    userSettlement,
    DAILY_VOTE_REWARD,
  } = usePulseVoting();

  if (!isOpen) return null;

  const bestList = weeklySummary.bestTop10 || weeklySummary.bestTop3;
  const worstList = weeklySummary.worstTop10 || weeklySummary.worstTop3;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto p-6 space-y-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-emerald-500/30 pb-4 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
              <Flame className="w-6 h-6 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-xl font-black text-white">🔥 금주 실시간 민심 펄스 득표 순위 (TOP 10)</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE REAL-TIME RANKING
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                월요일부터 현재까지 집계된 금주 실시간 민심 여론조사 득표 순위 (상위 10위 BEST / WORST 의원 목록)
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
          
          {/* Quick Vote Banner CTA */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-amber-400" />
                <span>오늘의 일일 펄스 투표 참여 (+{DAILY_VOTE_REWARD}P 지급)</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">매일 1회 Best 3인 / Worst 3인을 선택하고 실시간 득표 순위에 참여해보세요.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenVoteModal();
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
            >
              {hasVotedToday ? '투표 내역 수정하기' : `오늘 투표 참여하기 (+${DAILY_VOTE_REWARD}P)`}
            </button>
          </div>

          {/* Dual Grid: Weekly Real-Time Best 10 vs Worst 10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* BEST 10 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
                <span className="font-black text-sm text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  🏆 금주 실시간 BEST 10 의원
                </span>
              </div>

              <div className="space-y-2 flex-1 max-h-[480px] overflow-y-auto pr-1">
                {bestList.map((pol, idx) => (
                  <div key={'b_' + pol.politicianId} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs hover:bg-emerald-500/15 transition-colors">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-md text-xs font-black font-mono flex items-center justify-center shrink-0 ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {idx + 1}
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-8 h-8 rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-white block truncate">{pol.politicianName}</span>
                        <div className="text-[10px] text-slate-400 truncate">{pol.party}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="font-mono font-extrabold text-emerald-400 text-xs">{pol.voteCount}표</div>
                      <div className="text-[9px] text-emerald-300 font-mono">실시간 {idx + 1}위</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WORST 10 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-rose-500/30 space-y-3 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
                <span className="font-black text-sm text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                  🚨 금주 실시간 WORST 10 의원
                </span>
              </div>

              <div className="space-y-2 flex-1 max-h-[480px] overflow-y-auto pr-1">
                {worstList.map((pol, idx) => (
                  <div key={'w_' + pol.politicianId} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs hover:bg-rose-500/15 transition-colors">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-md text-xs font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-8 h-8 rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-white block truncate">{pol.politicianName}</span>
                        <div className="text-[10px] text-slate-400 truncate">{pol.party}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="font-mono font-extrabold text-rose-400 text-xs">{pol.voteCount}표</div>
                      <div className="text-[9px] text-rose-300 font-mono">실시간 {idx + 1}위</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Personal Settlement Calculator Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/40 space-y-4 font-mono shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>금주 내 주식 실시간 예상 배당금 & 자산 가치 영향</span>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                      실시간 예측
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">내가 보유한 주식 중 금주 실시간 Best/Worst 3위 지정 의원 주식 수량 기반 실시간 예측 시뮬레이션</p>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/90 text-indigo-300 border border-indigo-500/30 shadow-sm flex items-center space-x-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>⏳ 매주 월요일 11:00 자동 정산 예정</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">예상 Best 배당금</span>
                <span className="font-extrabold text-emerald-400 text-sm">+{formatPoints(userSettlement.totalDividend)}</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">예상 Worst 손실 감액</span>
                <span className="font-extrabold text-rose-400 text-sm">-{formatPoints(userSettlement.totalPenalty)}</span>
              </div>

              <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-500/40 flex items-center justify-between">
                <span className="text-slate-300 font-sans font-bold">내 주식 가치 영향 예상</span>
                <span className={`font-black text-base ${userSettlement.netAmount >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  {userSettlement.netAmount >= 0 ? '+' : ''}{formatPoints(userSettlement.netAmount)}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-400 font-sans flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>💡 실시간 순위는 매일 투표에 따라 변동되며, 최종 배당금 및 주가 영향은 매주 월요일 11:00 마감 시점 순위로 확정 지급됩니다.</span>
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
