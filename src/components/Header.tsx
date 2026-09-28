import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PressBadge } from '../features/auth/components/PressBadge';
import { MarketStatusBadge } from '../shared/ui/MarketStatusBadge';
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Left: Logo & Brand */}
          <div className="flex items-center space-x-6">
            <PolitradeLogo size="md" onClick={handleLogoClick} />

            {/* 2. Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 3. Right Header Status Bar, Direct Quick Actions & User Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden lg:block">
              <MarketStatusBadge />
            </div>

            {/* Direct Quick Logout Button (Desktop) */}
            <button
              type="button"
              onClick={() => {
                if (onShowLanding) onShowLanding();
              }}
              title="로그아웃"
              className="hidden xl:flex items-center space-x-1.5 bg-slate-800/60 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 px-2.5 py-1.5 rounded-xl border border-slate-700/60 transition-all text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>

            {/* Reporter Profile Badge & Dropdown Trigger (Visible on all screens) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700/80 cursor-pointer transition-all shadow-md group text-left"
              >
                <PressBadge mediaName={user.pressName || 'KBS'} />
                <span className="hidden sm:inline text-xs font-extrabold text-white group-hover:text-blue-300 font-sans">
                  {user.name}
                </span>
                <span className="text-xs font-black font-mono text-amber-400 border-l border-slate-700 pl-2">
                  {formatPoints(user.balance)}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
                  {/* User Overview Header */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{user.name} 기자</span>
                      <PressBadge mediaName={user.pressName || 'KBS'} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">보유 자산</span>
                      <span className="font-bold text-amber-400">{formatPoints(user.balance)}</span>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
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
                      setIsUserMenuOpen(false);
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
                      setIsUserMenuOpen(false);
                      if (onGoToDashboard) onGoToDashboard();
                      else setActiveTab('dashboard');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-all text-left"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>마이 대시보드 홈으로 이동</span>
                  </button>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onShowLanding) onShowLanding();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>로그아웃 (랜딩페이지)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <MarketStatusBadge />
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenUserProfile) onOpenUserProfile();
                }}
                className="flex items-center space-x-1.5 text-xs text-blue-400 hover:underline font-bold"
              >
                <User className="w-3.5 h-3.5" />
                <span>내 프로필 관리</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onShowLanding) onShowLanding();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃 (랜딩페이지로 이동)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
