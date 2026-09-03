import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { X, Tag, Send } from 'lucide-react';
import { PressBadge } from '../../auth/components/PressBadge';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: 'HOT' | 'ANALYSIS' | 'POLL' | 'QNA';
    title: string;
    content: string;
    taggedPoliticianId?: string;
    taggedPoliticianName?: string;
  }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { politicians, user } = useStore();
  const [category, setCategory] = useState<'HOT' | 'ANALYSIS' | 'POLL' | 'QNA'>('HOT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [taggedPolId, setTaggedPolId] = useState<string>('');

  if (!isOpen) return null;

  const isReporterVerified = (user as any).isReporterVerified || false;
  const pressName = (user as any).pressName || '언론사';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 본문을 모두 입력해 주세요.');
      return;
    }

    const selectedPol = politicians.find(p => p.id === taggedPolId);

    onSubmit({
      category,
      title,
      content,
      taggedPoliticianId: selectedPol?.id,
      taggedPoliticianName: selectedPol?.name,
    });

    alert('게시글 등록이 완료되었습니다.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white">{user.name}</h2>
                {isReporterVerified && <PressBadge mediaName={pressName} />}
              </div>
              <p className="text-xs text-slate-400">민심 광장에 전문 분석 및 의견 개진하기</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">카테고리 선택</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '🔥 핫이슈', val: 'HOT' },
                { label: '📊 종목 분석', val: 'ANALYSIS' },
                { label: '🗳️ 민심 투표', val: 'POLL' },
                { label: '❓ Q&A', val: 'QNA' },
              ].map(c => (
                <button
                  key={c.val}
                  type="button"
                  onClick={() => setCategory(c.val as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    category === c.val
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">글 제목</label>
            <input
              type="text"
              required
              placeholder="제목을 입력하세요 (예: [단독] 본회의 표결 분석 및 AMM 주가 전망)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tagged Politician */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                관련 국회의원 태그 (선택)
              </span>
              <span className="text-slate-500 font-normal text-[11px]">선택 시 주가 카드가 함께 표출됩니다.</span>
            </label>
            <select
              value={taggedPolId}
              onChange={e => setTaggedPolId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">관련 국회의원 선택 안함</option>
              {politicians.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.party} • {p.district})
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">글 내용</label>
            <textarea
              required
              rows={6}
              placeholder="정치 이슈 및 주가 수급 전망에 대한 의견을 자유롭게 작성해주세요..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1"
          >
            <Send className="w-4 h-4" />
            <span>게시글 등록하기</span>
          </button>

        </form>

      </div>
    </div>
  );
};
