import { useState } from 'react';
import { BoardPost, BoardCategory, WeeklyPoll } from '../types/board.types';
import { INITIAL_POSTS, INITIAL_POLL } from '../data/mockBoard';
import { useStore } from '../../../context/StoreContext';

export function useBoardPosts() {
  const { user } = useStore();
  const [posts, setPosts] = useState<BoardPost[]>(INITIAL_POSTS);
  const [poll, setPoll] = useState<WeeklyPoll>(INITIAL_POLL);
  const [activeCategory, setActiveCategory] = useState<BoardCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'views'>('latest');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPosts = posts
    .filter(p => {
      const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
      const matchSearch = p.title.includes(searchQuery) || p.content.includes(searchQuery) || p.authorName.includes(searchQuery);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return b.likes - a.likes;
      if (sortBy === 'views') return b.views - a.views;
      return 0; // latest by default
    });

  const createPost = (newPostData: {
    category: 'HOT' | 'ANALYSIS' | 'POLL' | 'QNA';
    title: string;
    content: string;
    taggedPoliticianId?: string;
    taggedPoliticianName?: string;
  }) => {
    const isVerified = (user as any).isReporterVerified || false;
    const mediaName = (user as any).pressName || '언론사';

    const newPost: BoardPost = {
      id: 'post_' + Date.now(),
      category: newPostData.category,
      title: newPostData.title,
      content: newPostData.content,
      authorName: user.name,
      authorAvatar: user.avatar,
      isReporterVerified: isVerified,
      pressMediaName: isVerified ? mediaName : undefined,
      authorRoiPct: 15.0,
      taggedPoliticianId: newPostData.taggedPoliticianId,
      taggedPoliticianName: newPostData.taggedPoliticianName,
      likes: 1,
      dislikes: 0,
      commentsCount: 0,
      views: 1,
      createdAt: '방금 전',
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, likes: p.likes + 1 };
    }));
  };

  const votePoll = (optionId: string) => {
    if (poll.userVotedOptionId) return;

    setPoll(prev => {
      const updatedOpts = prev.options.map(opt => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        return opt;
      });
      return {
        ...prev,
        options: updatedOpts,
        totalVotes: prev.totalVotes + 1,
        userVotedOptionId: optionId,
      };
    });
  };

  return {
    posts: filteredPosts,
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
  };
}
