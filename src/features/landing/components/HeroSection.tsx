import React from 'react';
import { Newspaper, ArrowRight, ShieldCheck, TrendingUp, Sparkles, Key } from 'lucide-react';
import { PressBadge } from '../../auth/components/PressBadge';

interface HeroSectionProps {
  onOpenSignUp: () => void;
  onOpenLogin: () => void;
  onEnterApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSignUp, onOpenLogin, onEnterApp }) => {
  return (
    <div className="relative py-12 sm:py-20 overflow-hidden text-center sm:text-left space-y-8">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-xs text-blue-300 font-medium shadow-md">
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span>언론사 기자 전용 정치인 주식 & 실시간 민심 펄스</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          언론사 기자들이 실시간으로 움직이는 <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            정치인 민심 주가 플랫폼
          </span>
        </h1>

        {/* Sub Title */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          공식 언론사 이메일 인증으로 가짜 뉴스와 어뷰징을 완벽히 차단하고, <br className="hidden sm:inline" />
          매월 초 정기 지원금(10만P)으로 국회의원 지지도 및 주가를 정밀 예측하세요.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 pt-4">
          <button
            onClick={onOpenSignUp}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2"
          >
            <Newspaper className="w-4 h-4" />
            <span>기자 이메일 회원가입</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <Key className="w-4 h-4 text-indigo-400" />
            <span>기자 간편 로그인</span>
          </button>

          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-blue-400 border border-blue-500/30 font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <span>시범 서비스 둘러보기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Points */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 언론사 도메인 검증
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> 매월 1일 10만P 자동지급
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-400" /> AMM 수급 주가 체결
          </span>
        </div>

      </div>
    </div>
  );
};
