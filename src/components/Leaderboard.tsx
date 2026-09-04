import React from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_LEADERBOARD } from '../data/mockCommunity';
import { VirtualUsersTestWidget } from '../features/simulation/components/VirtualUsersTestWidget';
import { PressBadge } from '../features/auth/components/PressBadge';
import { Award, Trophy, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { formatPoints, formatPercent } from '../core/utils/formatters';

export const Leaderboard: React.FC = () => {
  const { user, politicians } = useStore();

  // Compute current user's ROI
  let holdingsValue = 0;
  Object.values(user.holdings || {}).forEach(holding => {
    const pol = politicians.find(p => p.id === holding.politicianId);
    if (pol && holding.shares > 0) {
      holdingsValue += pol.currentPrice * holding.shares;
    }
  });

  const totalAsset = user.balance + holdingsValue;
  const netPnL = totalAsset - user.initialBalance;
  const userReturnRate = user.initialBalance > 0 ? (netPnL / user.initialBalance) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl space-y-2 relative overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">시즌 1 모의투자 수익률 랭킹전</h2>
            <p className="text-xs text-indigo-200">정치인 주식 트레이딩 최상위 랭커들의 투자 포트폴리오 성과 및 가상 10인 점검</p>
          </div>
        </div>
      </div>

      {/* Virtual 10 Users Simulation Test Center */}
      <VirtualUsersTestWidget />

      {/* Current User Rank Card */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-blue-500/40 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-base">{user.name}</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-md font-mono border border-blue-500/30">
                내 순위: 4위
              </span>
            </div>
            <p className="text-xs text-slate-400">총 자산: {formatPoints(totalAsset)}</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400">수익률 (ROI)</span>
          <div className={`text-base font-extrabold ${userReturnRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercent(userReturnRate)}
          </div>
        </div>
      </div>

      {/* Leaderboard Roster Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>TOP 랭커 포트폴리오 명예의 전당</span>
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {INITIAL_LEADERBOARD.map((item, idx) => (
            <div key={item.rank} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                  idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white font-sans">{item.name}</span>
                    <PressBadge mediaName={item.pressName} />
                  </div>
                  <div className="text-[10px] text-slate-400">자산: {formatPoints(item.totalAsset)}</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className={`font-extrabold ${item.returnRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercent(item.returnRate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
