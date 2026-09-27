import React, { useState } from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { useStore } from '../../../context/StoreContext';
import { 
  ArrowLeft, Sparkles, ThumbsUp, CheckCircle2, MessageSquare, Vote, 
  Search, Filter, Clock, Trophy, Heart
} from 'lucide-react';

interface WeeklyOneLineReviewsDetailViewProps {
  onBackToDashboard: () => void;
  onOpenVoteModal: () => void;
}

export const WeeklyOneLineReviewsDetailView: React.FC<WeeklyOneLineReviewsDetailViewProps> = ({
  onBackToDashboard,
  onOpenVoteModal,
}) => {
  const { politicians } = useStore();
  const { votes, likeReview, userLikedReviewIds, hasVotedToday } = usePulseVoting();

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sortBy, setSortBy] = useState<'likes' | 'latest'>('likes');
  const [selectedPoliticianId, setSelectedPoliticianId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract all non-empty reviews
  const allReviews = votes.filter(v => v.oneLineReview && v.oneLineReview.trim().length > 0);

  // Filter & Sort
  const filteredAndSortedReviews = allReviews
    .filter(rev => {
      // Filter by Politician
      if (selectedPoliticianId !== 'ALL') {
        const pol = politicians.find(p => p.id === selectedPoliticianId);
        if (pol) {
          const matchName = rev.oneLineReview?.includes(pol.name);
          const matchId = rev.bestPoliticianIds.includes(pol.id) || rev.worstPoliticianIds.includes(pol.id);
          if (!matchName && !matchId) return false;
        }
      }
      // Filter by Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchText = rev.oneLineReview?.toLowerCase().includes(q);
        const matchUser = rev.userName.toLowerCase().includes(q);
        if (!matchText && !matchUser) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return b.id > a.id ? 1 : -1;
      }
      return b.likes - a.likes;
    });

  const handleVoteReview = (reviewId: string) => {
    const res = likeReview(reviewId);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* Top Header & Unified Back Button */}
      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <MessageSquare className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">금주의 베스트 한줄평 실시간 득표 현황</h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold">
                ONE-LINE REVIEW RANKING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              유저들의 한줄평에 공감(투표)하세요! 매주 월요일 11시 최다 득표 1위에게 +100,000 P 포상금이 지급됩니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToDashboard}
          className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-600 hover:border-amber-400 shadow-md transition-all flex items-center space-x-1.5 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>메인 대시보드로 돌아가기</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`p-3.5 rounded-xl border text-xs font-extrabold flex items-center space-x-2 shadow-lg ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main High-Density Section */}
      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        
        {/* Section Title & Subtext */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>이번 주 전체 한줄평 리스트 ({filteredAndSortedReviews.length}개 표출 / 총 {allReviews.length}개)</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            * 한줄평당 1회만 공감(투표) 가능
          </span>
        </div>

        {/* High-Density Filtering & Sorting Toolbar Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 font-sans text-xs">
          
          {/* Search Bar (5 cols) */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="한줄평 내용 또는 작성자 검색..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 text-white rounded-xl border border-slate-700/80 focus:border-amber-400 focus:outline-none placeholder-slate-500 text-xs transition-colors"
            />
          </div>

          {/* Politician Filter (4 cols) */}
          <div className="sm:col-span-4 relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <select
              value={selectedPoliticianId}
              onChange={e => setSelectedPoliticianId(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-950 text-white rounded-xl border border-slate-700/80 focus:border-amber-400 focus:outline-none text-xs transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL">🏛️ 전체 의원 한줄평 보기</option>
              {politicians.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.party})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Toggle (3 cols) */}
          <div className="sm:col-span-3 flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setSortBy('likes')}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
                sortBy === 'likes'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>득표순</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
                sortBy === 'latest'
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>최신순</span>
            </button>
          </div>

        </div>

        {/* High-Density Compact Review List */}
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2 bg-slate-950/50 rounded-2xl border border-slate-800/80">
            <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs font-bold text-slate-400">조건에 일치하는 한줄평이 없습니다.</p>
            <p className="text-[11px]">검색어나 필터를 변경하거나 오늘의 펄스 투표에 참여해 첫 한줄평을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedReviews.map((rev, idx) => {
              const isLikedByMe = userLikedReviewIds.includes(rev.id);

              return (
                <div
                  key={rev.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    idx === 0 && sortBy === 'likes'
                      ? 'bg-slate-950 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : idx < 3 && sortBy === 'likes'
                      ? 'bg-slate-950/90 border-indigo-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950'
                  }`}
                >
                  {/* Left Main Information */}
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    
                    {/* Rank Badge */}
                    <span className={`w-5 h-5 rounded-md text-[10px] font-black font-mono flex items-center justify-center shrink-0 ${
                      sortBy === 'likes' && idx === 0
                        ? 'bg-amber-400 text-slate-950'
                        : sortBy === 'likes' && idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : sortBy === 'likes' && idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {idx + 1}
                    </span>

                    {/* User Avatar */}
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-900/60 text-indigo-300 text-[9px] font-black flex items-center justify-center border border-indigo-500/40 shrink-0">
                        {rev.userName.slice(0, 1)}
                      </div>
                    )}

                    {/* Username & Time */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="text-xs font-extrabold text-white">{rev.userName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{rev.createdAt}</span>
                    </div>

                    {/* Compact Quoted Review Text */}
                    <p className="text-xs text-slate-200 font-medium leading-normal bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 min-w-0 flex-1 truncate sm:whitespace-normal">
                      "{rev.oneLineReview}"
                    </p>
                  </div>

                  {/* Right Actions: Vote Count & Button */}
                  <div className="flex items-center justify-between sm:justify-end space-x-2.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {rev.likes}표 획득
                    </span>

                    <button
                      type="button"
                      onClick={() => handleVoteReview(rev.id)}
                      disabled={isLikedByMe}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center space-x-1 whitespace-nowrap ${
                        isLikedByMe
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/10'
                      }`}
                    >
                      {isLikedByMe ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>공감 완료</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                          <span>👍 공감 (+1표)</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
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
