import React from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { useStore } from '../../../context/StoreContext';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { 
  ArrowLeft, 
  Vote, 
  MessageSquare, 
  Heart, 
  Sparkles, 
  Award, 
  Gift, 
  Calendar, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface MyPulseActivityDetailViewProps {
  onBackToDashboard: () => void;
  onOpenVoteModal: () => void;
}

export const MyPulseActivityDetailView: React.FC<MyPulseActivityDetailViewProps> = ({ 
  onBackToDashboard, 
  onOpenVoteModal 
}) => {
  const { user, politicians } = useStore();
  const { votes, likeReview, hasVotedToday, BEST_REVIEW_REWARD, DAILY_VOTE_REWARD } = usePulseVoting();

  const userId = user?.verifiedEmail || user?.name || 'user';
  const userName = user?.name || '참여회원';

  // User's own submitted vote & review records
  const myVoteRecords = votes.filter(v => v.userId === userId || v.userName === userName);
  const myTotalLikes = myVoteRecords.reduce((sum, r) => sum + (r.likes || 0), 0);
  const myReviewsCount = myVoteRecords.filter(v => v.oneLineReview && v.oneLineReview.length > 0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">민심 펄스 나의 활동 상세 리포트</h2>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold">
                PULSE ACTIVITY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">내가 참여한 투표 이력, 한줄평 작성 목록 및 받은 공감(Heart) 누적 현황</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={onOpenVoteModal}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{hasVotedToday ? '오늘 투표 완료 (수정)' : '오늘의 펄스 투표하기 (+1,000P)'}</span>
          </button>

          {/* Top-Right Unified Back Button */}
          <button
            type="button"
            onClick={onBackToDashboard}
            className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-600 hover:border-amber-400 shadow-md transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>대시보드로 돌아가기</span>
          </button>
        </div>
      </div>

      {/* KPI Activity Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Today's Vote Status */}
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-amber-500/30 space-y-2 shadow-xl">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-amber-400" />
            오늘의 펄스 투표 참여 상태
          </span>
          <div className="pt-1">
            {hasVotedToday ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>투표 및 참여 보상 (+1,000P) 완료</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-sans">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>오늘 미참여 (투표 시 +1,000P 즉시 적립)</span>
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Cumulative Review Likes */}
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-rose-500/30 space-y-1 shadow-xl">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            한줄평 누적 획득 공감 (Likes)
          </span>
          <div className="text-2xl font-black text-rose-400 font-mono pt-1">
            {myTotalLikes} <span className="text-xs font-sans text-slate-400 font-normal">개 공감 수령</span>
          </div>
          <p className="text-[11px] text-slate-500">다른 유저들로부터 받은 총 공감 수</p>
        </div>

        {/* Card 3: Best Review Reward Award Info */}
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-indigo-500/30 space-y-1 shadow-xl">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-indigo-400" />
            베스트 한줄평 시상 포상금
          </span>
          <div className="text-2xl font-black text-indigo-300 font-mono pt-1">
            +{formatPoints(BEST_REVIEW_REWARD)}
          </div>
          <p className="text-[11px] text-slate-400">매주 월요일 11:00 AM 최다 공감자 1인 시상</p>
        </div>

      </div>

      {/* User's Submitted Reviews List */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>✍️ 내가 작성한 한줄평 & 선택한 Best/Worst 의원 목록 ({myReviewsCount}건)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">공감 수령 및 투표 기록</span>
        </div>

        {myVoteRecords.length > 0 ? (
          <div className="space-y-3">
            {myVoteRecords.map((rec) => {
              const bestPols = rec.bestPoliticianIds.map(id => politicians.find(p => p.id === id)).filter(Boolean);
              const worstPols = rec.worstPoliticianIds.map(id => politicians.find(p => p.id === id)).filter(Boolean);

              return (
                <div key={rec.id} className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/60 space-y-3 font-sans">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-white">{rec.date} 투표</span>
                      <span className="text-[10px] text-slate-400 font-mono">({rec.createdAt})</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                        <span>공감 {rec.likes}개</span>
                      </span>
                    </div>
                  </div>

                  {rec.oneLineReview && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs text-amber-200 leading-relaxed italic">
                      "{rec.oneLineReview}"
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    {/* Best Selection */}
                    <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 block">🏆 선택한 Best 의원:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {bestPols.map(pol => pol && (
                          <div key={pol.id} className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-emerald-500/30">
                            <PoliticianAvatar src={pol.imageUrl} name={pol.name} party={pol.party} className="w-4 h-4 rounded-full" />
                            <span className="text-[11px] font-bold text-white">{pol.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Worst Selection */}
                    <div className="bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20 space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-400 block">⚠️ 선택한 Worst 의원:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {worstPols.map(pol => pol && (
                          <div key={pol.id} className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-rose-500/30">
                            <PoliticianAvatar src={pol.imageUrl} name={pol.name} party={pol.party} className="w-4 h-4 rounded-full" />
                            <span className="text-[11px] font-bold text-white">{pol.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">아직 작성하신 한줄평이 없습니다. 오늘의 펄스 투표에 참여해 한줄평을 남겨보세요!</p>
            <button
              type="button"
              onClick={onOpenVoteModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>투표 및 한줄평 작성하기</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
