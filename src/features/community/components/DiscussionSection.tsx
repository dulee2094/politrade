import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { MessageSquare, Send } from 'lucide-react';

interface DiscussionSectionProps {
  politicianId: string;
  politicianName: string;
}

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({ politicianId, politicianName }) => {
  const { comments, addComment } = useStore();
  const [commentInput, setCommentInput] = useState('');

  const polComments = comments.filter(c => c.politicianId === politicianId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(politicianId, commentInput);
    setCommentInput('');
  };

  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-indigo-400" />
        <span>종목 실시간 토론방</span>
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder={`${politicianName} 의원에 대한 의견을 남겨보세요...`}
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>등록</span>
        </button>
      </form>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {polComments.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">첫 번째 댓글을 작성해 보세요!</p>
        ) : (
          polComments.map((cmt) => (
            <div key={cmt.id} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src={cmt.userAvatar} alt={cmt.userName} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-300">{cmt.userName}</span>
                  {cmt.holdingStatus === 'HOLDER' && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30">
                      주주
                    </span>
                  )}
                  {cmt.holdingStatus === 'BUYER' && (
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.2 rounded border border-blue-500/30">
                      매수자
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{cmt.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300">{cmt.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
