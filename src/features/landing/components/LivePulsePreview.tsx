import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { formatPoints, formatPercent, formatVolume } from '../../../core/utils/formatters';
import { Crown, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface LivePulsePreviewProps {
  onEnterApp: () => void;
}

export const LivePulsePreview: React.FC<LivePulsePreviewProps> = ({ onEnterApp }) => {
  const { politicians, setSelectedPoliticianId } = useStore();

  // 시가총액 TOP 3 (현재가 * 발행량 추정치 내림차순)
  const top3 = [...politicians]
    .sort((a, b) => {
      const capA = a.currentPrice * (a.ipoTargetShares || 10) * 10000;
      const capB = b.currentPrice * (b.ipoTargetShares || 10) * 10000;
      return capB - capA;
    })
    .slice(0, 3);

  return (
    <div className="space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <span>시가총액 TOP 3 국회의원 펄스 (대장주 미리보기)</span>
          </h2>
          <p className="text-xs text-slate-400">AMM 수급 및 현재가 기준 실시간 시가총액 리더 3인</p>
        </div>

        <button
          onClick={onEnterApp}
          className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
        >
          <span>전체 10인 전광판 보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((pol, idx) => {
          const capValue = pol.currentPrice * (pol.ipoTargetShares || 10) * 10000;
          const isUp = pol.change24h >= 0;

          return (
            <div
              key={pol.id}
              onClick={() => {
                onEnterApp();
                setSelectedPoliticianId(pol.id);
              }}
              className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/80 hover:border-amber-400/50 transition-all cursor-pointer space-y-3 group relative overflow-hidden shadow-md hover:-translate-y-0.5"
            >
              {/* Top-Right Rank Badge Overlay */}
              <span
                className={`absolute top-2.5 right-2 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md shadow-sm z-10 ${
                  idx === 0
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-700/60'
                }`}
              >
                {idx === 0 ? '👑 1위' : `${idx + 1}위`}
              </span>

              <div className="flex items-center space-x-3 pr-8">
                <img src={pol.imageUrl} alt={pol.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <PartyBadge party={pol.party} />
                  </div>
                  <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                    {pol.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">{pol.title}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sm font-extrabold text-white">{formatPoints(pol.currentPrice)}</span>
                  <div className={`flex items-center space-x-1 font-bold text-xs ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{formatPercent(pol.change24h)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-[10px] text-slate-400 font-sans">추정 시가총액</span>
                  <span className="font-bold text-amber-400">{formatVolume(capValue)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
