import React from 'react';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { usePulseVoting } from '../../pulse/hooks/usePulseVoting';
import { useStore } from '../../../context/StoreContext';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  Sparkles,
  Layers,
  Zap,
  ShoppingBag,
  Vote,
  Heart,
  Gift,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';

interface HeroAssetSpotlightProps {
  onOpenAssetDetail?: () => void;
  onOpenPulseActivityDetail?: () => void;
  onOpenTradeDetail?: () => void;
  onOpenVoteModal?: () => void;
  onGoToMarket?: () => void;
}

export const HeroAssetSpotlight: React.FC<HeroAssetSpotlightProps> = ({ 
  onOpenAssetDetail,
  onOpenPulseActivityDetail,
  onOpenTradeDetail,
  onOpenVoteModal,
  onGoToMarket
}) => {
  const { totalAsset, holdingsValue, netPnL, returnRate, isPositive, user } = usePortfolioStats();
  const { politicians, setSelectedPoliticianId } = useStore();
  const { hasVotedToday, votes, BEST_REVIEW_REWARD } = usePulseVoting();

  const holdings = user?.holdings || {};

  // User's best review likes count
  const myReviews = votes.filter(v => v.userName === user?.name || v.userId === (user?.verifiedEmail || user?.name));
  const myTotalLikes = myReviews.reduce((sum, r) => sum + (r.likes || 0), 0);

  // Active Holdings List
  const activeHoldingsList = Object.values(holdings)
    .filter((h): h is NonNullable<typeof h> => Boolean(h && h.shares > 0))
    .map(h => {
      const pol = politicians.find(p => p.id === h.politicianId);
      const curPrice = pol?.currentPrice || h.avgPrice;
      const curVal = curPrice * h.shares;
      const pnl = curVal - h.totalInvested;
      const rate = h.totalInvested > 0 ? (pnl / h.totalInvested) * 100 : 0;
      return {
        ...h,
        pol,
        curVal,
        pnl,
        rate,
      };
    })
    .sort((a, b) => b.curVal - a.curVal);

  const holdingsCount = activeHoldingsList.length;

  // Top gainer politician for quick buy recommendation when holdings = 0
  const topGainer = [...politicians].sort((a, b) => b.change24h - a.change24h)[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/50 via-slate-900 to-indigo-950/70 p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 space-y-5">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white tracking-wide">마이 자산 대시보드 (Overview)</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> MY PORTFOLIO
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">핵심 요약 현황 3종 & 퀵 실행 서비스</p>
          </div>
        </div>

        {/* Detailed View Link */}
        {onOpenAssetDetail && (
          <button
            type="button"
            onClick={onOpenAssetDetail}
            className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1 shrink-0"
          >
            <span>자산 상세 현황 보기</span>
            <ChevronRight className="w-4 h-4 text-emerald-300" />
          </button>
        )}
      </div>

      {/* ================================================================ */}
      {/* 3대 핵심 카드로만 구성된 대시보드 (3-Column Grid) */}
      {/* ================================================================ */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ============================================================ */}
        {/* CARD 1: 💰 총 평가 자산 (Net Worth Card) (4/12) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-3xl border border-emerald-500/40 space-y-4 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Wallet className="w-4 h-4 text-emerald-400" />
                총 평가 자산 (Net Worth)
              </span>
              {onOpenAssetDetail && (
                <button
                  type="button"
                  onClick={onOpenAssetDetail}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5"
                >
                  <span>초기 30만P 대비</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="text-3xl font-black text-white font-mono tracking-tight pt-1">
              {formatPoints(totalAsset)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-sans">평가 손익 / 수익률</span>
              <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPositive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{formatPercent(returnRate)}</span>
              </div>
            </div>
            <div className={`text-2xl font-extrabold text-right ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{formatPoints(netPnL)}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARD 2: 📈 보유 종목 요약 (Holdings Summary Card) (4/12) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-3xl border border-cyan-500/40 space-y-4 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>보유 종목 요약</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  {holdingsCount}종목
                </span>
              </span>

              {onOpenTradeDetail && (
                <button
                  type="button"
                  onClick={onOpenTradeDetail}
                  className="text-[10px] text-cyan-400 hover:text-white font-sans font-bold flex items-center gap-0.5"
                >
                  <span>거래 상세 보기</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {holdingsCount > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {activeHoldingsList.slice(0, 3).map((item) => (
                  <div
                    key={item.politicianId}
                    onClick={() => setSelectedPoliticianId(item.politicianId)}
                    className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center space-x-2.5">
                      {item.pol && (
                        <PoliticianAvatar
                          src={item.pol.imageUrl}
                          name={item.pol.name}
                          party={item.pol.party}
                          className="w-8 h-8 rounded-lg"
                        />
                      )}
                      <div>
                        <span className="font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                          {item.pol?.name || '종목'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">{item.shares}주 보유</div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-extrabold text-white text-[11px]">{formatPoints(item.curVal)}</div>
                      <div className={`text-[10px] font-bold ${item.rate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.rate >= 0 ? '+' : ''}{formatPercent(item.rate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty holdings recommendation card */
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>현재 보유 주식 없음</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  POLI주식을 매수하고 주간 배당금 혜택을 누려보세요!
                </p>
              </div>
            )}
          </div>

          {/* Quick Action Button: Go to Stock Trading Market */}
          {onGoToMarket && (
            <button
              type="button"
              onClick={onGoToMarket}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>📈 주식 매매하러 가기</span>
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* CARD 3: 🗳️ 민심 펄스 참여 현황 (Pulse Activity Card) (4/12) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-3xl border border-amber-500/40 space-y-4 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-amber-400" />
                <span>민심 펄스 참여 현황</span>
              </span>

              {onOpenPulseActivityDetail && (
                <button
                  type="button"
                  onClick={onOpenPulseActivityDetail}
                  className="text-[10px] text-amber-300 hover:text-white font-sans font-bold flex items-center gap-0.5"
                >
                  <span>펄스활동 상세</span>
                  <ChevronRight className="w-3 h-3 text-amber-300" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* Daily Vote Status Badge */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans block">오늘의 펄스 투표</span>
                {hasVotedToday ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>완료 (+1,000P)</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>참여 대기 (+1천P)</span>
                  </span>
                )}
              </div>

              {/* Review Likes Badge */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans block">한줄평 누적 공감</span>
                <span className="text-sm font-extrabold text-rose-400 block">
                  {myTotalLikes}개 수령
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-indigo-500/30 flex items-center justify-between text-[11px] font-sans">
              <span className="text-slate-400 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                베스트 한줄평 시상 포상
              </span>
              <span className="font-bold text-indigo-300 font-mono">+100,000P</span>
            </div>
          </div>

          {/* Quick Action Button: Vote & Write Review */}
          {onOpenVoteModal && (
            <button
              type="button"
              onClick={onOpenVoteModal}
              className="w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5"
            >
              <Vote className="w-4 h-4 text-amber-300" />
              <span>{hasVotedToday ? '오늘 투표 완료 (수정하기)' : '🗳️ 오늘의 펄스 투표하기 (+1,000P)'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
