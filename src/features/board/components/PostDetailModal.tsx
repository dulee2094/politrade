import React, { useState } from 'react';
import { BoardPost } from '../types/board.types';
import { PressBadge } from '../../auth/components/PressBadge';
import { useStore } from '../../../context/StoreContext';
import { X, ThumbsUp, MessageSquare, Tag, Send, TrendingUp } from 'lucide-react';
import { formatPercent, formatPoints } from '../../../core/utils/formatters';

interface PostDetailModalProps {
  post: BoardPost | null;
  onClose: () => void;
  onLike: (id: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onLike }) => {
  const { politicians, setSelectedPoliticianId } = useStore();
  const [replyInput, setReplyInput] = useState('');
  const [replies, setReplies] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: 'r1', user: '정치개혁마니아', text: '좋은 분석글 감사합니다. 14,000P 돌파 타겟가 매칭 동의합니다!', time: '10분 전' },
  ]);

  if (!post) return null;

  const taggedPol = post.taggedPoliticianId ? politicians.find(p => p.id === post.taggedPoliticianId) : null;

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    setReplies(prev => [
      ...prev,
      { id: 'rep_' + Date.now(), user: '국민트레이더', text: replyInput, time: '방금 전' }
    ]);
    setReplyInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-sm">{post.authorName}</span>
                {post.isReporterVerified && <PressBadge mediaName={post.pressMediaName} />}
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {formatPercent(post.authorRoiPct)}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{post.createdAt} 작성</span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 overflow-y-auto pr-1">
          <h1 className="text-lg sm:text-xl font-black text-white leading-snug">{post.title}</h1>
          
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
            {post.content}
          </div>

          {/* Tagged Politician Live Card */}
          {taggedPol && (
            <div 
              onClick={() => {
                onClose();
                setSelectedPoliticianId(taggedPol.id);
              }}
              className="bg-slate-800 hover:bg-slate-750 p-4 rounded-xl border border-blue-500/40 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <img src={taggedPol.imageUrl} alt={taggedPol.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{taggedPol.name}</span>
                    <span className="text-xs text-slate-400">{taggedPol.party}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">클릭하여 차트보기 및 매매하기</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="font-extrabold text-sm text-white">{formatPoints(taggedPol.currentPrice)}</div>
                <div className={taggedPol.change24h >= 0 ? 'text-emerald-400 text-xs font-bold' : 'text-rose-400 text-xs font-bold'}>
                  {formatPercent(taggedPol.change24h)}
                </div>
              </div>
            </div>
          )}

          {/* Like / Share Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <ThumbsUp className="w-4 h-4 text-amber-400" />
              <span>추천하기 ({post.likes})</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">조회수 {post.views}회</span>
          </div>

          {/* Reply Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>댓글 ({replies.length})</span>
            </h3>

            <form onSubmit={handleAddReply} className="flex gap-2">
              <input
                type="text"
                placeholder="댓글을 작성해 보세요..."
                value={replyInput}
                onChange={e => setReplyInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-2">
              {replies.map(rep => (
                <div key={rep.id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">{rep.user}</span>
                    <span className="text-[10px] text-slate-500">{rep.time}</span>
                  </div>
                  <p className="text-slate-300">{rep.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
