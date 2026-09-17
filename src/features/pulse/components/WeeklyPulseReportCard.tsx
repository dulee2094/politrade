import React, { useState } from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { DailyBestWorstVoteModal } from './DailyBestWorstVoteModal';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PressBadge } from '../../auth/components/PressBadge';
import { Award, ThumbsUp, Sparkles, Heart, Vote, ArrowRight, Wallet, CheckCircle2, Trophy } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface WeeklyPulseReportCardProps {
  onOpenDetail?: () => void;
  onOpenReviewsDetail?: () => void;
}

export const WeeklyPulseReportCard: React.FC<WeeklyPulseReportCardProps> = ({ onOpenDetail, onOpenReviewsDetail }) => {
  const {
    hasVotedToday,
    submitDailyVote,
    weeklySummary,
    userSettlement,
    hasSettledThisWeek,
    executeWeeklySettlement,
    DAILY_VOTE_REWARD,
  } = usePulseVoting();

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [settlementFeedback, setSettlementFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    <div className="relative overflow-hidden bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl space-y-4">

      {/* Dashboard Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <Award className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white flex items-center gap-2 flex-wrap tracking-tight">
              <span className="whitespace-nowrap">주간 민심 펄스 현황</span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold whitespace-nowrap">
                PULSE DASHBOARD
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              실시간 득표 및 지난주 확정 결과 4단계 통합 종합 현황
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVoteModalOpen(true)}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-md flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
            hasVotedToday
              ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20'
          }`}
        >
          <Vote className="w-3.5 h-3.5 text-slate-950 shrink-0" />
          <span>{hasVotedToday ? '오늘 투표 완료' : '오늘의 3인 투표 (+1,000P)'}</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 1. 금주 베스트/워스트 투표 현황 (월~어제 누적) [LIVE] */}
      {/* ================================================================ */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>금주 베스트/워스트 투표 현황</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                LIVE · 월~어제 누적
              </span>
            </h4>
          </div>

          {onOpenDetail && (
            <button
              type="button"
              onClick={onOpenDetail}
              className="text-xs text-indigo-300 hover:text-white font-extrabold flex items-center gap-1 bg-indigo-900/40 hover:bg-indigo-900/80 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all shrink-0"
            >
              <span>상세현황</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
          {/* Live Best 3 */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/20 space-y-1.5">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
              <span>🏆 금주 실시간 BEST 3</span>
              <span className="text-[9px] text-slate-400 font-mono">누적 득표 순</span>
            </div>
            <div className="space-y-1">
              {weeklySummary.bestTop3.map((pol, idx) => (
                <div key={'lb_' + pol.politicianId} className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className={`w-4 h-4 rounded text-[10px] font-black font-mono flex items-center justify-center shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-6 h-6 rounded-md shrink-0" />
                    <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0 ml-2">{pol.voteCount}표</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Worst 3 */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-rose-500/20 space-y-1.5">
            <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between">
              <span>⚠️ 금주 실시간 WORST 3</span>
              <span className="text-[9px] text-slate-400 font-mono">누적 득표 순</span>
            </div>
            <div className="space-y-1">
              {weeklySummary.worstTop3.map((pol, idx) => (
                <div key={'lw_' + pol.politicianId} className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-4 h-4 rounded text-[10px] font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-6 h-6 rounded-md shrink-0" />
                    <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400 text-xs shrink-0 ml-2">{pol.voteCount}표</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. 금주 한줄평 득표 현황 (월~어제 누적) [LIVE] */}
      {/* ================================================================ */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>금주 한줄평 득표 현황</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                LIVE · 공감 순위
              </span>
            </h4>
          </div>

          {onOpenReviewsDetail && (
            <button
              type="button"
              onClick={onOpenReviewsDetail}
              className="text-xs text-amber-300 hover:text-white font-extrabold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all shrink-0"
            >
              <span>상세현황</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {weeklySummary.bestReviews.slice(0, 3).map((rev, idx) => (
            <div key={rev.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                    {idx + 1}위
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[90px]">{rev.userName}</span>
                </div>
                <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-tight">"{rev.oneLineReview}"</p>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80 text-amber-400 font-mono">
                <span className="text-slate-400">🎁 1위 시상 (+10만P)</span>
                <span className="flex items-center gap-1 font-bold">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> {rev.likes}표
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 3. 지난 주 베스트/워스트 3인 선정결과 [PAST - CLOSED] */}
      {/* ================================================================ */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>지난 주 베스트/워스트 3인 선정결과</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-500/30 font-mono">
                CLOSED · 지난주 최종 확정
              </span>
            </h4>
          </div>

          {onOpenDetail && (
            <button
              type="button"
              onClick={onOpenDetail}
              className="text-xs text-indigo-300 hover:text-white font-extrabold flex items-center gap-1 bg-indigo-900/40 hover:bg-indigo-900/80 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all shrink-0"
            >
              <span>상세현황 (배당 정산)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
          {/* Past Best 3 */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/30 space-y-1.5 shadow-sm">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between border-b border-slate-800/60 pb-1">
              <span>🏆 지난주 확정 BEST 3</span>
              <span className="text-[9px] text-emerald-300 font-mono">+1,000P/주 배당</span>
            </div>
            <div className="space-y-1">
              {weeklySummary.bestTop3.map((pol, idx) => (
                <div key={'pb_' + pol.politicianId} className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className={`w-4 h-4 rounded text-[10px] font-black font-mono flex items-center justify-center shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-6 h-6 rounded-md shrink-0" />
                    <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-mono font-bold text-emerald-400 text-xs block">{pol.voteCount}표</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Worst 3 */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-rose-500/30 space-y-1.5 shadow-sm">
            <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between border-b border-slate-800/60 pb-1">
              <span>⚠️ 지난주 확정 WORST 3</span>
              <span className="text-[9px] text-rose-300 font-mono">-1,000P/주 감액</span>
            </div>
            <div className="space-y-1">
              {weeklySummary.worstTop3.map((pol, idx) => (
                <div key={'pw_' + pol.politicianId} className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-4 h-4 rounded text-[10px] font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-6 h-6 rounded-md shrink-0" />
                    <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-mono font-bold text-rose-400 text-xs block">{pol.voteCount}표</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5 font-sans">
          <span>💡 보유 주식 기반 주가 배당 정산 및 수령은 우측 <strong className="text-indigo-300">[상세현황 (배당 정산)]</strong> 버튼에서 진행됩니다.</span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. 지난 주 베스트 한 줄평 선정결과 [PAST - CLOSED] */}
      {/* ================================================================ */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>지난 주 베스트 한 줄평 선정결과</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                명예의 전당 · +10만P 시상
              </span>
            </h4>
          </div>

          {onOpenReviewsDetail && (
            <button
              type="button"
              onClick={onOpenReviewsDetail}
              className="text-xs text-amber-300 hover:text-white font-extrabold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all shrink-0"
            >
              <span>상세현황</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Top Review Highlight */}
        {(() => {
          const topRev = weeklySummary.bestReviews?.[0] || {
            userName: '여의도취재반장',
            likes: 24,
            oneLineReview: '우원식 국회의장의 상임위 중재안과 이준석 의원의 반도체 특구 법안이 실질적 민생 도움이 됨!',
          };
          return (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                  🥇
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs font-extrabold text-white">{topRev.userName}</span>
                    <PressBadge mediaName="KBS" />
                    <span className="text-[10px] text-amber-400 font-mono">지난주 1위 ({topRev.likes}표 공감)</span>
                  </div>
                  <p className="text-xs text-slate-300 italic mt-0.5 leading-tight truncate sm:whitespace-normal">"{topRev.oneLineReview}"</p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-extrabold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0 self-start sm:self-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+100,000P 시상 완료</span>
              </span>
            </div>
          );
        })()}
      </div>

      {/* Voting Modal */}
      <DailyBestWorstVoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onSubmitVote={submitDailyVote}
        rewardAmount={DAILY_VOTE_REWARD}
      />

    </div>
  );
};
