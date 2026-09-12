import React from 'react';
import { Trophy, ThumbsUp, Sparkles, ArrowRight, Quote } from 'lucide-react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { PressBadge } from '../../auth/components/PressBadge';

interface BestOneLineReviewSpotlightCardProps {
  onOpenVoteModal?: () => void;
  onOpenReviewsDetail?: () => void;
}

export const BestOneLineReviewSpotlightCard: React.FC<BestOneLineReviewSpotlightCardProps> = ({
  onOpenVoteModal,
  onOpenReviewsDetail,
}) => {
  const { weeklySummary } = usePulseVoting();

  // Pick top review from weeklySummary or default to sample 1st place winner
  const topReview = weeklySummary.bestReviews?.[0] || {
    userName: '여의도취재반장',
    userAvatar: '',
    likes: 24,
    oneLineReview: '우원식 국회의장의 상임위 중재안과 이준석 의원의 반도체 특구 법안이 실질적 민생 도움이 됨!',
  };

  return (
    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
      {/* Top Glow Accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
              <span>지난주 베스트 한줄평 명예의 전당</span>
            </h4>
            <p className="text-[11px] text-slate-400">최다 공감 득표 1위 선정작</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>+100,000P 시상 완료</span>
        </span>
      </div>

      {/* Review Main Content Box */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3 relative z-10">
        {/* Reviewer Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
              {topReview.userName[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-extrabold text-white">{topReview.userName}</span>
                <PressBadge mediaName="KBS" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">지난주 1위 선정 ({topReview.likes}표 공감)</span>
            </div>
          </div>

          <span className="text-[11px] font-mono font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20 flex items-center gap-1 shrink-0">
            <ThumbsUp className="w-3 h-3 text-amber-400" />
            <span>{topReview.likes} 공감</span>
          </span>
        </div>

        {/* Quote Body */}
        <div className="relative bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 text-slate-200 text-xs font-medium italic leading-relaxed flex items-start gap-2">
          <Quote className="w-4 h-4 text-amber-400/70 shrink-0 rotate-180 mt-0.5" />
          <p className="flex-1">{topReview.oneLineReview}</p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 relative z-10">
        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
          <span>매주 월요일 11:00 AM 10만P 포상</span>
          {onOpenReviewsDetail && (
            <button
              onClick={onOpenReviewsDetail}
              className="text-indigo-400 hover:text-indigo-300 font-bold underline ml-1 flex items-center gap-0.5"
            >
              <span>전체보기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {onOpenVoteModal && (
          <button
            type="button"
            onClick={onOpenVoteModal}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>이번 주 10만P 한줄평 도전하기</span>
          </button>
        )}
      </div>
    </div>
  );
};
