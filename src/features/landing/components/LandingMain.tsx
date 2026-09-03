import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { LivePulsePreview } from './LivePulsePreview';
import { FeatureCards } from './FeatureCards';
import { LoginModal } from './LoginModal';
import { useStore } from '../../../context/StoreContext';
import { PolitradeLogo } from '../../../shared/ui/PolitradeLogo';
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
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PolitradeLogo size="md" onClick={onEnterApp} />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs text-slate-300 hover:text-white font-bold px-3.5 py-2 rounded-xl transition-colors bg-slate-800/60 border border-slate-700/80"
            >
              로그인
            </button>
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>{BRAND_STOCK_NAME} 시작하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16 flex-1 w-full">
        <HeroSection
          onOpenSignUp={() => setIsSignUpModalOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onEnterApp={onEnterApp}
        />

        <LivePulsePreview onEnterApp={() => setIsLoginModalOpen(true)} />

        <FeatureCards />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-extrabold text-slate-300">POLITRADE © 2026 Politrade Inc. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span>본 서비스는 공적 이슈 모니터링 및 월간 정기 지원금 기반의 지지도 지표 플랫폼입니다.</span>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            {BRAND_STOCK_NAME} Engine v13.0 • Pretendard & Outfit Fonts
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={onEnterApp}
      />

    </div>
  );
};
