import React from 'react';
import { useBoardPosts } from '../hooks/useBoardPosts';
import { PostCardItem } from './PostCardItem';
import { PollWidget } from './PollWidget';
import { CreatePostModal } from './CreatePostModal';
import { PostDetailModal } from './PostDetailModal';
import { WeeklyPulseReportCard } from '../../pulse/components/WeeklyPulseReportCard';
import { OneLineReviewFeed } from '../../pulse/components/OneLineReviewFeed';
import { MessageSquare, Search, PenTool } from 'lucide-react';
import { BoardCategory } from '../types/board.types';

export const BoardMain: React.FC = () => {
  const {
    posts,
    poll,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedPostId,
    setSelectedPostId,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createPost,
    likePost,
    votePoll,
  } = useBoardPosts();

  const categories: { label: string; value: BoardCategory }[] = [
    { label: '전체 (All)', value: 'ALL' },
    { label: '🔥 핫이슈', value: 'HOT' },
    { label: '📊 종목 분석', value: 'ANALYSIS' },
    { label: '🗳️ 민심 투표', value: 'POLL' },
    { label: '❓ Q&A', value: 'QNA' },
  ];

  const selectedPost = posts.find(p => p.id === selectedPostId) || null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>민심 광장 & 기자 게시판</span>
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
              REPORTER FORUM
            </span>
          </h2>
          <p className="text-xs text-slate-400">인증 닉네임 기반의 자율 토론 및 주간 여론조사 펄스 피드</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 shrink-0"
        >
          <PenTool className="w-4 h-4" />
          <span>새 기사 / 게시글 작성</span>
        </button>
      </div>

      {/* 1. Weekly Pulse Report Card */}
      <WeeklyPulseReportCard />

      {/* 2. One Line Review Live Feed */}
      <OneLineReviewFeed />

      {/* 3. Main Board Layout: Posts List (Left) vs Weekly Poll (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Posts List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
            {/* Category Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setActiveCategory(c.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeCategory === c.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="제목/작성자 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Posts Cards Grid */}
          <div className="space-y-3">
            {posts.map(post => (
              <PostCardItem
                key={post.id}
                post={post}
                onClick={() => setSelectedPostId(post.id)}
                onLike={() => likePost(post.id)}
              />
            ))}
          </div>

        </div>

        {/* Right Column: Weekly Sentiment Poll */}
        <div className="lg:col-span-4">
          <PollWidget poll={poll} onVote={votePoll} />
        </div>

      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createPost}
      />

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPostId(null)}
        onLike={likePost}
      />

    </div>
  );
};
