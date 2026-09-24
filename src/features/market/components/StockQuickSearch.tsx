import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import { PoliticianAvatar } from '../../../shared/ui/PoliticianAvatar';
import { PartyBadge } from '../../../shared/ui/PartyBadge';
import { formatPoints, formatPercent } from '../../../core/utils/formatters';
import { Search, ChevronDown, Layers, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface StockQuickSearchProps {
  placeholder?: string;
  variant?: 'header' | 'inline';
}

export const StockQuickSearch: React.FC<StockQuickSearchProps> = ({
  placeholder = '종목 검색 (이름/정당/지역구)...',
  variant = 'header',
}) => {
  const { politicians, setSelectedPoliticianId } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = politicians.filter(p => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.party.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q)
    );
  });

  const handleSelectPolitician = (id: string) => {
    setSelectedPoliticianId(id);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      
      {/* Search Input Trigger */}
      <div
        className={`flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 transition-all shadow-inner focus-within:border-blue-500 ${
          variant === 'header' ? 'w-48 sm:w-64' : 'w-full'
        }`}
      >
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white p-0.5"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl space-y-1 p-2">
          <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800">
            <span className="flex items-center gap-1 font-bold text-white font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>전체 POLI주식 목록 ({filtered.length})</span>
            </span>
            <span className="text-[10px] text-blue-400">클릭 시 호가창 이동</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-sans">
                검색 결과가 없습니다.
              </div>
            ) : (
              filtered.map((pol) => {
                const isUp = pol.change24h >= 0;
                const isIPO = pol.phase === 'IPO';

                return (
                  <div
                    key={pol.id}
                    onClick={() => handleSelectPolitician(pol.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <PoliticianAvatar
                        src={pol.imageUrl}
                        name={pol.name}
                        party={pol.party}
                        className="w-8 h-8 rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                            {pol.name}
                          </span>
                          <PartyBadge party={pol.party} />
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{pol.district}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0 pl-2">
                      <div className="font-bold text-xs text-white">
                        {formatPoints(pol.currentPrice)}
                      </div>
                      <div className={`text-[10px] flex items-center justify-end ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                        <span>{formatPercent(pol.change24h)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
