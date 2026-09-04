import React from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { MessageSquare, Heart, ThumbsUp, Sparkles } from 'lucide-react';

export const OneLineReviewFeed: React.FC = () => {
  const { votes, likeReview } = usePulseVoting();

  const reviews = votes.filter(v => v.oneLineReview && v.oneLineReview.length > 0);

  if (reviews.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 text-center text-slate-500 text-xs font-mono">
        아직 등록된 한줄평이 없습니다. 오늘 투표에 참여하고 첫 한줄평을 남겨보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>실시간 민심 한줄평 피드</span>
          </h3>
          <p className="text-[11px] text-slate-400">유저들이 직접 남긴 의정평가 한줄평 및 공감 투표</p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
          총 {reviews.length}개 한줄평
        </span>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start justify-between gap-3 font-sans">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs text-white">{rev.userName}</span>
                <span className="text-[10px] text-slate-500 font-mono">{rev.createdAt}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                "{rev.oneLineReview}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => likeReview(rev.id)}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all font-mono text-xs shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>{rev.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
