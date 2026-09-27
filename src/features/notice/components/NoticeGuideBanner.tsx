import React from 'react';
import { Megaphone, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface NoticeGuideBannerProps {
  onOpenNoticeModal: () => void;
}

export const NoticeGuideBanner: React.FC<NoticeGuideBannerProps> = ({ onOpenNoticeModal }) => {
  return (
    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl relative overflow-hidden">
      
      <div className="flex items-center space-x-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shrink-0">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <span>📢 폴리트레이드 안내 & 공지사항 Center</span>
            </span>
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>ONBOARDING & NOTICES</span>
            </span>
          </div>
          
          <p className="text-xs text-slate-300 font-medium truncate sm:whitespace-normal">
            💡 정치인 주식 거래 & 민심 여론조사 펄스 플랫폼 이용가이드, 신규 상장 소식 및 전체 시스템 현황
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          type="button"
          onClick={onOpenNoticeModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-indigo-400/40 transition-all shadow-lg flex items-center space-x-1.5 shrink-0 hover:scale-[1.02]"
        >
          <BookOpen className="w-4 h-4" />
          <span>📘 이용가이드 & 주요 공지 전체보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
