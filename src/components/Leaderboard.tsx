import React from 'react';
import { useStore } from '../context/StoreContext';
import { INITIAL_LEADERBOARD } from '../data/mockCommunity';
import { Award, Trophy, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { user, politicians } = useStore();

  // Compute current user's ROI
  let holdingsValue = 0;
  Object.values(user.holdings).forEach(holding => {
    const pol = politicians.find(p => p.id === holding.politicianId);
    if (pol && holding.shares > 0) {
      holdingsValue += pol.currentPrice * holding.shares;
    }
  });

  const totalAsset = user.balance + holdingsValue;
  const netPnL = totalAsset - user.initialBalance;
  const userReturnRate = user.initialBalance > 0 ? (netPnL / user.initialBalance) * 100 : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl space-y-2 relative overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">시즌 1 모의투자 수익률 랭킹전</h2>
            <p className="text-xs text-indigo-200">정치인 주식 트레이딩 최상위 랭커들의 투자 포트폴리오 성과</p>
          </div>
        </div>
      </div>

      {/* Current User Rank Card */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-blue-500/40 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center font-bold text-blue-400 text-sm font-mono">
            MY
          </div>
          <div className="flex items-center space-x-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-sm">{user.name} (나)</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">
                  참여중
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">총 자산: {Math.round(totalAsset).toLocaleString()} P</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400">내 수익률</span>
          <div className={`font-mono font-extrabold text-base flex items-center justify-end gap-1 ${
            userReturnRate >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{userReturnRate >= 0 ? '+' : ''}{userReturnRate.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700/60 font-bold text-sm text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>TOP 5 랭커 명예의 전당</span>
        </div>

        <div className="divide-y divide-slate-700/40">
          {INITIAL_LEADERBOARD.map((item) => (
            <div key={item.rank} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center space-x-4">
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black font-mono text-sm ${
                  item.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' :
                  item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  item.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {item.rank}
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-sm">{item.name}</span>
                      <span className="text-[10px] bg-slate-700 text-amber-300 px-2 py-0.5 rounded-full border border-slate-600 font-medium">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">총 평가자산: {item.totalAsset.toLocaleString()} P</span>
                  </div>
                </div>
              </div>

              {/* ROI */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400">누적 수익률</span>
                <div className="font-mono font-extrabold text-emerald-400 text-base">
                  +{item.returnRate.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
