import React from 'react';
import { Newspaper } from 'lucide-react';

interface PressBadgeProps {
  mediaName?: string;
  className?: string;
}

export const PressBadge: React.FC<PressBadgeProps> = ({ mediaName = '언론사 기자', className = '' }) => {
  return (
    <span className={`inline-flex items-center space-x-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-300 border border-blue-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm ${className}`}>
      <Newspaper className="w-3 h-3 text-blue-400 shrink-0" />
      <span>📰 {mediaName} 기자 인증</span>
    </span>
  );
};
