import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PressBadge } from '../features/auth/components/PressBadge';
import { MarketStatusBadge } from '../shared/ui/MarketStatusBadge';
import { PolitradeLogo } from '../shared/ui/PolitradeLogo';
import { formatPoints } from '../core/utils/formatters';
import { User, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';

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
  const { user, setActiveTab, setIsSignUpModalOpen } = useStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand (Navigates to Dashboard Home) */}
          <div className="flex items-center space-x-3">
            <PolitradeLogo size="md" onClick={handleLogoClick} />
          </div>

          {/* Right Header Status Bar & User Dropdown */}
          <div className="flex items-center space-x-3">
            <MarketStatusBadge />

            {/* Reporter Profile Badge & Dropdown Trigger */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hidden sm:flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 cursor-pointer transition-all shadow-md group text-left"
              >
                <PressBadge mediaName={user.pressName || 'KBS'} />
                <span className="text-xs font-extrabold text-white group-hover:text-blue-300 font-sans">
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
          </div>

        </div>
      </div>
    </header>
  );
};
