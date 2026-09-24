import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { LandingMain } from './features/landing/components/LandingMain';
import { HeroAssetSpotlight } from './features/portfolio/components/HeroAssetSpotlight';
import { FullPortfolioDetail } from './features/portfolio/components/FullPortfolioDetail';
import { MyAssetDetailView } from './features/portfolio/components/MyAssetDetailView';
import { MyPulseActivityDetailView } from './features/pulse/components/MyPulseActivityDetailView';
import { MyTradeHistoryDetailView } from './features/trading/components/MyTradeHistoryDetailView';
import { CompactMarketGrid } from './features/market/components/CompactMarketGrid';
import { MarketDashboardGroupCard } from './features/market/components/MarketDashboardGroupCard';
import { WeeklyPulseReportCard } from './features/pulse/components/WeeklyPulseReportCard';
import { BestOneLineReviewSpotlightCard } from './features/pulse/components/BestOneLineReviewSpotlightCard';
import { MarketBoard } from './components/MarketBoard';
import { BoardMain } from './features/board/components/BoardMain';
import { Leaderboard } from './components/Leaderboard';
import { StockDetailModal } from './features/trading/components/StockDetailModal';
import { SignUpModal } from './features/auth/components/SignUpModal';
import { PressBadge } from './features/auth/components/PressBadge';
import { PoliticianAvatar } from './shared/ui/PoliticianAvatar';
import { NewsFeedList } from './features/news/components/NewsFeedList';
import { UserProfileDetailModal } from './features/auth/components/UserProfileDetailModal';
import { WeeklyPulseDetailModal } from './features/pulse/components/WeeklyPulseDetailModal';
import { DailyBestWorstVoteModal } from './features/pulse/components/DailyBestWorstVoteModal';
import { WeeklyOneLineReviewsDetailView } from './features/pulse/components/WeeklyOneLineReviewsDetailView';
import { usePulseVoting } from './features/pulse/hooks/usePulseVoting';
import { ShieldAlert, Sparkles, TrendingUp, Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { formatPoints, formatPercent } from './core/utils/formatters';

interface DashboardHomeProps {
  onOpenUserProfile: () => void;
  onOpenWeeklyPulse: () => void;
  onOpenAssetDetail: () => void;
  onOpenPulseActivityDetail: () => void;
  onOpenTradeDetail: () => void;
  onOpenVoteModal: () => void;
  onOpenReviewsDetail: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  onOpenUserProfile, 
  onOpenWeeklyPulse,
  onOpenAssetDetail,
  onOpenPulseActivityDetail,
  onOpenTradeDetail,
  onOpenVoteModal,
  onOpenReviewsDetail
}) => {
  const { 
    politicians, 
    setSelectedPoliticianId, 
    setActiveTab, 
    user,
    allowanceNotice,
    setAllowanceNotice
  } = useStore();

  const topVolumeList = [...politicians].sort((a, b) => (b.volume24h || b.totalVolume || 0) - (a.volume24h || a.totalVolume || 0)).slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ================================================================ */}
      {/* 1. 알림 & 시스템 센터 (Notification & System Center) */}
      {/* ================================================================ */}
      <div className="space-y-3">
        {allowanceNotice && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-500/40 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
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

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
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
                닉네임(<strong className="text-white">{user.name}</strong>)으로 매월 정기 지원금(5만P)으로 매매 및 민심 광장 토론에 참여하세요.
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
      {/* 2. 내 보유자산 현황 카드 (My Asset Spotlight Overview) */}
      {/* ================================================================ */}
      <HeroAssetSpotlight 
        onOpenAssetDetail={onOpenAssetDetail}
        onOpenPulseActivityDetail={onOpenPulseActivityDetail}
        onOpenTradeDetail={onOpenTradeDetail}
        onOpenVoteModal={onOpenVoteModal}
        onGoToMarket={() => setActiveTab('market')}
      />

      {/* ================================================================ */}
      {/* 3. 2-COLUMN GRID: 주식 매매/시장 현황 (좌) vs 민심 펄스 현황 (우) */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (6/12): 주식 시장 TOP 3 종합 현황 (통합 거대 그룹 대시보드) */}
        <div className="lg:col-span-6 space-y-6">
          <MarketDashboardGroupCard
            politicians={politicians}
            topVolumeList={topVolumeList}
            onSelectPolitician={setSelectedPoliticianId}
          />
        </div>

        {/* Right Column (6/12): 민심 펄스 종합 현황 (Option A: 4단 통합 스마트 펄스 대시보드) */}
        <div className="lg:col-span-6 space-y-6">
          <WeeklyPulseReportCard 
            onOpenDetail={onOpenWeeklyPulse}
            onOpenReviewsDetail={onOpenReviewsDetail}
          />
        </div>

      </div>

      {/* ================================================================ */}
      {/* 4. POLI주식 실시간 매매 전광판 퀵 바로가기 배너 */}
      {/* ================================================================ */}
      <div id="compact-market-grid-section" className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950/60 p-6 sm:p-7 rounded-3xl border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600/30 text-blue-300 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/40 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> FULL MARKET BOARD
              </span>
              <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                전체 의원 매매 센터
              </span>
            </div>
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>국회의원 POLI주식 실시간 매매 전광판</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              의원 검색, 정당별 필터(국민의힘/더불어민주당 등), 상승률/거래량/주가순 정렬 및 호가창 매매를 전용 매매 센터에서 이용하실 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 shrink-0 group border border-blue-400/30 hover:scale-[1.02]"
          >
            <span>주식매매하러 가기</span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
};

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab,
    isSignUpModalOpen, 
    setIsSignUpModalOpen,
  } = useStore();

  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isWeeklyPulseModalOpen, setIsWeeklyPulseModalOpen] = useState(false);
  const [isDailyVoteModalOpen, setIsDailyVoteModalOpen] = useState(false);
  const [activeDetailView, setActiveDetailView] = useState<'asset' | 'pulse_activity' | 'trade_history' | 'reviews_detail' | null>(null);

  const { submitDailyVote, DAILY_VOTE_REWARD } = usePulseVoting();

  const handleTabChange = (tab: 'dashboard' | 'market' | 'board' | 'leaderboard') => {
    setActiveDetailView(null);
    setActiveTab(tab);
  };

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

        {/* Dashboard Active Tab & Separate Detail Views */}
        {activeTab === 'dashboard' && (
          <>
            {activeDetailView === 'asset' && (
              <MyAssetDetailView onBackToDashboard={() => setActiveDetailView(null)} />
            )}

            {activeDetailView === 'pulse_activity' && (
              <MyPulseActivityDetailView 
                onBackToDashboard={() => setActiveDetailView(null)} 
                onOpenVoteModal={() => setIsDailyVoteModalOpen(true)}
              />
            )}

            {activeDetailView === 'trade_history' && (
              <MyTradeHistoryDetailView onBackToDashboard={() => setActiveDetailView(null)} />
            )}

            {activeDetailView === 'reviews_detail' && (
              <WeeklyOneLineReviewsDetailView 
                onBackToDashboard={() => setActiveDetailView(null)} 
                onOpenVoteModal={() => setIsDailyVoteModalOpen(true)}
              />
            )}

            {activeDetailView === null && (
              <DashboardHome
                onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
                onOpenWeeklyPulse={() => setIsWeeklyPulseModalOpen(true)}
                onOpenAssetDetail={() => setActiveDetailView('asset')}
                onOpenPulseActivityDetail={() => setActiveDetailView('pulse_activity')}
                onOpenTradeDetail={() => setActiveDetailView('trade_history')}
                onOpenVoteModal={() => setIsDailyVoteModalOpen(true)}
                onOpenReviewsDetail={() => setActiveDetailView('reviews_detail')}
              />
            )}
          </>
        )}

        {/* Dedicated Market Trading View */}
        {activeTab === 'market' && (
          <MarketBoard onBackToHome={() => handleTabChange('dashboard')} />
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
            Clean Modular Views v21.0 • Standalone Detail Architecture
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
