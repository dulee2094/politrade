import React from 'react';
import { PortfolioSummaryCard } from './PortfolioSummaryCard';
import { HoldingsTable } from '../../../components/HoldingsTable';
import { MyHoldingsNewsFeed } from './MyHoldingsNewsFeed';
import { ArrowLeft, Wallet } from 'lucide-react';

interface FullPortfolioDetailProps {
  onBackToHome?: () => void;
}

export const FullPortfolioDetail: React.FC<FullPortfolioDetailProps> = ({ onBackToHome }) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shadow-lg">
        <div className="flex items-center space-x-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span>마이 자산 & 보유 주식 상세 대시보드</span>
            </h2>
            <p className="text-xs text-slate-400">내 포트폴리오 잔고, 실시간 손익 평가, 보유 의원 맞춤 뉴스</p>
          </div>
        </div>
      </div>

      {/* 1. Full Portfolio Summary Card */}
      <PortfolioSummaryCard />

      {/* 2. Holdings Table */}
      <HoldingsTable />

      {/* 3. Personalized News & Discussion Feed */}
      <MyHoldingsNewsFeed />

    </div>
  );
};
