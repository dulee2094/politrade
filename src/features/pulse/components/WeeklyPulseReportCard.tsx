import React, { useState } from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { DailyBestWorstVoteModal } from './DailyBestWorstVoteModal';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { Award, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, Gift, Heart, Vote, ArrowRight, Wallet, CheckCircle2, TrendingUp, AlertTriangle, Users, Calendar, Megaphone } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface WeeklyPulseReportCardProps {
  onOpenDetail?: () => void;
}

export const WeeklyPulseReportCard: React.FC<WeeklyPulseReportCardProps> = ({ onOpenDetail }) => {
  const {
    hasVotedToday,
    submitDailyVote,
    likeReview,
    weeklySummary,
    userSettlement,
    hasSettledThisWeek,
    executeWeeklySettlement,
    DAILY_VOTE_REWARD,
    BEST_REVIEW_REWARD,
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
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/50 p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl shadow-amber-500/15 space-y-5 h-full flex flex-col justify-between">
      {/* Background Accent Glow */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Pre-Notification Schedule Banner */}
      <div className="relative z-10 bg-gradient-to-r from-amber-900/60 via-purple-900/60 to-slate-900 p-3 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-amber-300 font-sans">주간 민심 펄스 타임라인 사전 공지:</span>
          <span className="text-slate-200 font-mono text-[11px]">월~토 24:00 투표 마감 ➔ 월요일 10:00 발표 ➔ 월요일 11:00 통합 시상</span>
        </div>
        <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
          월11시 배당+포상금(+10만P) 일괄지급
        </span>
      </div>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>주간 민심 펄스 (Best 3 / Worst 3 여론조사)</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold">
                WEEKLY PULSE
              </span>
            </h3>
            <p className="text-xs text-slate-400">월~토 투표 ➔ 매주 월요일 10시 발표 & 11시 배당금(+1,000P/주) 및 한줄평 포상금(+100,000P) 일괄 시상</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onOpenDetail && (
            <button
              type="button"
              onClick={onOpenDetail}
              className="px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 flex items-center space-x-1.5"
            >
              <span>상세 리포트</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Daily Vote Trigger Button */}
          <button
            type="button"
            onClick={() => setIsVoteModalOpen(true)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center space-x-2 ${
              hasVotedToday
                ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                : 'bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-white shadow-amber-500/20'
            }`}
          >
            <Vote className="w-4 h-4 text-amber-300" />
            <span>{hasVotedToday ? '오늘 투표 완료 (수정하기)' : `오늘의 Best/Worst 3인 투표하기 (+1,000P)`}</span>
          </button>
        </div>
      </div>

      {/* Daily Voter Participation Trend Widget (Mon ~ Sun) */}
      <div className="relative z-10 bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/30 space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white font-sans font-extrabold flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span>이번 주 요일별 전체 민심 투표 참여 현황</span>
          </span>
          <span className="text-[11px] text-amber-300 font-bold font-mono">
            주간 누적 {weeklySummary.totalVotesCount}명 참여
          </span>
        </div>

        {/* Mini Bar Chart Grid */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {weeklySummary.dailyVoterCounts.map((item, idx) => {
            const maxCount = 100;
            const heightPct = Math.min(100, Math.round((item.count / maxCount) * 100));
            const isToday = idx === 6; // Sunday highlight

            return (
              <div key={item.day} className="flex flex-col items-center space-y-1 group">
                <span className="text-[9px] text-slate-400 group-hover:text-amber-300 transition-colors">
                  {item.count}명
                </span>
                <div className="w-full h-11 bg-slate-950 rounded-lg p-0.5 border border-slate-800 flex items-end">
                  <div
                    className={`w-full rounded-md transition-all duration-500 ${
                      isToday 
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20' 
                        : 'bg-gradient-to-t from-indigo-900 to-indigo-600 group-hover:from-indigo-700 group-hover:to-amber-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${item.day}요일: ${item.count}명 참여`}
                  />
                </div>
                <span className={`text-[10px] font-sans font-bold ${isToday ? 'text-amber-300' : 'text-slate-400'}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Best 3 vs Worst 3 Dual Grid */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* Weekly BEST 3 Box */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 font-bold text-xs text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>🏆 이번 주 주간 BEST 3 의원</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              보유 주주 1주당 +1,000 P 배당!
            </span>
          </div>

          <div className="space-y-2">
            {weeklySummary.bestTop3.map((pol, idx) => (
              <div key={'b_' + pol.politicianId} className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-5 h-5 rounded-md text-[11px] font-black font-mono flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                  }`}>
                    {idx + 1}
                  </span>
                  <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-8 h-8 rounded-lg" />
                  <div>
                    <span className="font-extrabold text-white">{pol.politicianName}</span>
                    <div className="text-[10px] text-slate-400">{pol.party}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-xs">{pol.voteCount}표</div>
                  <div className="text-[9px] text-emerald-300 font-mono">+1,000P/주</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly WORST 3 Box */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-rose-500/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 font-bold text-xs text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>⚠️ 이번 주 주간 WORST 3 의원</span>
            </div>
            <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
              보유 주주 1주당 -1,000 P 감액!
            </span>
          </div>

          <div className="space-y-2">
            {weeklySummary.worstTop3.map((pol, idx) => (
              <div key={'w_' + pol.politicianId} className="flex items-center justify-between p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-md text-[11px] font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-8 h-8 rounded-lg" />
                  <div>
                    <span className="font-extrabold text-white">{pol.politicianName}</span>
                    <div className="text-[10px] text-slate-400">{pol.party}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-rose-400 text-xs">{pol.voteCount}표</div>
                  <div className="text-[9px] text-rose-300 font-mono">-1,000P/주</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User's Personal Weekly Dividend & Penalty Settlement Dashboard Box */}
      <div className="relative z-10 bg-slate-900/90 p-4.5 rounded-2xl border border-indigo-500/40 space-y-3 font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 font-sans">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-sans flex items-center gap-2">
                <span>월요일 11시 통합 주주 배당금 & 베스트 한줄평 포상 정산</span>
                {hasSettledThisWeek && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                    이번 주 정산 완료
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-400 font-sans">매주 월요일 11:00 AM: 주주 배당금 정산과 베스트 한줄평 포상금(+100,000P)이 일괄 입출금됩니다.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClaimSettlement}
            disabled={hasSettledThisWeek}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center space-x-1.5 shrink-0 font-sans ${
              hasSettledThisWeek
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hasSettledThisWeek ? '이번 주 정산 완료' : '월요일 11시 통합 정산/시상하기'}</span>
          </button>
        </div>

        {/* Settlement Breakdown Summary Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400 font-sans">예상 Best 배당금</span>
            <span className="font-extrabold text-emerald-400">+{formatPoints(userSettlement.totalDividend)}</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400 font-sans">예상 Worst 손실 감액</span>
            <span className="font-extrabold text-rose-400">-{formatPoints(userSettlement.totalPenalty)}</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-indigo-500/30 flex items-center justify-between bg-indigo-950/40">
            <span className="text-slate-300 font-sans font-bold">최종 순 정산액</span>
            <span className={`font-black text-sm ${userSettlement.netAmount >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
              {userSettlement.netAmount >= 0 ? '+' : ''}{formatPoints(userSettlement.netAmount)}
            </span>
          </div>
        </div>

        {/* Settlement Feedback Message Toast */}
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

      {/* Best Reviews Gallery Section */}
      <div className="relative z-10 space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>✨ 금주의 베스트 한줄평 (선정자 +{BEST_REVIEW_REWARD.toLocaleString()} P 월요일 11시 시상!)</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">유저 공감 득표 랭킹</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weeklySummary.bestReviews.map((rev, idx) => (
            <div key={rev.id} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-500/30 font-mono">
                      TOP {idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-white">{rev.userName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                  "{rev.oneLineReview}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                <span className="bg-indigo-600/30 text-indigo-300 text-[9px] px-2 py-0.5 rounded-md font-sans font-bold">
                  🎁 월11시 포상 (+100,000P)
                </span>
                <button
                  type="button"
                  onClick={() => likeReview(rev.id)}
                  className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors bg-slate-800 px-2 py-1 rounded-md border border-slate-700"
                >
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>{rev.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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
