import React, { useState } from 'react';
import { PricePoint } from '../../../types';
import { formatPoints } from '../../../core/utils/formatters';

interface TradingChartProps {
  data: PricePoint[];
  isUp: boolean;
  high24h: number;
  low24h: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({ data, isUp, high24h, low24h }) => {
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  const rawPoints = Array.isArray(data) && data.length > 0 ? data : [];
  const validPoints = rawPoints.filter(p => p && typeof p.price === 'number' && !isNaN(p.price));

  const points = validPoints.length > 0 ? validPoints : [
    { time: '09:00', price: 10000, volume: 100 },
    { time: '11:00', price: 10000, volume: 100 },
    { time: '13:00', price: 10000, volume: 100 },
    { time: '15:00', price: 10000, volume: 100 },
    { time: '17:00', price: 10000, volume: 100 },
  ];

  const prices = points.map(p => p.price);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;
  const priceRange = (maxPrice - minPrice) || 1;

  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  // Calculate SVG Coordinates for Chart Points
  const coordinates = points.map((pt, idx) => {
    const x = paddingX + (idx / Math.max(1, points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((pt.price - minPrice) / priceRange) * (height - paddingY * 2);
    return { x, y, pt };
  });

  // Construct SVG Path String
  const linePath = coordinates.reduce((acc, coord, idx) => {
    return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
  }, '');

  const firstCoord = coordinates[0] || { x: paddingX, y: height - paddingY };
  const lastCoord = coordinates[coordinates.length - 1] || { x: width - paddingX, y: height - paddingY };
  const areaPath = `${linePath} L ${lastCoord.x} ${height - paddingY} L ${firstCoord.x} ${height - paddingY} Z`;

  const strokeColor = isUp ? '#10b981' : '#f43f5e';
  const fillColorStart = isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)';

  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-3 shadow-lg">
      
      {/* Header Info Bar */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-200 font-sans">실시간 주가 추이 (P)</span>
          {hoveredPoint && (
            <span className="bg-slate-900 border border-slate-700 text-amber-400 px-2 py-0.5 rounded text-[11px]">
              {hoveredPoint.time} : {formatPoints(hoveredPoint.price)}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400">
          24H 최고: <strong className="text-emerald-400">{formatPoints(high24h)}</strong> | 최저: <strong className="text-rose-400">{formatPoints(low24h)}</strong>
        </span>
      </div>

      {/* Pure Crash-Proof SVG Chart Area */}
      <div className="relative w-full h-48 bg-slate-900/90 rounded-xl border border-slate-800 p-2 overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

          {/* Area Fill Under Curve */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Price Curve Line */}
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {coordinates.map((coord, idx) => (
            <g key={idx}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={hoveredPoint === coord.pt ? 6 : 4}
                fill={strokeColor}
                stroke="#0f172a"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(coord.pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* X Axis Time Labels */}
              <text
                x={coord.x}
                y={height - 4}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {coord.pt.time}
              </text>
            </g>
          ))}
        </svg>
      </div>

    </div>
  );
};
