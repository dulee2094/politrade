import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { LivePulsePreview } from './LivePulsePreview';
import { FeatureCards } from './FeatureCards';
import { LoginModal } from './LoginModal';
import { useStore } from '../../../context/StoreContext';
import { ShieldAlert, Vote, UserPlus } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../../../config/constants';

interface LandingMainProps {
  onEnterApp: () => void;
}

export const LandingMain: React.FC<LandingMainProps> = ({ onEnterApp }) => {
  const { setIsSignUpModalOpen } = useStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans">
      
      {/* Header Bar for Landing */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white font-mono">POLITRADE</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs text-slate-300 hover:text-white font-bold px-3 py-2 rounded-xl transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{BRAND_STOCK_NAME} 회원가입</span>
            </button>
          </div>
        </div>
      </header>

      {/* Landing Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-12 flex-1">
        
        {/* 1. Hero Section */}
        <HeroSection
          onOpenSignUp={() => setIsSignUpModalOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onEnterApp={onEnterApp}
        />

        {/* 2. Live Market Pulse Preview */}
        <LivePulsePreview onEnterApp={onEnterApp} />

        {/* 3. 3 Key Feature Cards */}
        <FeatureCards />

      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-bold text-slate-400">POLITRADE © 2026 Politrade Inc. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span>본 플랫폼은 매월 초 정기 지원금 기반의 엔터테인먼트/모의투자 지표 서비스입니다.</span>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Trust & Verification Auth • AMM Bonding Curve Engine
          </div>
        </div>
      </footer>

    </div>
  );
};
