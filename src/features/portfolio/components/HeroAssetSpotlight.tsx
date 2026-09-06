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
  PieChart, 
  Sparkles,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Vote,
  Heart,
  Calendar,
  Gift,
  Coins,
  MessageSquare,
  ArrowRight
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
  const { hasVotedToday, votes, DAILY_VOTE_REWARD, BEST_REVIEW_REWARD } = usePulseVoting();

  const holdings = user?.holdings || {};
  const userBalance = user?.balance || 0;
  const tradeHistory = user?.tradeHistory || [];
  const tradeCount = tradeHistory.length;

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

  // Asset Allocation Percentages
  const cashPct = totalAsset > 0 ? Math.round((userBalance / totalAsset) * 100) : 100;
  const stockPct = totalAsset > 0 ? 100 - cashPct : 0;

  // Investment strategy badge
  let traderBadgeText = '안정형 현금 100%';
  let traderBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (stockPct >= 60) {
    traderBadgeText = '공격형 주식 우위';
    traderBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  } else if (stockPct > 0) {
    traderBadgeText = '균형형 포트폴리오';
    traderBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  }

  // 3-Month Asset Trend Data
  const assetHistory3M = [
    { month: '6월', asset: 300000, label: '초기지원금' },
    { month: '7월', asset: 350000, label: '+16%' },
    { month: '8월 (현재)', asset: totalAsset, label: formatPercent(returnRate) },
  ];

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
            <p className="text-xs text-slate-300 mt-0.5">실시간 가상 평가 자산, 민심 펄스 현황 및 주식 보유 통합 리포트</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border font-mono ${traderBadgeColor}`}>
            {traderBadgeText}
          </span>

          {/* Quick Action Button: Go to Market */}
          {onGoToMarket && (
            <button
              type="button"
              onClick={onGoToMarket}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1 border border-indigo-400/30"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>📈 주식 매매하러 가기</span>
            </button>
          )}

          {/* Detailed View Link */}
          {onOpenAssetDetail && (
            <button
              type="button"
              onClick={onOpenAssetDetail}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1 shrink-0"
            >
              <span>자산 상세 현황 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Row 1: 3-Column Responsive Grid Dashboard */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Panel 1: Net Worth & ROI KPI (4/12) */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/30 space-y-4 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>총 평가 자산 (Net Worth)</span>
              <button
                type="button"
                onClick={onOpenAssetDetail}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5"
              >
                <span>초기 30만P 대비</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="text-3xl font-black text-white font-mono tracking-tight pt-1">
              {formatPoints(totalAsset)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans">평가 손익 / 수익률</span>
              <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                isPositive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{formatPercent(returnRate)}</span>
              </div>
            </div>
            <div className={`text-xl font-extrabold font-mono text-right ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{formatPoints(netPnL)}
            </div>
          </div>
        </div>

        {/* Panel 2: Asset Allocation & Activity Metrics (4/12) */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/30 space-y-4 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-1.5 font-sans">
                <PieChart className="w-4 h-4 text-indigo-400" />
                자산 구성 비중
              </span>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-amber-400 font-bold">현금 {cashPct}%</span>
                <span className="text-cyan-300 font-bold">주식 {stockPct}%</span>
              </div>
            </div>

            {/* Custom Multi-Color Visual Bar */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-l-full transition-all duration-500"
                  style={{ width: `${cashPct}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-r-full transition-all duration-500"
                  style={{ width: `${stockPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>현금 {formatPoints(userBalance)}</span>
                <span>주식 {formatPoints(holdingsValue)}</span>
              </div>
            </div>
          </div>

          {/* Activity Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono pt-1">
            <div 
              onClick={onOpenTradeDetail}
              className="bg-slate-950/80 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-400" />
                누적 매매 거래
              </span>
              <span className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition-colors pt-1 flex items-center justify-between">
                <span>{tradeCount}회 체결</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </span>
            </div>

            <div 
              onClick={onOpenAssetDetail}
              className="bg-slate-950/80 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                정기 지원금
              </span>
              <span className="text-[11px] font-bold text-emerald-300 group-hover:text-white transition-colors pt-1 font-sans flex items-center justify-between">
                <span>매월 5만P</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Holdings Quick Preview or Quick Buy Recommendation (4/12) */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
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
            <div className="bg-gradient-to-br from-indigo-950/80 to-slate-950 p-3.5 rounded-xl border border-indigo-500/40 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>첫 POLI주식 매수로 포트폴리오 완성하기</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  보유 현금으로 국회의원 인기도 주식을 매수하고 주간 배당금 혜택을 누리세요!
                </p>
              </div>

              {topGainer && (
                <div 
                  onClick={() => setSelectedPoliticianId(topGainer.id)}
                  className="bg-slate-900/90 hover:bg-slate-850 p-2.5 rounded-lg border border-slate-700/80 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center space-x-2">
                    <PoliticianAvatar src={topGainer.imageUrl} name={topGainer.name} party={topGainer.party} className="w-7 h-7 rounded-md" />
                    <div>
                      <span className="font-bold text-white group-hover:text-amber-300 transition-colors">{topGainer.name}</span>
                      <span className="text-[9px] text-emerald-400 font-mono ml-1.5">+{formatPercent(topGainer.change24h)}</span>
                    </div>
                  </div>

                  <span className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md transition-all flex items-center gap-0.5">
                    <ShoppingBag className="w-3 h-3" /> 매수하기
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Row 2: 2-Column Grid (Left: Pulse Activity Overview / Right: 3-Month Asset Trend & Income Breakdown) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        
        {/* Left Sub-Panel: 🗳️ 민심 펄스 참여 & 한줄평 현황 개요 (6/12) */}
        <div className="lg:col-span-6 bg-slate-900/90 p-4.5 rounded-2xl border border-amber-500/40 space-y-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <Vote className="w-4 h-4 text-amber-400" />
              <span>🗳️ 민심 펄스 참여 & 한줄평 활동 현황</span>
            </h4>

              <button
                type="button"
                onClick={onOpenPulseActivityDetail}
                className="text-[10px] text-amber-300 hover:text-white font-sans font-bold bg-amber-950/70 hover:bg-amber-900 px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-0.5 transition-all"
              >
                <span>펄스활동 상세</span>
                <ChevronRight className="w-3 h-3 text-amber-300" />
              </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            {/* Daily Vote Status & Quick Action Button */}
            <div 
              onClick={onOpenVoteModal}
              className="bg-slate-950/80 hover:bg-slate-850 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-400 font-sans flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Vote className="w-3 h-3 text-amber-400" />
                  오늘의 펄스 투표
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
              </span>
              <div className="pt-0.5">
                {hasVotedToday ? (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 block font-sans text-center">
                    ✅ 완료 (+1,000P)
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 block font-sans text-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    🗳️ 펄스 투표하기 (+1,000P)
                  </span>
                )}
              </div>
            </div>

            {/* Review Likes Stats */}
            <div 
              onClick={onOpenPulseActivityDetail}
              className="bg-slate-950/80 hover:bg-slate-850 p-3 rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-400 font-sans flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  한줄평 누적 공감
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-rose-400" />
              </span>
              <div className="text-sm font-extrabold text-rose-400 group-hover:text-rose-300 transition-colors pt-0.5">
                {myTotalLikes}개 공감 수령
              </div>
            </div>

            {/* Best Review Reward Status */}
            <div 
              onClick={onOpenPulseActivityDetail}
              className="bg-slate-950/80 hover:bg-slate-850 p-3 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-400 font-sans flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Gift className="w-3 h-3 text-indigo-400" />
                  베스트 한줄평 시상
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-300" />
              </span>
              <div className="text-[11px] font-bold text-indigo-300 group-hover:text-white transition-colors pt-0.5 font-sans">
                +100,000P 월11시 지급
              </div>
            </div>
          </div>
        </div>

        {/* Right Sub-Panel: 📈 최근 3개월 자산 변화 & 5대 수입 내역 (6/12) */}
        <div className="lg:col-span-6 bg-slate-900/90 p-4.5 rounded-2xl border border-cyan-500/40 space-y-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span>📈 최근 3개월 자산 변화 & 5대 수입원</span>
            </h4>

              <button
                type="button"
                onClick={onOpenAssetDetail}
                className="text-[10px] text-cyan-300 hover:text-white font-sans font-bold bg-cyan-950/70 hover:bg-cyan-900 px-2.5 py-1 rounded-md border border-cyan-500/30 flex items-center gap-0.5 transition-all"
              >
                <span>자산 통계 상세</span>
                <ChevronRight className="w-3 h-3 text-cyan-300" />
              </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Left 3M Sparkline (5/12) */}
            <div className="sm:col-span-5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5 font-mono">
              <span className="text-[10px] text-slate-400 font-sans block">3개월 자산 성과</span>
              <div className="flex items-center justify-between text-xs pt-1">
                {assetHistory3M.map(h => (
                  <div key={h.month} className="text-center">
                    <span className="text-[9px] text-slate-400 block">{h.month}</span>
                    <span className="font-bold text-white text-[11px]">{formatPoints(h.asset)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Income Category Chips (7/12) */}
            <div className="sm:col-span-7 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-sans block">주요 5대 수입 항목</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="bg-emerald-950/80 text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/30 font-sans">
                  💵 정기 지원금 (+5만P)
                </span>
                <span className="bg-amber-950/80 text-amber-300 px-2 py-1 rounded-md border border-amber-500/30 font-sans">
                  🗳️ 펄스 투표 (+1천P)
                </span>
                <span className="bg-indigo-950/80 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/30 font-sans">
                  🏆 주주 배당금 (+1천P/주)
                </span>
                <span className="bg-purple-950/80 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30 font-sans">
                  ✨ 한줄평 포상 (+10만P)
                </span>
                <span className="bg-blue-950/80 text-cyan-300 px-2 py-1 rounded-md border border-cyan-500/30 font-sans">
                  📈 매매 시세 차익
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
