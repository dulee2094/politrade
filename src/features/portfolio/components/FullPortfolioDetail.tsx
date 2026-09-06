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
      <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-blue-500/40 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">마이 자산 & 보유 주식 상세 대시보드</h2>
            <p className="text-xs text-slate-400 mt-0.5">내 포트폴리오 잔고, 실시간 손익 평가, 보유 의원 맞춤 뉴스</p>
          </div>
        </div>

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-600 hover:border-blue-400 shadow-md transition-all flex items-center space-x-1.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>대시보드로 돌아가기</span>
          </button>
        )}
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
