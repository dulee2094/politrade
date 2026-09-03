import React from 'react';
import { DailyMarketBriefing } from '../../../core/trading/marketBriefing';
import { BarChart3, Zap, TrendingUp, Award, Clock, ArrowUpRight } from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface DailyMarketBriefingCardProps {
  briefing: DailyMarketBriefing;
}

export const DailyMarketBriefingCard: React.FC<DailyMarketBriefingCardProps> = ({ briefing }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 p-5 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-4">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <span>{briefing.title}</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                LIVE UPDATE
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">업데이트 시각: {briefing.timestamp}</p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          Phase 2 상장: <strong className="text-emerald-400">{briefing.phase2Count}</strong> / Phase 1 공모: <strong className="text-indigo-300">{briefing.ipoCount}</strong>
        </div>
      </div>

      {/* Latest Trade Highlight Banner */}
      <div className="bg-slate-900/90 p-3 rounded-xl border border-blue-500/30 flex items-center space-x-2 text-xs font-mono text-blue-200">
        <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span className="truncate">{briefing.latestTradeText}</span>
      </div>

      {/* Commentary */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        {briefing.commentary}
      </p>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 text-xs font-mono">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            금일 최고 상승
          </span>
          <span className="font-extrabold text-emerald-400">
            {briefing.topGainerName} ({formatPercent(briefing.topGainerChange)})
          </span>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            최고 거래량 종목
          </span>
          <span className="font-extrabold text-white">
            {briefing.topVolumeName} ({formatPoints(briefing.topVolumeAmount)})
          </span>
        </div>
      </div>

    </div>
  );
};
