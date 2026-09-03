import React from 'react';
import { Newspaper, ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
}

interface NewsFeedListProps {
  news: NewsItem[];
}

export const NewsFeedList: React.FC<NewsFeedListProps> = ({ news }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-blue-400" />
        <span>관련 핫뉴스 및 이슈</span>
      </h3>
      <div className="space-y-2">
        {news.map((item) => (
          <div key={item.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between hover:bg-slate-800 transition-colors">
            <div>
              <h4 className="text-xs font-semibold text-slate-100 hover:text-blue-400 cursor-pointer">{item.title}</h4>
              <span className="text-[10px] text-slate-400">{item.source} • {item.time}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
