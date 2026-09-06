import React from 'react';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { useStore } from '../../../context/StoreContext';
import { PortfolioSummaryCard } from './PortfolioSummaryCard';
import { 
  ArrowLeft, 
  Wallet, 
  PieChart, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  DollarSign,
  Gift,
  Vote
} from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface MyAssetDetailViewProps {
  onBackToDashboard: () => void;
}

export const MyAssetDetailView: React.FC<MyAssetDetailViewProps> = ({ onBackToDashboard }) => {
  const { totalAsset, holdingsValue, netPnL, returnRate, isPositive, user } = usePortfolioStats();
  const userBalance = user?.balance || 0;

  const cashPct = totalAsset > 0 ? Math.round((userBalance / totalAsset) * 100) : 100;
  const stockPct = totalAsset > 0 ? 100 - cashPct : 0;

  // 3-Month Asset Trend Data
  const assetHistory3M = [
    { month: '6월', asset: 300000, label: '초기지원금 (30만P)', date: '2026-06-01' },
    { month: '7월', asset: 350000, label: '정기지원금 수령 (+16%)', date: '2026-07-01' },
    { month: '8월 (현재)', asset: totalAsset, label: `실시간 평가자산 (${formatPercent(returnRate)})`, date: '2026-08-01' },
  ];

  // Point allowance history mock log
  const allowanceLogs = [
    { id: 'al_3', date: '2026-08-01', title: '8월 정기 매매 지원금 자동 입금', amount: 50000, type: 'ALLOWANCE' },
    { id: 'al_2', date: '2026-07-01', title: '7월 정기 매매 지원금 자동 입금', amount: 50000, type: 'ALLOWANCE' },
    { id: 'al_1', date: '2026-06-01', title: '최초 가입 기자 인증 축하 포인트', amount: 300000, type: 'INITIAL' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/40 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">마이 자산 상세 현황 리포트</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold">
                ASSET DETAIL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">가상 평가 자산 구성, 3개월 성과 트렌드, 5대 수입원 및 정기 지원금 이력</p>
          </div>
        </div>

        {/* Top-Right Unified Back Button */}
        <button
          type="button"
          onClick={onBackToDashboard}
          className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-600 hover:border-emerald-400 shadow-md transition-all flex items-center space-x-1.5 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>대시보드로 돌아가기</span>
        </button>
      </div>

      {/* 1. Summary Card */}
      <PortfolioSummaryCard />

      {/* 2. Asset Allocation & 3-Month Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Asset Portfolio Allocation Analysis (6/12) */}
        <div className="lg:col-span-6 bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span>자산 포트폴리오 비중 분석</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">현금 {cashPct}% : 주식 {stockPct}%</span>
          </div>

          <div className="space-y-4 font-mono">
            {/* Visual Bar */}
            <div className="space-y-1.5">
              <div className="h-5 w-full bg-slate-950 rounded-full overflow-hidden flex p-1 border border-slate-700 shadow-inner">
                <div
                  className="h-full bg-amber-500 rounded-l-full transition-all duration-500"
                  style={{ width: `${cashPct}%` }}
                />
                <div
                  className="h-full bg-indigo-600 rounded-r-full transition-all duration-500"
                  style={{ width: `${stockPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-500/30 space-y-1">
                <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  보유 가상 현금 잔액
                </span>
                <div className="text-xl font-extrabold text-amber-400">
                  {formatPoints(userBalance)}
                </div>
                <p className="text-[11px] text-slate-500 font-sans">즉시 주식 매수 가능 포인트</p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-cyan-500/30 space-y-1">
                <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  주식 실시간 평가액
                </span>
                <div className="text-xl font-extrabold text-cyan-300">
                  {formatPoints(holdingsValue)}
                </div>
                <p className="text-[11px] text-slate-500 font-sans">보유 의원 주식 가치 평가</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3-Month Performance Trend (6/12) */}
        <div className="lg:col-span-6 bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>최근 3개월 자산 성장 추이</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">{formatPercent(returnRate)}</span>
          </div>

          <div className="space-y-3 font-mono">
            {assetHistory3M.map((item) => (
              <div key={item.month} className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-xs">{item.month}</span>
                    <span className="text-[11px] text-slate-400">({item.date})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">{item.label}</span>
                </div>
                <span className="font-black text-sm text-emerald-400">{formatPoints(item.asset)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Income Breakdown Category Chips Section */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-cyan-500/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>💰 Politrade 5대 수입원 구조 (Income Breakdown)</span>
          </h3>
          <span className="text-xs font-mono text-cyan-300">포인트 획득 방식 안내</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1">
            <span className="text-emerald-300 font-extrabold block">💵 정기 지원금</span>
            <span className="text-white font-mono font-bold block text-sm">+50,000 P</span>
            <span className="text-[10px] text-slate-400 block">매월 1일 자동 지급</span>
          </div>

          <div className="bg-amber-950/60 p-3.5 rounded-2xl border border-amber-500/30 space-y-1">
            <span className="text-amber-300 font-extrabold block">🗳️ 펄스 투표</span>
            <span className="text-white font-mono font-bold block text-sm">+1,000 P</span>
            <span className="text-[10px] text-slate-400 block">매일 1회 투표 즉시 적립</span>
          </div>

          <div className="bg-indigo-950/60 p-3.5 rounded-2xl border border-indigo-500/30 space-y-1">
            <span className="text-indigo-300 font-extrabold block">🏆 주주 배당금</span>
            <span className="text-white font-mono font-bold block text-sm">+1,000 P / 주</span>
            <span className="text-[10px] text-slate-400 block">월11시 Best3 주주 지급</span>
          </div>

          <div className="bg-purple-950/60 p-3.5 rounded-2xl border border-purple-500/30 space-y-1">
            <span className="text-purple-300 font-extrabold block">✨ 한줄평 포상</span>
            <span className="text-white font-mono font-bold block text-sm">+100,000 P</span>
            <span className="text-[10px] text-slate-400 block">월11시 최다공감 1등 시상</span>
          </div>

          <div className="bg-blue-950/60 p-3.5 rounded-2xl border border-blue-500/30 space-y-1">
            <span className="text-cyan-300 font-extrabold block">📈 매매 차익</span>
            <span className="text-white font-mono font-bold block text-sm">실시간 변동</span>
            <span className="text-[10px] text-slate-400 block">주가 매수/매도 시세 차익</span>
          </div>
        </div>
      </div>

      {/* 4. Monthly Allowance Log List */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>📅 정기 매매 지원금 & 가입 포인트 수령 이력</span>
          </h3>
          <span className="text-xs font-sans text-slate-400">매월 1일 5만P 자동 입금</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {allowanceLogs.map((log) => (
            <div key={log.id} className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-sans">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white font-sans text-xs block">{log.title}</span>
                  <span className="text-[10px] text-slate-400">{log.date} • 시스템 자동 지급</span>
                </div>
              </div>
              <span className="font-black text-sm text-emerald-400">+{formatPoints(log.amount)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
