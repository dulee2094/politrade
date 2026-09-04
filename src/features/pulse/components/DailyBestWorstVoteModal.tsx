import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { ThumbsUp, ThumbsDown, X, Award, CheckCircle2, MessageSquare, Gift, Sparkles } from 'lucide-react';

interface DailyBestWorstVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitVote: (bestIds: string[], worstIds: string[], review?: string) => { success: boolean; message: string };
  rewardAmount: number;
}

export const DailyBestWorstVoteModal: React.FC<DailyBestWorstVoteModalProps> = ({
  isOpen,
  onClose,
  onSubmitVote,
  rewardAmount,
}) => {
  const { politicians } = useStore();

  const [selectedBest, setSelectedBest] = useState<string[]>([]);
  const [selectedWorst, setSelectedWorst] = useState<string[]>([]);
  const [oneLineReview, setOneLineReview] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const toggleBest = (id: string) => {
    if (selectedWorst.includes(id)) {
      setSelectedWorst(prev => prev.filter(item => item !== id));
    }
    if (selectedBest.includes(id)) {
      setSelectedBest(prev => prev.filter(item => item !== id));
    } else {
      if (selectedBest.length >= 3) {
        setFeedback({ type: 'error', message: 'Best 의원은 최대 3인까지 선택 가능합니다.' });
        return;
      }
      setFeedback(null);
      setSelectedBest(prev => [...prev, id]);
    }
  };

  const toggleWorst = (id: string) => {
    if (selectedBest.includes(id)) {
      setSelectedBest(prev => prev.filter(item => item !== id));
    }
    if (selectedWorst.includes(id)) {
      setSelectedWorst(prev => prev.filter(item => item !== id));
    } else {
      if (selectedWorst.length >= 3) {
        setFeedback({ type: 'error', message: 'Worst 의원은 최대 3인까지 선택 가능합니다.' });
        return;
      }
      setFeedback(null);
      setSelectedWorst(prev => [...prev, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = onSubmitVote(selectedBest, selectedWorst, oneLineReview);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        onClose();
        setSelectedBest([]);
        setSelectedWorst([]);
        setOneLineReview('');
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>오늘의 Best 3인 & Worst 3인 투표</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold flex items-center gap-1">
                  <Gift className="w-3 h-3" /> +{rewardAmount} P 보상
                </span>
              </h2>
              <p className="text-xs text-slate-400">10인 의원 중 오늘 가장 의정활동이 뛰어난 Best3, 미흡한 Worst3를 뽑아주세요. (1일 1회)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Politicians Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-sans font-bold">의원 선택 (Best 최대 3인 / Worst 최대 3인)</span>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 font-bold">Best: {selectedBest.length}/3인</span>
                <span className="text-rose-400 font-bold">Worst: {selectedWorst.length}/3인</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {politicians.map((pol) => {
                const isBest = selectedBest.includes(pol.id);
                const isWorst = selectedWorst.includes(pol.id);

                return (
                  <div
                    key={pol.id}
                    className={`p-2 rounded-xl border transition-all text-center space-y-1.5 flex flex-col justify-between ${
                      isBest
                        ? 'bg-emerald-500/20 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                        : isWorst
                        ? 'bg-rose-500/20 border-rose-500/80 shadow-md shadow-rose-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-center pt-1">
                      <PoliticianAvatar
                        src={pol.imageUrl}
                        name={pol.name}
                        party={pol.party}
                        className="w-10 h-10 rounded-xl"
                      />
                    </div>

                    <div>
                      <div className="font-extrabold text-xs text-white truncate">{pol.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{pol.party}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-700/40">
                      <button
                        type="button"
                        onClick={() => toggleBest(pol.id)}
                        className={`py-1 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                          isBest
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-700/60 text-slate-300 hover:bg-emerald-600/40 hover:text-emerald-300'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" /> BEST
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWorst(pol.id)}
                        className={`py-1 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                          isWorst
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-700/60 text-slate-300 hover:bg-rose-600/40 hover:text-rose-300'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" /> WORST
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional One-Line Review Field */}
          <div className="space-y-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>[선택] 투표 이유 한줄평 작성하기</span>
              </label>
              <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 베스트 한줄평 선정 시 +2,000 P 추가 지급!
              </span>
            </div>
            <textarea
              rows={2}
              value={oneLineReview}
              onChange={e => setOneLineReview(e.target.value)}
              placeholder="예: 우원식 의장의 민생 입법 중재 노고에 1표를 보냅니다! (한줄평 작성은 선택 사항입니다)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Feedback messages */}
          {feedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center space-x-2 ${
              feedback.type === 'error'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2"
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>오늘의 Best/Worst 3인 투표 제출하기 (+{rewardAmount} P 지급)</span>
          </button>

        </form>

      </div>
    </div>
  );
};
