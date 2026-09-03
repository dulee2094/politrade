import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { Newspaper, Tag, ArrowUpRight, MessageSquare } from 'lucide-react';
import { PartyBadge } from '../../../shared/ui/PartyBadge';

export const MyHoldingsNewsFeed: React.FC = () => {
  const { user, politicians, setSelectedPoliticianId } = useStore();

  const holdingsMap = user?.holdings || {};

  const holdingsList = Object.values(holdingsMap)
    .filter(h => h && h.shares > 0)
    .map(h => politicians.find(p => p.id === h.politicianId))
    .filter(Boolean);

  if (holdingsList.length === 0) {
    return (
      <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-800 text-center text-slate-500 text-xs">
        보유 중인 정치인이 없습니다. 주식을 매수하면 맞춤 뉴스와 이슈 피드가 표출됩니다.
      </div>
    );
  }

  // Combine news from all owned politicians
  const allHoldingsNews = holdingsList.flatMap(pol => {
    if (!pol || !pol.news) return [];
    return pol.news.map(n => ({
      ...n,
      politicianId: pol.id,
      politicianName: pol.name,
      party: pol.party,
    }));
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span>내 보유 종목 맞춤 이슈 피드 ({holdingsList.length}개 종목)</span>
        </h3>
        <span className="text-xs text-slate-400">보유 국회의원 관련 뉴스 집계</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allHoldingsNews.map((item, idx) => (
          <div
            key={item.id + idx}
            onClick={() => setSelectedPoliticianId(item.politicianId)}
            className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/60 hover:border-blue-500/40 transition-all cursor-pointer space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">
                  {item.politicianName}
                </span>
                <PartyBadge party={item.party} />
              </div>
              <span className="text-[10px] text-slate-500">{item.time}</span>
            </div>

            <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-blue-300">
              {item.title}
            </h4>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/40">
              <span>{item.source}</span>
              <span className="text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-sans">
                관련 주식 매매 <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
