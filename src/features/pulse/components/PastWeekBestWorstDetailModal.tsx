import React from 'react';
import { usePulseVoting } from '../hooks/usePulseVoting';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { X, Award, Sparkles, CheckCircle2, Wallet, ShieldCheck } from 'lucide-react';
import { formatPoints } from '../../../core/utils/formatters';

interface PastWeekBestWorstDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PastWeekBestWorstDetailModal: React.FC<PastWeekBestWorstDetailModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    weeklySummary,
    userSettlement,
    hasSettledThisWeek,
    executeWeeklySettlement,
  } = usePulseVoting();

  const [settlementFeedback, setSettlementFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleClaimSettlement = () => {
    setSettlementFeedback(null);
    const res = executeWeeklySettlement();
    if (res.success) {
      setSettlementFeedback({ type: 'success', message: res.message });
    } else {
      setSettlementFeedback({ type: 'error', message: res.message });
    }
  };

  // Mock past week closed top 3 list
  const pastBest3 = [
    { politicianId: 'POL03', politicianName: '우원식', party: '무소속', voteCount: 142, imageUrl: '/images/politicians/POL03.jpg' },
    { politicianId: 'POL01', politicianName: '이준석', party: '개혁신당', voteCount: 118, imageUrl: '/images/politicians/POL01.jpg' },
    { politicianId: 'POL04', politicianName: '박주민', party: '더불어민주당', voteCount: 95, imageUrl: '/images/politicians/POL04.png' },
  ];

  const pastWorst3 = [
    { politicianId: 'POL02', politicianName: '안철수', party: '국민의힘', voteCount: 130, imageUrl: '/images/politicians/POL02.png' },
    { politicianId: 'POL05', politicianName: '한동훈', party: '무소속', voteCount: 105, imageUrl: '/images/politicians/POL05.png' },
    { politicianId: 'POL07', politicianName: '윤석열', party: '무소속', voteCount: 88, imageUrl: '/images/politicians/POL07.png' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto p-6 space-y-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-indigo-500/30 pb-4 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-xl font-black text-white">🔒 지난 주 최종 BEST / WORST 확정 리포트</h2>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-mono font-bold">
                  CLOSED WEEKLY REPORT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                마감된 지난주 최종 선정결과 및 내 보유주식 주간 배당금(+1,000P/주) / 감액(-1,000P/주) 정산
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          
          {/* Dual Grid: Past Best 3 vs Past Worst 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* PAST BEST 3 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  🏆 지난 주 최종 확정 BEST 3 의원
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  +1,000 P / 주 배당 확정
                </span>
              </div>

              <div className="space-y-2">
                {pastBest3.map((pol, idx) => (
                  <div key={'pb_' + pol.politicianId} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-md text-xs font-black font-mono flex items-center justify-center ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-9 h-9 rounded-lg" />
                      <div>
                        <span className="font-extrabold text-white">{pol.politicianName}</span>
                        <div className="text-[10px] text-slate-400">{pol.party}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400 text-sm">{pol.voteCount}표</div>
                      <div className="text-[10px] text-emerald-300 font-mono">+1,000P/주</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAST WORST 3 */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  ⚠️ 지난 주 최종 확정 WORST 3 의원
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  -1,000 P / 주 감액 확정
                </span>
              </div>

              <div className="space-y-2">
                {pastWorst3.map((pol, idx) => (
                  <div key={'pw_' + pol.politicianId} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-md text-xs font-black font-mono bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <PoliticianAvatar src={pol.imageUrl} name={pol.politicianName} party={pol.party as any} className="w-9 h-9 rounded-lg" />
                      <div>
                        <span className="font-extrabold text-white">{pol.politicianName}</span>
                        <div className="text-[10px] text-slate-400">{pol.party}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-rose-400 text-sm">{pol.voteCount}표</div>
                      <div className="text-[10px] text-rose-300 font-mono">-1,000P/주</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Personal Settlement Calculator Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/40 space-y-4 font-mono shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>내 주식 주간 배당금 및 손실 정산 내역</span>
                    {hasSettledThisWeek && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        정산 완료
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400">내가 보유한 주식 중 지난주 확정 Best/Worst 3 지정 의원 주식 수량 기반 실제 정산</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClaimSettlement}
                disabled={hasSettledThisWeek}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center space-x-1.5 shrink-0 ${
                  hasSettledThisWeek
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{hasSettledThisWeek ? '이번 주 정산 완료' : '주간 배당금 정산 받기'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Best 배당금 확정액</span>
                <span className="font-extrabold text-emerald-400 text-sm">+{formatPoints(userSettlement.totalDividend)}</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Worst 손실 감액 확정액</span>
                <span className="font-extrabold text-rose-400 text-sm">-{formatPoints(userSettlement.totalPenalty)}</span>
              </div>

              <div className="bg-indigo-950/50 p-3 rounded-xl border border-indigo-500/40 flex items-center justify-between">
                <span className="text-slate-300 font-sans font-bold">최종 순 정산액</span>
                <span className={`font-black text-base ${userSettlement.netAmount >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  {userSettlement.netAmount >= 0 ? '+' : ''}{formatPoints(userSettlement.netAmount)}
                </span>
              </div>
            </div>

            {settlementFeedback && (
              <div className={`p-3 rounded-xl border text-xs font-bold font-sans flex items-center space-x-2 ${
                settlementFeedback.type === 'error'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{settlementFeedback.message}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all border border-slate-700"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
