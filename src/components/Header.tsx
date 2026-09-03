import React from 'react';
import { useStore } from '../context/StoreContext';
import { TrendingUp, Wallet, Award, BarChart2, MessageSquare, Newspaper, Home } from 'lucide-react';
import { PressBadge } from '../features/auth/components/PressBadge';
import { MarketStatusBadge } from '../shared/ui/MarketStatusBadge';
import { PolitradeLogo } from '../shared/ui/PolitradeLogo';
import { formatPoints } from '../core/utils/formatters';

interface HeaderProps {
  onShowLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowLanding }) => {
  const { user, activeTab, setActiveTab, setIsSignUpModalOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <PolitradeLogo size="md" onClick={() => setActiveTab('dashboard')} />
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            {onShowLanding && (
              <button
                onClick={onShowLanding}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <Home className="w-4 h-4 text-blue-400" />
                <span>소개 페이지</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>메인 포털 (홈)</span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'market'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>마이 자산 상세보기</span>
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'board'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>민심 광장 (게시판)</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>랭킹</span>
            </button>
          </nav>

          {/* Right Header Status Bar */}
          <div className="flex items-center space-x-3">
            <MarketStatusBadge />

            {/* Reporter Profile Badge */}
            <div
              onClick={() => setIsSignUpModalOpen(true)}
              className="hidden sm:flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 cursor-pointer transition-all shadow-md group"
            >
              <PressBadge mediaName={user.pressName || 'KBS'} />
              <span className="text-xs font-extrabold text-white group-hover:text-blue-300 font-sans">
                {user.name}
              </span>
              <span className="text-xs font-black font-mono text-amber-400 border-l border-slate-700 pl-2">
                {formatPoints(user.balance)}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
