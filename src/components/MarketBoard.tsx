import React from 'react';
import { useStore } from '../context/StoreContext';
import { useMarketFilter } from '../features/market/hooks/useMarketFilter';
import { PoliticianCard } from '../features/market/components/PoliticianCard';
import { Search, BarChart2 } from 'lucide-react';
import { BRAND_STOCK_NAME } from '../config/constants';

export const MarketBoard: React.FC = () => {
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
    { label: '전체 (10인)', value: 'ALL' },
    { label: '국민의힘', value: '국민의힘' },
    { label: '더불어민주당', value: '더불어민주당' },
    { label: '조국혁신당', value: '조국혁신당' },
    { label: '개혁신당', value: '개혁신당' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            <span>{BRAND_STOCK_NAME} 실시간 전광판</span>
            <span className="text-xs text-slate-400 font-normal">시범 10인 라인업</span>
          </h2>
          <p className="text-xs text-slate-400">AMM 기반 실시간 수급 및 민심 주가 모니터링</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="이름/지역구 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Party Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            {parties.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedParty(p.value)}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  selectedParty === p.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setSortBy('change')}
              className={`px-2 py-1 rounded-lg ${sortBy === 'change' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              상승률순
            </button>
            <button
              onClick={() => setSortBy('volume')}
              className={`px-2 py-1 rounded-lg ${sortBy === 'volume' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              거래량순
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-2 py-1 rounded-lg ${sortBy === 'price' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              주가순
            </button>
          </div>
        </div>
      </div>

      {/* Grid View of 10 Politicians */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredPoliticians.map((pol) => (
          <PoliticianCard
            key={pol.id}
            politician={pol}
            onSelect={(id) => setSelectedPoliticianId(id)}
          />
        ))}
      </div>

    </div>
  );
};
