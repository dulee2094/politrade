import React from 'react';
import { BoardPost } from '../types/board.types';
import { PressBadge } from '../../auth/components/PressBadge';
import { ThumbsUp, MessageSquare, Eye, TrendingUp, Tag } from 'lucide-react';
import { formatPercent } from '../../../core/utils/formatters';

interface PostCardItemProps {
  post: BoardPost;
  onClick: (id: string) => void;
  onLike: (id: string) => void;
}

export const PostCardItem: React.FC<PostCardItemProps> = ({ post, onClick, onLike }) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'HOT': return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded">🔥 핫이슈</span>;
      case 'ANALYSIS': return <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded">📊 종목 분석</span>;
      case 'POLL': return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded">🗳️ 민심 투표</span>;
      default: return <span className="bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded">❓ Q&A</span>;
    }
  };

  return (
    <div
      onClick={() => onClick(post.id)}
      className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg space-y-3 group"
    >
      {/* Header: Author + Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700" />
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-xs">{post.authorName}</span>
            {post.isReporterVerified && (
              <PressBadge mediaName={post.pressMediaName} />
            )}
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {formatPercent(post.authorRoiPct)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getCategoryBadge(post.category)}
          <span className="text-[10px] text-slate-500 font-mono">{post.createdAt}</span>
        </div>
      </div>

      {/* Title & Preview */}
      <div>
        <h3 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {post.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Footer: Tagged Politician + Stats */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
        {post.taggedPoliticianName ? (
          <span className="bg-blue-600/20 text-blue-300 text-[11px] px-2.5 py-0.5 rounded-lg border border-blue-500/30 flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3 text-blue-400" />
            <span>관련 의원: {post.taggedPoliticianName}</span>
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center space-x-4 text-slate-400 text-xs font-mono">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className="flex items-center space-x-1 hover:text-amber-400 transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{post.likes}</span>
          </button>

          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentsCount}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
