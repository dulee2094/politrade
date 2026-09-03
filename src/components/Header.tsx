import React from 'react';
import { useStore } from '../context/StoreContext';
import { TrendingUp, Wallet, Award, BarChart2, MessageSquare, Newspaper, Home } from 'lucide-react';
import { PressBadge } from '../features/auth/components/PressBadge';
import { MarketStatusBadge } from '../shared/ui/MarketStatusBadge';
import { formatPoints } from '../core/utils/formatters';

interface HeaderProps {
  onShowLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowLanding }) => {
  const { user, activeTab, setActiveTab, setIsSignUpModalOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">POLITRADE</span>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-500/30">REPORTER 10</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">정치인 POLI주식 & 실시간 민심 펄스</p>
            </div>
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
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>포트폴리오</span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'market'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>정치인 전광판</span>
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'board'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>민심 광장 (게시판)</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>수익률 랭킹</span>
            </button>
          </nav>

          {/* User Money, Market Status & Press Verification */}
          <div className="flex items-center space-x-3">
            
            {/* Live Trading Market Status Badge */}
            <div className="hidden lg:block">
              <MarketStatusBadge />
            </div>

            {/* Balance Badge */}
            <div className="flex items-center bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 space-x-2">
              <span className="text-xs text-slate-400 font-medium">가상머니</span>
              <span className="font-bold text-amber-400 text-sm font-mono">
                {formatPoints(user.balance)}
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-mono hidden sm:inline" title="매월 1일 자동 정기 지원금 지급">
                매월 지원
              </span>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-2 pl-1 cursor-pointer" onClick={() => setIsSignUpModalOpen(true)}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-blue-500/50 object-cover"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-300">{user.name}</span>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 justify-around items-center">
          {onShowLanding && (
            <button
              onClick={onShowLanding}
              className="flex flex-col items-center space-y-1 text-xs text-slate-400"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>소개</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center space-y-1 text-xs ${
              activeTab === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>대시보드</span>
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex flex-col items-center space-y-1 text-xs ${
              activeTab === 'market' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>전광판</span>
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`flex flex-col items-center space-y-1 text-xs ${
              activeTab === 'board' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>게시판</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center space-y-1 text-xs ${
              activeTab === 'leaderboard' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>랭킹</span>
          </button>
        </div>

      </div>
    </header>
  );
};
