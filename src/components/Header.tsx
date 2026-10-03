import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PressBadge } from '../features/auth/components/PressBadge';
import { PolitradeLogo } from '../shared/ui/PolitradeLogo';
import { formatPoints } from '../core/utils/formatters';
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Shield, 
  ChevronDown, 
  TrendingUp, 
  MessageSquare, 
  Trophy, 
  Menu, 
  X 
} from 'lucide-react';

interface HeaderProps {
  onShowLanding?: () => void;
  onGoToDashboard?: () => void;
  onOpenUserProfile?: () => void;
  onOpenSignUpModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onShowLanding,
  onGoToDashboard,
  onOpenUserProfile,
  onOpenSignUpModal
}) => {
  const { user, activeTab, setActiveTab, setIsSignUpModalOpen } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      setActiveTab('dashboard');
    }
  };

  const navItems = [
    { id: 'dashboard', label: '마이 대시보드', icon: LayoutDashboard },
    { id: 'market', label: 'POLI 주식 매매', icon: TrendingUp },
    { id: 'board', label: '토론 게시판', icon: MessageSquare },
    { id: 'leaderboard', label: '기자 리더보드', icon: Trophy },
  ] as const;

  const handleNavClick = (tabId: 'dashboard' | 'market' | 'board' | 'leaderboard') => {
    if (tabId === 'dashboard' && onGoToDashboard) {
      onGoToDashboard();
    } else {
      setActiveTab(tabId);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Left: Logo & Brand */}
          <div className="flex items-center space-x-6">
            <PolitradeLogo size="md" onClick={handleLogoClick} />
          </div>

          {/* 3. Right Header Profile Badge & Integrated Hamburger Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3" ref={menuRef}>

            {/* User Profile Badge Chip */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 cursor-pointer transition-all shadow-md group text-left hover:border-blue-500/50"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-blue-300 font-sans">
                {user.name || '사용자'}
              </span>
            </button>

            {/* Hamburger Icon Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-all border shadow-md flex items-center justify-center ${
                isMenuOpen
                  ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700/80'
              }`}
              title="상단 통합 메뉴"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Unified Hamburger Menu Dropdown Panel */}
            {isMenuOpen && (
              <div className="absolute right-4 top-16 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-2.5 space-y-2">
                
                {/* User Overview Header */}
                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{user.name} 기자</span>
                    <PressBadge mediaName={user.pressName || 'KBS'} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">보유 자산</span>
                    <span className="font-bold text-amber-400">{formatPoints(user.balance)}</span>
                  </div>
                </div>

                {/* Section 1: Navigation Menu Links */}
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 font-mono">
                    주요 메뉴 이동
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'text-slate-200 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Section 2: Account & System Links */}
                <div className="border-t border-slate-800/80 pt-1.5 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 font-mono">
                    사용자 및 계정 설정
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenUserProfile) onOpenUserProfile();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-all text-left"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>사용자 정보 관리 (내 프로필)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenSignUpModal) onOpenSignUpModal();
                      else setIsSignUpModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-all text-left"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>언론사 소속 인증 / 변경</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onGoToDashboard) onGoToDashboard();
                      else setActiveTab('dashboard');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-all text-left"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>마이 대시보드 홈으로 이동</span>
                  </button>

                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onShowLanding) onShowLanding();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>로그아웃 (랜딩페이지로 이동)</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
