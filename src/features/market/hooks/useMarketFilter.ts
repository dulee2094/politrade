import { useState } from 'react';
import { Politician } from '../../../types';

export function useMarketFilter(politicians: Politician[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'change' | 'volume' | 'price' | 'name'>('change');

  const filteredPoliticians = politicians
    .filter(pol => {
      const matchParty = selectedParty === 'ALL' || pol.party === selectedParty;
      const matchSearch = 
        pol.name.includes(searchQuery) || 
        pol.district.includes(searchQuery) ||
        pol.title.includes(searchQuery);
      return matchParty && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'change') return b.change24h - a.change24h;
      if (sortBy === 'volume') return b.volume24h - a.volume24h;
      if (sortBy === 'price') return b.currentPrice - a.currentPrice;
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko');
      return 0;
    });

  return {
    searchQuery,
    setSearchQuery,
    selectedParty,
    setSelectedParty,
    sortBy,
    setSortBy,
    filteredPoliticians,
  };
}
