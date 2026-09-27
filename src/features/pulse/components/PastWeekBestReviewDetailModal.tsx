import React from 'react';
import { X, Trophy, ThumbsUp, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface PastWeekBestReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PastWeekBestReviewDetailModal: React.FC<PastWeekBestReviewDetailModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto p-6 space-y-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-amber-500/30 pb-4 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0 font-bold text-xl">
              🏆
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-xl font-black text-white">지난 주 최종 1위 베스트 한줄평 선정작</h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono font-bold">
                  BEST REVIEW WINNER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                지난주 유저 공감 최다 득표 1위 한줄평 수상작 및 +100,000 P 포상금 시상 완료 내역
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Winner Highlight Card */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          
          <div className="bg-slate-950 p-6 rounded-3xl border border-amber-500/50 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg font-mono flex items-center gap-1">
                  🥇 지난주 1위 수상작
                </span>
                <span className="text-sm font-extrabold text-white">여의도취재반장</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                <ThumbsUp className="w-3.5 h-3.5 text-amber-400" /> 공감 24표 획득
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-100 font-medium italic leading-relaxed">
                "우원식 국회의장의 상임위 중재안과 이준석 의원의 반도체 특구 법안이 실질적 민생 도움이 됨!"
              </p>
            </div>

            <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
              <div className="flex items-center space-x-2 font-sans font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>포상금 +100,000 P 지급 완료 (월요일 11:00 AM 정산 완료)</span>
              </div>
              <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 text-[10px]">
                시상 완료
              </span>
            </div>

          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1 font-sans">
            <p className="font-extrabold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>한줄평 시상 안내</span>
            </p>
            <p>매주 유저들이 작성한 한줄평 중 최다 공감을 받은 1위 유저에게 현금처럼 사용 가능한 가상 포 포인트(+100,000P)가 수여됩니다.</p>
          </div>

        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all border border-slate-700"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
