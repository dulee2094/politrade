import React from 'react';
import { useStore } from '../context/StoreContext';
import { useMarketFilter } from '../features/market/hooks/useMarketFilter';
import { PoliticianCard } from '../features/market/components/PoliticianCard';
import { Search, BarChart2, ArrowLeft, TrendingUp, Sparkles, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../config/constants';

interface MarketBoardProps {
  onBackToHome?: () => void;
}

export const MarketBoard: React.FC<MarketBoardProps> = ({ onBackToHome }) => {
  const { politicians, setSelectedPoliticianId } = useStore();
  const {
    searchQuery,
    setSearchQuery,
    selectedParty,
    setSelectedParty,
    sortBy,
    setSortBy,
    filteredPoliticians,
  } = useMarketFilter(politicians);

  const parties = [
    { label: '전체', value: 'ALL' },
    { label: '국민의힘', value: '국민의힘' },
    { label: '더불어민주당', value: '더불어민주당' },
    { label: '조국혁신당', value: '조국혁신당' },
    { label: '개혁신당', value: '개혁신당' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Page Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-blue-500/40 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-inner">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white">{BRAND_STOCK_NAME} 실시간 매매 시장</h2>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono font-bold">
                TRADING CENTER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AMM 수급 지표 기반 실시간 매매 • 정당별 필터 및 호가창 매매 모달 지원 (향후 300+ 의원 확장)
            </p>
          </div>
        </div>

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-700 hover:border-blue-400 shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>대시보드로 돌아가기</span>
          </button>
        )}
      </div>

      {/* 2. Control Toolbar (Search, Party Filters, Sorting) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
        
        {/* Left: Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="의원 이름 또는 지역구 검색 (예: 안철수, 서울 은평구)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs bg-slate-800 px-1.5 py-0.5 rounded"
            >
              초기화
            </button>
          )}
        </div>

        {/* Right: Party Filters & Sort Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Party Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            {parties.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedParty(p.value)}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold whitespace-nowrap ${
                  selectedParty === p.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSortBy('change')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-bold ${
                sortBy === 'change' ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              상승률순
            </button>
            <button
              onClick={() => setSortBy('volume')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-bold ${
                sortBy === 'volume' ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              거래량순
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-bold ${
                sortBy === 'price' ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              주가순
            </button>
          </div>

        </div>
      </div>

      {/* 3. Results Counter Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span>검색 종목: <strong className="text-white font-bold">{filteredPoliticians.length}개</strong> / 전체 {politicians.length}개</span>
        </div>
        <div className="text-[11px] text-slate-500">
          카드 클릭 시 호가창 매매 모달이 즉시 열립니다
        </div>
      </div>

      {/* 4. Grid View of Politicians */}
      {filteredPoliticians.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredPoliticians.map((pol) => (
            <PoliticianCard
              key={pol.id}
              politician={pol}
              onSelect={(id) => setSelectedPoliticianId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-sm font-bold text-slate-300">검색 조건에 맞는 POLI주식이 없습니다.</p>
          <p className="text-xs text-slate-500">검색어나 정당 필터를 변경해 보세요.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedParty('ALL'); }}
            className="text-xs text-blue-400 hover:underline font-bold"
          >
            전체 목록 보기
          </button>
        </div>
      )}

    </div>
  );
};
