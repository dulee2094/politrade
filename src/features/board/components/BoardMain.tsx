import React from 'react';
import { useBoardPosts } from '../hooks/useBoardPosts';
import { PostCardItem } from './PostCardItem';
import { PollWidget } from './PollWidget';
import { CreatePostModal } from './CreatePostModal';
import { PostDetailModal } from './PostDetailModal';
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
          <p className="text-xs text-slate-400">현직 기자의 심층 분석과 국회의원 의정 활동 토론 공간</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 shrink-0"
        >
          <PenTool className="w-4 h-4" />
          <span>새 의견 작성하기</span>
        </button>
      </div>

      {/* Weekly Poll Widget */}
      <PollWidget poll={poll} onVote={votePoll} />

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs overflow-x-auto">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold whitespace-nowrap ${
                activeCategory === c.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="게시글/작성자 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2 py-1 rounded-lg ${sortBy === 'latest' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-2 py-1 rounded-lg ${sortBy === 'likes' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              추천순
            </button>
          </div>
        </div>

      </div>

      {/* Post Cards Feed List */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="bg-slate-800/40 p-8 rounded-2xl text-center text-slate-500 text-xs border border-slate-800 space-y-2">
            <p>검색 조건에 해당되는 게시글이 없습니다.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-blue-400 font-bold hover:underline"
            >
              첫 번째 의견을 작성해 보세요!
            </button>
          </div>
        ) : (
          posts.map(post => (
            <PostCardItem
              key={post.id}
              post={post}
              onClick={id => setSelectedPostId(id)}
              onLike={id => likePost(id)}
            />
          ))
        )}
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
