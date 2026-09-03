import React from 'react';
import { PricePoint } from '../../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPoints } from '../../../core/utils/formatters';

interface TradingChartProps {
  data: PricePoint[];
  isUp: boolean;
  high24h: number;
  low24h: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({ data, isUp, high24h, low24h }) => {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-bold text-slate-200">실시간 주가 추이 (P)</span>
        <span className="font-mono text-[11px]">24H 최고: {formatPoints(high24h)} | 최저: {formatPoints(low24h)}</span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} orientation="right" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              formatter={(val: any) => [`${Number(val).toLocaleString()} P`, '주가']}
            />
            <Area type="monotone" dataKey="price" stroke={isUp ? '#10b981' : '#f43f5e'} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
