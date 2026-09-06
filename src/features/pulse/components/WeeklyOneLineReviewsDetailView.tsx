import React, { useState } from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { ArrowLeft, Award, Sparkles, ThumbsUp, CheckCircle2, MessageSquare, Megaphone, Trophy, Vote } from 'lucide-react';

interface WeeklyOneLineReviewsDetailViewProps {
  onBackToDashboard: () => void;
  onOpenVoteModal: () => void;
}

export const WeeklyOneLineReviewsDetailView: React.FC<WeeklyOneLineReviewsDetailViewProps> = ({
  onBackToDashboard,
  onOpenVoteModal,
}) => {
  const { votes, likeReview, userLikedReviewIds, hasVotedToday } = usePulseVoting();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter votes with text and sort by likes descending
  const sortedReviews = votes
    .filter(v => v.oneLineReview && v.oneLineReview.trim().length > 0)
    .sort((a, b) => b.likes - a.likes);

  const handleVoteReview = (reviewId: string) => {
    const res = likeReview(reviewId);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header & Unified Back Button */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <MessageSquare className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">금주의 베스트 한줄평 실시간 득표 현황 및 투표</h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold">
                ONE-LINE REVIEW RANKING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              유저들이 작성한 한줄평에 공감 투표하세요! 매주 월요일 11시 최다 득표 1위에게 +100,000 P 포상금이 지급됩니다.
            </p>
          </div>
        </div>

        {/* Top-Right Unified Back Button */}
        <button
          type="button"
          onClick={onBackToDashboard}
          className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-600 hover:border-amber-400 shadow-md transition-all flex items-center space-x-1.5 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>메인 대시보드로 돌아가기</span>
        </button>
      </div>

      {/* Notice Banner: Last Week's Best Review Winner */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-black text-amber-300 font-sans">
              🏆 지난 주 최종 1위 베스트 한줄평 선정작 (+100,000P 시상 완료)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            포상금 지급 완료
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded font-mono">
                지난주 1위
              </span>
              <span className="text-xs font-extrabold text-white">여의도취재반장</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-amber-400" /> 24표 획득
            </span>
          </div>
          <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
            "우원식 국회의장의 상임위 중재안과 이준석 의원의 반도체 특구 법안이 실질적 민생 도움이 됨!"
          </p>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl border text-xs font-extrabold flex items-center space-x-2 shadow-lg ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main List Section */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>이번 주 전체 한줄평 실시간 득표 순위 ({sortedReviews.length}개 등록됨)</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            * 한줄평당 1회만 공감(투표) 가능
          </span>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs font-bold text-slate-400">아직 이번 주 작성된 한줄평이 없습니다.</p>
            <p className="text-[11px]">오늘의 펄스 투표에 참여하고 첫 한줄평을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedReviews.map((rev, idx) => {
              const isLikedByMe = userLikedReviewIds.includes(rev.id);

              return (
                <div
                  key={rev.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    idx === 0
                      ? 'bg-slate-950 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : idx < 3
                      ? 'bg-slate-950/80 border-indigo-500/30'
                      : 'bg-slate-950/50 border-slate-800'
                  }`}
                >
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black font-mono flex items-center justify-center ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      {rev.userAvatar ? (
                        <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-900/60 text-indigo-300 text-[10px] font-extrabold flex items-center justify-center border border-indigo-500/40">
                          {rev.userName.slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-extrabold text-white">{rev.userName}</span>
                        <span className="text-[10px] text-slate-500 ml-2 font-mono">{rev.createdAt}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {rev.likes}표 획득
                    </span>
                  </div>

                  {/* Review Text Content */}
                  <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    "{rev.oneLineReview}"
                  </p>

                  {/* Vote Button */}
                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleVoteReview(rev.id)}
                      disabled={isLikedByMe}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center space-x-1.5 ${
                        isLikedByMe
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20'
                      }`}
                    >
                      {isLikedByMe ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>공감 완료 (1회 제한)</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-950" />
                          <span>👍 이 한줄평에 공감 투표하기 (+1표)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to write review */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">나만의 한줄평을 작성하여 월요일 11시 +100,000P 포상금에 도전해보세요!</p>
          <button
            type="button"
            onClick={onOpenVoteModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 shrink-0"
          >
            <Vote className="w-4 h-4 text-amber-300" />
            <span>{hasVotedToday ? '오늘 투표 내역 수정하기' : '오늘의 펄스 투표 & 한줄평 작성하기 (+1,000P)'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
