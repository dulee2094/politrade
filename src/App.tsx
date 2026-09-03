import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { LandingMain } from './features/landing/components/LandingMain';
import { PortfolioSummaryCard } from './features/portfolio/components/PortfolioSummaryCard';
import { HoldingsTable } from './components/HoldingsTable';
import { MarketBoard } from './components/MarketBoard';
import { BoardMain } from './features/board/components/BoardMain';
import { Leaderboard } from './components/Leaderboard';
import { StockDetailModal } from './features/trading/components/StockDetailModal';
import { SignUpModal } from './features/auth/components/SignUpModal';
import { PressBadge } from './features/auth/components/PressBadge';
import { ShieldAlert, Sparkles, TrendingUp, Calendar, Newspaper } from 'lucide-react';
import { formatPoints, formatPercent } from './core/utils/formatters';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    politicians, 
    setSelectedPoliticianId, 
    user, 
    isSignUpModalOpen, 
    setIsSignUpModalOpen,
    allowanceNotice,
    setAllowanceNotice
  } = useStore();

  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  const topGainers = [...politicians].sort((a, b) => b.change24h - a.change24h).slice(0, 3);

  if (currentView === 'landing') {
    return (
      <>
        <LandingMain onEnterApp={() => setCurrentView('app')} />
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans">
      
      {/* Header Navigation */}
      <Header onShowLanding={() => setCurrentView('landing')} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 flex-1">
        
        {/* Monthly Allowance Notification Banner */}
        {allowanceNotice && (
          <div className="bg-gradient-to-r from-blue-900/80 via-emerald-900/80 to-slate-900 p-4 rounded-2xl border border-emerald-500/40 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">{allowanceNotice}</span>
            </div>
            <button
              onClick={() => setAllowanceNotice(null)}
              className="text-xs text-slate-400 hover:text-white font-mono bg-slate-800 px-3 py-1 rounded-lg border border-slate-700"
            >
              닫기
            </button>
          </div>
        )}

        {/* Press Verification Banner */}
        <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-slate-900/80 p-4 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">언론사 기자 전용 플랫폼</span>
                <PressBadge mediaName={user.pressName || 'KBS'} />
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                닉네임(<strong className="text-white">{user.name}</strong>)으로 매월 정기 지원금(10만P)으로 매매 및 민심 광장 토론에 참여하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/40 transition-all font-sans font-bold text-xs"
            >
              기자 인증 정보
            </button>
          </div>
        </div>

        {/* Tab Switch Routing */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Modular Portfolio Summary Card */}
            <PortfolioSummaryCard />

            {/* Top Gainers Highlight Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>오늘의 인기도 급상승 정치인 TOP 3</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {topGainers.map((pol) => (
                  <div
                    key={pol.id}
                    onClick={() => setSelectedPoliticianId(pol.id)}
                    className="bg-slate-900/80 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between group shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={pol.imageUrl} alt={pol.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700" />
                      <div>
                        <span className="font-extrabold text-sm text-white group-hover:text-blue-400">{pol.name}</span>
                        <div className="text-[10px] text-slate-400">{pol.party}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-white">{formatPoints(pol.currentPrice)}</div>
                      <div className="font-mono text-xs font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>{formatPercent(pol.change24h)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Holdings Table */}
            <HoldingsTable />
          </div>
        )}

        {activeTab === 'market' && <MarketBoard />}

        {activeTab === 'board' && <BoardMain />}

        {activeTab === 'leaderboard' && <Leaderboard />}

      </main>

      {/* Modular Stock Trading Modal */}
      <StockDetailModal />

      {/* Reporter Verification SignUp Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />

      {/* Footer & Disclaimer */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-bold text-slate-400">POLITRADE © 2026 Politrade Inc. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span>본 플랫폼은 현직 언론사 기자 전용 매월 초 정기 지원금 기반의 엔터테인먼트/모의투자 지표 서비스입니다.</span>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Landing Gate Router v5.0 • AMM Engine
          </div>
        </div>
      </footer>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
};

export default App;
