import React from 'react';

interface PolitradeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const PolitradeLogo: React.FC<PolitradeLogoProps> = ({ size = 'md', onClick }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className="inline-flex items-center space-x-2.5 cursor-pointer group select-none"
    >
      {/* 3D Dual-Tone Neon Icon Symbol (Parliament Columns + Soaring Pulse Trendline) */}
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        {/* Glow Ring Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Outer Icon Container */}
        <div className="relative w-full h-full bg-slate-900 rounded-xl border border-blue-400/40 p-1.5 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="logoGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Parliament Columns (Vertical Bars) */}
            <rect x="4" y="16" width="3.5" height="11" rx="1.5" fill="url(#logoGrad2)" opacity="0.6" />
            <rect x="10" y="12" width="3.5" height="15" rx="1.5" fill="url(#logoGrad2)" opacity="0.8" />
            <rect x="16" y="8" width="3.5" height="19" rx="1.5" fill="url(#logoGrad1)" />

            {/* Soaring Trend Line & Arrow Peak */}
            <path
              d="M3 21L10 14L16 17L27 6"
              stroke="url(#logoGrad1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 6H27V13"
              stroke="url(#logoGrad1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Bi-Color Wordmark & Pulse Micro-Badge */}
      <div className="flex items-center space-x-1.5 font-black tracking-tight font-sans">
        <div className={`${textSizes[size]} flex items-center leading-none`}>
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-amber-200 transition-colors">
            POLI
          </span>
          <span className="text-white font-extrabold tracking-normal">
            TRADE
          </span>
        </div>

        {/* Pulse Badge */}
        <span className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/40 text-blue-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-inner tracking-widest hidden sm:inline-block">
          PULSE
        </span>
      </div>
    </div>
  );
};
