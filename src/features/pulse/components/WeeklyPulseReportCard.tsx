import React, { useState } from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { DailyBestWorstVoteModal } from './DailyBestWorstVoteModal';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { Award, Vote, ArrowRight, Trophy, Heart } from 'lucide-react';

interface WeeklyPulseReportCardProps {
  onOpenPastBestWorstDetail?: () => void;
  onOpenPastReviewDetail?: () => void;
  onOpenCurrentBestWorstDetail?: () => void;
  onOpenCurrentReviewsDetail?: () => void;
  onOpenDetail?: () => void;
  onOpenReviewsDetail?: () => void;
}

export const WeeklyPulseReportCard: React.FC<WeeklyPulseReportCardProps> = ({
  onOpenPastBestWorstDetail,
  onOpenPastReviewDetail,
  onOpenCurrentBestWorstDetail,
  onOpenCurrentReviewsDetail,
  onOpenDetail,
  onOpenReviewsDetail,
}) => {
  const {
    hasVotedToday,
    submitDailyVote,
    weeklySummary,
    DAILY_VOTE_REWARD,
  } = usePulseVoting();

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-slate-900 p-6 rounded-3xl border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.2)] h-full flex flex-col justify-between space-y-5">

      {/* Dashboard Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <Award className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white flex items-center gap-2 flex-wrap tracking-tight">
              <span className="whitespace-nowrap">주간 민심 펄스 현황</span>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVoteModalOpen(true)}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
            hasVotedToday
              ? 'bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-slate-750'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
          }`}
        >
          <Vote className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{hasVotedToday ? '✅ 오늘 투표 완료 (수정)' : '🗳️ 오늘의 펄스 투표하기 (+1,000P)'}</span>
        </button>
      </div>

      {/* Flexible Equal-Height Inner Content Container */}
      <div className="flex-1 flex flex-col justify-between space-y-5">

        {/* ================================================================ */}
        {/* GROUP 1: 지난 주 확정 결과 (Past Week Group Box) */}
        {/* ================================================================ */}
        <div className="bg-slate-950/80 p-4.5 rounded-3xl border border-indigo-500/40 space-y-3.5 shadow-xl">
          {/* 1. 지난 주 베스트/워스트 3인 선정결과 */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/20 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-sm font-black text-white tracking-tight">지난 주 베스트/워스트 선정결과</span>

              {(onOpenPastBestWorstDetail || onOpenDetail) && (
                <button
                  type="button"
                  onClick={onOpenPastBestWorstDetail || onOpenDetail}
                  className="text-xs text-indigo-300 hover:text-white font-extrabold flex items-center gap-1 bg-indigo-900/40 hover:bg-indigo-900/80 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all shrink-0"
                >
                  <span>상세현황 (배당 정산)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {/* Past Best 1 */}
              <div className="bg-slate-950/90 p-3 rounded-xl border border-emerald-500/30 space-y-2 shadow-sm">
                <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                  <span>🏆 지난주 확정 1위 BEST</span>
                  <span className="text-[9px] text-emerald-300 font-mono">+3,000P/주 배당</span>
                </div>
                {weeklySummary.bestTop3.slice(0, 1).map((pol) => (
                  <div key={'pb_' + pol.politicianId} className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-4 h-4 rounded text-[10px] font-black font-mono bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                        1
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-7 h-7 rounded-md shrink-0" />
                      <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="font-mono font-bold text-emerald-400 text-xs block">{pol.voteCount}표</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Worst 1 */}
              <div className="bg-slate-950/90 p-3 rounded-xl border border-rose-500/30 space-y-2 shadow-sm">
                <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                  <span>⚠️ 지난주 확정 1위 WORST</span>
                  <span className="text-[9px] text-rose-300 font-mono">-3,000P/주 감액</span>
                </div>
                {weeklySummary.worstTop3.slice(0, 1).map((pol) => (
                  <div key={'pw_' + pol.politicianId} className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-4 h-4 rounded text-[10px] font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                        1
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-7 h-7 rounded-md shrink-0" />
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

          {/* 2. 지난 주 베스트 한 줄평 선정결과 */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-1.5 text-sm font-black text-white tracking-tight">
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>지난 주 베스트 한 줄평 선정결과</span>
              </div>

              {(onOpenPastReviewDetail || onOpenReviewsDetail) && (
                <button
                  type="button"
                  onClick={onOpenPastReviewDetail || onOpenReviewsDetail}
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
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 sm:mt-0">
                      🥇
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xs font-extrabold text-white">{topRev.userName}</span>
                        <span className="text-[10px] text-amber-400 font-mono">지난주 1위 ({topRev.likes}표 공감)</span>
                      </div>
                      <p className="text-xs text-slate-200 italic mt-1.5 leading-relaxed tracking-wide sm:whitespace-normal">"{topRev.oneLineReview}"</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>


        {/* ================================================================ */}
        {/* GROUP 2: 금주 실시간 득표 현황 (Current Week Group Box) */}
        {/* ================================================================ */}
        <div className="bg-slate-950/80 p-4.5 rounded-3xl border border-emerald-500/40 space-y-3.5 shadow-xl">
          {/* 3. 금주 베스트/워스트 투표 현황 */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/20 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-sm font-black text-white tracking-tight">금주 베스트/워스트 투표 현황</span>

              {(onOpenCurrentBestWorstDetail || onOpenDetail) && (
                <button
                  type="button"
                  onClick={onOpenCurrentBestWorstDetail || onOpenDetail}
                  className="text-xs text-indigo-300 hover:text-white font-extrabold flex items-center gap-1 bg-indigo-900/40 hover:bg-indigo-900/80 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all shrink-0"
                >
                  <span>상세현황</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {/* Live Best 1 */}
              <div className="bg-slate-950/90 p-3 rounded-xl border border-emerald-500/20 space-y-2">
                <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                  <span>🥇 금주 실시간 1위 BEST</span>
                </div>
                {weeklySummary.bestTop3.slice(0, 1).map((pol) => (
                  <div key={'lb_' + pol.politicianId} className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-4 h-4 rounded text-[10px] font-black font-mono bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                        1
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-7 h-7 rounded-md shrink-0" />
                      <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs shrink-0 ml-2">{pol.voteCount}표</span>
                  </div>
                ))}
              </div>

              {/* Live Worst 1 */}
              <div className="bg-slate-950/90 p-3 rounded-xl border border-rose-500/20 space-y-2">
                <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between">
                  <span>🚨 금주 실시간 1위 WORST</span>
                </div>
                {weeklySummary.worstTop3.slice(0, 1).map((pol) => (
                  <div key={'lw_' + pol.politicianId} className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-4 h-4 rounded text-[10px] font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                        1
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-7 h-7 rounded-md shrink-0" />
                      <span className="font-extrabold text-white text-xs truncate">{pol.politicianName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{pol.party}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-400 text-xs shrink-0 ml-2">{pol.voteCount}표</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 금주 한줄평 득표 현황 */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-1.5 text-sm font-black text-white tracking-tight">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>금주 한줄평 득표 현황</span>
              </div>

              {(onOpenCurrentReviewsDetail || onOpenReviewsDetail) && (
                <button
                  type="button"
                  onClick={onOpenCurrentReviewsDetail || onOpenReviewsDetail}
                  className="text-xs text-amber-300 hover:text-white font-extrabold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all shrink-0"
                >
                  <span>상세현황</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Top 1 Review Highlight */}
            {(() => {
              const topRev = weeklySummary.bestReviews?.[0] || {
                userName: '여의도취재반장',
                likes: 18,
                oneLineReview: '우원식 국회의장의 상임위 중재안과 이준석 의원의 반도체 특구 법안이 실질적 민생 도움이 됨!',
              };
              return (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 sm:mt-0">
                      🥇
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xs font-extrabold text-white">{topRev.userName}</span>
                        <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" /> {topRev.likes}표 실시간 1위
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 italic mt-1.5 leading-relaxed tracking-wide sm:whitespace-normal">"{topRev.oneLineReview}"</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div> {/* End flex-1 container */}

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
