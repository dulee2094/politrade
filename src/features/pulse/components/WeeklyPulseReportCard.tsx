import React, { useState } from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { DailyBestWorstVoteModal } from './DailyBestWorstVoteModal';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { Award, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, Gift, Heart, Vote, ArrowRight } from 'lucide-react';

export const WeeklyPulseReportCard: React.FC = () => {
  const {
    hasVotedToday,
    submitDailyVote,
    likeReview,
    weeklySummary,
    DAILY_VOTE_REWARD,
    BEST_REVIEW_REWARD,
  } = usePulseVoting();

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 p-6 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
      {/* Background Accent Glow */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
            <p className="text-xs text-slate-400">7일간의 누적 민심 투표 결과 및 베스트 한줄평</p>
          </div>
        </div>

        {/* Daily Vote Trigger Button */}
        <button
          type="button"
          onClick={() => setIsVoteModalOpen(true)}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center space-x-2 shrink-0 ${
            hasVotedToday
              ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              : 'bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-white shadow-amber-500/20'
          }`}
        >
          <Vote className="w-4 h-4 text-amber-300" />
          <span>{hasVotedToday ? '오늘 투표 완료 (수정하기)' : `오늘의 Best/Worst 3인 투표하기 (+${DAILY_VOTE_REWARD}P)`}</span>
        </button>
      </div>

      {/* Weekly Best 3 vs Worst 3 Dual Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Weekly BEST 3 Box */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 font-bold text-xs text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>🏆 이번 주 주간 BEST 3 의원</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">7일 긍정표 집계</span>
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
                <div className="font-mono font-bold text-emerald-400 text-xs">
                  {pol.voteCount}표
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
            <span className="text-[10px] text-rose-400 font-mono">7일 부정표 집계</span>
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
                <div className="font-mono font-bold text-rose-400 text-xs">
                  {pol.voteCount}표
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Best Reviews Gallery Section */}
      <div className="relative z-10 space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>✨ 금주의 베스트 한줄평 (선정자 +{BEST_REVIEW_REWARD} P 추가 지급!)</span>
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
                <span className="bg-indigo-600/30 text-indigo-300 text-[9px] px-2 py-0.5 rounded-md font-sans">
                  🎁 포상 후보 (+2,000P)
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
