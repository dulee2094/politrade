import React from 'react';
import { useStore } from '../context/StoreContext';
import { PressBadge } from '../features/auth/components/PressBadge';
import { MarketStatusBadge } from '../shared/ui/MarketStatusBadge';
import { PolitradeLogo } from '../shared/ui/PolitradeLogo';
import { formatPoints } from '../core/utils/formatters';

interface HeaderProps {
  onShowLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowLanding }) => {
  const { user, setActiveTab, setIsSignUpModalOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <PolitradeLogo size="md" onClick={() => setActiveTab('dashboard')} />
          </div>

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
