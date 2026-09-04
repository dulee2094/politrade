import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { LandingMain } from './features/landing/components/LandingMain';
import { HeroAssetSpotlight } from './features/portfolio/components/HeroAssetSpotlight';
import { FullPortfolioDetail } from './features/portfolio/components/FullPortfolioDetail';
import { CompactMarketGrid } from './features/market/components/CompactMarketGrid';
import { DailyMarketBriefingCard } from './features/market/components/DailyMarketBriefingCard';
import { WeeklyPulseReportCard } from './features/pulse/components/WeeklyPulseReportCard';
import { MarketBoard } from './components/MarketBoard';
import { BoardMain } from './features/board/components/BoardMain';
import { PollWidget } from './features/board/components/PollWidget';
import { useBoardPosts } from './features/board/hooks/useBoardPosts';
import { Leaderboard } from './components/Leaderboard';
import { StockDetailModal } from './features/trading/components/StockDetailModal';
import { SignUpModal } from './features/auth/components/SignUpModal';
import { PressBadge } from './features/auth/components/PressBadge';
import { PoliticianAvatar } from './shared/ui/PoliticianAvatar';
import { NewsFeedList } from './features/news/components/NewsFeedList';
import { UserProfileDetailModal } from './features/auth/components/UserProfileDetailModal';
import { WeeklyPulseDetailModal } from './features/pulse/components/WeeklyPulseDetailModal';
import { DailyBestWorstVoteModal } from './features/pulse/components/DailyBestWorstVoteModal';
import { usePulseVoting } from './features/pulse/hooks/usePulseVoting';
import { ShieldAlert, Sparkles, TrendingUp, Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { formatPoints, formatPercent } from './core/utils/formatters';

interface DashboardHomeProps {
  onOpenUserProfile: () => void;
  onOpenWeeklyPulse: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onOpenUserProfile, onOpenWeeklyPulse }) => {
  const { 
    politicians, 
    briefing, 
    setSelectedPoliticianId, 
    setActiveTab, 
    user,
    setIsSignUpModalOpen,
    allowanceNotice,
    setAllowanceNotice
  } = useStore();
  const { poll, votePoll } = useBoardPosts();

  const topGainers = [...politicians].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  const sampleNews = politicians[0]?.news || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ================================================================ */}
      {/* 1. 알림 & 시스템 센터 (Notification & System Center) */}
      {/* ================================================================ */}
      <div className="space-y-3">
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

        <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-slate-900/80 p-4 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">신뢰 검증 회원 플랫폼</span>
                <PressBadge mediaName={user.pressName || 'KBS'} />
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                닉네임(<strong className="text-white">{user.name}</strong>)으로 매월 정기 지원금(10만P)으로 매매 및 민심 광장 토론에 참여하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={onOpenUserProfile}
              className="bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/40 transition-all font-sans font-bold text-xs"
            >
              인증 회원 상세 프로필 보기
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. ROW 1: 2-Column Grid (마이 자산 대시보드 + 주간 민심 펄스) */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <HeroAssetSpotlight onOpenDetail={() => setActiveTab('market')} />
        <WeeklyPulseReportCard onOpenDetail={onOpenWeeklyPulse} />
      </div>

      {/* ================================================================ */}
      {/* 3. ROW 2: 2-Column Grid (급상승 TOP3 & 시장 브리핑 + 민심 광장 투표) */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Col (7/12): Top 3 Gainers Spotlight + Daily Market Briefing */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>오늘의 인기도 급상승 TOP 3 종목</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topGainers.map((pol, idx) => (
                <div
                  key={pol.id}
                  onClick={() => setSelectedPoliticianId(pol.id)}
                  className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer space-y-2 group shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <PoliticianAvatar
                        src={pol.imageUrl}
                        name={pol.name}
                        party={pol.party}
                        className="w-9 h-9 rounded-xl"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">{pol.name}</span>
                        <div className="text-[10px] text-slate-400">{pol.party}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      idx === 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      TOP {idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono pt-2 border-t border-slate-700/50 text-xs">
                    <span className="font-extrabold text-white text-[11px]">{formatPoints(pol.currentPrice)}</span>
                    <div className="font-bold text-emerald-400 flex items-center gap-0.5 text-[11px]">
                      <TrendingUp className="w-3 h-3" />
                      <span>{formatPercent(pol.change24h)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DailyMarketBriefingCard briefing={briefing} />
        </div>

        {/* Right Col (5/12): Poll Widget */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <PollWidget poll={poll} onVote={votePoll} />
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. ROW 3: POLI주식 실시간 매매 현황 카드 (CompactMarketGrid) */}
      {/* ================================================================ */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Market Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>POLI주식 실시간 매매 현황</span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono">
                  LIVE TRADING BOARD
                </span>
              </h3>
              <p className="text-xs text-slate-400">실시간 10인 국회의원 호가 체결 및 인기도 수급 모니터링</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5 shrink-0"
          >
            <span>전광판 전체 보기 & 매매하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Politician Responsive Stock Grid */}
        <CompactMarketGrid />

      </div>

    </div>
  );
};

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab,
    user, 
    isSignUpModalOpen, 
    setIsSignUpModalOpen,
  } = useStore();

  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isWeeklyPulseModalOpen, setIsWeeklyPulseModalOpen] = useState(false);
  const [isDailyVoteModalOpen, setIsDailyVoteModalOpen] = useState(false);

  const { submitDailyVote, DAILY_VOTE_REWARD } = usePulseVoting();

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

        {/* Dynamic 4 Hero Sections Dashboard Home */}
        {activeTab === 'dashboard' && (
          <DashboardHome
            onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
            onOpenWeeklyPulse={() => setIsWeeklyPulseModalOpen(true)}
          />
        )}

        {/* My Dedicated Portfolio View */}
        {activeTab === 'market' && (
          <FullPortfolioDetail onBackToHome={() => setActiveTab('dashboard')} />
        )}

        {/* Community Board */}
        {activeTab === 'board' && <BoardMain />}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && <Leaderboard />}

      </main>

      {/* Modular Stock Trading Modal */}
      <StockDetailModal />

      {/* Reporter Verification SignUp Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />

      {/* Standalone User Profile Detail Modal */}
      <UserProfileDetailModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />

      {/* Standalone Weekly Pulse Detail Modal */}
      <WeeklyPulseDetailModal
        isOpen={isWeeklyPulseModalOpen}
        onClose={() => setIsWeeklyPulseModalOpen(false)}
        onOpenVoteModal={() => setIsDailyVoteModalOpen(true)}
      />

      {/* Standalone Daily Vote Modal */}
      <DailyBestWorstVoteModal
        isOpen={isDailyVoteModalOpen}
        onClose={() => setIsDailyVoteModalOpen(false)}
        onSubmitVote={submitDailyVote}
        rewardAmount={DAILY_VOTE_REWARD}
      />

      {/* Footer & Disclaimer */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-bold text-slate-400">POLITRADE © 2026 Politrade Inc. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span>본 플랫폼은 매월 초 정기 지원금 기반의 엔터테인먼트/모의투자 지표 서비스입니다.</span>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Dynamic 2-Column Grid v16.0 • OrderBook & Pulse Engine
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
