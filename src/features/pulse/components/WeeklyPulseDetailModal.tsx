import React from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { X, Award, Vote, Sparkles, CheckCircle2, Wallet, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface WeeklyPulseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoteModal: () => void;
}

export const WeeklyPulseDetailModal: React.FC<WeeklyPulseDetailModalProps> = ({
  isOpen,
  onClose,
  onOpenVoteModal,
}) => {
  const {
    hasVotedToday,
    weeklySummary,
    userSettlement,
    hasSettledThisWeek,
    executeWeeklySettlement,
    likeReview,
    DAILY_VOTE_REWARD,
    BEST_REVIEW_REWARD,
  } = usePulseVoting();

  const [settlementFeedback, setSettlementFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleClaimSettlement = () => {
    setSettlementFeedback(null);
    const res = executeWeeklySettlement();
    if (res.success) {
      setSettlementFeedback({ type: 'success', message: res.message });
    } else {
      setSettlementFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto p-6 space-y-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">주간 민심 펄스 종합 상세 리포트</h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold">
                  WEEKLY REPORT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                누적 민심 여론조사 집계 & 주주 배당금(+1,000P/주) 및 손실 감액(-1,000P/주) 정산
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          
          {/* Quick Vote Banner CTA */}
          <div className="bg-gradient-to-r from-amber-950/60 via-indigo-950/60 to-slate-900 p-4 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-amber-400" />
                <span>오늘의 일일 펄스 투표 참여 (+{DAILY_VOTE_REWARD}P 지급)</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">매일 1회 Best 3인 / Worst 3인을 선택하고 가상 포 포인트를 보상받으세요.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenVoteModal();
              }}
              className="bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
            >
              {hasVotedToday ? '투표 내역 수정하기' : `오늘 투표 참여하기 (+${DAILY_VOTE_REWARD}P)`}
            </button>
          </div>

          {/* Dual Grid: Weekly Best 3 vs Worst 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* BEST 3 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  🏆 이번 주 주간 BEST 3 의원
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  +1,000 P / 주 배당
                </span>
              </div>

              <div className="space-y-2">
                {weeklySummary.bestTop3.map((pol, idx) => (
                  <div key={'b_' + pol.politicianId} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
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
                      <div className="text-[10px] text-emerald-300 font-mono">+1,000P/주</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WORST 3 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  ⚠️ 이번 주 주간 WORST 3 의원
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  -1,000 P / 주 감액
                </span>
              </div>

              <div className="space-y-2">
                {weeklySummary.worstTop3.map((pol, idx) => (
                  <div key={'w_' + pol.politicianId} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
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
                      <div className="text-[10px] text-rose-300 font-mono">-1,000P/주</div>
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
                    <span>내 주식 주간 배당금 및 손실 정산 내역</span>
                    {hasSettledThisWeek && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        정산 완료
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400">내가 보유한 주식 중 주간 Best/Worst 3에 지정된 의원 주식 수량 기반 정산</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClaimSettlement}
                disabled={hasSettledThisWeek}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center space-x-1.5 shrink-0 ${
                  hasSettledThisWeek
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{hasSettledThisWeek ? '이번 주 정산 완료' : '주간 배당금 정산 받기'}</span>
              </button>
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
                <span className="text-slate-300 font-sans font-bold">최종 순 정산액</span>
                <span className={`font-black text-base ${userSettlement.netAmount >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  {userSettlement.netAmount >= 0 ? '+' : ''}{formatPoints(userSettlement.netAmount)}
                </span>
              </div>
            </div>

            {settlementFeedback && (
              <div className={`p-3 rounded-xl border text-xs font-bold font-sans flex items-center space-x-2 ${
                settlementFeedback.type === 'error'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{settlementFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Best Reviews Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>✨ 금주의 베스트 한줄평 갤러리</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">공감 득표순 (+{BEST_REVIEW_REWARD}P 지급 대상)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {weeklySummary.bestReviews.map((rev, idx) => (
                <div key={rev.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-500/30 font-mono">
                          TOP {idx + 1}
                        </span>
                        <span className="text-xs font-extrabold text-white">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{rev.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                      "{rev.oneLineReview}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                    <span className="bg-indigo-600/30 text-indigo-300 text-[9px] px-2 py-0.5 rounded-md font-sans">
                      🎁 포상 후보 (+2,000P)
                    </span>
                    <button
                      type="button"
                      onClick={() => likeReview(rev.id)}
                      className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      <span>{rev.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
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
